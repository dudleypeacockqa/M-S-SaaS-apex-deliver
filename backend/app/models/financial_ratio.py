"""Financial Ratio Model - DEV-010."""
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Numeric
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base
from app.utils.datetime import utc_now

class FinancialRatio(Base):
    """Stores 47 calculated financial ratios."""
    __tablename__ = "financial_ratios"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    statement_id = Column(String(36), ForeignKey("financial_statements.id", ondelete="CASCADE"), nullable=True, index=True)  # Nullable for standalone calculations
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    period = Column(String(20), nullable=True)  # For standalone calculations (e.g., "2024-Q4", "2024-12")
    
    # Liquidity (5)
    current_ratio = Column(Numeric(10, 4), nullable=True)
    quick_ratio = Column(Numeric(10, 4), nullable=True)
    cash_ratio = Column(Numeric(10, 4), nullable=True)
    operating_cash_flow_ratio = Column(Numeric(10, 4), nullable=True)
    defensive_interval_ratio = Column(Numeric(10, 4), nullable=True)
    
    # Profitability (8)
    gross_profit_margin = Column(Numeric(10, 4), nullable=True)
    operating_profit_margin = Column(Numeric(10, 4), nullable=True)
    net_profit_margin = Column(Numeric(10, 4), nullable=True)
    return_on_assets = Column(Numeric(10, 4), nullable=True)
    return_on_equity = Column(Numeric(10, 4), nullable=True)
    return_on_invested_capital = Column(Numeric(10, 4), nullable=True)
    ebitda_margin = Column(Numeric(10, 4), nullable=True)
    ebit_margin = Column(Numeric(10, 4), nullable=True)
    
    # Leverage (6)
    debt_to_equity = Column(Numeric(10, 4), nullable=True)
    debt_to_assets = Column(Numeric(10, 4), nullable=True)
    equity_multiplier = Column(Numeric(10, 4), nullable=True)
    interest_coverage = Column(Numeric(10, 4), nullable=True)
    debt_service_coverage = Column(Numeric(10, 4), nullable=True)
    financial_leverage = Column(Numeric(10, 4), nullable=True)
    
    # Efficiency (7)
    asset_turnover = Column(Numeric(10, 4), nullable=True)
    inventory_turnover = Column(Numeric(10, 4), nullable=True)
    receivables_turnover = Column(Numeric(10, 4), nullable=True)
    payables_turnover = Column(Numeric(10, 4), nullable=True)
    days_sales_outstanding = Column(Numeric(10, 4), nullable=True)
    days_inventory_outstanding = Column(Numeric(10, 4), nullable=True)
    cash_conversion_cycle = Column(Numeric(10, 4), nullable=True)
    
    # Valuation (5)
    price_to_earnings = Column(Numeric(10, 4), nullable=True)
    price_to_book = Column(Numeric(10, 4), nullable=True)
    ev_to_ebitda = Column(Numeric(10, 4), nullable=True)
    price_to_sales = Column(Numeric(10, 4), nullable=True)
    dividend_yield = Column(Numeric(10, 4), nullable=True)
    
    # Growth (8)
    revenue_growth_yoy = Column(Numeric(10, 4), nullable=True)
    ebitda_growth_yoy = Column(Numeric(10, 4), nullable=True)
    net_income_growth_yoy = Column(Numeric(10, 4), nullable=True)
    operating_cash_flow_growth_yoy = Column(Numeric(10, 4), nullable=True)
    asset_growth_yoy = Column(Numeric(10, 4), nullable=True)
    equity_growth_yoy = Column(Numeric(10, 4), nullable=True)
    eps_growth_yoy = Column(Numeric(10, 4), nullable=True)
    cagr_3year = Column(Numeric(10, 4), nullable=True)
    
    # Cash Flow (8)
    operating_cash_flow_margin = Column(Numeric(10, 4), nullable=True)
    free_cash_flow_amount = Column(Numeric(15, 2), nullable=True)
    free_cash_flow_margin = Column(Numeric(10, 4), nullable=True)
    cash_flow_to_debt = Column(Numeric(10, 4), nullable=True)
    cash_return_on_assets = Column(Numeric(10, 4), nullable=True)
    cash_flow_adequacy = Column(Numeric(10, 4), nullable=True)
    dividend_payout_ratio_cf = Column(Numeric(10, 4), nullable=True)
    cash_conversion_rate = Column(Numeric(10, 4), nullable=True)
    
    calculation_notes = Column(Text, nullable=True)
    warnings = Column(Text, nullable=True)
    calculated_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    deal = relationship("Deal", back_populates="financial_ratios")
    statement = relationship("FinancialStatement", back_populates="ratios")
