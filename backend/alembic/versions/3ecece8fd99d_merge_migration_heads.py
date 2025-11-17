"""merge_migration_heads

Revision ID: 3ecece8fd99d
Revises: 9a90b381abd5
Create Date: 2025-11-17 15:21:18.091161

Note: Removed broken reference to f6c0cba0b97a migration that doesn't exist.
The metadata column for document_access_logs is handled by ffd0bb93a551 migration.

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3ecece8fd99d'
down_revision: Union[str, None] = '9a90b381abd5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
