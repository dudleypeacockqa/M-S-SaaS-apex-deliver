"""add metadata_json safely

Revision ID: a1b2c3d4e5f8
Revises: 079ee49539ef
Create Date: 2025-11-17 16:45:00.000000

Adds metadata_json column to document_access_logs table if it doesn't exist.
This is safe to run on databases that may have already had this column from
a different migration path (f6c0cba0b97a).

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f8'
down_revision: Union[str, None] = '079ee49539ef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(inspector: Inspector, table: str) -> bool:
    """Return True when the given table exists in the current schema."""
    schema = inspector.default_schema_name
    try:
        return inspector.has_table(table_name=table, schema=schema)
    except Exception:
        return False


def _column_exists(inspector: Inspector, table: str, column: str) -> bool:
    """Return True when the given column exists in the given table."""
    if not _table_exists(inspector, table):
        return False
    try:
        columns = inspector.get_columns(table_name=table)
        return any(c["name"] == column for c in columns)
    except Exception:
        return False


def upgrade() -> None:
    """Add metadata_json column when document_access_logs exists and column doesn't."""
    inspector = sa.inspect(op.get_bind())

    # Skip if table doesn't exist
    if not _table_exists(inspector, "document_access_logs"):
        return

    # Skip if column already exists (from f6c0cba0b97a or other path)
    if _column_exists(inspector, "document_access_logs", "metadata_json"):
        return

    # Add the column
    op.add_column(
        "document_access_logs",
        sa.Column("metadata_json", sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    """Remove metadata_json column if it still exists."""
    inspector = sa.inspect(op.get_bind())

    if not _table_exists(inspector, "document_access_logs"):
        return

    if _column_exists(inspector, "document_access_logs", "metadata_json"):
        op.drop_column("document_access_logs", "metadata_json")
