"""
Master Admin Portal Models

SQLAlchemy models for the Master Admin Portal subsystems:
- Activity Tracker (goals, activities, scores, focus sessions, nudges, meetings)
- Prospect Management (prospects, deals, activities)
- Campaign Management (campaigns, recipients)
- Content Creation (content pieces, scripts)
- Lead Capture (lead captures)
- Sales Collateral (collateral, usage tracking)

All models follow the repository's established patterns and conventions.
"""
from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime, Boolean, Numeric,
    ForeignKey, CheckConstraint, UniqueConstraint, Index, Enum, func
)
from sqlalchemy.dialects.postgresql import JSONB, ARRAY, INET
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.enums import (
    ActivityType, ActivityStatus, NudgeType, NudgePriority, MeetingType,
    ProspectStatus, AdminDealStage, CampaignType, CampaignStatus,
    ContentType, ContentStatus
)


# ============================================================================
# Activity Tracker Models
# ============================================================================

class AdminGoal(Base):
    """Weekly goals for activity tracking."""
    __tablename__ = "admin_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    week_start = Column(Date, nullable=False)
    target_discoveries = Column(Integer, default=0)
    target_emails = Column(Integer, default=0)
    target_videos = Column(Integer, default=0)
    target_calls = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_goals")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "week_start", name="uq_admin_goals_user_week"),
        Index("idx_admin_goals_user_week", "user_id", "week_start"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminGoal(id={self.id}, user_id={self.user_id}, week={self.week_start})>"


class AdminActivity(Base):
    """Daily activity logging."""
    __tablename__ = "admin_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(ActivityType), nullable=False)
    status = Column(Enum(ActivityStatus), nullable=False)
    date = Column(Date, nullable=False)
    amount = Column(Integer, default=1)
    notes = Column(Text)
    prospect_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_activities")
    prospect = relationship("AdminProspect", back_populates="activities")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_activities_user_date", "user_id", "date"),
        Index("idx_admin_activities_prospect", "prospect_id"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminActivity(id={self.id}, type={self.type.value}, date={self.date})>"


class AdminScore(Base):
    """Daily scoring and streaks."""
    __tablename__ = "admin_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    score = Column(Integer, nullable=False)
    streak_days = Column(Integer, default=0)
    activities_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_scores")
    
    # Constraints
    __table_args__ = (
        CheckConstraint("score >= 0 AND score <= 100", name="ck_admin_scores_range"),
        UniqueConstraint("user_id", "date", name="uq_admin_scores_user_date"),
        Index("idx_admin_scores_user_date", "user_id", "date"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminScore(id={self.id}, date={self.date}, score={self.score})>"


class AdminFocusSession(Base):
    """50-minute focus sessions with interruption tracking."""
    __tablename__ = "admin_focus_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    duration_minutes = Column(Integer, default=50)
    completed = Column(Boolean, default=False)
    interrupted = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_focus_sessions")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_focus_sessions_user_start", "user_id", "start_time"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminFocusSession(id={self.id}, start={self.start_time}, completed={self.completed})>"


class AdminNudge(Base):
    """System nudges and reminders."""
    __tablename__ = "admin_nudges"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(NudgeType), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(Enum(NudgePriority), default=NudgePriority.NORMAL)
    read = Column(Boolean, default=False)
    action_url = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="admin_nudges")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_nudges_user_read", "user_id", "read", "created_at"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminNudge(id={self.id}, type={self.type.value}, read={self.read})>"


class AdminMeeting(Base):
    """Meeting templates and outcomes."""
    __tablename__ = "admin_meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(Enum(MeetingType), nullable=False)
    duration_minutes = Column(Integer, default=60)
    agenda = Column(Text)
    questions = Column(Text)
    follow_up_tasks = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_meetings")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_meetings_user_type", "user_id", "type"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminMeeting(id={self.id}, title='{self.title}', type={self.type.value})>"


# ============================================================================
# Prospect & Pipeline Models
# ============================================================================

class AdminProspect(Base):
    """Prospect/lead database."""
    __tablename__ = "admin_prospects"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(320))
    phone = Column(String(50))
    company = Column(String(255))
    title = Column(String(255))
    status = Column(Enum(ProspectStatus), default=ProspectStatus.NEW)
    source = Column(String(100))  # networking, referral, inbound, etc.
    tags = Column(Text)  # JSON array of tags
    custom_fields = Column(JSONB, nullable=True, server_default='{}')  # Custom fields for contact enrichment
    notes = Column(Text)
    voice_notes_url = Column(Text)  # S3 URL for voice notes
    ghl_contact_id = Column(String(100))  # GoHighLevel contact ID
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    last_contacted = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="admin_prospects")
    activities = relationship("AdminActivity", back_populates="prospect", cascade="all, delete-orphan")
    deals = relationship("AdminDeal", back_populates="prospect", cascade="all, delete-orphan")
    campaign_activities = relationship("CampaignActivity", back_populates="contact", cascade="all, delete-orphan")
    voice_calls = relationship("VoiceCall", back_populates="contact", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_prospects_user_status", "user_id", "status"),
        Index("idx_admin_prospects_email", "email"),
        Index("idx_admin_prospects_ghl", "ghl_contact_id"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminProspect(id={self.id}, name='{self.name}', status={self.status.value})>"


class AdminDeal(Base):
    """Deal pipeline tracking."""
    __tablename__ = "admin_deals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    prospect_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    stage = Column(Enum(AdminDealStage), default=AdminDealStage.DISCOVERY)
    value = Column(Numeric(12, 2))  # Deal value in currency
    probability = Column(Integer, default=0)  # 0-100%
    expected_close_date = Column(Date)
    actual_close_date = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_deals")
    prospect = relationship("AdminProspect", back_populates="deals")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_deals_user_stage", "user_id", "stage"),
        Index("idx_admin_deals_prospect", "prospect_id"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminDeal(id={self.id}, title='{self.title}', stage={self.stage.value})>"


# ============================================================================
# Campaign Management Models
# ============================================================================

class AdminCampaign(Base):
    """Email/SMS/Voice/LinkedIn campaign management."""
    __tablename__ = "admin_campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(Enum(CampaignType), nullable=False)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    subject = Column(String(500))  # Email subject or SMS preview
    content = Column(Text, nullable=False)
    template_id = Column(Integer, ForeignKey("campaign_templates.id", ondelete="SET NULL"), nullable=True)
    settings = Column(JSONB, nullable=True, server_default='{}')  # Campaign-specific settings
    schedule_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    total_recipients = Column(Integer, default=0)
    sent_count = Column(Integer, default=0)
    opened_count = Column(Integer, default=0)
    clicked_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_campaigns")
    recipients = relationship("AdminCampaignRecipient", back_populates="campaign", cascade="all, delete-orphan")
    template = relationship("CampaignTemplate", foreign_keys=[template_id])
    activities = relationship("CampaignActivity", back_populates="campaign", cascade="all, delete-orphan")
    voice_calls = relationship("VoiceCall", back_populates="campaign", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_campaigns_user_status", "user_id", "status"),
        Index("idx_admin_campaigns_template_id", "template_id"),
        Index("idx_admin_campaigns_schedule_at", "schedule_at"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminCampaign(id={self.id}, name='{self.name}', status={self.status.value})>"


class AdminCampaignRecipient(Base):
    """Campaign recipient tracking."""
    __tablename__ = "admin_campaign_recipients"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("admin_campaigns.id", ondelete="CASCADE"), nullable=False)
    prospect_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="CASCADE"), nullable=False)
    sent = Column(Boolean, default=False)
    opened = Column(Boolean, default=False)
    clicked = Column(Boolean, default=False)
    bounced = Column(Boolean, default=False)
    sent_at = Column(DateTime)
    opened_at = Column(DateTime)
    clicked_at = Column(DateTime)
    
    # Relationships
    campaign = relationship("AdminCampaign", back_populates="recipients")
    prospect = relationship("AdminProspect")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_campaign_recipients_campaign", "campaign_id"),
        Index("idx_admin_campaign_recipients_prospect", "prospect_id"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminCampaignRecipient(id={self.id}, campaign_id={self.campaign_id}, sent={self.sent})>"


# ============================================================================
# Content Creation Models
# ============================================================================

class AdminContentPiece(Base):
    """YouTube/Podcast content tracking."""
    __tablename__ = "admin_content_pieces"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    type = Column(Enum(ContentType), nullable=False)
    status = Column(Enum(ContentStatus), default=ContentStatus.IDEA)
    script_id = Column(Integer, ForeignKey("admin_content_scripts.id", ondelete="SET NULL"))
    recording_url = Column(Text)  # S3 URL for raw recording
    edited_url = Column(Text)  # S3 URL for edited video/audio
    thumbnail_url = Column(Text)
    description = Column(Text)
    tags = Column(Text)  # JSON array
    youtube_url = Column(Text)
    spotify_url = Column(Text)
    rss_url = Column(Text)
    views_count = Column(Integer, default=0)
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_content_pieces")
    script = relationship("AdminContentScript", back_populates="content_pieces")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_content_pieces_user_status", "user_id", "status"),
        Index("idx_admin_content_pieces_type", "type"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminContentPiece(id={self.id}, title='{self.title}', status={self.status.value})>"


class AdminContentScript(Base):
    """Content scripts and templates."""
    __tablename__ = "admin_content_scripts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content_type = Column(Enum(ContentType), nullable=False)
    script_text = Column(Text, nullable=False)
    duration_minutes = Column(Integer)
    keywords = Column(Text)  # JSON array
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_content_scripts")
    content_pieces = relationship("AdminContentPiece", back_populates="script")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_content_scripts_user_type", "user_id", "content_type"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminContentScript(id={self.id}, title='{self.title}')>"


# ============================================================================
# Lead Capture Models
# ============================================================================

class AdminLeadCapture(Base):
    """Networking event lead captures."""
    __tablename__ = "admin_lead_captures"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(320))
    phone = Column(String(50))
    company = Column(String(255))
    event_name = Column(String(255))
    event_date = Column(Date)
    interest_level = Column(String(50))  # hot, warm, cold
    follow_up_type = Column(String(100))  # immediate, 1-day, 1-week, etc.
    notes = Column(Text)
    voice_notes_url = Column(Text)  # S3 URL
    synced_to_ghl = Column(Boolean, default=False)
    ghl_contact_id = Column(String(100))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_lead_captures")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_lead_captures_user_event", "user_id", "event_date"),
        Index("idx_admin_lead_captures_ghl", "ghl_contact_id"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminLeadCapture(id={self.id}, name='{self.name}', event='{self.event_name}')>"


# ============================================================================
# Sales Collateral Models
# ============================================================================

class AdminCollateral(Base):
    """Sales collateral library."""
    __tablename__ = "admin_collateral"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)  # one-pager, deck, template, etc.
    description = Column(Text)
    file_url = Column(Text, nullable=False)  # S3 URL
    file_size = Column(Integer)  # bytes
    mime_type = Column(String(100))
    tags = Column(Text)  # JSON array
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_collateral")
    usage_records = relationship("AdminCollateralUsage", back_populates="collateral", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_collateral_user_type", "user_id", "type"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminCollateral(id={self.id}, title='{self.title}', type='{self.type}')>"


class AdminCollateralUsage(Base):
    """Collateral usage tracking."""
    __tablename__ = "admin_collateral_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    collateral_id = Column(Integer, ForeignKey("admin_collateral.id", ondelete="CASCADE"), nullable=False)
    prospect_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="CASCADE"))
    used_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    context = Column(String(255))  # meeting, email, proposal, etc.
    
    # Relationships
    collateral = relationship("AdminCollateral", back_populates="usage_records")
    prospect = relationship("AdminProspect")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_collateral_usage_collateral", "collateral_id"),
        Index("idx_admin_collateral_usage_prospect", "prospect_id"),
    )
    
    def __repr__(self) -> str:
        return f"<AdminCollateralUsage(id={self.id}, collateral_id={self.collateral_id}, used_at={self.used_at})>"


# ============================================================================
# Cold Outreach Hub Models
# ============================================================================

class CampaignTemplate(Base):
    """Reusable campaign templates with variable substitution."""
    __tablename__ = "campaign_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # email, voice, linkedin, multi_channel
    variables = Column(JSONB, nullable=True, server_default='[]')  # List of template variables like {{first_name}}
    is_default = Column(Boolean, nullable=False, server_default='false')
    created_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
    # Relationships
    organization = relationship("Organization")
    creator = relationship("User")
    campaigns = relationship("AdminCampaign", back_populates="template", foreign_keys="AdminCampaign.template_id")
    
    # Indexes
    __table_args__ = (
        Index("idx_campaign_templates_organization_id", "organization_id"),
        Index("idx_campaign_templates_type", "type"),
        Index("idx_campaign_templates_is_default", "is_default"),
    )
    
    def __repr__(self) -> str:
        return f"<CampaignTemplate(id={self.id}, name='{self.name}', type='{self.type}')>"


class CampaignActivity(Base):
    """Detailed campaign activity tracking."""
    __tablename__ = "campaign_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    campaign_id = Column(Integer, ForeignKey("admin_campaigns.id", ondelete="CASCADE"), nullable=False)
    contact_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    activity_type = Column(String(100), nullable=False)  # email_sent, email_opened, email_clicked, etc.
    status = Column(String(50), nullable=False)  # pending, sent, delivered, opened, clicked, replied, bounced, failed
    activity_metadata = Column("metadata", JSONB, nullable=True, server_default='{}')  # Additional activity data
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    organization = relationship("Organization")
    campaign = relationship("AdminCampaign", back_populates="activities")
    contact = relationship("AdminProspect", back_populates="campaign_activities")
    user = relationship("User")
    
    # Indexes
    __table_args__ = (
        Index("idx_campaign_activities_organization_id", "organization_id"),
        Index("idx_campaign_activities_campaign_id", "campaign_id"),
        Index("idx_campaign_activities_contact_id", "contact_id"),
        Index("idx_campaign_activities_activity_type", "activity_type"),
        Index("idx_campaign_activities_created_at", "created_at"),
    )
    
    def __repr__(self) -> str:
        return f"<CampaignActivity(id={self.id}, activity_type='{self.activity_type}', status='{self.status}')>"


class VoiceCall(Base):
    """Voice call tracking for AI-powered outreach."""
    __tablename__ = "voice_calls"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    campaign_id = Column(Integer, ForeignKey("admin_campaigns.id", ondelete="SET NULL"), nullable=True)
    contact_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="CASCADE"), nullable=False)
    phone_number = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)  # queued, calling, in_progress, completed, failed, cancelled
    duration = Column(Integer, nullable=True)  # Duration in seconds
    recording_url = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)
    call_metadata = Column("metadata", JSONB, nullable=True, server_default='{}')  # Additional call metadata
    synthflow_call_id = Column(String(255), nullable=True)  # Synthflow API call ID
    synthflow_agent_id = Column(String(255), nullable=True)  # Synthflow agent ID
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
    # Relationships
    organization = relationship("Organization")
    campaign = relationship("AdminCampaign", back_populates="voice_calls")
    contact = relationship("AdminProspect", back_populates="voice_calls")
    conversation_session = relationship("ConversationSession", back_populates="voice_call", uselist=False)
    
    # Indexes
    __table_args__ = (
        Index("idx_voice_calls_organization_id", "organization_id"),
        Index("idx_voice_calls_campaign_id", "campaign_id"),
        Index("idx_voice_calls_contact_id", "contact_id"),
        Index("idx_voice_calls_status", "status"),
        Index("idx_voice_calls_synthflow_call_id", "synthflow_call_id"),
    )
    
    def __repr__(self) -> str:
        return f"<VoiceCall(id={self.id}, phone_number='{self.phone_number}', status='{self.status}')>"


