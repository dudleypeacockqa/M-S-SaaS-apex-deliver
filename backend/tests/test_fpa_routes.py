"""Tests for FP&A routes covering demand forecasts, scenarios, and reports."""
from __future__ import annotations

import pytest
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.models.fpa import FpaForecast, FpaScenario, FpaReport
from app.services import entitlement_service
from app.models.user import User


@pytest.fixture(autouse=True)
def _allow_fpa_access(monkeypatch: pytest.MonkeyPatch) -> None:
    """Ensure FP&A feature checks always pass inside tests."""

    async def _always_allow(*_, **__) -> bool:
        return True

    monkeypatch.setattr(entitlement_service, "check_feature_access", _always_allow)


class TestFpaRoutes:
    """End-to-end tests for FP&A endpoints."""

    def test_create_demand_forecast(self, client, create_user, create_organization, db_session: Session, dependency_overrides):
        org = create_organization(name="FP&A Org")
        user = create_user(email="fpa@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        payload = {
            "name": "Week 48 Surge",
            "period": "2025-W48",
            "forecasted_demand": 1400,
            "confidence_level": 0.78,
            "assumptions": {"channel": "direct"},
        }

        response = client.post("/api/fpa/demand-forecast", json=payload)

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Week 48 Surge"
        assert data["period"] == "2025-W48"

        persisted = db_session.query(FpaForecast).filter_by(organization_id=str(org.id)).one()
        assert persisted.period == "2025-W48"
        assert float(persisted.confidence_level) == pytest.approx(0.78)

    def test_create_scenario_and_list(self, client, create_user, create_organization, db_session: Session, dependency_overrides):
        org = create_organization(name="Scenario Org")
        user = create_user(email="scenario@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        payload = {
            "name": "Automation Push",
            "description": "Increase robotics to reduce COGS",
            "assumptions": {"capex": 250000},
            "metrics": {"ebitda_delta": 0.12},
        }

        create_resp = client.post("/api/fpa/what-if", json=payload)
        assert create_resp.status_code == 201

        list_resp = client.get("/api/fpa/what-if")
        assert list_resp.status_code == 200
        scenarios = list_resp.json()
        assert any(s["name"] == "Automation Push" for s in scenarios)

        persisted = db_session.query(FpaScenario).filter_by(organization_id=str(org.id)).one()
        assert persisted.name == "Automation Push"
        assert persisted.metrics["ebitda_delta"] == 0.12

    def test_generate_report_persists_record(self, client, create_user, create_organization, db_session: Session, dependency_overrides):
        org = create_organization(name="Report Org")
        user = create_user(email="report@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        # Seed one forecast via API to ensure payload has data
        client.post(
            "/api/fpa/demand-forecast",
            json={
                "name": "Week 50",
                "period": "2025-W50",
                "forecasted_demand": 1500,
                "confidence_level": 0.8,
            },
        )

        report_resp = client.get("/api/fpa/reports/executive-summary")
        assert report_resp.status_code == 200
        body = report_resp.json()
        assert body["report_type"] == "executive-summary"
        assert body["payload"]["demand_summary"]["total_forecast"] == 1500

        report = db_session.query(FpaReport).filter_by(organization_id=str(org.id)).one()
        assert report.report_type == "executive-summary"
        assert "demand_summary" in report.payload

    def test_calculate_scenario_endpoint(self, client, create_user, create_organization, dependency_overrides):
        org = create_organization(name="Scenario Org")
        user = create_user(email="scenarios@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        payload = {
            "variables": {
                "gaba_red_price": 32,
                "gaba_black_price": 34,
                "gaba_gold_price": 48,
                "production_volume": 110,
                "material_costs": 98,
                "labor_efficiency": 102,
            }
        }

        response = client.post("/api/fpa/what-if/calculate", json=payload)
        assert response.status_code == 200
        body = response.json()
        assert "metrics" in body
        assert body["metrics"]["revenue"] > 0
        assert body["baseline"]["revenue"] == 10760000

    def test_predefined_scenarios_and_apply(self, client, create_user, create_organization, dependency_overrides):
        org = create_organization(name="Preset Org")
        user = create_user(email="preset@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        presets_response = client.get("/api/fpa/what-if/presets")
        assert presets_response.status_code == 200
        presets = presets_response.json()
        assert len(presets) >= 4
        scenario_id = presets[0]["id"]

        apply_response = client.post("/api/fpa/what-if/apply", json={"scenario_id": scenario_id})
        assert apply_response.status_code == 200
        data = apply_response.json()
        assert data["scenario"]["id"] == scenario_id
        assert data["metrics"]["revenue"] > 0
        assert data["baseline"]["revenue"] == 10760000

    def test_operational_metric_endpoints(self, client, create_user, create_organization, dependency_overrides):
        org = create_organization(name="Ops Org")
        user = create_user(email="ops@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        dashboard = client.get("/api/fpa/dashboard")
        assert dashboard.status_code == 200
        assert dashboard.json()["total_revenue"] == 2_500_000.0

        inventory = client.get("/api/fpa/inventory")
        assert inventory.status_code == 200
        assert len(inventory.json()) >= 2

        production = client.get("/api/fpa/production")
        assert production.status_code == 200
        assert production.json()[0]["units_produced"] > 0

        quality = client.get("/api/fpa/quality")
        assert quality.status_code == 200
        assert quality.json()[0]["pass_rate"] > 0

        working_capital = client.get("/api/fpa/working-capital")
        assert working_capital.status_code == 200
        assert working_capital.json()["current"] == 1_900_000.0

    def test_alias_endpoints_and_ai_tools(self, client, create_user, create_organization, dependency_overrides):
        org = create_organization(name="Alias Org")
        user = create_user(email="alias@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        calc_alias = client.post(
            "/api/fpa/scenarios/calculate",
            json={
                "variables": {
                    "gaba_red_price": 31,
                    "gaba_black_price": 33,
                    "gaba_gold_price": 46,
                    "production_volume": 105,
                    "material_costs": 101,
                    "labor_efficiency": 101,
                }
            },
        )
        assert calc_alias.status_code == 200

        presets_alias = client.get("/api/fpa/scenarios/presets")
        assert presets_alias.status_code == 200

        apply_alias = client.post("/api/fpa/scenarios/apply", json={"scenario_id": "cost-optimization"})
        assert apply_alias.status_code == 200

        chat_resp = client.post(
            "/api/fpa/ai-chat",
            json={"message": "How is EBITDA trending?", "context": {"current_page": "valuation"}},
        )
        assert chat_resp.status_code == 200
        assert "EBITDA" in chat_resp.json()["response"]

        files = {"file": ("import.csv", "id,value\n1,100", "text/csv")}
        data = {"import_type": "inventory"}
        import_resp = client.post("/api/fpa/import", files=files, data=data)
        assert import_resp.status_code == 200
        assert import_resp.json()["success"] is True

