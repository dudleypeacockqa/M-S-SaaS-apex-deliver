"""Integration tests for document and folder endpoints (DEV-008)."""
from __future__ import annotations

import io
import os
from uuid import uuid4

import pytest

from app.models.deal import Deal, DealStage
from app.models.document import Document, DocumentAccessLog
from app.models.user import UserRole


@pytest.fixture(autouse=True)
def override_storage(tmp_path):
    """Ensure uploads use a temporary directory during tests."""
    os.environ["STORAGE_PATH"] = str(tmp_path)

    from app.services import storage_service as storage_module

    storage_module._storage_service = storage_module.StorageService(base_path=tmp_path)  # type: ignore[attr-defined]
    yield
    storage_module._storage_service = None  # type: ignore[attr-defined]


@pytest.fixture()
def auth_context(create_user, create_organization):
    """Provision a user + org, returning auth headers, cleanup callback, and org id."""
    org = create_organization(name="Doc Org")
    user = create_user(
        email="docs@example.com",
        role=UserRole.enterprise,
        organization_id=str(org.id),
    )

    from app.api.dependencies.auth import get_current_user
    from app.main import app

    app.dependency_overrides[get_current_user] = lambda: user

    headers = {"Authorization": f"Bearer mock_token_{user.id}"}

    def cleanup():
        app.dependency_overrides.pop(get_current_user, None)

    return headers, cleanup, user, str(org.id)


@pytest.fixture()
def seeded_deal(db_session, auth_context):
    headers, cleanup, user, org_id = auth_context
    deal = Deal(
        id=str(uuid4()),
        name="Secure Deal",
        target_company="TargetCo",
        organization_id=org_id,
        owner_id=str(user.id),
        stage=DealStage.sourcing,
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)
    return deal


def test_create_folder_success(client, auth_context, seeded_deal):
    headers, cleanup, _, org_id = auth_context
    try:
        response = client.post(
            "/documents/folders",
            headers=headers,
            json={"deal_id": str(seeded_deal.id), "name": "Due Diligence"},
        )

        assert response.status_code == 201
        body = response.json()
        assert body["name"] == "Due Diligence"
        assert body["deal_id"] == str(seeded_deal.id)
        assert body["organization_id"] == org_id
        assert body["document_count"] == 0
    finally:
        cleanup()


def test_upload_document_success(client, auth_context, seeded_deal, db_session):
    headers, cleanup, _, _ = auth_context
    try:
        content = b"Quarterly numbers"
        response = client.post(
            "/documents/upload",
            headers=headers,
            files={"file": ("financials.pdf", io.BytesIO(content), "application/pdf")},
            data={"deal_id": str(seeded_deal.id)},
        )

        assert response.status_code == 201
        payload = response.json()
        assert payload["name"] == "financials.pdf"
        assert payload["file_size"] == len(content)
        assert payload["version"] == 1

        stored = db_session.get(Document, payload["id"])
        assert stored is not None
        assert stored.deal_id == str(seeded_deal.id)
    finally:
        cleanup()


def test_upload_document_rejects_large_files(client, auth_context, seeded_deal):
    headers, cleanup, _, _ = auth_context
    try:
        huge_blob = b"x" * (51 * 1024 * 1024)
        response = client.post(
            "/documents/upload",
            headers=headers,
            files={"file": ("too-big.pdf", io.BytesIO(huge_blob), "application/pdf")},
            data={"deal_id": str(seeded_deal.id)},
        )

        assert response.status_code == 400
        assert "exceeds" in response.json()["detail"].lower()
    finally:
        cleanup()


def test_list_documents_filters_by_folder(client, auth_context, seeded_deal):
    headers, cleanup, _, _ = auth_context
    try:
        folder_resp = client.post(
            "/documents/folders",
            headers=headers,
            json={"deal_id": str(seeded_deal.id), "name": "Financials"},
        )
        folder_id = folder_resp.json()["id"]

        client.post(
            "/documents/upload",
            headers=headers,
            files={
                "file": (
                    "metrics.xlsx",
                    io.BytesIO(b"data"),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
            },
            data={"deal_id": str(seeded_deal.id), "folder_id": folder_id},
        )

        list_resp = client.get(
            f"/documents?deal_id={seeded_deal.id}&folder_id={folder_id}",
            headers=headers,
        )

        assert list_resp.status_code == 200
        payload = list_resp.json()
        assert payload["total"] == 1
        assert payload["items"][0]["name"] == "metrics.xlsx"
        assert payload["items"][0]["folder_id"] == folder_id
    finally:
        cleanup()


def test_download_document_records_access_log(client, auth_context, seeded_deal, db_session):
    headers, cleanup, _, _ = auth_context
    try:
        upload_resp = client.post(
            "/documents/upload",
            headers=headers,
            files={"file": ("nda.pdf", io.BytesIO(b"nda"), "application/pdf")},
            data={"deal_id": str(seeded_deal.id)},
        )
        doc_id = upload_resp.json()["id"]

        download = client.get(
            f"/documents/{doc_id}/download",
            headers=headers,
        )

        assert download.status_code == 200
        assert download.content == b"nda"

        log_count = (
            db_session.query(DocumentAccessLog)
            .filter_by(document_id=doc_id, action="download")
            .count()
        )
        assert log_count == 1
    finally:
        cleanup()


def test_set_document_permission(client, auth_context, seeded_deal, create_user):
    headers, cleanup, owner, org_id = auth_context
    try:
        viewer = create_user(
            email="viewer@example.com",
            role=UserRole.growth,
            organization_id=org_id,
        )

        upload_resp = client.post(
            "/documents/upload",
            headers=headers,
            files={"file": ("report.pdf", io.BytesIO(b"report"), "application/pdf")},
            data={"deal_id": str(seeded_deal.id)},
        )
        doc_id = upload_resp.json()["id"]

        perm_resp = client.post(
            f"/documents/{doc_id}/permissions",
            headers=headers,
            json={"user_id": str(viewer.id), "permission_level": "viewer"},
        )

        assert perm_resp.status_code == 201
        body = perm_resp.json()
        assert body["user_id"] == str(viewer.id)
        assert body["permission_level"] == "viewer"
    finally:
        cleanup()
