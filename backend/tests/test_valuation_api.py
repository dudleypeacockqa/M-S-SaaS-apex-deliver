"""RED-phase API tests for valuation endpoints (DEV-011)."""

from uuid import uuid4

from fastapi import status


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

    def test_cannot_access_other_org_valuation(self, client, create_deal_for_org, auth_headers_growth, create_organization, create_user):
        deal, _, _ = create_deal_for_org()
        create_resp = _create_valuation(client, deal.id, auth_headers_growth, VALUATION_PAYLOAD)
        valuation_id = create_resp.json()["id"]

        other_org = create_organization(subscription_tier="growth")

        other_user = create_user(role="growth", organization_id=other_org.id)

        from app.api.dependencies.auth import get_current_user
        from app.main import app

        def override_user():
            return other_user

        app.dependency_overrides[get_current_user] = override_user

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            headers={"Authorization": "Bearer mock_growth_token"},
        )

        app.dependency_overrides.pop(get_current_user, None)

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