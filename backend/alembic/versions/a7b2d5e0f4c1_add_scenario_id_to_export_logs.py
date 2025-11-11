"""add scenario reference to valuation export logs

Revision ID: a7b2d5e0f4c1
Revises: dc2c0f69c1b1
Create Date: 2025-11-11 06:45:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a7b2d5e0f4c1"
down_revision: Union[str, None] = "dc2c0f69c1b1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TABLE_NAME = "valuation_export_logs"
FK_NAME = "fk_valuation_export_logs_scenario_id"


def _table_exists() -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return TABLE_NAME in inspector.get_table_names()


def upgrade() -> None:
    if not _table_exists():
        # Some tenants may not have created valuation_export_logs yet; skip safely.
        return

    op.add_column(
        TABLE_NAME,
        sa.Column("scenario_id", sa.String(length=36), nullable=True),
    )
    op.create_foreign_key(
        FK_NAME,
        TABLE_NAME,
        "valuation_scenarios",
        ["scenario_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    if not _table_exists():
        return

    op.drop_constraint(FK_NAME, TABLE_NAME, type_="foreignkey")
    op.drop_column(TABLE_NAME, "scenario_id")
