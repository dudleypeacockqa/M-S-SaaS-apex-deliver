"""Feature entitlement service.

Manages feature access control based on subscription tiers.
Determines which features are available to which tiers.
"""
import logging
from typing import List, Dict, Set

from app.core.subscription import get_organization_tier, SubscriptionTier

logger = logging.getLogger(__name__)


class FeatureNotFoundError(Exception):
    """Exception raised when attempting to check access for non-existent feature."""

    pass


# Feature Entitlement Matrix
# Maps features to list of tiers that have access
FEATURE_ENTITLEMENTS: Dict[str, List[str]] = {
    # Core features (all tiers)
    "deal_management": ["starter", "professional", "premium", "enterprise"],
    "data_room": ["starter", "professional", "premium", "enterprise"],
    "financial_intelligence": ["starter", "professional", "premium", "enterprise"],

    # FP&A Module (CapLiquify FP&A tier and above)
    "fpa_module": ["fpa_subscriber", "professional", "premium", "enterprise"],

    # Deal matching (Professional+) - DEV-018
    "deal_matching": ["professional", "premium", "enterprise"],

    # Podcast features - Audio (Professional+)
    "podcast_audio": ["professional", "premium", "enterprise"],

    # Podcast features - Video (Premium+)
    "podcast_video": ["premium", "enterprise"],

    # Transcription features
    "transcription_basic": ["professional", "premium", "enterprise"],
    "transcription_ai_enhanced": ["premium", "enterprise"],
    "transcription_multi_language": ["enterprise"],

    # YouTube integration (Premium+)
    "youtube_integration": ["premium", "enterprise"],

    # Live streaming (Enterprise only)
    "live_streaming": ["enterprise"],

    # Advanced features (future)
    "advanced_analytics": ["premium", "enterprise"],
    "white_label": ["enterprise"],
    "api_access": ["premium", "enterprise"],
}

FEATURE_UPGRADE_CTA: Dict[str, str] = {
    "fpa_module": "/pricing",
    "deal_matching": "/pricing",
    "podcast_audio": "/pricing",
    "podcast_video": "/pricing",
    "transcription_basic": "/pricing",
    "transcription_ai_enhanced": "/pricing",
    "transcription_multi_language": "/pricing",
    "youtube_integration": "/pricing",
    "live_streaming": "/pricing",
    "advanced_analytics": "/pricing",
    "white_label": "/pricing",
    "api_access": "/pricing",
}

TIER_LABELS: Dict[SubscriptionTier, str] = {
    SubscriptionTier.STARTER: "Starter",
    SubscriptionTier.PROFESSIONAL: "Professional",
    SubscriptionTier.PREMIUM: "Premium",
    SubscriptionTier.ENTERPRISE: "Enterprise",
}

DEFAULT_UPGRADE_CTA = "/pricing"

def get_tier_label(tier: SubscriptionTier) -> str:
    """Return human-friendly label for a subscription tier."""
    return TIER_LABELS.get(tier, tier.value.title())

def get_feature_upgrade_cta(feature: str) -> str:
    """Return upgrade CTA URL for a feature."""
    return FEATURE_UPGRADE_CTA.get(feature, DEFAULT_UPGRADE_CTA)



async def check_feature_access(organization_id: str, feature: str) -> bool:
    """
    Check if organization has access to a specific feature.

    Args:
        organization_id: Clerk organization ID
        feature: Feature identifier (e.g., "podcast_audio", "youtube_integration")

    Returns:
        bool: True if organization's tier grants access, False otherwise

    Raises:
        FeatureNotFoundError: If feature doesn't exist in entitlement matrix

    Examples:
        >>> has_access = await check_feature_access("org_123", "podcast_audio")
        >>> if has_access:
        ...     # Create podcast episode
        >>> else:
        ...     # Show upgrade prompt
    """
    # Validate feature exists
    if feature not in FEATURE_ENTITLEMENTS:
        logger.warning(f"Feature not found in entitlement matrix: {feature}")
        raise FeatureNotFoundError(
            f"Feature '{feature}' not found in entitlement matrix. "
            f"Available features: {', '.join(FEATURE_ENTITLEMENTS.keys())}"
        )

    # Get organization's subscription tier
    tier = await get_organization_tier(organization_id)

    # Check if tier has access to feature
    allowed_tiers = FEATURE_ENTITLEMENTS.get(feature, [])
    has_access = tier.value in allowed_tiers

    logger.debug(
        f"Feature access check: org={organization_id}, tier={tier.value}, "
        f"feature={feature}, access={has_access}"
    )

    return has_access


