"""Pipeline template models."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    Integer,
    Text,
    Index,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class PipelineTemplate(Base):
    """Custom pipeline template per organization."""

    __tablename__ = "pipeline_templates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    is_default = Column(Boolean, nullable=False, default=False)
    created_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    stages = relationship(
        "PipelineTemplateStage",
        back_populates="template",
        cascade="all, delete-orphan",
        order_by="PipelineTemplateStage.order_index",
    )

    __table_args__ = (
        Index("idx_pipeline_templates_org_default", "organization_id", "is_default"),
    )


class PipelineTemplateStage(Base):
    """Stages within a pipeline template."""

    __tablename__ = "pipeline_template_stages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    template_id = Column(String(36), ForeignKey("pipeline_templates.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    order_index = Column(Numeric(precision=5, scale=2), nullable=False)
    probability = Column(Numeric(precision=5, scale=2), nullable=True)
    sla_hours = Column(Integer, nullable=True)
    color = Column(String(7), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    template = relationship("PipelineTemplate", back_populates="stages")

