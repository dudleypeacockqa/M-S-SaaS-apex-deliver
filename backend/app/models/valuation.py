"""Valuation models for DEV-011 Multi-Method Valuation Suite.

This module defines the database schema for:
- ValuationModel: Base DCF valuation for a deal
- ValuationScenario: Multiple scenarios (Base, Upside, Downside)
- ComparableCompany: Comparable companies for valuation multiples
- PrecedentTransaction: Historical M&A transactions for precedent analysis
- ValuationExportLog: Audit trail for PDF/Excel exports
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.db.base import Base, GUID


class ValuationModel(Base):
    """DCF valuation model for a deal."""

    __tablename__ = "valuations"

    id = Column(String(36), primary_key=True)
    deal_id = Column(String(36), ForeignKey("deals.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # DCF Inputs
    forecast_years = Column(Integer, default=5, nullable=False)  # Typically 5-10 years
    discount_rate = Column(Float, nullable=False)  # WACC as decimal (e.g., 0.12)
    terminal_growth_rate = Column(Float, nullable=True)  # For Gordon Growth (e.g., 0.03)
    terminal_ebitda_multiple = Column(Float, nullable=True)  # For Exit Multiple (e.g., 8.5)
    terminal_method = Column(String(20), default="gordon_growth", nullable=False)  # 'gordon_growth' or 'exit_multiple'

    # Projected Cash Flows (stored as JSON array)
    cash_flows = Column(JSON, nullable=False)  # [year1, year2, year3, ...]
    terminal_cash_flow = Column(Float, nullable=False)

    # Calculated Results
    enterprise_value = Column(Float, nullable=True)  # Calculated EV
    equity_value = Column(Float, nullable=True)  # EV - Net Debt
    implied_share_price = Column(Float, nullable=True)  # Equity Value / Shares Outstanding

    # Additional Adjustments
    net_debt = Column(Float, default=0.0, nullable=False)  # Total Debt - Cash
    shares_outstanding = Column(Float, nullable=True)  # For per-share calculations

    # Metadata
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    deal = relationship("Deal", back_populates="valuations")
    organization = relationship("Organization")
    scenarios = relationship(
        "ValuationScenario",
        back_populates="valuation",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    comparables = relationship(
        "ComparableCompany",
        back_populates="valuation",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    precedent_transactions = relationship(
        "PrecedentTransaction",
        back_populates="valuation",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    export_logs = relationship(
        "ValuationExportLog",
        back_populates="valuation",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    created_by_user = relationship("User")


class ValuationScenario(Base):
    """Multiple valuation scenarios (Base, Upside, Downside)."""

    __tablename__ = "valuation_scenarios"

    id = Column(String(36), primary_key=True)
    valuation_id = Column(String(36), ForeignKey("valuations.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # Scenario Details
    name = Column(String(50), nullable=False)  # 'Base', 'Upside', 'Downside'
    description = Column(Text, nullable=True)

    # Scenario-specific Overrides (JSON for flexibility)
    assumptions = Column(JSON, nullable=False)  # Overrides for discount_rate, growth_rate, cash_flows, etc.

    # Calculated Results
    enterprise_value = Column(Float, nullable=True)
    equity_value = Column(Float, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    valuation = relationship("ValuationModel", back_populates="scenarios")
    organization = relationship("Organization")


class ComparableCompany(Base):
    """Comparable companies for valuation multiples analysis."""

    __tablename__ = "comparable_companies"

    id = Column(String(36), primary_key=True)
    valuation_id = Column(String(36), ForeignKey("valuations.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # Company Details
    company_name = Column(String(200), nullable=False)
    ticker = Column(String(10), nullable=True)  # Stock ticker if public
    industry = Column(String(100), nullable=True)
    country = Column(String(50), nullable=True)

    # Financial Metrics
    revenue = Column(Float, nullable=True)  # Latest 12 months (LTM)
    ebitda = Column(Float, nullable=True)
    ebit = Column(Float, nullable=True)
    net_income = Column(Float, nullable=True)
    enterprise_value = Column(Float, nullable=True)
    market_cap = Column(Float, nullable=True)

    # Valuation Multiples
    ev_revenue_multiple = Column(Float, nullable=True)  # EV/Revenue
    ev_ebitda_multiple = Column(Float, nullable=True)  # EV/EBITDA
    ev_ebit_multiple = Column(Float, nullable=True)  # EV/EBIT
    pe_multiple = Column(Float, nullable=True)  # P/E ratio

    # Analysis Flags
    is_outlier = Column(String(10), default="false", nullable=False)  # 'true' or 'false'
    weight = Column(Float, default=1.0, nullable=False)  # Weighting for average calculation
    notes = Column(Text, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    valuation = relationship("ValuationModel", back_populates="comparables")
    organization = relationship("Organization")


class PrecedentTransaction(Base):
    """Historical M&A transactions for precedent analysis."""

    __tablename__ = "precedent_transactions"

    id = Column(String(36), primary_key=True)
    valuation_id = Column(String(36), ForeignKey("valuations.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # Transaction Details
    target_company = Column(String(200), nullable=False)
    acquirer_company = Column(String(200), nullable=False)
    announcement_date = Column(DateTime, nullable=True)
    close_date = Column(DateTime, nullable=True)
    deal_value = Column(Float, nullable=True)  # Transaction value

    # Target Financial Metrics (at time of transaction)
    target_revenue = Column(Float, nullable=True)
    target_ebitda = Column(Float, nullable=True)
    target_ebit = Column(Float, nullable=True)

    # Transaction Multiples
    ev_revenue_multiple = Column(Float, nullable=True)
    ev_ebitda_multiple = Column(Float, nullable=True)
    ev_ebit_multiple = Column(Float, nullable=True)

    # Transaction Context
    industry = Column(String(100), nullable=True)
    deal_type = Column(String(50), nullable=True)  # 'strategic', 'financial', 'management_buyout'
    is_public_target = Column(String(10), default="false", nullable=False)  # 'true' or 'false'

    # Analysis
    is_stale = Column(String(10), default="false", nullable=False)  # 'true' if > 36 months old
    weight = Column(Float, default=1.0, nullable=False)
    notes = Column(Text, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    valuation = relationship("ValuationModel", back_populates="precedent_transactions")
    organization = relationship("Organization")


class ValuationExportLog(Base):
    """Audit trail for valuation exports (PDF, Excel)."""

    __tablename__ = "valuation_export_logs"

    id = Column(String(36), primary_key=True)
    valuation_id = Column(String(36), ForeignKey("valuations.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id"), nullable=False)

    # Export Details
    export_type = Column(String(20), nullable=False)  # 'pdf' or 'excel'
    export_format = Column(String(50), nullable=True)  # 'summary', 'detailed', 'full_model'
    file_size_bytes = Column(Integer, nullable=True)
    document_id = Column(GUID, ForeignKey("documents.id"), nullable=True)  # Link to document room
    scenario_id = Column(String(36), ForeignKey("valuation_scenarios.id", ondelete="SET NULL"), nullable=True)
    task_id = Column(String(64), nullable=True, unique=True)
    status = Column(String(20), nullable=False, server_default="queued")
    download_url = Column(String(500), nullable=True)
    error_message = Column(Text, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Metadata
    exported_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    exported_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    valuation = relationship("ValuationModel", back_populates="export_logs")
    organization = relationship("Organization")
    exported_by_user = relationship("User")
    document = relationship("Document")
    scenario = relationship("ValuationScenario")
