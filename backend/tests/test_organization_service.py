"""Tests for organization_service.py helper functions and operations."""
import pytest
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.services.organization_service import (
    _slugify,
    _ensure_unique_slug,
    _normalize_subscription_tier,
    _coerce_metadata,
    upsert_from_clerk,
    deactivate_organization,
)
from app.core.subscription import SubscriptionTier
from app.models.organization import Organization


class TestSlugify:
    """Test _slugify helper function."""

    def test_slugify_normalizes_text(self):
        """Test _slugify converts text to lowercase and replaces spaces."""
        assert _slugify("My Organization") == "my-organization"

    def test_slugify_handles_special_characters(self):
        """Test _slugify removes special characters."""
        assert _slugify("Org & Co. (Ltd)") == "org-co-ltd"

    def test_slugify_handles_empty_string(self):
        """Test _slugify generates UUID for empty string."""
        result = _slugify("")
        assert result.startswith("org-")
        assert len(result) == 12  # "org-" + 8 hex chars

    def test_slugify_handles_only_special_characters(self):
        """Test _slugify generates UUID when only special characters."""
        result = _slugify("!!!")
        assert result.startswith("org-")
        assert len(result) == 12

    def test_slugify_trims_hyphens(self):
        """Test _slugify trims leading/trailing hyphens."""
        assert _slugify("-test-") == "test"
        # When only special chars, generates UUID
        result = _slugify("---")
        assert result.startswith("org-")
        assert len(result) == 12


class TestEnsureUniqueSlug:
    """Test _ensure_unique_slug helper function."""

    def test_ensure_unique_slug_returns_original_when_unique(self, db_session):
        """Test _ensure_unique_slug returns original slug when unique."""
        result = _ensure_unique_slug(db_session, "unique-slug")
        assert result == "unique-slug"

    def test_ensure_unique_slug_appends_suffix_when_conflict(self, db_session, create_organization):
        """Test _ensure_unique_slug appends suffix when slug exists."""
        org = create_organization(name="Test Org")
        # Manually set slug since fixture doesn't accept it
        org.slug = "test-org"
        db_session.commit()
        result = _ensure_unique_slug(db_session, "test-org")
        assert result == "test-org-1"

    def test_ensure_unique_slug_increments_suffix(self, db_session, create_organization):
        """Test _ensure_unique_slug increments suffix correctly."""
        org1 = create_organization(name="Org 1")
        org1.slug = "test-org"
        org2 = create_organization(name="Org 2")
        org2.slug = "test-org-1"
        db_session.commit()
        result = _ensure_unique_slug(db_session, "test-org")
        assert result == "test-org-2"

    def test_ensure_unique_slug_excludes_id(self, db_session, create_organization):
        """Test _ensure_unique_slug excludes specified ID from check."""
        org = create_organization(name="Test Org")
        org.slug = "test-org"
        db_session.commit()
        # Should return original since we exclude this org's ID
        result = _ensure_unique_slug(db_session, "test-org", exclude_id=str(org.id))
        assert result == "test-org"

    def test_ensure_unique_slug_handles_multiple_conflicts(self, db_session, create_organization):
        """Test _ensure_unique_slug handles multiple existing slugs."""
        org1 = create_organization(name="Org 1")
        org1.slug = "test-org"
        org2 = create_organization(name="Org 2")
        org2.slug = "test-org-1"
        org3 = create_organization(name="Org 3")
        org3.slug = "test-org-2"
        db_session.commit()
        result = _ensure_unique_slug(db_session, "test-org")
        assert result == "test-org-3"


class TestNormalizeSubscriptionTier:
    """Test _normalize_subscription_tier helper function."""

    def test_normalize_subscription_tier_returns_enum_value(self):
        """Test _normalize_subscription_tier returns enum value."""
        assert _normalize_subscription_tier(SubscriptionTier.STARTER) == "starter"

    def test_normalize_subscription_tier_handles_valid_string(self):
        """Test _normalize_subscription_tier handles valid tier string."""
        assert _normalize_subscription_tier("professional") == "professional"
        assert _normalize_subscription_tier("ENTERPRISE") == "enterprise"
        assert _normalize_subscription_tier("  premium  ") == "premium"

    def test_normalize_subscription_tier_defaults_to_starter_invalid(self):
        """Test _normalize_subscription_tier defaults to starter for invalid."""
        assert _normalize_subscription_tier("invalid") == "starter"
        assert _normalize_subscription_tier(None) == "starter"
        assert _normalize_subscription_tier(123) == "starter"
        assert _normalize_subscription_tier({}) == "starter"


class TestCoerceMetadata:
    """Test _coerce_metadata helper function."""

    def test_coerce_metadata_extracts_all_fields(self):
        """Test _coerce_metadata extracts name, slug, and tier."""
        data = {
            "name": "Test Org",
            "slug": "test-org",
            "public_metadata": {"subscription_tier": "professional"},
        }
        name, slug, tier = _coerce_metadata(data)
        assert name == "Test Org"
        assert slug == "test-org"
        assert tier == "professional"

    def test_coerce_metadata_uses_fallback_name(self):
        """Test _coerce_metadata uses fallback when name missing."""
        data = {"slug": "test-org", "public_metadata": {}}
        name, slug, tier = _coerce_metadata(data)
        assert name == "Untitled Organization"
        assert slug == "test-org"
        assert tier == "starter"

    def test_coerce_metadata_generates_slug_when_missing(self):
        """Test _coerce_metadata generates slug when missing."""
        data = {"name": "My Org", "public_metadata": {}}
        name, slug, tier = _coerce_metadata(data)
        assert name == "My Org"
        assert slug == "my-org"
        assert tier == "starter"

    def test_coerce_metadata_handles_missing_public_metadata(self):
        """Test _coerce_metadata handles missing public_metadata."""
        data = {"name": "Test Org", "slug": "test-org"}
        name, slug, tier = _coerce_metadata(data)
        assert name == "Test Org"
        assert slug == "test-org"
        assert tier == "starter"

    def test_coerce_metadata_handles_none_values(self):
        """Test _coerce_metadata handles None values."""
        data = {"name": None, "slug": None, "public_metadata": None}
        name, slug, tier = _coerce_metadata(data)
        assert name == "Untitled Organization"
        # When name is "Untitled Organization", slug is slugified from that
        assert slug == "untitled-organization"
        assert tier == "starter"


