"""
Tests for Core Subscription Module - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Test subscription tier utilities and cache management
"""
import pytest
from unittest.mock import AsyncMock, patch, Mock
import asyncio

from app.core.subscription import (
    SubscriptionTier,
    get_organization_tier,
    clear_tier_cache,
    ClerkAPIError,
    CACHE_TTL_SECONDS,
)


class TestSubscriptionTierComparison:
    """Test SubscriptionTier enum comparison operations"""
    
    def test_tier_less_than_comparison(self):
        """Test tier < operator works correctly."""
        assert SubscriptionTier.STARTER < SubscriptionTier.PROFESSIONAL
        assert SubscriptionTier.PROFESSIONAL < SubscriptionTier.PREMIUM
        assert SubscriptionTier.PREMIUM < SubscriptionTier.ENTERPRISE
    
    def test_tier_not_less_than_same(self):
        """Test tier < operator returns False for same tier."""
        assert not (SubscriptionTier.STARTER < SubscriptionTier.STARTER)
        assert not (SubscriptionTier.PROFESSIONAL < SubscriptionTier.PROFESSIONAL)
    
    def test_tier_not_less_than_higher(self):
        """Test tier < operator returns False for higher tier."""
        assert not (SubscriptionTier.PROFESSIONAL < SubscriptionTier.STARTER)
        assert not (SubscriptionTier.ENTERPRISE < SubscriptionTier.PREMIUM)
    
    def test_tier_less_than_non_tier_returns_not_implemented(self):
        """Test tier < operator returns NotImplemented for non-tier types."""
        result = SubscriptionTier.STARTER.__lt__("not_a_tier")
        assert result is NotImplemented


class TestGetOrganizationTier:
    """Test get_organization_tier function"""
    
    @pytest.mark.asyncio
    async def test_get_organization_tier_with_valid_metadata(self):
        """Test get_organization_tier returns correct tier from Clerk metadata."""
        org_id = "org_professional"
        
        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "professional"}
        
        mock_clerk = AsyncMock()
        mock_clerk.organizations.get.return_value = mock_org
        
        with patch("app.core.subscription.Clerk", return_value=mock_clerk):
            # Clear cache first
            clear_tier_cache(org_id)
            
            tier = await get_organization_tier(org_id)
            
            assert tier == SubscriptionTier.PROFESSIONAL
            mock_clerk.organizations.get.assert_called_once_with(org_id)
    
    @pytest.mark.asyncio
    async def test_get_organization_tier_defaults_to_starter_when_missing(self):
        """Test get_organization_tier defaults to STARTER when metadata is missing."""
        org_id = "org_no_metadata"
        
        mock_org = Mock()
        mock_org.public_metadata = None
        
        mock_clerk = AsyncMock()
        mock_clerk.organizations.get.return_value = mock_org
        
        with patch("app.core.subscription.Clerk", return_value=mock_clerk):
            clear_tier_cache(org_id)
            
            tier = await get_organization_tier(org_id)
            
            assert tier == SubscriptionTier.STARTER
    
    @pytest.mark.asyncio
    async def test_get_organization_tier_defaults_to_starter_when_invalid(self):
        """Test get_organization_tier defaults to STARTER when metadata is invalid."""
        org_id = "org_invalid_metadata"
        
        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "invalid_tier"}
        
        mock_clerk = AsyncMock()
        mock_clerk.organizations.get.return_value = mock_org
        
        with patch("app.core.subscription.Clerk", return_value=mock_clerk):
            clear_tier_cache(org_id)
            
            tier = await get_organization_tier(org_id)
            
            assert tier == SubscriptionTier.STARTER
    
    @pytest.mark.asyncio
    async def test_get_organization_tier_uses_cache(self):
        """Test get_organization_tier uses cache when available."""
        org_id = "org_cached"
        
        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "premium"}
        
        mock_clerk = AsyncMock()
        mock_clerk.organizations.get.return_value = mock_org
        
        with patch("app.core.subscription.Clerk", return_value=mock_clerk):
            clear_tier_cache(org_id)
            
            # First call - should fetch from Clerk
            tier1 = await get_organization_tier(org_id)
            assert tier1 == SubscriptionTier.PREMIUM
            assert mock_clerk.organizations.get.call_count == 1
            
            # Second call - should use cache
            tier2 = await get_organization_tier(org_id)
            assert tier2 == SubscriptionTier.PREMIUM
            assert mock_clerk.organizations.get.call_count == 1  # No additional call
    
    @pytest.mark.asyncio
    async def test_get_organization_tier_refreshes_expired_cache(self):
        """Test get_organization_tier refreshes cache when expired."""
        org_id = "org_expired"
        
        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "professional"}
        
        mock_clerk = AsyncMock()
        mock_clerk.organizations.get.return_value = mock_org
        
        with patch("app.core.subscription.Clerk", return_value=mock_clerk):
            clear_tier_cache(org_id)
            
            # First call - populate cache
            tier1 = await get_organization_tier(org_id)
            assert tier1 == SubscriptionTier.PROFESSIONAL
            assert mock_clerk.organizations.get.call_count == 1
            
            # Expire cache by manipulating timestamp
            import app.core.subscription as subscription_module
            import time
            if org_id in subscription_module._tier_cache:
                subscription_module._tier_cache[org_id]["timestamp"] = time.time() - CACHE_TTL_SECONDS - 1
            
            # Second call - should refresh from Clerk
            tier2 = await get_organization_tier(org_id)
            assert tier2 == SubscriptionTier.PROFESSIONAL
            assert mock_clerk.organizations.get.call_count == 2
    
    @pytest.mark.asyncio
    async def test_get_organization_tier_raises_clerk_api_error_on_failure(self):
        """Test get_organization_tier raises ClerkAPIError when Clerk API fails."""
        org_id = "org_error"
        
        mock_clerk = AsyncMock()
        mock_clerk.organizations.get.side_effect = Exception("Clerk API error")
        
        with patch("app.core.subscription.Clerk", return_value=mock_clerk):
            clear_tier_cache(org_id)
            
            with pytest.raises(ClerkAPIError) as exc_info:
                await get_organization_tier(org_id)
            
            assert "Failed to fetch organization" in str(exc_info.value)
            assert org_id in str(exc_info.value)


