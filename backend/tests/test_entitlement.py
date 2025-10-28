"""Tests for feature entitlement service.

Tests tier-based feature access control using the entitlement service.
Following TDD: RED → GREEN → REFACTOR
"""
import pytest
from unittest.mock import patch, AsyncMock

from app.services.entitlement_service import (
    check_feature_access,
    get_features_for_tier,
    FeatureNotFoundError,
)
from app.core.subscription import SubscriptionTier


class TestCheckFeatureAccess:
    """Tests for check_feature_access function."""

    @pytest.mark.asyncio
    async def test_professional_has_audio_podcast_access(self):
        """Test Professional tier has access to audio podcasts."""
        org_id = "org_professional"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PROFESSIONAL

            has_access = await check_feature_access(org_id, "podcast_audio")

            assert has_access is True
            mock_get_tier.assert_called_once_with(org_id)

    @pytest.mark.asyncio
    async def test_starter_no_audio_podcast_access(self):
        """Test Starter tier does NOT have access to audio podcasts."""
        org_id = "org_starter"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.STARTER

            has_access = await check_feature_access(org_id, "podcast_audio")

            assert has_access is False

    @pytest.mark.asyncio
    async def test_professional_no_video_podcast_access(self):
        """Test Professional tier does NOT have access to video podcasts."""
        org_id = "org_professional"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PROFESSIONAL

            has_access = await check_feature_access(org_id, "podcast_video")

            assert has_access is False

    @pytest.mark.asyncio
    async def test_premium_has_video_podcast_access(self):
        """Test Premium tier has access to video podcasts."""
        org_id = "org_premium"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PREMIUM

            has_access = await check_feature_access(org_id, "podcast_video")

            assert has_access is True

    @pytest.mark.asyncio
    async def test_premium_has_youtube_integration(self):
        """Test Premium tier has access to YouTube integration."""
        org_id = "org_premium"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PREMIUM

            has_access = await check_feature_access(org_id, "youtube_integration")

            assert has_access is True

    @pytest.mark.asyncio
    async def test_professional_no_youtube_integration(self):
        """Test Professional tier does NOT have YouTube integration."""
        org_id = "org_professional"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PROFESSIONAL

            has_access = await check_feature_access(org_id, "youtube_integration")

            assert has_access is False

    @pytest.mark.asyncio
    async def test_enterprise_has_live_streaming(self):
        """Test Enterprise tier has access to live streaming."""
        org_id = "org_enterprise"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.ENTERPRISE

            has_access = await check_feature_access(org_id, "live_streaming")

            assert has_access is True

    @pytest.mark.asyncio
    async def test_premium_no_live_streaming(self):
        """Test Premium tier does NOT have live streaming."""
        org_id = "org_premium"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PREMIUM

            has_access = await check_feature_access(org_id, "live_streaming")

            assert has_access is False

    @pytest.mark.asyncio
    async def test_enterprise_has_multi_language_transcription(self):
        """Test Enterprise tier has multi-language transcription."""
        org_id = "org_enterprise"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.ENTERPRISE

            has_access = await check_feature_access(org_id, "transcription_multi_language")

            assert has_access is True

    @pytest.mark.asyncio
    async def test_professional_has_basic_transcription(self):
        """Test Professional tier has basic transcription."""
        org_id = "org_professional"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PROFESSIONAL

            has_access = await check_feature_access(org_id, "transcription_basic")

            assert has_access is True

    @pytest.mark.asyncio
    async def test_professional_no_ai_enhanced_transcription(self):
        """Test Professional tier does NOT have AI-enhanced transcription."""
        org_id = "org_professional"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PROFESSIONAL

            has_access = await check_feature_access(org_id, "transcription_ai_enhanced")

            assert has_access is False

    @pytest.mark.asyncio
    async def test_raises_feature_not_found_for_invalid_feature(self):
        """Test raises FeatureNotFoundError for non-existent feature."""
        org_id = "org_any"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.PREMIUM

            with pytest.raises(FeatureNotFoundError) as exc_info:
                await check_feature_access(org_id, "nonexistent_feature")

            assert "Feature 'nonexistent_feature' not found" in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_all_tiers_have_core_features(self):
        """Test all tiers (including starter) have access to core features."""
        org_id = "org_starter"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = SubscriptionTier.STARTER

            # All tiers should have access to core features
            has_access = await check_feature_access(org_id, "deal_management")

            assert has_access is True


