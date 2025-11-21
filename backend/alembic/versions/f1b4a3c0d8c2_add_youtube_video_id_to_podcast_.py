"""Add youtube_video_id column to podcast episodes."""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = "f1b4a3c0d8c2"
down_revision = "c5e3b2a17f0d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    # Skip if the table doesn't exist (protects environments missing earlier migration)
    if "podcast_episodes" not in inspector.get_table_names():
        return

    existing_columns = {col["name"] for col in inspector.get_columns("podcast_episodes")}
    if "youtube_video_id" in existing_columns:
        return

    op.add_column(
        "podcast_episodes",
        sa.Column("youtube_video_id", sa.String(length=64), nullable=True),
    )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if "podcast_episodes" not in inspector.get_table_names():
        return

    existing_columns = {col["name"] for col in inspector.get_columns("podcast_episodes")}
    if "youtube_video_id" not in existing_columns:
        return

    op.drop_column("podcast_episodes", "youtube_video_id")
