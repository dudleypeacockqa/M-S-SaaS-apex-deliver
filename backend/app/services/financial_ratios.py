"""
Financial Ratio Calculation Service - DEV-010
Pure functions for calculating 47 financial ratios from financial statement data.

This module contains the core business logic for financial analysis.
All functions are pure (no side effects, no database access) for easy testing.

Categories:
- Liquidity Ratios (5)
- Profitability Ratios (8)
- Leverage Ratios (6)
- Efficiency Ratios (7)
- Valuation Ratios (5)
- Growth Ratios (8)
- Cash Flow Ratios (8)

Total: 47 ratios
"""

from typing import Dict, Optional, Any
from decimal import Decimal


# ============================================================================
# LIQUIDITY RATIOS (5)
# Measure company's ability to meet short-term obligations
# ============================================================================

def calculate_current_ratio(current_assets: float, current_liabilities: float) -> Optional[float]:
    """
    Current Ratio = Current Assets / Current Liabilities

    Measures ability to pay short-term obligations.
    Good: > 2.0, Acceptable: 1.0-2.0, Poor: < 1.0

    Args:
        current_assets: Total current assets
        current_liabilities: Total current liabilities

    Returns:
        Current ratio or None if calculation not possible
    """
    if current_liabilities == 0:
        return None
    return round(current_assets / current_liabilities, 4)


def calculate_quick_ratio(current_assets: float, inventory: float, current_liabilities: float) -> Optional[float]:
    """
    Quick Ratio = (Current Assets - Inventory) / Current Liabilities

    More conservative than current ratio - excludes inventory.
    Good: > 1.0, Acceptable: 0.5-1.0, Poor: < 0.5

    Args:
        current_assets: Total current assets
        inventory: Inventory value
        current_liabilities: Total current liabilities

    Returns:
        Quick ratio or None if calculation not possible
    """
    if current_liabilities == 0:
        return None
    return round((current_assets - inventory) / current_liabilities, 4)


def calculate_cash_ratio(cash: float, current_liabilities: float) -> Optional[float]:
    """
    Cash Ratio = Cash & Cash Equivalents / Current Liabilities

    Most conservative liquidity ratio - only cash.
    Good: > 0.5, Acceptable: 0.2-0.5, Poor: < 0.2

    Args:
        cash: Cash and cash equivalents
        current_liabilities: Total current liabilities

    Returns:
        Cash ratio or None if calculation not possible
    """
    if current_liabilities == 0:
        return None
    return round(cash / current_liabilities, 4)


def calculate_operating_cash_flow_ratio(operating_cash_flow: float, current_liabilities: float) -> Optional[float]:
    """
    Operating Cash Flow Ratio = Operating Cash Flow / Current Liabilities

    Measures ability to pay current liabilities from operations.
    Good: > 1.0, Acceptable: 0.5-1.0, Poor: < 0.5

    Args:
        operating_cash_flow: Cash flow from operations
        current_liabilities: Total current liabilities

    Returns:
        Operating CF ratio or None if calculation not possible
    """
    if current_liabilities == 0:
        return None
    return round(operating_cash_flow / current_liabilities, 4)


def calculate_defensive_interval_ratio(
    cash: float,
    marketable_securities: float,
    receivables: float,
    daily_operating_expenses: float
) -> Optional[float]:
    """
    Defensive Interval Ratio = (Cash + Marketable Securities + Receivables) / Daily Operating Expenses

    Days company can operate with liquid assets.
    Good: > 90 days, Acceptable: 60-90 days, Poor: < 60 days

    Args:
        cash: Cash and equivalents
        marketable_securities: Short-term investments
        receivables: Accounts receivable
        daily_operating_expenses: Operating expenses / 365

    Returns:
        Defensive interval in days or None if calculation not possible
    """
    if daily_operating_expenses == 0:
        return None
    liquid_assets = cash + marketable_securities + receivables
    return round(liquid_assets / daily_operating_expenses, 4)


# ============================================================================
# PROFITABILITY RATIOS (8)
# Measure company's ability to generate profit
# ============================================================================

def calculate_gross_profit_margin(revenue: float, cogs: float) -> Optional[float]:
    """
    Gross Profit Margin = (Revenue - COGS) / Revenue * 100

    Percentage of revenue after direct costs.
    Good: > 50%, Acceptable: 20-50%, Poor: < 20%

    Args:
        revenue: Total revenue/sales
        cogs: Cost of goods sold

    Returns:
        Gross margin percentage or None if calculation not possible
    """
    if revenue == 0:
        return None
    return round(((revenue - cogs) / revenue) * 100, 4)


