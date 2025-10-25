"""Organization model definitions."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class Organization(Base):
    """Multi-tenant organization."""

    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    subscription_tier = Column(String(50), default="starter", nullable=False)  # starter, professional, enterprise, community
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    subscription = relationship("Subscription", back_populates="organization", uselist=False)
    invoices = relationship("Invoice", back_populates="organization")

    def __repr__(self) -> str:  # pragma: no cover - repr aid
        return f"Organization(id={self.id!s}, name={self.name!r})"
