"""Tests for API middleware tier-based feature gating.

Tests the require_feature() FastAPI dependency that enforces subscription
tier-based access control by returning 403 for insufficient tiers.

Following TDD: RED → GREEN → REFACTOR
"""
import pytest
from unittest.mock import patch, AsyncMock, Mock
from fastapi import HTTPException

from app.api.dependencies.auth import require_feature
from app.models.user import User
from app.services.entitlement_service import FeatureNotFoundError
from app.core.subscription import SubscriptionTier


def create_mock_user(
    user_id: str = "user_123",
    organization_id: str = "org_123",
    tier: SubscriptionTier = SubscriptionTier.PROFESSIONAL
) -> User:
    """Helper to create mock user for testing."""
    user = Mock(spec=User)
    user.id = user_id
    user.organization_id = organization_id
    user.subscription_tier = tier
    user.email = f"{user_id}@example.com"
    return user


class TestRequireFeatureProfessionalTier:
    """Tests for Professional tier access (podcast_audio)."""

    @pytest.mark.asyncio
    async def test_professional_tier_allowed_podcast_audio_access(self):
        """Test Professional tier allowed to access podcast_audio features."""
        mock_user = create_mock_user(tier=SubscriptionTier.PROFESSIONAL)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            mock_check.return_value = True

            # Call middleware
            middleware = require_feature("podcast_audio")
            result = await middleware(current_user=mock_user)

            # Should return user without exception
            assert result == mock_user
            mock_check.assert_called_once_with(mock_user.organization_id, "podcast_audio")

    @pytest.mark.asyncio
    async def test_starter_tier_blocked_from_podcast_audio(self):
        """Test Starter tier blocked from podcast_audio with 403."""
        mock_user = create_mock_user(tier=SubscriptionTier.STARTER)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    mock_check.return_value = False
                    mock_required.return_value = SubscriptionTier.PROFESSIONAL
                    mock_message.return_value = "Upgrade to Professional tier to unlock audio podcasting."

                    middleware = require_feature("podcast_audio")

                    with pytest.raises(HTTPException) as exc_info:
                        await middleware(current_user=mock_user)

                    # Verify 403 status
                    assert exc_info.value.status_code == 403

    @pytest.mark.asyncio
    async def test_403_response_includes_upgrade_message(self):
        """Test 403 response includes user-friendly upgrade message."""
        mock_user = create_mock_user(tier=SubscriptionTier.STARTER)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    mock_check.return_value = False
                    mock_required.return_value = SubscriptionTier.PROFESSIONAL
                    upgrade_msg = "Upgrade to Professional tier to unlock audio podcasting."
                    mock_message.return_value = upgrade_msg

                    middleware = require_feature("podcast_audio")

                    with pytest.raises(HTTPException) as exc_info:
                        await middleware(current_user=mock_user)

                    # Verify upgrade message in detail
                    assert exc_info.value.detail == upgrade_msg
                    assert "Professional" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_403_includes_required_tier_header(self):
        """Test 403 response includes X-Required-Tier header."""
        mock_user = create_mock_user(tier=SubscriptionTier.STARTER)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    mock_check.return_value = False
                    mock_required.return_value = SubscriptionTier.PROFESSIONAL
                    mock_message.return_value = "Upgrade to Professional"

                    middleware = require_feature("podcast_audio")

                    with pytest.raises(HTTPException) as exc_info:
                        await middleware(current_user=mock_user)

                    # Verify X-Required-Tier header
                    assert "X-Required-Tier" in exc_info.value.headers
                    assert exc_info.value.headers["X-Required-Tier"] == "professional"

    @pytest.mark.asyncio
    async def test_403_includes_upgrade_url_header(self):
        """Test 403 response includes X-Upgrade-URL header."""
        mock_user = create_mock_user(tier=SubscriptionTier.STARTER)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    mock_check.return_value = False
                    mock_required.return_value = SubscriptionTier.PROFESSIONAL
                    mock_message.return_value = "Upgrade"

                    middleware = require_feature("podcast_audio")

                    with pytest.raises(HTTPException) as exc_info:
                        await middleware(current_user=mock_user)

                    # Verify X-Upgrade-URL header
                    assert "X-Upgrade-URL" in exc_info.value.headers
                    assert exc_info.value.headers["X-Upgrade-URL"] == "/pricing"


class TestRequireFeatureVideoAccess:
    """Tests for video podcast access (Premium+ tiers)."""

    @pytest.mark.asyncio
    async def test_premium_tier_allowed_video_access(self):
        """Test Premium tier allowed to access podcast_video features."""
        mock_user = create_mock_user(tier=SubscriptionTier.PREMIUM)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            mock_check.return_value = True

            middleware = require_feature("podcast_video")
            result = await middleware(current_user=mock_user)

            assert result == mock_user

    @pytest.mark.asyncio
    async def test_professional_tier_blocked_from_video(self):
        """Test Professional tier blocked from podcast_video with 403."""
        mock_user = create_mock_user(tier=SubscriptionTier.PROFESSIONAL)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    mock_check.return_value = False
                    mock_required.return_value = SubscriptionTier.PREMIUM
                    mock_message.return_value = "Upgrade to Premium"

                    middleware = require_feature("podcast_video")

                    with pytest.raises(HTTPException) as exc_info:
                        await middleware(current_user=mock_user)

                    assert exc_info.value.status_code == 403
                    assert exc_info.value.headers["X-Required-Tier"] == "premium"


