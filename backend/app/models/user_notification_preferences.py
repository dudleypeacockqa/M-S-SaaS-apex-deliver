"""
User Notification Preferences Model (DEV-020)
Stores user preferences for email notifications.
"""
from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class UserNotificationPreferences(Base):
    """User notification preferences model"""
    __tablename__ = "user_notification_preferences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Global email setting
    email_enabled = Column(Boolean, nullable=False, default=True)
    
    # Event notifications
    event_ticket_confirmation = Column(Boolean, nullable=False, default=True)
    event_reminders = Column(Boolean, nullable=False, default=True)
    
    # Community notifications
    community_comments = Column(Boolean, nullable=False, default=True)
    community_reactions = Column(Boolean, nullable=False, default=True)
    community_mentions = Column(Boolean, nullable=False, default=True)
    
    # System notifications
    system_updates = Column(Boolean, nullable=False, default=True)
    security_alerts = Column(Boolean, nullable=False, default=True)
    
    # PMI notifications
    pmi_milestone_reminders = Column(Boolean, nullable=False, default=True)
    pmi_risk_alerts = Column(Boolean, nullable=False, default=True)
    pmi_synergy_alerts = Column(Boolean, nullable=False, default=True)
    pmi_day_one_warnings = Column(Boolean, nullable=False, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        return f"<UserNotificationPreferences(user_id={self.user_id}, email_enabled={self.email_enabled})>"


