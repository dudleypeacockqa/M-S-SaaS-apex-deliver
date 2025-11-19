"""Pydantic schemas for PMI (Post-Merger Integration) operations."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict

from app.models.pmi import (
    PMIProjectStatus,
    PMIWorkstreamStatus,
    PMIWorkstreamType,
    PMIPhase,
    PMISynergyCategory,
    PMISynergyStatus,
    PMIMetricType,
    PMIRiskSeverity,
    PMIRiskStatus,
    PMIDayOneChecklistStatus,
    PMIDayOneCategory,
)


# PMI Project Schemas
class PMIProjectBase(BaseModel):
    """Base schema with common PMI project fields."""

    name: str = Field(..., min_length=1, max_length=255, description="PMI project name")
    deal_id: str = Field(..., description="Associated deal ID")
    status: PMIProjectStatus = Field(PMIProjectStatus.planning, description="Project status")
    close_date: Optional[datetime] = Field(None, description="Deal close date")
    day_one_date: Optional[datetime] = Field(None, description="Day 1 date")
    target_completion_date: Optional[datetime] = Field(None, description="Target completion date")
    description: Optional[str] = Field(None, description="Project description")


class PMIProjectCreate(PMIProjectBase):
    """Schema for creating a new PMI project."""

    pass


class PMIProjectUpdate(BaseModel):
    """Schema for updating an existing PMI project."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    status: Optional[PMIProjectStatus] = None
    close_date: Optional[datetime] = None
    day_one_date: Optional[datetime] = None
    target_completion_date: Optional[datetime] = None
    actual_completion_date: Optional[datetime] = None
    description: Optional[str] = None


class PMIProjectResponse(PMIProjectBase):
    """Schema for PMI project responses."""

    id: str
    organization_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    actual_completion_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# PMI Workstream Schemas
class PMIWorkstreamBase(BaseModel):
    """Base schema with common workstream fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Workstream name")
    workstream_type: PMIWorkstreamType = Field(..., description="Type of workstream")
    owner_id: Optional[str] = Field(None, description="Workstream owner user ID")
    status: PMIWorkstreamStatus = Field(PMIWorkstreamStatus.not_started, description="Workstream status")
    priority: str = Field("normal", description="Priority level")
    phase: Optional[PMIPhase] = Field(None, description="PMI phase")
    description: Optional[str] = Field(None, description="Workstream description")
    progress_percentage: Decimal = Field(0, ge=0, le=100, description="Progress percentage")


class PMIWorkstreamCreate(PMIWorkstreamBase):
    """Schema for creating a new workstream."""

    project_id: Optional[str] = Field(None, description="PMI project ID")


class PMIWorkstreamUpdate(BaseModel):
    """Schema for updating an existing workstream."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    workstream_type: Optional[PMIWorkstreamType] = None
    owner_id: Optional[str] = None
    status: Optional[PMIWorkstreamStatus] = None
    priority: Optional[str] = None
    phase: Optional[PMIPhase] = None
    description: Optional[str] = None
    progress_percentage: Optional[Decimal] = Field(None, ge=0, le=100)


class PMIWorkstreamResponse(PMIWorkstreamBase):
    """Schema for workstream responses."""

    id: str
    project_id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# PMI Milestone Schemas
class PMIMilestoneBase(BaseModel):
    """Base schema with common milestone fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Milestone name")
    description: Optional[str] = Field(None, description="Milestone description")
    target_date: Optional[datetime] = Field(None, description="Target completion date")
    status: str = Field("not_started", description="Milestone status")
    dependencies: Optional[str] = Field(None, description="Dependency milestone IDs (JSON)")


class PMIMilestoneCreate(PMIMilestoneBase):
    """Schema for creating a new milestone."""

    workstream_id: Optional[str] = Field(None, description="Workstream ID")


class PMIMilestoneUpdate(BaseModel):
    """Schema for updating an existing milestone."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    actual_date: Optional[datetime] = None
    status: Optional[str] = None
    dependencies: Optional[str] = None


class PMIMilestoneResponse(PMIMilestoneBase):
    """Schema for milestone responses."""

    id: str
    workstream_id: str
    organization_id: str
    actual_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# PMI Synergy Schemas
class PMISynergyBase(BaseModel):
    """Base schema with common synergy fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Synergy name")
    category: PMISynergyCategory = Field(..., description="Synergy category")
    planned_value: Decimal = Field(..., ge=0, description="Planned value")
    realized_value: Optional[Decimal] = Field(None, ge=0, description="Realized value")
    currency: str = Field("GBP", min_length=3, max_length=3, description="Currency code")
    target_date: Optional[datetime] = Field(None, description="Target realization date")
    status: PMISynergyStatus = Field(PMISynergyStatus.planned, description="Synergy status")
    description: Optional[str] = Field(None, description="Synergy description")


class PMISynergyCreate(PMISynergyBase):
    """Schema for creating a new synergy."""

    project_id: Optional[str] = Field(None, description="PMI project ID")


class PMISynergyUpdate(BaseModel):
    """Schema for updating an existing synergy."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[PMISynergyCategory] = None
    planned_value: Optional[Decimal] = Field(None, ge=0)
    realized_value: Optional[Decimal] = Field(None, ge=0)
    currency: Optional[str] = Field(None, min_length=3, max_length=3)
    target_date: Optional[datetime] = None
    realized_date: Optional[datetime] = None
    status: Optional[PMISynergyStatus] = None
    description: Optional[str] = None


