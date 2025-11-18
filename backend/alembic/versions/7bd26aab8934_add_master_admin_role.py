"""add_master_admin_role

Revision ID: 7bd26aab8934
Revises: d8ea8ff55322
Create Date: 2025-11-18 11:10:18.993964

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7bd26aab8934'
down_revision: Union[str, None] = 'd8ea8ff55322'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Note: The role column is stored as String(32), not a PostgreSQL enum type
    # So we don't need to alter an enum type - the master_admin value can be stored directly
    # This migration is a placeholder to ensure proper migration ordering
    # The actual role value will be set via the user setup migration
    pass


def downgrade() -> None:
    # Note: PostgreSQL does not support removing enum values directly
    # This would require recreating the enum type, which is complex
    # For now, we'll leave the enum value in place
    # In production, this should be handled with a data migration if needed
    pass
