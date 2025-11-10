"""Tests for organization invitation admin endpoints."""
from __future__ import annotations

from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.services.invite_service import InvitationError


class _FakeOrganizationInvitations:
    def __init__(self) -> None:
        self.created_payloads: list[dict] = []

    def create(self, **kwargs):
        self.created_payloads.append(kwargs)
        return SimpleNamespace(
            id="inv_123",
            email_address=kwargs["email_address"],
            role=kwargs["role"],
            status="pending",
            organization_id=kwargs["organization_id"],
            created_at=1_700_000_000,
        )

    def list_pending(self, **kwargs):
        data = [
            SimpleNamespace(
                id="inv_123",
                email_address="pmi.ops@example.com",
                role="basic_member",
                status="pending",
                organization_id=kwargs["organization_id"],
                created_at=1_700_000_000,
            )
        ]
        return SimpleNamespace(data=data, total_count=1)


class _FakeClerk:
    def __init__(self) -> None:
        self.organization_invitations = _FakeOrganizationInvitations()


@pytest.fixture()
def fake_clerk(monkeypatch):
    from app.services import invite_service

    client = _FakeClerk()
    monkeypatch.setattr(invite_service, "get_clerk_client", lambda: client)
    return client


def ensure_org(db_session: Session, org_id: str) -> Organization:
    org = db_session.get(Organization, org_id)
    if org:
        return org
    org = Organization(id=org_id, name="Test Org", slug="test-org", subscription_tier="starter")
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


def test_create_invite_success(
    client: TestClient,
    auth_headers_admin: dict,
    db_session: Session,
    fake_clerk: _FakeClerk,
):
    ensure_org(db_session, "test-org-admin")

    payload = {
        "email": "ops.lead@example.com",
        "role": "admin",
        "playbook_focus": "pmi-revenue-acceleration",
        "note": "Bring finance lead into Sprint 2 scope",
    }

    response = client.post(
        "/api/admin/organizations/test-org-admin/invites",
        json=payload,
        headers=auth_headers_admin,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "ops.lead@example.com"
    assert data["role"] == "admin"
    assert data["status"] == "pending"
    assert fake_clerk.organization_invitations.created_payloads[0]["organization_id"] == "test-org-admin"


def test_create_invite_forbidden_for_other_org(
    client: TestClient,
    auth_headers_admin: dict,
    db_session: Session,
    fake_clerk: _FakeClerk,
):
    ensure_org(db_session, "another-org")

    response = client.post(
        "/api/admin/organizations/another-org/invites",
        json={"email": "outsider@example.com"},
        headers=auth_headers_admin,
    )

    assert response.status_code == 403


def test_create_invite_handles_clerk_error(
    client: TestClient,
    auth_headers_admin: dict,
    db_session: Session,
    monkeypatch,
):
    ensure_org(db_session, "test-org-admin")

    def _fail(**_kwargs):
        raise InvitationError("duplicate invitation")

    from app.services import invite_service

    monkeypatch.setattr(invite_service, "create_invitation", _fail)

    response = client.post(
        "/api/admin/organizations/test-org-admin/invites",
        json={"email": "duplicate@example.com"},
        headers=auth_headers_admin,
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "duplicate invitation"


def test_list_invites_success(
    client: TestClient,
    auth_headers_admin: dict,
    db_session: Session,
    fake_clerk: _FakeClerk,
):
    ensure_org(db_session, "test-org-admin")

    response = client.get(
        "/api/admin/organizations/test-org-admin/invites",
        headers=auth_headers_admin,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["email"] == "pmi.ops@example.com"