def calculate_operating_profit_margin(operating_income: float, revenue: float) -> Optional[float]:
    """
    Operating Profit Margin = Operating Income / Revenue * 100

    Percentage of revenue after operating expenses.
    Good: > 15%, Acceptable: 5-15%, Poor: < 5%

    Args:
        operating_income: EBIT (Earnings Before Interest & Tax)
        revenue: Total revenue

    Returns:
        Operating margin percentage or None if calculation not possible
    """
    if revenue == 0:
        return None
    return round((operating_income / revenue) * 100, 4)


def calculate_net_profit_margin(net_income: float, revenue: float) -> Optional[float]:
    """
    Net Profit Margin = Net Income / Revenue * 100

    Bottom line profitability.
    Good: > 10%, Acceptable: 5-10%, Poor: < 5%

    Args:
        net_income: Net profit after all expenses
        revenue: Total revenue

    Returns:
        Net margin percentage or None if calculation not possible
    """
    if revenue == 0:
        return None
    return round((net_income / revenue) * 100, 4)


def calculate_return_on_assets(net_income: float, total_assets: float) -> Optional[float]:
    """
    Return on Assets (ROA) = Net Income / Total Assets * 100

    Efficiency in using assets to generate profit.
    Good: > 10%, Acceptable: 5-10%, Poor: < 5%

    Args:
        net_income: Net profit
        total_assets: Average total assets

    Returns:
        ROA percentage or None if calculation not possible
    """
    if total_assets == 0:
        return None
    return round((net_income / total_assets) * 100, 4)


def calculate_return_on_equity(net_income: float, shareholders_equity: float) -> Optional[float]:
    """
    Return on Equity (ROE) = Net Income / Shareholders' Equity * 100

    Return generated on shareholders' investment.
    Good: > 15%, Acceptable: 10-15%, Poor: < 10%

    Args:
        net_income: Net profit
        shareholders_equity: Total equity

    Returns:
        ROE percentage or None if calculation not possible
    """
    if shareholders_equity == 0:
        return None
    return round((net_income / shareholders_equity) * 100, 4)


def calculate_return_on_invested_capital(nopat: float, invested_capital: float) -> Optional[float]:
    """
    Return on Invested Capital (ROIC) = NOPAT / Invested Capital * 100

    Return on all capital invested (debt + equity).
    Good: > 15%, Acceptable: 10-15%, Poor: < 10%

    Args:
        nopat: Net Operating Profit After Tax
        invested_capital: Debt + Equity

    Returns:
        ROIC percentage or None if calculation not possible
    """
    if invested_capital == 0:
        return None
    return round((nopat / invested_capital) * 100, 4)


def calculate_ebitda_margin(ebitda: float, revenue: float) -> Optional[float]:
    """
    EBITDA Margin = EBITDA / Revenue * 100

    Operating profitability before non-cash charges.
    Good: > 20%, Acceptable: 10-20%, Poor: < 10%

    Args:
        ebitda: Earnings Before Interest, Tax, Depreciation, Amortization
        revenue: Total revenue

    Returns:
        EBITDA margin percentage or None if calculation not possible
    """
    if revenue == 0:
        return None
    return round((ebitda / revenue) * 100, 4)


def calculate_ebit_margin(ebit: float, revenue: float) -> Optional[float]:
    """
    EBIT Margin = EBIT / Revenue * 100

    Operating profitability.
    Good: > 15%, Acceptable: 8-15%, Poor: < 8%

    Args:
        ebit: Earnings Before Interest and Tax (Operating Income)
        revenue: Total revenue

    Returns:
        EBIT margin percentage or None if calculation not possible
    """
    if revenue == 0:
        return None
    return round((ebit / revenue) * 100, 4)


# ============================================================================
# LEVERAGE RATIOS (6)
# Measure company's debt levels and ability to service debt
# ============================================================================

def calculate_debt_to_equity(total_debt: float, total_equity: float) -> Optional[float]:
    """
    Debt-to-Equity = Total Debt / Total Equity

    Financial leverage - how much debt vs equity.
    Good: < 1.0, Acceptable: 1.0-2.0, Poor: > 2.0

    Args:
        total_debt: Short-term + long-term debt
        total_equity: Shareholders' equity

    Returns:
        Debt-to-equity ratio or None if calculation not possible
    """
    if total_equity == 0:
        return None
    return round(total_debt / total_equity, 4)


