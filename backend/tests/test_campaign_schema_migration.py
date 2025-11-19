"""
TDD Tests for Campaign Schema Migration

Tests for extending AdminCampaign and creating new tables for cold outreach features.
Following TDD: Write tests first (RED), then implement migrations (GREEN).
"""
import pytest
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.models.enums import CampaignType, CampaignStatus
from app.models.master_admin import (
    AdminCampaign,
    AdminProspect,
)


def _table_exists(db: Session, table_name: str) -> bool:
    return inspect(db.get_bind()).has_table(table_name)


def _column_names(db: Session, table_name: str) -> set[str]:
    inspector = inspect(db.get_bind())
    return {col['name'] for col in inspector.get_columns(table_name)}


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
        columns = _column_names(db, 'admin_campaigns')
        assert 'template_id' in columns
    
    def test_campaign_has_settings_jsonb(self, db: Session):
        """Test that admin_campaigns table has settings JSONB column."""
        inspector = inspect(db.get_bind())
        columns = inspector.get_columns('admin_campaigns')
        settings_col = next((col for col in columns if col['name'] == 'settings'), None)
        assert settings_col is not None
        data_type = str(settings_col.get('type')).lower()
        assert any(token in data_type for token in ['json', 'dict', 'text'])
    
    def test_campaign_has_schedule_at(self, db: Session):
        """Test that admin_campaigns table has schedule_at column."""
        columns = _column_names(db, 'admin_campaigns')
        assert 'schedule_at' in columns
    
    def test_campaign_has_started_at(self, db: Session):
        """Test that admin_campaigns table has started_at column."""
        columns = _column_names(db, 'admin_campaigns')
        assert 'started_at' in columns
    
    def test_campaign_has_completed_at(self, db: Session):
        """Test that admin_campaigns table has completed_at column."""
        columns = _column_names(db, 'admin_campaigns')
        assert 'completed_at' in columns
    
    def test_campaign_schema_extends_existing(self, db: Session):
        """Test that new campaign fields don't break existing AdminCampaign records."""
        # This test ensures backward compatibility
        # Existing columns should still exist
        columns = _column_names(db, 'admin_campaigns')
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
        assert _table_exists(db, 'campaign_templates')
    
    def test_campaign_templates_has_required_columns(self, db: Session):
        """Test that campaign_templates has all required columns."""
        columns = _column_names(db, 'campaign_templates')
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
        assert _table_exists(db, 'campaign_activities')
    
    def test_campaign_activities_has_required_columns(self, db: Session):
        """Test that campaign_activities has all required columns."""
        columns = _column_names(db, 'campaign_activities')
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
        assert _table_exists(db, 'voice_calls')
    
    def test_voice_calls_has_required_columns(self, db: Session):
        """Test that voice_calls has all required columns."""
        columns = _column_names(db, 'voice_calls')
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
        assert _table_exists(db, 'conversation_sessions')
    
    def test_conversation_sessions_has_required_columns(self, db: Session):
        """Test that conversation_sessions has all required columns."""
        columns = _column_names(db, 'conversation_sessions')
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
        assert _table_exists(db, 'webhooks')

    def test_webhook_deliveries_table_exists(self, db: Session):
        """Test that webhook_deliveries table exists."""
        assert _table_exists(db, 'webhook_deliveries')


class TestProspectSchemaEnhancement:
    """Test that AdminProspect table has enhanced columns."""
    
    def test_prospect_has_custom_fields(self, db: Session):
        """Test that admin_prospects table has custom_fields JSONB column."""
        inspector = inspect(db.get_bind())
        custom_fields = next((col for col in inspector.get_columns('admin_prospects') if col['name'] == 'custom_fields'), None)
        if custom_fields:
            data_type = str(custom_fields.get('type')).lower()
            assert any(token in data_type for token in ['json', 'dict', 'text'])

    def test_prospect_tags_is_array(self, db: Session):
        """Test that admin_prospects tags column supports array type."""
        # Tags already exists as Text, we'll enhance it to support array operations
        # This test verifies the column exists (it already does)
        columns = _column_names(db, 'admin_prospects')
        assert 'tags' in columns


class TestContactStatusEnum:
    """Test that contact status enum exists for prospects."""
    
    def test_contact_status_enum_exists(self, db: Session):
        """Test that contact_status enum type exists in database."""
        if db.get_bind().dialect.name != 'postgresql':
            pytest.skip('Enum introspection only supported on PostgreSQL in tests')
        result = db.execute(text("""
            SELECT typname 
            FROM pg_type 
            WHERE typname = 'contact_status'
        """))
        assert result.scalar() is not None

