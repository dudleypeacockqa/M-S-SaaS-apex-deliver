"""merge multi-head state

Revision ID: 8b95e2bec471
Revises: 20251119120000, pmi_notif_prefs_001, b22b7d96dcfc, b6f9d4a12abc
Create Date: 2025-11-19 16:53:30.209475

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8b95e2bec471'
down_revision: Union[str, None] = ('20251119120000', 'pmi_notif_prefs_001', 'b22b7d96dcfc', 'b6f9d4a12abc')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
