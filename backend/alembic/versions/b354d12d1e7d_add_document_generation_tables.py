"""add_document_generation_tables

Revision ID: b354d12d1e7d
Revises: f867c7e3d51c
Create Date: 2025-11-13 04:20:30.426687

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'b354d12d1e7d'
down_revision: Union[str, None] = 'f867c7e3d51c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create document generation tables if they don't exist (idempotent)."""

    # Create ENUMs if they don't exist
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE templatestatus AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE documentstatus AS ENUM ('DRAFT', 'GENERATED', 'FINALIZED', 'SENT');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)

    # Create document_templates table if not exists
    op.execute("""
        CREATE TABLE IF NOT EXISTS document_templates (
            id UUID PRIMARY KEY,
            name VARCHAR NOT NULL,
            description TEXT,
            template_type VARCHAR,
            content TEXT NOT NULL,
            variables JSON DEFAULT '[]' NOT NULL,
            status templatestatus DEFAULT 'ACTIVE' NOT NULL,
            version INTEGER DEFAULT 1 NOT NULL,
            organization_id UUID NOT NULL REFERENCES organizations(id),
            created_by_user_id UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE
        )
    """)

    # Create indexes for document_templates (idempotent)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_document_templates_organization_id ON document_templates(organization_id);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_document_templates_status ON document_templates(status);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_document_templates_template_type ON document_templates(template_type);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_document_templates_created_at ON document_templates(created_at);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)

    # Create generated_documents table if not exists
    op.execute("""
        CREATE TABLE IF NOT EXISTS generated_documents (
            id UUID PRIMARY KEY,
            template_id UUID NOT NULL REFERENCES document_templates(id),
            generated_content TEXT NOT NULL,
            variable_values JSON DEFAULT '{}' NOT NULL,
            file_path VARCHAR,
            status documentstatus DEFAULT 'GENERATED' NOT NULL,
            organization_id UUID NOT NULL REFERENCES organizations(id),
            generated_by_user_id UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE
        )
    """)

    # Create indexes for generated_documents (idempotent)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_generated_documents_organization_id ON generated_documents(organization_id);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_generated_documents_template_id ON generated_documents(template_id);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_generated_documents_status ON generated_documents(status);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE INDEX idx_generated_documents_created_at ON generated_documents(created_at);
        EXCEPTION WHEN duplicate_table THEN
            NULL;
        END $$;
    """)


def downgrade() -> None:
    """Drop document generation tables if they exist (idempotent)."""

    # Drop indexes first (idempotent)
    op.execute("DROP INDEX IF EXISTS idx_generated_documents_created_at")
    op.execute("DROP INDEX IF EXISTS idx_generated_documents_status")
    op.execute("DROP INDEX IF EXISTS idx_generated_documents_template_id")
    op.execute("DROP INDEX IF EXISTS idx_generated_documents_organization_id")

    op.execute("DROP INDEX IF EXISTS idx_document_templates_created_at")
    op.execute("DROP INDEX IF EXISTS idx_document_templates_template_type")
    op.execute("DROP INDEX IF EXISTS idx_document_templates_status")
    op.execute("DROP INDEX IF EXISTS idx_document_templates_organization_id")

    # Drop tables (idempotent)
    op.execute("DROP TABLE IF EXISTS generated_documents CASCADE")
    op.execute("DROP TABLE IF EXISTS document_templates CASCADE")

    # Drop enums (idempotent)
    op.execute("DROP TYPE IF EXISTS documentstatus")
    op.execute("DROP TYPE IF EXISTS templatestatus")