def get_features_for_tier(tier: SubscriptionTier) -> Set[str]:
    """
    Get all features available for a specific tier.

    Args:
        tier: Subscription tier

    Returns:
        Set[str]: Set of feature identifiers available to the tier

    Examples:
        >>> features = get_features_for_tier(SubscriptionTier.PROFESSIONAL)
        >>> print(features)
        {'deal_management', 'data_room', 'podcast_audio', 'transcription_basic', ...}

        >>> features = get_features_for_tier(SubscriptionTier.STARTER)
        >>> 'podcast_audio' in features
        False
    """
    features = set()

    for feature, allowed_tiers in FEATURE_ENTITLEMENTS.items():
        if tier.value in allowed_tiers:
            features.add(feature)

    logger.debug(f"Features for tier {tier.value}: {len(features)} features")

    return features


def get_required_tier(feature: str) -> SubscriptionTier:
    """
    Get the minimum subscription tier required for a feature.

    Args:
        feature: Feature identifier

    Returns:
        SubscriptionTier: Minimum tier required

    Raises:
        FeatureNotFoundError: If feature doesn't exist

    Examples:
        >>> tier = get_required_tier("podcast_audio")
        >>> print(tier)
        SubscriptionTier.PROFESSIONAL

        >>> tier = get_required_tier("live_streaming")
        >>> print(tier)
        SubscriptionTier.ENTERPRISE
    """
    if feature not in FEATURE_ENTITLEMENTS:
        raise FeatureNotFoundError(f"Feature '{feature}' not found")

    allowed_tiers = FEATURE_ENTITLEMENTS[feature]

    # Map tier values to SubscriptionTier enums
    tier_order = [
        SubscriptionTier.STARTER,
        SubscriptionTier.PROFESSIONAL,
        SubscriptionTier.PREMIUM,
        SubscriptionTier.ENTERPRISE,
    ]

    # Find the lowest tier that has access
    for tier in tier_order:
        if tier.value in allowed_tiers:
            return tier

    # Fallback to highest tier (should never happen if matrix is correct)
    return SubscriptionTier.ENTERPRISE


def get_feature_upgrade_message(feature: str, current_tier: SubscriptionTier) -> str:
    """
    Generate user-friendly upgrade message for a locked feature.

    Args:
        feature: Feature identifier
        current_tier: User's current subscription tier

    Returns:
        str: Message explaining upgrade requirement

    Examples:
        >>> msg = get_feature_upgrade_message("podcast_audio", SubscriptionTier.STARTER)
        >>> print(msg)
        "Upgrade to Professional tier to unlock audio podcasting."

        >>> msg = get_feature_upgrade_message("live_streaming", SubscriptionTier.PREMIUM)
        >>> print(msg)
        "Upgrade to Enterprise tier to unlock live streaming."
    """
    try:
        required_tier = get_required_tier(feature)

        # Friendly feature names
        feature_names = {
            "podcast_audio": "audio podcasting",
            "podcast_video": "video podcasting",
            "youtube_integration": "YouTube integration",
            "live_streaming": "live streaming",
            "transcription_basic": "AI transcription",
            "transcription_ai_enhanced": "enhanced AI transcription",
            "transcription_multi_language": "multi-language transcription",
            "advanced_analytics": "advanced analytics",
            "white_label": "white-label branding",
            "api_access": "API access",
        }

        feature_name = feature_names.get(feature, feature.replace("_", " "))

        return f"Upgrade to {get_tier_label(required_tier)} tier to unlock {feature_name}."

    except FeatureNotFoundError:
        return f"This feature requires a subscription upgrade."