class TestClearTierCache:
    """Test clear_tier_cache function"""
    
    @pytest.mark.asyncio
    async def test_clear_tier_cache_specific_org(self):
        """Test clear_tier_cache clears cache for specific organization."""
        org1_id = "org_1"
        org2_id = "org_2"
        
        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "professional"}
        
        mock_clerk = AsyncMock()
        mock_clerk.organizations.get.return_value = mock_org
        
        with patch("app.core.subscription.Clerk", return_value=mock_clerk):
            # Populate cache for both orgs
            clear_tier_cache()  # Clear all first
            
            await get_organization_tier(org1_id)
            await get_organization_tier(org2_id)
            
            # Verify both are cached
            import app.core.subscription as subscription_module
            assert org1_id in subscription_module._tier_cache
            assert org2_id in subscription_module._tier_cache
            
            # Clear only org1
            clear_tier_cache(org1_id)
            
            # Verify org1 is cleared but org2 remains
            assert org1_id not in subscription_module._tier_cache
            assert org2_id in subscription_module._tier_cache
    
    def test_clear_tier_cache_all(self):
        """Test clear_tier_cache clears entire cache when no org_id provided."""
        import app.core.subscription as subscription_module
        
        # Populate cache
        subscription_module._tier_cache["org_1"] = {"tier": SubscriptionTier.PROFESSIONAL, "timestamp": 0}
        subscription_module._tier_cache["org_2"] = {"tier": SubscriptionTier.PREMIUM, "timestamp": 0}
        
        assert len(subscription_module._tier_cache) == 2
        
        # Clear all
        clear_tier_cache()
        
        assert len(subscription_module._tier_cache) == 0
    
    def test_clear_tier_cache_nonexistent_org(self):
        """Test clear_tier_cache handles nonexistent org_id gracefully."""
        import app.core.subscription as subscription_module
        
        # Ensure org doesn't exist
        clear_tier_cache("nonexistent_org")
        
        # Should not raise error
        assert "nonexistent_org" not in subscription_module._tier_cache


class TestClerkAPIError:
    """Test ClerkAPIError exception"""
    
    def test_clerk_api_error_can_be_raised(self):
        """Test ClerkAPIError can be raised and caught."""
        with pytest.raises(ClerkAPIError) as exc_info:
            raise ClerkAPIError("Test error message")
        
        assert "Test error message" in str(exc_info.value)

