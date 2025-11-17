"""Add metadata_json to document_access_logs when available.

This migration must tolerate environments where the document tables have not
been created yet (different branch head). We therefore guard every operation
with table/column existence checks rather than assuming the table is present.
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


revision: str = "f6c0cba0b97a"
down_revision: Union[str, Sequence[str], None] = (
    "9a90b381abd5",
    "d37ed4cd3013",
)
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
    """Return True when the column exists on the given table."""
    schema = inspector.default_schema_name
    try:
        return column in {
            col["name"] for col in inspector.get_columns(table, schema=schema)
        }
    except Exception:
        return False


def upgrade() -> None:
    """Add metadata_json column when document_access_logs exists."""
    inspector = sa.inspect(op.get_bind())

    if not _table_exists(inspector, "document_access_logs"):
        return

    if _column_exists(inspector, "document_access_logs", "metadata_json"):
        return

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
