"""PMI (Post-Merger Integration) API endpoints."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.pmi import PMIProjectStatus, PMIRiskSeverity
from app.schemas.pmi import (
    PMIProjectCreate,
    PMIProjectUpdate,
    PMIProjectResponse,
    PMIProjectListResponse,
    PMIWorkstreamCreate,
    PMIWorkstreamUpdate,
    PMIWorkstreamResponse,
    PMIWorkstreamListResponse,
    PMIMilestoneCreate,
    PMIMilestoneUpdate,
    PMIMilestoneResponse,
    PMISynergyCreate,
    PMISynergyUpdate,
    PMISynergyResponse,
    PMISynergyListResponse,
    PMIMetricCreate,
    PMIMetricResponse,
    PMIRiskCreate,
    PMIRiskUpdate,
    PMIRiskResponse,
    PMIRiskListResponse,
    PMIDayOneChecklistCreate,
    PMIDayOneChecklistUpdate,
    PMIDayOneChecklistResponse,
    PMIDayOneChecklistListResponse,
    PMIDashboardResponse,
)
from app.services import pmi_service

router = APIRouter(prefix="/pmi", tags=["pmi"])


# PMI Project Endpoints
@router.post("/projects", response_model=PMIProjectResponse, status_code=status.HTTP_201_CREATED)
def create_pmi_project(
    project: PMIProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new PMI project.

    The project is automatically associated with the current user's organization.
    """
    try:
        created_project = pmi_service.create_pmi_project(project, current_user, db)
        return created_project
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects", response_model=PMIProjectListResponse)
def list_pmi_projects(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[PMIProjectStatus] = Query(None, description="Filter by project status"),
    deal_id: Optional[str] = Query(None, description="Filter by deal ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all PMI projects for the current user's organization.

    Supports pagination and filtering.
    """
    projects, total = pmi_service.list_pmi_projects(
        organization_id=current_user.organization_id,
        db=db,
        page=page,
        per_page=per_page,
        status=status,
        deal_id=deal_id,
    )

    return {
        "items": projects,
        "total": total,
        "page": page,
        "page_size": per_page,
    }


@router.get("/projects/{project_id}", response_model=PMIProjectResponse)
def get_pmi_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get PMI project details by ID."""
    project = pmi_service.get_pmi_project_by_id(project_id, current_user.organization_id, db)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PMI project not found")

    return project


@router.put("/projects/{project_id}", response_model=PMIProjectResponse)
def update_pmi_project(
    project_id: str,
    project_update: PMIProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing PMI project."""
    project = pmi_service.update_pmi_project(
        project_id, project_update, current_user.organization_id, db
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PMI project not found")

    return project


@router.get("/projects/{project_id}/dashboard", response_model=PMIDashboardResponse)
def get_pmi_dashboard(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get aggregated PMI dashboard data."""
    try:
        dashboard = pmi_service.get_pmi_dashboard(project_id, current_user.organization_id, db)
        return dashboard
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/projects/{project_id}/generate-plan", status_code=status.HTTP_201_CREATED)
def generate_100_day_plan(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Auto-generate standard 100-day PMI plan template."""
    try:
        pmi_service.generate_100_day_plan(project_id, current_user.organization_id, db)
        return {"message": "100-day plan generated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# PMI Workstream Endpoints
@router.post("/projects/{project_id}/workstreams", response_model=PMIWorkstreamResponse, status_code=status.HTTP_201_CREATED)
def create_workstream(
    project_id: str,
    workstream: PMIWorkstreamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new workstream for a PMI project."""
    # Override project_id from path
    workstream.project_id = project_id
    try:
        created_workstream = pmi_service.create_workstream(workstream, current_user, db)
        return created_workstream
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/workstreams", response_model=PMIWorkstreamListResponse)
def list_workstreams(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all workstreams for a PMI project."""
    workstreams = pmi_service.list_workstreams(project_id, current_user.organization_id, db)
    return {
        "items": workstreams,
        "total": len(workstreams),
    }


@router.get("/workstreams/{workstream_id}", response_model=PMIWorkstreamResponse)
def get_workstream(
    workstream_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get workstream details by ID."""
    workstream = pmi_service.get_workstream_by_id(workstream_id, current_user.organization_id, db)
    if not workstream:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workstream not found")

    return workstream


@router.put("/workstreams/{workstream_id}", response_model=PMIWorkstreamResponse)
def update_workstream(
    workstream_id: str,
    workstream_update: PMIWorkstreamUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing workstream."""
    workstream = pmi_service.update_workstream(
        workstream_id, workstream_update, current_user.organization_id, db
    )
    if not workstream:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workstream not found")

    return workstream


# PMI Milestone Endpoints
@router.post("/workstreams/{workstream_id}/milestones", response_model=PMIMilestoneResponse, status_code=status.HTTP_201_CREATED)
def create_milestone(
    workstream_id: str,
    milestone: PMIMilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new milestone for a workstream."""
    # Override workstream_id from path
    milestone.workstream_id = workstream_id
    try:
        created_milestone = pmi_service.create_milestone(milestone, current_user, db)
        return created_milestone
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/milestones/{milestone_id}", response_model=PMIMilestoneResponse)
def update_milestone(
    milestone_id: str,
    milestone_update: PMIMilestoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing milestone."""
    milestone = pmi_service.update_milestone(
        milestone_id, milestone_update, current_user.organization_id, db
    )
    if not milestone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Milestone not found")

    return milestone


# PMI Synergy Endpoints
@router.post("/projects/{project_id}/synergies", response_model=PMISynergyResponse, status_code=status.HTTP_201_CREATED)
def create_synergy(
    project_id: str,
    synergy: PMISynergyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new synergy for a PMI project."""
    # Override project_id from path
    synergy.project_id = project_id
    try:
        created_synergy = pmi_service.create_synergy(synergy, current_user, db)
        return created_synergy
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/synergies", response_model=PMISynergyListResponse)
def list_synergies(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all synergies for a PMI project."""
    synergies = pmi_service.list_synergies(project_id, current_user.organization_id, db)
    return {
        "items": synergies,
        "total": len(synergies),
    }


@router.put("/synergies/{synergy_id}", response_model=PMISynergyResponse)
def update_synergy(
    synergy_id: str,
    synergy_update: PMISynergyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing synergy."""
    synergy = pmi_service.update_synergy(
        synergy_id, synergy_update, current_user.organization_id, db
    )
    if not synergy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Synergy not found")

    return synergy


# PMI Metric Endpoints
@router.post("/projects/{project_id}/metrics", response_model=PMIMetricResponse, status_code=status.HTTP_201_CREATED)
def create_metric(
    project_id: str,
    metric: PMIMetricCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new metric for a PMI project."""
    # Override project_id from path
    metric.project_id = project_id
    try:
        created_metric = pmi_service.create_metric(metric, current_user, db)
        return created_metric
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/metrics", response_model=list[PMIMetricResponse])
def list_metrics(
    project_id: str,
    metric_type: Optional[str] = Query(None, description="Filter by metric type"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of metrics to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List metrics for a PMI project."""
    metrics = pmi_service.list_metrics(
        project_id, current_user.organization_id, db, metric_type=metric_type, limit=limit
    )
    return metrics


# PMI Risk Endpoints
@router.post("/projects/{project_id}/risks", response_model=PMIRiskResponse, status_code=status.HTTP_201_CREATED)
def create_risk(
    project_id: str,
    risk: PMIRiskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new risk for a PMI project."""
    # Override project_id from path
    risk.project_id = project_id
    try:
        created_risk = pmi_service.create_risk(risk, current_user, db)
        return created_risk
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/risks", response_model=PMIRiskListResponse)
def list_risks(
    project_id: str,
    workstream_id: Optional[str] = Query(None, description="Filter by workstream ID"),
    severity: Optional[PMIRiskSeverity] = Query(None, description="Filter by severity"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all risks for a PMI project."""
    risks = pmi_service.list_risks(
        project_id, current_user.organization_id, db, workstream_id=workstream_id, severity=severity
    )
    return {
        "items": risks,
        "total": len(risks),
    }


@router.put("/risks/{risk_id}", response_model=PMIRiskResponse)
def update_risk(
    risk_id: str,
    risk_update: PMIRiskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing risk."""
    risk = pmi_service.update_risk(risk_id, risk_update, current_user.organization_id, db)
    if not risk:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Risk not found")

    return risk


# PMI Day One Checklist Endpoints
@router.post("/projects/{project_id}/day-one-checklist", response_model=PMIDayOneChecklistResponse, status_code=status.HTTP_201_CREATED)
def create_day_one_checklist_item(
    project_id: str,
    checklist_item: PMIDayOneChecklistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new Day 1 checklist item for a PMI project."""
    # Override project_id from path
    checklist_item.project_id = project_id
    try:
        created_item = pmi_service.create_day_one_checklist_item(checklist_item, current_user, db)
        return created_item
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/day-one-checklist", response_model=PMIDayOneChecklistListResponse)
def list_day_one_checklist(
    project_id: str,
    category: Optional[str] = Query(None, description="Filter by category"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all Day 1 checklist items for a PMI project."""
    checklist_items = pmi_service.list_day_one_checklist(
        project_id, current_user.organization_id, db, category=category
    )
    return {
        "items": checklist_items,
        "total": len(checklist_items),
    }


@router.put("/day-one-checklist/{item_id}", response_model=PMIDayOneChecklistResponse)
def update_day_one_checklist_item(
    item_id: str,
    checklist_update: PMIDayOneChecklistUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing Day 1 checklist item."""
    item = pmi_service.update_day_one_checklist_item(
        item_id, checklist_update, current_user.organization_id, db
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")

    return item


@router.post("/day-one-checklist/{item_id}/complete", response_model=PMIDayOneChecklistResponse)
def complete_day_one_checklist_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a Day 1 checklist item as complete."""
    from app.models.pmi import PMIDayOneChecklistStatus
    from app.schemas.pmi import PMIDayOneChecklistUpdate

    update = PMIDayOneChecklistUpdate(status=PMIDayOneChecklistStatus.complete)
    item = pmi_service.update_day_one_checklist_item(
        item_id, update, current_user.organization_id, db
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")

    return item

