"""fix_partial_export_log_state

Recovery migration to handle partially-applied state from failed 89a67cacf69a migration.

This migration safely adds any missing columns and constraints that may not have
been applied due to deployment failures. It checks for existence before adding.

Revision ID: 86d427f030f2
Revises: 89a67cacf69a
Create Date: 2025-11-12 14:43:04.141131

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision: str = '86d427f030f2'
down_revision: Union[str, None] = '89a67cacf69a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TABLE_NAME = "valuation_export_logs"
INDEX_NAME = "ix_valuation_export_logs_task_id"
SCHEMA = "public"


def _table_exists() -> bool:
    """Check if the valuation_export_logs table exists."""
    bind = op.get_bind()
    result = bind.exec_driver_sql(
        "SELECT to_regclass(%s)",
        (f"{SCHEMA}.{TABLE_NAME}",),
    ).scalar()
    return result is not None


def _column_exists(column_name: str) -> bool:
    """Check if a column exists in the table."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    columns = [col['name'] for col in inspector.get_columns(TABLE_NAME, schema=SCHEMA)]
    return column_name in columns


def _index_exists(index_name: str) -> bool:
    """Check if an index exists on the table."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    indexes = [idx['name'] for idx in inspector.get_indexes(TABLE_NAME, schema=SCHEMA)]
    return index_name in indexes


def upgrade() -> None:
    """
    Recovery migration: Safely ensure all columns and constraints exist.

    This handles cases where the previous migration (89a67cacf69a) partially
    applied due to deployment failures, leaving the database in an inconsistent state.
    """
    if not _table_exists():
        # Table doesn't exist - nothing to fix
        return

    # Step 1: Add missing columns (if they don't exist)
    if not _column_exists("task_id"):
        op.add_column(
            TABLE_NAME,
            sa.Column("task_id", sa.String(length=64), nullable=True),
            schema=SCHEMA
        )

    if not _column_exists("status"):
        op.add_column(
            TABLE_NAME,
            sa.Column("status", sa.String(length=20), nullable=True, server_default="queued"),
            schema=SCHEMA
        )

    if not _column_exists("download_url"):
        op.add_column(
            TABLE_NAME,
            sa.Column("download_url", sa.String(length=500), nullable=True),
            schema=SCHEMA
        )

    if not _column_exists("error_message"):
        op.add_column(
            TABLE_NAME,
            sa.Column("error_message", sa.Text(), nullable=True),
            schema=SCHEMA
        )

    if not _column_exists("completed_at"):
        op.add_column(
            TABLE_NAME,
            sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
            schema=SCHEMA
        )

    # Step 2: Populate status for any existing rows with NULL status
    op.execute(
        sa.text(
            f'UPDATE "{SCHEMA}"."{TABLE_NAME}" SET status = \'queued\' WHERE status IS NULL'
        )
    )

    # Step 3: Ensure status is NOT NULL
    # First check if column is already NOT NULL
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    columns = {col['name']: col for col in inspector.get_columns(TABLE_NAME, schema=SCHEMA)}

    if 'status' in columns and columns['status'].get('nullable', True):
        op.alter_column(TABLE_NAME, "status", nullable=False, schema=SCHEMA)

    # Step 4: Create index if it doesn't exist
    if not _index_exists(INDEX_NAME):
        op.create_index(
            INDEX_NAME,
            TABLE_NAME,
            ["task_id"],
            unique=True,
            schema=SCHEMA,
        )


def downgrade() -> None:
    """
    Downgrade not needed - this is a recovery migration that makes the database
    consistent with what 89a67cacf69a intended to create.
    """
    pass
