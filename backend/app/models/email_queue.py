"""
Email Queue Model (DEV-020)
Stores emails queued for async sending.
"""
from __future__ import annotations

from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Text
import uuid
import json

from app.db.base import Base


class EmailQueue(Base):
    """Email queue model for async email sending"""
    __tablename__ = "email_queue"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    to_email = Column(String(255), nullable=False, index=True)
    subject = Column(String(500), nullable=False)
    template_name = Column(String(100), nullable=False)
    template_data = Column(Text, nullable=False)  # JSON string
    
    # Status tracking
    status = Column(String(50), nullable=False, default="pending")  # pending, sent, failed
    retry_count = Column(Integer, nullable=False, default=0)
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def get_template_data(self) -> dict:
        """Parse template_data JSON string to dict."""
        return json.loads(self.template_data) if self.template_data else {}

    def set_template_data(self, data: dict) -> None:
        """Set template_data from dict to JSON string."""
        self.template_data = json.dumps(data)

    def __repr__(self):
        return f"<EmailQueue(id={self.id}, to_email={self.to_email}, status={self.status})>"

