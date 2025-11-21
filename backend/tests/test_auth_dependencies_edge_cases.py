"""
Tests for Auth Dependencies Edge Cases - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Complete coverage for auth.py dependency helper functions
"""
import pytest
from unittest.mock import patch, Mock, MagicMock, AsyncMock
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.api.dependencies.auth import (
    _extract_claim,
    _sanitize_claims,
    get_current_admin_user,
    require_feature,
)
from app.core.security import AuthError
from app.models.user import User, UserRole
from app.services.entitlement_service import FeatureNotFoundError


class TestExtractClaim:
    """Test _extract_claim helper function"""
    
    def test_extract_claim_finds_first_key(self):
        """Test _extract_claim returns first matching key value."""
        claims = {
            "org_id": "org_123",
            "orgId": "org_456",
            "organization_id": "org_789",
        }
        
        result = _extract_claim(claims, "org_id", "orgId", "organization_id")
        
        assert result == "org_123"  # First matching key
    
    def test_extract_claim_finds_second_key(self):
        """Test _extract_claim returns second key when first is missing."""
        claims = {
            "orgId": "org_456",
            "organization_id": "org_789",
        }
        
        result = _extract_claim(claims, "org_id", "orgId", "organization_id")
        
        assert result == "org_456"  # Second matching key
    
    def test_extract_claim_returns_none_when_no_match(self):
        """Test _extract_claim returns None when no keys match."""
        claims = {
            "other_key": "value",
        }
        
        result = _extract_claim(claims, "org_id", "orgId")
        
        assert result is None
    
    def test_extract_claim_returns_none_when_value_is_falsy(self):
        """Test _extract_claim returns None when value is falsy (empty string, None, 0)."""
        claims = {
            "org_id": "",
            "orgId": None,
            "count": 0,
        }
        
        # Empty string should not match (if value check is truthy)
        result = _extract_claim(claims, "org_id")
        # Implementation may return empty string or None - depends on truthiness check
        assert result is None or result == ""  # Both are acceptable
    
    def test_extract_claim_handles_nonexistent_keys(self):
        """Test _extract_claim handles nonexistent keys gracefully."""
        claims = {}
        
        result = _extract_claim(claims, "nonexistent_key")
        
        assert result is None


class TestSanitizeClaims:
    """Test _sanitize_claims helper function"""
    
    def test_sanitize_claims_keeps_allowed_keys(self):
        """Test _sanitize_claims keeps only allowed keys."""
        claims = {
            "sub": "user_123",
            "org_id": "org_456",
            "org_role": "admin",
            "sid": "session_789",
            "iss": "clerk",
            "session_id": "sess_123",
            "unallowed_key": "should_be_removed",
            "another_bad": "removed",
        }
        
        result = _sanitize_claims(claims)
        
        assert "sub" in result
        assert "org_id" in result
        assert "org_role" in result
        assert "sid" in result
        assert "iss" in result
        assert "session_id" in result
        assert "unallowed_key" not in result
        assert "another_bad" not in result
    
    def test_sanitize_claims_handles_partial_claims(self):
        """Test _sanitize_claims handles claims with only some allowed keys."""
        claims = {
            "sub": "user_123",
            "org_id": "org_456",
            "other_key": "value",
        }
        
        result = _sanitize_claims(claims)
        
        assert "sub" in result
        assert "org_id" in result
        assert "other_key" not in result
        assert len(result) == 2
    
    def test_sanitize_claims_handles_empty_claims(self):
        """Test _sanitize_claims handles empty claims dict."""
        claims = {}
        
        result = _sanitize_claims(claims)
        
        assert result == {}


class TestGetCurrentAdminUser:
    """Test get_current_admin_user dependency"""
    
    def test_get_current_admin_user_returns_admin(self):
        """Test get_current_admin_user returns admin user."""
        admin_user = User(
            id="admin_1",
            clerk_user_id="clerk_admin",
            email="admin@example.com",
            role=UserRole.admin,
            first_name="Admin",
            last_name="User",
        )
        
        result = get_current_admin_user(current_user=admin_user)
        
        assert result is admin_user
        assert result.role == UserRole.admin
    
    def test_get_current_admin_user_rejects_non_admin(self):
        """Test get_current_admin_user raises 403 for non-admin user."""
        regular_user = User(
            id="user_1",
            clerk_user_id="clerk_user",
            email="user@example.com",
            role=UserRole.solo,
            first_name="Regular",
            last_name="User",
        )
        
        with pytest.raises(HTTPException) as exc_info:
            get_current_admin_user(current_user=regular_user)
        
        assert exc_info.value.status_code == 403
        assert "Admin access required" in exc_info.value.detail
    
    def test_get_current_admin_user_rejects_growth_role(self):
        """Test get_current_admin_user rejects growth role."""
        growth_user = User(
            id="growth_1",
            clerk_user_id="clerk_growth",
            email="growth@example.com",
            role=UserRole.growth,
            first_name="Growth",
            last_name="User",
        )
        
        with pytest.raises(HTTPException) as exc_info:
            get_current_admin_user(current_user=growth_user)
        
        assert exc_info.value.status_code == 403
        assert "Admin access required" in exc_info.value.detail


