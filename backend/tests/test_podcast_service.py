"""Tests for DEV-016 Podcast service layer (RED phase).

These tests intentionally fail until the Podcast Studio service is implemented.
They cover creation, retrieval, publishing, transcription (mocked Whisper),
analytics aggregation, RSS generation, multi-tenant isolation, updates, and
soft deletion behaviour.
"""

from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Dict, List
from uuid import uuid4

import pytest
from unittest.mock import AsyncMock, patch

from sqlalchemy.orm import Session

from app.services import podcast_service
from app.models.podcast import PodcastEpisode, PodcastAnalytics, PodcastTranscript


@pytest.fixture()
def audio_file(tmp_path: Path) -> Path:
    """Create a temporary audio file for transcription tests."""

    audio_path = tmp_path / "sample-episode.mp3"
    audio_path.write_bytes(b"FAKE_MP3_DATA")
    return audio_path


@pytest.mark.usefixtures("db_session")
class TestPodcastService:
    """Core test cases for podcast service behaviour."""

    async def _mock_transcription(self, segments: List[Dict[str, str]] | None = None):
        """Helper to create a mocked Whisper response."""

        mock_client = AsyncMock()
        mock_response = AsyncMock()
        mock_response.text = "This is a sample transcript"
        mock_response.segments = []
        if segments:
            mock_response.segments = [AsyncMock(start=seg["time"], text=seg["text"]) for seg in segments]
        mock_client.audio.transcriptions.create.return_value = mock_response
        return mock_client

    def test_create_episode(self, db_session: Session):
        """Creating a podcast episode should persist core metadata."""

        episode = podcast_service.create_episode(
            db=db_session,
            title="Episode 1: Fundamentals",
            description="An intro to M&A",
            episode_number=1,
            season_number=1,
            audio_file_url="https://cdn.example.com/audio1.mp3",
            video_file_url=None,
            created_by="user-123",
            organization_id="org-abc",
        )

        assert isinstance(episode, PodcastEpisode)
        assert episode.title == "Episode 1: Fundamentals"
        assert episode.status == "draft"
        assert episode.organization_id == "org-abc"

    def test_get_episodes_filters_by_status(self, db_session: Session):
        """Episodes should be filterable by publication status."""

        create_test_episode(db_session, organization_id="org-abc", status="draft")
        create_test_episode(db_session, organization_id="org-abc", status="published")
        create_test_episode(db_session, organization_id="org-xyz", status="published")

        episodes = podcast_service.get_episodes(
            db=db_session,
            organization_id="org-abc",
            status="published",
            limit=50,
        )

        assert len(episodes) == 1
        assert episodes[0].status == "published"
        assert episodes[0].organization_id == "org-abc"

    def test_publish_episode_sets_timestamp(self, db_session: Session):
        """Publishing an episode should update status and published_at."""

        episode = create_test_episode(db_session, organization_id="org-abc", status="draft")

        published = podcast_service.publish_episode(
            db=db_session,
            episode_id=episode.id,
            organization_id="org-abc",
        )

        assert published.status == "published"
        assert published.published_at is not None

    @pytest.mark.asyncio
    async def test_transcribe_episode_uses_whisper(self, db_session: Session, audio_file: Path):
        """Transcribing an episode should create transcript records using Whisper."""

        episode = create_test_episode(db_session, organization_id="org-abc")
        segments = [
            {"time": 0.0, "text": "Intro"},
            {"time": 12.5, "text": "Discussion"},
            {"time": 35.0, "text": "Summary"},
        ]

        with patch(
            "app.services.podcast_service.check_feature_access",
            new_callable=AsyncMock,
            create=True,
        ) as mock_access, patch("app.services.podcast_service.AsyncOpenAI") as mock_openai:
            mock_access.return_value = True
            mock_openai.return_value = await self._mock_transcription(segments)

            transcript = await podcast_service.transcribe_episode(
                db=db_session,
                episode_id=episode.id,
                audio_file_path=str(audio_file),
                organization_id="org-abc",
            )

        assert isinstance(transcript, PodcastTranscript)
        assert transcript.episode_id == episode.id
        assert transcript.transcript_text.startswith("This is a sample transcript")
        assert len(transcript.timestamps) == len(segments)

        mock_access.assert_awaited_once()
        assert mock_access.await_args.args == ("org-abc", "transcription_basic")

        refreshed = podcast_service.get_episode(
            db=db_session,
            episode_id=episode.id,
            organization_id="org-abc",
        )
        assert refreshed.status == "processing"
        assert refreshed.transcript is not None

    @pytest.mark.asyncio
    async def test_transcribe_episode_requires_entitlement(self, db_session: Session, audio_file: Path):
        """Transcription should be blocked when organization lacks entitlement."""

        episode = create_test_episode(db_session, organization_id="org-abc")

        with patch(
            "app.services.podcast_service.check_feature_access",
            new_callable=AsyncMock,
            create=True,
        ) as mock_access, patch("app.services.podcast_service.AsyncOpenAI") as mock_openai:
            mock_access.return_value = False

            with pytest.raises(PermissionError):
                await podcast_service.transcribe_episode(
                    db=db_session,
                    episode_id=episode.id,
                    audio_file_path=str(audio_file),
                    organization_id="org-abc",
                )

        mock_access.assert_awaited_once()
        assert mock_access.await_args.args == ("org-abc", "transcription_basic")
        mock_openai.assert_not_called()

    def test_get_episode_analytics_aggregates_platform_totals(self, db_session: Session):
        """Analytics should aggregate listens/downloads across platforms."""

        episode = create_test_episode(db_session, organization_id="org-abc")
        create_test_analytics(db_session, episode.id, listens=100, downloads=45, platform="spotify")
        create_test_analytics(db_session, episode.id, listens=60, downloads=25, platform="apple")

        analytics = podcast_service.get_episode_analytics(
            db=db_session,
            episode_id=episode.id,
            organization_id="org-abc",
        )

        assert analytics["episode_id"] == episode.id
        assert analytics["total_listens"] == 160
        assert analytics["total_downloads"] == 70
        assert set(analytics["platforms"].keys()) == {"spotify", "apple"}

    def test_generate_rss_feed_includes_published_episodes(self, db_session: Session):
        """Generated RSS feed should list only published episodes ordered by recency."""

        published = create_test_episode(
            db_session,
            title="Published Episode",
            status="published",
            organization_id="org-abc",
        )
        unpublished = create_test_episode(
            db_session,
            title="Draft Episode",
            status="draft",
            organization_id="org-abc",
        )
        rss_xml = podcast_service.generate_rss_feed(
            db=db_session,
            organization_id="org-abc",
        )

        assert "<?xml" in rss_xml
        assert published.title in rss_xml
        assert unpublished.title not in rss_xml

    def test_multi_tenant_isolation(self, db_session: Session):
        """Episodes from other organizations should not be accessible."""

        episode = create_test_episode(db_session, organization_id="org-abc")
        result = podcast_service.get_episode(
            db=db_session,
            episode_id=episode.id,
            organization_id="org-def",
        )

        assert result is None

    def test_update_episode_mutates_fields(self, db_session: Session):
        """Updating an episode should mutate provided fields and persist changes."""

        episode = create_test_episode(db_session, organization_id="org-abc", title="Original Title")

        updated = podcast_service.update_episode(
            db=db_session,
            episode_id=episode.id,
            organization_id="org-abc",
            title="Updated Title",
            description="Updated description",
            show_notes="<p>Notes</p>",
            status="draft",
        )

        assert updated.title == "Updated Title"
        assert updated.description == "Updated description"
        assert updated.show_notes == "<p>Notes</p>"

    def test_delete_episode_removes_record(self, db_session: Session):
        """Deleting an episode should remove it and return True."""

        episode = create_test_episode(db_session, organization_id="org-abc")
        success = podcast_service.delete_episode(
            db=db_session,
            episode_id=episode.id,
            organization_id="org-abc",
        )

        assert success is True
        assert podcast_service.get_episode(
            db=db_session,
            episode_id=episode.id,
            organization_id="org-abc",
        ) is None

    @pytest.mark.asyncio
    async def test_transcribe_episode_missing_episode_raises(self, db_session: Session, audio_file: Path):
        """Attempting to transcribe missing episode should raise ValueError."""

        with pytest.raises(ValueError):
            await podcast_service.transcribe_episode(
                db=db_session,
                episode_id=str(uuid4()),
                audio_file_path=str(audio_file),
                organization_id="org-abc",
            )


