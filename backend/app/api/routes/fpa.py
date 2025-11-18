"""FP&A Module API endpoints."""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.fpa import (
    AIChatResponse,
    ChatRequest,
    DashboardMetrics,
    DemandForecast,
    ImportResponse,
    InventoryItem,
    ProductionMetric,
    QualityMetric,
    WhatIfScenario,
    WorkingCapitalAnalysis,
)
from app.services import entitlement_service, fpa_service

router = APIRouter(prefix="/fpa", tags=["fpa"])


async def check_fpa_access(current_user: User) -> None:
    """Check if user has access to FP&A module."""
    # Check if user's organization has FP&A subscription
    has_access = await entitlement_service.check_feature_access(
        organization_id=current_user.organization_id,
        feature="fpa_module",
    )
    
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="FP&A module access requires CapLiquify FP&A subscription or Professional tier and above",
        )


@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get executive dashboard metrics."""
    await check_fpa_access(current_user)
    return fpa_service.get_dashboard_metrics()


@router.get("/demand-forecast", response_model=List[DemandForecast])
async def get_demand_forecasts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get demand forecasts."""
    await check_fpa_access(current_user)
    return fpa_service.get_demand_forecasts()


@router.post("/demand-forecast")
async def create_demand_forecast(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new demand forecast."""
    await check_fpa_access(current_user)
    
    # TODO: Implement demand forecast creation
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not yet implemented")


@router.get("/inventory", response_model=List[InventoryItem])
async def get_inventory_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get inventory items."""
    await check_fpa_access(current_user)
    return fpa_service.get_inventory_items()


@router.get("/production", response_model=List[ProductionMetric])
async def get_production_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get production metrics."""
    await check_fpa_access(current_user)
    return fpa_service.get_production_metrics()


@router.get("/quality", response_model=List[QualityMetric])
async def get_quality_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get quality control metrics."""
    await check_fpa_access(current_user)
    return fpa_service.get_quality_metrics()


@router.get("/working-capital", response_model=WorkingCapitalAnalysis)
async def get_working_capital_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get working capital analysis."""
    await check_fpa_access(current_user)
    return fpa_service.get_working_capital_analysis()


@router.get("/what-if", response_model=List[WhatIfScenario])
async def get_what_if_scenarios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get what-if analysis scenarios."""
    await check_fpa_access(current_user)
    return fpa_service.get_what_if_scenarios()


@router.post("/what-if")
async def create_what_if_scenario(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new what-if scenario."""
    await check_fpa_access(current_user)
    
    # TODO: Implement scenario creation
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not yet implemented")


@router.get("/reports/{report_type}")
async def generate_report(
    report_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a financial report."""
    await check_fpa_access(current_user)
    
    # TODO: Implement report generation
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not yet implemented")


@router.post("/import", response_model=ImportResponse)
async def import_data(
    file: UploadFile = File(...),
    import_type: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Import data from file."""
    await check_fpa_access(current_user)
    
    return {
        "success": True,
        "message": f"Data import for {import_type} is not yet implemented",
    }


@router.post("/ai-chat", response_model=AIChatResponse)
async def ai_chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """AI chatbot endpoint for FP&A module."""
    await check_fpa_access(current_user)
    
    return fpa_service.respond_to_chat(request)

