"""merge heads 3ecece8, f6c0cba, and a1b2c3d4e5f8

Revision ID: 20251118104453
Revises: 3ecece8fd99d, f6c0cba0b97a, a1b2c3d4e5f8
Create Date: 2025-11-18 10:44:53.000000

This migration merges all head revisions:
- 3ecece8fd99d: merge_migration_heads (revises 9a90b381abd5)
- f6c0cba0b97a: add_metadata_to_document_access_logs (revises 9a90b381abd5, d37ed4cd3013)
- a1b2c3d4e5f8: add_metadata_json_safely (revises 079ee49539ef)

This creates a single head for the migration chain.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20251118104453'
down_revision: Union[str, Sequence[str], None] = ('3ecece8fd99d', 'f6c0cba0b97a', 'a1b2c3d4e5f8')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

