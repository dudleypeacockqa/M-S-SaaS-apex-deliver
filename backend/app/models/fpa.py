"""Financial Planning & Analytics models."""
from __future__ import annotations

from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, JSON, Numeric, String, Text, Index

from app.db.base import Base, GUID


class FpaForecast(Base):
    """Organization-specific demand forecast records."""

    __tablename__ = "fpa_forecasts"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    period = Column(String(32), nullable=False)  # ISO week/month label
    forecasted_demand = Column(Numeric(precision=12, scale=2), nullable=False)
    actual_demand = Column(Numeric(precision=12, scale=2), nullable=True)
    confidence_level = Column(Numeric(precision=4, scale=3), nullable=False)
    assumptions = Column(JSON, default=dict)
    created_by_user_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        Index("idx_fpa_forecasts_org_period", "organization_id", "period", unique=False),
    )


class FpaScenario(Base):
    """What-if scenarios captured by FP&A teams."""

    __tablename__ = "fpa_scenarios"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    assumptions = Column(JSON, default=dict)
    metrics = Column(JSON, default=dict)
    created_by_user_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        Index("idx_fpa_scenarios_org_name", "organization_id", "name"),
    )


class FpaReport(Base):
    """Generated FP&A reports summarizing forecasts and scenarios."""

    __tablename__ = "fpa_reports"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID, ForeignKey("organizations.id"), nullable=False, index=True)
    report_type = Column(String(64), nullable=False)
    payload = Column(JSON, default=dict)
    created_by_user_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        Index("idx_fpa_reports_org_type", "organization_id", "report_type"),
    )

