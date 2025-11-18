"""Business logic helpers for FP&A endpoints.

These helpers deliberately return deterministic placeholder data so that
frontend development and automated tests have a stable contract until
live integrations land.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List

from app.schemas.fpa import (
    AIChatResponse,
    ChatRequest,
    DashboardMetrics,
    DemandForecast,
    InventoryItem,
    ProductionMetric,
    QualityMetric,
    WhatIfScenario,
    WorkingCapitalAnalysis,
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


def get_demand_forecasts() -> List[DemandForecast]:
    """Return sample demand forecasts for near-term periods."""
    base = datetime.utcnow()
    return [
        DemandForecast(
            id="forecast-week-01",
            period="2025-W45",
            forecasted_demand=1200,
            actual_demand=1180,
            confidence_level=0.86,
            created_at=base - timedelta(days=10),
        ),
        DemandForecast(
            id="forecast-week-02",
            period="2025-W46",
            forecasted_demand=1330,
            confidence_level=0.82,
            created_at=base - timedelta(days=3),
        ),
    ]


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


def get_what_if_scenarios() -> List[WhatIfScenario]:
    """Return example scenarios used during demos."""
    base = datetime.utcnow()
    return [
        WhatIfScenario(
            id="scenario-base",
            name="Base Case",
            description="Status quo demand with lean inventory buffers.",
            assumptions={"demand_growth": 0.03, "inventory_days": 48},
            results={"cash_balance": 2_150_000, "ebitda": 520_000},
            created_at=base - timedelta(days=14),
        ),
        WhatIfScenario(
            id="scenario-expansion",
            name="Expansion",
            description="New OEM contract with phased hiring.",
            assumptions={"demand_growth": 0.12, "opex_delta": 0.05},
            results={"cash_balance": 2_050_000, "ebitda": 610_000},
            created_at=base - timedelta(days=7),
        ),
    ]


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
