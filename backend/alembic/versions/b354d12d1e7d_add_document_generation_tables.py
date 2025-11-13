"""add_document_generation_tables

Revision ID: b354d12d1e7d
Revises: f867c7e3d51c
Create Date: 2025-11-13 04:20:30.426687

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b354d12d1e7d'
down_revision: Union[str, None] = 'f867c7e3d51c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create document_templates table
    op.create_table(
        'document_templates',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('template_type', sa.String(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('variables', sa.JSON(), nullable=False, server_default='[]'),
        sa.Column('status', sa.Enum('DRAFT', 'ACTIVE', 'ARCHIVED', name='templatestatus'), nullable=False, server_default='ACTIVE'),
        sa.Column('version', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('created_by_user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Create indexes for document_templates
    op.create_index('idx_document_templates_organization_id', 'document_templates', ['organization_id'])
    op.create_index('idx_document_templates_status', 'document_templates', ['status'])
    op.create_index('idx_document_templates_template_type', 'document_templates', ['template_type'])
    op.create_index('idx_document_templates_created_at', 'document_templates', ['created_at'])

    # Create generated_documents table
    op.create_table(
        'generated_documents',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('template_id', sa.String(36), sa.ForeignKey('document_templates.id'), nullable=False),
        sa.Column('generated_content', sa.Text(), nullable=False),
        sa.Column('variable_values', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('file_path', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'GENERATED', 'FINALIZED', 'SENT', name='documentstatus'), nullable=False, server_default='GENERATED'),
        sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('generated_by_user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # Create indexes for generated_documents
    op.create_index('idx_generated_documents_organization_id', 'generated_documents', ['organization_id'])
    op.create_index('idx_generated_documents_template_id', 'generated_documents', ['template_id'])
    op.create_index('idx_generated_documents_status', 'generated_documents', ['status'])
    op.create_index('idx_generated_documents_created_at', 'generated_documents', ['created_at'])


def downgrade() -> None:
    # Drop indexes first
    op.drop_index('idx_generated_documents_created_at', 'generated_documents')
    op.drop_index('idx_generated_documents_status', 'generated_documents')
    op.drop_index('idx_generated_documents_template_id', 'generated_documents')
    op.drop_index('idx_generated_documents_organization_id', 'generated_documents')

    op.drop_index('idx_document_templates_created_at', 'document_templates')
    op.drop_index('idx_document_templates_template_type', 'document_templates')
    op.drop_index('idx_document_templates_status', 'document_templates')
    op.drop_index('idx_document_templates_organization_id', 'document_templates')

    # Drop tables
    op.drop_table('generated_documents')
    op.drop_table('document_templates')

    # Drop enums
    op.execute('DROP TYPE documentstatus')
    op.execute('DROP TYPE templatestatus')
