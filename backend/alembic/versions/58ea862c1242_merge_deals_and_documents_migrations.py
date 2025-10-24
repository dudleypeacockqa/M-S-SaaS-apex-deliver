"""merge deals and documents migrations

Revision ID: 58ea862c1242
Revises: 36b3e62b4148, d37ed4cd3013
Create Date: 2025-10-24 16:12:54.269122

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58ea862c1242'
down_revision: Union[str, None] = ('36b3e62b4148', 'd37ed4cd3013')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
