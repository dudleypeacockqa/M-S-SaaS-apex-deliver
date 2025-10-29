"""Podcast API routes for DEV-016."""
from __future__ import annotations

import logging
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user, require_feature
from app.core import subscription
from app.db.session import get_db
from app.models.user import User
from app.schemas.podcast import (
    PodcastEpisodeCreate,
    PodcastEpisodeResponse,
    PodcastQuotaSummary,
    PodcastYouTubeUploadResponse,
)
from app.services import entitlement_service, podcast_service, quota_service, youtube_service
from app.services.entitlement_service import (
    FeatureNotFoundError,
    get_feature_upgrade_cta,
    get_feature_upgrade_message,
    get_tier_label,
)
from app.services.quota_service import QuotaExceededError
from app.services.storage_service import get_storage_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/podcasts", tags=["podcasts"])


async def transcribe_audio(audio_file_path: str) -> str:
    """
    Transcribe audio file using OpenAI Whisper API.

    Args:
        audio_file_path: Path to the audio file to transcribe

    Returns:
        Transcribed text

    Raises:
        Exception: If Whisper API call fails
    """
    try:
        import os
        from openai import AsyncOpenAI

        logger.info(f"Transcribing audio file: {audio_file_path}")

        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY not set, using placeholder transcription")
            return "Placeholder transcription - OpenAI API key not configured"

        client = AsyncOpenAI(api_key=api_key)

        # Get the actual file path from storage
        storage = get_storage_service()

        # For now, check if file exists locally (development mode)
        # In production with S3, this would download from S3 first
        file_path = audio_file_path.replace("/storage/", "storage/")

        if not os.path.exists(file_path):
            logger.error(f"Audio file not found at {file_path}")
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")

        # Check file size (Whisper API has 25MB limit)
        file_size = os.path.getsize(file_path)
        max_size = 25 * 1024 * 1024  # 25MB

        if file_size > max_size:
            logger.warning(f"Audio file too large ({file_size} bytes), chunking required")
            # TODO: Implement chunking for large files
            raise ValueError(f"Audio file too large ({file_size / 1024 / 1024:.1f}MB). Maximum: 25MB")

        # Transcribe using Whisper API
        with open(file_path, "rb") as audio_file:
            response = await client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text",
                language="en",  # Auto-detect or specify
            )

        transcript = response if isinstance(response, str) else response.text

        logger.info(f"Successfully transcribed {file_size / 1024:.1f}KB audio file, {len(transcript)} characters")

        return transcript

    except FileNotFoundError as exc:
        logger.error(f"Audio file not found: {exc}")
        raise
    except ValueError as exc:
        logger.error(f"File validation error: {exc}")
        raise
    except Exception as exc:
        logger.error(f"Whisper API transcription failed: {exc}")
        raise


async def generate_thumbnail(video_file_path: str, timestamp: float = 1.0) -> str:
    """
    Generate thumbnail from video file at specified timestamp.

    Args:
        video_file_path: Path to the video file
        timestamp: Time in seconds to extract frame (default: 1.0)

    Returns:
        Path to generated thumbnail

    Raises:
        Exception: If thumbnail generation fails

    Note:
        In production, this would use FFmpeg to extract a frame:
        - ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumbnail.jpg
        For now, returns placeholder path
    """
    try:
        import os

        logger.info(f"Generating thumbnail from video: {video_file_path} at {timestamp}s")

        # TODO: Implement FFmpeg thumbnail extraction
        # For now, return a placeholder path
        # In production, this would:
        # 1. Use FFmpeg to extract frame at timestamp
        # 2. Save thumbnail to storage
        # 3. Return the storage path

        # Generate placeholder thumbnail path
        video_filename = os.path.basename(video_file_path)
        video_id = video_filename.split('.')[0]
        thumbnail_path = f"/storage/thumbnails/{video_id}_thumb.jpg"

        logger.info(f"Thumbnail path generated: {thumbnail_path}")
        return thumbnail_path

    except Exception as exc:
        logger.error(f"Thumbnail generation failed: {exc}")
        raise


