"""Podcast service layer for DEV-016 Podcast Studio."""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import Select, and_, desc, select
from sqlalchemy.orm import Session

from openai import AsyncOpenAI

from app.core.config import settings
from app.models.podcast import PodcastAnalytics, PodcastEpisode, PodcastTranscript


def _base_episode_query() -> Select[PodcastEpisode]:
    """Return a base select statement for podcast episodes."""

    return select(PodcastEpisode)


def create_episode(
    *,
    db: Session,
    title: str,
    description: Optional[str],
    episode_number: int,
    season_number: int,
    audio_file_url: str,
    video_file_url: Optional[str],
    created_by: str,
    organization_id: str,
) -> PodcastEpisode:
    """Create a new podcast episode draft."""

    episode = PodcastEpisode(
        id=str(uuid.uuid4()),
        title=title,
        description=description,
        episode_number=episode_number,
        season_number=season_number,
        audio_file_url=audio_file_url,
        video_file_url=video_file_url,
        status="draft",
        created_by=created_by,
        organization_id=organization_id,
    )
    db.add(episode)
    db.commit()
    db.refresh(episode)
    return episode


def get_episodes(
    *,
    db: Session,
    organization_id: str,
    status: Optional[str] = None,
    limit: int = 50,
) -> List[PodcastEpisode]:
    """Return episodes for an organization optionally filtered by status."""

    stmt = (
        _base_episode_query()
        .where(PodcastEpisode.organization_id == organization_id)
        .order_by(desc(PodcastEpisode.created_at))
        .limit(limit)
    )
    if status:
        stmt = stmt.where(PodcastEpisode.status == status)

    return list(db.scalars(stmt).all())


def get_episode(
    *,
    db: Session,
    episode_id: str,
    organization_id: str,
) -> Optional[PodcastEpisode]:
    """Return a single episode if it belongs to the organization."""

    stmt = _base_episode_query().where(
        and_(
            PodcastEpisode.id == episode_id,
            PodcastEpisode.organization_id == organization_id,
        )
    )
    return db.scalar(stmt)


def update_episode(
    *,
    db: Session,
    episode_id: str,
    organization_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    show_notes: Optional[str] = None,
    status: Optional[str] = None,
) -> PodcastEpisode:
    """Mutate simple episode fields and persist changes."""

    episode = get_episode(db=db, episode_id=episode_id, organization_id=organization_id)
    if episode is None:
        raise ValueError(f"Episode {episode_id} not found")

    if title is not None:
        episode.title = title
    if description is not None:
        episode.description = description
    if show_notes is not None:
        episode.show_notes = show_notes
    if status is not None:
        episode.status = status
        if status == "published" and episode.published_at is None:
            episode.published_at = datetime.now(timezone.utc)

    db.add(episode)
    db.commit()
    db.refresh(episode)
    return episode


def publish_episode(
    *,
    db: Session,
    episode_id: str,
    organization_id: str,
) -> PodcastEpisode:
    """Set an episode to published and populate timestamp."""

    return update_episode(
        db=db,
        episode_id=episode_id,
        organization_id=organization_id,
        status="published",
    )


async def transcribe_episode(
    *,
    db: Session,
    episode_id: str,
    audio_file_path: str,
    organization_id: str,
) -> PodcastTranscript:
    """Transcribe an episode using OpenAI Whisper and store transcript."""

    episode = get_episode(db=db, episode_id=episode_id, organization_id=organization_id)
    if episode is None:
        raise ValueError(f"Episode {episode_id} not found")

    api_key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
    client = AsyncOpenAI(api_key=api_key)

    with open(audio_file_path, "rb") as audio_file:
        response = await client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
            timestamp_granularities=["segment"],
        )

    transcript_text = response.text
    timestamps = [
        {"time": segment.start, "text": segment.text}
        for segment in getattr(response, "segments", []) or []
    ]

    transcript = PodcastTranscript(
        id=str(uuid.uuid4()),
        episode_id=episode_id,
        transcript_text=transcript_text,
        timestamps=timestamps,
        language="en",
    )

    episode.transcript = transcript_text
    episode.status = "processing"

    db.add(transcript)
    db.add(episode)
    db.commit()
    db.refresh(transcript)
    return transcript


def get_episode_analytics(
    *,
    db: Session,
    episode_id: str,
    organization_id: str,
) -> dict:
    """Aggregate analytics for a given episode."""

    episode = get_episode(db=db, episode_id=episode_id, organization_id=organization_id)
    if episode is None:
        raise ValueError(f"Episode {episode_id} not found")

    stmt = select(PodcastAnalytics).where(PodcastAnalytics.episode_id == episode_id)
    analytics = list(db.scalars(stmt).all())

    total_listens = sum(a.listens or 0 for a in analytics)
    total_downloads = sum(a.downloads or 0 for a in analytics)
    avg_duration_values = [a.average_listen_duration for a in analytics if a.average_listen_duration]
    avg_duration = int(sum(avg_duration_values) / len(avg_duration_values)) if avg_duration_values else 0

    platforms = {
        a.platform: {"listens": a.listens or 0, "downloads": a.downloads or 0}
        for a in analytics
    }

    return {
        "episode_id": episode_id,
        "total_listens": total_listens,
        "total_downloads": total_downloads,
        "average_listen_duration": avg_duration,
        "platforms": platforms,
    }


def generate_rss_feed(
    *,
    db: Session,
    organization_id: str,
) -> str:
    """Generate RSS XML for published podcast episodes."""

    episodes = get_episodes(
        db=db,
        organization_id=organization_id,
        status="published",
        limit=100,
    )

    rss_lines: List[str] = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">',
        "  <channel>",
        "    <title>M&A Intelligence Podcast</title>",
        "    <description>Expert insights on mergers and acquisitions</description>",
        "    <language>en-us</language>",
    ]

    for episode in episodes:
        pub_date = (
            episode.published_at.strftime("%a, %d %b %Y %H:%M:%S GMT")
            if episode.published_at
            else ""
        )
        duration = str(episode.duration_seconds or 0)
        rss_lines.extend(
            [
                "    <item>",
                f"      <title>{episode.title}</title>",
                f"      <description>{episode.description or ''}</description>",
                f"      <enclosure url=\"{episode.audio_file_url}\" type=\"audio/mpeg\"/>",
                f"      <pubDate>{pub_date}</pubDate>",
                f"      <itunes:duration>{duration}</itunes:duration>",
                "    </item>",
            ]
        )

    rss_lines.extend(["  </channel>", "</rss>"])
    return "\n".join(rss_lines)


def delete_episode(
    *,
    db: Session,
    episode_id: str,
    organization_id: str,
) -> bool:
    """Delete an episode and associated records."""

    episode = get_episode(db=db, episode_id=episode_id, organization_id=organization_id)
    if episode is None:
        return False

    db.delete(episode)
    db.commit()
    return True
