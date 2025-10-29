"""RED phase tests for DEV-011 valuation service.

These tests intentionally fail until the valuation service implementation is
completed. They encode the expected behaviour of core DCF and sensitivity
calculations to drive TDD.
"""

from datetime import datetime, timedelta, timezone
from decimal import Decimal
from uuid import uuid4
from typing import List

import pytest

from app.services import valuation_service
from app.models import Organization, User, ValuationModel
from app.core.config import settings


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

        ev = valuation_service._calculate_enterprise_value(
            cash_flows=cash_flows,
            terminal_cash_flow=terminal_cash_flow,
            discount_rate=discount_rate,
            terminal_method="gordon_growth",
            terminal_growth_rate=terminal_growth_rate,
            terminal_ebitda_multiple=None,
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

        ev = valuation_service._calculate_enterprise_value(
            cash_flows=cash_flows,
            terminal_cash_flow=terminal_cash_flow,
            discount_rate=discount_rate,
            terminal_method="gordon_growth",
            terminal_growth_rate=terminal_growth_rate,
            terminal_ebitda_multiple=None,
        )

        assert ev > 0

    def test_dcf_with_negative_cash_flows(self):
        """Test DCF handles negative cash flows (early-stage businesses)."""
        cash_flows = [-100000, -50000, 200000, 500000, 800000]
        terminal_cash_flow = 1000000
        discount_rate = 0.15
        terminal_growth_rate = 0.04

        ev = valuation_service._calculate_enterprise_value(
            cash_flows=cash_flows,
            terminal_cash_flow=terminal_cash_flow,
            discount_rate=discount_rate,
            terminal_method="gordon_growth",
            terminal_growth_rate=terminal_growth_rate,
            terminal_ebitda_multiple=None,
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


class TestMultiplesAndScenarioAnalytics:
    def test_comparable_analysis_excludes_outliers_and_weighs_results(self, db_session, valuation_payload, test_deal, solo_user):
        from uuid import uuid4

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp Base",
            ev_ebitda_multiple=8.0,
            weight=1.0,
            is_outlier="false",
        )
        valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp Heavy",
            ev_ebitda_multiple=10.0,
            weight=2.0,
            is_outlier="false",
        )
        valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp Outlier",
            ev_ebitda_multiple=30.0,
            weight=1.0,
            is_outlier="true",
        )

        multiples = valuation_service.calculate_comparable_multiples(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            subject_revenue=5_500_000,
            subject_ebitda=2_000_000,
        )

        ev_ebitda = multiples["ev_ebitda"]
        assert ev_ebitda["count"] == 2
        assert ev_ebitda["weighted_average"] == pytest.approx(9.3333, rel=1e-3)
        assert ev_ebitda["implied_enterprise_value_median"] == pytest.approx(18_000_000, rel=1e-3)

        ev_revenue = multiples["ev_revenue"]
        assert ev_revenue["count"] == 0

    def test_precedent_analysis_flags_stale_transactions(self, db_session, valuation_payload, test_deal, solo_user):
        from uuid import uuid4
        from datetime import datetime, timedelta, timezone

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            target_company="T1",
            acquirer_company="Buyer 1",
            ev_ebitda_multiple=7.5,
            weight=1.0,
            announcement_date=datetime.now(timezone.utc),
        )
        valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            target_company="T2",
            acquirer_company="Buyer 2",
            ev_ebitda_multiple=8.5,
            weight=1.0,
            announcement_date=datetime.now(timezone.utc) - timedelta(days=400),
        )

        multiples = valuation_service.calculate_precedent_multiples(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            subject_ebitda=1_800_000,
            current_date=datetime.now(timezone.utc),
        )

        ev_ebitda = multiples["ev_ebitda"]
        assert ev_ebitda["stale_count"] == 1
        assert ev_ebitda["implied_enterprise_value_median"] == pytest.approx(13_500_000, rel=1e-3)

    def test_generate_tornado_chart_orders_by_impact(self):
        scenario_results = [
            {
                "metric": "discount_rate",
                "base_value": 0.12,
                "scenario_value": 0.10,
                "enterprise_value": 11_200_000,
            },
            {
                "metric": "terminal_growth_rate",
                "base_value": 0.03,
                "scenario_value": 0.05,
                "enterprise_value": 10_950_000,
            },
            {
                "metric": "revenue_growth",
                "base_value": 0.20,
                "scenario_value": 0.18,
                "enterprise_value": 10_100_000,
            },
        ]

        tornado = valuation_service.generate_tornado_chart_data(
            base_enterprise_value=10_500_000,
            scenario_results=scenario_results,
            top_n=3,
        )

        assert tornado[0]["metric"] == "discount_rate"
        assert tornado[0]["delta"] == pytest.approx(700_000, rel=1e-3)
        assert tornado[-1]["metric"] == "revenue_growth"

    def test_run_monte_carlo_simulation_returns_deterministic_summary(self):
        summary = valuation_service.run_monte_carlo_simulation(
            base_cash_flows=[500000, 650000, 800000, 950000, 1100000],
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            iterations=100,
            seed=123,
        )

        assert summary["iterations"] == 100
        assert summary["seed"] == 123
        assert summary["percentiles"]["p90"] > summary["percentiles"]["p10"]
        assert summary["mean_enterprise_value"] > 0


