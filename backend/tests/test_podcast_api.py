"""API tests for podcast subscription enforcement (DEV-016)."""

from __future__ import annotations

from datetime import datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch, ANY

from app.services.quota_service import QuotaExceededError
from app.schemas.podcast import PodcastQuotaSummary

from fastapi import status

from app.main import app
from app.api.dependencies.auth import get_current_user
from app.core.subscription import SubscriptionTier
from app.models.user import UserRole

EPISODE_PAYLOAD = {
    "title": "Professional Tier Episode",
    "description": "Episode description",
    "episode_number": 1,
    "season_number": 1,
    "audio_file_url": "https://cdn.example.com/audio.mp3",
    "video_file_url": None,
}


def _override_user(user):
    app.dependency_overrides[get_current_user] = lambda: user


def _clear_override():
    app.dependency_overrides.pop(get_current_user, None)


class TestPodcastEpisodeCreation:
    """Ensure podcast creation honours subscription entitlements and quotas."""

    def test_starter_user_blocked_from_creating_episode(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="starter")
        starter_user = create_user(role=UserRole.solo, organization_id=org.id)
        starter_user.subscription_tier = SubscriptionTier.STARTER.value

        _override_user(starter_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.api.dependencies.auth.get_required_tier"
            ) as mock_required, patch(
                "app.api.dependencies.auth.get_feature_upgrade_message"
            ) as mock_message:
                mock_feature.return_value = False
                mock_required.return_value = SubscriptionTier.PROFESSIONAL
                mock_message.return_value = (
                    "Upgrade to Professional tier to unlock audio podcasting."
                )

                response = client.post("/podcasts/episodes", json=EPISODE_PAYLOAD)

            assert response.status_code == status.HTTP_403_FORBIDDEN
            assert response.headers["X-Required-Tier"] == "professional"
            assert "Upgrade" in response.json()["detail"]
        finally:
            _clear_override()

    def test_quota_service_passes_db_session(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        professional_user = create_user(role=UserRole.growth, organization_id=org.id)
        professional_user.subscription_tier = SubscriptionTier.PROFESSIONAL.value

        _override_user(professional_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.quota_service.check_episode_quota",
                new_callable=AsyncMock,
            ) as mock_quota, patch(
                "app.services.quota_service.increment_episode_count",
                new_callable=AsyncMock,
            ) as mock_increment:
                mock_feature.return_value = True
                mock_quota.return_value = True

                response = client.post("/podcasts/episodes", json=EPISODE_PAYLOAD)

            assert response.status_code == status.HTTP_201_CREATED
            mock_quota.assert_awaited_once()
            assert "db" in mock_quota.await_args.kwargs
            assert mock_quota.await_args.kwargs["db"] is not None
        finally:
            _clear_override()
    def test_professional_user_can_create_episode(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        professional_user = create_user(role=UserRole.growth, organization_id=org.id)
        professional_user.subscription_tier = SubscriptionTier.PROFESSIONAL.value

        _override_user(professional_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.quota_service.check_episode_quota",
                new_callable=AsyncMock,
            ) as mock_quota, patch(
                "app.services.quota_service.increment_episode_count",
                new_callable=AsyncMock,
            ) as mock_increment:
                mock_feature.return_value = True
                mock_quota.return_value = True

                response = client.post("/podcasts/episodes", json=EPISODE_PAYLOAD)

            assert response.status_code == status.HTTP_201_CREATED
            body = response.json()
            assert body["title"] == EPISODE_PAYLOAD["title"]
            mock_feature.assert_awaited_once()
            mock_quota.assert_awaited_once()
            assert mock_quota.await_args.kwargs["organization_id"] == professional_user.organization_id
            assert mock_quota.await_args.kwargs["db"] is not None

            mock_increment.assert_awaited_once()
            assert mock_increment.await_args.kwargs["organization_id"] == professional_user.organization_id
            assert mock_increment.await_args.kwargs["db"] is not None
        finally:
            _clear_override()
    def test_professional_user_quota_exceeded_returns_429(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        professional_user = create_user(role=UserRole.growth, organization_id=org.id)
        professional_user.subscription_tier = SubscriptionTier.PROFESSIONAL.value

        _override_user(professional_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.quota_service.check_episode_quota",
                new_callable=AsyncMock,
            ) as mock_quota:
                mock_feature.return_value = True
                mock_quota.side_effect = QuotaExceededError("Monthly quota exceeded")

                response = client.post("/podcasts/episodes", json=EPISODE_PAYLOAD)

            assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
            assert "quota" in response.json()["detail"].lower()
        finally:
            _clear_override()

    def test_professional_user_blocked_from_video_episode(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        professional_user = create_user(role=UserRole.growth, organization_id=org.id)
        professional_user.subscription_tier = SubscriptionTier.PROFESSIONAL.value

        payload = {**EPISODE_PAYLOAD, "video_file_url": "https://cdn.example.com/video.mp4"}

        _override_user(professional_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.quota_service.check_episode_quota",
                new_callable=AsyncMock,
            ) as mock_quota:
                mock_feature.side_effect = [True, False]
                mock_quota.return_value = True

                response = client.post("/podcasts/episodes", json=payload)

            assert response.status_code == status.HTTP_403_FORBIDDEN
            assert "upgrade" in response.json()["detail"].lower()
        finally:
            _clear_override()

    def test_premium_user_can_create_video_episode(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="premium")
        premium_user = create_user(role=UserRole.enterprise, organization_id=org.id)
        premium_user.subscription_tier = SubscriptionTier.PREMIUM.value

        payload = {**EPISODE_PAYLOAD, "video_file_url": "https://cdn.example.com/video.mp4"}

        _override_user(premium_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.quota_service.check_episode_quota",
                new_callable=AsyncMock,
            ) as mock_quota, patch(
                "app.services.quota_service.increment_episode_count",
                new_callable=AsyncMock,
            ) as mock_increment:
                mock_feature.side_effect = [True, True]
                mock_quota.return_value = True
                mock_increment.return_value = None

                response = client.post("/podcasts/episodes", json=payload)

            assert response.status_code == status.HTTP_201_CREATED
            body = response.json()
            assert body["video_file_url"] == payload["video_file_url"]
            assert mock_feature.await_count == 2
        finally:
            _clear_override()


class TestPodcastUsageEndpoint:
    """Tests for upcoming /podcasts/usage quota summary endpoint."""

    def test_usage_endpoint_returns_quota_summary_for_professional(
        self,
        client,
    ) -> None:
        organization_id = "org_professional"
        professional_user = SimpleNamespace(
            id="user-professional",
            organization_id=organization_id,
        )

        _override_user(professional_user)
        expected_period = datetime.utcnow().strftime("%Y-%m")

        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.api.routes.podcasts.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.api.routes.podcasts.get_quota_summary",
                new_callable=AsyncMock,
            ) as mock_summary:
                mock_tier.return_value = SubscriptionTier.PROFESSIONAL
                mock_feature.return_value = True
                mock_summary.return_value = PodcastQuotaSummary(
                    tier=SubscriptionTier.PROFESSIONAL.value,
                    limit=10,
                    remaining=7,
                    used=3,
                    is_unlimited=False,
                    period=expected_period,
                )

                response = client.get("/podcasts/usage")

            assert response.status_code == status.HTTP_200_OK
            mock_summary.assert_awaited_once()
            assert mock_summary.await_args.kwargs == {
                "organization_id": professional_user.organization_id,
                "tier": SubscriptionTier.PROFESSIONAL,
                "db": ANY,
            }

            payload = response.json()
            assert payload == {
                "tier": SubscriptionTier.PROFESSIONAL.value,
                "limit": 10,
                "remaining": 7,
                "used": 3,
                "is_unlimited": False,
                "period": expected_period,
            }
        finally:
            _clear_override()

    def test_usage_endpoint_reports_unlimited_for_premium(
        self,
        client,
    ) -> None:
        organization_id = "org_premium"
        premium_user = SimpleNamespace(
            id="user-premium",
            organization_id=organization_id,
        )

        _override_user(premium_user)
        expected_period = datetime.utcnow().strftime("%Y-%m")

        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.api.routes.podcasts.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.api.routes.podcasts.get_quota_summary",
                new_callable=AsyncMock,
            ) as mock_summary:
                mock_tier.return_value = SubscriptionTier.PREMIUM
                mock_feature.return_value = True
                mock_summary.return_value = PodcastQuotaSummary(
                    tier=SubscriptionTier.PREMIUM.value,
                    limit=None,
                    remaining=-1,
                    used=5,
                    is_unlimited=True,
                    period=expected_period,
                )

                response = client.get("/podcasts/usage")

            assert response.status_code == status.HTTP_200_OK
            mock_summary.assert_awaited_once()
            assert mock_summary.await_args.kwargs == {
                "organization_id": premium_user.organization_id,
                "tier": SubscriptionTier.PREMIUM,
                "db": ANY,
            }

            payload = response.json()
            assert payload == {
                "tier": SubscriptionTier.PREMIUM.value,
                "limit": None,
                "remaining": -1,
                "used": 5,
                "is_unlimited": True,
                "period": expected_period,
            }
        finally:
            _clear_override()

    def test_usage_endpoint_blocks_starter_tier(
        self,
        client,
    ) -> None:
        starter_user = SimpleNamespace(
            id="user-starter",
            organization_id="org_starter",
        )

        _override_user(starter_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.api.dependencies.auth.get_required_tier"
            ) as mock_required, patch(
                "app.api.dependencies.auth.get_feature_upgrade_message"
            ) as mock_message, patch(
                "app.core.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.services.quota_service.get_quota_summary",
                new_callable=AsyncMock,
            ) as mock_summary:
                mock_tier.return_value = SubscriptionTier.STARTER
                mock_feature.return_value = False
                mock_required.return_value = SubscriptionTier.PROFESSIONAL
                mock_message.return_value = (
                    "Upgrade to Professional tier to unlock audio podcasting."
                )

                response = client.get("/podcasts/usage")

            assert response.status_code == status.HTTP_403_FORBIDDEN
            assert response.headers["X-Required-Tier"] == "professional"
            assert "Upgrade" in response.json()["detail"]
            mock_summary.assert_not_awaited()
            mock_tier.assert_not_called()
        finally:
            _clear_override()








