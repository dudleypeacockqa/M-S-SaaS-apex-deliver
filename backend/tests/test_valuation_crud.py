"""RED-phase tests for valuation CRUD operations (DEV-011)."""

from datetime import datetime
from uuid import uuid4

import pytest
from fastapi import status
from app.api.dependencies.auth import get_current_user
from app.main import app

from app.models.valuation import (
    ValuationModel,
    ComparableCompany,
    PrecedentTransaction,
    ValuationScenario,
    ValuationExportLog,
)


@pytest.fixture()
def valuation_payload():
    return {
        "forecast_years": 5,
        "discount_rate": 0.12,
        "terminal_growth_rate": 0.03,
        "terminal_method": "gordon_growth",
        "cash_flows": [500000, 650000, 800000, 950000, 1100000],
        "terminal_cash_flow": 1200000,
        "net_debt": 2000000,
        "shares_outstanding": 1000000,
    }


@pytest.fixture()
def comparable_payload():
    return {
        "company_name": "Peer Co",
        "ev_ebitda_multiple": 8.4,
        "weight": 1.0,
    }


@pytest.fixture()
def precedent_payload():
    return {
        "target_company": "Target Co",
        "acquirer_company": "Buyer Inc",
        "deal_value": 18_000_000,
        "ev_ebitda_multiple": 7.6,
        "weight": 1.0,
    }


class TestValuationCrudApi:
    def test_create_valuation_creates_record(self, client, create_deal_for_org, auth_headers_growth, db_session, valuation_payload):
        deal, growth_user, _ = create_deal_for_org()

        response = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_201_CREATED
        body = response.json()
        assert body["deal_id"] == deal.id

        created = db_session.query(ValuationModel).filter_by(id=body["id"]).first()
        assert created is not None
        assert created.created_by == growth_user.id
        assert created.enterprise_value and created.enterprise_value > 0

        # GET endpoint returns same valuation
        fetch_resp = client.get(
            f"/api/deals/{deal.id}/valuations/{body['id']}",
            headers=auth_headers_growth,
        )
        assert fetch_resp.status_code == status.HTTP_200_OK
        assert fetch_resp.json()["id"] == body['id']

    def test_create_valuation_requires_growth_tier(self, client, create_deal_for_org, auth_headers, valuation_payload):
        deal, _, _ = create_deal_for_org()

        response = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers,
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_update_valuation_modifies_record(self, client, create_deal_for_org, auth_headers_growth, valuation_payload):
        deal, _, _ = create_deal_for_org()
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]

        update_payload = {"discount_rate": 0.1, "terminal_growth_rate": 0.025}
        update_resp = client.put(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            json=update_payload,
            headers=auth_headers_growth,
        )

        assert update_resp.status_code == status.HTTP_200_OK
        assert update_resp.json()["discount_rate"] == 0.1
        assert update_resp.json()["terminal_growth_rate"] == 0.025
        assert update_resp.json()["enterprise_value"] > 0

    def test_delete_valuation_returns_204(self, client, create_deal_for_org, auth_headers_growth, valuation_payload, db_session):
        deal, _, _ = create_deal_for_org()
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]

        delete_resp = client.delete(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            headers=auth_headers_growth,
        )

        assert delete_resp.status_code == status.HTTP_204_NO_CONTENT
        assert db_session.query(ValuationModel).filter_by(id=valuation_id).first() is None

    def test_add_comparable_company(self, client, create_deal_for_org, auth_headers_growth, valuation_payload, comparable_payload):
        deal, _, _ = create_deal_for_org()
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/comparables",
            json=comparable_payload,
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_201_CREATED
        body = response.json()
        assert body["company_name"] == "Peer Co"

    def test_add_precedent_transaction(self, client, create_deal_for_org, auth_headers_growth, valuation_payload, precedent_payload):
        deal, _, _ = create_deal_for_org()
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]

        response = client.post(
            f"/api/deals/{deal.id}/valuations/{valuation_id}/transactions",
            json=precedent_payload,
            headers=auth_headers_growth,
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["target_company"] == "Target Co"

    def test_create_scenario_requires_growth_tier(self, client, create_deal_for_org, auth_headers, valuation_payload):
        deal, _, _ = create_deal_for_org()
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers,
        )

        assert create_resp.status_code == status.HTTP_403_FORBIDDEN


