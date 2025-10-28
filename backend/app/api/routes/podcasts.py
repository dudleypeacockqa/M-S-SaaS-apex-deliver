"""Podcast API routes for DEV-016."""
from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import require_feature
from app.core import subscription
from app.db.session import get_db
from app.models.user import User
from app.schemas.podcast import (
    PodcastEpisodeCreate,
    PodcastEpisodeResponse,
    PodcastQuotaSummary,
)
from app.services import podcast_service, quota_service
from app.services.quota_service import QuotaExceededError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/podcasts", tags=["podcasts"])


async def get_quota_summary(*, organization_id: str, tier: subscription.SubscriptionTier, db: Session) -> PodcastQuotaSummary:
    """Compute quota summary using shared service helpers."""

    return await quota_service.get_quota_summary(
        organization_id=organization_id,
        tier=tier,
        db=db,
    )


@router.post(
    "/episodes",
    response_model=PodcastEpisodeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_podcast_episode(
    payload: PodcastEpisodeCreate,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> PodcastEpisodeResponse:
    """Create a new podcast episode guarded by tier access and quotas."""

    if payload.video_file_url:
        video_gate = require_feature("podcast_video")
        await video_gate(current_user=current_user)

    try:
        await quota_service.check_episode_quota(
            organization_id=current_user.organization_id,
            db=db,
        )
    except QuotaExceededError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=str(exc),
        ) from exc

    episode = podcast_service.create_episode(
        db=db,
        title=payload.title,
        description=payload.description,
        episode_number=payload.episode_number,
        season_number=payload.season_number,
        audio_file_url=str(payload.audio_file_url),
        video_file_url=str(payload.video_file_url) if payload.video_file_url else None,
        created_by=current_user.id,
        organization_id=current_user.organization_id,
    )

    await _increment_episode_usage(organization_id=current_user.organization_id, db=db)

    return PodcastEpisodeResponse.model_validate(episode)


@router.get(
    "/usage",
    response_model=PodcastQuotaSummary,
)
async def get_podcast_usage_summary(
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> PodcastQuotaSummary:
    """Return quota summary for the current tenant's podcast usage."""

    organization_id = current_user.organization_id
    tier = await subscription.get_organization_tier(organization_id)
    return await get_quota_summary(organization_id=organization_id, tier=tier, db=db)


async def _increment_episode_usage(organization_id: str, db: Session) -> None:
    """Increment usage counts when possible, tolerating sync-only sessions."""

    try:
        await quota_service.increment_episode_count(organization_id=organization_id, db=db)
    except QuotaExceededError:
        # Ignore quota overshoot triggered concurrently; creation already succeeded
        logger.warning(
            "Quota increment detected overage for organization %s after creation",
            organization_id,
        )
    except Exception as exc:  # pragma: no cover - safety net for unexpected paths
        logger.exception(
            "Unexpected error incrementing podcast quota for organization %s", organization_id
        )
