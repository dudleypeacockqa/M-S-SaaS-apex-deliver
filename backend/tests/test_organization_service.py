import pytest

from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.services.organization_service import (
    deactivate_organization,
    upsert_from_clerk,
)


@pytest.mark.usefixtures("db_session")
class TestOrganizationService:
    def test_upsert_from_clerk_creates_with_defaults(self, db_session: Session) -> None:
        org = upsert_from_clerk(db_session, {"id": "org_100"})

        assert isinstance(org, Organization)
        assert org.id == "org_100"
        assert org.name == "Untitled Organization"
        assert org.slug == "untitled-organization"
        assert org.subscription_tier == "starter"

    def test_upsert_from_clerk_normalizes_subscription_tier(self, db_session: Session) -> None:
        org = upsert_from_clerk(
            db_session,
            {
                "id": "org_professional",
                "name": "Professional Org",
                "public_metadata": {"subscription_tier": "Professional"},
            },
        )

        assert org.subscription_tier == "professional"

    def test_upsert_from_clerk_falls_back_to_starter_on_invalid_tier(self, db_session: Session) -> None:
        first = upsert_from_clerk(
            db_session,
            {
                "id": "org_invalid",
                "name": "Initial Org",
                "public_metadata": {"subscription_tier": "premium"},
            },
        )
        assert first.subscription_tier == "premium"

        updated = upsert_from_clerk(
            db_session,
            {
                "id": "org_invalid",
                "name": "Initial Org",
                "public_metadata": {"subscription_tier": "INVALID"},
            },
        )

        assert updated.subscription_tier == "starter"

    def test_upsert_from_clerk_generates_unique_slug(self, db_session: Session) -> None:
        first = upsert_from_clerk(
            db_session,
            {
                "id": "org_slug_1",
                "name": "Acme Corp",
                "slug": "acme-corp",
            },
        )
        assert first.slug == "acme-corp"

        second = upsert_from_clerk(
            db_session,
            {
                "id": "org_slug_2",
                "name": "Acme Corp",
                "slug": "acme-corp",
            },
        )

        assert second.slug == "acme-corp-1"

    def test_deactivate_organization_marks_inactive(self, db_session: Session) -> None:
        org = upsert_from_clerk(
            db_session,
            {
                "id": "org_deactivate",
                "name": "Deactivate Org",
            },
        )
        assert org.is_active is True

        deactivated = deactivate_organization(db_session, "org_deactivate")
        assert deactivated is not None
        assert deactivated.is_active is False

        missing = deactivate_organization(db_session, "missing_org")
        assert missing is None
