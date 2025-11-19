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

    def test_calculate_scenario_impact_route(self, client, create_user, create_organization, dependency_overrides):
        org = create_organization(name="Scenario Calc Org")
        user = create_user(email="calc@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        payload = {
            "variables": {
                "gaba_red_price": 32.0,
                "gaba_black_price": 34.0,
                "gaba_gold_price": 48.0,
                "production_volume": 115.0,
                "material_costs": 97.0,
                "labor_efficiency": 105.0,
            }
        }

        response = client.post("/api/fpa/what-if/calculate", json=payload)

        assert response.status_code == 200
        data = response.json()
        assert data["baseline"]["revenue"] == pytest.approx(10_760_000.0)
        assert data["metrics"]["revenue"] != pytest.approx(data["baseline"]["revenue"])
        assert data["metrics"]["gross_margin"] > 0

    def test_predefined_scenarios_and_apply(self, client, create_user, create_organization, dependency_overrides):
        org = create_organization(name="Preset Org")
        user = create_user(email="preset@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        presets_resp = client.get("/api/fpa/what-if/presets")
        assert presets_resp.status_code == 200
        presets = presets_resp.json()
        assert len(presets) == 4
        aggressive = next(p for p in presets if p["id"] == "aggressive-growth")
        assert aggressive["variables"]["production_volume"] == pytest.approx(120.0)

        apply_resp = client.post("/api/fpa/what-if/apply", json={"scenario_id": "aggressive-growth"})
        assert apply_resp.status_code == 200
        body = apply_resp.json()
        assert body["scenario"]["id"] == "aggressive-growth"
        assert body["metrics"]["revenue"] != body["baseline"]["revenue"]

    def test_apply_scenario_not_found(self, client, create_user, create_organization, dependency_overrides):
        org = create_organization(name="Preset Org Missing")
        user = create_user(email="preset-missing@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)

        response = client.post("/api/fpa/what-if/apply", json={"scenario_id": "missing"})
        assert response.status_code == 404

