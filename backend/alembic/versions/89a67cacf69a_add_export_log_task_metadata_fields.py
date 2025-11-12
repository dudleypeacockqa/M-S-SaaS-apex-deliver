"""add export log task metadata fields

Revision ID: 89a67cacf69a
Revises: a7b2d5e0f4c1
Create Date: 2025-11-11 12:01:10.244833

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '89a67cacf69a'
down_revision: Union[str, None] = 'a7b2d5e0f4c1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("valuation_export_logs") as batch_op:
        batch_op.add_column(sa.Column("task_id", sa.String(length=64), nullable=True))
        batch_op.add_column(
            sa.Column("status", sa.String(length=20), nullable=False, server_default="queued")
        )
        batch_op.add_column(sa.Column("download_url", sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column("error_message", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True))
        batch_op.create_index(
            "ix_valuation_export_logs_task_id",
            ["task_id"],
            unique=True,
        )

    op.execute("UPDATE valuation_export_logs SET status = 'queued' WHERE status IS NULL")


def downgrade() -> None:
    with op.batch_alter_table("valuation_export_logs") as batch_op:
        batch_op.drop_index("ix_valuation_export_logs_task_id")
        batch_op.drop_column("completed_at")
        batch_op.drop_column("error_message")
        batch_op.drop_column("download_url")
        batch_op.drop_column("status")
        batch_op.drop_column("task_id")
