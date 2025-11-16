-- Manual Table Creation for Missing Module Tables
-- Date: 2025-11-16
-- Purpose: Create missing tables to prevent migration 774225e563ca from failing
-- Execution: Run this in Render PostgreSQL Shell

BEGIN;

-- Create ENUM types if they don't exist
DO $$ BEGIN
    CREATE TYPE targettype AS ENUM ('post', 'comment', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE moderationactiontype AS ENUM ('warn', 'suspend', 'ban', 'delete', 'approve');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE postcategory AS ENUM ('discussion', 'question', 'announcement', 'resource');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE poststatus AS ENUM ('draft', 'published', 'archived', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reactiontype AS ENUM ('like', 'love', 'insightful', 'celebrate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE eventtype AS ENUM ('conference', 'webinar', 'workshop', 'networking', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE eventstatus AS ENUM ('draft', 'published', 'cancelled', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticketstatus AS ENUM ('available', 'sold_out', 'discontinued');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE registrationstatus AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE suggestionstatus AS ENUM ('pending', 'applied', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Community tables
CREATE TABLE IF NOT EXISTS community_follows (
  id VARCHAR(36) PRIMARY KEY,
  follower_user_id VARCHAR(36) NOT NULL,
  following_user_id VARCHAR(36) NOT NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_follows_follower ON community_follows(follower_user_id);
CREATE INDEX IF NOT EXISTS idx_community_follows_following ON community_follows(following_user_id);
CREATE INDEX IF NOT EXISTS idx_community_follows_org ON community_follows(organization_id);

CREATE TABLE IF NOT EXISTS community_moderation_actions (
  id VARCHAR(36) PRIMARY KEY,
  target_type targettype NOT NULL,
  target_id VARCHAR(36) NOT NULL,
  action_type moderationactiontype NOT NULL,
  moderator_user_id VARCHAR(36) NOT NULL,
  reason TEXT NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_moderation_target ON community_moderation_actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_community_moderation_moderator ON community_moderation_actions(moderator_user_id);
CREATE INDEX IF NOT EXISTS idx_community_moderation_org ON community_moderation_actions(organization_id);

CREATE TABLE IF NOT EXISTS community_posts (
  id VARCHAR(36) PRIMARY KEY,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  author_user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category postcategory NOT NULL,
  tags TEXT NULL,
  status poststatus NOT NULL DEFAULT 'draft',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_org ON community_posts(organization_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);

CREATE TABLE IF NOT EXISTS community_reactions (
  id VARCHAR(36) PRIMARY KEY,
  target_type targettype NOT NULL,
  target_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  reaction_type reactiontype NOT NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(target_type, target_id, user_id, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_community_reactions_target ON community_reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_user ON community_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_org ON community_reactions(organization_id);

CREATE TABLE IF NOT EXISTS community_comments (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  author_user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id VARCHAR(36) NULL REFERENCES community_comments(id) ON DELETE CASCADE,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author ON community_comments(author_user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent ON community_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_org ON community_comments(organization_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created ON community_comments(created_at DESC);

-- Events tables
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NULL,
  event_type eventtype NOT NULL,
  status eventstatus NOT NULL DEFAULT 'draft',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ NULL,
  location VARCHAR NULL,
  virtual_link VARCHAR NULL,
  capacity INTEGER NULL,
  base_price NUMERIC(10,2) NULL,
  currency VARCHAR(3) NULL DEFAULT 'USD',
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_org ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by_user_id);

CREATE TABLE IF NOT EXISTS event_analytics (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  total_registrations INTEGER NULL DEFAULT 0,
  total_attendees INTEGER NULL DEFAULT 0,
  total_revenue NUMERIC(10,2) NULL DEFAULT 0,
  currency VARCHAR(3) NULL DEFAULT 'USD',
  session_metrics JSON NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_event_analytics_event ON event_analytics(event_id);
CREATE INDEX IF NOT EXISTS idx_event_analytics_org ON event_analytics(organization_id);
CREATE INDEX IF NOT EXISTS idx_event_analytics_recorded ON event_analytics(recorded_at DESC);

CREATE TABLE IF NOT EXISTS event_sessions (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR NULL,
  virtual_link VARCHAR NULL,
  capacity INTEGER NULL,
  speaker_name VARCHAR NULL,
  speaker_bio TEXT NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_sessions_event ON event_sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sessions_org ON event_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_event_sessions_start ON event_sessions(start_time);

CREATE TABLE IF NOT EXISTS event_tickets (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) NULL DEFAULT 'USD',
  quantity_available INTEGER NULL,
  quantity_sold INTEGER NULL DEFAULT 0,
  status ticketstatus NOT NULL DEFAULT 'available',
  sale_start_date TIMESTAMPTZ NULL,
  sale_end_date TIMESTAMPTZ NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_tickets_event ON event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_org ON event_tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_status ON event_tickets(status);

CREATE TABLE IF NOT EXISTS event_registrations (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  session_id VARCHAR(36) NULL REFERENCES event_sessions(id) ON DELETE SET NULL,
  ticket_id VARCHAR(36) NULL REFERENCES event_tickets(id) ON DELETE SET NULL,
  attendee_name VARCHAR NOT NULL,
  attendee_email VARCHAR NOT NULL,
  attendee_phone VARCHAR NULL,
  payment_status VARCHAR NULL,
  payment_amount NUMERIC(10,2) NULL,
  currency VARCHAR(3) NULL DEFAULT 'USD',
  stripe_payment_intent_id VARCHAR NULL,
  status registrationstatus NOT NULL DEFAULT 'pending',
  checked_in BOOLEAN NULL DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  registered_by_user_id VARCHAR(36) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_org ON event_registrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(attendee_email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);

-- Document AI / Versions / Share Links
CREATE TABLE IF NOT EXISTS document_ai_suggestions (
  id VARCHAR(36) PRIMARY KEY,
  document_id VARCHAR(36) NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  confidence INTEGER NULL CHECK (confidence >= 0 AND confidence <= 100),
  reasoning TEXT NULL,
  status suggestionstatus NOT NULL DEFAULT 'pending',
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  applied_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_document_ai_suggestions_document ON document_ai_suggestions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_ai_suggestions_org ON document_ai_suggestions(organization_id);
CREATE INDEX IF NOT EXISTS idx_document_ai_suggestions_status ON document_ai_suggestions(status);

CREATE TABLE IF NOT EXISTS document_versions (
  id VARCHAR(36) PRIMARY KEY,
  document_id VARCHAR(36) NOT NULL,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  label VARCHAR NULL,
  summary TEXT NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by_user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_document_versions_document ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_org ON document_versions(organization_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_created ON document_versions(created_at DESC);

CREATE TABLE IF NOT EXISTS document_share_links (
  id VARCHAR(36) PRIMARY KEY,
  document_id VARCHAR(36) NOT NULL,
  share_token VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  allow_download BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash VARCHAR(255) NULL,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  revoked_at TIMESTAMPTZ NULL,
  created_by VARCHAR(36) NOT NULL,
  organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_share_links_document ON document_share_links(document_id);
CREATE INDEX IF NOT EXISTS idx_document_share_links_org ON document_share_links(organization_id);
CREATE INDEX IF NOT EXISTS idx_document_share_links_token ON document_share_links(share_token);
CREATE INDEX IF NOT EXISTS idx_document_share_links_expires ON document_share_links(expires_at);

-- Verification
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'community_follows', 'community_moderation_actions', 'community_posts',
        'community_reactions', 'community_comments',
        'events', 'event_analytics', 'event_sessions', 'event_tickets', 'event_registrations',
        'document_ai_suggestions', 'document_versions', 'document_share_links'
    );

    IF table_count < 13 THEN
        RAISE EXCEPTION 'Table creation incomplete. Expected 13 tables, found %', table_count;
    END IF;

    RAISE NOTICE '✅ SUCCESS: Created % tables for Community, Events, and Document modules', table_count;
END $$;

COMMIT;

-- Final verification query (run after COMMIT to confirm)
SELECT
    'community_follows' AS table_name,
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_follows') AS exists
UNION ALL SELECT 'community_moderation_actions', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_moderation_actions')
UNION ALL SELECT 'community_posts', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts')
UNION ALL SELECT 'community_reactions', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_reactions')
UNION ALL SELECT 'community_comments', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_comments')
UNION ALL SELECT 'events', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events')
UNION ALL SELECT 'event_analytics', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_analytics')
UNION ALL SELECT 'event_sessions', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_sessions')
UNION ALL SELECT 'event_tickets', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_tickets')
UNION ALL SELECT 'event_registrations', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_registrations')
UNION ALL SELECT 'document_ai_suggestions', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'document_ai_suggestions')
UNION ALL SELECT 'document_versions', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'document_versions')
UNION ALL SELECT 'document_share_links', EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'document_share_links');
