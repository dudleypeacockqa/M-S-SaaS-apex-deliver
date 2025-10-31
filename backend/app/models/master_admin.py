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
from datetime import date, datetime
from enum import Enum as PyEnum
from typing import Optional

from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime, Boolean, Numeric,
    ForeignKey, CheckConstraint, UniqueConstraint, Index, Enum
)
from sqlalchemy.orm import relationship

from app.db.base import Base


# ============================================================================
# Enums
# ============================================================================

class ActivityType(str, PyEnum):
    """Activity types for tracking."""
    DISCOVERY = "discovery"
    EMAIL = "email"
    VIDEO = "video"
    CALL = "call"


class ActivityStatus(str, PyEnum):
    """Activity completion status."""
    DONE = "done"
    PENDING = "pending"
    CANCELLED = "cancelled"


class NudgeType(str, PyEnum):
    """Types of nudges/notifications."""
    REMINDER = "reminder"
    SUGGESTION = "suggestion"
    ALERT = "alert"
    CELEBRATION = "celebration"


class NudgePriority(str, PyEnum):
    """Priority levels for nudges."""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class MeetingType(str, PyEnum):
    """Types of meetings."""
    DISCOVERY = "discovery"
    DEMO = "demo"
    NEGOTIATION = "negotiation"
    CLOSING = "closing"


class ProspectStatus(str, PyEnum):
    """Prospect lifecycle status."""
    NEW = "new"
    QUALIFIED = "qualified"
    ENGAGED = "engaged"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class DealStage(str, PyEnum):
    """Deal pipeline stages."""
    DISCOVERY = "discovery"
    QUALIFICATION = "qualification"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSING = "closing"
    WON = "won"
    LOST = "lost"


class CampaignType(str, PyEnum):
    """Campaign types."""
    EMAIL = "email"
    SMS = "sms"
    MIXED = "mixed"


class CampaignStatus(str, PyEnum):
    """Campaign status."""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class ContentType(str, PyEnum):
    """Content piece types."""
    YOUTUBE = "youtube"
    PODCAST = "podcast"
    BLOG = "blog"
    SOCIAL = "social"


class ContentStatus(str, PyEnum):
    """Content production status."""
    IDEA = "idea"
    SCRIPTING = "scripting"
    RECORDING = "recording"
    EDITING = "editing"
    READY = "ready"
    PUBLISHED = "published"


# ============================================================================
# Activity Tracker Models
# ============================================================================

class AdminGoal(Base):
    """Weekly goals for activity tracking."""
    __tablename__ = "admin_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    week_start = Column(Date, nullable=False)
    target_discoveries = Column(Integer, default=0)
    target_emails = Column(Integer, default=0)
    target_videos = Column(Integer, default=0)
    target_calls = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(ActivityType), nullable=False)
    status = Column(Enum(ActivityStatus), nullable=False)
    date = Column(Date, nullable=False)
    amount = Column(Integer, default=1)
    notes = Column(Text)
    prospect_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    score = Column(Integer, nullable=False)
    streak_days = Column(Integer, default=0)
    activities_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    duration_minutes = Column(Integer, default=50)
    completed = Column(Boolean, default=False)
    interrupted = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(NudgeType), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(Enum(NudgePriority), default=NudgePriority.NORMAL)
    read = Column(Boolean, default=False)
    action_url = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(Enum(MeetingType), nullable=False)
    duration_minutes = Column(Integer, default=60)
    agenda = Column(Text)
    questions = Column(Text)
    follow_up_tasks = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(320))
    phone = Column(String(50))
    company = Column(String(255))
    title = Column(String(255))
    status = Column(Enum(ProspectStatus), default=ProspectStatus.NEW)
    source = Column(String(100))  # networking, referral, inbound, etc.
    tags = Column(Text)  # JSON array of tags
    notes = Column(Text)
    voice_notes_url = Column(Text)  # S3 URL for voice notes
    ghl_contact_id = Column(String(100))  # GoHighLevel contact ID
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_contacted = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="admin_prospects")
    activities = relationship("AdminActivity", back_populates="prospect", cascade="all, delete-orphan")
    deals = relationship("AdminDeal", back_populates="prospect", cascade="all, delete-orphan")
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    prospect_id = Column(Integer, ForeignKey("admin_prospects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    stage = Column(Enum(DealStage), default=DealStage.DISCOVERY)
    value = Column(Numeric(12, 2))  # Deal value in currency
    probability = Column(Integer, default=0)  # 0-100%
    expected_close_date = Column(Date)
    actual_close_date = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    """Email/SMS campaign management."""
    __tablename__ = "admin_campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(Enum(CampaignType), nullable=False)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    subject = Column(String(500))  # Email subject or SMS preview
    content = Column(Text, nullable=False)
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime)
    total_recipients = Column(Integer, default=0)
    sent_count = Column(Integer, default=0)
    opened_count = Column(Integer, default=0)
    clicked_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="admin_campaigns")
    recipients = relationship("AdminCampaignRecipient", back_populates="campaign", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index("idx_admin_campaigns_user_status", "user_id", "status"),
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
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
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content_type = Column(Enum(ContentType), nullable=False)
    script_text = Column(Text, nullable=False)
    duration_minutes = Column(Integer)
    keywords = Column(Text)  # JSON array
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
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
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
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
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)  # one-pager, deck, template, etc.
    description = Column(Text)
    file_url = Column(Text, nullable=False)  # S3 URL
    file_size = Column(Integer)  # bytes
    mime_type = Column(String(100))
    tags = Column(Text)  # JSON array
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
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
    used_at = Column(DateTime, default=datetime.utcnow, nullable=False)
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