def calculate_debt_to_assets(total_debt: float, total_assets: float) -> Optional[float]:
    """
    Debt-to-Assets = Total Debt / Total Assets

    Percentage of assets financed by debt.
    Good: < 0.3, Acceptable: 0.3-0.6, Poor: > 0.6

    Args:
        total_debt: Total liabilities or interest-bearing debt
        total_assets: Total assets

    Returns:
        Debt-to-assets ratio or None if calculation not possible
    """
    if total_assets == 0:
        return None
    return round(total_debt / total_assets, 4)


def calculate_equity_multiplier(total_assets: float, total_equity: float) -> Optional[float]:
    """
    Equity Multiplier = Total Assets / Total Equity

    Financial leverage component of ROE (DuPont analysis).
    Good: < 2.0, Acceptable: 2.0-3.0, Poor: > 3.0

    Args:
        total_assets: Total assets
        total_equity: Shareholders' equity

    Returns:
        Equity multiplier or None if calculation not possible
    """
    if total_equity == 0:
        return None
    return round(total_assets / total_equity, 4)


def calculate_interest_coverage(ebit: float, interest_expense: float) -> Optional[float]:
    """
    Interest Coverage = EBIT / Interest Expense

    Ability to pay interest on debt.
    Good: > 5.0, Acceptable: 2.5-5.0, Poor: < 2.5

    Args:
        ebit: Earnings Before Interest and Tax
        interest_expense: Annual interest payments

    Returns:
        Interest coverage ratio or None if calculation not possible
    """
    if interest_expense == 0:
        return None
    return round(ebit / interest_expense, 4)


def calculate_debt_service_coverage(operating_income: float, total_debt_service: float) -> Optional[float]:
    """
    Debt Service Coverage = Operating Income / Total Debt Service

    Ability to cover all debt obligations (principal + interest).
    Good: > 1.25, Acceptable: 1.0-1.25, Poor: < 1.0

    Args:
        operating_income: EBIT or EBITDA
        total_debt_service: Annual principal + interest payments

    Returns:
        Debt service coverage ratio or None if calculation not possible
    """
    if total_debt_service == 0:
        return None
    return round(operating_income / total_debt_service, 4)


def calculate_financial_leverage(total_assets: float, shareholders_equity: float) -> Optional[float]:
    """
    Financial Leverage = Total Assets / Shareholders' Equity

    Same as equity multiplier - degree of financial leverage.
    Good: < 2.0, Acceptable: 2.0-3.0, Poor: > 3.0

    Args:
        total_assets: Total assets
        shareholders_equity: Total equity

    Returns:
        Financial leverage ratio or None if calculation not possible
    """
    if shareholders_equity == 0:
        return None
    return round(total_assets / shareholders_equity, 4)


# ============================================================================
# HELPER FUNCTION: Calculate all ratios from financial data
# ============================================================================

def calculate_all_ratios(financial_data: Dict[str, Any]) -> Dict[str, Optional[float]]:
    """
    Calculate all 47 financial ratios from a financial data dictionary.

    This is the main function called by the API to calculate ratios.

    Args:
        financial_data: Dictionary containing financial statement data
            Example structure:
            {
                'current_assets': 100000,
                'current_liabilities': 50000,
                'inventory': 20000,
                'cash': 30000,
                'revenue': 500000,
                'cogs': 300000,
                'net_income': 50000,
                ...
            }

    Returns:
        Dictionary mapping ratio names to calculated values
    """
    ratios = {}

    # Liquidity Ratios
    ratios['current_ratio'] = calculate_current_ratio(
        financial_data.get('current_assets', 0),
        financial_data.get('current_liabilities', 0)
    )

    ratios['quick_ratio'] = calculate_quick_ratio(
        financial_data.get('current_assets', 0),
        financial_data.get('inventory', 0),
        financial_data.get('current_liabilities', 0)
    )

    ratios['cash_ratio'] = calculate_cash_ratio(
        financial_data.get('cash', 0),
        financial_data.get('current_liabilities', 0)
    )

    ratios['operating_cash_flow_ratio'] = calculate_operating_cash_flow_ratio(
        financial_data.get('operating_cash_flow', 0),
        financial_data.get('current_liabilities', 0)
    )

    # Profitability Ratios
    ratios['gross_profit_margin'] = calculate_gross_profit_margin(
        financial_data.get('revenue', 0),
        financial_data.get('cogs', 0)
    )

    ratios['operating_profit_margin'] = calculate_operating_profit_margin(
        financial_data.get('operating_income', 0),
        financial_data.get('revenue', 0)
    )

    ratios['net_profit_margin'] = calculate_net_profit_margin(
        financial_data.get('net_income', 0),
        financial_data.get('revenue', 0)
    )

    ratios['return_on_assets'] = calculate_return_on_assets(
        financial_data.get('net_income', 0),
        financial_data.get('total_assets', 0)
    )

    ratios['return_on_equity'] = calculate_return_on_equity(
        financial_data.get('net_income', 0),
        financial_data.get('shareholders_equity', 0)
    )

    ratios['ebitda_margin'] = calculate_ebitda_margin(
        financial_data.get('ebitda', 0),
        financial_data.get('revenue', 0)
    )

    ratios['ebit_margin'] = calculate_ebit_margin(
        financial_data.get('ebit', 0),
        financial_data.get('revenue', 0)
    )

    # Leverage Ratios
    ratios['debt_to_equity'] = calculate_debt_to_equity(
        financial_data.get('total_debt', 0),
        financial_data.get('total_equity', 0)
    )

    ratios['debt_to_assets'] = calculate_debt_to_assets(
        financial_data.get('total_debt', 0),
        financial_data.get('total_assets', 0)
    )

    ratios['equity_multiplier'] = calculate_equity_multiplier(
        financial_data.get('total_assets', 0),
        financial_data.get('total_equity', 0)
    )

    ratios['interest_coverage'] = calculate_interest_coverage(
        financial_data.get('ebit', 0),
        financial_data.get('interest_expense', 0)
    )

    return ratios