class TestUpsertFromClerk:
    """Test upsert_from_clerk function."""

    def test_upsert_from_clerk_raises_error_when_id_missing(self, db_session):
        """Test upsert_from_clerk raises ValueError when id missing."""
        with pytest.raises(ValueError, match="missing required 'id' field"):
            upsert_from_clerk(db_session, {})

    def test_upsert_from_clerk_creates_new_organization(self, db_session):
        """Test upsert_from_clerk creates new organization."""
        clerk_data = {
            "id": "org_123",
            "name": "New Org",
            "slug": "new-org",
            "public_metadata": {"subscription_tier": "starter"},
        }
        org = upsert_from_clerk(db_session, clerk_data)
        assert org.id == "org_123"
        assert org.name == "New Org"
        assert org.slug == "new-org"
        assert org.subscription_tier == "starter"
        assert org.is_active is True

    def test_upsert_from_clerk_updates_existing_organization(self, db_session, create_organization):
        """Test upsert_from_clerk updates existing organization."""
        # Create org with specific ID by using upsert_from_clerk first
        clerk_data_create = {"id": "org_123", "name": "Old Name"}
        existing_org = upsert_from_clerk(db_session, clerk_data_create)
        clerk_data = {
            "id": "org_123",
            "name": "Updated Name",
            "slug": "updated-slug",
            "public_metadata": {"subscription_tier": "professional"},
        }
        org = upsert_from_clerk(db_session, clerk_data)
        assert org.id == "org_123"
        assert org.name == "Updated Name"
        assert org.slug == "updated-slug"
        assert org.subscription_tier == "professional"
        assert org.is_active is True

    def test_upsert_from_clerk_updates_slug_when_changed(self, db_session):
        """Test upsert_from_clerk updates slug when changed."""
        # Create org first
        clerk_data_create = {"id": "org_123", "name": "Test Org", "slug": "old-slug"}
        existing_org = upsert_from_clerk(db_session, clerk_data_create)
        clerk_data = {
            "id": "org_123",
            "name": "Test Org",
            "slug": "new-slug",
            "public_metadata": {},
        }
        org = upsert_from_clerk(db_session, clerk_data)
        assert org.slug == "new-slug"

    def test_upsert_from_clerk_preserves_slug_when_unchanged(self, db_session):
        """Test upsert_from_clerk preserves slug when unchanged."""
        clerk_data_create = {"id": "org_123", "name": "Test Org", "slug": "test-org"}
        existing_org = upsert_from_clerk(db_session, clerk_data_create)
        clerk_data = {
            "id": "org_123",
            "name": "Test Org",
            "slug": "test-org",
            "public_metadata": {},
        }
        org = upsert_from_clerk(db_session, clerk_data)
        assert org.slug == "test-org"

    def test_upsert_from_clerk_ensures_unique_slug_on_conflict(self, db_session, create_organization):
        """Test upsert_from_clerk ensures unique slug when conflict."""
        other_org = create_organization(name="Other Org")
        other_org.slug = "test-org"
        db_session.commit()
        clerk_data = {
            "id": "org_123",
            "name": "Test Org",
            "slug": "test-org",
            "public_metadata": {},
        }
        org = upsert_from_clerk(db_session, clerk_data)
        assert org.slug == "test-org-1"

    def test_upsert_from_clerk_handles_minimal_data(self, db_session):
        """Test upsert_from_clerk handles minimal clerk data."""
        clerk_data = {"id": "org_123"}
        org = upsert_from_clerk(db_session, clerk_data)
        assert org.id == "org_123"
        assert org.name == "Untitled Organization"
        # When name is "Untitled Organization", slug is slugified from that
        assert org.slug == "untitled-organization"
        assert org.subscription_tier == "starter"


class TestDeactivateOrganization:
    """Test deactivate_organization function."""

    def test_deactivate_organization_sets_is_active_false(self, db_session, create_organization):
        """Test deactivate_organization sets is_active to False."""
        org = create_organization(name="Test Org")
        org_id = str(org.id)
        org.is_active = True
        db_session.commit()
        result = deactivate_organization(db_session, org_id)
        assert result is not None
        assert result.is_active is False

    def test_deactivate_organization_returns_none_when_not_found(self, db_session):
        """Test deactivate_organization returns None when organization not found."""
        result = deactivate_organization(db_session, "nonexistent_org")
        assert result is None

    def test_deactivate_organization_refreshes_object(self, db_session, create_organization):
        """Test deactivate_organization refreshes organization object."""
        org = create_organization(name="Test Org")
        org_id = str(org.id)
        org.is_active = True
        db_session.commit()
        result = deactivate_organization(db_session, org_id)
        # Verify object is refreshed from database
        assert str(result.id) == org_id
        assert result.name == "Test Org"
        assert result.is_active is False