# ---------------------------------------------------------------------------
# Helper functions for test setup
# ---------------------------------------------------------------------------

def create_test_episode(
    db: Session,
    *,
    title: str = "Test Episode",
    description: str | None = "Description",
    status: str = "draft",
    organization_id: str = "org-abc",
    created_by: str = "user-123",
) -> PodcastEpisode:
    """Create a seeded podcast episode for tests."""

    episode = podcast_service.create_episode(
        db=db,
        title=title,
        description=description,
        episode_number=1,
        season_number=1,
        audio_file_url="https://cdn.example.com/audio.mp3",
        video_file_url=None,
        created_by=created_by,
        organization_id=organization_id,
    )
    if status == "published":
        podcast_service.publish_episode(db=db, episode_id=episode.id, organization_id=organization_id)
    else:
        episode.status = status
        db.add(episode)
        db.commit()
        db.refresh(episode)
    return episode


def create_test_analytics(
    db: Session,
    episode_id: str,
    *,
    listens: int,
    downloads: int,
    platform: str,
    stats_date: date | None = None,
) -> PodcastAnalytics:
    """Create podcast analytics record for tests."""

    analytics = PodcastAnalytics(
        id=str(uuid4()),
        episode_id=episode_id,
        platform=platform,
        listens=listens,
        downloads=downloads,
        average_listen_duration=240,
        stats_date=stats_date or date.today(),
    )
    db.add(analytics)
    db.commit()
    db.refresh(analytics)
    return analytics