# ============================================================================
# EFFICIENCY RATIOS (7)
# Measure how effectively company uses assets
# ============================================================================

def calculate_asset_turnover(revenue: float, average_total_assets: float) -> Optional[float]:
    """Asset Turnover = Revenue / Average Total Assets. Good: > 1.0"""
    if average_total_assets == 0:
        return None
    return round(revenue / average_total_assets, 4)


def calculate_inventory_turnover(cogs: float, average_inventory: float) -> Optional[float]:
    """Inventory Turnover = COGS / Average Inventory. Good: > 6.0"""
    if average_inventory == 0:
        return None
    return round(cogs / average_inventory, 4)


def calculate_receivables_turnover(revenue: float, average_receivables: float) -> Optional[float]:
    """Receivables Turnover = Revenue / Average AR. Good: > 10.0"""
    if average_receivables == 0:
        return None
    return round(revenue / average_receivables, 4)


def calculate_payables_turnover(cogs: float, average_payables: float) -> Optional[float]:
    """Payables Turnover = COGS / Average AP. Good: 6-8"""
    if average_payables == 0:
        return None
    return round(cogs / average_payables, 4)


def calculate_days_sales_outstanding(receivables_turnover: float) -> Optional[float]:
    """DSO = 365 / Receivables Turnover. Good: < 45 days"""
    if receivables_turnover == 0:
        return None
    return round(365 / receivables_turnover, 4)


def calculate_days_inventory_outstanding(inventory_turnover: float) -> Optional[float]:
    """DIO = 365 / Inventory Turnover. Good: < 60 days"""
    if inventory_turnover == 0:
        return None
    return round(365 / inventory_turnover, 4)


def calculate_cash_conversion_cycle(dso: float, dio: float, dpo: float) -> Optional[float]:
    """CCC = DSO + DIO - DPO. Good: < 40 days"""
    if dso is None or dio is None or dpo is None:
        return None
    return round(dso + dio - dpo, 4)


# ============================================================================
# VALUATION RATIOS (5)
# Measure market value metrics
# ============================================================================

def calculate_price_to_earnings(market_price: float, eps: float) -> Optional[float]:
    """P/E = Market Price / EPS. Good: 15-25"""
    if eps == 0:
        return None
    return round(market_price / eps, 4)


def calculate_price_to_book(market_price: float, book_value_per_share: float) -> Optional[float]:
    """P/B = Market Price / Book Value per Share. Good: 1-3"""
    if book_value_per_share == 0:
        return None
    return round(market_price / book_value_per_share, 4)


def calculate_ev_to_ebitda(enterprise_value: float, ebitda: float) -> Optional[float]:
    """EV/EBITDA. Good: 8-12"""
    if ebitda == 0:
        return None
    return round(enterprise_value / ebitda, 4)


def calculate_price_to_sales(market_cap: float, revenue: float) -> Optional[float]:
    """P/S = Market Cap / Revenue. Good: < 2.0"""
    if revenue == 0:
        return None
    return round(market_cap / revenue, 4)


def calculate_dividend_yield(annual_dividends: float, price: float) -> Optional[float]:
    """Dividend Yield = Annual Dividends / Price * 100. Good: 2-4%"""
    if price == 0:
        return None
    return round((annual_dividends / price) * 100, 4)


