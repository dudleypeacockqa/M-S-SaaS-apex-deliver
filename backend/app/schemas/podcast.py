"""Podcast API request/response schemas."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl, ConfigDict, constr


class PodcastEpisodeCreate(BaseModel):
    """Payload for creating a podcast episode."""

    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    episode_number: int = Field(..., ge=1)
    season_number: int = Field(..., ge=1)
    audio_file_url: HttpUrl
    video_file_url: Optional[HttpUrl] = None


class PodcastEpisodeResponse(BaseModel):
    """Minimal podcast episode response."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str]
    episode_number: int
    season_number: int
    audio_file_url: HttpUrl
    video_file_url: Optional[HttpUrl]
    show_notes: Optional[str] = None
    status: str = "draft"
    organization_id: str
    transcript: Optional[str] = None
    transcript_language: Optional[str] = None
    duration_seconds: Optional[int] = None
    youtube_video_id: Optional[str] = None
    created_by: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None


class PodcastQuotaSummary(BaseModel):
    """Quota summary response for podcast usage endpoint."""

    tier: str
    limit: Optional[int]
    remaining: int
    used: int
    is_unlimited: bool
    period: str
    period_start: Optional[str] = None
    period_end: Optional[str] = None
    period_label: Optional[str] = None
    tier_label: Optional[str] = None
    quota_state: str = "normal"
    warning_status: Optional[str] = None
    warning_message: Optional[str] = None
    upgrade_required: bool = False
    upgrade_message: Optional[str] = None
    upgrade_cta_url: Optional[str] = None


class PodcastTranscriptionRequest(BaseModel):
    """Request payload for initiating podcast transcription."""

    language: Optional[constr(strip_whitespace=True, min_length=2, max_length=10)] = Field(
        default=None,
        description="ISO language code for transcript (defaults to 'en').",
    )

class PodcastYouTubeUploadResponse(BaseModel):
    """Response model for YouTube publish endpoint."""

    video_id: str