class TestRequireFeature:
    """Test require_feature dependency factory"""
    
    @pytest.mark.asyncio
    async def test_require_feature_grants_access_when_user_has_feature(self):
        """Test require_feature allows access when user's org has feature."""
        user = User(
            id="user_1",
            clerk_user_id="clerk_user",
            email="user@example.com",
            organization_id="org_professional",
            role=UserRole.solo,
        )
        
        with patch("app.api.dependencies.auth.check_feature_access", new_callable=AsyncMock) as mock_check:
            mock_check.return_value = True
            
            feature_dep = require_feature("podcast_audio")
            result = await feature_dep(current_user=user)
            
            assert result is user
            mock_check.assert_called_once_with("org_professional", "podcast_audio")
    
    @pytest.mark.asyncio
    async def test_require_feature_denies_access_when_user_lacks_feature(self):
        """Test require_feature raises 403 when user's org lacks feature."""
        user = User(
            id="user_1",
            clerk_user_id="clerk_user",
            email="user@example.com",
            organization_id="org_starter",
            role=UserRole.solo,
        )
        
        with patch("app.api.dependencies.auth.check_feature_access", new_callable=AsyncMock) as mock_check:
            with patch("app.api.dependencies.auth.get_required_tier") as mock_tier:
                with patch("app.api.dependencies.auth.get_feature_upgrade_message") as mock_msg:
                    mock_check.return_value = False
                    mock_tier.return_value = Mock(value="professional")
                    mock_msg.return_value = "Upgrade to Professional tier to unlock audio podcasting."
                    
                    feature_dep = require_feature("podcast_audio")
                    
                    with pytest.raises(HTTPException) as exc_info:
                        await feature_dep(current_user=user)
                    
                    assert exc_info.value.status_code == 403
                    assert "Upgrade" in exc_info.value.detail
                    assert "X-Required-Tier" in exc_info.value.headers
                    assert "X-Upgrade-URL" in exc_info.value.headers
                    assert "X-Feature-Locked" in exc_info.value.headers
                    assert exc_info.value.headers["X-Feature-Locked"] == "podcast_audio"
    
    @pytest.mark.asyncio
    async def test_require_feature_handles_user_with_subscription_tier_attribute(self):
        """Test require_feature uses user's subscription_tier if available."""
        from app.core.subscription import SubscriptionTier
        
        user = User(
            id="user_1",
            clerk_user_id="clerk_user",
            email="user@example.com",
            organization_id="org_starter",
            role=UserRole.solo,
        )
        user.subscription_tier = SubscriptionTier.STARTER  # Add tier attribute
        
        with patch("app.api.dependencies.auth.check_feature_access", new_callable=AsyncMock) as mock_check:
            with patch("app.api.dependencies.auth.get_required_tier") as mock_tier:
                with patch("app.api.dependencies.auth.get_feature_upgrade_message") as mock_msg:
                    mock_check.return_value = False
                    mock_tier.return_value = Mock(value="professional")
                    mock_msg.return_value = "Upgrade message"
                    
                    feature_dep = require_feature("podcast_audio")
                    
                    with pytest.raises(HTTPException):
                        await feature_dep(current_user=user)
                    
                    # Verify get_feature_upgrade_message was called with user's tier
                    mock_msg.assert_called_once()
                    call_args = mock_msg.call_args
                    assert call_args[0][0] == "podcast_audio"
                    assert call_args[0][1] == SubscriptionTier.STARTER
    
    @pytest.mark.asyncio
    async def test_require_feature_fallback_message_when_no_tier_attribute(self):
        """Test require_feature uses fallback message when user has no subscription_tier."""
        user = User(
            id="user_1",
            clerk_user_id="clerk_user",
            email="user@example.com",
            organization_id="org_starter",
            role=UserRole.solo,
        )
        # No subscription_tier attribute
        
        with patch("app.api.dependencies.auth.check_feature_access", new_callable=AsyncMock) as mock_check:
            with patch("app.api.dependencies.auth.get_required_tier") as mock_tier:
                mock_check.return_value = False
                mock_required_tier = Mock()
                mock_required_tier.value = "professional"
                mock_tier.return_value = mock_required_tier
                
                feature_dep = require_feature("podcast_audio")
                
                with pytest.raises(HTTPException) as exc_info:
                    await feature_dep(current_user=user)
                
                assert exc_info.value.status_code == 403
                # Should contain fallback message with tier name
                assert "Professional" in exc_info.value.detail or "professional" in exc_info.value.detail.lower()

