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

    # Create templatestatus enum - handle case where it might exist with wrong values
    # If enum exists with uppercase values, we need to drop and recreate it (only if not in use)
    op.execute("""
        DO $$ 
        DECLARE
            enum_exists boolean;
            enum_in_use boolean;
        BEGIN
            -- Check if enum exists
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'templatestatus'
            ) INTO enum_exists;
            
            IF enum_exists THEN
                -- Check if enum is being used by any columns
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE udt_name = 'templatestatus'
                ) INTO enum_in_use;
                
                -- If enum exists but is not in use, drop it so we can recreate with correct values
                IF NOT enum_in_use THEN
                    DROP TYPE templatestatus CASCADE;
                END IF;
            END IF;
            
            -- Create enum with lowercase values (matching Python model)
            BEGIN
                CREATE TYPE templatestatus AS ENUM ('draft', 'active', 'archived');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END;
        END $$;
    """)

    # Ensure all enum values exist (add missing values if enum already exists)
    # Note: PostgreSQL doesn't support IF NOT EXISTS for enum values, so we use exception handling
    op.execute("""
        DO $$ BEGIN
            -- Try to add each value, ignore if it already exists or enum doesn't exist
            BEGIN
                ALTER TYPE templatestatus ADD VALUE 'draft';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
            BEGIN
                ALTER TYPE templatestatus ADD VALUE 'active';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
            BEGIN
                ALTER TYPE templatestatus ADD VALUE 'archived';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
        END $$;
    """)

    # Create documentstatus enum - handle case where it might exist with wrong values
    # CRITICAL: Python model uses lowercase values ('generated'), so enum MUST have lowercase values
    # If enum exists with uppercase values, we need to ensure lowercase values are available
    op.execute("""
        DO $$ 
        DECLARE
            enum_exists boolean;
            has_lowercase boolean;
            has_uppercase boolean;
        BEGIN
            -- Check if enum exists
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'documentstatus'
            ) INTO enum_exists;
            
            IF enum_exists THEN
                -- Check if enum has lowercase 'generated' value
                SELECT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumlabel = 'generated' 
                    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'documentstatus')
                ) INTO has_lowercase;
                
                -- Check if enum has uppercase 'GENERATED' value
                SELECT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumlabel = 'GENERATED' 
                    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'documentstatus')
                ) INTO has_uppercase;
                
                -- If enum has uppercase but not lowercase, add lowercase values
                -- PostgreSQL allows both to coexist, but we prefer lowercase to match Python model
                IF has_uppercase AND NOT has_lowercase THEN
                    -- Add lowercase values (they will coexist with uppercase)
                    BEGIN
                        ALTER TYPE documentstatus ADD VALUE 'draft';
                    EXCEPTION
                        WHEN duplicate_object THEN null;
                        WHEN OTHERS THEN null;
                    END;
                    BEGIN
                        ALTER TYPE documentstatus ADD VALUE 'generated';
                    EXCEPTION
                        WHEN duplicate_object THEN null;
                        WHEN OTHERS THEN null;
                    END;
                    BEGIN
                        ALTER TYPE documentstatus ADD VALUE 'finalized';
                    EXCEPTION
                        WHEN duplicate_object THEN null;
                        WHEN OTHERS THEN null;
                    END;
                    BEGIN
                        ALTER TYPE documentstatus ADD VALUE 'sent';
                    EXCEPTION
                        WHEN duplicate_object THEN null;
                        WHEN OTHERS THEN null;
                    END;
                    -- The lowercase values now exist, make sure downstream logic treats them as available
                    has_lowercase := TRUE;
                END IF;
            END IF;
            
            -- Create enum with lowercase values (matching Python model) if it doesn't exist
            IF NOT enum_exists THEN
                BEGIN
                    CREATE TYPE documentstatus AS ENUM ('draft', 'generated', 'finalized', 'sent');
                EXCEPTION
                    WHEN duplicate_object THEN null;
                END;
            END IF;
        END $$;
    """)

    # Ensure all enum values exist (add missing values if enum already exists)
    # Note: PostgreSQL doesn't support IF NOT EXISTS for enum values, so we use exception handling
    op.execute("""
        DO $$ BEGIN
            -- Try to add each value, ignore if it already exists or enum doesn't exist
            BEGIN
                ALTER TYPE documentstatus ADD VALUE 'draft';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
            BEGIN
                ALTER TYPE documentstatus ADD VALUE 'generated';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
            BEGIN
                ALTER TYPE documentstatus ADD VALUE 'finalized';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
            BEGIN
                ALTER TYPE documentstatus ADD VALUE 'sent';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
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
            status templatestatus DEFAULT 'active' NOT NULL,
            version INTEGER DEFAULT 1 NOT NULL,
            organization_id UUID NOT NULL REFERENCES organizations(id),
            created_by_user_id UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE
        )
    """)

    # Ensure all columns exist (handle case where table exists but columns are missing)
    # First, ensure the enum has the lowercase 'active' value before using it
    op.execute("""
        DO $$ BEGIN
            -- Try to add lowercase 'active' value if it doesn't exist
            -- This handles case where enum exists with uppercase values
            BEGIN
                ALTER TYPE templatestatus ADD VALUE 'active';
            EXCEPTION
                WHEN duplicate_object THEN null;
                WHEN undefined_object THEN null;
                WHEN OTHERS THEN null;
            END;
        END $$;
    """)
    
    op.execute("""
        DO $$ BEGIN
            -- Add status column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_templates' AND column_name = 'status'
            ) THEN
                ALTER TABLE document_templates 
                ADD COLUMN status templatestatus DEFAULT 'active' NOT NULL;
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
    # First determine the correct enum value to use
    op.execute("""
        DO $$ 
        DECLARE
            has_lowercase boolean;
            has_uppercase boolean;
            default_val text;
            enum_exists boolean;
        BEGIN
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'documentstatus'
            ) INTO enum_exists;

            IF NOT enum_exists THEN
                RAISE NOTICE 'documentstatus enum missing; skipping generated_documents.status backfill block';
                RETURN;
            END IF;

            -- Check if enum has lowercase 'generated' value
            SELECT EXISTS (
                SELECT 1 FROM pg_enum 
                WHERE enumlabel = 'generated' 
                AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'documentstatus')
            ) INTO has_lowercase;
            
            -- Check if enum has uppercase 'GENERATED' value
            SELECT EXISTS (
                SELECT 1 FROM pg_enum 
                WHERE enumlabel = 'GENERATED' 
                AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'documentstatus')
            ) INTO has_uppercase;
            
            -- Determine which default value to use
            IF has_lowercase THEN
                default_val := 'generated';
            ELSIF has_uppercase THEN
                default_val := 'GENERATED';
            ELSE
                default_val := 'generated';  -- Default to lowercase
            END IF;
            
            -- Create table if it doesn't exist, using the determined default value
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_name = 'generated_documents'
            ) THEN
                EXECUTE format('CREATE TABLE generated_documents (
                    id UUID PRIMARY KEY,
                    template_id UUID NOT NULL REFERENCES document_templates(id),
                    generated_content TEXT NOT NULL,
                    variable_values JSON DEFAULT ''{}'' NOT NULL,
                    file_path VARCHAR,
                    status documentstatus DEFAULT %L NOT NULL,
                    organization_id UUID NOT NULL REFERENCES organizations(id),
                    generated_by_user_id UUID NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
                    updated_at TIMESTAMP WITH TIME ZONE
                )', default_val);
            END IF;
        END $$;
    """)

    # Ensure all columns exist (handle case where table exists but columns are missing)
    # Check what enum values exist and use the appropriate case
    op.execute("""
        DO $$ 
        DECLARE
            has_lowercase boolean;
            has_uppercase boolean;
            default_val text;
            enum_exists boolean;
        BEGIN
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'documentstatus'
            ) INTO enum_exists;

            IF NOT enum_exists THEN
                RAISE NOTICE 'documentstatus enum missing; skipping generated_documents.status backfill';
                RETURN;
            END IF;

            -- Check if enum has lowercase 'generated' value
            SELECT EXISTS (
                SELECT 1 FROM pg_enum 
                WHERE enumlabel = 'generated' 
                AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'documentstatus')
            ) INTO has_lowercase;
            
            -- Check if enum has uppercase 'GENERATED' value
            SELECT EXISTS (
                SELECT 1 FROM pg_enum 
                WHERE enumlabel = 'GENERATED' 
                AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'documentstatus')
            ) INTO has_uppercase;
            
            -- Determine which default value to use
            IF has_lowercase THEN
                default_val := 'generated';
            ELSIF has_uppercase THEN
                default_val := 'GENERATED';
            ELSE
                -- Neither exists, try to add lowercase
                BEGIN
                    ALTER TYPE documentstatus ADD VALUE 'generated';
                    default_val := 'generated';
                EXCEPTION
                    WHEN duplicate_object THEN 
                        default_val := 'generated';
                    WHEN OTHERS THEN
                        RAISE EXCEPTION 'Could not determine or create documentstatus enum value';
                END;
            END IF;
            
            -- Add status column if it doesn't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'generated_documents' AND column_name = 'status'
            ) THEN
                EXECUTE format('ALTER TABLE generated_documents 
                    ADD COLUMN status documentstatus DEFAULT %L NOT NULL', default_val);
            END IF;
        END $$;
    """)
    
    op.execute("""
        DO $$ BEGIN
            
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
