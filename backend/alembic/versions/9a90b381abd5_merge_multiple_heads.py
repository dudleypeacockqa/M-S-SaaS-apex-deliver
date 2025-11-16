"""merge multiple heads

Revision ID: 9a90b381abd5
Revises: 65e4b4ef883d, aae3309a2a8b
Create Date: 2025-11-16 17:13:48.506397

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9a90b381abd5'
down_revision: Union[str, None] = ('65e4b4ef883d', 'aae3309a2a8b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