class TestGetFeaturesForTier:
    """Tests for get_features_for_tier function."""

    def test_starter_tier_features(self):
        """Test Starter tier returns correct feature list."""
        features = get_features_for_tier(SubscriptionTier.STARTER)

        assert "deal_management" in features
        assert "data_room" in features
        assert "podcast_audio" not in features
        assert "youtube_integration" not in features
        assert "live_streaming" not in features

    def test_professional_tier_features(self):
        """Test Professional tier returns correct feature list."""
        features = get_features_for_tier(SubscriptionTier.PROFESSIONAL)

        # Professional has all starter features
        assert "deal_management" in features
        assert "data_room" in features

        # Plus podcast features
        assert "podcast_audio" in features
        assert "transcription_basic" in features

        # But not premium features
        assert "podcast_video" not in features
        assert "youtube_integration" not in features
        assert "live_streaming" not in features

    def test_premium_tier_features(self):
        """Test Premium tier returns correct feature list."""
        features = get_features_for_tier(SubscriptionTier.PREMIUM)

        # Premium has all professional features
        assert "podcast_audio" in features
        assert "transcription_basic" in features

        # Plus premium-only features
        assert "podcast_video" in features
        assert "youtube_integration" in features
        assert "transcription_ai_enhanced" in features

        # But not enterprise features
        assert "live_streaming" not in features
        assert "transcription_multi_language" not in features

    def test_enterprise_tier_features(self):
        """Test Enterprise tier returns all features."""
        features = get_features_for_tier(SubscriptionTier.ENTERPRISE)

        # Enterprise has everything
        assert "deal_management" in features
        assert "podcast_audio" in features
        assert "podcast_video" in features
        assert "youtube_integration" in features
        assert "live_streaming" in features
        assert "transcription_multi_language" in features


class TestFeatureEntitlementMatrix:
    """Tests to verify the complete feature entitlement matrix."""

    @pytest.mark.parametrize("tier,feature,expected", [
        # Starter tier (no podcast features)
        (SubscriptionTier.STARTER, "podcast_audio", False),
        (SubscriptionTier.STARTER, "podcast_video", False),
        (SubscriptionTier.STARTER, "youtube_integration", False),
        (SubscriptionTier.STARTER, "live_streaming", False),
        (SubscriptionTier.STARTER, "deal_management", True),

        # Professional tier (audio only)
        (SubscriptionTier.PROFESSIONAL, "podcast_audio", True),
        (SubscriptionTier.PROFESSIONAL, "podcast_video", False),
        (SubscriptionTier.PROFESSIONAL, "youtube_integration", False),
        (SubscriptionTier.PROFESSIONAL, "live_streaming", False),
        (SubscriptionTier.PROFESSIONAL, "transcription_basic", True),
        (SubscriptionTier.PROFESSIONAL, "transcription_ai_enhanced", False),

        # Premium tier (audio + video + YouTube)
        (SubscriptionTier.PREMIUM, "podcast_audio", True),
        (SubscriptionTier.PREMIUM, "podcast_video", True),
        (SubscriptionTier.PREMIUM, "youtube_integration", True),
        (SubscriptionTier.PREMIUM, "live_streaming", False),
        (SubscriptionTier.PREMIUM, "transcription_basic", True),
        (SubscriptionTier.PREMIUM, "transcription_ai_enhanced", True),
        (SubscriptionTier.PREMIUM, "transcription_multi_language", False),

        # Enterprise tier (all features)
        (SubscriptionTier.ENTERPRISE, "podcast_audio", True),
        (SubscriptionTier.ENTERPRISE, "podcast_video", True),
        (SubscriptionTier.ENTERPRISE, "youtube_integration", True),
        (SubscriptionTier.ENTERPRISE, "live_streaming", True),
        (SubscriptionTier.ENTERPRISE, "transcription_basic", True),
        (SubscriptionTier.ENTERPRISE, "transcription_ai_enhanced", True),
        (SubscriptionTier.ENTERPRISE, "transcription_multi_language", True),
    ])
    @pytest.mark.asyncio
    async def test_feature_entitlement_matrix(self, tier, feature, expected):
        """Test complete feature entitlement matrix across all tiers."""
        org_id = f"org_{tier.value}"

        with patch('app.services.entitlement_service.get_organization_tier') as mock_get_tier:
            mock_get_tier.return_value = tier

            if feature == "nonexistent_feature":
                with pytest.raises(FeatureNotFoundError):
                    await check_feature_access(org_id, feature)
            else:
                has_access = await check_feature_access(org_id, feature)
                assert has_access is expected, (
                    f"{tier.value} tier should {'have' if expected else 'NOT have'} "
                    f"access to {feature}"
                )


class TestFeatureNotFoundError:
    """Tests for FeatureNotFoundError exception."""

    def test_feature_not_found_error_message(self):
        """Test FeatureNotFoundError can be raised with custom message."""
        with pytest.raises(FeatureNotFoundError) as exc_info:
            raise FeatureNotFoundError("Feature 'test_feature' not found")

        assert "test_feature" in str(exc_info.value)
