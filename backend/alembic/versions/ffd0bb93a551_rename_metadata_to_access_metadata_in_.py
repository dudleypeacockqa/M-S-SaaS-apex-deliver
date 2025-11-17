"""rename_metadata_to_access_metadata_in_document_access_logs

Revision ID: ffd0bb93a551
Revises: 3ecece8fd99d
Create Date: 2025-11-17 15:21:27.901798

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sqlalchemy_inspect


# revision identifiers, used by Alembic.
revision: str = 'ffd0bb93a551'
down_revision: Union[str, None] = '3ecece8fd99d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Rename 'metadata' column to 'access_metadata' if table and column exist."""
    # Check if table exists before renaming column
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    if 'document_access_logs' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('document_access_logs')]
        # Only rename if metadata column exists and access_metadata doesn't exist
        if 'metadata' in columns and 'access_metadata' not in columns:
            op.alter_column('document_access_logs', 'metadata', new_column_name='access_metadata')


def downgrade() -> None:
    """Revert the column rename if table exists."""
    # Check if table exists before renaming column back
    connection = op.get_bind()
    inspector = sa.inspect(connection)
    
    if 'document_access_logs' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('document_access_logs')]
        # Only rename back if access_metadata exists and metadata doesn't exist
        if 'access_metadata' in columns and 'metadata' not in columns:
            op.alter_column('document_access_logs', 'access_metadata', new_column_name='metadata')
