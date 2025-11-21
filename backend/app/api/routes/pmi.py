"""PMI (Post-Merger Integration) API endpoints."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.pmi import PMIProjectStatus, PMIRiskSeverity
from app.services import entitlement_service
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
from app.services import pmi_ai_service
from app.services import pmi_report_service
from app.services import pmi_dependency_service
from app.services import pmi_notification_service

router = APIRouter(prefix="/pmi", tags=["pmi"])


async def check_pmi_access(current_user: User) -> None:
    """Check if user has access to PMI module."""
    if not current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization context is required for PMI access",
        )

    try:
        has_access = await entitlement_service.check_feature_access(
            organization_id=current_user.organization_id,
            feature="pmi_module",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="PMI module access requires Professional tier and above",
        ) from exc

    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="PMI module access requires Professional tier and above",
        )


# PMI Project Endpoints
@router.post("/projects", response_model=PMIProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_pmi_project(
    project: PMIProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new PMI project.

    The project is automatically associated with the current user's organization.
    """
    await check_pmi_access(current_user)
    try:
        created_project = pmi_service.create_pmi_project(project, current_user, db)
        return created_project
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects", response_model=PMIProjectListResponse)
async def list_pmi_projects(
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
    await check_pmi_access(current_user)
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
async def get_pmi_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get PMI project details by ID."""
    await check_pmi_access(current_user)
    project = pmi_service.get_pmi_project_by_id(project_id, current_user.organization_id, db)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PMI project not found")

    return project


@router.put("/projects/{project_id}", response_model=PMIProjectResponse)
async def update_pmi_project(
    project_id: str,
    project_update: PMIProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing PMI project."""
    await check_pmi_access(current_user)
    project = pmi_service.update_pmi_project(
        project_id, project_update, current_user.organization_id, db
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PMI project not found")

    return project


@router.get("/projects/{project_id}/dashboard", response_model=PMIDashboardResponse)
async def get_pmi_dashboard(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get aggregated PMI dashboard data."""
    await check_pmi_access(current_user)
    try:
        dashboard = pmi_service.get_pmi_dashboard(project_id, current_user.organization_id, db)
        return dashboard
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/projects/{project_id}/generate-plan", status_code=status.HTTP_201_CREATED)
async def generate_100_day_plan(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Auto-generate standard 100-day PMI plan template."""
    await check_pmi_access(current_user)
    try:
        pmi_service.generate_100_day_plan(project_id, current_user.organization_id, db)
        return {"message": "100-day plan generated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# PMI Workstream Endpoints
@router.post("/projects/{project_id}/workstreams", response_model=PMIWorkstreamResponse, status_code=status.HTTP_201_CREATED)
async def create_workstream(
    project_id: str,
    workstream: PMIWorkstreamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new workstream for a PMI project."""
    await check_pmi_access(current_user)
    # Override project_id from path
    workstream.project_id = project_id
    try:
        created_workstream = pmi_service.create_workstream(workstream, current_user, db)
        return created_workstream
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/workstreams", response_model=PMIWorkstreamListResponse)
async def list_workstreams(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all workstreams for a PMI project."""
    await check_pmi_access(current_user)
    workstreams = pmi_service.list_workstreams(project_id, current_user.organization_id, db)
    return {
        "items": workstreams,
        "total": len(workstreams),
    }


@router.get("/workstreams/{workstream_id}", response_model=PMIWorkstreamResponse)
async def get_workstream(
    workstream_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get workstream details by ID."""
    await check_pmi_access(current_user)
    workstream = pmi_service.get_workstream_by_id(workstream_id, current_user.organization_id, db)
    if not workstream:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workstream not found")

    return workstream


@router.put("/workstreams/{workstream_id}", response_model=PMIWorkstreamResponse)
async def update_workstream(
    workstream_id: str,
    workstream_update: PMIWorkstreamUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing workstream."""
    await check_pmi_access(current_user)
    workstream = pmi_service.update_workstream(
        workstream_id, workstream_update, current_user.organization_id, db
    )
    if not workstream:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workstream not found")

    return workstream


# PMI Milestone Endpoints
@router.post("/workstreams/{workstream_id}/milestones", response_model=PMIMilestoneResponse, status_code=status.HTTP_201_CREATED)
async def create_milestone(
    workstream_id: str,
    milestone: PMIMilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new milestone for a workstream."""
    await check_pmi_access(current_user)
    # Override workstream_id from path
    milestone.workstream_id = workstream_id
    try:
        created_milestone = pmi_service.create_milestone(milestone, current_user, db)
        return created_milestone
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/milestones/{milestone_id}", response_model=PMIMilestoneResponse)
async def update_milestone(
    milestone_id: str,
    milestone_update: PMIMilestoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing milestone."""
    await check_pmi_access(current_user)
    milestone = pmi_service.update_milestone(
        milestone_id, milestone_update, current_user.organization_id, db
    )
    if not milestone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Milestone not found")

    return milestone


# PMI Synergy Endpoints
@router.post("/projects/{project_id}/synergies", response_model=PMISynergyResponse, status_code=status.HTTP_201_CREATED)
async def create_synergy(
    project_id: str,
    synergy: PMISynergyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new synergy for a PMI project."""
    await check_pmi_access(current_user)
    # Override project_id from path
    synergy.project_id = project_id
    try:
        created_synergy = pmi_service.create_synergy(synergy, current_user, db)
        return created_synergy
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/synergies", response_model=PMISynergyListResponse)
async def list_synergies(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all synergies for a PMI project."""
    await check_pmi_access(current_user)
    synergies = pmi_service.list_synergies(project_id, current_user.organization_id, db)
    return {
        "items": synergies,
        "total": len(synergies),
    }


@router.put("/synergies/{synergy_id}", response_model=PMISynergyResponse)
async def update_synergy(
    synergy_id: str,
    synergy_update: PMISynergyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing synergy."""
    await check_pmi_access(current_user)
    synergy = pmi_service.update_synergy(
        synergy_id, synergy_update, current_user.organization_id, db
    )
    if not synergy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Synergy not found")

    return synergy


# PMI Metric Endpoints
@router.post("/projects/{project_id}/metrics", response_model=PMIMetricResponse, status_code=status.HTTP_201_CREATED)
async def create_metric(
    project_id: str,
    metric: PMIMetricCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new metric for a PMI project."""
    await check_pmi_access(current_user)
    # Override project_id from path
    metric.project_id = project_id
    try:
        created_metric = pmi_service.create_metric(metric, current_user, db)
        return created_metric
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/metrics", response_model=list[PMIMetricResponse])
async def list_metrics(
    project_id: str,
    metric_type: Optional[str] = Query(None, description="Filter by metric type"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of metrics to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List metrics for a PMI project."""
    await check_pmi_access(current_user)
    metrics = pmi_service.list_metrics(
        project_id, current_user.organization_id, db, metric_type=metric_type, limit=limit
    )
    return metrics


# PMI Risk Endpoints
@router.post("/projects/{project_id}/risks", response_model=PMIRiskResponse, status_code=status.HTTP_201_CREATED)
async def create_risk(
    project_id: str,
    risk: PMIRiskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new risk for a PMI project."""
    await check_pmi_access(current_user)
    # Override project_id from path
    risk.project_id = project_id
    try:
        created_risk = pmi_service.create_risk(risk, current_user, db)
        return created_risk
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/risks", response_model=PMIRiskListResponse)
async def list_risks(
    project_id: str,
    workstream_id: Optional[str] = Query(None, description="Filter by workstream ID"),
    severity: Optional[PMIRiskSeverity] = Query(None, description="Filter by severity"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all risks for a PMI project."""
    await check_pmi_access(current_user)
    risks = pmi_service.list_risks(
        project_id, current_user.organization_id, db, workstream_id=workstream_id, severity=severity
    )
    return {
        "items": risks,
        "total": len(risks),
    }


@router.put("/risks/{risk_id}", response_model=PMIRiskResponse)
async def update_risk(
    risk_id: str,
    risk_update: PMIRiskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing risk."""
    await check_pmi_access(current_user)
    risk = pmi_service.update_risk(risk_id, risk_update, current_user.organization_id, db)
    if not risk:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Risk not found")

    return risk


# PMI Day One Checklist Endpoints
@router.post("/projects/{project_id}/day-one-checklist", response_model=PMIDayOneChecklistResponse, status_code=status.HTTP_201_CREATED)
async def create_day_one_checklist_item(
    project_id: str,
    checklist_item: PMIDayOneChecklistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new Day 1 checklist item for a PMI project."""
    await check_pmi_access(current_user)
    # Override project_id from path
    checklist_item.project_id = project_id
    try:
        created_item = pmi_service.create_day_one_checklist_item(checklist_item, current_user, db)
        return created_item
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/projects/{project_id}/day-one-checklist", response_model=PMIDayOneChecklistListResponse)
async def list_day_one_checklist(
    project_id: str,
    category: Optional[str] = Query(None, description="Filter by category"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all Day 1 checklist items for a PMI project."""
    await check_pmi_access(current_user)
    checklist_items = pmi_service.list_day_one_checklist(
        project_id, current_user.organization_id, db, category=category
    )
    return {
        "items": checklist_items,
        "total": len(checklist_items),
    }


@router.put("/day-one-checklist/{item_id}", response_model=PMIDayOneChecklistResponse)
async def update_day_one_checklist_item(
    item_id: str,
    checklist_update: PMIDayOneChecklistUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an existing Day 1 checklist item."""
    await check_pmi_access(current_user)
    item = pmi_service.update_day_one_checklist_item(
        item_id, checklist_update, current_user.organization_id, db
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")

    return item


@router.post("/day-one-checklist/{item_id}/complete", response_model=PMIDayOneChecklistResponse)
async def complete_day_one_checklist_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a Day 1 checklist item as complete."""
    await check_pmi_access(current_user)
    from app.models.pmi import PMIDayOneChecklistStatus
    from app.schemas.pmi import PMIDayOneChecklistUpdate

    update = PMIDayOneChecklistUpdate(status=PMIDayOneChecklistStatus.complete)
    item = pmi_service.update_day_one_checklist_item(
        item_id, update, current_user.organization_id, db
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")

    return item


# AI-Powered Features Endpoints
@router.post("/projects/{project_id}/risks/ai-identify")
async def ai_identify_risks(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use AI to identify potential risks for a PMI project."""
    await check_pmi_access(current_user)
    try:
        risks = await pmi_ai_service.identify_risks_from_project_data(
            project_id,
            current_user.organization_id,
            db
        )
        return {"risks": risks, "count": len(risks)}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI risk identification failed: {str(e)}"
        )


@router.post("/risks/{risk_id}/ai-mitigation")
async def ai_analyze_risk_mitigation(
    risk_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use AI to analyze risk mitigation strategies."""
    await check_pmi_access(current_user)
    from app.models.pmi import PMIRisk, PMIProject
    
    risk = db.get(PMIRisk, risk_id)
    if not risk or risk.organization_id != current_user.organization_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Risk not found")
    
    project = db.get(PMIProject, risk.project_id)
    project_context = {
        "phase": project.current_phase.value if project and project.current_phase else None,
        "days_into_pmi": (datetime.now(timezone.utc) - project.close_date).days if project and project.close_date else None,
    }
    
    try:
        mitigation = await pmi_ai_service.analyze_risk_mitigation_strategies(
            risk.title,
            risk.description or "",
            risk.severity.value,
            project_context,
        )
        return mitigation
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI mitigation analysis failed: {str(e)}"
        )


@router.post("/projects/{project_id}/risks/ai-predict-escalation")
async def ai_predict_risk_escalation(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use AI to predict which risks may escalate."""
    await check_pmi_access(current_user)
    try:
        predictions = await pmi_ai_service.predict_risk_escalation(
            project_id,
            current_user.organization_id,
            db
        )
        return {"predictions": predictions}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI escalation prediction failed: {str(e)}"
        )


@router.post("/projects/{project_id}/synergies/ai-suggest")
async def ai_suggest_synergies(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use AI to suggest synergy opportunities."""
    await check_pmi_access(current_user)
    try:
        synergies = await pmi_ai_service.suggest_synergy_opportunities(
            project_id,
            current_user.organization_id,
            db
        )
        return {"synergies": synergies, "count": len(synergies)}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI synergy suggestion failed: {str(e)}"
        )


@router.post("/synergies/{synergy_id}/ai-validate")
async def ai_validate_synergy(
    synergy_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use AI to validate synergy feasibility."""
    await check_pmi_access(current_user)
    from app.models.pmi import PMISynergy, PMIProject
    
    synergy = db.get(PMISynergy, synergy_id)
    if not synergy or synergy.organization_id != current_user.organization_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Synergy not found")
    
    project = db.get(PMIProject, synergy.project_id)
    project_context = {
        "phase": project.current_phase.value if project and project.current_phase else None,
        "days_into_pmi": (datetime.now(timezone.utc) - project.close_date).days if project and project.close_date else None,
    }
    
    try:
        validation = await pmi_ai_service.validate_synergy_feasibility(
            synergy.name,
            synergy.category.value,
            float(synergy.planned_value),
            project_context,
        )
        return validation
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI synergy validation failed: {str(e)}"
        )


@router.post("/projects/{project_id}/synergies/ai-optimize-timing")
async def ai_optimize_synergy_timing(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use AI to optimize synergy realization timeline."""
    await check_pmi_access(current_user)
    try:
        optimization = await pmi_ai_service.optimize_synergy_timing(
            project_id,
            current_user.organization_id,
            db
        )
        return optimization
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI timing optimization failed: {str(e)}"
        )


@router.get("/projects/{project_id}/best-practices")
async def get_best_practices(
    project_id: str,
    workstream_type: Optional[str] = Query(None, description="Filter by workstream type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI-generated best practices for the current project phase."""
    await check_pmi_access(current_user)
    project = pmi_service.get_pmi_project_by_id(project_id, current_user.organization_id, db)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="PMI project not found")
    
    phase = project.current_phase.value if project.current_phase else "stabilization"
    
    try:
        best_practices = await pmi_ai_service.generate_best_practices(phase, workstream_type)
        return best_practices
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI best practices generation failed: {str(e)}"
        )


@router.post("/projects/{project_id}/recommendations")
async def get_action_recommendations(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI-generated action recommendations based on current project state."""
    await check_pmi_access(current_user)
    try:
        recommendations = await pmi_ai_service.recommend_actions(
            project_id,
            current_user.organization_id,
            db
        )
        return {"recommendations": recommendations}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI recommendations failed: {str(e)}"
        )


@router.get("/projects/{project_id}/benchmark")
async def benchmark_against_industry(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Compare project metrics against industry benchmarks."""
    await check_pmi_access(current_user)
    try:
        benchmark = await pmi_ai_service.benchmark_against_industry(
            project_id,
            current_user.organization_id,
            db
        )
        return benchmark
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI benchmarking failed: {str(e)}"
        )


# PDF Report Endpoints
@router.post("/projects/{project_id}/reports/status-pdf")
async def generate_status_report(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate comprehensive PMI status report PDF."""
    await check_pmi_access(current_user)
    try:
        result = await pmi_report_service.PMIReportService.generate_status_report_pdf(
            project_id,
            current_user.organization_id,
            db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}"
        )


@router.post("/projects/{project_id}/reports/synergy-pdf")
async def generate_synergy_report(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate synergy realization report PDF."""
    await check_pmi_access(current_user)
    try:
        result = await pmi_report_service.PMIReportService.generate_synergy_report_pdf(
            project_id,
            current_user.organization_id,
            db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}"
        )


@router.post("/projects/{project_id}/reports/risk-pdf")
async def generate_risk_report(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate risk assessment report PDF."""
    await check_pmi_access(current_user)
    try:
        result = await pmi_report_service.PMIReportService.generate_risk_report_pdf(
            project_id,
            current_user.organization_id,
            db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}"
        )


@router.post("/projects/{project_id}/reports/100day-pdf")
async def generate_100day_report(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate 100-day completion report PDF."""
    await check_pmi_access(current_user)
    try:
        result = await pmi_report_service.PMIReportService.generate_100day_report_pdf(
            project_id,
            current_user.organization_id,
            db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}"
        )


# Workstream Dependency Endpoints
@router.post("/projects/{project_id}/workstreams/analyze-dependencies")
async def analyze_workstream_dependencies_endpoint(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Use AI to analyze workstream dependencies."""
    await check_pmi_access(current_user)
    try:
        dependencies = await pmi_dependency_service.analyze_workstream_dependencies(
            project_id,
            current_user.organization_id,
            db
        )
        return {"dependencies": dependencies, "count": len(dependencies)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dependency analysis failed: {str(e)}"
        )


@router.get("/projects/{project_id}/workstreams/dependency-graph")
async def get_dependency_graph(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get workstream dependency graph with optimized sequence."""
    await check_pmi_access(current_user)
    try:
        optimization = await pmi_dependency_service.optimize_workstream_sequence(
            project_id,
            current_user.organization_id,
            db
        )
        return optimization
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dependency graph generation failed: {str(e)}"
        )


# Notification Endpoints
@router.post("/projects/{project_id}/notifications/test")
async def send_test_notification(
    project_id: str,
    notification_type: str = Query(..., description="Type: milestone, risk, synergy, day_one"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a test notification."""
    await check_pmi_access(current_user)
    from sqlalchemy import select
    from app.models.pmi import PMIMilestone
    
    try:
        if notification_type == "milestone":
            workstreams = pmi_service.list_workstreams(project_id, current_user.organization_id, db)
            if workstreams:
                milestones = db.scalars(
                    select(PMIMilestone).where(PMIMilestone.workstream_id == workstreams[0].id)
                ).all()
                if milestones:
                    result = await pmi_notification_service.send_milestone_reminder(
                        milestones[0].id,
                        current_user.organization_id,
                        db,
                        days_until_due=7,
                    )
                    return {"sent": result, "message": "Test milestone reminder sent"}
        elif notification_type == "risk":
            risks = pmi_service.list_risks(project_id, current_user.organization_id, db)
            if risks:
                result = await pmi_notification_service.send_risk_escalation_alert(
                    risks[0].id,
                    current_user.organization_id,
                    db,
                )
                return {"sent": result, "message": "Test risk alert sent"}
        elif notification_type == "day_one":
            result = await pmi_notification_service.send_day_one_warning(
                project_id,
                current_user.organization_id,
                db,
                days_before=1,
            )
            return {"sent": result, "message": "Test Day 1 warning sent"}
        
        return {"sent": False, "message": "No test data available"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Test notification failed: {str(e)}"
        )

