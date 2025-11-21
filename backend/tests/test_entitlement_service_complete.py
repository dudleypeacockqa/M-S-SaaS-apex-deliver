"""
Tests for Entitlement Service - Complete Coverage (Phase 3.5)
TDD: RED → GREEN → REFACTOR
Feature: Complete coverage for entitlement service utility functions
"""
import pytest

from app.services.entitlement_service import (
    get_tier_label,
    get_feature_upgrade_cta,
    get_required_tier,
    get_feature_upgrade_message,
    FeatureNotFoundError,
)
from app.core.subscription import SubscriptionTier


class TestEntitlementServiceUtilities:
    """Test utility functions in entitlement service for complete coverage"""
    
    def test_get_tier_label_starter(self):
        """Test get_tier_label returns correct label for Starter tier."""
        label = get_tier_label(SubscriptionTier.STARTER)
        assert label == "Starter"
    
    def test_get_tier_label_professional(self):
        """Test get_tier_label returns correct label for Professional tier."""
        label = get_tier_label(SubscriptionTier.PROFESSIONAL)
        assert label == "Professional"
    
    def test_get_tier_label_premium(self):
        """Test get_tier_label returns correct label for Premium tier."""
        label = get_tier_label(SubscriptionTier.PREMIUM)
        assert label == "Premium"
    
    def test_get_tier_label_enterprise(self):
        """Test get_tier_label returns correct label for Enterprise tier."""
        label = get_tier_label(SubscriptionTier.ENTERPRISE)
        assert label == "Enterprise"
    
    def test_get_tier_label_unknown(self):
        """Test get_tier_label returns fallback for unknown tier."""
        # Create a mock tier that's not in TIER_LABELS
        from enum import Enum
        
        class UnknownTier(Enum):
            UNKNOWN = "unknown"
        
        label = get_tier_label(UnknownTier.UNKNOWN)
        assert label == "Unknown"  # .title() on "unknown"
    
    def test_get_feature_upgrade_cta_existing_feature(self):
        """Test get_feature_upgrade_cta returns correct CTA for existing feature."""
        cta = get_feature_upgrade_cta("podcast_audio")
        assert cta == "/pricing"
    
    def test_get_feature_upgrade_cta_non_existing_feature(self):
        """Test get_feature_upgrade_cta returns default CTA for non-existing feature."""
        cta = get_feature_upgrade_cta("nonexistent_feature")
        assert cta == "/pricing"  # DEFAULT_UPGRADE_CTA
    
    def test_get_required_tier_starter_feature(self):
        """Test get_required_tier returns Starter for core features."""
        tier = get_required_tier("deal_management")
        assert tier == SubscriptionTier.STARTER
    
    def test_get_required_tier_professional_feature(self):
        """Test get_required_tier returns Professional for professional-tier features."""
        tier = get_required_tier("podcast_audio")
        assert tier == SubscriptionTier.PROFESSIONAL
    
    def test_get_required_tier_premium_feature(self):
        """Test get_required_tier returns Premium for premium-tier features."""
        tier = get_required_tier("podcast_video")
        assert tier == SubscriptionTier.PREMIUM
    
    def test_get_required_tier_enterprise_feature(self):
        """Test get_required_tier returns Enterprise for enterprise-only features."""
        tier = get_required_tier("live_streaming")
        assert tier == SubscriptionTier.ENTERPRISE
    
    def test_get_required_tier_raises_feature_not_found(self):
        """Test get_required_tier raises FeatureNotFoundError for non-existent feature."""
        with pytest.raises(FeatureNotFoundError) as exc_info:
            get_required_tier("nonexistent_feature")
        
        assert "Feature 'nonexistent_feature' not found" in str(exc_info.value)
    
    def test_get_feature_upgrade_message_starter_tier(self):
        """Test get_feature_upgrade_message for Starter tier."""
        message = get_feature_upgrade_message("podcast_audio", SubscriptionTier.STARTER)
        assert "Professional" in message
        assert "podcast_audio" in message.lower() or "podcast" in message.lower()
    
    def test_get_feature_upgrade_message_professional_tier(self):
        """Test get_feature_upgrade_message for Professional tier."""
        message = get_feature_upgrade_message("podcast_video", SubscriptionTier.PROFESSIONAL)
        assert "Premium" in message
        assert "podcast_video" in message.lower() or "video" in message.lower()
    
    def test_get_feature_upgrade_message_premium_tier(self):
        """Test get_feature_upgrade_message for Premium tier."""
        message = get_feature_upgrade_message("live_streaming", SubscriptionTier.PREMIUM)
        assert "Enterprise" in message
        assert "live_streaming" in message.lower() or "live" in message.lower()
    
    def test_get_feature_upgrade_message_enterprise_tier(self):
        """Test get_feature_upgrade_message for Enterprise tier (should indicate already has access)."""
        message = get_feature_upgrade_message("podcast_audio", SubscriptionTier.ENTERPRISE)
        # Enterprise already has access to most features
        assert message  # Should return some message
    
    def test_get_feature_upgrade_message_same_tier_required(self):
        """Test get_feature_upgrade_message when current tier already has access."""
        message = get_feature_upgrade_message("deal_management", SubscriptionTier.STARTER)
        # STARTER already has deal_management, so message might indicate no upgrade needed
        assert message  # Should return some message
    
    def test_get_feature_upgrade_message_handles_unknown_feature(self):
        """Test get_feature_upgrade_message handles non-existent feature gracefully."""
        # get_feature_upgrade_message catches FeatureNotFoundError and returns default message
        message = get_feature_upgrade_message("nonexistent_feature", SubscriptionTier.STARTER)
        assert "subscription upgrade" in message.lower()