class ConversationSession(Base):
    """AI conversation session tracking with lead qualification."""
    __tablename__ = "conversation_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    voice_call_id = Column(Integer, ForeignKey("voice_calls.id", ondelete="SET NULL"), nullable=True)
    session_id = Column(String(255), nullable=False, unique=True)
    conversation_history = Column(JSONB, nullable=True, server_default='[]')  # Array of conversation messages
    lead_score = Column(Integer, nullable=True)  # 0-100 BANT qualification score
    sentiment = Column(String(50), nullable=True)  # positive, neutral, negative
    intent = Column(String(100), nullable=True)  # greeting, interested, objection, etc.
    qualification_data = Column(JSONB, nullable=True, server_default='{}')  # BANT data: budget, authority, need, timeline
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
    # Relationships
    organization = relationship("Organization")
    voice_call = relationship("VoiceCall", back_populates="conversation_session")
    
    # Indexes
    __table_args__ = (
        Index("idx_conversation_sessions_organization_id", "organization_id"),
        Index("idx_conversation_sessions_voice_call_id", "voice_call_id"),
        Index("idx_conversation_sessions_session_id", "session_id"),
    )
    
    def __repr__(self) -> str:
        return f"<ConversationSession(id={self.id}, session_id='{self.session_id}', lead_score={self.lead_score})>"


