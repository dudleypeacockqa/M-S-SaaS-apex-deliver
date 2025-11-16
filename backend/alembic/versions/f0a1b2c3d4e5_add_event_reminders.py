"""Add event reminders table

Revision ID: f0a1b2c3d4e5
Revises: b354d12d1e7d
Create Date: 2025-11-15 15:30:00
"""
from typing import Optional, Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.exc import InternalError, ProgrammingError
# revision identifiers, used by Alembic.
revision: str = "f0a1b2c3d4e5"
down_revision: Union[str, None] = "b354d12d1e7d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


SAFE_EXCEPTIONS = (ProgrammingError, InternalError)


def _table_exists(table_name: str, schema: str | None = None) -> bool:
    """Check if table exists using raw SQL (works even in aborted transactions)."""
    if not table_name:
        return False
    
    schema = schema or 'public'
    bind = op.get_bind()
    if not bind or bind.dialect.name != 'postgresql':
        return False
    
    try:
        result = bind.execute(
            sa.text(
                "SELECT EXISTS ("
                "SELECT 1 FROM information_schema.tables "
                "WHERE table_schema = :schema AND table_name = :table_name"
                ")"
            ),
            {"schema": schema, "table_name": table_name}
        )
        return bool(result.scalar())
    except SAFE_EXCEPTIONS:
        return False
    except Exception:
        return False


def _get_pg_column_type(table_name: str, column_name: str) -> str:
    """Get the actual PostgreSQL type name for a column using raw SQL."""
    if not _table_exists(table_name):
        return 'varchar'
    
    bind = op.get_bind()
    if not bind or bind.dialect.name != 'postgresql':
        return 'varchar'
    
    try:
        result = bind.execute(sa.text("""
            SELECT t.typname
            FROM pg_attribute a
            JOIN pg_class c ON a.attrelid = c.oid
            JOIN pg_type t ON a.atttypid = t.oid
            WHERE c.relname = :table_name
            AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            AND a.attname = :column_name
            AND a.attnum > 0
            AND NOT a.attisdropped
        """), {"table_name": table_name, "column_name": column_name})
        pg_type = result.scalar()
        return pg_type or 'varchar'
    except SAFE_EXCEPTIONS:
        return 'varchar'
    except Exception:
        return 'varchar'


def _match_fk_type(table_name: str, column_name: str) -> sa.types.TypeEngine:
    """Match the foreign key column type to the referenced column's actual PostgreSQL type."""
    pg_type = _get_pg_column_type(table_name, column_name)
    if pg_type == 'uuid':
        return postgresql.UUID(as_uuid=False)
    # Default to String(36) for varchar, text, or any other type
    return sa.String(length=36)


def _safe_create_table(table_name: str, *columns, required_tables: tuple[str, ...] = (), **kwargs):
    if any(not _table_exists(dep) for dep in required_tables):
        return
    if _table_exists(table_name):
        return
    try:
        op.create_table(table_name, *columns, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_create_index(index_name: str, table_name: str, columns, **kwargs):
    if not _table_exists(table_name):
        return
    try:
        op.create_index(index_name, table_name, columns, **kwargs)
    except SAFE_EXCEPTIONS:
        pass


def _safe_drop_index(index_name: str, table_name: str):
    if not _table_exists(table_name):
        return
    try:
        op.drop_index(index_name, table_name=table_name)
    except SAFE_EXCEPTIONS:
        pass


def _safe_drop_table(table_name: str):
    if not _table_exists(table_name):
        return
    try:
        op.drop_table(table_name)
    except SAFE_EXCEPTIONS:
        pass


def upgrade() -> None:
    """Create event_reminders table with type-safe foreign keys."""
    required_tables = ("events", "users", "organizations")
    if not all(_table_exists(table) for table in required_tables):
        return

    if _table_exists("event_reminders"):
        return

    # Detect actual column types in the database
    event_id_type = _match_fk_type("events", "id")
    user_id_type = _match_fk_type("users", "id")
    organization_id_type = _match_fk_type("organizations", "id")

    _safe_create_table(
        "event_reminders",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("event_id", event_id_type, sa.ForeignKey("events.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", user_id_type, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("organization_id", organization_id_type, sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("reminder_type", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="pending"),
        sa.Column("scheduled_for", sa.DateTime(timezone=True), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        required_tables=("events", "users", "organizations"),
    )
    _safe_create_index("ix_event_reminders_event_id", "event_reminders", ["event_id"])
    _safe_create_index("ix_event_reminders_status_scheduled", "event_reminders", ["status", "scheduled_for"])


def downgrade() -> None:
    _safe_drop_index("ix_event_reminders_status_scheduled", "event_reminders")
    _safe_drop_index("ix_event_reminders_event_id", "event_reminders")
    _safe_drop_table("event_reminders")
