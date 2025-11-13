"""merge event_reminders and email_notifications heads

Revision ID: 72a37f9bc382
Revises: 91614ff3fbf6, f0a1b2c3d4e5
Create Date: 2025-11-13 16:46:43.063473

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '72a37f9bc382'
down_revision: Union[str, None] = ('91614ff3fbf6', 'f0a1b2c3d4e5')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
