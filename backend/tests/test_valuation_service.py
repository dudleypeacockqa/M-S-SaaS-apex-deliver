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

    def test_dcf_with_empty_cash_flows(self):
        """Test DCF handles empty cash flows list."""
        cash_flows = []
        discount_rate = 0.12

        present_value = valuation_service.calculate_dcf_present_value(
            cash_flows,
            discount_rate,
        )

        # Empty list should return zero
        assert present_value == Decimal("0")

    def test_dcf_with_negative_discount_rate(self):
        """Test that negative discount rate raises error."""
        with pytest.raises(ValueError, match="discount_rate must be positive"):
            valuation_service.calculate_dcf_present_value([100000], discount_rate=-0.05)

    def test_gordon_growth_with_negative_growth_rate(self):
        """Test Gordon Growth handles negative growth rate (declining business)."""
        terminal_cash_flow = 1000000
        discount_rate = 0.12
        growth_rate = -0.02  # Declining business

        terminal_value = valuation_service.calculate_terminal_value_gordon_growth(
            terminal_cash_flow,
            discount_rate,
            growth_rate,
        )

        # Should produce lower terminal value due to negative growth
        # TV = FCF * (1 + g) / (r - g) = 1M * 0.98 / (0.12 - (-0.02)) = 980K / 0.14 = 7M
        assert 6_900_000 < terminal_value < 7_100_000

    def test_dcf_with_extreme_large_cash_flows(self):
        """Test DCF handles very large cash flows without overflow."""
        cash_flows = [1_000_000_000, 2_000_000_000, 3_000_000_000]
        discount_rate = 0.10

        present_value = valuation_service.calculate_dcf_present_value(
            cash_flows,
            discount_rate,
        )

        # Should produce valid result (approximately 4.82B)
        # PV = 1B/1.1 + 2B/1.21 + 3B/1.331 ≈ 909M + 1,653M + 2,254M ≈ 4.816B
        assert present_value > 4_800_000_000
        assert present_value < 4_850_000_000

    def test_dcf_with_extreme_small_cash_flows(self):
        """Test DCF handles very small cash flows without underflow."""
        cash_flows = [0.01, 0.02, 0.03]
        discount_rate = 0.10

        present_value = valuation_service.calculate_dcf_present_value(
            cash_flows,
            discount_rate,
        )

        # Should produce valid result (approximately 0.05)
        assert present_value > Decimal("0.04")
        assert present_value < Decimal("0.06")

    def test_exit_multiple_with_zero_ebitda(self):
        """Test exit multiple handles zero EBITDA."""
        terminal_ebitda = 0
        exit_multiple = 8.5

        terminal_value = valuation_service.calculate_terminal_value_exit_multiple(
            terminal_ebitda,
            exit_multiple,
        )

        # Zero EBITDA should produce zero terminal value
        assert terminal_value == Decimal("0")

    def test_exit_multiple_with_negative_ebitda(self):
        """Test exit multiple handles negative EBITDA (loss-making)."""
        terminal_ebitda = -500000
        exit_multiple = 8.5

        terminal_value = valuation_service.calculate_terminal_value_exit_multiple(
            terminal_ebitda,
            exit_multiple,
        )

        # Negative EBITDA should produce negative terminal value
        assert terminal_value == Decimal("-4250000")

    def test_dcf_with_high_discount_rate(self):
        """Test DCF with very high discount rate (risky ventures)."""
        cash_flows = [100000, 150000, 200000]
        discount_rate = 0.50  # 50% discount rate for high-risk ventures

        present_value = valuation_service.calculate_dcf_present_value(
            cash_flows,
            discount_rate,
        )

        # High discount rate should significantly reduce PV
        # Roughly: 100K/1.5 + 150K/2.25 + 200K/3.375 ≈ 66.7K + 66.7K + 59.3K ≈ 192.7K
        assert 180_000 < present_value < 210_000


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

    def _create_test_document(self, db_session, deal, user):
        from app.models.document import Document

        document = Document(
            id=str(uuid4()),
            name="valuation-export.pdf",
            file_key=f"valuation-{deal.id}.pdf",
            file_size=2048,
            file_type="application/pdf",
            deal_id=deal.id,
            organization_id=deal.organization_id,
            uploaded_by=user.id,
        )
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)
        return document

    def test_log_export_event_persists_document_reference(
        self,
        db_session,
        create_deal_for_org,
    ):
        deal, owner, _ = create_deal_for_org()
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            terminal_method="gordon_growth",
            cash_flows=[500000, 650000, 800000, 950000, 1_100_000],
            terminal_cash_flow=1_200_000,
            net_debt=2_000_000,
            shares_outstanding=1_000_000,
        )

        document = self._create_test_document(db_session, deal, owner)

        log_entry = valuation_service.log_export_event(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=deal.organization_id,
            export_type="pdf",
            export_format="summary",
            exported_by=owner.id,
            document_id=document.id,
            file_size_bytes=4096,
        )

        assert log_entry.document_id == document.id
        assert log_entry.file_size_bytes == 4096

    def test_log_export_event_rejects_foreign_document(
        self,
        db_session,
        create_deal_for_org,
        create_organization,
    ):
        deal, owner, _ = create_deal_for_org()
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            terminal_method="gordon_growth",
            cash_flows=[500000, 650000, 800000, 950000, 1_100_000],
            terminal_cash_flow=1_200_000,
            net_debt=2_000_000,
            shares_outstanding=1_000_000,
        )

        other_org = create_organization()
        foreign_document = self._create_test_document(db_session, deal, owner)
        foreign_document.organization_id = other_org.id
        db_session.add(foreign_document)
        db_session.commit()

        with pytest.raises(ValueError):
            valuation_service.log_export_event(
                db=db_session,
                valuation_id=valuation.id,
                organization_id=deal.organization_id,
                export_type="pdf",
                export_format="summary",
                exported_by=owner.id,
                document_id=foreign_document.id,
            )

    def test_log_export_event_accepts_valid_scenario(
        self,
        db_session,
        create_deal_for_org,
    ):
        deal, owner, _ = create_deal_for_org()
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            terminal_method="gordon_growth",
            cash_flows=[500000, 650000, 800000, 950000, 1_100_000],
            terminal_cash_flow=1_200_000,
            net_debt=2_000_000,
            shares_outstanding=1_000_000,
        )

        scenario = valuation_service.add_scenario(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=deal.organization_id,
            name="Upside",
            enterprise_value=11_000_000,
        )

        log_entry = valuation_service.log_export_event(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=deal.organization_id,
            export_type="pdf",
            export_format="summary",
            exported_by=owner.id,
            scenario_id=scenario.id,
        )

        assert log_entry.scenario_id == scenario.id

    def test_log_export_event_rejects_scenario_from_other_valuation(
        self,
        db_session,
        create_deal_for_org,
    ):
        deal, owner, _ = create_deal_for_org()
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            terminal_method="gordon_growth",
            cash_flows=[500000, 650000, 800000, 950000, 1_100_000],
            terminal_cash_flow=1_200_000,
            net_debt=2_000_000,
            shares_outstanding=1_000_000,
        )

        other_valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.11,
            terminal_growth_rate=0.02,
            terminal_method="gordon_growth",
            cash_flows=[400000, 550000, 700000, 850000, 1_000_000],
            terminal_cash_flow=1_050_000,
            net_debt=1_500_000,
            shares_outstanding=900_000,
        )

        other_scenario = valuation_service.add_scenario(
            db=db_session,
            valuation_id=other_valuation.id,
            organization_id=deal.organization_id,
            name="Other",
            enterprise_value=8_500_000,
        )

        with pytest.raises(ValueError):
            valuation_service.log_export_event(
                db=db_session,
                valuation_id=valuation.id,
                organization_id=deal.organization_id,
                export_type="pdf",
                export_format="summary",
                exported_by=owner.id,
                scenario_id=other_scenario.id,
            )


