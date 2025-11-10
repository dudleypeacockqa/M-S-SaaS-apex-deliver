"""Tests for organization listing search and health endpoints."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.organization import Organization
from app.models.user import User, UserRole
from uuid import uuid4


def seed_org(db: Session, org_id: str, name: str, tier: str = "starter") -> Organization:
    org = Organization(id=org_id, name=name, slug=name.lower().replace(" ", "-"), subscription_tier=tier)
    db.add(org)
    db.commit()
    db.refresh(org)
    return org


def seed_user(db: Session, org_id: str) -> User:
    user = User(
        clerk_user_id=f"clerk_{uuid4()}",
        email=f"{uuid4()}@example.com",
        role=UserRole.solo,
        organization_id=org_id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_list_organizations_supports_search(client: TestClient, auth_headers_admin: dict, db_session: Session):
    seed_org(db_session, "org-alpha", "Alpha Capital", tier="enterprise")
    seed_org(db_session, "org-beta", "Beta Ventures", tier="starter")

    response = client.get(
        "/api/admin/organizations?search=alpha",
        headers=auth_headers_admin,
    )

    assert response.status_code == 200
    data = response.json()
    matches = [org for org in data["items"] if org["name"] == "Alpha Capital"]
    assert len(matches) == 1
    assert "health_status" in data["items"][0]


def test_get_organization_health_endpoint(
    client: TestClient,
    auth_headers_admin: dict,
    db_session: Session,
):
    org = seed_org(db_session, "org-health", "Health Org", tier="professional")
    # ensure admin belongs to this org
    admin = db_session.query(User).filter(User.clerk_user_id == "test_clerk_admin_user").first()
    admin.organization_id = org.id
    db_session.commit()

    for _ in range(3):
        seed_user(db_session, org.id)

    response = client.get(f"/api/admin/organizations/{org.id}/health", headers=auth_headers_admin)

    assert response.status_code == 200
    data = response.json()
    assert data["status"] in {"green", "amber", "red"}
    assert len(data["checks"]) == 4
    labels = [check["label"] for check in data["checks"]]
    assert "Sprint 0 · Stability & Protection" in labels
