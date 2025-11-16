"""Convert community user FK columns to UUID

Revision ID: aae3309a2a8b
Revises: 72a37f9bc382
Create Date: 2025-11-13 17:25:00.000000
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.exc import ProgrammingError, InternalError

# revision identifiers, used by Alembic.
revision: str = "aae3309a2a8b"
down_revision: Union[str, None] = "72a37f9bc382"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

SAFE_EXCEPTIONS = (ProgrammingError, InternalError)

FK_MAP = [
    ("community_posts", "author_user_id", "community_posts_author_user_id_fkey"),
    ("community_comments", "author_user_id", "community_comments_author_user_id_fkey"),
    ("community_reactions", "user_id", "community_reactions_user_id_fkey"),
    ("community_follows", "follower_user_id", "community_follows_follower_user_id_fkey"),
    ("community_follows", "following_user_id", "community_follows_following_user_id_fkey"),
    ("community_moderation_actions", "moderator_user_id", "community_moderation_actions_moderator_user_id_fkey"),
]


def _table_exists(table_name: str) -> bool:
    """Check if table exists using raw SQL (works even in aborted transactions)."""
    bind = op.get_bind()
    if not bind or bind.dialect.name != 'postgresql':
        return False
    
    try:
        result = bind.execute(
            sa.text(
                "SELECT EXISTS ("
                "SELECT 1 FROM information_schema.tables "
                "WHERE table_schema = 'public' AND table_name = :table_name"
                ")"
            ),
            {"table_name": table_name}
        )
        return bool(result.scalar())
    except SAFE_EXCEPTIONS:
        return False
    except Exception:
        return False


def _column_exists(table_name: str, column_name: str) -> bool:
    """Check if column exists in table, returning False on any error."""
    if not _table_exists(table_name):
        return False
    
    bind = op.get_bind()
    if not bind or bind.dialect.name != 'postgresql':
        return False
    
    try:
        result = bind.execute(
            sa.text(
                "SELECT EXISTS ("
                "SELECT 1 FROM information_schema.columns "
                "WHERE table_schema = 'public' "
                "AND table_name = :table_name "
                "AND column_name = :column_name"
                ")"
            ),
            {"table_name": table_name, "column_name": column_name}
        )
        return bool(result.scalar())
    except SAFE_EXCEPTIONS:
        return False
    except Exception:
        return False


def _constraint_exists(constraint_name: str, table_name: str) -> bool:
    """Check if constraint exists, returning False on any error."""
    if not _table_exists(table_name):
        return False
    
    bind = op.get_bind()
    if not bind or bind.dialect.name != 'postgresql':
        return False
    
    try:
        result = bind.execute(
            sa.text(
                "SELECT EXISTS ("
                "SELECT 1 FROM information_schema.table_constraints "
                "WHERE constraint_schema = 'public' "
                "AND constraint_name = :constraint_name "
                "AND table_name = :table_name"
                ")"
            ),
            {"constraint_name": constraint_name, "table_name": table_name}
        )
        return bool(result.scalar())
    except SAFE_EXCEPTIONS:
        return False
    except Exception:
        return False


def _safe_drop_constraint(constraint_name: str, table_name: str) -> None:
    """Safely drop constraint - skip if it doesn't exist."""
    if not _table_exists(table_name):
        return
    if not _constraint_exists(constraint_name, table_name):
        return
    try:
        op.drop_constraint(constraint_name, table_name, type_="foreignkey")
    except SAFE_EXCEPTIONS:
        pass
    except Exception:
        pass


def _safe_alter_column(table: str, column: str, to_uuid: bool) -> None:
    """Safely alter column - skip if table/column doesn't exist."""
    if not _table_exists(table):
        return
    if not _column_exists(table, column):
        return
    
    target_type = "uuid" if to_uuid else "varchar(36)"
    caster = "::uuid" if to_uuid else "::text"
    try:
        op.execute(
            sa.text(
                f"ALTER TABLE {table} ALTER COLUMN {column} TYPE {target_type} "
                f"USING NULLIF({column}, ''){caster}"
            )
        )
    except SAFE_EXCEPTIONS:
        pass
    except Exception:
        pass


def _safe_create_foreign_key(constraint_name: str, table_name: str, column_name: str) -> None:
    """Safely create foreign key - skip if table/column doesn't exist."""
    if not _table_exists(table_name):
        return
    if not _column_exists(table_name, column_name):
        return
    if not _table_exists("users"):
        return
    try:
        op.create_foreign_key(constraint_name, table_name, "users", [column_name], ["id"], ondelete=None)
    except SAFE_EXCEPTIONS:
        pass
    except Exception:
        pass


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != 'postgresql':
        return
    
    # Check if users table exists and has UUID id column
    if not _table_exists("users"):
        return
    
    try:
        data_type = bind.execute(sa.text(
            "SELECT data_type FROM information_schema.columns "
            "WHERE table_schema = 'public' "
            "AND table_name = 'users' AND column_name = 'id'"
        )).scalar()
        if data_type != 'uuid':
            return
    except SAFE_EXCEPTIONS:
        return
    except Exception:
        return
    
    # Drop constraints safely
    for table, column, constraint in FK_MAP:
        _safe_drop_constraint(constraint, table)

    # Alter columns safely
    for table, column, _ in FK_MAP:
        _safe_alter_column(table, column, to_uuid=True)

    # Create foreign keys safely
    for table, column, constraint in FK_MAP:
        _safe_create_foreign_key(constraint, table, column)


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != 'postgresql':
        return
    
    # Check if users table exists and has UUID id column
    if not _table_exists("users"):
        return
    
    try:
        data_type = bind.execute(sa.text(
            "SELECT data_type FROM information_schema.columns "
            "WHERE table_schema = 'public' "
            "AND table_name = 'users' AND column_name = 'id'"
        )).scalar()
        if data_type != 'uuid':
            return
    except SAFE_EXCEPTIONS:
        return
    except Exception:
        return
    
    # Drop constraints safely
    for table, column, constraint in FK_MAP:
        _safe_drop_constraint(constraint, table)

    # Alter columns safely
    for table, column, _ in FK_MAP:
        _safe_alter_column(table, column, to_uuid=False)

    # Create foreign keys safely
    for table, column, constraint in FK_MAP:
        _safe_create_foreign_key(constraint, table, column)
