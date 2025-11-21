"""
Tests for User Service Helper Functions - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Complete coverage for user_service.py helper functions
"""
import pytest
from sqlalchemy.orm import Session

from app.services.user_service import (
    create_user_from_clerk,
    update_user_from_clerk,
    delete_user,
    get_user_by_clerk_id,
    get_user_by_email,
    update_last_login,
    _extract_email,
    _extract_profile_image,
    _extract_role,
    _extract_organization_id,
)
from app.models.user import User, UserRole


class TestUserServiceHelpers:
    """Test user service helper functions"""
    
    def test_extract_email_from_email_addresses(self):
        """Test _extract_email extracts from email_addresses array."""
        data = {
            "email_addresses": [
                {"email_address": "primary@example.com"},
                {"email_address": "secondary@example.com"},
            ]
        }
        result = _extract_email(data)
        assert result == "primary@example.com"
    
    def test_extract_email_from_email_field(self):
        """Test _extract_email falls back to email field."""
        data = {"email": "fallback@example.com"}
        result = _extract_email(data)
        assert result == "fallback@example.com"
    
    def test_extract_email_returns_none_when_missing(self):
        """Test _extract_email returns None when no email found."""
        data = {}
        result = _extract_email(data)
        assert result is None
    
    def test_extract_email_handles_empty_email_addresses(self):
        """Test _extract_email handles empty email_addresses array."""
        data = {"email_addresses": []}
        result = _extract_email(data)
        assert result is None
    
    def test_extract_profile_image(self):
        """Test _extract_profile_image extracts profile image URL."""
        data = {"profile_image_url": "https://example.com/image.jpg"}
        result = _extract_profile_image(data)
        assert result == "https://example.com/image.jpg"
    
    def test_extract_profile_image_returns_none_when_missing(self):
        """Test _extract_profile_image returns None when missing."""
        data = {}
        result = _extract_profile_image(data)
        assert result is None
    
    def test_extract_role_from_public_metadata(self):
        """Test _extract_role extracts from public_metadata."""
        data = {"public_metadata": {"role": "growth"}}
        result = _extract_role(data)
        assert result == UserRole.growth
    
    def test_extract_role_from_unsafe_metadata(self):
        """Test _extract_role extracts from unsafe_metadata."""
        data = {"unsafe_metadata": {"role": "enterprise"}}
        result = _extract_role(data)
        assert result == UserRole.enterprise
    
    def test_extract_role_returns_none_when_missing(self):
        """Test _extract_role returns None when role not found."""
        data = {}
        result = _extract_role(data)
        assert result is None
    
    def test_extract_role_returns_none_for_invalid_role(self):
        """Test _extract_role returns None for invalid role value."""
        data = {"public_metadata": {"role": "invalid_role"}}
        result = _extract_role(data)
        assert result is None
    
    def test_extract_organization_id_from_root(self):
        """Test _extract_organization_id extracts from root level."""
        data = {"organization_id": "org_123"}
        result = _extract_organization_id(data)
        assert result == "org_123"
    
    def test_extract_organization_id_from_unsafe_metadata(self):
        """Test _extract_organization_id extracts from unsafe_metadata."""
        data = {"unsafe_metadata": {"organization_id": "org_456"}}
        result = _extract_organization_id(data)
        assert result == "org_456"
    
    def test_extract_organization_id_returns_none_when_missing(self):
        """Test _extract_organization_id returns None when missing."""
        data = {}
        result = _extract_organization_id(data)
        assert result is None


