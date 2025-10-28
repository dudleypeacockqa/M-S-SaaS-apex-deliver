"""Podcast API request/response schemas."""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, HttpUrl, Field, ConfigDict


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