@router.get("/features/{feature}")
async def get_feature_access(
    feature: str,
    current_user: User = Depends(get_current_user),
) -> dict[str, str | bool | None]:
    """Expose feature entitlement state for the current tenant."""

    organization_id = current_user.organization_id

    try:
        tier = await subscription.get_organization_tier(organization_id)
        has_access = await entitlement_service.check_feature_access(organization_id, feature)
        required_tier = entitlement_service.get_required_tier(feature)
    except FeatureNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    tier_label = get_tier_label(tier)
    required_tier_label = get_tier_label(required_tier)
    upgrade_required = not has_access
    upgrade_message = (
        None
        if not upgrade_required
        else get_feature_upgrade_message(feature, tier)
    )
    upgrade_cta_url = (
        None
        if not upgrade_required
        else get_feature_upgrade_cta(feature)
    )

    return {
        "feature": feature,
        "tier": tier.value,
        "tier_label": tier_label,
        "has_access": has_access,
        "required_tier": required_tier.value,
        "required_tier_label": required_tier_label,
        "upgrade_required": upgrade_required,
        "upgrade_message": upgrade_message,
        "upgrade_cta_url": upgrade_cta_url,
    }


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
    response: Response,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> PodcastQuotaSummary:
    """Return quota summary for the current tenant's podcast usage."""

    organization_id = current_user.organization_id
    tier = await subscription.get_organization_tier(organization_id)
    summary = await get_quota_summary(organization_id=organization_id, tier=tier, db=db)

    if summary.warning_status:
        response.headers["X-Podcast-Quota-Warning"] = summary.warning_status
        if summary.warning_message:
            response.headers["X-Podcast-Quota-Warning-Message"] = summary.warning_message
    if summary.upgrade_required:
        response.headers["X-Podcast-Upgrade-Required"] = "true"
        if summary.upgrade_message:
            response.headers["X-Podcast-Upgrade-Message"] = summary.upgrade_message
        if summary.upgrade_cta_url:
            response.headers["X-Podcast-Upgrade-CTA"] = summary.upgrade_cta_url

    return summary


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


@router.get(
    "/episodes",
    response_model=list[PodcastEpisodeResponse],
)
async def list_podcast_episodes(
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
    status: str | None = None,
    limit: int = 50,
) -> list[PodcastEpisodeResponse]:
    """List all podcast episodes for the current organization."""

    episodes = podcast_service.get_episodes(
        db=db,
        organization_id=current_user.organization_id,
        status=status,
        limit=limit,
    )
    return [PodcastEpisodeResponse.model_validate(ep) for ep in episodes]


@router.post(
    "/episodes/{episode_id}/youtube",
    response_model=PodcastYouTubeUploadResponse,
)
async def publish_episode_to_youtube(
    episode_id: str,
    current_user: User = Depends(require_feature("youtube_integration")),
    db: Session = Depends(get_db),
) -> PodcastYouTubeUploadResponse:
    """Publish an episode's video asset to YouTube and persist the video id."""

    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )

    if not episode.video_file_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Video file required to publish episode to YouTube.",
        )

    tier = await subscription.get_organization_tier(current_user.organization_id)

    try:
        video_id = await youtube_service.upload_video(
            data={
                "title": episode.title,
                "description": episode.description or "",
                "file_path": str(episode.video_file_url),
            },
            organization_id=current_user.organization_id,
            user_tier=tier,
        )
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc

    podcast_service.update_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
        youtube_video_id=video_id,
    )

    return PodcastYouTubeUploadResponse(video_id=video_id)


@router.post(
    "/episodes/{episode_id}/upload-audio",
    status_code=status.HTTP_200_OK,
)
async def upload_audio_file(
    episode_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> dict:
    """
    Upload audio file for an episode (Professional+ tiers).

    Validates:
    - File format (MP3, WAV, M4A only)
    - File size (max 500MB)
    - Episode ownership

    Returns:
    - episode_id: Episode UUID
    - audio_url: Storage path to uploaded file
    """
    # Validate episode exists and belongs to organization
    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )

    # Validate file format
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required",
        )

    file_ext = Path(file.filename).suffix.lower()
    allowed_formats = {".mp3", ".wav", ".m4a"}
    if file_ext not in allowed_formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid audio format. Allowed formats: MP3, WAV, M4A. Got: {file_ext}",
        )

    # Validate file size (500MB max)
    MAX_SIZE = 500 * 1024 * 1024  # 500MB in bytes
    file_content = await file.read()
    file_size = len(file_content)

    if file_size > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: 500MB. Got: {file_size / 1024 / 1024:.2f}MB",
        )

    # Generate unique file key
    storage = get_storage_service()
    file_key = f"podcast-audio/{episode_id}/{uuid.uuid4()}{file_ext}"

    # Save file to storage
    try:
        # Create BytesIO from content for storage service
        from io import BytesIO
        file_stream = BytesIO(file_content)
        storage_path = await storage.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=current_user.organization_id,
        )

        # Update episode with audio URL
        podcast_service.update_episode(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id,
            audio_file_url=f"/storage/{file_key}",
        )

        logger.info(
            "Audio uploaded successfully for episode %s by user %s",
            episode_id,
            current_user.id,
        )

        return {
            "episode_id": episode_id,
            "audio_url": f"/storage/{file_key}",
            "file_size": file_size,
            "filename": file.filename,
        }

    except IOError as exc:
        logger.error(
            "Failed to save audio file for episode %s: %s",
            episode_id,
            str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save audio file",
        ) from exc


