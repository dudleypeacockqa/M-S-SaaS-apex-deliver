"""add document and folder tables for secure data room

Revision ID: d37ed4cd3013
Revises: 8dcb6880a52b
Create Date: 2025-10-24 15:24:02.326941

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = 'd37ed4cd3013'
down_revision: Union[str, None] = '8dcb6880a52b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create folders table
    op.create_table(
        'folders',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('deal_id', sa.String(36), nullable=False),
        sa.Column('parent_folder_id', sa.String(length=36), nullable=True),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('created_by', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['parent_folder_id'], ['folders.id']),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id']),
        sa.ForeignKeyConstraint(['created_by'], ['users.id']),
    )
    op.create_index('idx_folders_deal_id', 'folders', ['deal_id'])
    op.create_index('idx_folders_parent_id', 'folders', ['parent_folder_id'])
    op.create_index('idx_folders_org_id', 'folders', ['organization_id'])

    # Create documents table
    op.create_table(
        'documents',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('file_key', sa.String(500), nullable=False, unique=True),
        sa.Column('file_size', sa.BigInteger, nullable=False),
        sa.Column('file_type', sa.String(100), nullable=False),
        sa.Column('deal_id', sa.String(36), nullable=False),
        sa.Column('folder_id', sa.String(length=36), nullable=True),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('uploaded_by', sa.String(length=36), nullable=False),
        sa.Column('version', sa.Integer, default=1, nullable=False),
        sa.Column('parent_document_id', sa.String(length=36), nullable=True),
        sa.Column('archived_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['folder_id'], ['folders.id']),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id']),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id']),
        sa.ForeignKeyConstraint(['parent_document_id'], ['documents.id']),
    )
    op.create_index('idx_documents_deal_id', 'documents', ['deal_id'])
    op.create_index('idx_documents_folder_id', 'documents', ['folder_id'])
    op.create_index('idx_documents_org_id', 'documents', ['organization_id'])
    op.create_index('idx_documents_name', 'documents', ['name'])
    op.create_index('idx_documents_uploaded_by', 'documents', ['uploaded_by'])
    op.create_index('idx_documents_created_at', 'documents', ['created_at'])

    # Create document_permissions table
    op.create_table(
        'document_permissions',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('document_id', sa.String(length=36), nullable=True),
        sa.Column('folder_id', sa.String(length=36), nullable=True),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('permission_level', sa.String(20), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('granted_by', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id']),
        sa.ForeignKeyConstraint(['folder_id'], ['folders.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id']),
        sa.ForeignKeyConstraint(['granted_by'], ['users.id']),
        sa.CheckConstraint(
            "(document_id IS NOT NULL AND folder_id IS NULL) OR (document_id IS NULL AND folder_id IS NOT NULL)",
            name="permission_target_check"
        ),
    )
    op.create_index('idx_doc_perms_document_id', 'document_permissions', ['document_id'])
    op.create_index('idx_doc_perms_folder_id', 'document_permissions', ['folder_id'])
    op.create_index('idx_doc_perms_user_id', 'document_permissions', ['user_id'])
    op.create_index('idx_doc_perms_org_id', 'document_permissions', ['organization_id'])

    # Create document_access_logs table
    op.create_table(
        'document_access_logs',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('document_id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('action', sa.String(50), nullable=False),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id']),
    )
    op.create_index('idx_access_logs_document_id', 'document_access_logs', ['document_id'])
    op.create_index('idx_access_logs_user_id', 'document_access_logs', ['user_id'])
    op.create_index('idx_access_logs_org_id', 'document_access_logs', ['organization_id'])
    op.create_index('idx_access_logs_created_at', 'document_access_logs', ['created_at'])


def downgrade() -> None:
    op.drop_table('document_access_logs')
    op.drop_table('document_permissions')
    op.drop_table('documents')
    op.drop_table('folders')