class TestRequireFeatureYouTubeAccess:
    """Tests for YouTube integration access (Premium+ tiers)."""

    @pytest.mark.asyncio
    async def test_premium_tier_allowed_youtube_access(self):
        """Test Premium tier allowed to access YouTube integration."""
        mock_user = create_mock_user(tier=SubscriptionTier.PREMIUM)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            mock_check.return_value = True

            middleware = require_feature("youtube_integration")
            result = await middleware(current_user=mock_user)

            assert result == mock_user

    @pytest.mark.asyncio
    async def test_professional_tier_blocked_from_youtube(self):
        """Test Professional tier blocked from YouTube integration with 403."""
        mock_user = create_mock_user(tier=SubscriptionTier.PROFESSIONAL)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    mock_check.return_value = False
                    mock_required.return_value = SubscriptionTier.PREMIUM
                    mock_message.return_value = "Upgrade to Premium"

                    middleware = require_feature("youtube_integration")

                    with pytest.raises(HTTPException) as exc_info:
                        await middleware(current_user=mock_user)

                    assert exc_info.value.status_code == 403


class TestRequireFeatureLiveStreaming:
    """Tests for live streaming access (Enterprise only)."""

    @pytest.mark.asyncio
    async def test_enterprise_tier_allowed_live_streaming(self):
        """Test Enterprise tier allowed to access live streaming."""
        mock_user = create_mock_user(tier=SubscriptionTier.ENTERPRISE)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            mock_check.return_value = True

            middleware = require_feature("live_streaming")
            result = await middleware(current_user=mock_user)

            assert result == mock_user

    @pytest.mark.asyncio
    async def test_premium_tier_blocked_from_live_streaming(self):
        """Test Premium tier blocked from live streaming with 403."""
        mock_user = create_mock_user(tier=SubscriptionTier.PREMIUM)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    mock_check.return_value = False
                    mock_required.return_value = SubscriptionTier.ENTERPRISE
                    mock_message.return_value = "Upgrade to Enterprise"

                    middleware = require_feature("live_streaming")

                    with pytest.raises(HTTPException) as exc_info:
                        await middleware(current_user=mock_user)

                    assert exc_info.value.status_code == 403
                    assert exc_info.value.headers["X-Required-Tier"] == "enterprise"


class TestRequireFeatureEdgeCases:
    """Tests for edge cases and integration scenarios."""

    @pytest.mark.asyncio
    async def test_middleware_works_with_multiple_features(self):
        """Test middleware can be applied to multiple features independently."""
        mock_user = create_mock_user(tier=SubscriptionTier.PREMIUM)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            # Premium has audio, video, YouTube, but not streaming
            def check_access(org_id, feature):
                return feature != "live_streaming"

            mock_check.side_effect = check_access

            # Should allow audio
            audio_middleware = require_feature("podcast_audio")
            result = await audio_middleware(current_user=mock_user)
            assert result == mock_user

            # Should allow video
            video_middleware = require_feature("podcast_video")
            result = await video_middleware(current_user=mock_user)
            assert result == mock_user

    @pytest.mark.asyncio
    async def test_middleware_integrates_with_get_current_user(self):
        """Test middleware works as FastAPI dependency with get_current_user."""
        # This test verifies the dependency chain works correctly
        mock_user = create_mock_user()

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            mock_check.return_value = True

            # Middleware should accept current_user from get_current_user
            middleware = require_feature("podcast_audio")
            result = await middleware(current_user=mock_user)

            assert result == mock_user
            assert result.organization_id == "org_123"

    @pytest.mark.asyncio
    async def test_middleware_logs_blocked_requests(self):
        """Test middleware logs warning when request is blocked."""
        mock_user = create_mock_user(tier=SubscriptionTier.STARTER)

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            with patch('app.api.dependencies.auth.get_required_tier') as mock_required:
                with patch('app.api.dependencies.auth.get_feature_upgrade_message') as mock_message:
                    with patch('app.api.dependencies.auth.logger') as mock_logger:
                        mock_check.return_value = False
                        mock_required.return_value = SubscriptionTier.PROFESSIONAL
                        mock_message.return_value = "Upgrade"

                        middleware = require_feature("podcast_audio")

                        with pytest.raises(HTTPException):
                            await middleware(current_user=mock_user)

                        # Verify logging occurred
                        mock_logger.warning.assert_called()
                        log_message = mock_logger.warning.call_args[0][0]
                        assert "Feature" in log_message or "blocked" in log_message.lower()

    @pytest.mark.asyncio
    async def test_invalid_feature_raises_feature_not_found_error(self):
        """Test middleware raises FeatureNotFoundError for invalid feature."""
        mock_user = create_mock_user()

        with patch('app.api.dependencies.auth.check_feature_access', new_callable=AsyncMock) as mock_check:
            # Simulate FeatureNotFoundError from entitlement service
            mock_check.side_effect = FeatureNotFoundError("Feature 'invalid_feature' not found")

            middleware = require_feature("invalid_feature")

            with pytest.raises(FeatureNotFoundError) as exc_info:
                await middleware(current_user=mock_user)

            assert "invalid_feature" in str(exc_info.value)
