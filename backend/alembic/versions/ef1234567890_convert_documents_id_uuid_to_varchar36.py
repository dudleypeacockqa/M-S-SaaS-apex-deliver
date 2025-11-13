"""Convert documents.id from UUID to VARCHAR(36) for consistency

Revision ID: ef1234567890
Revises: 86d427f030f2
Create Date: 2025-11-13 08:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ef1234567890'
down_revision: Union[str, None] = '86d427f030f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Convert documents table ID column from UUID to VARCHAR(36).
    This ensures consistency across all tables and allows proper foreign key relationships.
    """

    # Check if documents table exists and if ID is UUID type
    conn = op.get_bind()
    result = conn.execute(sa.text("""
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'documents' AND column_name = 'id'
    """))
    row = result.fetchone()

    if row and row[0] == 'uuid':
        # Drop foreign key constraints that reference documents.id
        op.drop_constraint('documents_parent_document_id_fkey', 'documents', type_='foreignkey')

        # Convert the ID column from UUID to VARCHAR(36)
        op.alter_column('documents', 'id',
                       existing_type=postgresql.UUID(),
                       type_=sa.String(36),
                       postgresql_using='id::text')

        # Convert parent_document_id from UUID to VARCHAR(36)
        op.alter_column('documents', 'parent_document_id',
                       existing_type=postgresql.UUID(),
                       type_=sa.String(36),
                       nullable=True,
                       postgresql_using='parent_document_id::text')

        # Recreate the foreign key constraint
        op.create_foreign_key(
            'documents_parent_document_id_fkey',
            'documents', 'documents',
            ['parent_document_id'], ['id']
        )

        # Also convert deal_id, folder_id, organization_id, uploaded_by if they are UUID
        for col_name, ref_table in [
            ('deal_id', 'deals'),
            ('folder_id', 'folders'),
            ('organization_id', 'organizations'),
            ('uploaded_by', 'users')
        ]:
            result = conn.execute(sa.text(f"""
                SELECT data_type
                FROM information_schema.columns
                WHERE table_name = 'documents' AND column_name = '{col_name}'
            """))
            row = result.fetchone()

            if row and row[0] == 'uuid':
                # Drop the foreign key first
                op.drop_constraint(f'documents_{col_name}_fkey', 'documents', type_='foreignkey')

                # Convert column
                op.alter_column('documents', col_name,
                               existing_type=postgresql.UUID(),
                               type_=sa.String(36),
                               nullable=(col_name == 'folder_id' or col_name == 'parent_document_id'),
                               postgresql_using=f'{col_name}::text')

                # Recreate foreign key
                op.create_foreign_key(
                    f'documents_{col_name}_fkey',
                    'documents', ref_table,
                    [col_name], ['id']
                )


def downgrade() -> None:
    """
    Convert documents table ID column from VARCHAR(36) back to UUID.
    This is the reverse operation.
    """

    conn = op.get_bind()
    result = conn.execute(sa.text("""
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'documents' AND column_name = 'id'
    """))
    row = result.fetchone()

    if row and row[0] == 'character varying':
        # Drop foreign key constraints
        op.drop_constraint('documents_parent_document_id_fkey', 'documents', type_='foreignkey')

        # Convert back to UUID
        op.alter_column('documents', 'id',
                       existing_type=sa.String(36),
                       type_=postgresql.UUID(),
                       postgresql_using='id::uuid')

        op.alter_column('documents', 'parent_document_id',
                       existing_type=sa.String(36),
                       type_=postgresql.UUID(),
                       nullable=True,
                       postgresql_using='parent_document_id::uuid')

        # Recreate foreign key
        op.create_foreign_key(
            'documents_parent_document_id_fkey',
            'documents', 'documents',
            ['parent_document_id'], ['id']
        )

        # Convert other columns back
        for col_name, ref_table in [
            ('deal_id', 'deals'),
            ('folder_id', 'folders'),
            ('organization_id', 'organizations'),
            ('uploaded_by', 'users')
        ]:
            result = conn.execute(sa.text(f"""
                SELECT data_type
                FROM information_schema.columns
                WHERE table_name = 'documents' AND column_name = '{col_name}'
            """))
            row = result.fetchone()

            if row and row[0] == 'character varying':
                op.drop_constraint(f'documents_{col_name}_fkey', 'documents', type_='foreignkey')

                op.alter_column('documents', col_name,
                               existing_type=sa.String(36),
                               type_=postgresql.UUID(),
                               nullable=(col_name == 'folder_id' or col_name == 'parent_document_id'),
                               postgresql_using=f'{col_name}::uuid')

                op.create_foreign_key(
                    f'documents_{col_name}_fkey',
                    'documents', ref_table,
                    [col_name], ['id']
                )
