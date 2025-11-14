-- ============================================================================
-- RENDER DATABASE SETUP - Missing Tables for Production
-- ============================================================================
-- Purpose: Create all module-specific tables that don't exist in production
-- This prevents migration failures when optional modules aren't deployed
--
-- Usage:
--   1. Open Render Dashboard → PostgreSQL database → Shell tab
--   2. Copy/paste this entire script
--   3. Run and verify no errors
--
-- Tables Created:
--   - Pipeline Management Module (2 tables)
--   - Master Admin Module (16 tables)
--   - Valuation Export Module (1 table)
--   - Deal Matching Module (1 table)
--   - Document Generation Module (3 tables)
--   - Blog/Content Module (1 table)
--   - Community Module (5 tables)
--   - Event Management Module (5 tables)
-- ============================================================================

-- Start transaction for safety
BEGIN;

-- ============================================================================
-- PIPELINE MANAGEMENT MODULE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pipeline_templates (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by_user_id VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS ix_pipeline_templates_organization_id ON pipeline_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_templates_org_default ON pipeline_templates(organization_id, is_default);

CREATE TABLE IF NOT EXISTS pipeline_template_stages (
    id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL REFERENCES pipeline_templates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_pipeline_template_stages_template_id ON pipeline_template_stages(template_id);
CREATE INDEX IF NOT EXISTS ix_pipeline_template_stages_order ON pipeline_template_stages(order_index);

-- ============================================================================
-- MASTER ADMIN MODULE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_activities (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    amount INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_activities_id ON admin_activities(id);

CREATE TABLE IF NOT EXISTS admin_campaign_recipients (
    id VARCHAR(36) PRIMARY KEY,
    campaign_id VARCHAR(36) NOT NULL,
    prospect_id VARCHAR(36),
    email VARCHAR(255) NOT NULL,
    sent BOOLEAN DEFAULT false,
    opened BOOLEAN DEFAULT false,
    clicked BOOLEAN DEFAULT false,
    bounced BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_admin_campaign_recipients_id ON admin_campaign_recipients(id);

CREATE TYPE campaignstatus AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled');

CREATE TABLE IF NOT EXISTS admin_campaigns (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT,
    status campaignstatus DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_campaigns_id ON admin_campaigns(id);

CREATE TABLE IF NOT EXISTS admin_collateral (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    file_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_collateral_id ON admin_collateral(id);

CREATE TABLE IF NOT EXISTS admin_collateral_usage (
    id VARCHAR(36) PRIMARY KEY,
    collateral_id VARCHAR(36) NOT NULL,
    prospect_id VARCHAR(36),
    used_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_collateral_usage_id ON admin_collateral_usage(id);

CREATE TABLE IF NOT EXISTS admin_content_pieces (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    content TEXT,
    status VARCHAR(50),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_content_pieces_id ON admin_content_pieces(id);

CREATE TABLE IF NOT EXISTS admin_content_scripts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    script_text TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_content_scripts_id ON admin_content_scripts(id);

CREATE TABLE IF NOT EXISTS admin_deals (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    prospect_id VARCHAR(36),
    deal_name VARCHAR(255),
    value NUMERIC,
    stage VARCHAR(100),
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_deals_id ON admin_deals(id);

CREATE TABLE IF NOT EXISTS admin_focus_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER,
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_focus_sessions_id ON admin_focus_sessions(id);

CREATE TABLE IF NOT EXISTS admin_goals (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    goal_type VARCHAR(100) NOT NULL,
    target_value NUMERIC,
    current_value NUMERIC DEFAULT 0,
    deadline DATE,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_goals_id ON admin_goals(id);

CREATE TABLE IF NOT EXISTS admin_lead_captures (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    source VARCHAR(255),
    email VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_lead_captures_id ON admin_lead_captures(id);

CREATE TABLE IF NOT EXISTS admin_meetings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    prospect_id VARCHAR(36),
    title VARCHAR(255),
    scheduled_at TIMESTAMP,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_meetings_id ON admin_meetings(id);

CREATE TABLE IF NOT EXISTS admin_nudges (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nudge_type VARCHAR(100) NOT NULL,
    message TEXT,
    shown_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_nudges_id ON admin_nudges(id);

CREATE TABLE IF NOT EXISTS admin_prospects (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    status VARCHAR(100),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_prospects_id ON admin_prospects(id);

CREATE TABLE IF NOT EXISTS admin_scores (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    score_type VARCHAR(100) NOT NULL,
    score_value NUMERIC,
    calculated_at TIMESTAMP DEFAULT now(),
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_admin_scores_id ON admin_scores(id);

CREATE TABLE IF NOT EXISTS rbac_audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_user_id VARCHAR(36),
    target_user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_rbac_audit_logs_organization_id ON rbac_audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS ix_rbac_audit_logs_action ON rbac_audit_logs(action);
CREATE INDEX IF NOT EXISTS ix_rbac_audit_logs_actor ON rbac_audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS ix_rbac_audit_logs_target ON rbac_audit_logs(target_user_id);

-- ============================================================================
-- VALUATION EXPORT MODULE
-- ============================================================================

CREATE TYPE exportstatus AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS valuation_export_logs (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL UNIQUE,
    valuation_id VARCHAR(36) NOT NULL,
    document_id VARCHAR(36),
    export_format VARCHAR(50) NOT NULL,
    status exportstatus NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_valuation_export_logs_task_id_unique ON valuation_export_logs(task_id);

-- ============================================================================
-- DEAL MATCHING MODULE
-- ============================================================================

CREATE TABLE IF NOT EXISTS deal_matches (
    id VARCHAR(36) PRIMARY KEY,
    sell_side_deal_id VARCHAR(36) NOT NULL,
    buy_side_deal_id VARCHAR(36) NOT NULL,
    match_score NUMERIC(5,2),
    match_reasons JSONB,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_deal_matches_organization_id ON deal_matches(organization_id);

-- ============================================================================
-- DOCUMENT GENERATION MODULE
-- ============================================================================

CREATE TYPE templatestatus AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

CREATE TABLE IF NOT EXISTS document_templates (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template_type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    variables JSON,
    status templatestatus NOT NULL DEFAULT 'DRAFT',
    version INTEGER DEFAULT 1,
    created_by_user_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_document_templates_organization_id ON document_templates(organization_id);
CREATE INDEX IF NOT EXISTS ix_document_templates_template_type ON document_templates(template_type);
CREATE INDEX IF NOT EXISTS ix_document_templates_status ON document_templates(status);

CREATE TYPE documentstatus AS ENUM ('draft', 'generated', 'finalized', 'sent');

CREATE TABLE IF NOT EXISTS generated_documents (
    id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    generated_by_user_id VARCHAR(36),
    document_name VARCHAR(255),
    variable_values JSON,
    generated_content TEXT,
    status documentstatus NOT NULL DEFAULT 'draft',
    file_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_generated_documents_organization_id ON generated_documents(organization_id);
CREATE INDEX IF NOT EXISTS ix_generated_documents_template_id ON generated_documents(template_id);
CREATE INDEX IF NOT EXISTS ix_generated_documents_status ON generated_documents(status);

CREATE TABLE IF NOT EXISTS document_questions (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT,
    asked_by_user_id VARCHAR(36),
    answered_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- BLOG/CONTENT MODULE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    author VARCHAR(255),
    featured_image_url VARCHAR(500),
    published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    read_time_minutes INTEGER,
    tags VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS ix_blog_posts_published ON blog_posts(published);

-- ============================================================================
-- COMMUNITY MODULE
-- ============================================================================

CREATE TABLE IF NOT EXISTS community_follows (
    id VARCHAR(36) PRIMARY KEY,
    follower_user_id VARCHAR(36) NOT NULL,
    following_user_id VARCHAR(36) NOT NULL,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_user_id, following_user_id)
);

CREATE INDEX IF NOT EXISTS ix_community_follows_follower_user_id ON community_follows(follower_user_id);
CREATE INDEX IF NOT EXISTS ix_community_follows_following_user_id ON community_follows(following_user_id);
CREATE INDEX IF NOT EXISTS ix_community_follows_organization_id ON community_follows(organization_id);

CREATE TABLE IF NOT EXISTS community_moderation_actions (
    id VARCHAR(36) PRIMARY KEY,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    reason TEXT,
    moderator_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_community_moderation_actions_moderator_user_id ON community_moderation_actions(moderator_user_id);
CREATE INDEX IF NOT EXISTS ix_community_moderation_actions_target_id ON community_moderation_actions(target_id);

CREATE TABLE IF NOT EXISTS community_posts (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    author_user_id VARCHAR(36) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_community_posts_organization_id ON community_posts(organization_id);
CREATE INDEX IF NOT EXISTS ix_community_posts_author_user_id ON community_posts(author_user_id);

CREATE TABLE IF NOT EXISTS community_reactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(36) NOT NULL,
    reaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS ix_community_reactions_user_id ON community_reactions(user_id);
CREATE INDEX IF NOT EXISTS ix_community_reactions_target_id ON community_reactions(target_id);

CREATE TABLE IF NOT EXISTS community_comments (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_user_id VARCHAR(36) NOT NULL,
    parent_comment_id VARCHAR(36),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS ix_community_comments_author_user_id ON community_comments(author_user_id);
CREATE INDEX IF NOT EXISTS ix_community_comments_parent_comment_id ON community_comments(parent_comment_id);

-- ============================================================================
-- EVENT MANAGEMENT MODULE
-- ============================================================================

CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY,
    organization_id VARCHAR(36) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(500),
    capacity INTEGER,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_events_organization_id ON events(organization_id);

CREATE TABLE IF NOT EXISTS event_analytics (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_sessions (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    speaker VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    room VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS event_tickets (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ticket_type VARCHAR(100) NOT NULL,
    price NUMERIC(10,2),
    quantity_available INTEGER,
    quantity_sold INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS event_registrations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL,
    ticket_id VARCHAR(36),
    registration_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_status VARCHAR(50),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COMMIT TRANSACTION
-- ============================================================================

-- Verify all tables were created successfully
DO $$
DECLARE
    missing_tables TEXT[];
BEGIN
    SELECT array_agg(table_name)
    INTO missing_tables
    FROM unnest(ARRAY[
        'pipeline_templates', 'pipeline_template_stages',
        'admin_activities', 'admin_campaign_recipients', 'admin_campaigns',
        'admin_collateral', 'admin_collateral_usage', 'admin_content_pieces',
        'admin_content_scripts', 'admin_deals', 'admin_focus_sessions',
        'admin_goals', 'admin_lead_captures', 'admin_meetings', 'admin_nudges',
        'admin_prospects', 'admin_scores', 'rbac_audit_logs',
        'valuation_export_logs', 'deal_matches',
        'document_templates', 'generated_documents', 'document_questions',
        'blog_posts',
        'community_follows', 'community_moderation_actions', 'community_posts',
        'community_reactions', 'community_comments',
        'events', 'event_analytics', 'event_sessions', 'event_tickets',
        'event_registrations'
    ]::TEXT[]) AS table_name
    WHERE NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = table_name
    );

    IF missing_tables IS NOT NULL THEN
        RAISE EXCEPTION 'Failed to create tables: %', array_to_string(missing_tables, ', ');
    END IF;

    RAISE NOTICE '✅ Successfully created all % missing tables!',
        array_length(ARRAY[
            'pipeline_templates', 'pipeline_template_stages',
            'admin_activities', 'admin_campaign_recipients', 'admin_campaigns',
            'admin_collateral', 'admin_collateral_usage', 'admin_content_pieces',
            'admin_content_scripts', 'admin_deals', 'admin_focus_sessions',
            'admin_goals', 'admin_lead_captures', 'admin_meetings', 'admin_nudges',
            'admin_prospects', 'admin_scores', 'rbac_audit_logs',
            'valuation_export_logs', 'deal_matches',
            'document_templates', 'generated_documents', 'document_questions',
            'blog_posts',
            'community_follows', 'community_moderation_actions', 'community_posts',
            'community_reactions', 'community_comments',
            'events', 'event_analytics', 'event_sessions', 'event_tickets',
            'event_registrations'
        ]::TEXT[], 1);
END $$;

COMMIT;

-- Display summary
SELECT
    'Tables Created' as summary,
    COUNT(*) as total
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'pipeline_templates', 'pipeline_template_stages',
    'admin_activities', 'admin_campaign_recipients', 'admin_campaigns',
    'admin_collateral', 'admin_collateral_usage', 'admin_content_pieces',
    'admin_content_scripts', 'admin_deals', 'admin_focus_sessions',
    'admin_goals', 'admin_lead_captures', 'admin_meetings', 'admin_nudges',
    'admin_prospects', 'admin_scores', 'rbac_audit_logs',
    'valuation_export_logs', 'deal_matches',
    'document_templates', 'generated_documents', 'document_questions',
    'blog_posts',
    'community_follows', 'community_moderation_actions', 'community_posts',
    'community_reactions', 'community_comments',
    'events', 'event_analytics', 'event_sessions', 'event_tickets',
    'event_registrations'
);
