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

    This migration is safe to run multiple times - it checks types before converting.
    """

    # Check if documents table exists
    conn = op.get_bind()
    table_check = conn.execute(sa.text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'documents'
    """))

    if not table_check.fetchone():
        # Documents table doesn't exist yet, skip this migration
        return

    # Check if ID is UUID type
    result = conn.execute(sa.text("""
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'documents' AND column_name = 'id'
    """))
    row = result.fetchone()

    if row and row[0] == 'uuid':
        # Get all existing foreign key constraints
        fk_result = conn.execute(sa.text("""
            SELECT tc.constraint_name, tc.table_name, kcu.column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND ccu.table_name = 'documents'
              AND ccu.column_name = 'id'
        """))

        fk_constraints = [(row[0], row[1], row[2]) for row in fk_result]

        # Drop all foreign keys that reference documents.id
        for constraint_name, table_name, column_name in fk_constraints:
            try:
                op.drop_constraint(constraint_name, table_name, type_='foreignkey')
            except Exception as e:
                print(f"Warning: Could not drop constraint {constraint_name}: {e}")

        # Drop self-referencing FK on parent_document_id
        try:
            op.drop_constraint('documents_parent_document_id_fkey', 'documents', type_='foreignkey')
        except Exception:
            pass

        # Convert the ID column from UUID to VARCHAR(36)
        op.alter_column('documents', 'id',
                       existing_type=postgresql.UUID(),
                       type_=sa.String(36),
                       postgresql_using='id::text')

        # Convert parent_document_id if it exists
        parent_col_check = conn.execute(sa.text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'documents' AND column_name = 'parent_document_id'
        """))

        if parent_col_check.fetchone():
            op.alter_column('documents', 'parent_document_id',
                           existing_type=postgresql.UUID(),
                           type_=sa.String(36),
                           nullable=True,
                           postgresql_using='parent_document_id::text')

            # Recreate self-referencing FK
            op.create_foreign_key(
                'documents_parent_document_id_fkey',
                'documents', 'documents',
                ['parent_document_id'], ['id']
            )

        # Recreate all foreign keys that referenced documents.id
        for constraint_name, table_name, column_name in fk_constraints:
            try:
                # Convert the referencing column to VARCHAR(36)
                op.alter_column(table_name, column_name,
                               existing_type=postgresql.UUID(),
                               type_=sa.String(36),
                               postgresql_using=f'{column_name}::text')

                # Recreate FK
                op.create_foreign_key(
                    constraint_name,
                    table_name, 'documents',
                    [column_name], ['id'],
                    ondelete='CASCADE'
                )
            except Exception as e:
                print(f"Warning: Could not recreate constraint {constraint_name}: {e}")

        # Convert other UUID columns in documents table to VARCHAR(36)
        for col_name in ['deal_id', 'folder_id', 'organization_id', 'uploaded_by']:
            col_check = conn.execute(sa.text(f"""
                SELECT data_type
                FROM information_schema.columns
                WHERE table_name = 'documents' AND column_name = '{col_name}'
            """))
            row = col_check.fetchone()

            if row and row[0] == 'uuid':
                # Get FK constraint name
                fk_check = conn.execute(sa.text(f"""
                    SELECT tc.constraint_name
                    FROM information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = 'documents'
                      AND tc.constraint_type = 'FOREIGN KEY'
                      AND kcu.column_name = '{col_name}'
                """))

                fk_row = fk_check.fetchone()
                if fk_row:
                    try:
                        op.drop_constraint(fk_row[0], 'documents', type_='foreignkey')
                    except Exception:
                        pass

                # Convert column
                op.alter_column('documents', col_name,
                               existing_type=postgresql.UUID(),
                               type_=sa.String(36),
                               nullable=(col_name == 'folder_id'),
                               postgresql_using=f'{col_name}::text')

                # Recreate FK
                if fk_row:
                    ref_table = {'deal_id': 'deals', 'folder_id': 'folders',
                                'organization_id': 'organizations', 'uploaded_by': 'users'}[col_name]
                    try:
                        op.create_foreign_key(
                            fk_row[0],
                            'documents', ref_table,
                            [col_name], ['id']
                        )
                    except Exception:
                        pass


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
