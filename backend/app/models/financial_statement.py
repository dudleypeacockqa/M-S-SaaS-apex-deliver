"""
Financial Statement Model - DEV-010: Financial Intelligence Engine
Stores imported financial data from accounting platforms
"""

from datetime import datetime, date
from sqlalchemy import Column, String, DateTime, Date, ForeignKey, Text, Numeric, Integer, JSON
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class FinancialStatement(Base):
    """
    Stores normalized financial statement data imported from external platforms.

    Supports three statement types:
    - Balance Sheet (financial position snapshot)
    - Income Statement (P&L - profitability over time)
    - Cash Flow Statement (cash movements)

    Data is normalized across platforms (Xero, QuickBooks) for consistent ratio calculations.
    """
    __tablename__ = "financial_statements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    connection_id = Column(String(36), ForeignKey("financial_connections.id", ondelete="CASCADE"), nullable=False, index=True)
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)

    # Statement metadata
    statement_type = Column(String(50), nullable=False)  # 'balance_sheet', 'income_statement', 'cash_flow'
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    period_type = Column(String(20), nullable=False, default='monthly')  # monthly, quarterly, annual
    currency = Column(String(3), nullable=False, default='GBP')

    # Balance Sheet line items (all in base currency)
    # Current Assets
    cash_and_equivalents = Column(Numeric(precision=15, scale=2), nullable=True)
    accounts_receivable = Column(Numeric(precision=15, scale=2), nullable=True)
    inventory = Column(Numeric(precision=15, scale=2), nullable=True)
    prepaid_expenses = Column(Numeric(precision=15, scale=2), nullable=True)
    other_current_assets = Column(Numeric(precision=15, scale=2), nullable=True)
    current_assets = Column(Numeric(precision=15, scale=2), nullable=True)

    # Non-Current Assets
    property_plant_equipment = Column(Numeric(precision=15, scale=2), nullable=True)
    intangible_assets = Column(Numeric(precision=15, scale=2), nullable=True)
    goodwill = Column(Numeric(precision=15, scale=2), nullable=True)
    long_term_investments = Column(Numeric(precision=15, scale=2), nullable=True)
    other_non_current_assets = Column(Numeric(precision=15, scale=2), nullable=True)
    fixed_assets = Column(Numeric(precision=15, scale=2), nullable=True)

    total_assets = Column(Numeric(precision=15, scale=2), nullable=True)

    # Current Liabilities
    accounts_payable = Column(Numeric(precision=15, scale=2), nullable=True)
    short_term_debt = Column(Numeric(precision=15, scale=2), nullable=True)
    accrued_expenses = Column(Numeric(precision=15, scale=2), nullable=True)
    deferred_revenue = Column(Numeric(precision=15, scale=2), nullable=True)
    other_current_liabilities = Column(Numeric(precision=15, scale=2), nullable=True)
    current_liabilities = Column(Numeric(precision=15, scale=2), nullable=True)

    # Non-Current Liabilities
    long_term_debt = Column(Numeric(precision=15, scale=2), nullable=True)
    other_non_current_liabilities = Column(Numeric(precision=15, scale=2), nullable=True)
    total_liabilities = Column(Numeric(precision=15, scale=2), nullable=True)

    # Equity
    share_capital = Column(Numeric(precision=15, scale=2), nullable=True)
    retained_earnings = Column(Numeric(precision=15, scale=2), nullable=True)
    other_equity = Column(Numeric(precision=15, scale=2), nullable=True)
    total_equity = Column(Numeric(precision=15, scale=2), nullable=True)

    # Income Statement line items
    revenue = Column(Numeric(precision=15, scale=2), nullable=True)
    cost_of_goods_sold = Column(Numeric(precision=15, scale=2), nullable=True)
    gross_profit = Column(Numeric(precision=15, scale=2), nullable=True)

    # Operating Expenses
    selling_general_admin = Column(Numeric(precision=15, scale=2), nullable=True)
    research_development = Column(Numeric(precision=15, scale=2), nullable=True)
    depreciation_amortization = Column(Numeric(precision=15, scale=2), nullable=True)
    other_operating_expenses = Column(Numeric(precision=15, scale=2), nullable=True)
    total_operating_expenses = Column(Numeric(precision=15, scale=2), nullable=True)

    operating_income = Column(Numeric(precision=15, scale=2), nullable=True)

    # Non-Operating Items
    interest_income = Column(Numeric(precision=15, scale=2), nullable=True)
    interest_expense = Column(Numeric(precision=15, scale=2), nullable=True)
    other_income = Column(Numeric(precision=15, scale=2), nullable=True)
    other_expenses = Column(Numeric(precision=15, scale=2), nullable=True)

    income_before_tax = Column(Numeric(precision=15, scale=2), nullable=True)
    tax_expense = Column(Numeric(precision=15, scale=2), nullable=True)
    net_income = Column(Numeric(precision=15, scale=2), nullable=True)

    # Calculated EBITDA
    ebitda = Column(Numeric(precision=15, scale=2), nullable=True)
    ebit = Column(Numeric(precision=15, scale=2), nullable=True)

    # Cash Flow Statement line items
    operating_cash_flow = Column(Numeric(precision=15, scale=2), nullable=True)
    investing_cash_flow = Column(Numeric(precision=15, scale=2), nullable=True)
    financing_cash_flow = Column(Numeric(precision=15, scale=2), nullable=True)
    capital_expenditures = Column(Numeric(precision=15, scale=2), nullable=True)
    free_cash_flow = Column(Numeric(precision=15, scale=2), nullable=True)
    change_in_cash = Column(Numeric(precision=15, scale=2), nullable=True)

    # Data quality metrics
    data_completeness_score = Column(Numeric(precision=5, scale=2), nullable=True)  # 0-100
    missing_fields = Column(JSON, nullable=True)  # Array of missing field names

    # Raw data from platform (for debugging)
    raw_data = Column(JSON, nullable=True)

    # Audit fields
    imported_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    connection = relationship("FinancialConnection", back_populates="statements")
    ratios = relationship("FinancialRatio", back_populates="statement", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<FinancialStatement(id={self.id}, type={self.statement_type}, period={self.period_end})>"
