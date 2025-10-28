"""RED tests for YouTube upload service gating (DEV-016 Phase 3)."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.core.subscription import SubscriptionTier


@pytest.mark.asyncio
async def test_upload_video_allowed_for_premium():
    """Premium user should trigger upload flow exactly once."""

    from app.services import youtube_service  # noqa: WPS433 (import for test)

    payload = {
        "title": "Premium Episode",
        "description": "Video upload",
        "file_path": "/tmp/video.mp4",
    }

    with patch(
        "app.services.youtube_service.check_feature_access",
        new_callable=AsyncMock,
        create=True,
    ) as mock_access, patch(
        "app.services.youtube_service._youtube_client",
        new_callable=AsyncMock,
        create=True,
    ) as mock_client:
        mock_access.return_value = True

        api_client = MagicMock()
        videos_resource = MagicMock()
        insert_request = MagicMock()
        insert_request.execute.return_value = {"id": "YT_12345"}
        videos_resource.insert.return_value = insert_request
        api_client.videos.return_value = videos_resource
        mock_client.return_value = api_client

        video_id = await youtube_service.upload_video(
            data=payload,
            organization_id="org_premium",
            user_tier=SubscriptionTier.PREMIUM,
        )

    mock_access.assert_awaited_once_with("org_premium", "youtube_integration")
    assert video_id.startswith("YT_")


@pytest.mark.asyncio
async def test_upload_video_rejected_for_professional():
    """Professional tier should receive upgrade guidance before hitting YouTube API."""

    from app.services import youtube_service  # noqa: WPS433

    payload = {
        "title": "Professional Episode",
        "description": "Video upload",
        "file_path": "/tmp/video.mp4",
    }

    with patch(
        "app.services.youtube_service.check_feature_access",
        new_callable=AsyncMock,
        create=True,
    ) as mock_access, patch(
        "app.services.youtube_service.get_required_tier",
        return_value=SubscriptionTier.PREMIUM,
        create=True,
    ) as mock_required, patch(
        "app.services.youtube_service._youtube_client",
        new_callable=AsyncMock,
        create=True,
    ) as mock_client:
        mock_access.return_value = False

        with pytest.raises(PermissionError) as exc:
            await youtube_service.upload_video(
                data=payload,
                organization_id="org_professional",
                user_tier=SubscriptionTier.PROFESSIONAL,
            )

    mock_access.assert_awaited_once_with("org_professional", "youtube_integration")
    mock_required.assert_called_once_with("youtube_integration")
    mock_client.assert_not_called()
    assert "Premium" in str(exc.value)