class PMISynergyResponse(PMISynergyBase):
    """Schema for synergy responses."""

    id: str
    project_id: str
    organization_id: str
    realized_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# PMI Metric Schemas
class PMIMetricBase(BaseModel):
    """Base schema with common metric fields."""

    metric_type: PMIMetricType = Field(..., description="Type of metric")
    value: Decimal = Field(..., description="Metric value")
    target_value: Optional[Decimal] = Field(None, description="Target value")
    measurement_date: datetime = Field(..., description="Date of measurement")
    description: Optional[str] = Field(None, description="Metric description")


class PMIMetricCreate(PMIMetricBase):
    """Schema for creating a new metric."""

    project_id: Optional[str] = Field(None, description="PMI project ID")


class PMIMetricResponse(PMIMetricBase):
    """Schema for metric responses."""

    id: str
    project_id: str
    organization_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# PMI Risk Schemas
class PMIRiskBase(BaseModel):
    """Base schema with common risk fields."""

    title: str = Field(..., min_length=1, max_length=255, description="Risk title")
    description: Optional[str] = Field(None, description="Risk description")
    severity: PMIRiskSeverity = Field(..., description="Risk severity")
    status: PMIRiskStatus = Field(PMIRiskStatus.open, description="Risk status")
    mitigation_plan: Optional[str] = Field(None, description="Mitigation plan")
    owner_id: Optional[str] = Field(None, description="Risk owner user ID")


class PMIRiskCreate(PMIRiskBase):
    """Schema for creating a new risk."""

    project_id: Optional[str] = Field(None, description="PMI project ID")
    workstream_id: Optional[str] = Field(None, description="Associated workstream ID")


class PMIRiskUpdate(BaseModel):
    """Schema for updating an existing risk."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    severity: Optional[PMIRiskSeverity] = None
    status: Optional[PMIRiskStatus] = None
    mitigation_plan: Optional[str] = None
    owner_id: Optional[str] = None
    workstream_id: Optional[str] = None


class PMIRiskResponse(PMIRiskBase):
    """Schema for risk responses."""

    id: str
    project_id: str
    workstream_id: Optional[str] = None
    organization_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# PMI Day One Checklist Schemas
class PMIDayOneChecklistBase(BaseModel):
    """Base schema with common Day 1 checklist fields."""

    category: PMIDayOneCategory = Field(..., description="Checklist category")
    item: str = Field(..., min_length=1, max_length=255, description="Checklist item")
    description: Optional[str] = Field(None, description="Item description")
    status: PMIDayOneChecklistStatus = Field(
        PMIDayOneChecklistStatus.not_started,
        description="Item status",
    )
    owner_id: Optional[str] = Field(None, description="Item owner user ID")
    due_date: Optional[datetime] = Field(None, description="Due date")


class PMIDayOneChecklistCreate(PMIDayOneChecklistBase):
    """Schema for creating a new Day 1 checklist item."""

    project_id: Optional[str] = Field(None, description="PMI project ID")


class PMIDayOneChecklistUpdate(BaseModel):
    """Schema for updating an existing Day 1 checklist item."""

    category: Optional[PMIDayOneCategory] = None
    item: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[PMIDayOneChecklistStatus] = None
    owner_id: Optional[str] = None
    due_date: Optional[datetime] = None


class PMIDayOneChecklistResponse(PMIDayOneChecklistBase):
    """Schema for Day 1 checklist responses."""

    id: str
    project_id: str
    organization_id: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Dashboard Response Schema
class PMIDashboardResponse(BaseModel):
    """Schema for PMI dashboard aggregated data."""

    project_id: str
    project: PMIProjectResponse
    total_workstreams: int
    completed_workstreams: int
    total_synergies: int
    realized_synergies: int
    synergy_realization_rate: Decimal
    total_risks: int
    critical_risks: int
    day_one_readiness_percentage: Decimal
    current_phase: Optional[PMIPhase]
    days_since_day_one: Optional[int]
    days_remaining: Optional[int]
    recent_metrics: List[PMIMetricResponse]
    workstreams_summary: List[PMIWorkstreamResponse]
    top_risks: List[PMIRiskResponse] = Field(default_factory=list)


    model_config = ConfigDict(from_attributes=True)


# List Response Schemas
class PMIProjectListResponse(BaseModel):
    """Schema for paginated PMI project list."""

    items: List[PMIProjectResponse]
    total: int
    page: int
    page_size: int


class PMIWorkstreamListResponse(BaseModel):
    """Schema for paginated workstream list."""

    items: List[PMIWorkstreamResponse]
    total: int


class PMISynergyListResponse(BaseModel):
    """Schema for paginated synergy list."""

    items: List[PMISynergyResponse]
    total: int


class PMIRiskListResponse(BaseModel):
    """Schema for paginated risk list."""

    items: List[PMIRiskResponse]
    total: int


class PMIDayOneChecklistListResponse(BaseModel):
    """Schema for paginated Day 1 checklist list."""

    items: List[PMIDayOneChecklistResponse]
    total: int