class TestScenarioAnalytics:
    def test_calculate_scenario_summary_returns_expected_stats(self, db_session, valuation_payload, test_deal, solo_user):
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        valuation_service.add_scenario(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            name="Upside",
            enterprise_value=12_500_000,
            equity_value=10_000_000,
        )
        valuation_service.add_scenario(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            name="Downside",
            enterprise_value=8_000_000,
            equity_value=6_200_000,
        )

        summary = valuation_service.calculate_scenario_summary(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )

        assert summary["count"] == 2
        assert summary["enterprise_value_range"]["min"] == 8_000_000
        assert summary["enterprise_value_range"]["max"] == 12_500_000
        assert summary["equity_value_range"]["median"] == pytest.approx(8_100_000, rel=1e-3)

    def test_generate_tornado_chart_orders_by_impact(self):
        scenario_results = [
            {
                "metric": "discount_rate",
                "base_value": 0.12,
                "scenario_value": 0.10,
                "enterprise_value": 11_200_000,
            },
            {
                "metric": "terminal_growth_rate",
                "base_value": 0.03,
                "scenario_value": 0.05,
                "enterprise_value": 10_950_000,
            },
            {
                "metric": "revenue_growth",
                "base_value": 0.20,
                "scenario_value": 0.18,
                "enterprise_value": 10_100_000,
            },
        ]

        tornado = valuation_service.generate_tornado_chart_data(
            base_enterprise_value=10_500_000,
            scenario_results=scenario_results,
            top_n=3,
        )

        assert tornado[0]["metric"] == "discount_rate"
        assert tornado[0]["delta"] == pytest.approx(700_000, rel=1e-3)
        assert tornado[-1]["metric"] == "revenue_growth"

    def test_run_monte_carlo_simulation_returns_deterministic_summary(self):
        summary = valuation_service.run_monte_carlo_simulation(
            base_cash_flows=[500000, 650000, 800000, 950000, 1100000],
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            iterations=100,
            seed=123,
        )

        assert summary["iterations"] == 100
        assert summary["seed"] == 123
        assert summary["percentiles"]["p90"] > summary["percentiles"]["p10"]
        assert summary["mean_enterprise_value"] > 0


class TestExportLogging:
    def test_log_export_creates_audit_record(self, db_session, valuation_payload, test_deal, solo_user):
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        log_entry = valuation_service.log_export_event(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            export_type="pdf",
            export_format="summary",
            exported_by=valuation.created_by,
            file_size_bytes=204800,
            document_id=str(uuid4()),
        )

        assert log_entry.export_type == "pdf"
        assert log_entry.export_format == "summary"
        assert log_entry.file_size_bytes == 204800


