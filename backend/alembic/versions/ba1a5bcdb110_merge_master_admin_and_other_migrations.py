"""merge_master_admin_and_other_migrations

Revision ID: ba1a5bcdb110
Revises: 4424a0552789, a1b2c3d4e5f6
Create Date: 2025-11-01 06:57:09.460682

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ba1a5bcdb110'
down_revision: Union[str, None] = ('4424a0552789', 'a1b2c3d4e5f6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
