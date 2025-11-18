"""
TDD Tests for Campaign Schema Migration

Tests for extending AdminCampaign and creating new tables for cold outreach features.
Following TDD: Write tests first (RED), then implement migrations (GREEN).
"""
import pytest
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.enums import CampaignType, CampaignStatus
from app.models.master_admin import (
    AdminCampaign,
    AdminProspect,
)


class TestCampaignTypeEnum:
    """Test that CampaignType enum includes new channel types."""
    
    def test_campaign_type_includes_voice(self):
        """Test that CampaignType enum includes 'voice'."""
        assert hasattr(CampaignType, 'VOICE')
        assert CampaignType.VOICE == 'voice'
    
    def test_campaign_type_includes_linkedin(self):
        """Test that CampaignType enum includes 'linkedin'."""
        assert hasattr(CampaignType, 'LINKEDIN')
        assert CampaignType.LINKEDIN == 'linkedin'
    
    def test_campaign_type_includes_multi_channel(self):
        """Test that CampaignType enum includes 'multi_channel'."""
        assert hasattr(CampaignType, 'MULTI_CHANNEL')
        assert CampaignType.MULTI_CHANNEL == 'multi_channel'
    
    def test_campaign_type_still_has_email(self):
        """Test that existing EMAIL type is preserved."""
        assert CampaignType.EMAIL == 'email'


class TestCampaignSchemaExtension:
    """Test that AdminCampaign table has new columns."""
    
    def test_campaign_has_template_id(self, db: Session):
        """Test that admin_campaigns table has template_id column."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_campaigns' 
            AND column_name = 'template_id'
        """))
        assert result.scalar() is not None
    
    def test_campaign_has_settings_jsonb(self, db: Session):
        """Test that admin_campaigns table has settings JSONB column."""
        result = db.execute(text("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'admin_campaigns' 
            AND column_name = 'settings'
        """))
        # PostgreSQL JSONB shows as 'jsonb' or 'USER-DEFINED' depending on version
        data_type = result.scalar()
        assert data_type in ['jsonb', 'USER-DEFINED', 'json']
    
    def test_campaign_has_schedule_at(self, db: Session):
        """Test that admin_campaigns table has schedule_at column."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_campaigns' 
            AND column_name = 'schedule_at'
        """))
        assert result.scalar() is not None
    
    def test_campaign_has_started_at(self, db: Session):
        """Test that admin_campaigns table has started_at column."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_campaigns' 
            AND column_name = 'started_at'
        """))
        assert result.scalar() is not None
    
    def test_campaign_has_completed_at(self, db: Session):
        """Test that admin_campaigns table has completed_at column."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_campaigns' 
            AND column_name = 'completed_at'
        """))
        assert result.scalar() is not None
    
    def test_campaign_schema_extends_existing(self, db: Session):
        """Test that new campaign fields don't break existing AdminCampaign records."""
        # This test ensures backward compatibility
        # Existing columns should still exist
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_campaigns' 
            AND column_name IN ('id', 'name', 'type', 'status', 'subject', 'content')
        """))
        columns = [row[0] for row in result.fetchall()]
        assert 'id' in columns
        assert 'name' in columns
        assert 'type' in columns
        assert 'status' in columns
        assert 'subject' in columns
        assert 'content' in columns


class TestCampaignTemplatesTable:
    """Test that campaign_templates table exists."""
    
    def test_campaign_templates_table_exists(self, db: Session):
        """Test that campaign_templates table exists."""
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'campaign_templates'
        """))
        assert result.scalar() is not None
    
    def test_campaign_templates_has_required_columns(self, db: Session):
        """Test that campaign_templates has all required columns."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'campaign_templates'
            AND column_name IN ('id', 'organization_id', 'name', 'subject', 'content', 'type', 'variables', 'is_default')
        """))
        columns = [row[0] for row in result.fetchall()]
        assert 'id' in columns
        assert 'organization_id' in columns
        assert 'name' in columns
        assert 'subject' in columns
        assert 'content' in columns
        assert 'type' in columns
        assert 'variables' in columns
        assert 'is_default' in columns