class TestValuationServiceOperations:
    def test_calculate_enterprise_value_exit_multiple_path(self):
        ev = valuation_service._calculate_enterprise_value(
            cash_flows=[350000, 420000, 500000],
            terminal_cash_flow=575000,
            discount_rate=0.1,
            terminal_method="exit_multiple",
            terminal_growth_rate=None,
            terminal_ebitda_multiple=7.25,
        )

        assert ev > 0

    def test_calculate_enterprise_value_exit_multiple_requires_multiple(self):
        with pytest.raises(ValueError, match="terminal_ebitda_multiple required"):
            valuation_service._calculate_enterprise_value(
                cash_flows=[200000, 250000],
                terminal_cash_flow=260000,
                discount_rate=0.11,
                terminal_method="exit_multiple",
                terminal_growth_rate=None,
                terminal_ebitda_multiple=None,
            )

    def test_update_valuation_recalculates_metrics(self, db_session, valuation_payload, test_deal, solo_user):
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        original_ev = valuation.enterprise_value
        original_price = valuation.implied_share_price

        updated = valuation_service.update_valuation(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            updates={
                "cash_flows": [600000, 750000, 925000, 1100000, 1250000],
                "terminal_cash_flow": 1350000,
                "terminal_method": "exit_multiple",
                "terminal_ebitda_multiple": 8.0,
                "net_debt": 250000,
                "shares_outstanding": 150000,
            },
        )

        assert updated.enterprise_value != pytest.approx(original_ev)
        assert updated.implied_share_price != pytest.approx(original_price)

    def test_delete_valuation_removes_related_records(self, db_session, valuation_payload, test_deal, solo_user):
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Delete Me",
            ev_ebitda_multiple=9.0,
        )
        valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            target_company="Target",
            acquirer_company="Buyer",
            ev_ebitda_multiple=7.0,
        )

        deleted = valuation_service.delete_valuation(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )

        assert deleted is True
        assert db_session.get(ValuationModel, valuation.id) is None
        assert valuation_service.list_comparable_companies(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        ) == []
        assert valuation_service.list_precedent_transactions(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        ) == []

    def test_calculate_precedent_multiples_handles_no_records(self, db_session, valuation_payload, test_deal, solo_user):
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        multiples = valuation_service.calculate_precedent_multiples(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            subject_ebitda=1_500_000,
        )

        assert multiples["ev_ebitda"]["count"] == 0
        assert multiples["ev_ebitda"]["stale_count"] == 0

    def test_list_helpers_return_entries(self, db_session, valuation_payload, test_deal, solo_user):
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=test_deal.id,
            organization_id=test_deal.organization_id,
            created_by=solo_user.id,
            **valuation_payload,
        )

        scenario = valuation_service.add_scenario(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            name="Scenario A",
            enterprise_value=9_500_000,
        )
        comparable = valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp A",
            ev_ebitda_multiple=8.5,
        )
        precedent = valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            target_company="Target A",
            acquirer_company="Buyer A",
            ev_ebitda_multiple=7.2,
        )

        assert scenario in valuation_service.list_scenarios(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )
        assert comparable in valuation_service.list_comparable_companies(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )
        assert precedent in valuation_service.list_precedent_transactions(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )

    def test_trigger_export_task_returns_payload(self):
        payload = valuation_service.trigger_export_task(
            valuation_id="val-123",
            organization_id="org-123",
            export_type="pdf",
            export_format="summary",
        )

        assert payload["status"] == "queued"
        assert payload["export_type"] == "pdf"

    def test_ensure_test_reference_entities_noop_when_not_test(self, db_session, monkeypatch):
        org_id = str(uuid4())
        user_id = str(uuid4())
        monkeypatch.setattr(settings, "environment", "production")

        valuation_service._ensure_test_reference_entities(
            db_session,
            organization_id=org_id,
            user_id=user_id,
        )

        assert db_session.get(Organization, org_id) is None
        assert db_session.get(User, user_id) is None

    def test_ensure_test_reference_entities_creates_placeholders(self, db_session, monkeypatch):
        org_id = str(uuid4())
        user_id = str(uuid4())
        monkeypatch.setattr(settings, "environment", "test")

        valuation_service._ensure_test_reference_entities(
            db_session,
            organization_id=org_id,
            user_id=user_id,
        )

        assert db_session.get(Organization, org_id) is not None
        assert db_session.get(User, user_id) is not None

