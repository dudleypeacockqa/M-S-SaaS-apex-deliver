"""Deal model definitions."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class DealStage(str, enum.Enum):
     """Deal pipeline stages."""

     sourcing = "sourcing"
     evaluation = "evaluation"
     due_diligence = "due_diligence"
     negotiation = "negotiation"
     closing = "closing"
     won = "won"
     lost = "lost"


class Deal(Base):
     """M&A Deal record."""

     __tablename__ = "deals"

     id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
     organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
     name = Column(String(255), nullable=False)
     target_company = Column(String(255), nullable=False)
     industry = Column(String(100), nullable=True)
     deal_size = Column(Numeric(precision=15, scale=2), nullable=True)
     currency = Column(String(3), default="GBP", nullable=False)
     stage = Column(Enum(DealStage, native_enum=False, length=50), default=DealStage.sourcing, nullable=False)
     owner_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
     description = Column(Text, nullable=True)
     created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
     updated_at = Column(
         DateTime(timezone=True),
         default=lambda: datetime.now(timezone.utc),
         onupdate=lambda: datetime.now(timezone.utc),
         nullable=False,
     )
     archived_at = Column(DateTime(timezone=True), nullable=True)
     is_archived = Column(Boolean, default=False, nullable=False)

     # Relationships
     folders = relationship("Folder", back_populates="deal", cascade="all, delete-orphan")
     documents = relationship("Document", back_populates="deal", cascade="all, delete-orphan")
     financial_connections = relationship("FinancialConnection", back_populates="deal", cascade="all, delete-orphan")
     financial_statements = relationship("FinancialStatement", back_populates="deal", cascade="all, delete-orphan")
     financial_ratios = relationship("FinancialRatio", back_populates="deal", cascade="all, delete-orphan")
     financial_narratives = relationship("FinancialNarrative", back_populates="deal", cascade="all, delete-orphan")
     valuations = relationship("ValuationModel", back_populates="deal", cascade="all, delete-orphan")

     # Indexes for performance
     __table_args__ = (
         Index("idx_deals_organization_id", "organization_id"),
         Index("idx_deals_owner_id", "owner_id"),
         Index("idx_deals_stage", "stage"),
         Index("idx_deals_created_at", "created_at"),
         Index("idx_deals_archived", "is_archived"),
     )

     def __repr__(self) -> str:  # pragma: no cover - repr aid
         return f"Deal(id={self.id!s}, name={self.name!r}, stage={self.stage.value!r})"


class PipelineStage(Base):
     """Custom pipeline stage configuration for an organization."""

     __tablename__ = "pipeline_stages"

     id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
     organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
     name = Column(String(100), nullable=False)
     order = Column(Numeric(precision=5, scale=2), nullable=False)
     color = Column(String(7), default="#3B82F6", nullable=False)  # Hex color
     is_active = Column(Boolean, default=True, nullable=False)
     created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
     updated_at = Column(
         DateTime(timezone=True),
         default=lambda: datetime.now(timezone.utc),
         onupdate=lambda: datetime.now(timezone.utc),
         nullable=False,
     )

     # Relationships
     # organization = relationship("Organization", back_populates="pipeline_stages")

     # Indexes
     __table_args__ = (
         Index("idx_pipeline_stages_organization_id", "organization_id"),
         Index("idx_pipeline_stages_order", "order"),
     )

     def __repr__(self) -> str:  # pragma: no cover - repr aid
         return f"PipelineStage(id={self.id!s}, name={self.name!r}, order={self.order!s})"


