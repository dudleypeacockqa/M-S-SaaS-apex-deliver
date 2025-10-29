"""Subscription tier management and Clerk integration.

This module handles fetching subscription tier information from Clerk
organization metadata and provides caching for performance.
"""
import time
from enum import Enum
from typing import Optional, Dict
import logging

from clerk_backend_api import Clerk

from app.core.config import settings

logger = logging.getLogger(__name__)


class SubscriptionTier(str, Enum):
    """Subscription tier levels with comparison support."""

    STARTER = "starter"
    PROFESSIONAL = "professional"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

    def __lt__(self, other):
        """Enable tier comparison (starter < professional < premium < enterprise)."""
        if not isinstance(other, SubscriptionTier):
            return NotImplemented

        tier_order = {
            self.STARTER: 1,
            self.PROFESSIONAL: 2,
            self.PREMIUM: 3,
            self.ENTERPRISE: 4,
        }
        return tier_order[self] < tier_order[other]


class ClerkAPIError(Exception):
    """Exception raised when Clerk API call fails."""

    pass


# In-memory cache for tier data
# Format: {org_id: {"tier": SubscriptionTier, "timestamp": float}}
_tier_cache: Dict[str, Dict] = {}
CACHE_TTL_SECONDS = 300  # 5 minutes


async def get_organization_tier(organization_id: str) -> SubscriptionTier:
    """
    Fetch subscription tier from Clerk organization metadata.

    Implements caching with 5-minute TTL to reduce Clerk API calls.
    Defaults to STARTER tier if metadata is missing or invalid.

    Args:
        organization_id: Clerk organization ID

    Returns:
        SubscriptionTier: The organization's subscription tier

    Raises:
        ClerkAPIError: If Clerk API call fails

    Examples:
        >>> tier = await get_organization_tier("org_2abc123")
        >>> print(tier)
        SubscriptionTier.PROFESSIONAL

        >>> tier = await get_organization_tier("org_no_metadata")
        >>> print(tier)
        SubscriptionTier.STARTER  # defaults to starter
    """
    # Check cache first
    cached_data = _tier_cache.get(organization_id)
    if cached_data:
        cache_age = time.time() - cached_data["timestamp"]
        if cache_age < CACHE_TTL_SECONDS:
            logger.debug(f"Cache hit for organization {organization_id} (age: {cache_age:.1f}s)")
            return cached_data["tier"]
        else:
            logger.debug(f"Cache expired for organization {organization_id} (age: {cache_age:.1f}s)")

    # Fetch from Clerk API
    try:
        clerk = Clerk(bearer_auth=settings.clerk_secret_key)
        org = await clerk.organizations.get(organization_id)

        # Extract tier from public_metadata
        tier_value = None
        if org.public_metadata:
            tier_value = org.public_metadata.get("subscription_tier")

        # Validate and convert to enum
        if tier_value and tier_value in [t.value for t in SubscriptionTier]:
            tier = SubscriptionTier(tier_value)
            logger.info(f"Fetched tier {tier.value} for organization {organization_id}")
        else:
            tier = SubscriptionTier.STARTER
            logger.warning(
                f"Invalid or missing subscription_tier for organization {organization_id}, "
                f"defaulting to STARTER. Metadata: {org.public_metadata}"
            )

        # Cache the result
        _tier_cache[organization_id] = {
            "tier": tier,
            "timestamp": time.time(),
        }

        return tier

    except Exception as e:
        logger.error(
            f"Failed to fetch organization {organization_id} from Clerk: {e}",
            exc_info=True,
        )
        raise ClerkAPIError(
            f"Failed to fetch organization {organization_id} from Clerk: {str(e)}"
        ) from e


def clear_tier_cache(organization_id: Optional[str] = None) -> None:
    """
    Clear the tier cache for one or all organizations.

    Useful for testing or when tier data needs immediate refresh.

    Args:
        organization_id: Optional specific organization ID to clear.
                        If None, clears entire cache.

    Examples:
        >>> clear_tier_cache("org_123")  # Clear specific org
        >>> clear_tier_cache()  # Clear all cached tiers
    """
    if organization_id:
        if organization_id in _tier_cache:
            del _tier_cache[organization_id]
            logger.debug(f"Cleared tier cache for organization {organization_id}")
    else:
        _tier_cache.clear()
        logger.debug("Cleared all tier cache")