class TestValuationAccessControl:
    def test_cannot_access_other_org_deal(self, client, create_deal_for_org, auth_headers_growth, valuation_payload, create_organization, create_user):
        deal, _, _ = create_deal_for_org()
        create_resp = client.post(
            f"/api/deals/{deal.id}/valuations",
            json=valuation_payload,
            headers=auth_headers_growth,
        )
        valuation_id = create_resp.json()["id"]

        other_org = create_organization(subscription_tier="growth")
        other_user = create_user(role="growth", organization_id=other_org.id)

        app_original = app.dependency_overrides.get(get_current_user)
        app.dependency_overrides[get_current_user] = lambda: other_user

        response = client.get(
            f"/api/deals/{deal.id}/valuations/{valuation_id}",
            headers={"Authorization": "Bearer mock_growth_token"},
        )

        if app_original is not None:
            app.dependency_overrides[get_current_user] = app_original
        else:
            app.dependency_overrides.pop(get_current_user, None)

        assert response.status_code in {status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND}


class TestValuationServiceOps:
    def test_create_valuation_calculates_metrics(self, db_session, valuation_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        assert valuation.enterprise_value is not None
        assert valuation.equity_value is not None
        assert valuation.implied_share_price is not None

    def test_update_valuation_recalculates(self, db_session, valuation_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        original_ev = valuation.enterprise_value

        updated = valuation_service.update_valuation(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            updates={"discount_rate": 0.1},
        )

        assert updated.discount_rate == 0.1
        assert updated.enterprise_value != original_ev

    def test_add_comparable_records(self, db_session, valuation_payload, comparable_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        comparable = valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            **comparable_payload,
        )

        assert comparable.company_name == "Peer Co"

    def test_add_precedent_records(self, db_session, valuation_payload, precedent_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        precedent = valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            **precedent_payload,
        )

        assert precedent.target_company == "Target Co"

    def test_create_scenario_persists(self, db_session, valuation_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        scenario = valuation_service.create_scenario(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            name="Upside",
            assumptions={"discount_rate": 0.1},
        )

        assert scenario.name == "Upside"
        assert db_session.get(ValuationScenario, scenario.id) is not None

    def test_generate_export_log_entry(self, db_session, valuation_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        log_entry = valuation_service.log_export_event(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            export_type="pdf",
            export_format="summary",
            exported_by=valuation.created_by,
            file_size_bytes=256000,
            document_id=None,
        )

        assert log_entry.export_type == "pdf"
        assert db_session.get(ValuationExportLog, log_entry.id) is not None

    def test_delete_valuation_cascades(self, db_session, valuation_payload, comparable_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            **comparable_payload,
        )

        deleted = valuation_service.delete_valuation(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )

        assert deleted is True
        assert db_session.get(ValuationModel, valuation.id) is None

    def test_calculate_comparable_multiples(self, db_session, valuation_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
            **valuation_payload,
        )

        valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp A",
            ev_ebitda_multiple=8.0,
            weight=1.0,
        )
        valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp B",
            ev_ebitda_multiple=10.0,
            weight=1.0,
        )

        multiples = valuation_service.calculate_comparable_multiples(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )

        assert multiples["ev_ebitda"]["min"] == 8.0
        assert multiples["ev_ebitda"]["max"] == 10.0

    def test_calculate_precedent_multiples(self, db_session, valuation_payload, create_deal_for_org):
        from app.services import valuation_service

        deal, owner, org = create_deal_for_org()

        valuation = valuation_service.create_valuation(
            db=db_session,
            deal_id=deal.id,
            organization_id=org.id,
            created_by=owner.id,
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
        )
        valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            target_company="T2",
            acquirer_company="Buyer 2",
            ev_ebitda_multiple=8.5,
            weight=1.0,
        )

        multiples = valuation_service.calculate_precedent_multiples(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
        )

        assert multiples["ev_ebitda"]["min"] == 7.5
        assert multiples["ev_ebitda"]["max"] == 8.5
