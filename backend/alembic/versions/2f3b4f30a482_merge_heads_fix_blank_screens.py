"""merge_heads_fix_blank_screens

Revision ID: 2f3b4f30a482
Revises: 3ecece8fd99d, f6c0cba0b97a
Create Date: 2025-11-17 15:50:35.099168

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2f3b4f30a482'
down_revision: Union[str, None] = ('3ecece8fd99d', 'f6c0cba0b97a')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
