"""Convert community user FK columns to UUID

Revision ID: aae3309a2a8b
Revises: 72a37f9bc382
Create Date: 2025-11-13 17:25:00.000000
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "aae3309a2a8b"
down_revision: Union[str, None] = "72a37f9bc382"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

FK_MAP = [
    ("community_posts", "author_user_id", "community_posts_author_user_id_fkey"),
    ("community_comments", "author_user_id", "community_comments_author_user_id_fkey"),
    ("community_reactions", "user_id", "community_reactions_user_id_fkey"),
    ("community_follows", "follower_user_id", "community_follows_follower_user_id_fkey"),
    ("community_follows", "following_user_id", "community_follows_following_user_id_fkey"),
    ("community_moderation_actions", "moderator_user_id", "community_moderation_actions_moderator_user_id_fkey"),
]


def _alter_column(table: str, column: str, to_uuid: bool) -> None:
    target_type = "uuid" if to_uuid else "varchar(36)"
    caster = "::uuid" if to_uuid else "::text"
    op.execute(
        sa.text(
            f"ALTER TABLE {table} ALTER COLUMN {column} TYPE {target_type} "
            f"USING NULLIF({column}, ''){caster}"
        )
    )


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != 'postgresql':
        return
    data_type = bind.execute(sa.text(
        "SELECT data_type FROM information_schema.columns "
        "WHERE table_name = 'users' AND column_name = 'id'"
    )).scalar()
    if data_type != 'uuid':
        return
    for table, column, constraint in FK_MAP:
        op.drop_constraint(constraint, table, type_="foreignkey")

    for table, column, _ in FK_MAP:
        _alter_column(table, column, to_uuid=True)

    for table, column, constraint in FK_MAP:
        op.create_foreign_key(constraint, table, "users", [column], ["id"], ondelete=None)


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != 'postgresql':
        return
    data_type = bind.execute(sa.text(
        "SELECT data_type FROM information_schema.columns "
        "WHERE table_name = 'users' AND column_name = 'id'"
    )).scalar()
    if data_type != 'uuid':
        return
    for table, column, constraint in FK_MAP:
        op.drop_constraint(constraint, table, type_="foreignkey")

    for table, column, _ in FK_MAP:
        _alter_column(table, column, to_uuid=False)

    for table, column, constraint in FK_MAP:
        op.create_foreign_key(constraint, table, "users", [column], ["id"], ondelete=None)