class TestGoToMarketKpis:
    def test_calculate_go_to_market_kpis_matches_reference_spreadsheet(self):
        metrics = valuation_service.calculate_go_to_market_kpis(
            marketing_spend=300_000,
            sales_spend=150_000,
            new_customers=150,
            average_revenue_per_account=1_200,
            gross_margin_percentage=75,
            monthly_churn_percentage=2.5,
            current_arr=5_200_000,
            previous_arr=4_800_000,
        )

        assert metrics["customer_acquisition_cost"] == pytest.approx(3_000.0)
        assert metrics["lifetime_value"] == pytest.approx(36_000.0)
        assert metrics["ltv_to_cac_ratio"] == pytest.approx(12.0)
        assert metrics["cac_payback_months"] == pytest.approx(3.333333333, rel=1e-6)
        assert metrics["magic_number"] == pytest.approx(3.555555555, rel=1e-6)
        assert metrics["sales_efficiency"] == pytest.approx(0.888888888, rel=1e-6)
        assert metrics["net_new_arr"] == 400_000

    def test_calculate_go_to_market_kpis_handles_zero_inputs(self):
        metrics = valuation_service.calculate_go_to_market_kpis(
            marketing_spend=0,
            sales_spend=0,
            new_customers=0,
            average_revenue_per_account=0,
            gross_margin_percentage=0,
            monthly_churn_percentage=0,
            current_arr=1_000_000,
            previous_arr=1_000_000,
        )

        assert metrics["customer_acquisition_cost"] is None
        assert metrics["lifetime_value"] is None
        assert metrics["ltv_to_cac_ratio"] is None
        assert metrics["cac_payback_months"] is None
        assert metrics["magic_number"] is None
        assert metrics["sales_efficiency"] is None
        assert metrics["net_new_arr"] == 0

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


