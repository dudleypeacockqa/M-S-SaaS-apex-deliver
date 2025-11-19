"""Service layer for PMI (Post-Merger Integration) operations."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone, timedelta
from decimal import Decimal
from typing import Optional, List, Tuple

from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import Session

from app.models.pmi import (
    PMIProject,
    PMIWorkstream,
    PMIMilestone,
    PMISynergy,
    PMIMetric,
    PMIRisk,
    PMIDayOneChecklist,
    PMIProjectStatus,
    PMIWorkstreamStatus,
    PMIWorkstreamType,
    PMISynergyStatus,
    PMIRiskSeverity,
    PMIRiskStatus,
    PMIDayOneChecklistStatus,
    PMIDayOneCategory,
    PMIPhase,
)
from app.models.deal import Deal, DealStage
from app.models.user import User
from app.models.task import DealTask
from app.services import task_service
from app.schemas.pmi import (
    PMIProjectCreate,
    PMIProjectUpdate,
    PMIWorkstreamCreate,
    PMIWorkstreamUpdate,
    PMIMilestoneCreate,
    PMIMilestoneUpdate,
    PMISynergyCreate,
    PMISynergyUpdate,
    PMIMetricCreate,
    PMIRiskCreate,
    PMIRiskUpdate,
    PMIDayOneChecklistCreate,
    PMIDayOneChecklistUpdate,
    PMIDashboardResponse,
)


# PMI Project Services
def create_pmi_project(project_data: PMIProjectCreate, user: User, db: Session) -> PMIProject:
    """
    Create a new PMI project.

    Args:
        project_data: PMI project creation data
        user: User creating the project
        db: Database session

    Returns:
        Created PMI project instance
    """
    # Verify deal exists and belongs to organization
    deal = db.scalar(
        select(Deal).where(
            Deal.id == project_data.deal_id,
            Deal.organization_id == user.organization_id,
        )
    )
    if not deal:
        raise ValueError(f"Deal {project_data.deal_id} not found")

    project = PMIProject(
        id=str(uuid.uuid4()),
        name=project_data.name,
        deal_id=project_data.deal_id,
        organization_id=user.organization_id,
        status=project_data.status,
        close_date=project_data.close_date,
        day_one_date=project_data.day_one_date,
        target_completion_date=project_data.target_completion_date,
        description=project_data.description,
        created_by=str(user.id),
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_pmi_project_by_id(project_id: str, organization_id: str, db: Session) -> Optional[PMIProject]:
    """
    Get PMI project by ID (organization-scoped).

    Args:
        project_id: PMI project ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        PMI project instance or None if not found
    """
    return db.scalar(
        select(PMIProject).where(
            PMIProject.id == project_id,
            PMIProject.organization_id == organization_id,
        )
    )


def list_pmi_projects(
    organization_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 20,
    status: Optional[PMIProjectStatus] = None,
    deal_id: Optional[str] = None,
) -> Tuple[List[PMIProject], int]:
    """
    List PMI projects with pagination and filtering.

    Args:
        organization_id: Organization ID for multi-tenant isolation
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        status: Filter by project status
        deal_id: Filter by deal ID

    Returns:
        Tuple of (projects list, total count)
    """
    query = select(PMIProject).where(PMIProject.organization_id == organization_id)

    if status:
        query = query.where(PMIProject.status == status)
    if deal_id:
        query = query.where(PMIProject.deal_id == deal_id)

    # Get total count
    total = db.scalar(select(func.count()).select_from(query.subquery()))

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.order_by(PMIProject.created_at.desc()).offset(offset).limit(per_page)

    projects = list(db.scalars(query).all())
    return projects, total


def update_pmi_project(
    project_id: str,
    project_data: PMIProjectUpdate,
    organization_id: str,
    db: Session,
) -> Optional[PMIProject]:
    """
    Update an existing PMI project.

    Args:
        project_id: PMI project ID
        project_data: Update data
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Updated PMI project instance or None if not found
    """
    project = get_pmi_project_by_id(project_id, organization_id, db)
    if not project:
        return None

    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


# PMI Workstream Services
def create_workstream(workstream_data: PMIWorkstreamCreate, user: User, db: Session) -> PMIWorkstream:
    """Create a new workstream."""
    # Verify project exists and belongs to organization
    project = get_pmi_project_by_id(workstream_data.project_id, user.organization_id, db)
    if not project:
        raise ValueError(f"PMI project {workstream_data.project_id} not found")

    workstream = PMIWorkstream(
        id=str(uuid.uuid4()),
        project_id=workstream_data.project_id,
        organization_id=user.organization_id,
        name=workstream_data.name,
        workstream_type=workstream_data.workstream_type,
        owner_id=workstream_data.owner_id,
        status=workstream_data.status,
        priority=workstream_data.priority,
        phase=workstream_data.phase,
        description=workstream_data.description,
        progress_percentage=workstream_data.progress_percentage,
    )
    db.add(workstream)
    db.commit()
    db.refresh(workstream)
    return workstream


def get_workstream_by_id(workstream_id: str, organization_id: str, db: Session) -> Optional[PMIWorkstream]:
    """Get workstream by ID."""
    return db.scalar(
        select(PMIWorkstream).where(
            PMIWorkstream.id == workstream_id,
            PMIWorkstream.organization_id == organization_id,
        )
    )


def list_workstreams(
    project_id: str,
    organization_id: str,
    db: Session,
) -> List[PMIWorkstream]:
    """List all workstreams for a project."""
    return list(
        db.scalars(
            select(PMIWorkstream)
            .where(
                PMIWorkstream.project_id == project_id,
                PMIWorkstream.organization_id == organization_id,
            )
            .order_by(PMIWorkstream.created_at)
        ).all()
    )


def update_workstream(
    workstream_id: str,
    workstream_data: PMIWorkstreamUpdate,
    organization_id: str,
    db: Session,
) -> Optional[PMIWorkstream]:
    """Update an existing workstream."""
    workstream = get_workstream_by_id(workstream_id, organization_id, db)
    if not workstream:
        return None

    update_data = workstream_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(workstream, field, value)

    db.commit()
    db.refresh(workstream)
    return workstream


# PMI Milestone Services
def create_milestone(milestone_data: PMIMilestoneCreate, user: User, db: Session) -> PMIMilestone:
    """Create a new milestone."""
    # Verify workstream exists and belongs to organization
    workstream = get_workstream_by_id(milestone_data.workstream_id, user.organization_id, db)
    if not workstream:
        raise ValueError(f"Workstream {milestone_data.workstream_id} not found")

    milestone = PMIMilestone(
        id=str(uuid.uuid4()),
        workstream_id=milestone_data.workstream_id,
        organization_id=user.organization_id,
        name=milestone_data.name,
        description=milestone_data.description,
        target_date=milestone_data.target_date,
        status=milestone_data.status,
        dependencies=milestone_data.dependencies,
    )
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone


def update_milestone(
    milestone_id: str,
    milestone_data: PMIMilestoneUpdate,
    organization_id: str,
    db: Session,
) -> Optional[PMIMilestone]:
    """Update an existing milestone."""
    milestone = db.scalar(
        select(PMIMilestone).where(
            PMIMilestone.id == milestone_id,
            PMIMilestone.organization_id == organization_id,
        )
    )
    if not milestone:
        return None

    update_data = milestone_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(milestone, field, value)

    db.commit()
    db.refresh(milestone)
    return milestone


# PMI Synergy Services
def create_synergy(synergy_data: PMISynergyCreate, user: User, db: Session) -> PMISynergy:
    """Create a new synergy."""
    # Verify project exists
    project = get_pmi_project_by_id(synergy_data.project_id, user.organization_id, db)
    if not project:
        raise ValueError(f"PMI project {synergy_data.project_id} not found")

    synergy = PMISynergy(
        id=str(uuid.uuid4()),
        project_id=synergy_data.project_id,
        organization_id=user.organization_id,
        name=synergy_data.name,
        category=synergy_data.category,
        planned_value=synergy_data.planned_value,
        realized_value=synergy_data.realized_value,
        currency=synergy_data.currency,
        target_date=synergy_data.target_date,
        status=synergy_data.status,
        description=synergy_data.description,
    )
    db.add(synergy)
    db.commit()
    db.refresh(synergy)
    return synergy


def list_synergies(project_id: str, organization_id: str, db: Session) -> List[PMISynergy]:
    """List all synergies for a project."""
    return list(
        db.scalars(
            select(PMISynergy)
            .where(
                PMISynergy.project_id == project_id,
                PMISynergy.organization_id == organization_id,
            )
            .order_by(PMISynergy.created_at)
        ).all()
    )


def update_synergy(
    synergy_id: str,
    synergy_data: PMISynergyUpdate,
    organization_id: str,
    db: Session,
) -> Optional[PMISynergy]:
    """Update an existing synergy."""
    synergy = db.scalar(
        select(PMISynergy).where(
            PMISynergy.id == synergy_id,
            PMISynergy.organization_id == organization_id,
        )
    )
    if not synergy:
        return None

    update_data = synergy_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(synergy, field, value)

    db.commit()
    db.refresh(synergy)
    return synergy


def calculate_synergy_realization_rate(project_id: str, organization_id: str, db: Session) -> Decimal:
    """
    Calculate synergy realization rate (SRR).

    SRR = (Cumulative Realized Synergies / Total Projected Synergies) * 100%

    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session

    Returns:
        SRR as Decimal (0-100)
    """
    synergies = list_synergies(project_id, organization_id, db)

    if not synergies:
        return Decimal("0")

    total_planned = sum(s.planned_value for s in synergies)
    total_realized = sum(s.realized_value or Decimal("0") for s in synergies if s.realized_value)

    if total_planned == 0:
        return Decimal("0")

    srr = (total_realized / total_planned) * Decimal("100")
    return min(srr, Decimal("100"))  # Cap at 100%


# PMI Metric Services
def create_metric(metric_data: PMIMetricCreate, user: User, db: Session) -> PMIMetric:
    """Create a new metric."""
    # Verify project exists
    project = get_pmi_project_by_id(metric_data.project_id, user.organization_id, db)
    if not project:
        raise ValueError(f"PMI project {metric_data.project_id} not found")

    metric = PMIMetric(
        id=str(uuid.uuid4()),
        project_id=metric_data.project_id,
        organization_id=user.organization_id,
        metric_type=metric_data.metric_type,
        value=metric_data.value,
        target_value=metric_data.target_value,
        measurement_date=metric_data.measurement_date,
        description=metric_data.description,
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric


def list_metrics(
    project_id: str,
    organization_id: str,
    db: Session,
    metric_type: Optional[str] = None,
    limit: int = 10,
) -> List[PMIMetric]:
    """List metrics for a project."""
    query = select(PMIMetric).where(
        PMIMetric.project_id == project_id,
        PMIMetric.organization_id == organization_id,
    )

    if metric_type:
        query = query.where(PMIMetric.metric_type == metric_type)

    query = query.order_by(PMIMetric.measurement_date.desc()).limit(limit)

    return list(db.scalars(query).all())


# PMI Risk Services
def create_risk(risk_data: PMIRiskCreate, user: User, db: Session) -> PMIRisk:
    """Create a new risk."""
    # Verify project exists
    project = get_pmi_project_by_id(risk_data.project_id, user.organization_id, db)
    if not project:
        raise ValueError(f"PMI project {risk_data.project_id} not found")

    risk = PMIRisk(
        id=str(uuid.uuid4()),
        project_id=risk_data.project_id,
        workstream_id=risk_data.workstream_id,
        organization_id=user.organization_id,
        title=risk_data.title,
        description=risk_data.description,
        severity=risk_data.severity,
        status=risk_data.status,
        mitigation_plan=risk_data.mitigation_plan,
        owner_id=risk_data.owner_id,
        created_by=str(user.id),
    )
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return risk


def list_risks(
    project_id: str,
    organization_id: str,
    db: Session,
    workstream_id: Optional[str] = None,
    severity: Optional[PMIRiskSeverity] = None,
) -> List[PMIRisk]:
    """List risks for a project."""
    query = select(PMIRisk).where(
        PMIRisk.project_id == project_id,
        PMIRisk.organization_id == organization_id,
    )

    if workstream_id:
        query = query.where(PMIRisk.workstream_id == workstream_id)
    if severity:
        query = query.where(PMIRisk.severity == severity)

    return list(db.scalars(query.order_by(PMIRisk.created_at.desc())).all())


def update_risk(
    risk_id: str,
    risk_data: PMIRiskUpdate,
    organization_id: str,
    db: Session,
) -> Optional[PMIRisk]:
    """Update an existing risk."""
    risk = db.scalar(
        select(PMIRisk).where(
            PMIRisk.id == risk_id,
            PMIRisk.organization_id == organization_id,
        )
    )
    if not risk:
        return None

    update_data = risk_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(risk, field, value)

    db.commit()
    db.refresh(risk)
    return risk


# PMI Day One Checklist Services
def create_day_one_checklist_item(
    checklist_data: PMIDayOneChecklistCreate,
    user: User,
    db: Session,
) -> PMIDayOneChecklist:
    """Create a new Day 1 checklist item."""
    # Verify project exists
    project = get_pmi_project_by_id(checklist_data.project_id, user.organization_id, db)
    if not project:
        raise ValueError(f"PMI project {checklist_data.project_id} not found")

    checklist_item = PMIDayOneChecklist(
        id=str(uuid.uuid4()),
        project_id=checklist_data.project_id,
        organization_id=user.organization_id,
        category=checklist_data.category,
        item=checklist_data.item,
        description=checklist_data.description,
        status=checklist_data.status,
        owner_id=checklist_data.owner_id,
        due_date=checklist_data.due_date,
    )
    db.add(checklist_item)
    db.commit()
    db.refresh(checklist_item)
    return checklist_item


def list_day_one_checklist(
    project_id: str,
    organization_id: str,
    db: Session,
    category: Optional[str] = None,
) -> List[PMIDayOneChecklist]:
    """List Day 1 checklist items for a project."""
    query = select(PMIDayOneChecklist).where(
        PMIDayOneChecklist.project_id == project_id,
        PMIDayOneChecklist.organization_id == organization_id,
    )

    if category:
        query = query.where(PMIDayOneChecklist.category == category)

    return list(db.scalars(query.order_by(PMIDayOneChecklist.category, PMIDayOneChecklist.item)).all())


def update_day_one_checklist_item(
    item_id: str,
    checklist_data: PMIDayOneChecklistUpdate,
    organization_id: str,
    db: Session,
) -> Optional[PMIDayOneChecklist]:
    """Update an existing Day 1 checklist item."""
    item = db.scalar(
        select(PMIDayOneChecklist).where(
            PMIDayOneChecklist.id == item_id,
            PMIDayOneChecklist.organization_id == organization_id,
        )
    )
    if not item:
        return None

    update_data = checklist_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    # If status is being set to complete, set completed_at
    if "status" in update_data and update_data["status"] == PMIDayOneChecklistStatus.complete:
        item.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(item)
    return item


# Dashboard Services
def get_pmi_dashboard(project_id: str, organization_id: str, db: Session) -> PMIDashboardResponse:
    """
    Get aggregated PMI dashboard data.

    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session

    Returns:
        Dashboard response with aggregated metrics
    """
    project = get_pmi_project_by_id(project_id, organization_id, db)
    if not project:
        raise ValueError(f"PMI project {project_id} not found")

    # Get workstreams
    workstreams = list_workstreams(project_id, organization_id, db)
    total_workstreams = len(workstreams)
    completed_workstreams = sum(1 for w in workstreams if w.status == PMIWorkstreamStatus.completed)

    # Get synergies
    synergies = list_synergies(project_id, organization_id, db)
    total_synergies = len(synergies)
    realized_synergies = sum(1 for s in synergies if s.status == PMISynergyStatus.realized)
    synergy_realization_rate = calculate_synergy_realization_rate(project_id, organization_id, db)

    # Get risks
    risks = list_risks(project_id, organization_id, db)
    total_risks = len(risks)
    critical_risks = sum(
        1
        for r in risks
        if r.severity == PMIRiskSeverity.critical and r.status == PMIRiskStatus.open
    )
    risk_priority = {
        PMIRiskSeverity.critical: 3,
        PMIRiskSeverity.high: 2,
        PMIRiskSeverity.medium: 1,
        PMIRiskSeverity.low: 0,
    }
    top_risks = sorted(
        risks,
        key=lambda r: (
            r.status == PMIRiskStatus.open,
            risk_priority.get(r.severity, 0),
        ),
        reverse=True,
    )[:5]

    # Get Day 1 checklist
    checklist_items = list_day_one_checklist(project_id, organization_id, db)
    total_checklist_items = len(checklist_items)
    completed_checklist_items = sum(
        1 for item in checklist_items if item.status == PMIDayOneChecklistStatus.complete
    )
    day_one_readiness_percentage = (
        (Decimal(completed_checklist_items) / Decimal(total_checklist_items) * Decimal("100"))
        if total_checklist_items > 0
        else Decimal("0")
    )

    # Calculate current phase and days
    current_phase = None
    days_since_day_one = None
    days_remaining = None

    if project.day_one_date:
        now = datetime.now(timezone.utc)
        days_since_day_one = (now - project.day_one_date).days

        if days_since_day_one <= 30:
            current_phase = PMIPhase.stabilization
            days_remaining = 30 - days_since_day_one
        elif days_since_day_one <= 60:
            current_phase = PMIPhase.integration
            days_remaining = 60 - days_since_day_one
        elif days_since_day_one <= 100:
            current_phase = PMIPhase.optimization
            days_remaining = 100 - days_since_day_one
        else:
            days_remaining = 0

    # Get recent metrics
    recent_metrics = list_metrics(project_id, organization_id, db, limit=5)

    from app.schemas.pmi import (
        PMIProjectResponse,
        PMIWorkstreamResponse,
        PMIMetricResponse,
        PMIRiskResponse,
    )

    return PMIDashboardResponse(
        project_id=project.id,
        project=PMIProjectResponse.model_validate(project),
        total_workstreams=total_workstreams,
        completed_workstreams=completed_workstreams,
        total_synergies=total_synergies,
        realized_synergies=realized_synergies,
        synergy_realization_rate=synergy_realization_rate,
        total_risks=total_risks,
        critical_risks=critical_risks,
        day_one_readiness_percentage=day_one_readiness_percentage,
        current_phase=current_phase,
        days_since_day_one=days_since_day_one,
        days_remaining=days_remaining,
        recent_metrics=[PMIMetricResponse.model_validate(m) for m in recent_metrics],
        workstreams_summary=[PMIWorkstreamResponse.model_validate(w) for w in workstreams],
        top_risks=[PMIRiskResponse.model_validate(r) for r in top_risks],
    )


def generate_100_day_plan(project_id: str, organization_id: str, db: Session) -> None:
    """
    Auto-generate standard 100-day PMI plan template.

    Creates default workstreams, milestones, and Day 1 checklist items.

    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
    """
    project = get_pmi_project_by_id(project_id, organization_id, db)
    if not project:
        raise ValueError(f"PMI project {project_id} not found")

    # Standard workstreams
    workstream_types = [
        (PMIWorkstreamType.it, PMIPhase.stabilization),
        (PMIWorkstreamType.hr, PMIPhase.stabilization),
        (PMIWorkstreamType.finance, PMIPhase.stabilization),
        (PMIWorkstreamType.legal, PMIPhase.stabilization),
        (PMIWorkstreamType.sales, PMIPhase.integration),
        (PMIWorkstreamType.operations, PMIPhase.integration),
        (PMIWorkstreamType.culture, PMIPhase.integration),
    ]

    workstream_names = {
        PMIWorkstreamType.it: "IT Integration",
        PMIWorkstreamType.hr: "HR & Talent",
        PMIWorkstreamType.finance: "Finance & Accounting",
        PMIWorkstreamType.legal: "Legal & Compliance",
        PMIWorkstreamType.sales: "Sales & GTM",
        PMIWorkstreamType.operations: "Operations",
        PMIWorkstreamType.culture: "Cultural Integration",
    }

    for workstream_type, phase in workstream_types:
        workstream = PMIWorkstream(
            id=str(uuid.uuid4()),
            project_id=project_id,
            organization_id=organization_id,
            name=workstream_names[workstream_type],
            workstream_type=workstream_type,
            status=PMIWorkstreamStatus.not_started,
            phase=phase,
            priority="high",
        )
        db.add(workstream)

    # Standard Day 1 checklist items
    day_one_items = [
        (PMIDayOneCategory.it, "Email access configured for all employees"),
        (PMIDayOneCategory.it, "Network login credentials distributed"),
        (PMIDayOneCategory.it, "Core business systems accessible"),
        (PMIDayOneCategory.hr, "Payroll continuity confirmed"),
        (PMIDayOneCategory.hr, "Benefits enrollment information distributed"),
        (PMIDayOneCategory.hr, "Welcome packets delivered"),
        (PMIDayOneCategory.finance, "Bank accounts access established"),
        (PMIDayOneCategory.finance, "Invoice payment process confirmed"),
        (PMIDayOneCategory.legal, "Legal documents signed"),
        (PMIDayOneCategory.legal, "Regulatory filings submitted"),
        (PMIDayOneCategory.communications, "Internal welcome message sent"),
        (PMIDayOneCategory.communications, "External press release issued"),
    ]

    for category, item_text in day_one_items:
        checklist_item = PMIDayOneChecklist(
            id=str(uuid.uuid4()),
            project_id=project_id,
            organization_id=organization_id,
            category=category,
            item=item_text,
            status=PMIDayOneChecklistStatus.not_started,
        )
        db.add(checklist_item)

    db.commit()


# Task Integration Functions
def create_tasks_from_milestone(
    milestone_id: str,
    organization_id: str,
    created_by: str,
    db: Session,
) -> List[DealTask]:
    """
    Create tasks from a PMI milestone.

    Args:
        milestone_id: PMI milestone ID
        organization_id: Organization ID
        created_by: User ID creating the tasks
        db: Database session

    Returns:
        List of created tasks
    """
    milestone = db.scalar(
        select(PMIMilestone).where(
            PMIMilestone.id == milestone_id,
            PMIMilestone.organization_id == organization_id,
        )
    )
    if not milestone:
        raise ValueError(f"Milestone {milestone_id} not found")

    workstream = db.scalar(
        select(PMIWorkstream).where(PMIWorkstream.id == milestone.workstream_id)
    )
    if not workstream:
        raise ValueError(f"Workstream not found for milestone {milestone_id}")

    project = db.scalar(
        select(PMIProject).where(PMIProject.id == workstream.project_id)
    )
    if not project:
        raise ValueError(f"PMI project not found")

    # Create a task for the milestone
    task_payload = {
        "title": f"{milestone.name} - {workstream.name}",
        "description": milestone.description or f"Milestone: {milestone.name}",
        "status": "todo",
        "priority": "high" if workstream.priority == "high" else "normal",
        "stage_gate": f"PMI: {workstream.workstream_type}",
        "due_date": milestone.target_date,
    }

    task = task_service.create_task(
        db=db,
        deal_id=project.deal_id,
        organization_id=organization_id,
        created_by=created_by,
        payload=task_payload,
    )

    return [task]


def update_workstream_progress_from_tasks(
    workstream_id: str,
    organization_id: str,
    db: Session,
) -> None:
    """
    Update workstream progress based on completed tasks.

    Args:
        workstream_id: PMI workstream ID
        organization_id: Organization ID
        db: Database session
    """
    workstream = get_workstream_by_id(workstream_id, organization_id, db)
    if not workstream:
        raise ValueError(f"Workstream {workstream_id} not found")

    project = db.scalar(
        select(PMIProject).where(PMIProject.id == workstream.project_id)
    )
    if not project:
        return

    # Get all tasks for the deal that match this workstream
    tasks, _ = task_service.list_tasks(
        db=db,
        deal_id=project.deal_id,
        organization_id=organization_id,
    )

    # Filter tasks by stage_gate matching workstream
    stage_label = f"PMI: {workstream.workstream_type.value}" if isinstance(workstream.workstream_type, PMIWorkstreamType) else f"PMI: {workstream.workstream_type}"
    workstream_tasks = [
        t
        for t in tasks
        if t.stage_gate and stage_label.lower() in t.stage_gate.lower()
    ]

    if not workstream_tasks:
        return

    # Calculate progress based on completed tasks
    completed_tasks = [t for t in workstream_tasks if t.status == "completed"]
    progress = (len(completed_tasks) / len(workstream_tasks)) * 100 if workstream_tasks else 0

    workstream.progress_percentage = Decimal(str(round(progress, 2)))

    # Update status based on progress
    if progress == 100:
        workstream.status = PMIWorkstreamStatus.completed
    elif progress > 0:
        workstream.status = PMIWorkstreamStatus.in_progress

    db.commit()
    db.refresh(workstream)


def auto_create_pmi_project_for_deal(
    deal_id: str,
    organization_id: str,
    created_by: str,
    db: Session,
) -> Optional[PMIProject]:
    """
    Auto-create PMI project when deal moves to 'won' stage.

    Args:
        deal_id: Deal ID
        organization_id: Organization ID
        created_by: User ID creating the project
        db: Database session

    Returns:
        Created PMI project or None if already exists
    """
    # Check if PMI project already exists for this deal
    existing = db.scalar(
        select(PMIProject).where(
            PMIProject.deal_id == deal_id,
            PMIProject.organization_id == organization_id,
        )
    )
    if existing:
        return None

    deal = db.scalar(
        select(Deal).where(
            Deal.id == deal_id,
            Deal.organization_id == organization_id,
        )
    )
    if not deal or deal.stage != DealStage.won:
        return None

    # Create PMI project
    project = PMIProject(
        id=str(uuid.uuid4()),
        name=f"PMI: {deal.name}",
        deal_id=deal_id,
        organization_id=organization_id,
        status=PMIProjectStatus.planning,
        close_date=datetime.now(timezone.utc),
        day_one_date=datetime.now(timezone.utc) + timedelta(days=1),
        target_completion_date=datetime.now(timezone.utc) + timedelta(days=100),
        description=f"Post-Merger Integration project for {deal.target_company}",
        created_by=created_by,
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Generate 100-day plan
    generate_100_day_plan(project.id, organization_id, db)

    return project

