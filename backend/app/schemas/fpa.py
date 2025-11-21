"""Pydantic schemas for FP&A API surfaces."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class DashboardMetrics(BaseModel):
    total_revenue: float
    active_orders: int
    inventory_value: float
    active_customers: int
    revenue_growth: float
    order_fulfillment: float
    customer_satisfaction: float
    inventory_turnover: float
    working_capital_current: float
    working_capital_30day: float
    working_capital_growth: float


class DemandForecast(BaseModel):
    id: str
    name: str
    period: str
    forecasted_demand: int
    actual_demand: Optional[int] = None
    confidence_level: float
    assumptions: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime


class DemandForecastCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    period: str = Field(..., description="ISO week or month label")
    forecasted_demand: int
    confidence_level: float = Field(..., ge=0, le=1)
    assumptions: Dict[str, Any] = Field(default_factory=dict)


class InventoryItem(BaseModel):
    id: str
    name: str
    current_stock: int
    reorder_point: int
    unit_cost: float
    category: str


class ProductionMetric(BaseModel):
    id: str
    date: str
    units_produced: int
    efficiency: float
    downtime: float


class QualityMetric(BaseModel):
    id: str
    date: str
    defect_rate: float
    pass_rate: float
    total_inspections: int


class WorkingCapitalAnalysis(BaseModel):
    current: float
    projection_30day: float
    growth_percentage: float
    dso: float
    dpo: float
    dio: float


class WhatIfScenario(BaseModel):
    id: str
    name: str
    description: str
    assumptions: Dict[str, Any]
    results: Dict[str, Any]
    metrics: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime


class WhatIfScenarioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    assumptions: Dict[str, Any] = Field(default_factory=dict)
    metrics: Dict[str, Any] = Field(default_factory=dict)


class ImportResponse(BaseModel):
    success: bool
    message: str


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = None
    context: Optional[Dict[str, Any]] = None


class AIChatResponse(BaseModel):
    response: str
    context_used: List[str]


class ScenarioVariables(BaseModel):
    gaba_red_price: float = Field(default=30.0, ge=20, le=50)
    gaba_black_price: float = Field(default=32.0, ge=20, le=50)
    gaba_gold_price: float = Field(default=45.0, ge=30, le=70)
    production_volume: float = Field(default=100.0, ge=50, le=150)
    material_costs: float = Field(default=100.0, ge=70, le=130)
    labor_efficiency: float = Field(default=100.0, ge=70, le=130)


class ScenarioCalculationRequest(BaseModel):
    variables: ScenarioVariables


class ScenarioMetrics(BaseModel):
    revenue: float
    gross_margin: float
    ebitda: float
    ebitda_margin: float


class ScenarioCalculationResponse(BaseModel):
    metrics: ScenarioMetrics
    baseline: Optional[ScenarioMetrics] = None


class PredefinedScenario(BaseModel):
    id: str
    name: str
    description: str
    variables: ScenarioVariables
    revenue_impact: float
    ebitda_impact: float


class ApplyScenarioRequest(BaseModel):
    scenario_id: str


class FpaReportResponse(BaseModel):
    id: str
    report_type: str
    payload: Dict[str, Any]
    created_at: datetime
