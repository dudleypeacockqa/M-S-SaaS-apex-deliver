"""API tests for podcast subscription enforcement (DEV-016)."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

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
            mock_increment.assert_awaited_once()
        finally:
            _clear_override()
