"""create community events and document ai tables

Revision ID: b5f9ec169e5d
Revises: 26ee56d66b6e
Create Date: 2025-11-16 07:12:01.862658

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b5f9ec169e5d'
down_revision: Union[str, None] = '26ee56d66b6e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create community, events, and document AI tables."""
    op.execute("""
        -- Community tables
        CREATE TABLE IF NOT EXISTS community_follows (
          id VARCHAR(36) PRIMARY KEY,
          follower_user_id VARCHAR(36) NOT NULL,
          following_user_id VARCHAR(36) NOT NULL,
          organization_id VARCHAR(36) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS community_moderation_actions (
          id VARCHAR(36) PRIMARY KEY,
          target_type targettype NOT NULL,
          target_id VARCHAR(36) NOT NULL,
          action_type moderationactiontype NOT NULL,
          moderator_user_id VARCHAR(36) NOT NULL,
          reason TEXT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS community_posts (
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
        );

        CREATE TABLE IF NOT EXISTS community_reactions (
          id VARCHAR(36) PRIMARY KEY,
          target_type targettype NOT NULL,
          target_id VARCHAR(36) NOT NULL,
          user_id VARCHAR(36) NOT NULL,
          reaction_type reactiontype NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS community_comments (
          id VARCHAR(36) PRIMARY KEY,
          post_id VARCHAR(36) NOT NULL,
          author_user_id VARCHAR(36) NOT NULL,
          content TEXT NOT NULL,
          parent_comment_id VARCHAR(36) NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );

        -- Events tables
        CREATE TABLE IF NOT EXISTS events (
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
        );

        CREATE TABLE IF NOT EXISTS event_analytics (
          id VARCHAR(36) PRIMARY KEY,
          event_id VARCHAR(36) NOT NULL,
          total_registrations INTEGER NULL,
          total_attendees INTEGER NULL,
          total_revenue NUMERIC(10,2) NULL,
          currency VARCHAR(3) NULL,
          session_metrics JSON NULL,
          recorded_at TIMESTAMPTZ NULL,
          organization_id VARCHAR(36) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS event_sessions (
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
        );

        CREATE TABLE IF NOT EXISTS event_tickets (
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
        );

        CREATE TABLE IF NOT EXISTS event_registrations (
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
        );

        -- Document AI / Versions / Share Links
        CREATE TABLE IF NOT EXISTS document_ai_suggestions (
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
        );

        CREATE TABLE IF NOT EXISTS document_versions (
          id VARCHAR(36) PRIMARY KEY,
          document_id VARCHAR(36) NOT NULL,
          version_number INTEGER NOT NULL,
          content TEXT NOT NULL,
          label VARCHAR NULL,
          summary TEXT NULL,
          organization_id VARCHAR(36) NOT NULL,
          created_by_user_id VARCHAR(36) NOT NULL,
          created_at TIMESTAMPTZ NULL
        );

        CREATE TABLE IF NOT EXISTS document_share_links (
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
        );
    """)


def downgrade() -> None:
    """Drop community, events, and document AI tables."""
    op.execute("""
        DROP TABLE IF EXISTS document_share_links CASCADE;
        DROP TABLE IF EXISTS document_versions CASCADE;
        DROP TABLE IF EXISTS document_ai_suggestions CASCADE;
        DROP TABLE IF EXISTS event_registrations CASCADE;
        DROP TABLE IF EXISTS event_tickets CASCADE;
        DROP TABLE IF EXISTS event_sessions CASCADE;
        DROP TABLE IF EXISTS event_analytics CASCADE;
        DROP TABLE IF EXISTS events CASCADE;
        DROP TABLE IF EXISTS community_comments CASCADE;
        DROP TABLE IF EXISTS community_reactions CASCADE;
        DROP TABLE IF EXISTS community_posts CASCADE;
        DROP TABLE IF EXISTS community_moderation_actions CASCADE;
        DROP TABLE IF EXISTS community_follows CASCADE;
    """)
