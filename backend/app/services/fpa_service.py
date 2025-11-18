"""Business logic helpers for FP&A endpoints.

These helpers deliberately return deterministic placeholder data so that
frontend development and automated tests have a stable contract until
live integrations land.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Dict, List, Optional

from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from app.models.fpa import FpaForecast, FpaReport, FpaScenario
from app.schemas.fpa import (
    AIChatResponse,
    ChatRequest,
    DashboardMetrics,
    DemandForecast,
    DemandForecastCreate,
    InventoryItem,
    ProductionMetric,
    QualityMetric,
    WhatIfScenario,
    WhatIfScenarioCreate,
    WorkingCapitalAnalysis,
    FpaReportResponse,
)


def get_dashboard_metrics() -> DashboardMetrics:
    """Return executive dashboard rollups."""
    return DashboardMetrics(
        total_revenue=2_500_000.0,
        active_orders=1250,
        inventory_value=800_000.0,
        active_customers=850,
        revenue_growth=15.2,
        order_fulfillment=94.8,
        customer_satisfaction=4.7,
        inventory_turnover=8.2,
        working_capital_current=1_900_000.0,
        working_capital_30day=2_150_000.0,
        working_capital_growth=13.5,
    )


def _serialize_forecast(record: FpaForecast) -> DemandForecast:
    """Convert ORM forecast to schema."""
    return DemandForecast(
        id=str(record.id),
        name=record.name,
        period=record.period,
        forecasted_demand=int(record.forecasted_demand or 0),
        actual_demand=int(record.actual_demand) if record.actual_demand is not None else None,
        confidence_level=float(record.confidence_level),
        assumptions=record.assumptions or {},
        created_at=record.created_at,
    )


def _seed_demand_forecasts() -> List[DemandForecast]:
    base = datetime.utcnow()
    return [
        DemandForecast(
            id="forecast-week-01",
            name="Baseline Week 45",
            period="2025-W45",
            forecasted_demand=1200,
            actual_demand=1180,
            confidence_level=0.86,
            assumptions={"channel": "OEM", "notes": "Seasonal adjustment"},
            created_at=base - timedelta(days=10),
        ),
        DemandForecast(
            id="forecast-week-02",
            name="Week 46 Ramp",
            period="2025-W46",
            forecasted_demand=1330,
            confidence_level=0.82,
            assumptions={"channel": "E-Commerce"},
            created_at=base - timedelta(days=3),
        ),
    ]


def get_demand_forecasts(db: Session, organization_id: str) -> List[DemandForecast]:
    """Return persisted forecasts, seeding fallback data when none exist."""
    records = list(
        db.scalars(
            select(FpaForecast)
            .where(FpaForecast.organization_id == organization_id)
            .order_by(desc(FpaForecast.period))
        ).all()
    )
    if not records:
        return _seed_demand_forecasts()
    return [_serialize_forecast(record) for record in records]


def create_demand_forecast(
    db: Session,
    organization_id: str,
    user_id: str,
    payload: DemandForecastCreate,
) -> DemandForecast:
    """Persist a new forecast entry."""
    forecast = FpaForecast(
        organization_id=organization_id,
        name=payload.name,
        period=payload.period,
        forecasted_demand=Decimal(payload.forecasted_demand),
        confidence_level=Decimal(payload.confidence_level),
        assumptions=payload.assumptions or {},
        created_by_user_id=user_id,
    )
    db.add(forecast)
    db.commit()
    db.refresh(forecast)
    return _serialize_forecast(forecast)


def get_inventory_items() -> List[InventoryItem]:
    """Return critical SKUs tracked inside the FP&A workspace."""
    return [
        InventoryItem(
            id="sku-gearbox-1",
            name="Precision Gearbox",
            current_stock=420,
            reorder_point=200,
            unit_cost=480.0,
            category="Assemblies",
        ),
        InventoryItem(
            id="sku-drive-2",
            name="Drive Motor",
            current_stock=180,
            reorder_point=150,
            unit_cost=320.0,
            category="Components",
        ),
    ]


def get_production_metrics() -> List[ProductionMetric]:
    """Return throughput snapshots for recent manufacturing runs."""
    base_date = datetime.utcnow().date()
    metrics: List[ProductionMetric] = []
    for offset, efficiency, downtime, units in [
        (0, 93.2, 1.4, 1200),
        (1, 88.5, 2.6, 980),
        (2, 91.0, 1.9, 1105),
        (3, 86.3, 3.4, 950),
    ]:
        metrics.append(
            ProductionMetric(
                id=f"prod-{offset}",
                date=(base_date - timedelta(days=offset)).isoformat(),
                units_produced=units,
                efficiency=efficiency,
                downtime=downtime,
            )
        )
    return list(reversed(metrics))


def get_quality_metrics() -> List[QualityMetric]:
    """Return QA inspection rollups."""
    base = datetime.utcnow().date()
    return [
        QualityMetric(
            id="qa-1",
            date=(base - timedelta(days=2)).isoformat(),
            defect_rate=0.7,
            pass_rate=99.3,
            total_inspections=420,
        ),
        QualityMetric(
            id="qa-2",
            date=(base - timedelta(days=1)).isoformat(),
            defect_rate=1.1,
            pass_rate=98.9,
            total_inspections=460,
        ),
    ]


def get_working_capital_analysis() -> WorkingCapitalAnalysis:
    """Return working capital components aligned with dashboard values."""
    return WorkingCapitalAnalysis(
        current=1_900_000.0,
        projection_30day=2_150_000.0,
        growth_percentage=13.5,
        dso=45.2,
        dpo=38.5,
        dio=52.3,
    )


def _seed_what_if_scenarios() -> List[WhatIfScenario]:
    base = datetime.utcnow()
    return [
        WhatIfScenario(
            id="scenario-base",
            name="Base Case",
            description="Status quo demand with lean inventory buffers.",
            assumptions={"demand_growth": 0.03, "inventory_days": 48},
            results={"cash_balance": 2_150_000, "ebitda": 520_000},
            metrics={"confidence": 0.72},
            created_at=base - timedelta(days=14),
        ),
        WhatIfScenario(
            id="scenario-expansion",
            name="Expansion",
            description="New OEM contract with phased hiring.",
            assumptions={"demand_growth": 0.12, "opex_delta": 0.05},
            results={"cash_balance": 2_050_000, "ebitda": 610_000},
            metrics={"confidence": 0.81},
            created_at=base - timedelta(days=7),
        ),
    ]


def _serialize_scenario(record: FpaScenario) -> WhatIfScenario:
    return WhatIfScenario(
        id=str(record.id),
        name=record.name,
        description=record.description or "",
        assumptions=record.assumptions or {},
        results=record.metrics or {},
        metrics=record.metrics or {},
        created_at=record.created_at,
    )


def get_what_if_scenarios(db: Session, organization_id: str) -> List[WhatIfScenario]:
    """Return persisted scenarios with seed fallback."""
    rows = list(
        db.scalars(
            select(FpaScenario)
            .where(FpaScenario.organization_id == organization_id)
            .order_by(desc(FpaScenario.created_at))
        ).all()
    )
    if not rows:
        return _seed_what_if_scenarios()
    return [_serialize_scenario(row) for row in rows]


def create_what_if_scenario(
    db: Session,
    organization_id: str,
    user_id: str,
    payload: WhatIfScenarioCreate,
) -> WhatIfScenario:
    scenario = FpaScenario(
        organization_id=organization_id,
        name=payload.name,
        description=payload.description,
        assumptions=payload.assumptions or {},
        metrics=payload.metrics or {},
        created_by_user_id=user_id,
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return _serialize_scenario(scenario)


def respond_to_chat(request: ChatRequest) -> AIChatResponse:
    """Return a lightweight AI response for prototype flows."""
    context_page = request.context.get("current_page", "executive_dashboard") if request.context else "executive_dashboard"
    prompt = request.message.strip()
    summary = (
        "I'm your FP&A assistant. Based on the latest production efficiency and working capital data, "
        "we can review cash runway, demand forecasts, or create scenarios for lenders."
    )
    response = f"{summary} You asked: \"{prompt}\"" if prompt else summary
    return AIChatResponse(response=response, context_used=["fpa_module", context_page])


def generate_report(
    db: Session,
    organization_id: str,
    user_id: str,
    report_type: str,
) -> FpaReportResponse:
    """Persist a lightweight FP&A report composed of latest forecasts and scenarios."""
    forecasts = get_demand_forecasts(db, organization_id)
    scenarios = get_what_if_scenarios(db, organization_id)

    total_demand = sum(f.forecasted_demand for f in forecasts) if forecasts else 0
    avg_confidence = round(
        sum(f.confidence_level for f in forecasts) / len(forecasts),
        2,
    ) if forecasts else 0.0

    payload: Dict[str, Optional[Dict[str, any]]] = {
        "report_type": report_type,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "demand_summary": {
            "periods": [f.period for f in forecasts],
            "total_forecast": total_demand,
            "average_confidence": avg_confidence,
        },
        "top_scenario": scenarios[0].model_dump() if scenarios else None,
    }

    record = FpaReport(
        organization_id=organization_id,
        report_type=report_type,
        payload=payload,
        created_by_user_id=user_id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return FpaReportResponse(
        id=str(record.id),
        report_type=record.report_type,
        payload=record.payload,
        created_at=record.created_at,
    )
