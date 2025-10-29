"""
Financial Intelligence Schemas - DEV-010
Pydantic schemas for financial data requests and responses
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class FinancialRatiosResponse(BaseModel):
    """Response schema for calculated financial ratios"""

    deal_id: str = Field(..., description="Deal ID these ratios belong to")
    organization_id: str = Field(..., description="Organization ID")
    period: Optional[str] = Field(None, description="Period identifier (e.g., '2024-Q4')")

    # Liquidity Ratios (5)
    current_ratio: Optional[float] = Field(None, description="Current Assets / Current Liabilities")
    quick_ratio: Optional[float] = Field(None, description="(Current Assets - Inventory) / Current Liabilities")
    cash_ratio: Optional[float] = Field(None, description="Cash / Current Liabilities")
    operating_cash_flow_ratio: Optional[float] = Field(None, description="Operating CF / Current Liabilities")
    defensive_interval_ratio: Optional[float] = Field(None, description="Liquid Assets / Daily Operating Expenses")

    # Profitability Ratios (8)
    gross_profit_margin: Optional[float] = Field(None, description="(Revenue - COGS) / Revenue * 100")
    operating_profit_margin: Optional[float] = Field(None, description="Operating Income / Revenue * 100")
    net_profit_margin: Optional[float] = Field(None, description="Net Income / Revenue * 100")
    return_on_assets: Optional[float] = Field(None, description="Net Income / Total Assets * 100")
    return_on_equity: Optional[float] = Field(None, description="Net Income / Equity * 100")
    return_on_invested_capital: Optional[float] = Field(None, description="NOPAT / Invested Capital * 100")
    ebitda_margin: Optional[float] = Field(None, description="EBITDA / Revenue * 100")
    ebit_margin: Optional[float] = Field(None, description="EBIT / Revenue * 100")

    # Leverage Ratios (6)
    debt_to_equity: Optional[float] = Field(None, description="Total Debt / Total Equity")
    debt_to_assets: Optional[float] = Field(None, description="Total Debt / Total Assets")
    equity_multiplier: Optional[float] = Field(None, description="Total Assets / Total Equity")
    interest_coverage: Optional[float] = Field(None, description="EBIT / Interest Expense")
    debt_service_coverage: Optional[float] = Field(None, description="Operating Income / Debt Service")
    financial_leverage: Optional[float] = Field(None, description="Total Assets / Equity")

    calculated_at: datetime = Field(..., description="When ratios were calculated")
    data_quality: str = Field(default="partial", description="Data completeness: complete, partial, minimal")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "deal_id": "deal-123",
                "organization_id": "org-456",
                "current_ratio": 2.0,
                "quick_ratio": 1.6,
                "gross_profit_margin": 40.0,
                "net_profit_margin": 10.0,
                "return_on_equity": 20.0,
                "debt_to_equity": 0.8,
                "calculated_at": "2025-10-26T12:00:00Z",
                "data_quality": "complete"
            }
        }
    )


class FinancialDataInput(BaseModel):
    """Input schema for financial data to calculate ratios"""

    # Period identifier (optional, for tracking historical calculations)
    period: Optional[str] = Field(None, description="Period identifier (e.g., '2024-Q4', '2024-12')")

    # Balance Sheet
    current_assets: Optional[float] = Field(None, ge=0)
    current_liabilities: Optional[float] = Field(None, ge=0)
    inventory: Optional[float] = Field(None, ge=0)
    cash: Optional[float] = Field(None, ge=0)
    marketable_securities: Optional[float] = Field(None, ge=0)
    receivables: Optional[float] = Field(None, ge=0)
    total_assets: Optional[float] = Field(None, ge=0)
    total_debt: Optional[float] = Field(None, ge=0)
    total_equity: Optional[float] = Field(None, ge=0)
    shareholders_equity: Optional[float] = Field(None, ge=0)

    # Income Statement
    revenue: Optional[float] = Field(None, ge=0)
    cogs: Optional[float] = Field(None, ge=0)
    operating_income: Optional[float] = Field(None)
    ebit: Optional[float] = Field(None)
    ebitda: Optional[float] = Field(None)
    net_income: Optional[float] = Field(None)
    interest_expense: Optional[float] = Field(None, ge=0)

    # Cash Flow Statement
    operating_cash_flow: Optional[float] = Field(None)
    daily_operating_expenses: Optional[float] = Field(None, ge=0)
    total_debt_service: Optional[float] = Field(None, ge=0)

    # Additional (for advanced ratios)
    nopat: Optional[float] = Field(None, description="Net Operating Profit After Tax")
    invested_capital: Optional[float] = Field(None, ge=0)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "current_assets": 100000,
                "current_liabilities": 50000,
                "inventory": 20000,
                "cash": 30000,
                "total_assets": 500000,
                "total_debt": 200000,
                "total_equity": 250000,
                "revenue": 500000,
                "cogs": 300000,
                "operating_income": 75000,
                "ebit": 75000,
                "ebitda": 100000,
                "net_income": 50000,
                "interest_expense": 15000,
                "operating_cash_flow": 60000
            }
        }
    )


class FinancialConnectionResponse(BaseModel):
    """Response schema for financial platform connections"""

    id: str
    deal_id: str
    organization_id: str
    platform: str = Field(..., description="xero or quickbooks")
    platform_organization_name: Optional[str] = None
    connection_status: str = Field(..., description="active, expired, revoked, error")
    last_sync_at: Optional[datetime] = None
    last_sync_status: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FinancialNarrativeResponse(BaseModel):
    """Response schema for AI-generated financial narratives"""

    id: str
    deal_id: str
    organization_id: str
    summary: str = Field(..., description="2-3 paragraph AI analysis")
    strengths: Optional[List[str]] = Field(None, description="Top 3 strengths")
    weaknesses: Optional[List[str]] = Field(None, description="Top 3 weaknesses")
    red_flags: Optional[List[str]] = Field(None, description="Critical issues identified")
    growth_signals: Optional[List[str]] = Field(None, description="Growth indicators")
    readiness_score: Optional[float] = Field(None, ge=0, le=100, description="Deal Readiness Score (0-100)")
    readiness_score_breakdown: Optional[Dict[str, float]] = None
    ai_model: str = Field(..., description="AI model used (e.g., gpt-4)")
    generated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "narrative-789",
                "deal_id": "deal-123",
                "organization_id": "org-456",
                "summary": "The target company demonstrates strong financial health with robust liquidity ratios and healthy profitability margins. However, leverage levels are moderately elevated, requiring careful debt management post-acquisition.",
                "strengths": [
                    "Strong current ratio of 2.0 indicates excellent short-term liquidity",
                    "Healthy gross profit margin of 40% shows pricing power",
                    "Consistent ROE of 20% demonstrates efficient equity utilization"
                ],
                "weaknesses": [
                    "Interest coverage of 5.0x is adequate but not exceptional",
                    "Operating cash flow could be stronger relative to liabilities"
                ],
                "red_flags": [],
                "growth_signals": ["Increasing EBITDA margin", "Strong cash generation"],
                "readiness_score": 78.5,
                "readiness_score_breakdown": {
                    "data_quality": 22.0,
                    "financial_health": 35.0,
                    "growth_trajectory": 14.5,
                    "risk_assessment": 7.0
                },
                "ai_model": "gpt-4",
                "generated_at": "2025-10-26T12:30:00Z"
            }
        }
    )
