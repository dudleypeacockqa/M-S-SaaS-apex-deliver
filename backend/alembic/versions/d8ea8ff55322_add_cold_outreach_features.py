"""add cold outreach features

Revision ID: d8ea8ff55322
Revises: 20251118104453
Create Date: 2025-11-18 12:00:00.000000

Adds cold outreach hub features:
- Extends admin_campaigns with template_id, settings, schedule_at, started_at, completed_at
- Creates campaign_templates table
- Creates campaign_activities table
- Creates voice_calls table
- Creates conversation_sessions table
- Creates webhooks and webhook_deliveries tables
- Enhances admin_prospects with custom_fields and contact_status enum
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd8ea8ff55322'
down_revision: Union[str, None] = '20251118104453'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create contact_status enum
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE contact_status AS ENUM ('active', 'unsubscribed', 'bounced', 'invalid');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    # Create activity_status enum for campaign activities
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE activity_status AS ENUM ('pending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    # Create voice_call_status enum
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE voice_call_status AS ENUM ('queued', 'calling', 'in_progress', 'completed', 'failed', 'cancelled');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)
    
    # Extend admin_campaigns table
    # Add template_id (nullable, will be set later)
    op.add_column('admin_campaigns', sa.Column('template_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_admin_campaigns_template_id',
        'admin_campaigns', 'campaign_templates',
        ['template_id'], ['id'],
        ondelete='SET NULL'
    )
    
    # Add settings JSONB column
    op.add_column('admin_campaigns', sa.Column('settings', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='{}'))
    
    # Add schedule_at, started_at, completed_at timestamps
    op.add_column('admin_campaigns', sa.Column('schedule_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('admin_campaigns', sa.Column('started_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('admin_campaigns', sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True))
    
    # Create campaign_templates table
    op.create_table(
        'campaign_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('subject', sa.String(length=500), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),  # email, voice, linkedin, multi_channel
        sa.Column('variables', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='[]'),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_by', sa.String(length=36), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_campaign_templates_organization_id', 'campaign_templates', ['organization_id'])
    op.create_index('idx_campaign_templates_type', 'campaign_templates', ['type'])
    op.create_index('idx_campaign_templates_is_default', 'campaign_templates', ['is_default'])
    
    # Now add the foreign key constraint for admin_campaigns.template_id
    # (We need to drop and recreate it since the table didn't exist when we first added the column)
    op.drop_constraint('fk_admin_campaigns_template_id', 'admin_campaigns', type_='foreignkey')
    op.create_foreign_key(
        'fk_admin_campaigns_template_id',
        'admin_campaigns', 'campaign_templates',
        ['template_id'], ['id'],
        ondelete='SET NULL'
    )
    
    # Create campaign_activities table
    op.create_table(
        'campaign_activities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('campaign_id', sa.Integer(), nullable=False),
        sa.Column('contact_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=True),
        sa.Column('activity_type', sa.String(length=100), nullable=False),  # email_sent, email_opened, email_clicked, etc.
        sa.Column('status', sa.Enum('pending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed', name='activity_status'), nullable=False),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='{}'),
        sa.Column('ip_address', postgresql.INET(), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['campaign_id'], ['admin_campaigns.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['contact_id'], ['admin_prospects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_campaign_activities_organization_id', 'campaign_activities', ['organization_id'])
    op.create_index('idx_campaign_activities_campaign_id', 'campaign_activities', ['campaign_id'])
    op.create_index('idx_campaign_activities_contact_id', 'campaign_activities', ['contact_id'])
    op.create_index('idx_campaign_activities_activity_type', 'campaign_activities', ['activity_type'])
    op.create_index('idx_campaign_activities_created_at', 'campaign_activities', ['created_at'])
    
    # Create voice_calls table
    op.create_table(
        'voice_calls',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('campaign_id', sa.Integer(), nullable=True),
        sa.Column('contact_id', sa.Integer(), nullable=False),
        sa.Column('phone_number', sa.String(length=50), nullable=False),
        sa.Column('status', sa.Enum('queued', 'calling', 'in_progress', 'completed', 'failed', 'cancelled', name='voice_call_status'), nullable=False),
        sa.Column('duration', sa.Integer(), nullable=True),  # Duration in seconds
        sa.Column('recording_url', sa.Text(), nullable=True),
        sa.Column('transcript', sa.Text(), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='{}'),
        sa.Column('synthflow_call_id', sa.String(length=255), nullable=True),
        sa.Column('synthflow_agent_id', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['campaign_id'], ['admin_campaigns.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['contact_id'], ['admin_prospects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_voice_calls_organization_id', 'voice_calls', ['organization_id'])
    op.create_index('idx_voice_calls_campaign_id', 'voice_calls', ['campaign_id'])
    op.create_index('idx_voice_calls_contact_id', 'voice_calls', ['contact_id'])
    op.create_index('idx_voice_calls_status', 'voice_calls', ['status'])
    op.create_index('idx_voice_calls_synthflow_call_id', 'voice_calls', ['synthflow_call_id'])
    
    # Create conversation_sessions table
    op.create_table(
        'conversation_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('voice_call_id', sa.Integer(), nullable=True),
        sa.Column('session_id', sa.String(length=255), nullable=False, unique=True),
        sa.Column('conversation_history', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='[]'),
        sa.Column('lead_score', sa.Integer(), nullable=True),  # 0-100
        sa.Column('sentiment', sa.String(length=50), nullable=True),  # positive, neutral, negative
        sa.Column('intent', sa.String(length=100), nullable=True),
        sa.Column('qualification_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='{}'),  # BANT data
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['voice_call_id'], ['voice_calls.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_conversation_sessions_organization_id', 'conversation_sessions', ['organization_id'])
    op.create_index('idx_conversation_sessions_voice_call_id', 'conversation_sessions', ['voice_call_id'])
    op.create_index('idx_conversation_sessions_session_id', 'conversation_sessions', ['session_id'])
    
    # Create webhooks table
    op.create_table(
        'webhooks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('events', postgresql.ARRAY(sa.String()), nullable=False),
        sa.Column('secret_key', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('headers', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='{}'),
        sa.Column('created_by', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_webhooks_organization_id', 'webhooks', ['organization_id'])
    op.create_index('idx_webhooks_is_active', 'webhooks', ['is_active'])
    
    # Create webhook_deliveries table
    op.create_table(
        'webhook_deliveries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('webhook_id', sa.Integer(), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('payload', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('response_status', sa.Integer(), nullable=True),
        sa.Column('response_body', sa.Text(), nullable=True),
        sa.Column('response_headers', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('next_retry_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['webhook_id'], ['webhooks.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_webhook_deliveries_webhook_id', 'webhook_deliveries', ['webhook_id'])
    op.create_index('idx_webhook_deliveries_organization_id', 'webhook_deliveries', ['organization_id'])
    op.create_index('idx_webhook_deliveries_event_type', 'webhook_deliveries', ['event_type'])
    op.create_index('idx_webhook_deliveries_created_at', 'webhook_deliveries', ['created_at'])
    
    # Enhance admin_prospects table
    # Add custom_fields JSONB column
    op.add_column('admin_prospects', sa.Column('custom_fields', postgresql.JSONB(astext_type=sa.Text()), nullable=True, server_default='{}'))
    
    # Note: tags already exists as Text, we'll keep it for now
    # In a future migration, we could convert it to TEXT[] array if needed
    
    # Add updated_at trigger for new tables
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    """)
    
    # Apply updated_at triggers
    op.execute("""
        DROP TRIGGER IF EXISTS update_campaign_templates_updated_at ON campaign_templates;
        CREATE TRIGGER update_campaign_templates_updated_at 
        BEFORE UPDATE ON campaign_templates 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    """)
    
    op.execute("""
        DROP TRIGGER IF EXISTS update_voice_calls_updated_at ON voice_calls;
        CREATE TRIGGER update_voice_calls_updated_at 
        BEFORE UPDATE ON voice_calls 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    """)
    
    op.execute("""
        DROP TRIGGER IF EXISTS update_conversation_sessions_updated_at ON conversation_sessions;
        CREATE TRIGGER update_conversation_sessions_updated_at 
        BEFORE UPDATE ON conversation_sessions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    """)
    
    op.execute("""
        DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;
        CREATE TRIGGER update_webhooks_updated_at 
        BEFORE UPDATE ON webhooks 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade() -> None:
    # Drop triggers
    op.execute("DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;")
    op.execute("DROP TRIGGER IF EXISTS update_conversation_sessions_updated_at ON conversation_sessions;")
    op.execute("DROP TRIGGER IF EXISTS update_voice_calls_updated_at ON voice_calls;")
    op.execute("DROP TRIGGER IF EXISTS update_campaign_templates_updated_at ON campaign_templates;")
    
    # Drop tables in reverse order
    op.drop_table('webhook_deliveries')
    op.drop_table('webhooks')
    op.drop_table('conversation_sessions')
    op.drop_table('voice_calls')
    op.drop_table('campaign_activities')
    op.drop_table('campaign_templates')
    
    # Remove columns from admin_prospects
    op.drop_column('admin_prospects', 'custom_fields')
    
    # Remove columns from admin_campaigns
    op.drop_constraint('fk_admin_campaigns_template_id', 'admin_campaigns', type_='foreignkey')
    op.drop_column('admin_campaigns', 'completed_at')
    op.drop_column('admin_campaigns', 'started_at')
    op.drop_column('admin_campaigns', 'schedule_at')
    op.drop_column('admin_campaigns', 'settings')
    op.drop_column('admin_campaigns', 'template_id')
    
    # Drop enums
    op.execute("DROP TYPE IF EXISTS voice_call_status;")
    op.execute("DROP TYPE IF EXISTS activity_status;")
    op.execute("DROP TYPE IF EXISTS contact_status;")

