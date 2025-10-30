"""merge newsletter and blog migrations

Revision ID: 4424a0552789
Revises: 1e0b14d2c1a3, 5c9c13500fb2
Create Date: 2025-10-30 09:27:39.030516

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4424a0552789'
down_revision: Union[str, None] = ('1e0b14d2c1a3', '5c9c13500fb2')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
