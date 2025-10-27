"""Valuation service core calculations for DEV-011 Multi-Method Valuation Suite.

This module provides financial valuation functions including:
- Discounted Cash Flow (DCF) present value calculations
- Terminal value calculations (Gordon Growth and Exit Multiple methods)
- Sensitivity analysis matrices
- Complete enterprise value calculations

All calculations use Decimal for precision to avoid floating-point rounding errors
in financial contexts.
"""

from __future__ import annotations

import uuid
from decimal import Decimal, getcontext
from typing import Dict, Iterable, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.valuation import (
    ValuationModel,
    ComparableCompany,
    PrecedentTransaction,
)


# Increase decimal precision to ensure stability for valuation calcs
getcontext().prec = 12


def _calculate_discount_factor(discount_rate: float, year: int) -> Decimal:
    """Calculate discount factor for a given year.

    Args:
        discount_rate: Discount rate as decimal (e.g. 0.12 for 12%).
        year: Year number (1-indexed).

    Returns:
        Discount factor as Decimal.
    """
    return (Decimal(1) + Decimal(discount_rate)) ** year


def calculate_dcf_present_value(cash_flows: Iterable[float], discount_rate: float) -> Decimal:
    """Calculate present value of projected free cash flows using DCF.

    Args:
        cash_flows: Sequence of annual cash flows (year 1 onward).
        discount_rate: Discount rate (WACC) as decimal (e.g. 0.12 for 12%).

    Returns:
        Present value as Decimal.

    Raises:
        ValueError: If discount_rate is not positive.
    """

    if discount_rate <= 0:
        raise ValueError("discount_rate must be positive")

    present_value = Decimal("0")

    for year, cash_flow in enumerate(cash_flows, start=1):
        present_value += Decimal(cash_flow) / _calculate_discount_factor(discount_rate, year)

    return present_value


def calculate_terminal_value_gordon_growth(
    terminal_cash_flow: float,
    discount_rate: float,
    growth_rate: float,
) -> Decimal:
    """Calculate terminal value using Gordon Growth model."""

    if discount_rate <= growth_rate:
        raise ValueError("discount_rate must be greater than growth_rate")

    cash_flow = Decimal(terminal_cash_flow) * (1 + Decimal(growth_rate))
    denominator = Decimal(discount_rate) - Decimal(growth_rate)
    return cash_flow / denominator


def calculate_terminal_value_exit_multiple(
    terminal_ebitda: float,
    exit_multiple: float,
) -> Decimal:
    """Calculate terminal value using exit multiple method.

    Args:
        terminal_ebitda: EBITDA in the terminal year.
        exit_multiple: EV/EBITDA exit multiple to apply.

    Returns:
        Terminal value as Decimal.
    """
    return Decimal(terminal_ebitda) * Decimal(exit_multiple)


def calculate_enterprise_value_dcf(
    cash_flows: List[float],
    terminal_cash_flow: float,
    discount_rate: float,
    terminal_growth_rate: float,
) -> Decimal:
    """Calculate complete DCF enterprise value (PV of cash flows + PV of terminal value).

    This function combines the present value of forecast period cash flows with the
    present value of the terminal value to produce a complete enterprise valuation.

    Args:
        cash_flows: Projected free cash flows for forecast period (typically 5-10 years).
        terminal_cash_flow: Cash flow in terminal year (used for terminal value calculation).
        discount_rate: WACC as decimal (e.g. 0.12 for 12%).
        terminal_growth_rate: Perpetual growth rate for Gordon Growth method (typically 2-4%).

    Returns:
        Enterprise value as Decimal.

    Raises:
        ValueError: If discount_rate is invalid or growth_rate >= discount_rate.
    """
    # Calculate PV of forecast period cash flows
    pv_cash_flows = calculate_dcf_present_value(cash_flows, discount_rate)

    # Calculate terminal value using Gordon Growth
    terminal_value = calculate_terminal_value_gordon_growth(
        terminal_cash_flow,
        discount_rate,
        terminal_growth_rate,
    )

    # Discount terminal value back to present (assuming it occurs after last cash flow)
    years_to_terminal = len(cash_flows)
    pv_terminal_value = terminal_value / _calculate_discount_factor(discount_rate, years_to_terminal)

    # Enterprise value = PV of cash flows + PV of terminal value
    return pv_cash_flows + pv_terminal_value


def generate_sensitivity_matrix(
    base_enterprise_value: Decimal,
    wacc_values: List[float],
    growth_values: List[float],
    terminal_cash_flow: Decimal,
) -> List[List[Decimal]]:
    """Generate sensitivity matrix adjusting WACC and terminal growth.

    Args:
        base_enterprise_value: Base EV from primary scenario.
        wacc_values: Discount rates to test.
        growth_values: Terminal growth rates to test.
        terminal_cash_flow: Final year cash flow used for terminal value.

    Returns:
        Matrix of enterprise values for each (wacc, growth) pair.
    """

    matrix: List[List[Decimal]] = []

    for wacc in wacc_values:
        row: List[Decimal] = []
        for growth in growth_values:
            terminal_value = calculate_terminal_value_gordon_growth(
                float(terminal_cash_flow),
                wacc,
                growth,
            )
            adjusted_value = base_enterprise_value + Decimal(terminal_value) - terminal_cash_flow
            row.append(adjusted_value)
        matrix.append(row)

    return matrix


