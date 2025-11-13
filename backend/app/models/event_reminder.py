"""Event reminder model (DEV-020)."""
from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class EventReminder(Base):
    __tablename__ = "event_reminders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String(36), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    reminder_type = Column(String(32), nullable=False)  # e.g., "24h", "1h"
    status = Column(String(32), nullable=False, default="pending")  # pending, sent, failed
    scheduled_for = Column(DateTime(timezone=True), nullable=False)
    attempts = Column(Integer, nullable=False, default=0)
    last_attempt_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    event = relationship("Event", foreign_keys=[event_id])

    def __repr__(self) -> str:  # pragma: no cover - repr utility
        return f"<EventReminder(event_id={self.event_id}, type={self.reminder_type}, status={self.status})>"
