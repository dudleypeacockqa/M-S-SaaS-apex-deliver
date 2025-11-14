"""RED-phase API tests for valuation endpoints (DEV-011)."""

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import status

from app.services import valuation_service


def _create_valuation(client, deal_id: str, headers: dict, payload: dict):
    return client.post(
        f"/api/deals/{deal_id}/valuations",
        json=payload,
        headers=headers,
    )


VALUATION_PAYLOAD = {
    "forecast_years": 5,
    "discount_rate": 0.12,
    "terminal_growth_rate": 0.03,
    "terminal_method": "gordon_growth",
    "cash_flows": [500000, 650000, 800000, 950000, 1100000],
    "terminal_cash_flow": 1200000,
    "net_debt": 2000000,
    "shares_outstanding": 1000000,
}


SCENARIO_PAYLOAD = {
    "name": "Upside",
    "description": "Higher growth scenario",
    "assumptions": {"discount_rate": 0.1, "terminal_growth_rate": 0.04},
}


class TestValuationApi:
    def test_growth_user_can_create_valuation(self, client, create_deal_for_org, auth_headers_growth):
        deal, growth_user, _ = create_deal_for_org()

        response = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)

        assert response.status_code == status.HTTP_201_CREATED
        body = response.json()
        valuation_id = body["id"]
        assert body["deal_id"] == deal.id
        assert body["created_by"] == growth_user.id
        assert body["enterprise_value"] > 0

    def test_solo_user_gets_forbidden(self, client, create_deal_for_org, auth_headers):
        deal, _, _ = create_deal_for_org()

        response = _create_valuation(client, deal.id, auth_headers, VALUATION_PAYLOAD)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_valuation_returns_data(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["id"] == valuation_id

    def test_update_valuation(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        update_resp = client.put(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            json={"discount_rate": 0.1},
            headers=auth_headers_growth,
        )

        assert update_resp.status_code == status.HTTP_200_OK
        assert update_resp.json()["discount_rate"] == 0.1

    def test_delete_valuation(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        delete_resp = client.delete(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            headers=auth_headers_growth,
        )

        assert delete_resp.status_code == status.HTTP_204_NO_CONTENT

    def test_cannot_access_other_org_valuation(self, client, create_deal_for_org, auth_headers_growth, create_organization, create_user, dependency_overrides):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        other_org = create_organization(subscription_tier="growth")

        other_user = create_user(role="growth", organization_id=other_org.id)

        from app.api.dependencies.auth import get_current_user
        dependency_overrides(get_current_user, lambda: other_user)

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            headers={"Authorization": "Bearer mock_growth_token"},
        )

        assert response.status_code in {status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND}

    def test_add_comparable_via_api(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        payload = {"company_name": "Peer Co", "ev_ebitda_multiple": 8.4, "weight": 1.0}
        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/comparables",
            json=payload,
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["company_name"] == "Peer Co"

    def test_add_precedent_via_api(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        payload = {
            "target_company": "Target Co",
            "acquirer_company": "Buyer Inc",
            "deal_value": 18_000_000,
            "ev_ebitda_multiple": 7.8,
        }
        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/transactions",
            json=payload,
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["target_company"] == "Target Co" 

    def test_create_scenario_via_api(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/scenarios",
            json=SCENARIO_PAYLOAD,
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["name"] == "Upside"

    def test_generate_export_creates_log(self, client, create_deal_for_org, auth_headers_growth, monkeypatch):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        captured = {}

        def fake_trigger_export_task(**kwargs):
            captured.update(kwargs)
            captured["task_id"] = "abc123"
            captured["status"] = "queued"
            return captured

        monkeypatch.setattr("app.services.valuation_service.trigger_export_task", fake_trigger_export_task)

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "pdf", "export_format": "summary"},
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_202_ACCEPTED
        body = response.json()
        assert body["status"] == "queued"
        assert body["task_id"] == "abc123"
        assert captured["valuation_id"] == valuation_id

    def test_generate_export_returns_log_id_and_persists_entry(
        self,
        client,
        create_deal_for_org,
        auth_headers_growth,
        db_session,
        monkeypatch,
    ):
        from app.models.valuation import ValuationExportLog

        deal, growth_user, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        def fake_trigger_export_task(**kwargs):
            return {"task_id": "export-task-001", "status": "queued", **kwargs}

        monkeypatch.setattr(
            "app.services.valuation_service.trigger_export_task",
            fake_trigger_export_task,
        )

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "pdf", "export_format": "summary"},
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_202_ACCEPTED
        payload = response.json()
        assert payload["status"] == "queued"
        assert payload["task_id"] == "export-task-001"
        log_id = payload.get("export_log_id")
        assert log_id, "export_log_id should be returned to the client"

        log_entry = db_session.get(ValuationExportLog, log_id)
        assert log_entry is not None
        assert log_entry.valuation_id == valuation_id
        assert log_entry.organization_id == growth_user.organization_id
        assert log_entry.export_type == "pdf"
        assert log_entry.export_format == "summary"
        assert log_entry.exported_by == growth_user.id

    def test_generate_export_allows_scenario_id(
        self,
        client,
        create_deal_for_org,
        auth_headers_growth,
        db_session,
        monkeypatch,
    ):
        from app.models.valuation import ValuationExportLog

        deal, growth_user, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        call_count = [0]
        def fake_trigger_export_task(**kwargs):
            call_count[0] += 1
            return {"task_id": f"export-task-{call_count[0]:03d}", "status": "queued", **kwargs}

        monkeypatch.setattr(
            "app.services.valuation_service.trigger_export_task",
            fake_trigger_export_task,
        )

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "pdf", "export_format": "summary"},
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_202_ACCEPTED
        payload = response.json()
        assert payload["status"] == "queued"
        assert payload["task_id"] == "export-task-001"
        log_id = payload.get("export_log_id")
        assert log_id, "export_log_id should be returned to the client"

        log_entry = db_session.get(ValuationExportLog, log_id)
        assert log_entry is not None
        assert log_entry.valuation_id == valuation_id
        assert log_entry.organization_id == growth_user.organization_id
        assert log_entry.export_type == "pdf"
        assert log_entry.export_format == "summary"
        assert log_entry.exported_by == growth_user.id
        assert log_entry.scenario_id is None

        scenario_resp = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/scenarios",
            json=SCENARIO_PAYLOAD,
            headers=auth_headers_growth,
        )
        scenario_id = scenario_resp.json()["id"]

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "pdf", "export_format": "summary", "scenario_id": scenario_id},
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_202_ACCEPTED
        payload = response.json()
        scenario_log = db_session.get(ValuationExportLog, payload["export_log_id"])
        assert scenario_log is not None
        assert scenario_log.scenario_id == scenario_id

    def test_generate_export_forbidden_for_solo(self,
        client,
        create_deal_for_org,
        solo_user,
        growth_user,
        dependency_overrides,
    ):
        from app.api.dependencies.auth import get_current_user

        deal, _, _ = create_deal_for_org()

        # Create valuation as growth user
        dependency_overrides(get_current_user, lambda: growth_user)
        create_resp = _create_valuation(client, deal.id, {"Authorization": "Bearer growth"}, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        # Try to export as solo user (should fail)
        dependency_overrides(get_current_user, lambda: solo_user)
        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "pdf"},
            headers={"Authorization": "Bearer solo"},
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_generate_export_rejects_foreign_scenario(
        self,
        client,
        create_deal_for_org,
        auth_headers_growth,
        db_session,
    ):
        deal, growth_user, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]
        other_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        other_valuation_id = other_resp.json()["id"]

        scenario_resp = client.post(
            f"/api/deals/{deal.id}/valuations/{other_valuation_id}/scenarios",
            json=SCENARIO_PAYLOAD,
            headers=auth_headers_growth,
        )
        other_scenario_id = scenario_resp.json()["id"]

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "pdf", "scenario_id": other_scenario_id},
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        assert response.json()["detail"]["code"] == "SCENARIO_INVALID"
    def test_list_exports_returns_recent_logs(
        self,
        client,
        create_deal_for_org,
        auth_headers_growth,
        db_session,
        monkeypatch,
    ):
        from app.models.valuation import ValuationExportLog

        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        def fake_trigger_export_task(**kwargs):
            return {"task_id": "export-task-list", "status": "queued", **kwargs}

        monkeypatch.setattr(
            "app.services.valuation_service.trigger_export_task",
            fake_trigger_export_task,
        )

        queue_resp = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "excel", "export_format": "summary"},
            headers=auth_headers_growth,
        )

        assert queue_resp.status_code == status.HTTP_202_ACCEPTED

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert isinstance(body, list) and len(body) == 1
        entry = body[0]
        assert entry["task_id"] == "export-task-list"
        assert entry["status"] == "queued"
        assert entry["export_type"] == "excel"

        log = db_session.get(ValuationExportLog, entry["id"])
        assert log is not None

    def test_get_export_status_reflects_updates(
        self,
        client,
        create_deal_for_org,
        auth_headers_growth,
        db_session,
        monkeypatch,
    ):
        from app.models.valuation import ValuationExportLog

        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        def fake_trigger_export_task(**kwargs):
            return {"task_id": "export-task-status", "status": "queued", **kwargs}

        monkeypatch.setattr(
            "app.services.valuation_service.trigger_export_task",
            fake_trigger_export_task,
        )

        queue_resp = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports",
            json={"export_type": "pdf", "export_format": "full_model"},
            headers=auth_headers_growth,
        )

        assert queue_resp.status_code == status.HTTP_202_ACCEPTED
        log_id = queue_resp.json()["export_log_id"]

        log_entry = db_session.get(ValuationExportLog, log_id)
        log_entry.status = "completed"
        log_entry.download_url = "https://files.example.com/export-task-status.pdf"
        log_entry.file_size_bytes = 2048
        log_entry.completed_at = datetime.now(timezone.utc)
        db_session.add(log_entry)
        db_session.commit()

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/exports/{log_entry.task_id}",
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["status"] == "completed"
        assert body["download_url"] == "https://files.example.com/export-task-status.pdf"
        assert body["file_size_bytes"] == 2048
        assert body["completed_at"] is not None

    def test_run_monte_carlo_simulation(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/monte-carlo",
            json={"iterations": 10, "seed": 123},
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert body["iterations"] == 10
        assert body["seed"] == 123
        assert body["percentiles"]["p50"] > 0

    def test_run_monte_carlo_validation(self, client, create_deal_for_org, auth_headers_growth):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/monte-carlo",
            json={"iterations": 0},
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        detail = response.json()["detail"]
        if isinstance(detail, dict):
            assert detail.get("code") == "INVALID_MONTE_CARLO"
    def test_get_scenario_summary_via_api(
        self,
        client,
        create_deal_for_org,
        auth_headers_growth,
    ):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/scenarios",
            json={
                "name": "Upside",
                "description": "More growth",
                "assumptions": {"discount_rate": 0.1},
            },
            headers=auth_headers_growth,
        )

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/scenarios/summary",
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_200_OK
        summary = response.json()
        assert summary["count"] == 1
        assert summary["enterprise_value_range"]["median"] is None  # no EV yet

    def test_get_scenario_summary_forbidden_for_solo_tier(
        self,
        client,
        create_deal_for_org,
        auth_headers,
        db_session,
    ):
        deal, growth_user, _ = create_deal_for_org()
        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=deal.organization_id,
            created_by=growth_user.id,
            **VALUATION_PAYLOAD,
        )

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation.id}/scenarios/summary",
            headers=auth_headers,
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
