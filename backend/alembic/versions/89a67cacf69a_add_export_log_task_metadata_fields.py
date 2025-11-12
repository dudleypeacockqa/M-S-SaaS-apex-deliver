"""add export log task metadata fields

Revision ID: 89a67cacf69a
Revises: a7b2d5e0f4c1
Create Date: 2025-11-11 12:01:10.244833

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "89a67cacf69a"
down_revision: Union[str, None] = "a7b2d5e0f4c1"
branch_labels: Union[str, Sequence[str], None] = None
# Ensure valuation tables (658051b7d4f9) exist before altering export logs.
depends_on: Union[str, Sequence[str], None] = ("658051b7d4f9",)

TABLE_NAME = "valuation_export_logs"
INDEX_NAME = "ix_valuation_export_logs_task_id"
SCHEMA = "public"


def _table_exists() -> bool:
    bind = op.get_bind()
    result = bind.exec_driver_sql(
        "SELECT to_regclass(:table_name)",
        {"table_name": f"{SCHEMA}.{TABLE_NAME}"},
    ).scalar()
    return result is not None


def upgrade() -> None:
    if not _table_exists():
        # Older tenants may not have valuation exports yet; skip safely.
        return

    # Step 1: Add columns (status as nullable first to allow data population)
    with op.batch_alter_table(TABLE_NAME, schema=SCHEMA) as batch_op:
        batch_op.add_column(sa.Column("task_id", sa.String(length=64), nullable=True))
        batch_op.add_column(
            sa.Column("status", sa.String(length=20), nullable=True, server_default="queued")
        )
        batch_op.add_column(sa.Column("download_url", sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column("error_message", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True))

    # Step 2: Populate status for existing rows (now AFTER batch context is closed)
    op.execute(
        sa.text(
            f'UPDATE "{SCHEMA}"."{TABLE_NAME}" SET status = \'queued\' WHERE status IS NULL'
        )
    )

    # Step 3: Make status NOT NULL after data is populated
    op.alter_column(TABLE_NAME, "status", nullable=False, schema=SCHEMA)

    # Step 4: Create index last (after data is clean)
    op.create_index(
        INDEX_NAME,
        TABLE_NAME,
        ["task_id"],
        unique=True,
        schema=SCHEMA,
    )


def downgrade() -> None:
    if not _table_exists():
        return

    with op.batch_alter_table(TABLE_NAME, schema=SCHEMA) as batch_op:
        batch_op.drop_index(INDEX_NAME)
        batch_op.drop_column("completed_at")
        batch_op.drop_column("error_message")
        batch_op.drop_column("download_url")
        batch_op.drop_column("status")
        batch_op.drop_column("task_id")