class TestUserServiceCRUD:
    """Test user service CRUD operations"""
    
    def test_create_user_from_clerk_creates_new_user(
        self,
        db_session: Session,
        create_organization,
    ):
        """Test create_user_from_clerk creates new user from Clerk data."""
        org = create_organization(name="Test Org")
        clerk_data = {
            "id": "clerk_user_123",
            "email_addresses": [{"email_address": "newuser@example.com"}],
            "first_name": "New",
            "last_name": "User",
            "profile_image_url": "https://example.com/image.jpg",
            "public_metadata": {"role": "solo"},
            "organization_id": str(org.id),
        }
        
        user = create_user_from_clerk(db_session, clerk_data)
        
        assert user is not None
        assert user.clerk_user_id == "clerk_user_123"
        assert user.email == "newuser@example.com"
        assert user.first_name == "New"
        assert user.last_name == "User"
        assert user.role == UserRole.solo
        assert user.organization_id == str(org.id)

    def test_create_user_from_clerk_assigns_master_admin_role_without_org(
        self,
        db_session: Session,
    ):
        """Master admin Clerk payload should persist elevated role without org."""
        clerk_data = {
            "id": "clerk_master_admin",
            "email_addresses": [{"email_address": "superadmin@example.com"}],
            "first_name": "Master",
            "last_name": "Admin",
            "public_metadata": {"role": "master_admin"},
        }

        user = create_user_from_clerk(db_session, clerk_data)

        assert user.role == UserRole.master_admin
        assert user.organization_id is None

    def test_update_user_from_clerk_promotes_user_to_master_admin(
        self,
        db_session: Session,
        create_user,
    ):
        """Updating from Clerk should allow promotion to master admin role."""
        user = create_user(
            email="promo@example.com",
            role=UserRole.admin,
            first_name="Regular",
            last_name="Admin",
        )

        clerk_data = {
            "id": user.clerk_user_id,
            "email": "promo@example.com",
            "first_name": "Master",
            "last_name": "Admin",
            "public_metadata": {"role": "master_admin"},
        }

        updated = update_user_from_clerk(db_session, user.clerk_user_id, clerk_data)

        assert updated.id == user.id
        assert updated.role == UserRole.master_admin
        assert updated.first_name == "Master"
        assert updated.last_name == "Admin"
    
    def test_create_user_from_clerk_updates_existing_user(
        self,
        db_session: Session,
        create_user,
    ):
        """Test create_user_from_clerk updates existing user."""
        existing_user = create_user(email="existing@example.com", clerk_user_id="clerk_existing")
        clerk_data = {
            "id": "clerk_existing",
            "email": "updated@example.com",
            "first_name": "Updated",
            "last_name": "Name",
        }
        
        user = create_user_from_clerk(db_session, clerk_data)
        
        assert user.id == existing_user.id
        assert user.email == "updated@example.com"
        assert user.first_name == "Updated"
    
    def test_create_user_from_clerk_raises_error_when_id_missing(
        self,
        db_session: Session,
    ):
        """Test create_user_from_clerk raises ValueError when id missing."""
        clerk_data = {"email": "test@example.com"}
        
        with pytest.raises(ValueError) as exc_info:
            create_user_from_clerk(db_session, clerk_data)
        
        assert "missing required 'id' field" in str(exc_info.value).lower()
    
    def test_update_user_from_clerk_updates_all_fields(
        self,
        db_session: Session,
        create_user,
        create_organization,
    ):
        """Test update_user_from_clerk updates all user fields."""
        org = create_organization(name="Test Org")
        user = create_user(
            email="old@example.com",
            clerk_user_id="clerk_update",
            first_name="Old",
            last_name="Name",
        )
        
        clerk_data = {
            "id": "clerk_update",
            "email": "new@example.com",
            "first_name": "New",
            "last_name": "Name",
            "profile_image_url": "https://example.com/new.jpg",
            "public_metadata": {"role": "growth"},
            "organization_id": str(org.id),
        }
        
        updated = update_user_from_clerk(db_session, "clerk_update", clerk_data)
        
        assert updated.id == user.id
        assert updated.email == "new@example.com"
        assert updated.first_name == "New"
        assert updated.last_name == "Name"
        assert updated.role == UserRole.growth
        assert updated.organization_id == str(org.id)
    
    def test_update_user_from_clerk_raises_error_when_user_not_found(
        self,
        db_session: Session,
    ):
        """Test update_user_from_clerk raises ValueError when user not found."""
        clerk_data = {"id": "nonexistent", "email": "test@example.com"}
        
        with pytest.raises(ValueError) as exc_info:
            update_user_from_clerk(db_session, "nonexistent", clerk_data)
        
        assert "not found" in str(exc_info.value).lower()
    
    def test_delete_user_sets_is_active_false(
        self,
        db_session: Session,
        create_user,
    ):
        """Test delete_user sets is_active to False."""
        user = create_user(email="delete@example.com", clerk_user_id="clerk_delete")
        user_id = user.id
        
        # Verify user starts as active (default)
        assert user.is_active is True
        
        delete_user(db_session, "clerk_delete")
        
        # Query fresh from database to see changes (delete_user uses its own session/commit)
        db_session.expire_all()
        updated_user = db_session.query(User).filter(User.id == user_id).first()
        assert updated_user is not None
        assert updated_user.is_active is False
    
    def test_delete_user_handles_nonexistent_user(
        self,
        db_session: Session,
    ):
        """Test delete_user handles nonexistent user gracefully."""
        # Should not raise
        delete_user(db_session, "nonexistent_clerk_id")
    
    def test_get_user_by_clerk_id_returns_user(
        self,
        db_session: Session,
        create_user,
    ):
        """Test get_user_by_clerk_id returns user when found."""
        user = create_user(email="test@example.com", clerk_user_id="clerk_find")
        
        found = get_user_by_clerk_id(db_session, "clerk_find")
        
        assert found is not None
        assert found.id == user.id
    
    def test_get_user_by_clerk_id_returns_none_when_not_found(
        self,
        db_session: Session,
    ):
        """Test get_user_by_clerk_id returns None when not found."""
        found = get_user_by_clerk_id(db_session, "nonexistent")
        assert found is None
    
    def test_get_user_by_email_returns_user(
        self,
        db_session: Session,
        create_user,
    ):
        """Test get_user_by_email returns user when found."""
        user = create_user(email="findme@example.com")
        
        found = get_user_by_email(db_session, "findme@example.com")
        
        assert found is not None
        assert found.id == user.id
    
    def test_get_user_by_email_returns_none_when_not_found(
        self,
        db_session: Session,
    ):
        """Test get_user_by_email returns None when not found."""
        found = get_user_by_email(db_session, "nonexistent@example.com")
        assert found is None
    
    def test_update_last_login_updates_timestamp(
        self,
        db_session: Session,
        create_user,
    ):
        """Test update_last_login updates last_login_at."""
        from datetime import datetime, timezone
        
        user = create_user(email="login@example.com", clerk_user_id="clerk_login")
        login_time = datetime.now(timezone.utc)
        
        updated = update_last_login(db_session, "clerk_login", login_time)
        
        assert updated is not None
        assert updated.id == user.id
        # Allow small time difference for timestamp comparison
        # last_login_at may be timezone-aware or naive
        if updated.last_login_at:
            updated_time = updated.last_login_at
            if updated_time.tzinfo is None:
                updated_time = updated_time.replace(tzinfo=timezone.utc)
            elif updated_time.tzinfo != login_time.tzinfo:
                updated_time = updated_time.replace(tzinfo=login_time.tzinfo)
            assert abs((updated_time - login_time).total_seconds()) < 2
    
    def test_update_last_login_uses_current_time_when_none_provided(
        self,
        db_session: Session,
        create_user,
    ):
        """Test update_last_login uses current time when None provided."""
        from datetime import datetime, timezone
        
        user = create_user(email="login2@example.com", clerk_user_id="clerk_login2")
        before = datetime.now(timezone.utc)
        
        updated = update_last_login(db_session, "clerk_login2", None)
        
        assert updated is not None
        assert updated.last_login_at is not None
        # Allow small time difference (should be within a few seconds)
        if updated.last_login_at:
            time_diff = (updated.last_login_at.replace(tzinfo=timezone.utc) - before).total_seconds()
            assert time_diff >= 0
            assert time_diff < 5  # Should be within 5 seconds
    
    def test_update_last_login_returns_none_when_user_not_found(
        self,
        db_session: Session,
    ):
        """Test update_last_login returns None when user not found."""
        result = update_last_login(db_session, "nonexistent", None)
        assert result is None