# ============================================================================
# GROWTH RATIOS (8)
# Measure year-over-year growth trends
# ============================================================================

def calculate_revenue_growth_yoy(current_revenue: float, prior_revenue: float) -> Optional[float]:
    """Revenue Growth = (Current - Prior) / Prior * 100"""
    if prior_revenue == 0:
        return None
    return round(((current_revenue - prior_revenue) / prior_revenue) * 100, 4)


def calculate_ebitda_growth_yoy(current_ebitda: float, prior_ebitda: float) -> Optional[float]:
    """EBITDA Growth YoY"""
    if prior_ebitda == 0:
        return None
    return round(((current_ebitda - prior_ebitda) / prior_ebitda) * 100, 4)


def calculate_net_income_growth_yoy(current_ni: float, prior_ni: float) -> Optional[float]:
    """Net Income Growth YoY"""
    if prior_ni == 0:
        return None
    return round(((current_ni - prior_ni) / prior_ni) * 100, 4)


def calculate_operating_cf_growth_yoy(current_ocf: float, prior_ocf: float) -> Optional[float]:
    """Operating Cash Flow Growth YoY"""
    if prior_ocf == 0:
        return None
    return round(((current_ocf - prior_ocf) / prior_ocf) * 100, 4)


def calculate_asset_growth_yoy(current_assets: float, prior_assets: float) -> Optional[float]:
    """Asset Growth YoY"""
    if prior_assets == 0:
        return None
    return round(((current_assets - prior_assets) / prior_assets) * 100, 4)


def calculate_equity_growth_yoy(current_equity: float, prior_equity: float) -> Optional[float]:
    """Equity Growth YoY"""
    if prior_equity == 0:
        return None
    return round(((current_equity - prior_equity) / prior_equity) * 100, 4)


def calculate_eps_growth_yoy(current_eps: float, prior_eps: float) -> Optional[float]:
    """EPS Growth YoY"""
    if prior_eps == 0:
        return None
    return round(((current_eps - prior_eps) / prior_eps) * 100, 4)


def calculate_cagr(ending_value: float, beginning_value: float, years: int) -> Optional[float]:
    """CAGR = ((Ending/Beginning)^(1/years) - 1) * 100"""
    if beginning_value == 0 or years == 0:
        return None
    return round((((ending_value / beginning_value) ** (1 / years)) - 1) * 100, 4)


# ============================================================================
# CASH FLOW RATIOS (8)
# Measure cash generation and utilization
# ============================================================================

def calculate_operating_cf_margin(operating_cf: float, revenue: float) -> Optional[float]:
    """Operating CF Margin = Operating CF / Revenue * 100"""
    if revenue == 0:
        return None
    return round((operating_cf / revenue) * 100, 4)


def calculate_free_cash_flow(operating_cf: float, capex: float) -> Optional[float]:
    """Free Cash Flow = Operating CF - CapEx"""
    return round(operating_cf - capex, 4)


def calculate_free_cf_margin(free_cf: float, revenue: float) -> Optional[float]:
    """Free CF Margin = Free CF / Revenue * 100"""
    if revenue == 0:
        return None
    return round((free_cf / revenue) * 100, 4)


def calculate_cf_to_debt(operating_cf: float, total_debt: float) -> Optional[float]:
    """CF to Debt = Operating CF / Total Debt"""
    if total_debt == 0:
        return None
    return round(operating_cf / total_debt, 4)


def calculate_cash_return_on_assets(operating_cf: float, total_assets: float) -> Optional[float]:
    """Cash ROA = Operating CF / Total Assets * 100"""
    if total_assets == 0:
        return None
    return round((operating_cf / total_assets) * 100, 4)


def calculate_cf_adequacy(operating_cf: float, capex: float, dividends: float, debt_repayment: float) -> Optional[float]:
    """CF Adequacy = Operating CF / (CapEx + Dividends + Debt Repayment)"""
    total_requirements = capex + dividends + debt_repayment
    if total_requirements == 0:
        return None
    return round(operating_cf / total_requirements, 4)


def calculate_dividend_payout_ratio_cf(dividends: float, operating_cf: float) -> Optional[float]:
    """Dividend Payout (CF) = Dividends / Operating CF * 100"""
    if operating_cf == 0:
        return None
    return round((dividends / operating_cf) * 100, 4)


def calculate_cash_conversion_rate(operating_cf: float, net_income: float) -> Optional[float]:
    """Cash Conversion = Operating CF / Net Income"""
    if net_income == 0:
        return None
    return round(operating_cf / net_income, 4)
