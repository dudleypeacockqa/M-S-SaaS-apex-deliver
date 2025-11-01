"""Manually apply Master Admin Portal tables migration."""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))

# SQL to create enums and tables
sql_script = """
-- Create enum types
DO $$ BEGIN
    CREATE TYPE activitytype AS ENUM ('discovery', 'email', 'video', 'call');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activitystatus AS ENUM ('done', 'pending', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE nudgetype AS ENUM ('reminder', 'suggestion', 'alert', 'celebration');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE nudgepriority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meetingtype AS ENUM ('discovery', 'demo', 'negotiation', 'closing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prospectstatus AS ENUM ('new', 'qualified', 'engaged', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admindealstage AS ENUM ('discovery', 'qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaigntype AS ENUM ('email', 'sms', 'mixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaignstatus AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contenttype AS ENUM ('youtube', 'podcast', 'blog', 'social');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contentstatus AS ENUM ('idea', 'scripting', 'recording', 'editing', 'ready', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Now create tables (this will be a long script - continuing in next command)
"""

print("Applying Master Admin Portal migration...")
print("Step 1: Creating enum types...")

with engine.connect() as conn:
    trans = conn.begin()
    try:
        # Execute the SQL
        for statement in sql_script.strip().split(';'):
            if statement.strip():
                conn.execute(text(statement))

        trans.commit()
        print("✓ Enum types created successfully!")
    except Exception as e:
        trans.rollback()
        print(f"Error creating enums: {e}")
        raise

print("\nEnums created. Tables will be created next...")
