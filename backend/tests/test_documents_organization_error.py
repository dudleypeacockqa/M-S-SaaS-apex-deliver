"""
TDD Tests for Document API Organization Error Paths

Tests for document endpoints when organization_id is missing.
"""
import io
import os
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user
from app.models.deal import Deal, DealStage
from app.models.user import UserRole

dependency_overrides = None


@pytest.fixture(autouse=True)
def _bind_dependency_overrides_fixture(dependency_overrides):
    globals()["dependency_overrides"] = dependency_overrides
    yield
    globals()["dependency_overrides"] = None


@pytest.fixture(autouse=True)
def override_storage(tmp_path):
    """Ensure uploads use a temporary directory during tests."""
    os.environ["STORAGE_PATH"] = str(tmp_path)

    from app.services import storage_service as storage_module

    storage_module._storage_service = storage_module.LocalStorageService(base_path=tmp_path)  # type: ignore[attr-defined]
    yield
    storage_module._storage_service = None  # type: ignore[attr-defined]


@pytest.fixture()
def user_no_org(create_user, db_session):
    """Create a user without organization_id."""
    user = create_user(
        email="noorg@example.com",
        first_name="No",
        last_name="Org",
        role=UserRole.enterprise,
        organization_id=None,  # No organization
    )
    return user


@pytest.fixture()
def auth_headers_no_org(user_no_org, dependency_overrides):
    """Auth headers for user without organization."""
    dependency_overrides(get_current_user, lambda: user_no_org)
    headers = {"Authorization": f"Bearer mock_token_{user_no_org.id}"}
    yield headers
    # Cleanup handled by autouse fixture


@pytest.fixture()
def deal_no_org(db_session, user_no_org, create_organization):
    """Create a deal for testing (user has no org, but deal needs one)."""
    org = create_organization(name="Test Org")
    deal = Deal(
        id=str(uuid4()),
        name="Test Deal",
        target_company="TargetCo",
        organization_id=str(org.id),
        owner_id=str(user_no_org.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)
    return deal


def test_upload_document_no_organization(client, auth_headers_no_org, deal_no_org):
    """Test uploading document when user has no organization_id."""
    response = client.post(
        f"/api/deals/{deal_no_org.id}/documents",
        headers=auth_headers_no_org,
        files={"file": ("test.pdf", io.BytesIO(b"content"), "application/pdf")},
    )
    # May return 400 or 404 depending on validation order
    assert response.status_code in [400, 404]
    detail = response.json().get("detail", "").lower()
    assert "organization" in detail or "not found" in detail


def test_create_folder_no_organization(client, auth_headers_no_org, deal_no_org):
    """Test creating folder when user has no organization_id."""
    response = client.post(
        f"/api/deals/{deal_no_org.id}/folders",
        headers=auth_headers_no_org,
        json={"name": "Test Folder"},
    )
    # May return 400 or 404 depending on validation order
    assert response.status_code in [400, 404]
    detail = response.json().get("detail", "").lower()
    assert "organization" in detail or "not found" in detail


def test_list_documents_no_organization(client, auth_headers_no_org, deal_no_org):
    """Test listing documents when user has no organization_id."""
    response = client.get(
        f"/api/deals/{deal_no_org.id}/documents",
        headers=auth_headers_no_org,
    )
    assert response.status_code == 400
    assert "organization" in response.json()["detail"].lower()

