"""
Financial Connection Model - DEV-010: Financial Intelligence Engine
Stores OAuth connections to accounting platforms (Xero, QuickBooks)
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base
from app.utils.datetime import utc_now
class FinancialConnection(Base):
    """
    Stores OAuth 2.0 connections to external accounting platforms.

    Supports:
    - Xero (UK accounting platform)
    - QuickBooks Online (global accounting platform)
    """
    __tablename__ = "financial_connections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Platform details
    platform = Column(String(50), nullable=False)  # 'xero' or 'quickbooks'
    platform_organization_id = Column(String(255), nullable=True)  # Org ID in external platform
    platform_organization_name = Column(String(255), nullable=True)

    # OAuth 2.0 tokens (should be encrypted in production)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Connection status
    connection_status = Column(String(50), nullable=False, default='active')  # active, expired, revoked, error
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    last_sync_status = Column(String(50), nullable=True)  # success, error
    last_sync_error = Column(Text, nullable=True)

    # Audit fields
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    deal = relationship("Deal", back_populates="financial_connections")
    statements = relationship("FinancialStatement", back_populates="connection", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<FinancialConnection(id={self.id}, deal_id={self.deal_id}, platform={self.platform})>"
