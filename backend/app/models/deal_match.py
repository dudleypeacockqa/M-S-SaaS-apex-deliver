"""
Deal Matching Models - DEV-018 (Intelligent Deal Matching Engine)
Models for storing deal matching criteria, match results, and user actions
"""

import uuid
from datetime import datetime, UTC
from decimal import Decimal
from typing import Dict, List, Optional
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, DECIMAL, Text, JSON
from sqlalchemy.orm import relationship, validates

from app.db.base import Base


class DealMatchCriteria(Base):
    """
    User-defined matching criteria for finding deals.

    Stores the criteria a user wants to match against (e.g., industry, size, geography).
    Can be reused as templates for recurring searches.
    """

    __tablename__ = "deal_match_criteria"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)  # Clerk user ID
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Criteria details
    name = Column(String, nullable=False)  # e.g., "Tech Acquisitions Q4 2025"
    deal_type = Column(String, nullable=False)  # "buy_side" or "sell_side"

    # Matching parameters (stored as JSON for flexibility, arrays for lists)
    industries = Column(JSON, nullable=False)  # ["saas", "fintech"]
    min_deal_size = Column(DECIMAL(precision=15, scale=2), nullable=False)
    max_deal_size = Column(DECIMAL(precision=15, scale=2), nullable=False)
    geographies = Column(JSON, nullable=True)  # ["UK", "EU", "US"]
    structures = Column(JSON, nullable=True)  # ["asset_purchase", "stock_purchase", "merger"]
    negative_filters = Column(JSON, nullable=True)  # {"distressed": true, "regulated": false}
    weights = Column(JSON, nullable=True)  # {"industry": 0.4, "size": 0.3, ...}

    # Timestamps
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), nullable=True, onupdate=lambda: datetime.now(UTC))

    # Relationships
    organization = relationship("Organization", back_populates="deal_match_criteria")

    def __init__(self, **kwargs):
        if kwargs.get('organization_id') is None:
            raise ValueError('organization_id is required for DealMatchCriteria')
        super().__init__(**kwargs)

    def __repr__(self):
        return f"<DealMatchCriteria(id={self.id}, name={self.name}, deal_type={self.deal_type})>"

    @validates("organization_id")
    def _validate_organization(self, key, value):
        if not value:
            raise ValueError("organization_id is required for deal matching criteria")
        return value


class DealMatch(Base):
    """
    A potential match between two deals.

    Stores the match score, confidence level, and explanation for why deals matched.
    """

    __tablename__ = "deal_matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True)
    matched_deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Match quality metrics
    match_score = Column(Float, nullable=False)  # 0-100
    confidence = Column(String, nullable=False)  # "high" (>80), "medium" (60-80), "low" (40-60)
    explanation = Column(JSON, nullable=False)  # JSON explaining score components

    # Match status tracking
    status = Column(String, nullable=False, default="pending")  # "pending", "accepted", "declined", "introduced"
    viewed_at = Column(DateTime(timezone=True), nullable=True)
    responded_at = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))

    # Relationships
    deal = relationship("Deal", foreign_keys=[deal_id], back_populates="matches_as_source")
    matched_deal = relationship("Deal", foreign_keys=[matched_deal_id], back_populates="matches_as_target")
    organization = relationship("Organization")
    organization = relationship("Organization")
    actions = relationship("DealMatchAction", back_populates="match", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<DealMatch(id={self.id}, score={self.match_score}, confidence={self.confidence}, status={self.status})>"

    @validates("organization_id")
    def _validate_organization(self, key, value):
        if not value:
            raise ValueError("organization_id is required for stored deal matches")
        return value


class DealMatchAction(Base):
    """
    User actions on matches (for analytics and tracking).

    Tracks when users view, save, pass, or request introductions on matches.
    """

    __tablename__ = "deal_match_actions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id = Column(String(36), ForeignKey("deal_matches.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, nullable=False, index=True)  # Clerk user ID

    # Action details
    action = Column(String, nullable=False)  # "view", "save", "pass", "request_intro"
    action_metadata = Column(JSON, nullable=True)  # Additional context (e.g., {"source": "email", "device": "mobile"})

    # Timestamp
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))

    # Relationships
    match = relationship("DealMatch", back_populates="actions")

    def __repr__(self):
        return f"<DealMatchAction(id={self.id}, action={self.action}, match_id={self.match_id})>"