@router.post(
    "/episodes/{episode_id}/upload-video",
    status_code=status.HTTP_200_OK,
)
async def upload_video_file(
    episode_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(require_feature("podcast_video")),
    db: Session = Depends(get_db),
) -> dict:
    """
    Upload video file for an episode (Premium+ tiers).

    Validates:
    - File format (MP4, MOV only)
    - File size (max 2GB)
    - Episode ownership

    Returns:
    - episode_id: Episode UUID
    - video_url: Storage path to uploaded file
    """
    # Validate episode exists and belongs to organization
    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )

    # Validate file format
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required",
        )

    file_ext = Path(file.filename).suffix.lower()
    allowed_formats = {".mp4", ".mov"}
    if file_ext not in allowed_formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid video format. Allowed formats: MP4, MOV. Got: {file_ext}",
        )

    # Validate file size (2GB max)
    MAX_SIZE = 2 * 1024 * 1024 * 1024  # 2GB in bytes
    file_content = await file.read()
    file_size = len(file_content)

    if file_size > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: 2GB. Got: {file_size / 1024 / 1024:.2f}MB",
        )

    # Generate unique file key
    storage = get_storage_service()
    file_key = f"podcast-video/{episode_id}/{uuid.uuid4()}{file_ext}"

    # Save file to storage
    try:
        # Create BytesIO from content for storage service
        from io import BytesIO
        file_stream = BytesIO(file_content)
        storage_path = await storage.save_file(
            file_key=file_key,
            file_stream=file_stream,
            organization_id=current_user.organization_id,
        )

        # Update episode with video URL
        podcast_service.update_episode(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id,
            video_file_url=f"/storage/{file_key}",
        )

        logger.info(
            "Video uploaded successfully for episode %s by user %s",
            episode_id,
            current_user.id,
        )

        return {
            "episode_id": episode_id,
            "video_url": f"/storage/{file_key}",
            "file_size": file_size,
            "filename": file.filename,
        }

    except IOError as exc:
        logger.error(
            "Failed to save video file for episode %s: %s",
            episode_id,
            str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save video file",
        ) from exc


@router.post(
    "/episodes/{episode_id}/transcribe",
    status_code=status.HTTP_200_OK,
)
async def transcribe_episode_audio(
    episode_id: str,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> dict:
    """
    Transcribe episode audio using OpenAI Whisper API (Professional+ tiers).

    Validates:
    - Episode exists and has audio file
    - Episode ownership

    Returns:
    - episode_id: Episode UUID
    - transcript: Transcribed text
    """
    # Validate episode exists and belongs to organization
    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )

    # Validate episode has audio file
    if not episode.audio_file_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Episode must have an audio file to transcribe. Please upload audio first.",
        )

    # Transcribe audio
    try:
        transcript = await transcribe_audio(episode.audio_file_url)

        # Update episode with transcript
        podcast_service.update_episode(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id,
            transcript=transcript,
        )

        logger.info(
            "Audio transcribed successfully for episode %s by user %s",
            episode_id,
            current_user.id,
        )

        return {
            "episode_id": episode_id,
            "transcript": transcript,
        }

    except Exception as exc:
        logger.error(
            "Failed to transcribe audio for episode %s: %s",
            episode_id,
            str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Transcription failed. Please try again later.",
        ) from exc


@router.get(
    "/episodes/{episode_id}/transcript",
    status_code=status.HTTP_200_OK,
)
async def download_transcript_txt(
    episode_id: str,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> Response:
    """
    Download episode transcript in TXT format (Professional+ tiers).

    Returns plain text transcript file.
    """
    # Validate episode exists and belongs to organization
    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )

    # Validate transcript exists
    if not episode.transcript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transcript not available. Please transcribe the episode first.",
        )

    # Return transcript as plain text
    return Response(
        content=episode.transcript,
        media_type="text/plain",
        headers={
            "Content-Disposition": f'attachment; filename="episode_{episode_id}_transcript.txt"'
        },
    )


