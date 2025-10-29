"""API tests for podcast subscription enforcement (DEV-016)."""

from __future__ import annotations

from datetime import datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch, ANY

from app.services.quota_service import QuotaExceededError
from app.schemas.podcast import PodcastQuotaSummary
from app.services.entitlement_service import FeatureNotFoundError

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

                response = client.post("/api/podcasts/episodes", json=EPISODE_PAYLOAD)

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

                response = client.post("/api/podcasts/episodes", json=EPISODE_PAYLOAD)

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

                response = client.post("/api/podcasts/episodes", json=EPISODE_PAYLOAD)

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

                response = client.post("/api/podcasts/episodes", json=EPISODE_PAYLOAD)

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

                response = client.post("/api/podcasts/episodes", json=payload)

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

                response = client.post("/api/podcasts/episodes", json=payload)

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
                    tier_label="Professional",
                    quota_state="normal",
                    warning_status=None,
                    warning_message=None,
                    upgrade_required=False,
                    upgrade_message=None,
                    upgrade_cta_url=None,
                )

                response = client.get("/api/podcasts/usage")

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
                "tier_label": SubscriptionTier.PROFESSIONAL.value.title(),
                "quota_state": "normal",
                "warning_status": None,
                "warning_message": None,
                "upgrade_required": False,
                "upgrade_message": None,
                "upgrade_cta_url": None,
            }
            assert "X-Podcast-Quota-Warning" not in response.headers
            assert "X-Podcast-Upgrade-Required" not in response.headers
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
                    tier_label="Premium",
                    quota_state="unlimited",
                    warning_status=None,
                    warning_message=None,
                    upgrade_required=False,
                    upgrade_message=None,
                    upgrade_cta_url=None,
                )

                response = client.get("/api/podcasts/usage")

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
                "tier_label": SubscriptionTier.PREMIUM.value.title(),
                "quota_state": "unlimited",
                "warning_status": None,
                "warning_message": None,
                "upgrade_required": False,
                "upgrade_message": None,
                "upgrade_cta_url": None,
            }
            assert "X-Podcast-Quota-Warning" not in response.headers
            assert "X-Podcast-Upgrade-Required" not in response.headers
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
                "app.api.routes.podcasts.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.api.routes.podcasts.get_quota_summary",
                new_callable=AsyncMock,
            ) as mock_summary:
                mock_feature.return_value = False
                mock_required.return_value = SubscriptionTier.PROFESSIONAL
                mock_message.return_value = (
                    "Upgrade to Professional tier to unlock audio podcasting."
                )

                response = client.get("/api/podcasts/usage")

            assert response.status_code == status.HTTP_403_FORBIDDEN
            assert response.headers["X-Required-Tier"] == "professional"
            assert "Upgrade" in response.json()["detail"]
            mock_summary.assert_not_awaited()
            mock_tier.assert_not_called()
        finally:
            _clear_override()

    def test_usage_endpoint_sets_warning_headers_when_near_limit(
        self,
        client,
    ) -> None:
        organization_id = "org_warning"
        user = SimpleNamespace(id="user-warning", organization_id=organization_id)

        _override_user(user)
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
                mock_feature.return_value = True
                mock_tier.return_value = SubscriptionTier.PROFESSIONAL
                mock_summary.return_value = PodcastQuotaSummary(
                    tier=SubscriptionTier.PROFESSIONAL.value,
                    limit=10,
                    remaining=2,
                    used=8,
                    is_unlimited=False,
                    period=expected_period,
                    tier_label="Professional",
                    quota_state="warning",
                    warning_status="warning",
                    warning_message="80% of monthly quota used (8/10). 2 episodes remaining this month.",
                    upgrade_required=False,
                    upgrade_message=None,
                    upgrade_cta_url=None,
                )

                response = client.get("/api/podcasts/usage")

            assert response.status_code == status.HTTP_200_OK
            assert response.headers["X-Podcast-Quota-Warning"] == "warning"
            assert (
                response.headers["X-Podcast-Quota-Warning-Message"]
                == "80% of monthly quota used (8/10). 2 episodes remaining this month."
            )
            assert "X-Podcast-Upgrade-Required" not in response.headers
        finally:
            _clear_override()

    def test_usage_endpoint_sets_upgrade_headers_when_quota_exceeded(
        self,
        client,
    ) -> None:
        organization_id = "org_upgrade"
        user = SimpleNamespace(id="user-upgrade", organization_id=organization_id)

        _override_user(user)
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
                mock_feature.return_value = True
                mock_tier.return_value = SubscriptionTier.PROFESSIONAL
                mock_summary.return_value = PodcastQuotaSummary(
                    tier=SubscriptionTier.PROFESSIONAL.value,
                    limit=10,
                    remaining=0,
                    used=10,
                    is_unlimited=False,
                    period=expected_period,
                    tier_label="Professional",
                    quota_state="critical",
                    warning_status="critical",
                    warning_message="Monthly quota exceeded (10/10). 0 episodes remaining this month.",
                    upgrade_required=True,
                    upgrade_message="Upgrade to Premium tier for unlimited episodes.",
                    upgrade_cta_url="/pricing",
                )

                response = client.get("/api/podcasts/usage")

            assert response.status_code == status.HTTP_200_OK
            assert response.headers["X-Podcast-Quota-Warning"] == "critical"
            assert (
                response.headers["X-Podcast-Quota-Warning-Message"]
                == "Monthly quota exceeded (10/10). 0 episodes remaining this month."
            )
            assert response.headers["X-Podcast-Upgrade-Required"] == "true"
            assert (
                response.headers["X-Podcast-Upgrade-Message"]
                == "Upgrade to Premium tier for unlimited episodes."
            )
            assert response.headers["X-Podcast-Upgrade-CTA"] == "/pricing"
        finally:
            _clear_override()


