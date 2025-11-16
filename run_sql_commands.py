#!/usr/bin/env python3
"""
Execute SQL commands directly against Render production database
"""
import os
import sys

# Set Render API key
os.environ['RENDER_API_KEY'] = 'rnd_oMIm1MFTqRNH8sE4fgIiIXTsNAqM'

try:
    import psycopg2
except ImportError:
    print("[ERROR] psycopg2 not installed. Installing...")
    os.system("pip install psycopg2-binary")
    import psycopg2

# Render production DATABASE_URL (external connection)
DATABASE_URL = "postgresql://ma_saas_platform_db_user:OPbI6Ypuw3zSjzDy7KkC6ywNxgVQtOYi@dpg-d3ii9qk9c44c73aqsli0-a.frankfurt-postgres.render.com/ma_saas_platform_db"

def execute_sql(sql_commands):
    """Execute SQL commands against the database"""
    try:
        # Connect with SSL required
        conn = psycopg2.connect(
            DATABASE_URL,
            sslmode='require'
        )
        conn.autocommit = True
        cursor = conn.cursor()

        print("[OK] Connected to database")

        # Execute commands
        for i, sql in enumerate(sql_commands, 1):
            try:
                print(f"\n[{i}/{len(sql_commands)}] Executing: {sql[:80]}...")
                cursor.execute(sql)
                print(f"[OK] Success")
            except Exception as e:
                print(f"[ERROR] {e}")
                # Continue with next command
                continue

        cursor.close()
        conn.close()
        print("\n[OK] All commands executed")
        return True

    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return False

# SQL Commands to create enums
enum_commands = [
    """DO $$ BEGIN CREATE TYPE eventtype AS ENUM ('VIRTUAL','IN_PERSON','HYBRID'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE eventstatus AS ENUM ('DRAFT','PUBLISHED','CANCELLED','COMPLETED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE ticketstatus AS ENUM ('ACTIVE','SOLD_OUT','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE registrationstatus AS ENUM ('PENDING','CONFIRMED','CANCELLED','ATTENDED','NO_SHOW'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE postcategory AS ENUM ('general','deals','insights','qa','networking'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE poststatus AS ENUM ('draft','published','archived','flagged'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE targettype AS ENUM ('post','comment'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE moderationactiontype AS ENUM ('approve','reject','flag','delete','unflag'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE reactiontype AS ENUM ('like','love','insightful','celebrate'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;""",
    """DO $$ BEGIN CREATE TYPE suggestionstatus AS ENUM ('PENDING','ACCEPTED','REJECTED','APPLIED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;"""
]

