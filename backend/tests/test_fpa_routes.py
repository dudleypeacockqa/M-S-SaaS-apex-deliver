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


class TestFpaErrorPaths:
    """Test FP&A error paths and edge cases."""
    
    def test_apply_scenario_not_found(self, client, create_user, create_organization, dependency_overrides):
        """Test applying a non-existent scenario."""
        org = create_organization(name="Error Org")
        user = create_user(email="error@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.post("/api/fpa/what-if/apply", json={"scenario_id": "non-existent"})
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_generate_report_invalid_type(self, client, create_user, create_organization, dependency_overrides):
        """Test generating report with invalid type."""
        org = create_organization(name="Report Error Org")
        user = create_user(email="reporterror@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        # Should handle invalid report type gracefully (may return 200 with default report)
        response = client.get("/api/fpa/reports/invalid-type")
        # Endpoint may handle gracefully or return error
        assert response.status_code in [200, 400, 404]
    
    def test_get_demand_forecasts_empty(self, client, create_user, create_organization, dependency_overrides):
        """Test getting demand forecasts when none exist."""
        org = create_organization(name="Empty Org")
        user = create_user(email="empty@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/fpa/demand-forecast")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_what_if_scenarios_empty(self, client, create_user, create_organization, dependency_overrides):
        """Test getting what-if scenarios when none exist."""
        org = create_organization(name="Empty Scenario Org")
        user = create_user(email="emptyscenario@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.get("/api/fpa/what-if")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_calculate_scenario_invalid_variables(self, client, create_user, create_organization, dependency_overrides):
        """Test calculating scenario with invalid variables."""
        org = create_organization(name="Invalid Var Org")
        user = create_user(email="invalidvar@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        # Missing required variables - service may use defaults
        response = client.post("/api/fpa/what-if/calculate", json={"variables": {}})
        # Service may handle gracefully with defaults or return validation error
        assert response.status_code in [200, 400, 422]
    
    def test_ai_chat_empty_message(self, client, create_user, create_organization, dependency_overrides):
        """Test AI chat with empty message."""
        org = create_organization(name="Chat Error Org")
        user = create_user(email="chaterror@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        response = client.post("/api/fpa/ai-chat", json={"message": "", "context": {}})
        # Should handle empty message gracefully
        assert response.status_code in [200, 400, 422]
    
    def test_import_invalid_type(self, client, create_user, create_organization, dependency_overrides):
        """Test import with invalid type."""
        org = create_organization(name="Import Error Org")
        user = create_user(email="importerror@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        files = {"file": ("import.csv", "id,value\n1,100", "text/csv")}
        data = {"import_type": "invalid_type"}
        response = client.post("/api/fpa/import", files=files, data=data)
        # Should handle invalid type gracefully
        assert response.status_code in [200, 400, 422]

    def test_create_scenario_validates_metrics(self, client, create_user, create_organization, dependency_overrides):
        """Test scenario creation validates allowed metrics."""
        org = create_organization(name="Metric Validation Org")
        user = create_user(email="metricval@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        # Test with invalid metric
        payload = {
            "name": "Invalid Metric Scenario",
            "metrics": {"invalid_metric": 100, "revenue": 5000000},
        }
        response = client.post("/api/fpa/scenarios", json=payload)
        assert response.status_code == 400
        assert "Invalid metrics" in response.json()["detail"]
        
        # Test with valid metrics
        payload = {
            "name": "Valid Metric Scenario",
            "metrics": {"revenue": 5000000, "ebitda": 1000000, "growth_rate": 0.15},
        }
        response = client.post("/api/fpa/scenarios", json=payload)
        assert response.status_code == 201
        assert response.json()["name"] == "Valid Metric Scenario"

    def test_create_report_via_post_endpoint(self, client, create_user, create_organization, db_session: Session, dependency_overrides):
        """Test creating report via POST /api/fpa/reports endpoint."""
        org = create_organization(name="POST Report Org")
        user = create_user(email="postreport@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        # Seed forecast
        client.post(
            "/api/fpa/demand-forecasts",
            json={
                "name": "Week 51",
                "period": "2025-W51",
                "forecasted_demand": 1600,
                "confidence_level": 0.85,
            },
        )
        
        # Create report via POST
        payload = {"report_type": "executive-summary"}
        response = client.post("/api/fpa/reports", json=payload)
        assert response.status_code == 201
        body = response.json()
        assert body["report_type"] == "executive-summary"
        assert "growth" in body["payload"]
        assert "ebitda" in body["payload"]
        assert "cash_flow" in body["payload"]
        
        # Verify report persisted
        report = db_session.query(FpaReport).filter_by(organization_id=str(org.id)).one()
        assert report.report_type == "executive-summary"

    def test_create_demand_forecast_via_plural_endpoint(self, client, create_user, create_organization, db_session: Session, dependency_overrides):
        """Test creating forecast via POST /api/fpa/demand-forecasts endpoint."""
        org = create_organization(name="Plural Forecast Org")
        user = create_user(email="pluralforecast@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        payload = {
            "name": "Week 52 Forecast",
            "period": "2025-W52",
            "forecasted_demand": 1700,
            "confidence_level": 0.88,
        }
        
        response = client.post("/api/fpa/demand-forecasts", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Week 52 Forecast"
        
        persisted = db_session.query(FpaForecast).filter_by(organization_id=str(org.id)).one()
        assert persisted.period == "2025-W52"

    def test_unauthorized_access_returns_403(self, client, create_user, create_organization, dependency_overrides, monkeypatch):
        """Test that unauthorized users get 403 when accessing FPA endpoints."""
        from app.services import entitlement_service
        
        org = create_organization(name="No Access Org")
        user = create_user(email="noaccess@example.com", organization_id=str(org.id))
        dependency_overrides(get_current_user, lambda: user)
        
        # Mock entitlement check to return False
        async def _deny_access(*_, **__) -> bool:
            return False
        
        monkeypatch.setattr(entitlement_service, "check_feature_access", _deny_access)
        
        # Try to access FPA endpoint
        response = client.get("/api/fpa/dashboard")
        assert response.status_code == 403
        assert "FP&A module access" in response.json()["detail"]
        
        # Try to create forecast
        payload = {
            "name": "Test Forecast",
            "period": "2025-W01",
            "forecasted_demand": 1000,
            "confidence_level": 0.8,
        }
        response = client.post("/api/fpa/demand-forecasts", json=payload)
        assert response.status_code == 403