class TestPodcastFeatureAccessEndpoint:
    """Tests for /podcasts/features/{feature} entitlement endpoint."""

    def test_feature_access_returns_true_for_authorized_tier(self, client) -> None:
        organization_id = "org_pro"
        professional_user = SimpleNamespace(
            id="user-pro",
            organization_id=organization_id,
        )

        _override_user(professional_user)
        try:
            with patch(
                "app.core.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.services.entitlement_service.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_check, patch(
                "app.services.entitlement_service.get_required_tier",
                new_callable=Mock,
            ) as mock_required:
                mock_tier.return_value = SubscriptionTier.PROFESSIONAL
                mock_check.return_value = True
                mock_required.return_value = SubscriptionTier.PROFESSIONAL

                response = client.get("/api/podcasts/features/podcast_audio")

            assert response.status_code == status.HTTP_200_OK
            payload = response.json()
            assert payload == {
                "feature": "podcast_audio",
                "has_access": True,
                "tier": SubscriptionTier.PROFESSIONAL.value,
                "tier_label": "Professional",
                "required_tier": SubscriptionTier.PROFESSIONAL.value,
                "required_tier_label": "Professional",
                "upgrade_required": False,
                "upgrade_message": None,
                "upgrade_cta_url": None,
            }
            mock_check.assert_awaited_once_with(organization_id, "podcast_audio")
            assert mock_required.call_count >= 1
            mock_required.assert_called_with("podcast_audio")
        finally:
            _clear_override()

    def test_feature_access_returns_false_for_insufficient_tier(self, client) -> None:
        organization_id = "org_starter"
        starter_user = SimpleNamespace(
            id="user-starter",
            organization_id=organization_id,
        )

        _override_user(starter_user)
        try:
            with patch(
                "app.core.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.services.entitlement_service.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_check, patch(
                "app.services.entitlement_service.get_required_tier",
                new_callable=Mock,
            ) as mock_required:
                mock_tier.return_value = SubscriptionTier.STARTER
                mock_check.return_value = False
                mock_required.return_value = SubscriptionTier.PROFESSIONAL

                response = client.get("/api/podcasts/features/podcast_audio")

            assert response.status_code == status.HTTP_200_OK
            payload = response.json()
            assert payload == {
                "feature": "podcast_audio",
                "has_access": False,
                "tier": SubscriptionTier.STARTER.value,
                "tier_label": "Starter",
                "required_tier": SubscriptionTier.PROFESSIONAL.value,
                "required_tier_label": "Professional",
                "upgrade_required": True,
                "upgrade_message": "Upgrade to Professional tier to unlock audio podcasting.",
                "upgrade_cta_url": "/pricing",
            }
            mock_check.assert_awaited_once_with(organization_id, "podcast_audio")
            assert mock_required.call_count >= 1
            mock_required.assert_called_with("podcast_audio")
        finally:
            _clear_override()

    def test_feature_access_returns_404_for_unknown_feature(self, client) -> None:
        organization_id = "org_pro"
        professional_user = SimpleNamespace(
            id="user-pro",
            organization_id=organization_id,
        )

        _override_user(professional_user)
        try:
            with patch(
                "app.core.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.services.entitlement_service.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_check:
                mock_tier.return_value = SubscriptionTier.PROFESSIONAL
                mock_check.side_effect = FeatureNotFoundError("Feature not found")

                response = client.get("/api/podcasts/features/unknown_feature")

            assert response.status_code == status.HTTP_404_NOT_FOUND
            assert "Feature not found" in response.json()["detail"]
        finally:
            _clear_override()


class TestPodcastListEndpoint:
    """Tests for GET /podcasts/episodes endpoint."""

    def test_list_episodes_returns_organizations_episodes(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        user = create_user(role=UserRole.growth, organization_id=org.id)
        
        _override_user(user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.podcast_service.get_episodes"
            ) as mock_get:
                mock_feature.return_value = True
                mock_get.return_value = []
                
                response = client.get("/api/podcasts/episodes")
                
            assert response.status_code == status.HTTP_200_OK
            mock_get.assert_called_once()
            assert mock_get.call_args.kwargs["organization_id"] == org.id
        finally:
            _clear_override()
    
    def test_list_episodes_filters_by_status(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        user = create_user(role=UserRole.growth, organization_id=org.id)
        
        _override_user(user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.podcast_service.get_episodes"
            ) as mock_get:
                mock_feature.return_value = True
                mock_get.return_value = []
                
                response = client.get("/api/podcasts/episodes?status=published")
                
            assert response.status_code == status.HTTP_200_OK
            assert mock_get.call_args.kwargs["status"] == "published"
        finally:
            _clear_override()


class TestPodcastGetSingleEndpoint:
    """Tests for GET /podcasts/episodes/{episode_id} endpoint."""

    def test_get_single_episode_returns_episode(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        user = create_user(role=UserRole.growth, organization_id=org.id)
        episode_id = "ep-123"
        
        _override_user(user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.podcast_service.get_episode"
            ) as mock_get:
                mock_feature.return_value = True
                mock_episode = SimpleNamespace(
                    id=episode_id,
                    title="Test Episode",
                    organization_id=org.id,
                    description="Test Description",
                    episode_number=1,
                    season_number=1,
                    audio_file_url="https://example.com/audio.mp3",
                    video_file_url=None,
                    status="draft",
                    created_by="user-123",
                    created_at="2025-10-28T00:00:00Z",
                )
                mock_get.return_value = mock_episode
                
                response = client.get(f"/api/podcasts/episodes/{episode_id}")
                
            assert response.status_code == status.HTTP_200_OK
            mock_get.assert_called_once_with(
                db=ANY,
                episode_id=episode_id,
                organization_id=org.id,
            )
        finally:
            _clear_override()
    
    def test_get_single_episode_returns_404_when_not_found(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        user = create_user(role=UserRole.growth, organization_id=org.id)
        
        _override_user(user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.podcast_service.get_episode"
            ) as mock_get:
                mock_feature.return_value = True
                mock_get.return_value = None
                
                response = client.get("/api/podcasts/episodes/nonexistent")
                
            assert response.status_code == status.HTTP_404_NOT_FOUND
        finally:
            _clear_override()


class TestPodcastUpdateEndpoint:
    """Tests for PUT /podcasts/episodes/{episode_id} endpoint."""

    def test_update_episode_modifies_fields(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        user = create_user(role=UserRole.growth, organization_id=org.id)
        episode_id = "ep-123"
        
        _override_user(user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.podcast_service.update_episode"
            ) as mock_update:
                mock_feature.return_value = True
                mock_episode = SimpleNamespace(
                    id=episode_id,
                    title="Updated Title",
                    organization_id=org.id,
                    description="New description",
                    episode_number=1,
                    season_number=1,
                    audio_file_url="https://example.com/audio.mp3",
                    video_file_url=None,
                    status="draft",
                    created_by="user-123",
                    created_at="2025-10-28T00:00:00Z",
                )
                mock_update.return_value = mock_episode
                
                payload = {"title": "Updated Title", "description": "New description"}
                response = client.put(f"/api/podcasts/episodes/{episode_id}", json=payload)
                
            assert response.status_code == status.HTTP_200_OK
            mock_update.assert_called_once()
            assert mock_update.call_args.kwargs["title"] == "Updated Title"
        finally:
            _clear_override()


class TestPodcastDeleteEndpoint:
    """Tests for DELETE /podcasts/episodes/{episode_id} endpoint."""

    def test_delete_episode_removes_episode(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        user = create_user(role=UserRole.growth, organization_id=org.id)
        episode_id = "ep-123"
        
        _override_user(user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.podcast_service.delete_episode"
            ) as mock_delete:
                mock_feature.return_value = True
                mock_delete.return_value = True
                
                response = client.delete(f"/api/podcasts/episodes/{episode_id}")
                
            assert response.status_code == status.HTTP_204_NO_CONTENT
            mock_delete.assert_called_once_with(
                db=ANY,
                episode_id=episode_id,
                organization_id=org.id,
            )
        finally:
            _clear_override()
    
    def test_delete_episode_returns_404_when_not_found(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="professional")
        user = create_user(role=UserRole.growth, organization_id=org.id)
        
        _override_user(user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.services.podcast_service.delete_episode"
            ) as mock_delete:
                mock_feature.return_value = True
                mock_delete.return_value = False
                
                response = client.delete("/api/podcasts/episodes/nonexistent")
                
            assert response.status_code == status.HTTP_404_NOT_FOUND
        finally:
            _clear_override()


class TestPodcastYouTubeUpload:
    """Tests covering the YouTube publish endpoint."""

    def test_premium_user_can_publish_video_to_youtube(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="premium")
        premium_user = create_user(role=UserRole.enterprise, organization_id=org.id)
        premium_user.subscription_tier = SubscriptionTier.PREMIUM.value

        _override_user(premium_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.api.routes.podcasts.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.api.routes.podcasts.podcast_service.get_episode"
            ) as mock_get_episode, patch(
                "app.api.routes.podcasts.youtube_service.upload_video",
                new_callable=AsyncMock,
            ) as mock_upload, patch(
                "app.api.routes.podcasts.podcast_service.update_episode"
            ) as mock_update:
                mock_feature.return_value = True
                mock_tier.return_value = SubscriptionTier.PREMIUM
                mock_get_episode.return_value = SimpleNamespace(
                    id="ep-youtube",
                    title="Premium Video Episode",
                    description="Video upload",
                    video_file_url="/tmp/video.mp4",
                    organization_id=premium_user.organization_id,
                )
                mock_upload.return_value = "YT_123"

                response = client.post("/api/podcasts/episodes/ep-youtube/youtube")

            assert response.status_code == status.HTTP_200_OK
            assert response.json() == {"video_id": "YT_123"}

            mock_get_episode.assert_called_once()
            mock_upload.assert_awaited_once_with(
                data={
                    "title": "Premium Video Episode",
                    "description": "Video upload",
                    "file_path": "/tmp/video.mp4",
                },
                organization_id=premium_user.organization_id,
                user_tier=SubscriptionTier.PREMIUM,
            )
            mock_update.assert_called_once()
            update_kwargs = mock_update.call_args.kwargs
            assert update_kwargs["episode_id"] == "ep-youtube"
            assert update_kwargs["youtube_video_id"] == "YT_123"
        finally:
            _clear_override()

    def test_podcast_youtube_upload_requires_video_asset(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="premium")
        premium_user = create_user(role=UserRole.enterprise, organization_id=org.id)
        premium_user.subscription_tier = SubscriptionTier.PREMIUM.value

        _override_user(premium_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.api.routes.podcasts.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.api.routes.podcasts.podcast_service.get_episode"
            ) as mock_get_episode:
                mock_feature.return_value = True
                mock_tier.return_value = SubscriptionTier.PREMIUM
                mock_get_episode.return_value = SimpleNamespace(
                    id="ep-no-video",
                    title="Audio Only",
                    description=None,
                    video_file_url=None,
                    organization_id=premium_user.organization_id,
                )

                response = client.post("/api/podcasts/episodes/ep-no-video/youtube")

            assert response.status_code == status.HTTP_400_BAD_REQUEST
            assert "video file" in response.json()["detail"].lower()
        finally:
            _clear_override()

    def test_youtube_upload_permission_error_returns_403(
        self,
        client,
        create_user,
        create_organization,
    ) -> None:
        org = create_organization(subscription_tier="premium")
        premium_user = create_user(role=UserRole.enterprise, organization_id=org.id)
        premium_user.subscription_tier = SubscriptionTier.PREMIUM.value

        _override_user(premium_user)
        try:
            with patch(
                "app.api.dependencies.auth.check_feature_access",
                new_callable=AsyncMock,
            ) as mock_feature, patch(
                "app.api.routes.podcasts.subscription.get_organization_tier",
                new_callable=AsyncMock,
            ) as mock_tier, patch(
                "app.api.routes.podcasts.podcast_service.get_episode"
            ) as mock_get_episode, patch(
                "app.api.routes.podcasts.youtube_service.upload_video",
                new_callable=AsyncMock,
            ) as mock_upload:
                mock_feature.return_value = True
                mock_tier.return_value = SubscriptionTier.PREMIUM
                mock_get_episode.return_value = SimpleNamespace(
                    id="ep-youtube",
                    title="Premium Video Episode",
                    description="Video upload",
                    video_file_url="/tmp/video.mp4",
                    organization_id=premium_user.organization_id,
                )
                mock_upload.side_effect = PermissionError("Premium tier required")

                response = client.post("/api/podcasts/episodes/ep-youtube/youtube")

            assert response.status_code == status.HTTP_403_FORBIDDEN
            assert "premium" in response.json()["detail"].lower()
        finally:
            _clear_override()



