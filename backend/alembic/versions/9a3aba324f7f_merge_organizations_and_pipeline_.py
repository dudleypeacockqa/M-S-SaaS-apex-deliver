"""merge organizations and pipeline templates UUID fixes

Revision ID: 9a3aba324f7f
Revises: 0cbf1e0e3ab5, dc2c0f69c1b1
Create Date: 2025-11-10 17:15:53.375517

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9a3aba324f7f'
down_revision: Union[str, None] = ('0cbf1e0e3ab5', 'dc2c0f69c1b1')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