@router.get(
    "/episodes/{episode_id}/transcript.srt",
    status_code=status.HTTP_200_OK,
)
async def download_transcript_srt(
    episode_id: str,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> Response:
    """
    Download episode transcript in SRT format (Professional+ tiers).

    Returns SubRip subtitle file with timestamps.
    """
    # Validate episode exists and belongs to organization
    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )

    # Validate transcript exists
    if not episode.transcript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transcript not available. Please transcribe the episode first.",
        )

    # Convert transcript to SRT format
    # Simple implementation: split by sentences, assign timestamps
    # In production, Whisper API provides word-level timestamps
    lines = episode.transcript.split(". ")
    srt_content = []
    seconds_per_line = 10  # Estimate 10 seconds per sentence

    for idx, line in enumerate(lines, 1):
        start_time = (idx - 1) * seconds_per_line
        end_time = idx * seconds_per_line

        # Format timestamps as HH:MM:SS,mmm
        start_h, start_remainder = divmod(start_time, 3600)
        start_m, start_s = divmod(start_remainder, 60)
        end_h, end_remainder = divmod(end_time, 3600)
        end_m, end_s = divmod(end_remainder, 60)

        srt_content.append(f"{idx}\n")
        srt_content.append(
            f"{start_h:02d}:{start_m:02d}:{start_s:02d},000 --> "
            f"{end_h:02d}:{end_m:02d}:{end_s:02d},000\n"
        )
        srt_content.append(f"{line.strip()}\n\n")

    # Return SRT file
    return Response(
        content="".join(srt_content),
        media_type="application/x-subrip",
        headers={
            "Content-Disposition": f'attachment; filename="episode_{episode_id}_transcript.srt"'
        },
    )


@router.post(
    "/episodes/{episode_id}/generate-thumbnail",
    status_code=status.HTTP_200_OK,
)
async def generate_episode_thumbnail(
    episode_id: str,
    current_user: User = Depends(require_feature("podcast_video")),
    db: Session = Depends(get_db),
) -> dict:
    """
    Generate thumbnail from video episode (Premium+ tiers).

    Validates:
    - Episode exists and has video file
    - Episode ownership

    Returns:
    - episode_id: Episode UUID
    - thumbnail_url: Path to generated thumbnail
    """
    # Validate episode exists and belongs to organization
    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )

    # Validate episode has video file
    if not episode.video_file_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Episode must have a video file to generate thumbnail. Please upload video first.",
        )

    # Generate thumbnail
    try:
        thumbnail_url = await generate_thumbnail(episode.video_file_url)

        # Update episode with thumbnail URL
        podcast_service.update_episode(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id,
            thumbnail_url=thumbnail_url,
        )

        logger.info(
            "Thumbnail generated successfully for episode %s by user %s",
            episode_id,
            current_user.id,
        )

        return {
            "episode_id": episode_id,
            "thumbnail_url": thumbnail_url,
        }

    except Exception as exc:
        logger.error(
            "Failed to generate thumbnail for episode %s: %s",
            episode_id,
            str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Thumbnail generation failed. Please try again later.",
        ) from exc


@router.get(
    "/episodes/{episode_id}",
    response_model=PodcastEpisodeResponse,
)
async def get_podcast_episode(
    episode_id: str,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> PodcastEpisodeResponse:
    """Get a single podcast episode by ID."""

    episode = podcast_service.get_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if episode is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )
    return PodcastEpisodeResponse.model_validate(episode)


@router.put(
    "/episodes/{episode_id}",
    response_model=PodcastEpisodeResponse,
)
async def update_podcast_episode(
    episode_id: str,
    payload: dict,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
) -> PodcastEpisodeResponse:
    """Update a podcast episode's metadata."""

    try:
        episode = podcast_service.update_episode(
            db=db,
            episode_id=episode_id,
            organization_id=current_user.organization_id,
            title=payload.get("title"),
            description=payload.get("description"),
            show_notes=payload.get("show_notes"),
            status=payload.get("status"),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return PodcastEpisodeResponse.model_validate(episode)


@router.delete(
    "/episodes/{episode_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def delete_podcast_episode(
    episode_id: str,
    current_user: User = Depends(require_feature("podcast_audio")),
    db: Session = Depends(get_db),
):
    """Delete a podcast episode."""

    deleted = podcast_service.delete_episode(
        db=db,
        episode_id=episode_id,
        organization_id=current_user.organization_id,
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Episode {episode_id} not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
