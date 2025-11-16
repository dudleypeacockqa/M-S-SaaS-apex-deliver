"""Add event reminders table

Revision ID: f0a1b2c3d4e5
Revises: b354d12d1e7d
Create Date: 2025-11-15 15:30:00
"""
from typing import Optional, Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect
from sqlalchemy.dialects import postgresql
from sqlalchemy.exc import InternalError, ProgrammingError
from app.db.base import GUID
# revision identifiers, used by Alembic.
revision: str = "f0a1b2c3d4e5"
down_revision: Union[str, None] = "b354d12d1e7d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


SAFE_EXCEPTIONS = (ProgrammingError, InternalError)


def _inspector() -> Optional[sa.engine.reflection.Inspector]:
    try:
        return inspect(op.get_bind())
    except SAFE_EXCEPTIONS:
        return None


def _table_exists(table_name: str, schema: str | None = None) -> bool:
    if not table_name:
        return False
    inspector = _inspector()
    if inspector is None:
        return False
    try:
        return bool(inspector.has_table(table_name, schema=schema))
    except SAFE_EXCEPTIONS:
        return False


def _column_type(table_name: str, column_name: str) -> Optional[str]:
    inspector = _inspector()
    if inspector is None or not _table_exists(table_name):
        return None
    try:
        columns = inspector.get_columns(table_name, schema='public')
        for column in columns:
            if column.get('name') == column_name:
                col_type = column.get('type')
                visit_name = getattr(col_type, '__visit_name__', '')
                if isinstance(col_type, postgresql.UUID) or visit_name.lower() == 'uuid':
                    return 'uuid'
    except SAFE_EXCEPTIONS:
        pass
    try:
        bind = op.get_bind()
        result = bind.execute(
            sa.text(
                """
                SELECT data_type
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = :table_name
                  AND column_name = :column_name
                """
            ),
            {"table_name": table_name, "column_name": column_name},
        ).scalar()
        return result.lower() if result else None
    except SAFE_EXCEPTIONS:
        return None


def _match_fk_type(table_name: str, column_name: str) -> sa.types.TypeEngine:
    """Match the foreign key column type to the referenced column's actual PostgreSQL type."""
    if _column_type(table_name, column_name) == 'uuid':
        return GUID()
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
    required_tables = ("events", "users", "organizations")
    if not all(_table_exists(table) for table in required_tables):
        return

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