class Webhook(Base):
    """Webhook configuration for event-driven integrations."""
    __tablename__ = "webhooks"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    events = Column(ARRAY(String), nullable=False)  # Array of event types to listen for
    secret_key = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, server_default='true')
    headers = Column(JSONB, nullable=True, server_default='{}')  # Custom headers for webhook requests
    created_by = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    
    # Relationships
    organization = relationship("Organization")
    creator = relationship("User")
    deliveries = relationship("WebhookDelivery", back_populates="webhook", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index("idx_webhooks_organization_id", "organization_id"),
        Index("idx_webhooks_is_active", "is_active"),
    )
    
    def __repr__(self) -> str:
        return f"<Webhook(id={self.id}, name='{self.name}', url='{self.url}')>"


class WebhookDelivery(Base):
    """Webhook delivery tracking with retry logic."""
    __tablename__ = "webhook_deliveries"
    
    id = Column(Integer, primary_key=True, index=True)
    webhook_id = Column(Integer, ForeignKey("webhooks.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(100), nullable=False)
    payload = Column(JSONB, nullable=False)
    response_status = Column(Integer, nullable=True)
    response_body = Column(Text, nullable=True)
    response_headers = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, nullable=False, server_default='0')
    next_retry_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    webhook = relationship("Webhook", back_populates="deliveries")
    organization = relationship("Organization")
    
    # Indexes
    __table_args__ = (
        Index("idx_webhook_deliveries_webhook_id", "webhook_id"),
        Index("idx_webhook_deliveries_organization_id", "organization_id"),
        Index("idx_webhook_deliveries_event_type", "event_type"),
        Index("idx_webhook_deliveries_created_at", "created_at"),
    )
    
    def __repr__(self) -> str:
        return f"<WebhookDelivery(id={self.id}, webhook_id={self.webhook_id}, event_type='{self.event_type}')>"
