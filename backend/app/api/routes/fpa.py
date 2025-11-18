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
    ApplyScenarioRequest,
    ChatRequest,
    DashboardMetrics,
    DemandForecast,
    ImportResponse,
    InventoryItem,
    PredefinedScenario,
    ProductionMetric,
    QualityMetric,
    ScenarioCalculationRequest,
    ScenarioCalculationResponse,
    ScenarioMetrics,
    ScenarioVariables,
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


@router.post("/what-if/calculate", response_model=ScenarioCalculationResponse)
async def calculate_scenario_impact(
    request: ScenarioCalculationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Calculate financial impact of scenario variables."""
    await check_fpa_access(current_user)
    
    # Baseline metrics
    baseline_revenue = 10_760_000
    baseline_gross_margin = 67.6
    baseline_ebitda = 2_970_000
    baseline_ebitda_margin = 27.6
    
    # Calculate multipliers
    vars = request.variables
    volume_multiplier = vars.production_volume / 100.0
    price_multiplier = (
        vars.gaba_red_price / 30.0 * 0.4 +
        vars.gaba_black_price / 32.0 * 0.35 +
        vars.gaba_gold_price / 45.0 * 0.25
    )
    cost_multiplier = vars.material_costs / 100.0
    efficiency_multiplier = vars.labor_efficiency / 100.0
    
    # Calculate new metrics
    revenue = baseline_revenue * volume_multiplier * price_multiplier
    cost_of_goods_sold = revenue * 0.324 * cost_multiplier / efficiency_multiplier
    gross_profit = revenue - cost_of_goods_sold
    gross_margin = (gross_profit / revenue) * 100 if revenue > 0 else 0
    operating_expenses = revenue * 0.4 * (1 / efficiency_multiplier)
    ebitda = gross_profit - operating_expenses
    ebitda_margin = (ebitda / revenue) * 100 if revenue > 0 else 0
    
    return ScenarioCalculationResponse(
        metrics=ScenarioMetrics(
            revenue=revenue,
            gross_margin=gross_margin,
            ebitda=ebitda,
            ebitda_margin=ebitda_margin,
        ),
        baseline=ScenarioMetrics(
            revenue=baseline_revenue,
            gross_margin=baseline_gross_margin,
            ebitda=baseline_ebitda,
            ebitda_margin=baseline_ebitda_margin,
        ),
    )


@router.get("/what-if/presets", response_model=List[PredefinedScenario])
async def get_predefined_scenarios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get predefined scenario templates."""
    await check_fpa_access(current_user)
    
    return [
        PredefinedScenario(
            id="aggressive-growth",
            name="Aggressive Growth",
            description="+20% volume, +5% prices",
            variables=ScenarioVariables(
                gaba_red_price=31.5,
                gaba_black_price=33.6,
                gaba_gold_price=47.25,
                production_volume=120.0,
                material_costs=100.0,
                labor_efficiency=100.0,
            ),
            revenue_impact=22.7,
            ebitda_impact=28.1,
        ),
        PredefinedScenario(
            id="cost-optimization",
            name="Cost Optimization",
            description="-8% material costs, +10% efficiency",
            variables=ScenarioVariables(
                gaba_red_price=30.0,
                gaba_black_price=32.0,
                gaba_gold_price=45.0,
                production_volume=100.0,
                material_costs=92.0,
                labor_efficiency=110.0,
            ),
            revenue_impact=0.0,
            ebitda_impact=14.5,
        ),
        PredefinedScenario(
            id="premium-positioning",
            name="Premium Positioning",
            description="+15% prices, -5% volume",
            variables=ScenarioVariables(
                gaba_red_price=34.5,
                gaba_black_price=36.8,
                gaba_gold_price=51.75,
                production_volume=95.0,
                material_costs=100.0,
                labor_efficiency=100.0,
            ),
            revenue_impact=9.7,
            ebitda_impact=21.2,
        ),
        PredefinedScenario(
            id="conservative",
            name="Conservative",
            description="-10% volume, -5% costs",
            variables=ScenarioVariables(
                gaba_red_price=30.0,
                gaba_black_price=32.0,
                gaba_gold_price=45.0,
                production_volume=90.0,
                material_costs=95.0,
                labor_efficiency=95.0,
            ),
            revenue_impact=-9.9,
            ebitda_impact=-5.7,
        ),
    ]


@router.post("/what-if/apply")
async def apply_scenario(
    request: ApplyScenarioRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Apply a predefined scenario and return calculated variables."""
    await check_fpa_access(current_user)
    
    # Get predefined scenarios
    scenarios = await get_predefined_scenarios(current_user, db)
    scenario = next((s for s in scenarios if s.id == request.scenario_id), None)
    
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario {request.scenario_id} not found",
        )
    
    # Calculate impact for the scenario
    calc_request = ScenarioCalculationRequest(variables=scenario.variables)
    result = await calculate_scenario_impact(calc_request, current_user, db)
    
    return {
        "scenario": scenario,
        "metrics": result.metrics,
        "baseline": result.baseline,
    }


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

