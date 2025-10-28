"""Podcast models for DEV-016 Podcast Studio."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, JSON, String, Text, func
from sqlalchemy.orm import relationship

from app.db.base import Base


class PodcastEpisode(Base):
    """Podcast episode metadata and media references."""

    __tablename__ = "podcast_episodes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    show_notes = Column(Text, nullable=True)

    episode_number = Column(Integer, nullable=False, default=1)
    season_number = Column(Integer, nullable=False, default=1)

    audio_file_url = Column(String(500), nullable=False)
    video_file_url = Column(String(500), nullable=True)
    youtube_video_id = Column(String(64), nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    status = Column(String(32), nullable=False, default="draft")
    transcript = Column(Text, nullable=True)
    transcript_language = Column(String(16), nullable=True)

    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    podcast_transcripts = relationship(
        "PodcastTranscript",
        back_populates="episode",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    analytics = relationship(
        "PodcastAnalytics",
        back_populates="episode",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    __table_args__ = (
        Index("idx_podcast_episodes_org", "organization_id"),
        Index("idx_podcast_status", "status"),
        Index("idx_podcast_published_at", "published_at"),
    )


class PodcastTranscript(Base):
    """Detailed transcript data for a podcast episode."""

    __tablename__ = "podcast_transcripts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    episode_id = Column(String(36), ForeignKey("podcast_episodes.id", ondelete="CASCADE"), nullable=False)

    transcript_text = Column(Text, nullable=False)
    timestamps = Column(JSON, nullable=True)
    language = Column(String(16), nullable=False, default="en")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    episode = relationship("PodcastEpisode", back_populates="podcast_transcripts")


class PodcastAnalytics(Base):
    """Aggregated analytics for podcast episode performance."""

    __tablename__ = "podcast_analytics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    episode_id = Column(String(36), ForeignKey("podcast_episodes.id", ondelete="CASCADE"), nullable=False)

    platform = Column(String(64), nullable=False)
    listens = Column(Integer, nullable=False, default=0)
    downloads = Column(Integer, nullable=False, default=0)
    average_listen_duration = Column(Integer, nullable=True)
    stats_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    episode = relationship("PodcastEpisode", back_populates="analytics")

    __table_args__ = (
        Index("idx_podcast_analytics_episode", "episode_id"),
        Index("idx_podcast_analytics_platform", "platform"),
    )
