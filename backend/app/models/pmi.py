"""PMI (Post-Merger Integration) models for project planning and implementation."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class PMIProjectStatus(str, enum.Enum):
    """PMI project status."""

    planning = "planning"
    active = "active"
    on_hold = "on_hold"
    completed = "completed"
    cancelled = "cancelled"


class PMIWorkstreamStatus(str, enum.Enum):
    """PMI workstream status."""

    not_started = "not_started"
    in_progress = "in_progress"
    at_risk = "at_risk"
    completed = "completed"
    blocked = "blocked"


class PMIWorkstreamType(str, enum.Enum):
    """PMI workstream types."""

    it = "it"
    hr = "hr"
    finance = "finance"
    sales = "sales"
    operations = "operations"
    legal = "legal"
    culture = "culture"
    other = "other"


class PMIPhase(str, enum.Enum):
    """PMI 100-day phases."""

    stabilization = "stabilization"  # Day 1-30
    integration = "integration"  # Day 31-60
    optimization = "optimization"  # Day 61-100


class PMISynergyCategory(str, enum.Enum):
    """Synergy categories."""

    cost_synergy = "cost_synergy"
    revenue_synergy = "revenue_synergy"
    operational_efficiency = "operational_efficiency"


class PMISynergyStatus(str, enum.Enum):
    """Synergy status."""

    planned = "planned"
    in_progress = "in_progress"
    realized = "realized"
    at_risk = "at_risk"
    cancelled = "cancelled"


class PMIMetricType(str, enum.Enum):
    """PMI metric types."""

    ktrr = "ktrr"  # Key Talent Retention Rate
    ccr = "ccr"  # Customer Churn Rate
    srr = "srr"  # Synergy Realization Rate
    nps = "nps"  # Net Promoter Score
    integration_cost = "integration_cost"
    time_to_synergy = "time_to_synergy"
    other = "other"


class PMIRiskSeverity(str, enum.Enum):
    """Risk severity levels."""

    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class PMIRiskStatus(str, enum.Enum):
    """Risk status."""

    open = "open"
    mitigated = "mitigated"
    closed = "closed"
    accepted = "accepted"


class PMIDayOneChecklistStatus(str, enum.Enum):
    """Day 1 checklist item status."""

    not_started = "not_started"
    in_progress = "in_progress"
    complete = "complete"
    at_risk = "at_risk"


class PMIDayOneCategory(str, enum.Enum):
    """Day 1 checklist categories."""

    it = "it"
    hr = "hr"
    finance = "finance"
    legal = "legal"
    communications = "communications"
    operations = "operations"
    other = "other"


class PMIProject(Base):
    """Main PMI integration project linked to a Deal."""

    __tablename__ = "pmi_projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    deal_id = Column(String(36), ForeignKey("deals.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    status = Column(
        Enum(PMIProjectStatus, native_enum=False, length=50),
        default=PMIProjectStatus.planning,
        nullable=False,
    )
    close_date = Column(DateTime(timezone=True), nullable=True)
    day_one_date = Column(DateTime(timezone=True), nullable=True)
    target_completion_date = Column(DateTime(timezone=True), nullable=True)
    actual_completion_date = Column(DateTime(timezone=True), nullable=True)
    description = Column(Text, nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    organization = relationship("Organization")
    deal = relationship("Deal")
    creator = relationship("User", foreign_keys=[created_by])
    workstreams = relationship("PMIWorkstream", back_populates="project", cascade="all, delete-orphan")
    synergies = relationship("PMISynergy", back_populates="project", cascade="all, delete-orphan")
    metrics = relationship("PMIMetric", back_populates="project", cascade="all, delete-orphan")
    risks = relationship("PMIRisk", back_populates="project", cascade="all, delete-orphan")
    day_one_checklist = relationship("PMIDayOneChecklist", back_populates="project", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_pmi_projects_organization_id", "organization_id"),
        Index("idx_pmi_projects_deal_id", "deal_id"),
        Index("idx_pmi_projects_status", "status"),
        Index("idx_pmi_projects_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"PMIProject(id={self.id!s}, name={self.name!r}, status={self.status.value!r})"


class PMIWorkstream(Base):
    """Functional workstreams within a PMI project."""

    __tablename__ = "pmi_workstreams"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("pmi_projects.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    workstream_type = Column(
        Enum(PMIWorkstreamType, native_enum=False, length=50),
        nullable=False,
    )
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(
        Enum(PMIWorkstreamStatus, native_enum=False, length=50),
        default=PMIWorkstreamStatus.not_started,
        nullable=False,
    )
    priority = Column(String(32), default="normal", nullable=False)
    phase = Column(Enum(PMIPhase, native_enum=False, length=50), nullable=True)
    description = Column(Text, nullable=True)
    progress_percentage = Column(Numeric(precision=5, scale=2), default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    project = relationship("PMIProject", back_populates="workstreams")
    organization = relationship("Organization")
    owner = relationship("User", foreign_keys=[owner_id])
    milestones = relationship("PMIMilestone", back_populates="workstream", cascade="all, delete-orphan")
    risks = relationship("PMIRisk", back_populates="workstream", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_pmi_workstreams_project_id", "project_id"),
        Index("idx_pmi_workstreams_organization_id", "organization_id"),
        Index("idx_pmi_workstreams_status", "status"),
        Index("idx_pmi_workstreams_type", "workstream_type"),
    )

    def __repr__(self) -> str:
        return f"PMIWorkstream(id={self.id!s}, name={self.name!r}, status={self.status.value!r})"


class PMIMilestone(Base):
    """Key milestones within workstreams."""

    __tablename__ = "pmi_milestones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workstream_id = Column(
        String(36),
        ForeignKey("pmi_workstreams.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(DateTime(timezone=True), nullable=True)
    actual_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(32), default="not_started", nullable=False)
    dependencies = Column(Text, nullable=True)  # JSON array of milestone IDs
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    workstream = relationship("PMIWorkstream", back_populates="milestones")
    organization = relationship("Organization")

    # Indexes
    __table_args__ = (
        Index("idx_pmi_milestones_workstream_id", "workstream_id"),
        Index("idx_pmi_milestones_organization_id", "organization_id"),
        Index("idx_pmi_milestones_target_date", "target_date"),
    )

    def __repr__(self) -> str:
        return f"PMIMilestone(id={self.id!s}, name={self.name!r})"


class PMISynergy(Base):
    """Synergy tracking (cost savings, revenue gains)."""

    __tablename__ = "pmi_synergies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("pmi_projects.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    category = Column(
        Enum(PMISynergyCategory, native_enum=False, length=50),
        nullable=False,
    )
    planned_value = Column(Numeric(precision=15, scale=2), nullable=False)
    realized_value = Column(Numeric(precision=15, scale=2), nullable=True)
    currency = Column(String(3), default="GBP", nullable=False)
    target_date = Column(DateTime(timezone=True), nullable=True)
    realized_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(
        Enum(PMISynergyStatus, native_enum=False, length=50),
        default=PMISynergyStatus.planned,
        nullable=False,
    )
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    project = relationship("PMIProject", back_populates="synergies")
    organization = relationship("Organization")

    # Indexes
    __table_args__ = (
        Index("idx_pmi_synergies_project_id", "project_id"),
        Index("idx_pmi_synergies_organization_id", "organization_id"),
        Index("idx_pmi_synergies_status", "status"),
        Index("idx_pmi_synergies_category", "category"),
    )

    def __repr__(self) -> str:
        return f"PMISynergy(id={self.id!s}, name={self.name!r}, category={self.category.value!r})"


class PMIMetric(Base):
    """Performance metrics tracking."""

    __tablename__ = "pmi_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("pmi_projects.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    metric_type = Column(
        Enum(PMIMetricType, native_enum=False, length=50),
        nullable=False,
    )
    value = Column(Numeric(precision=15, scale=2), nullable=False)
    target_value = Column(Numeric(precision=15, scale=2), nullable=True)
    measurement_date = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("PMIProject", back_populates="metrics")
    organization = relationship("Organization")

    # Indexes
    __table_args__ = (
        Index("idx_pmi_metrics_project_id", "project_id"),
        Index("idx_pmi_metrics_organization_id", "organization_id"),
        Index("idx_pmi_metrics_type", "metric_type"),
        Index("idx_pmi_metrics_measurement_date", "measurement_date"),
    )

    def __repr__(self) -> str:
        return f"PMIMetric(id={self.id!s}, type={self.metric_type.value!r}, value={self.value!s})"


class PMIRisk(Base):
    """Risk register for integration risks."""

    __tablename__ = "pmi_risks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("pmi_projects.id", ondelete="CASCADE"), nullable=False, index=True)
    workstream_id = Column(
        String(36),
        ForeignKey("pmi_workstreams.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(
        Enum(PMIRiskSeverity, native_enum=False, length=50),
        nullable=False,
    )
    status = Column(
        Enum(PMIRiskStatus, native_enum=False, length=50),
        default=PMIRiskStatus.open,
        nullable=False,
    )
    mitigation_plan = Column(Text, nullable=True)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    project = relationship("PMIProject", back_populates="risks")
    workstream = relationship("PMIWorkstream", back_populates="risks")
    organization = relationship("Organization")
    owner = relationship("User", foreign_keys=[owner_id])
    creator = relationship("User", foreign_keys=[created_by])

    # Indexes
    __table_args__ = (
        Index("idx_pmi_risks_project_id", "project_id"),
        Index("idx_pmi_risks_workstream_id", "workstream_id"),
        Index("idx_pmi_risks_organization_id", "organization_id"),
        Index("idx_pmi_risks_severity", "severity"),
        Index("idx_pmi_risks_status", "status"),
    )

    def __repr__(self) -> str:
        return f"PMIRisk(id={self.id!s}, title={self.title!r}, severity={self.severity.value!r})"


class PMIDayOneChecklist(Base):
    """Day 1 readiness checklist items."""

    __tablename__ = "pmi_day_one_checklist"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("pmi_projects.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    category = Column(
        Enum(PMIDayOneCategory, native_enum=False, length=50),
        nullable=False,
    )
    item = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(
        Enum(PMIDayOneChecklistStatus, native_enum=False, length=50),
        default=PMIDayOneChecklistStatus.not_started,
        nullable=False,
    )
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    project = relationship("PMIProject", back_populates="day_one_checklist")
    organization = relationship("Organization")
    owner = relationship("User", foreign_keys=[owner_id])

    # Indexes
    __table_args__ = (
        Index("idx_pmi_day_one_project_id", "project_id"),
        Index("idx_pmi_day_one_organization_id", "organization_id"),
        Index("idx_pmi_day_one_category", "category"),
        Index("idx_pmi_day_one_status", "status"),
        Index("idx_pmi_day_one_due_date", "due_date"),
    )

    def __repr__(self) -> str:
        return f"PMIDayOneChecklist(id={self.id!s}, item={self.item!r}, status={self.status.value!r})"

