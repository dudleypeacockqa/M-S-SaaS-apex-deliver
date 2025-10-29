"""add_period_field_to_financial_ratio_for_standalone_calculations

Revision ID: 1038e72b10f1
Revises: a0175dfc0ca0
Create Date: 2025-10-29 11:19:44.324742

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1038e72b10f1'
down_revision: Union[str, None] = 'a0175dfc0ca0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add period field for standalone ratio calculations
    op.add_column('financial_ratios', sa.Column('period', sa.String(20), nullable=True))

    # Make statement_id nullable to support standalone calculations
    op.alter_column('financial_ratios', 'statement_id',
                    existing_type=sa.String(36),
                    nullable=True)


def downgrade() -> None:
    # Remove period field
    op.drop_column('financial_ratios', 'period')

    # Make statement_id non-nullable again
    op.alter_column('financial_ratios', 'statement_id',
                    existing_type=sa.String(36),
                    nullable=False)