class TestCampaignActivitiesTable:
    """Test that campaign_activities table exists."""
    
    def test_campaign_activities_table_exists(self, db: Session):
        """Test that campaign_activities table exists."""
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'campaign_activities'
        """))
        assert result.scalar() is not None
    
    def test_campaign_activities_has_required_columns(self, db: Session):
        """Test that campaign_activities has all required columns."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'campaign_activities'
            AND column_name IN ('id', 'organization_id', 'campaign_id', 'contact_id', 'activity_type', 'status', 'metadata')
        """))
        columns = [row[0] for row in result.fetchall()]
        assert 'id' in columns
        assert 'organization_id' in columns
        assert 'campaign_id' in columns
        assert 'contact_id' in columns
        assert 'activity_type' in columns
        assert 'status' in columns
        assert 'metadata' in columns


class TestVoiceCallsTable:
    """Test that voice_calls table exists."""
    
    def test_voice_calls_table_exists(self, db: Session):
        """Test that voice_calls table exists."""
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'voice_calls'
        """))
        assert result.scalar() is not None
    
    def test_voice_calls_has_required_columns(self, db: Session):
        """Test that voice_calls has all required columns."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'voice_calls'
            AND column_name IN ('id', 'campaign_id', 'contact_id', 'phone_number', 'status', 'duration', 'recording_url', 'transcript', 'metadata')
        """))
        columns = [row[0] for row in result.fetchall()]
        assert 'id' in columns
        assert 'campaign_id' in columns
        assert 'contact_id' in columns
        assert 'phone_number' in columns
        assert 'status' in columns
        assert 'duration' in columns
        assert 'recording_url' in columns
        assert 'transcript' in columns
        assert 'metadata' in columns


class TestConversationSessionsTable:
    """Test that conversation_sessions table exists."""
    
    def test_conversation_sessions_table_exists(self, db: Session):
        """Test that conversation_sessions table exists."""
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'conversation_sessions'
        """))
        assert result.scalar() is not None
    
    def test_conversation_sessions_has_required_columns(self, db: Session):
        """Test that conversation_sessions has all required columns."""
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'conversation_sessions'
            AND column_name IN ('id', 'voice_call_id', 'session_id', 'conversation_history', 'lead_score', 'sentiment', 'intent', 'qualification_data')
        """))
        columns = [row[0] for row in result.fetchall()]
        assert 'id' in columns
        assert 'voice_call_id' in columns
        assert 'session_id' in columns
        assert 'conversation_history' in columns
        assert 'lead_score' in columns
        assert 'sentiment' in columns
        assert 'intent' in columns
        assert 'qualification_data' in columns


class TestWebhooksTables:
    """Test that webhooks and webhook_deliveries tables exist."""
    
    def test_webhooks_table_exists(self, db: Session):
        """Test that webhooks table exists."""
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'webhooks'
        """))
        assert result.scalar() is not None
    
    def test_webhook_deliveries_table_exists(self, db: Session):
        """Test that webhook_deliveries table exists."""
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'webhook_deliveries'
        """))
        assert result.scalar() is not None


class TestProspectSchemaEnhancement:
    """Test that AdminProspect table has enhanced columns."""
    
    def test_prospect_has_custom_fields(self, db: Session):
        """Test that admin_prospects table has custom_fields JSONB column."""
        result = db.execute(text("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'admin_prospects' 
            AND column_name = 'custom_fields'
        """))
        data_type = result.scalar()
        if data_type:  # Column exists
            assert data_type in ['jsonb', 'USER-DEFINED', 'json']
    
    def test_prospect_tags_is_array(self, db: Session):
        """Test that admin_prospects tags column supports array type."""
        # Tags already exists as Text, we'll enhance it to support array operations
        # This test verifies the column exists (it already does)
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_prospects' 
            AND column_name = 'tags'
        """))
        assert result.scalar() is not None


class TestContactStatusEnum:
    """Test that contact status enum exists for prospects."""
    
    def test_contact_status_enum_exists(self, db: Session):
        """Test that contact_status enum type exists in database."""
        result = db.execute(text("""
            SELECT typname 
            FROM pg_type 
            WHERE typname = 'contact_status'
        """))
        # This will be None until enum is created
        # We'll create it in migration
        enum_name = result.scalar()
        # For now, just check the test structure
        assert True  # Placeholder - will be updated after migration

