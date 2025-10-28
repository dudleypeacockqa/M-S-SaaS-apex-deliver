"""Pydantic schemas for DEV-011 Multi-Method Valuation Suite.

This module defines request/response schemas for valuation endpoints.
"""

from datetime import datetime
from typing import List, Optional, Literal

from pydantic import BaseModel, Field, field_validator


# Valuation Schemas

class ValuationCreate(BaseModel):
    """Request schema for creating a new DCF valuation."""

    forecast_years: int = Field(default=5, ge=1, le=20, description="Number of forecast years (typically 5-10)")
    discount_rate: float = Field(..., gt=0.0, le=1.0, description="WACC as decimal (e.g., 0.12 for 12%)")
    terminal_growth_rate: Optional[float] = Field(None, ge=-0.05, le=0.20, description="Terminal growth rate for Gordon Growth")
    terminal_ebitda_multiple: Optional[float] = Field(None, ge=0.0, le=50.0, description="EBITDA multiple for exit multiple method")
    terminal_method: str = Field(default="gordon_growth", description="Terminal value method: 'gordon_growth' or 'exit_multiple'")
    cash_flows: List[float] = Field(..., description="Projected free cash flows for forecast period")
    terminal_cash_flow: float = Field(..., description="Cash flow in terminal year")
    net_debt: float = Field(default=0.0, description="Total debt minus cash")
    shares_outstanding: Optional[float] = Field(None, gt=0.0, description="Shares outstanding for per-share calculation")

    @field_validator('terminal_method')
    @classmethod
    def validate_terminal_method(cls, v):
        if v not in ['gordon_growth', 'exit_multiple']:
            raise ValueError("terminal_method must be 'gordon_growth' or 'exit_multiple'")
        return v

    @field_validator('cash_flows')
    @classmethod
    def validate_cash_flows(cls, v, info):
        forecast_years = info.data.get('forecast_years', 5)
        if len(v) != forecast_years:
            raise ValueError(f"cash_flows must have exactly {forecast_years} entries")
        return v


class ValuationUpdate(BaseModel):
    """Request schema for updating a valuation."""

    forecast_years: Optional[int] = Field(None, ge=1, le=20)
    discount_rate: Optional[float] = Field(None, gt=0.0, le=1.0)
    terminal_growth_rate: Optional[float] = Field(None, ge=-0.05, le=0.20)
    terminal_ebitda_multiple: Optional[float] = Field(None, ge=0.0, le=50.0)
    terminal_method: Optional[str] = None
    cash_flows: Optional[List[float]] = None
    terminal_cash_flow: Optional[float] = None
    net_debt: Optional[float] = None
    shares_outstanding: Optional[float] = Field(None, gt=0.0)


class ValuationResponse(BaseModel):
    """Response schema for valuation data."""

    id: str
    deal_id: str
    organization_id: str
    forecast_years: int
    discount_rate: float
    terminal_growth_rate: Optional[float]
    terminal_ebitda_multiple: Optional[float]
    terminal_method: str
    cash_flows: List[float]
    terminal_cash_flow: float
    enterprise_value: Optional[float]
    equity_value: Optional[float]
    implied_share_price: Optional[float]
    net_debt: float
    shares_outstanding: Optional[float]
    created_by: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ValuationExportCreate(BaseModel):
    export_type: Literal["pdf", "excel"]
    export_format: Optional[str] = None


class ValuationExportResponse(BaseModel):
    status: str
    task_id: str
    export_type: Literal["pdf", "excel"]
    export_format: Optional[str] = None


# Scenario Schemas

class ScenarioCreate(BaseModel):
    """Request schema for creating a valuation scenario."""

    name: str = Field(..., min_length=1, max_length=50, description="Scenario name (e.g., 'Base', 'Upside', 'Downside')")
    description: Optional[str] = Field(None, description="Scenario description")
    assumptions: dict = Field(..., description="Assumption overrides (discount_rate, growth_rate, cash_flows, etc.)")


class ScenarioResponse(BaseModel):
    """Response schema for scenario data."""

    id: str
    valuation_id: str
    organization_id: str
    name: str
    description: Optional[str]
    assumptions: dict
    enterprise_value: Optional[float]
    equity_value: Optional[float]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Comparable Company Schemas

class ComparableCompanyCreate(BaseModel):
    """Request schema for adding a comparable company."""

    company_name: str = Field(..., min_length=1, max_length=200)
    ticker: Optional[str] = Field(None, max_length=10)
    industry: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=50)
    revenue: Optional[float] = Field(None, gt=0.0)
    ebitda: Optional[float] = None
    ebit: Optional[float] = None
    net_income: Optional[float] = None
    enterprise_value: Optional[float] = Field(None, gt=0.0)
    market_cap: Optional[float] = Field(None, gt=0.0)
    ev_revenue_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebitda_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebit_multiple: Optional[float] = Field(None, ge=0.0)
    pe_multiple: Optional[float] = Field(None, ge=0.0)
    is_outlier: str = Field(default="false", description="'true' or 'false'")
    weight: float = Field(default=1.0, ge=0.0, le=10.0, description="Weighting for average calculation")
    notes: Optional[str] = None

    @field_validator('is_outlier')
    @classmethod
    def validate_is_outlier(cls, v):
        if v not in ['true', 'false']:
            raise ValueError("is_outlier must be 'true' or 'false'")
        return v


