"""RED phase tests for DEV-011 valuation service.

These tests intentionally fail until the valuation service implementation is
completed. They encode the expected behaviour of core DCF and sensitivity
calculations to drive TDD.
"""

from decimal import Decimal
from typing import List

import pytest

from app.services import valuation_service


class TestDiscountedCashFlowCalculations:
    def test_calculate_present_value_of_cash_flows(self):
        cash_flows: List[float] = [500000, 650000, 800000, 950000, 1100000]
        discount_rate = 0.12

        present_value = valuation_service.calculate_dcf_present_value(
            cash_flows,
            discount_rate,
        )

        # Expected PV calculated from reference financial model (rounded to nearest pound)
        assert round(present_value) == 2761941


class TestTerminalValue:
    def test_gordon_growth_terminal_value(self):
        terminal_cash_flow = 1200000
        discount_rate = 0.12
        growth_rate = 0.03

        terminal_value = valuation_service.calculate_terminal_value_gordon_growth(
            terminal_cash_flow,
            discount_rate,
            growth_rate,
        )

        assert round(terminal_value) == 13733333


class TestSensitivityMatrix:
    def test_generate_sensitivity_matrix_dimensions_and_monotonicity(self):
        base_enterprise_value = Decimal("25000000")
        wacc_values = [0.1, 0.12, 0.14]
        growth_values = [0.01, 0.02, 0.03, 0.04]

        matrix = valuation_service.generate_sensitivity_matrix(
            base_enterprise_value=base_enterprise_value,
            wacc_values=wacc_values,
            growth_values=growth_values,
            terminal_cash_flow=Decimal("1500000"),
        )

        assert len(matrix) == len(wacc_values)
        assert all(len(row) == len(growth_values) for row in matrix)
        assert matrix[0][3] > matrix[2][1]


class TestExitMultipleTerminalValue:
    def test_calculate_terminal_value_exit_multiple(self):
        """Test terminal value calculation using exit multiple method."""
        terminal_ebitda = 1500000
        exit_multiple = 8.5

        terminal_value = valuation_service.calculate_terminal_value_exit_multiple(
            terminal_ebitda,
            exit_multiple,
        )

        assert terminal_value == Decimal("12750000")


class TestFullDCFValuation:
    def test_complete_dcf_enterprise_value(self):
        """Test complete DCF valuation with terminal value."""
        cash_flows = [500000, 650000, 800000, 950000, 1100000]
        terminal_cash_flow = 1200000
        discount_rate = 0.12
        terminal_growth_rate = 0.03

        ev = valuation_service.calculate_enterprise_value_dcf(
            cash_flows=cash_flows,
            terminal_cash_flow=terminal_cash_flow,
            discount_rate=discount_rate,
            terminal_growth_rate=terminal_growth_rate,
        )

        # PV of cash flows + PV of terminal value
        # Expected: ~2,761,941 + (13,733,333 / 1.12^5) ≈ ~10,552,000
        assert 10_500_000 < ev < 10_600_000

    def test_dcf_with_zero_cash_flows(self):
        """Test DCF handles zero cash flows gracefully."""
        cash_flows = [0, 0, 100000, 200000, 300000]
        terminal_cash_flow = 350000
        discount_rate = 0.10
        terminal_growth_rate = 0.02

        ev = valuation_service.calculate_enterprise_value_dcf(
            cash_flows=cash_flows,
            terminal_cash_flow=terminal_cash_flow,
            discount_rate=discount_rate,
            terminal_growth_rate=terminal_growth_rate,
        )

        assert ev > 0

    def test_dcf_with_negative_cash_flows(self):
        """Test DCF handles negative cash flows (early-stage businesses)."""
        cash_flows = [-100000, -50000, 200000, 500000, 800000]
        terminal_cash_flow = 1000000
        discount_rate = 0.15
        terminal_growth_rate = 0.04

        ev = valuation_service.calculate_enterprise_value_dcf(
            cash_flows=cash_flows,
            terminal_cash_flow=terminal_cash_flow,
            discount_rate=discount_rate,
            terminal_growth_rate=terminal_growth_rate,
        )

        # Should still produce positive EV due to strong later years
        assert ev > 0


class TestEdgeCasesAndValidation:
    def test_discount_rate_must_be_positive(self):
        """Test that invalid discount rate raises error."""
        with pytest.raises(ValueError, match="discount_rate must be positive"):
            valuation_service.calculate_dcf_present_value([100000], discount_rate=0)

    def test_discount_rate_must_exceed_growth_rate(self):
        """Test Gordon Growth validation."""
        with pytest.raises(ValueError, match="discount_rate must be greater than growth_rate"):
            valuation_service.calculate_terminal_value_gordon_growth(
                terminal_cash_flow=1000000,
                discount_rate=0.03,
                growth_rate=0.05,  # growth > discount = invalid
            )

    def test_equal_discount_and_growth_rates_invalid(self):
        """Test Gordon Growth rejects equal rates."""
        with pytest.raises(ValueError):
            valuation_service.calculate_terminal_value_gordon_growth(
                terminal_cash_flow=1000000,
                discount_rate=0.03,
                growth_rate=0.03,  # Equal = invalid
            )


