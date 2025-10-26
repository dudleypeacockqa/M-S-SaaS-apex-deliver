"""
Tests for Financial Ratio Calculations - DEV-010
Following TDD: Test the pure calculation functions
"""

import pytest
from app.services.financial_ratios import (
    # Liquidity
    calculate_current_ratio,
    calculate_quick_ratio,
    calculate_cash_ratio,
    calculate_operating_cash_flow_ratio,
    calculate_defensive_interval_ratio,
    # Profitability
    calculate_gross_profit_margin,
    calculate_operating_profit_margin,
    calculate_net_profit_margin,
    calculate_return_on_assets,
    calculate_return_on_equity,
    calculate_return_on_invested_capital,
    calculate_ebitda_margin,
    calculate_ebit_margin,
    # Leverage
    calculate_debt_to_equity,
    calculate_debt_to_assets,
    calculate_equity_multiplier,
    calculate_interest_coverage,
    calculate_debt_service_coverage,
    calculate_financial_leverage,
    # Helper
    calculate_all_ratios,
)


# ============================================================================
# LIQUIDITY RATIO TESTS
# ============================================================================

def test_current_ratio_calculation():
    """Test current ratio = current assets / current liabilities"""
    assert calculate_current_ratio(100000, 50000) == 2.0
    assert calculate_current_ratio(75000, 50000) == 1.5
    assert calculate_current_ratio(50000, 100000) == 0.5


def test_current_ratio_with_zero_liabilities():
    """Test current ratio returns None when liabilities are zero"""
    assert calculate_current_ratio(100000, 0) is None


def test_quick_ratio_calculation():
    """Test quick ratio excludes inventory"""
    # Current Assets = 100k, Inventory = 30k, Current Liabilities = 50k
    # (100k - 30k) / 50k = 1.4
    assert calculate_quick_ratio(100000, 30000, 50000) == 1.4


def test_quick_ratio_with_zero_liabilities():
    """Test quick ratio returns None when liabilities are zero"""
    assert calculate_quick_ratio(100000, 30000, 0) is None


def test_cash_ratio_calculation():
    """Test cash ratio = cash / current liabilities"""
    assert calculate_cash_ratio(25000, 50000) == 0.5
    assert calculate_cash_ratio(50000, 50000) == 1.0


def test_operating_cash_flow_ratio_calculation():
    """Test operating CF ratio"""
    assert calculate_operating_cash_flow_ratio(60000, 50000) == 1.2


def test_defensive_interval_ratio_calculation():
    """Test defensive interval in days"""
    # (Cash 30k + Securities 20k + Receivables 40k) / Daily Expense 1k = 90 days
    assert calculate_defensive_interval_ratio(30000, 20000, 40000, 1000) == 90.0


# ============================================================================
# PROFITABILITY RATIO TESTS
# ============================================================================

def test_gross_profit_margin_calculation():
    """Test gross margin percentage"""
    # Revenue 500k, COGS 300k → (500k - 300k) / 500k * 100 = 40%
    assert calculate_gross_profit_margin(500000, 300000) == 40.0


def test_gross_profit_margin_with_zero_revenue():
    """Test gross margin returns None with zero revenue"""
    assert calculate_gross_profit_margin(0, 300000) is None


def test_operating_profit_margin_calculation():
    """Test operating margin percentage"""
    # Operating Income 75k, Revenue 500k → 75k / 500k * 100 = 15%
    assert calculate_operating_profit_margin(75000, 500000) == 15.0


def test_net_profit_margin_calculation():
    """Test net margin percentage"""
    # Net Income 50k, Revenue 500k → 50k / 500k * 100 = 10%
    assert calculate_net_profit_margin(50000, 500000) == 10.0


def test_return_on_assets_calculation():
    """Test ROA percentage"""
    # Net Income 50k, Total Assets 500k → 50k / 500k * 100 = 10%
    assert calculate_return_on_assets(50000, 500000) == 10.0


def test_return_on_equity_calculation():
    """Test ROE percentage"""
    # Net Income 50k, Equity 250k → 50k / 250k * 100 = 20%
    assert calculate_return_on_equity(50000, 250000) == 20.0


def test_return_on_invested_capital_calculation():
    """Test ROIC percentage"""
    # NOPAT 60k, Invested Capital 400k → 60k / 400k * 100 = 15%
    assert calculate_return_on_invested_capital(60000, 400000) == 15.0


def test_ebitda_margin_calculation():
    """Test EBITDA margin percentage"""
    # EBITDA 100k, Revenue 500k → 100k / 500k * 100 = 20%
    assert calculate_ebitda_margin(100000, 500000) == 20.0


