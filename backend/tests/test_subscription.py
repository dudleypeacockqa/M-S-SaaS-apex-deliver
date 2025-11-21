"""Tests for subscription tier checking and Clerk integration.

Following TDD (Test-Driven Development):
1. RED: Write failing tests first
2. GREEN: Implement minimal code to pass
3. REFACTOR: Improve code quality while keeping tests green
"""
import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.core.subscription import (
    get_organization_tier,
    SubscriptionTier,
    ClerkAPIError,
)


@pytest.fixture(autouse=True)
def disable_clerk_bypass(monkeypatch):
    """Ensure Clerk bypass is disabled for subscription-specific tests."""

    monkeypatch.delenv("CLERK_BYPASS_TIERS", raising=False)
    yield
    monkeypatch.setenv("CLERK_BYPASS_TIERS", "1")


class TestGetOrganizationTier:
    """Tests for fetching organization subscription tier from Clerk."""

    @pytest.mark.asyncio
    async def test_returns_professional_tier_when_set_in_metadata(self):
        """Test Clerk API returns 'professional' tier from organization metadata."""
        org_id = "org_2abc123def456"

        # Mock Clerk API response
        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "professional"}

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            tier = await get_organization_tier(org_id)

            assert tier == SubscriptionTier.PROFESSIONAL
            mock_client.organizations.get.assert_called_once_with(org_id)

    @pytest.mark.asyncio
    async def test_returns_premium_tier_when_set_in_metadata(self):
        """Test Clerk API returns 'premium' tier from organization metadata."""
        org_id = "org_premium123"

        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "premium"}

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            tier = await get_organization_tier(org_id)

            assert tier == SubscriptionTier.PREMIUM

    @pytest.mark.asyncio
    async def test_returns_enterprise_tier_when_set_in_metadata(self):
        """Test Clerk API returns 'enterprise' tier from organization metadata."""
        org_id = "org_enterprise123"

        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "enterprise"}

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            tier = await get_organization_tier(org_id)

            assert tier == SubscriptionTier.ENTERPRISE

    @pytest.mark.asyncio
    async def test_defaults_to_starter_when_metadata_missing(self):
        """Test default tier is 'starter' when subscription_tier not in metadata."""
        org_id = "org_no_tier"

        mock_org = Mock()
        mock_org.public_metadata = {}  # No subscription_tier key

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            tier = await get_organization_tier(org_id)

            assert tier == SubscriptionTier.STARTER

    @pytest.mark.asyncio
    async def test_defaults_to_starter_when_metadata_is_none(self):
        """Test default tier is 'starter' when public_metadata is None."""
        org_id = "org_null_metadata"

        mock_org = Mock()
        mock_org.public_metadata = None

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            tier = await get_organization_tier(org_id)

            assert tier == SubscriptionTier.STARTER

    @pytest.mark.asyncio
    async def test_defaults_to_starter_when_tier_value_invalid(self):
        """Test default tier is 'starter' when subscription_tier has invalid value."""
        org_id = "org_invalid_tier"

        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "invalid_tier_name"}

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            tier = await get_organization_tier(org_id)

            assert tier == SubscriptionTier.STARTER

    @pytest.mark.asyncio
    async def test_raises_clerk_api_error_when_org_not_found(self):
        """Test raises ClerkAPIError when organization doesn't exist."""
        org_id = "org_nonexistent"

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(
                side_effect=Exception("Organization not found")
            )
            MockClerk.return_value = mock_client

            with pytest.raises(ClerkAPIError) as exc_info:
                await get_organization_tier(org_id)

            assert "Failed to fetch organization" in str(exc_info.value)
            assert org_id in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_raises_clerk_api_error_when_network_fails(self):
        """Test raises ClerkAPIError when network request fails."""
        org_id = "org_network_fail"

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(
                side_effect=ConnectionError("Network unreachable")
            )
            MockClerk.return_value = mock_client

            with pytest.raises(ClerkAPIError) as exc_info:
                await get_organization_tier(org_id)

            assert "Failed to fetch organization" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_caches_tier_data_for_performance(self):
        """Test tier data is cached to reduce Clerk API calls."""
        org_id = "org_cached"

        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "professional"}

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            # First call should hit API
            tier1 = await get_organization_tier(org_id)
            assert tier1 == SubscriptionTier.PROFESSIONAL

            # Second call should use cache (API not called again)
            tier2 = await get_organization_tier(org_id)
            assert tier2 == SubscriptionTier.PROFESSIONAL

            # API should only be called once due to caching
            assert mock_client.organizations.get.call_count == 1

    @pytest.mark.asyncio
    async def test_cache_respects_ttl(self):
        """Test cached tier data expires after TTL (5 minutes)."""
        org_id = "org_ttl_test"

        mock_org = Mock()
        mock_org.public_metadata = {"subscription_tier": "professional"}

        with patch('app.core.subscription.Clerk') as MockClerk:
            mock_client = Mock()
            mock_client.organizations.get = AsyncMock(return_value=mock_org)
            MockClerk.return_value = mock_client

            with patch('app.core.subscription.time.time') as mock_time:
                # First call at t=0
                mock_time.return_value = 0
                tier1 = await get_organization_tier(org_id)

                # Second call at t=299 (within TTL of 300 seconds)
                mock_time.return_value = 299
                tier2 = await get_organization_tier(org_id)

                # Third call at t=301 (beyond TTL)
                mock_time.return_value = 301
                tier3 = await get_organization_tier(org_id)

                # API should be called twice (initial + after TTL)
                assert mock_client.organizations.get.call_count == 2


class TestSubscriptionTierEnum:
    """Tests for SubscriptionTier enum."""

    def test_starter_tier_exists(self):
        """Test STARTER tier is defined."""
        assert SubscriptionTier.STARTER.value == "starter"

    def test_professional_tier_exists(self):
        """Test PROFESSIONAL tier is defined."""
        assert SubscriptionTier.PROFESSIONAL.value == "professional"

    def test_premium_tier_exists(self):
        """Test PREMIUM tier is defined."""
        assert SubscriptionTier.PREMIUM.value == "premium"

    def test_enterprise_tier_exists(self):
        """Test ENTERPRISE tier is defined."""
        assert SubscriptionTier.ENTERPRISE.value == "enterprise"

    def test_tier_comparison(self):
        """Test tiers can be compared."""
        assert SubscriptionTier.STARTER < SubscriptionTier.PROFESSIONAL
        assert SubscriptionTier.PROFESSIONAL < SubscriptionTier.PREMIUM
        assert SubscriptionTier.PREMIUM < SubscriptionTier.ENTERPRISE


class TestClerkAPIError:
    """Tests for ClerkAPIError exception."""

    def test_clerk_api_error_message(self):
        """Test ClerkAPIError can be raised with custom message."""
        with pytest.raises(ClerkAPIError) as exc_info:
            raise ClerkAPIError("Test error message")

        assert "Test error message" in str(exc_info.value)

    def test_clerk_api_error_with_original_exception(self):
        """Test ClerkAPIError can wrap original exception."""
        original_error = ConnectionError("Network failed")

        with pytest.raises(ClerkAPIError) as exc_info:
            raise ClerkAPIError("Clerk API failed") from original_error

        assert "Clerk API failed" in str(exc_info.value)