class ComparableCompanyUpdate(BaseModel):
    """Request schema for updating a comparable company."""

    company_name: Optional[str] = Field(None, min_length=1, max_length=200)
    ticker: Optional[str] = Field(None, max_length=10)
    industry: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=50)
    revenue: Optional[float] = Field(None, gt=0.0)
    ebitda: Optional[float] = None
    ebit: Optional[float] = None
    net_income: Optional[float] = None
    enterprise_value: Optional[float] = Field(None, gt=0.0)
    market_cap: Optional[float] = Field(None, gt=0.0)
    ev_revenue_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebitda_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebit_multiple: Optional[float] = Field(None, ge=0.0)
    pe_multiple: Optional[float] = Field(None, ge=0.0)
    is_outlier: Optional[str] = None
    weight: Optional[float] = Field(None, ge=0.0, le=10.0)
    notes: Optional[str] = None


class ComparableCompanyResponse(BaseModel):
    """Response schema for comparable company data."""

    id: str
    valuation_id: str
    organization_id: str
    company_name: str
    ticker: Optional[str]
    industry: Optional[str]
    country: Optional[str]
    revenue: Optional[float]
    ebitda: Optional[float]
    ebit: Optional[float]
    net_income: Optional[float]
    enterprise_value: Optional[float]
    market_cap: Optional[float]
    ev_revenue_multiple: Optional[float]
    ev_ebitda_multiple: Optional[float]
    ev_ebit_multiple: Optional[float]
    pe_multiple: Optional[float]
    is_outlier: str
    weight: float
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Precedent Transaction Schemas

class PrecedentTransactionCreate(BaseModel):
    """Request schema for adding a precedent transaction."""

    target_company: str = Field(..., min_length=1, max_length=200)
    acquirer_company: str = Field(..., min_length=1, max_length=200)
    announcement_date: Optional[datetime] = None
    close_date: Optional[datetime] = None
    deal_value: Optional[float] = Field(None, gt=0.0)
    target_revenue: Optional[float] = Field(None, gt=0.0)
    target_ebitda: Optional[float] = None
    target_ebit: Optional[float] = None
    ev_revenue_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebitda_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebit_multiple: Optional[float] = Field(None, ge=0.0)
    industry: Optional[str] = Field(None, max_length=100)
    deal_type: Optional[str] = Field(None, max_length=50)
    is_public_target: str = Field(default="false")
    is_stale: str = Field(default="false")
    weight: float = Field(default=1.0, ge=0.0, le=10.0)
    notes: Optional[str] = None


class PrecedentTransactionUpdate(BaseModel):
    """Request schema for updating a precedent transaction."""

    target_company: Optional[str] = Field(None, min_length=1, max_length=200)
    acquirer_company: Optional[str] = Field(None, min_length=1, max_length=200)
    announcement_date: Optional[datetime] = None
    close_date: Optional[datetime] = None
    deal_value: Optional[float] = Field(None, gt=0.0)
    target_revenue: Optional[float] = Field(None, gt=0.0)
    target_ebitda: Optional[float] = None
    target_ebit: Optional[float] = None
    ev_revenue_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebitda_multiple: Optional[float] = Field(None, ge=0.0)
    ev_ebit_multiple: Optional[float] = Field(None, ge=0.0)
    industry: Optional[str] = Field(None, max_length=100)
    deal_type: Optional[str] = Field(None, max_length=50)
    is_public_target: Optional[str] = None
    is_stale: Optional[str] = None
    weight: Optional[float] = Field(None, ge=0.0, le=10.0)
    notes: Optional[str] = None


class PrecedentTransactionResponse(BaseModel):
    """Response schema for precedent transaction data."""

    id: str
    valuation_id: str
    organization_id: str
    target_company: str
    acquirer_company: str
    announcement_date: Optional[datetime]
    close_date: Optional[datetime]
    deal_value: Optional[float]
    target_revenue: Optional[float]
    target_ebitda: Optional[float]
    target_ebit: Optional[float]
    ev_revenue_multiple: Optional[float]
    ev_ebitda_multiple: Optional[float]
    ev_ebit_multiple: Optional[float]
    industry: Optional[str]
    deal_type: Optional[str]
    is_public_target: str
    is_stale: str
    weight: float
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Multiples Analysis Schemas

class MultiplesAnalysis(BaseModel):
    """Response schema for comparable multiples analysis."""

    metric_name: str = Field(..., description="E.g., 'EV/Revenue', 'EV/EBITDA', 'P/E'")
    count: int = Field(..., description="Number of comparables used")
    min: Optional[float] = Field(None, description="Minimum multiple")
    median: Optional[float] = Field(None, description="Median multiple")
    max: Optional[float] = Field(None, description="Maximum multiple")
    mean: Optional[float] = Field(None, description="Mean (weighted) multiple")
    implied_value: Optional[float] = Field(None, description="Implied valuation for target")


class MultiplesAnalysisResponse(BaseModel):
    """Response schema for full multiples analysis."""

    valuation_id: str
    multiples: List[MultiplesAnalysis]
    implied_enterprise_value_min: Optional[float]
    implied_enterprise_value_median: Optional[float]
    implied_enterprise_value_max: Optional[float]
