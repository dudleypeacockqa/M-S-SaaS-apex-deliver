"""merge email notifications and uuid-event-payment merge

Revision ID: 91614ff3fbf6
Revises: b2c3d4e5f6a8, b9003e932e59
Create Date: 2025-11-13 16:26:03.006359

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91614ff3fbf6'
down_revision: Union[str, None] = ('b2c3d4e5f6a8', 'b9003e932e59')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