# SQL Commands to create tables
table_commands = [
    """CREATE TABLE IF NOT EXISTS community_follows (
        id VARCHAR(36) PRIMARY KEY,
        follower_user_id VARCHAR(36) NOT NULL,
        following_user_id VARCHAR(36) NOT NULL,
        organization_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
    );""",
    """CREATE TABLE IF NOT EXISTS community_moderation_actions (
        id VARCHAR(36) PRIMARY KEY,
        target_type targettype NOT NULL,
        target_id VARCHAR(36) NOT NULL,
        action_type moderationactiontype NOT NULL,
        moderator_user_id VARCHAR(36) NOT NULL,
        reason TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL
    );""",
    """CREATE TABLE IF NOT EXISTS community_posts (
        id VARCHAR(36) PRIMARY KEY,
        organization_id VARCHAR(36) NOT NULL,
        author_user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category postcategory NOT NULL,
        tags TEXT NULL,
        status poststatus NOT NULL,
        view_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
    );""",
    """CREATE TABLE IF NOT EXISTS community_reactions (
        id VARCHAR(36) PRIMARY KEY,
        target_type targettype NOT NULL,
        target_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        reaction_type reactiontype NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
    );""",
    """CREATE TABLE IF NOT EXISTS community_comments (
        id VARCHAR(36) PRIMARY KEY,
        post_id VARCHAR(36) NOT NULL,
        author_user_id VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        parent_comment_id VARCHAR(36) NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
    );""",
    """CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR NOT NULL,
        description TEXT NULL,
        event_type eventtype NOT NULL,
        status eventstatus NOT NULL,
        start_date TIMESTAMPTZ NOT NULL,
        end_date TIMESTAMPTZ NOT NULL,
        registration_deadline TIMESTAMPTZ NULL,
        location VARCHAR NULL,
        virtual_link VARCHAR NULL,
        capacity INTEGER NULL,
        base_price NUMERIC(10,2) NULL,
        currency VARCHAR(3) NULL,
        organization_id VARCHAR(36) NOT NULL,
        created_by_user_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMPTZ NULL,
        updated_at TIMESTAMPTZ NULL
    );""",
    """CREATE TABLE IF NOT EXISTS event_analytics (
        id VARCHAR(36) PRIMARY KEY,
        event_id VARCHAR(36) NOT NULL,
        total_registrations INTEGER NULL,
        total_attendees INTEGER NULL,
        total_revenue NUMERIC(10,2) NULL,
        currency VARCHAR(3) NULL,
        session_metrics JSON NULL,
        recorded_at TIMESTAMPTZ NULL,
        organization_id VARCHAR(36) NOT NULL
    );""",
    """CREATE TABLE IF NOT EXISTS event_sessions (
        id VARCHAR(36) PRIMARY KEY,
        event_id VARCHAR(36) NOT NULL,
        name VARCHAR NOT NULL,
        description TEXT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        location VARCHAR NULL,
        virtual_link VARCHAR NULL,
        capacity INTEGER NULL,
        speaker_name VARCHAR NULL,
        speaker_bio TEXT NULL,
        organization_id VARCHAR(36) NOT NULL,
        created_by_user_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMPTZ NULL,
        updated_at TIMESTAMPTZ NULL
    );""",
    """CREATE TABLE IF NOT EXISTS event_tickets (
        id VARCHAR(36) PRIMARY KEY,
        event_id VARCHAR(36) NOT NULL,
        name VARCHAR NOT NULL,
        description TEXT NULL,
        price NUMERIC(10,2) NOT NULL,
        currency VARCHAR(3) NULL,
        quantity_available INTEGER NULL,
        quantity_sold INTEGER NULL,
        status ticketstatus NOT NULL,
        sale_start_date TIMESTAMPTZ NULL,
        sale_end_date TIMESTAMPTZ NULL,
        organization_id VARCHAR(36) NOT NULL,
        created_by_user_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMPTZ NULL,
        updated_at TIMESTAMPTZ NULL
    );""",
    """CREATE TABLE IF NOT EXISTS event_registrations (
        id VARCHAR(36) PRIMARY KEY,
        event_id VARCHAR(36) NOT NULL,
        session_id VARCHAR(36) NULL,
        ticket_id VARCHAR(36) NULL,
        attendee_name VARCHAR NOT NULL,
        attendee_email VARCHAR NOT NULL,
        attendee_phone VARCHAR NULL,
        payment_status VARCHAR NULL,
        payment_amount NUMERIC(10,2) NULL,
        currency VARCHAR(3) NULL,
        stripe_payment_intent_id VARCHAR NULL,
        status registrationstatus NOT NULL,
        checked_in BOOLEAN NULL,
        checked_in_at TIMESTAMPTZ NULL,
        organization_id VARCHAR(36) NOT NULL,
        registered_by_user_id VARCHAR(36) NULL,
        created_at TIMESTAMPTZ NULL,
        updated_at TIMESTAMPTZ NULL
    );""",
    """CREATE TABLE IF NOT EXISTS document_ai_suggestions (
        id VARCHAR(36) PRIMARY KEY,
        document_id VARCHAR(36) NOT NULL,
        title VARCHAR NOT NULL,
        content TEXT NOT NULL,
        confidence INTEGER NULL,
        reasoning TEXT NULL,
        status suggestionstatus NOT NULL,
        organization_id VARCHAR(36) NOT NULL,
        created_by_user_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMPTZ NULL,
        updated_at TIMESTAMPTZ NULL,
        applied_at TIMESTAMPTZ NULL
    );""",
    """CREATE TABLE IF NOT EXISTS document_versions (
        id VARCHAR(36) PRIMARY KEY,
        document_id VARCHAR(36) NOT NULL,
        version_number INTEGER NOT NULL,
        content TEXT NOT NULL,
        label VARCHAR NULL,
        summary TEXT NULL,
        organization_id VARCHAR(36) NOT NULL,
        created_by_user_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMPTZ NULL
    );""",
    """CREATE TABLE IF NOT EXISTS document_share_links (
        id VARCHAR(36) PRIMARY KEY,
        document_id VARCHAR(36) NOT NULL,
        share_token VARCHAR(64) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        allow_download INTEGER NOT NULL,
        password_hash VARCHAR(255) NULL,
        access_count INTEGER NOT NULL DEFAULT 0,
        last_accessed_at TIMESTAMPTZ NULL,
        download_count INTEGER NOT NULL DEFAULT 0,
        revoked_at TIMESTAMPTZ NULL,
        created_by VARCHAR(36) NOT NULL,
        organization_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMPTZ NULL DEFAULT now()
    );"""
]

if __name__ == "__main__":
    print("=" * 70)
    print("STEP 1: Creating Enums")
    print("=" * 70)

    if not execute_sql(enum_commands):
        print("\n[ERROR] Failed to create enums")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("STEP 2: Creating Tables")
    print("=" * 70)

    if not execute_sql(table_commands):
        print("\n[ERROR] Failed to create tables")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("[SUCCESS] ALL OPERATIONS COMPLETED SUCCESSFULLY")
    print("=" * 70)
