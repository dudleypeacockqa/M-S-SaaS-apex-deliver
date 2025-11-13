"""merge uuid and event payment migrations

Revision ID: b9003e932e59
Revises: a1b2c3d4e5f7, e2c1f2f5a7b7
Create Date: 2025-11-13 15:15:34.292078

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b9003e932e59'
down_revision: Union[str, None] = ('a1b2c3d4e5f7', 'e2c1f2f5a7b7')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