def test_ebit_margin_calculation():
    """Test EBIT margin percentage"""
    # EBIT 75k, Revenue 500k → 75k / 500k * 100 = 15%
    assert calculate_ebit_margin(75000, 500000) == 15.0


# ============================================================================
# LEVERAGE RATIO TESTS
# ============================================================================

def test_debt_to_equity_calculation():
    """Test debt-to-equity ratio"""
    # Debt 200k, Equity 250k → 200k / 250k = 0.8
    assert calculate_debt_to_equity(200000, 250000) == 0.8


def test_debt_to_equity_with_zero_equity():
    """Test debt-to-equity returns None with zero equity"""
    assert calculate_debt_to_equity(200000, 0) is None


def test_debt_to_assets_calculation():
    """Test debt-to-assets ratio"""
    # Debt 200k, Assets 500k → 200k / 500k = 0.4
    assert calculate_debt_to_assets(200000, 500000) == 0.4


def test_equity_multiplier_calculation():
    """Test equity multiplier (financial leverage)"""
    # Assets 500k, Equity 250k → 500k / 250k = 2.0
    assert calculate_equity_multiplier(500000, 250000) == 2.0


def test_interest_coverage_calculation():
    """Test interest coverage ratio"""
    # EBIT 75k, Interest 15k → 75k / 15k = 5.0
    assert calculate_interest_coverage(75000, 15000) == 5.0


def test_interest_coverage_with_zero_interest():
    """Test interest coverage returns None with zero interest"""
    assert calculate_interest_coverage(75000, 0) is None


def test_debt_service_coverage_calculation():
    """Test debt service coverage ratio"""
    # Operating Income 100k, Debt Service 80k → 100k / 80k = 1.25
    assert calculate_debt_service_coverage(100000, 80000) == 1.25


def test_financial_leverage_calculation():
    """Test financial leverage ratio (same as equity multiplier)"""
    # Assets 500k, Equity 250k → 500k / 250k = 2.0
    assert calculate_financial_leverage(500000, 250000) == 2.0


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

def test_calculate_all_ratios_comprehensive():
    """Test calculating all ratios from complete financial data"""
    financial_data = {
        # Balance Sheet
        'current_assets': 100000,
        'current_liabilities': 50000,
        'inventory': 20000,
        'cash': 30000,
        'total_assets': 500000,
        'total_debt': 200000,
        'total_equity': 250000,
        'shareholders_equity': 250000,

        # Income Statement
        'revenue': 500000,
        'cogs': 300000,
        'operating_income': 75000,
        'ebit': 75000,
        'ebitda': 100000,
        'net_income': 50000,
        'interest_expense': 15000,

        # Cash Flow
        'operating_cash_flow': 60000,
    }

    ratios = calculate_all_ratios(financial_data)

    # Verify key ratios are calculated
    assert ratios['current_ratio'] == 2.0
    assert ratios['quick_ratio'] == 1.6  # (100k - 20k) / 50k
    assert ratios['cash_ratio'] == 0.6  # 30k / 50k
    assert ratios['operating_cash_flow_ratio'] == 1.2  # 60k / 50k

    assert ratios['gross_profit_margin'] == 40.0  # (500k - 300k) / 500k * 100
    assert ratios['operating_profit_margin'] == 15.0  # 75k / 500k * 100
    assert ratios['net_profit_margin'] == 10.0  # 50k / 500k * 100
    assert ratios['return_on_assets'] == 10.0  # 50k / 500k * 100
    assert ratios['return_on_equity'] == 20.0  # 50k / 250k * 100
    assert ratios['ebitda_margin'] == 20.0  # 100k / 500k * 100
    assert ratios['ebit_margin'] == 15.0  # 75k / 500k * 100

    assert ratios['debt_to_equity'] == 0.8  # 200k / 250k
    assert ratios['debt_to_assets'] == 0.4  # 200k / 500k
    assert ratios['equity_multiplier'] == 2.0  # 500k / 250k
    assert ratios['interest_coverage'] == 5.0  # 75k / 15k


def test_calculate_all_ratios_with_missing_data():
    """Test that missing data returns None for affected ratios"""
    financial_data = {
        'revenue': 500000,
        'cogs': 300000,
        # Missing most other fields
    }

    ratios = calculate_all_ratios(financial_data)

    # These should work with available data
    assert ratios['gross_profit_margin'] == 40.0

    # These should return None due to missing data
    assert ratios['current_ratio'] is None  # Missing liabilities
    assert ratios['return_on_assets'] is None  # Missing assets


def test_calculate_all_ratios_with_empty_data():
    """Test with completely empty data"""
    ratios = calculate_all_ratios({})

    # All ratios should be None when data is missing
    assert ratios['current_ratio'] is None
    assert ratios['gross_profit_margin'] is None
    assert ratios['debt_to_equity'] is None
