"""Podcast usage tracking model.

Tracks monthly episode creation counts per organization for quota enforcement.
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Index
import uuid

from app.db.base import Base


class PodcastUsage(Base):
    """
    Tracks monthly podcast episode usage per organization.

    Used for enforcing tier-based quota limits (Professional tier: 10 episodes/month).
    """

    __tablename__ = "podcast_usage"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, nullable=False, index=True)
    month = Column(DateTime, nullable=False)  # First day of month (YYYY-MM-01)
    episode_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        # Composite index for fast queries by organization + month
        Index('idx_podcast_usage_org_month', 'organization_id', 'month'),
        # Ensure one record per organization per month
        Index('idx_podcast_usage_unique_org_month', 'organization_id', 'month', unique=True),
    )

    def __repr__(self):
        return (
            f"<PodcastUsage(id={self.id}, org={self.organization_id}, "
            f"month={self.month.strftime('%Y-%m')}, count={self.episode_count})>"
        )
