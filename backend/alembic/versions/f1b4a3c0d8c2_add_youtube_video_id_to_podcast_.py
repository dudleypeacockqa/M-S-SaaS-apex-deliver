"""Add youtube_video_id column to podcast episodes."""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f1b4a3c0d8c2"
down_revision = "de0a8956401c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "podcast_episodes",
        sa.Column("youtube_video_id", sa.String(length=64), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("podcast_episodes", "youtube_video_id")

