"""rename_metadata_to_access_metadata_in_document_access_logs

Revision ID: ffd0bb93a551
Revises: 3ecece8fd99d
Create Date: 2025-11-17 15:21:27.901798

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ffd0bb93a551'
down_revision: Union[str, None] = '3ecece8fd99d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Rename 'metadata' column to 'access_metadata' to avoid SQLAlchemy reserved word conflict
    op.alter_column('document_access_logs', 'metadata', new_column_name='access_metadata')


def downgrade() -> None:
    # Revert the column rename
    op.alter_column('document_access_logs', 'access_metadata', new_column_name='metadata')
