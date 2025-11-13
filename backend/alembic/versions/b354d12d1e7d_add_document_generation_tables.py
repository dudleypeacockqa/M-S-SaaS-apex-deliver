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

    # Ensure all columns exist (handle case where table exists but columns are missing)
    op.execute("""
        DO $$ BEGIN
            -- Add status column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'status'
            ) THEN
                ALTER TABLE document_templates 
                ADD COLUMN status templatestatus DEFAULT 'ACTIVE' NOT NULL;
            END IF;
            
            -- Add template_type column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'template_type'
            ) THEN
                ALTER TABLE document_templates 
                ADD COLUMN template_type VARCHAR;
            END IF;
            
            -- Add created_at column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'created_at'
            ) THEN
                ALTER TABLE document_templates 
                ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
            END IF;
            
            -- Add organization_id column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'organization_id'
            ) THEN
                ALTER TABLE document_templates 
                ADD COLUMN organization_id UUID NOT NULL REFERENCES organizations(id);
            END IF;
        END $$;
    """)

    # Create indexes for document_templates (idempotent)
    # Only create indexes if the columns exist
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'organization_id'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_document_templates_organization_id ON document_templates(organization_id);
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'status'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_document_templates_status ON document_templates(status);
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'template_type'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_document_templates_template_type ON document_templates(template_type);
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'created_at'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_document_templates_created_at ON document_templates(created_at);
            END IF;
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

    # Ensure all columns exist (handle case where table exists but columns are missing)
    op.execute("""
        DO $$ BEGIN
            -- Add status column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'status'
            ) THEN
                ALTER TABLE generated_documents 
                ADD COLUMN status documentstatus DEFAULT 'GENERATED' NOT NULL;
            END IF;
            
            -- Add created_at column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'created_at'
            ) THEN
                ALTER TABLE generated_documents 
                ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
            END IF;
            
            -- Add organization_id column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'organization_id'
            ) THEN
                ALTER TABLE generated_documents 
                ADD COLUMN organization_id UUID NOT NULL REFERENCES organizations(id);
            END IF;
            
            -- Add template_id column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'template_id'
            ) THEN
                ALTER TABLE generated_documents 
                ADD COLUMN template_id UUID NOT NULL REFERENCES document_templates(id);
            END IF;
        END $$;
    """)

    # Create indexes for generated_documents (idempotent)
    # Only create indexes if the columns exist
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'organization_id'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_generated_documents_organization_id ON generated_documents(organization_id);
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'template_id'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_generated_documents_template_id ON generated_documents(template_id);
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'status'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_generated_documents_status ON generated_documents(status);
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'created_at'
            ) THEN
                CREATE INDEX IF NOT EXISTS idx_generated_documents_created_at ON generated_documents(created_at);
            END IF;
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
