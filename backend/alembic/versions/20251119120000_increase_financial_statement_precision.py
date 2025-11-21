"""Increase precision for financial statement aggregates.

Revision ID: 20251119120000
Revises: 20251118104453
Create Date: 2025-11-19 12:00:00
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20251119120000"
down_revision: Union[str, Sequence[str], None] = "20251118104453"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("financial_statements") as batch:
        batch.alter_column(
            "total_assets",
            type_=sa.Numeric(precision=20, scale=3),
            existing_nullable=True,
        )
        batch.alter_column(
            "total_liabilities",
            type_=sa.Numeric(precision=20, scale=3),
            existing_nullable=True,
        )
        batch.alter_column(
            "total_equity",
            type_=sa.Numeric(precision=20, scale=3),
            existing_nullable=True,
        )


def downgrade() -> None:
    with op.batch_alter_table("financial_statements") as batch:
        batch.alter_column(
            "total_assets",
            type_=sa.Numeric(precision=15, scale=2),
            existing_nullable=True,
        )
        batch.alter_column(
            "total_liabilities",
            type_=sa.Numeric(precision=15, scale=2),
            existing_nullable=True,
        )
        batch.alter_column(
            "total_equity",
            type_=sa.Numeric(precision=15, scale=2),
            existing_nullable=True,
        )

