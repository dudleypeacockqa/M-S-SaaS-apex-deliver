"""merge pipeline templates and user fk fix branches

Revision ID: c80cbaa32b50
Revises: dc2c0f69c1b1, 1a11396903e4
Create Date: 2025-11-10 15:01:25.283518

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c80cbaa32b50'
down_revision: Union[str, None] = ('dc2c0f69c1b1', '1a11396903e4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