class TestServiceHelperFunctions:
    """Test helper functions and uncovered edge cases in valuation_service."""

    def test_safe_division_returns_none_for_zero_denominator(self):
        """Test _safe_division returns None when denominator is zero."""
        result = valuation_service._safe_division(numerator=100, denominator=0)
        assert result is None

    def test_safe_division_returns_none_for_none_denominator(self):
        """Test _safe_division returns None when denominator is None."""
        result = valuation_service._safe_division(numerator=100, denominator=None)
        assert result is None

    def test_valuation_with_zero_shares_outstanding_has_none_share_price(
        self, db_session, create_deal_for_org
    ):
        """Test valuation with zero shares_outstanding sets implied_share_price to None."""
        deal, owner, _ = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            terminal_method="gordon_growth",
            cash_flows=[500000, 650000, 800000, 950000, 1_100_000],
            terminal_cash_flow=1_200_000,
            net_debt=2_000_000,
            shares_outstanding=0,  # Zero shares
        )

        # implied_share_price should be None when shares_outstanding is 0
        assert valuation.implied_share_price is None

    def test_valuation_with_none_shares_outstanding_has_none_share_price(
        self, db_session, create_deal_for_org
    ):
        """Test valuation with None shares_outstanding sets implied_share_price to None."""
        deal, owner, _ = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            terminal_method="gordon_growth",
            cash_flows=[500000, 650000, 800000, 950000, 1_100_000],
            terminal_cash_flow=1_200_000,
            net_debt=2_000_000,
            shares_outstanding=None,  # None shares
        )

        # implied_share_price should be None when shares_outstanding is None
        assert valuation.implied_share_price is None

    def test_list_valuations_returns_all_for_deal(
        self, db_session, create_deal_for_org
    ):
        """Test list_valuations returns all valuations for a deal."""
        deal, owner, _ = create_deal_for_org()

        # Create multiple valuations for the same deal
        val1 = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.12,
            terminal_growth_rate=0.03,
            terminal_method="gordon_growth",
            cash_flows=[100000, 150000, 200000],
            terminal_cash_flow=250000,
        )

        val2 = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=owner.id,
            forecast_years=5,
            discount_rate=0.15,
            terminal_growth_rate=0.02,
            terminal_method="exit_multiple",
            terminal_ebitda_multiple=8.5,
            cash_flows=[120000, 180000, 240000],
            terminal_cash_flow=300000,
        )

        # List valuations
        valuations = valuation_service.list_valuations(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
        )

        assert len(valuations) == 2
        valuation_ids = [v.id for v in valuations]
        assert val1.id in valuation_ids
        assert val2.id in valuation_ids

    def test_deal_exists_returns_true_for_existing_deal(
        self, db_session, create_deal_for_org
    ):
        """Test deal_exists returns True for existing deal."""
        deal, _, _ = create_deal_for_org()

        exists = valuation_service.deal_exists(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
        )

        assert exists is True

    def test_deal_exists_returns_false_for_nonexistent_deal(
        self, db_session, create_deal_for_org
    ):
        """Test deal_exists returns False for non-existent deal."""
        _, _, org = create_deal_for_org()
        fake_deal_id = str(uuid4())

        exists = valuation_service.deal_exists(
            db=db_session,
            deal_id=fake_deal_id,
            organization_id=org.id,
        )

        assert exists is False

    def test_deal_exists_returns_false_for_wrong_organization(
        self, db_session, create_deal_for_org
    ):
        """Test deal_exists returns False when organization_id doesn't match."""
        deal, _, _ = create_deal_for_org()
        fake_org_id = str(uuid4())

        exists = valuation_service.deal_exists(
            db=db_session,
            deal_id=deal.id,
            organization_id=fake_org_id,
        )

        assert exists is False

    def test_update_valuation_raises_error_for_nonexistent_valuation(
        self, db_session, create_deal_for_org
    ):
        """Test update_valuation raises ValueError for non-existent valuation."""
        _, _, org = create_deal_for_org()
        fake_valuation_id = str(uuid4())

        with pytest.raises(ValueError, match="Valuation not found"):
            valuation_service.update_valuation(
                db=db_session,
                valuation_id=fake_valuation_id,
                organization_id=org.id,
                updates={"discount_rate": 0.15},
            )

