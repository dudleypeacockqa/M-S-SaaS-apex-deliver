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


def upgrade() -> None:
    op.add_column(
        "valuation_export_logs",
        sa.Column("scenario_id", sa.String(length=36), nullable=True),
    )
    op.create_foreign_key(
        "fk_valuation_export_logs_scenario_id",
        "valuation_export_logs",
        "valuation_scenarios",
        ["scenario_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_valuation_export_logs_scenario_id", "valuation_export_logs", type_="foreignkey")
    op.drop_column("valuation_export_logs", "scenario_id")
