"""rename metadata to access_metadata in document_access_logs

Revision ID: ffd0bb93a551
Revises: 65e4b4ef883d
Create Date: 2025-11-17 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ffd0bb93a551'
down_revision: Union[str, None] = '65e4b4ef883d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Rename 'metadata' column to 'access_metadata' to avoid SQLAlchemy reserved word conflict."""
    # Check if the table and old column exist before renaming
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # Only rename if table exists and has 'metadata' column
    if 'document_access_logs' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('document_access_logs')]
        if 'metadata' in columns and 'access_metadata' not in columns:
            op.alter_column('document_access_logs', 'metadata', new_column_name='access_metadata')


def downgrade() -> None:
    """Revert the column rename."""
    # Check if the table and new column exist before reverting
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # Only rename back if table exists and has 'access_metadata' column
    if 'document_access_logs' in inspector.get_table_names():
        columns = [col['name'] for col in inspector.get_columns('document_access_logs')]
        if 'access_metadata' in columns and 'metadata' not in columns:
            op.alter_column('document_access_logs', 'access_metadata', new_column_name='metadata')
