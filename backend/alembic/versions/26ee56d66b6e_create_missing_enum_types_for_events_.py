"""create missing enum types for events and community

Revision ID: 26ee56d66b6e
Revises: aae3309a2a8b
Create Date: 2025-11-16 07:09:42.300599

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '26ee56d66b6e'
down_revision: Union[str, None] = 'aae3309a2a8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create missing enum types for events and community modules."""
    # Execute SQL to create enum types (idempotent - won't fail if they already exist)
    op.execute("""
        -- Event-related enum types
        DO $$ BEGIN
            CREATE TYPE eventtype AS ENUM ('VIRTUAL','IN_PERSON','HYBRID');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
            CREATE TYPE eventstatus AS ENUM ('DRAFT','PUBLISHED','CANCELLED','COMPLETED');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
            CREATE TYPE ticketstatus AS ENUM ('ACTIVE','SOLD_OUT','CANCELLED');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
            CREATE TYPE registrationstatus AS ENUM ('PENDING','CONFIRMED','CANCELLED','ATTENDED','NO_SHOW');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        -- Community-related enum types
        DO $$ BEGIN
            CREATE TYPE postcategory AS ENUM ('general','deals','insights','qa','networking');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
            CREATE TYPE poststatus AS ENUM ('draft','published','archived','flagged');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
            CREATE TYPE targettype AS ENUM ('post','comment');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
            CREATE TYPE moderationactiontype AS ENUM ('approve','reject','flag','delete','unflag');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        DO $$ BEGIN
            CREATE TYPE reactiontype AS ENUM ('like','love','insightful','celebrate');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;

        -- Document AI enum types
        DO $$ BEGIN
            CREATE TYPE suggestionstatus AS ENUM ('PENDING','ACCEPTED','REJECTED','APPLIED');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)


def downgrade() -> None:
    """Drop enum types (only if not in use by any tables)."""
    # Note: Dropping enum types that are in use will fail
    # This is intentional to prevent data loss
    op.execute("""
        DROP TYPE IF EXISTS suggestionstatus CASCADE;
        DROP TYPE IF EXISTS reactiontype CASCADE;
        DROP TYPE IF EXISTS moderationactiontype CASCADE;
        DROP TYPE IF EXISTS targettype CASCADE;
        DROP TYPE IF EXISTS poststatus CASCADE;
        DROP TYPE IF EXISTS postcategory CASCADE;
        DROP TYPE IF EXISTS registrationstatus CASCADE;
        DROP TYPE IF EXISTS ticketstatus CASCADE;
        DROP TYPE IF EXISTS eventstatus CASCADE;
        DROP TYPE IF EXISTS eventtype CASCADE;
    """)
