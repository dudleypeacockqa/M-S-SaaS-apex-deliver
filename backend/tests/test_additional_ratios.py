"""
Tests for Additional Financial Ratios - DEV-010 Phase 2
Testing 28 new ratios: Efficiency, Valuation, Growth, Cash Flow
"""

import pytest
from app.services.financial_ratios import (
    # Efficiency
    calculate_asset_turnover,
    calculate_inventory_turnover,
    calculate_receivables_turnover,
    calculate_days_sales_outstanding,
    calculate_cash_conversion_cycle,
    # Valuation
    calculate_price_to_earnings,
    calculate_ev_to_ebitda,
    calculate_dividend_yield,
    # Growth
    calculate_revenue_growth_yoy,
    calculate_ebitda_growth_yoy,
    calculate_cagr,
    # Cash Flow
    calculate_operating_cf_margin,
    calculate_free_cash_flow,
    calculate_cf_to_debt,
    calculate_cash_conversion_rate,
)


# EFFICIENCY RATIOS
def test_asset_turnover():
    assert calculate_asset_turnover(500000, 250000) == 2.0
    assert calculate_asset_turnover(100000, 0) is None


def test_inventory_turnover():
    assert calculate_inventory_turnover(300000, 50000) == 6.0


def test_receivables_turnover():
    assert calculate_receivables_turnover(500000, 50000) == 10.0


def test_days_sales_outstanding():
    assert calculate_days_sales_outstanding(10.0) == 36.5  # 365/10


def test_cash_conversion_cycle():
    assert calculate_cash_conversion_cycle(36.5, 60.0, 45.0) == 51.5  # DSO + DIO - DPO


# VALUATION RATIOS
def test_price_to_earnings():
    assert calculate_price_to_earnings(50, 2.5) == 20.0
    assert calculate_price_to_earnings(50, 0) is None


def test_ev_to_ebitda():
    assert calculate_ev_to_ebitda(1000000, 100000) == 10.0


def test_dividend_yield():
    assert calculate_dividend_yield(2, 50) == 4.0  # 2/50 * 100


# GROWTH RATIOS
def test_revenue_growth_yoy():
    assert calculate_revenue_growth_yoy(550000, 500000) == 10.0
    assert calculate_revenue_growth_yoy(100000, 0) is None


def test_ebitda_growth_yoy():
    assert calculate_ebitda_growth_yoy(110000, 100000) == 10.0


def test_cagr():
    assert calculate_cagr(121, 100, 2) == 10.0  # ((121/100)^(1/2) - 1) * 100 ≈ 10%


# CASH FLOW RATIOS
def test_operating_cf_margin():
    assert calculate_operating_cf_margin(60000, 500000) == 12.0


def test_free_cash_flow():
    assert calculate_free_cash_flow(60000, 20000) == 40000.0


def test_cf_to_debt():
    assert calculate_cf_to_debt(60000, 200000) == 0.3


def test_cash_conversion_rate():
    assert calculate_cash_conversion_rate(60000, 50000) == 1.2
    assert calculate_cash_conversion_rate(60000, 0) is None
