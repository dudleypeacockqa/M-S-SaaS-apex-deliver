"""Create podcast episode, transcript, and analytics tables."""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, func


# revision identifiers, used by Alembic.
revision: str = "c5e3b2a17f0d"
down_revision: Union[str, None] = "de0a8956401c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(table_name: str) -> bool:
    bind = op.get_bind()
    inspector = inspect(bind)
    return table_name in inspector.get_table_names()


def upgrade() -> None:
    if not _table_exists("podcast_episodes"):
        op.create_table(
            "podcast_episodes",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("organization_id", sa.String(length=36), nullable=False),
            sa.Column("title", sa.String(length=255), nullable=False),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("show_notes", sa.Text(), nullable=True),
            sa.Column("episode_number", sa.Integer(), nullable=False, server_default="1"),
            sa.Column("season_number", sa.Integer(), nullable=False, server_default="1"),
            sa.Column("audio_file_url", sa.String(length=500), nullable=False),
            sa.Column("video_file_url", sa.String(length=500), nullable=True),
            sa.Column("youtube_video_id", sa.String(length=64), nullable=True),
            sa.Column("duration_seconds", sa.Integer(), nullable=True),
            sa.Column("status", sa.String(length=32), nullable=False, server_default="draft"),
            sa.Column("transcript", sa.Text(), nullable=True),
            sa.Column("transcript_language", sa.String(length=16), nullable=True),
            sa.Column("created_by", sa.String(length=36), nullable=False),
            sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["created_by"], ["users.id"], ondelete="CASCADE"),
        )

        op.create_index("idx_podcast_episodes_org", "podcast_episodes", ["organization_id"])
        op.create_index("idx_podcast_status", "podcast_episodes", ["status"])
        op.create_index("idx_podcast_published_at", "podcast_episodes", ["published_at"])

    if not _table_exists("podcast_transcripts"):
        op.create_table(
            "podcast_transcripts",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("episode_id", sa.String(length=36), nullable=False),
            sa.Column("transcript_text", sa.Text(), nullable=False),
            sa.Column("timestamps", sa.JSON(), nullable=True),
            sa.Column("language", sa.String(length=16), nullable=False, server_default="en"),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=func.now(), nullable=False),
            sa.ForeignKeyConstraint(["episode_id"], ["podcast_episodes.id"], ondelete="CASCADE"),
        )

        op.create_index("idx_podcast_transcripts_episode", "podcast_transcripts", ["episode_id"])

    if not _table_exists("podcast_analytics"):
        op.create_table(
            "podcast_analytics",
            sa.Column("id", sa.String(length=36), primary_key=True),
            sa.Column("episode_id", sa.String(length=36), nullable=False),
            sa.Column("platform", sa.String(length=64), nullable=False),
            sa.Column("listens", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("downloads", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("average_listen_duration", sa.Integer(), nullable=True),
            sa.Column("stats_date", sa.DateTime(timezone=True), server_default=func.now(), nullable=False),
            sa.ForeignKeyConstraint(["episode_id"], ["podcast_episodes.id"], ondelete="CASCADE"),
        )

        op.create_index("idx_podcast_analytics_episode", "podcast_analytics", ["episode_id"])
        op.create_index("idx_podcast_analytics_platform", "podcast_analytics", ["platform"])


def downgrade() -> None:
    op.drop_index("idx_podcast_analytics_platform", table_name="podcast_analytics")
    op.drop_index("idx_podcast_analytics_episode", table_name="podcast_analytics")
    op.drop_table("podcast_analytics")

    op.drop_index("idx_podcast_transcripts_episode", table_name="podcast_transcripts")
    op.drop_table("podcast_transcripts")

    op.drop_index("idx_podcast_published_at", table_name="podcast_episodes")
    op.drop_index("idx_podcast_status", table_name="podcast_episodes")
    op.drop_index("idx_podcast_episodes_org", table_name="podcast_episodes")
    op.drop_table("podcast_episodes")

