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
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Due Diligence"},
        )

        assert response.status_code == 201
        body = response.json()
        assert body["name"] == "Due Diligence"
        assert body["deal_id"] == str(seeded_deal.id)
        assert body["organization_id"] == org_id
    finally:
        cleanup()


def test_upload_document_success(client, auth_context, seeded_deal, db_session):
    headers, cleanup, _, _ = auth_context
    try:
        content = b"Quarterly numbers"
        response = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("financials.pdf", io.BytesIO(content), "application/pdf")},
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
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("too-big.pdf", io.BytesIO(huge_blob), "application/pdf")},
        )

        assert response.status_code == 400
        assert "exceeds" in response.json()["detail"].lower()
    finally:
        cleanup()


def test_list_documents_filters_by_folder(client, auth_context, seeded_deal):
    headers, cleanup, _, _ = auth_context
    try:
        folder_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Financials"},
        )
        folder_id = folder_resp.json()["id"]

        client.post(
            f"/api/deals/{seeded_deal.id}/documents?folder_id={folder_id}",
            headers=headers,
            files={
                "file": (
                    "metrics.xlsx",
                    io.BytesIO(b"data"),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
            },
        )

        list_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents?folder_id={folder_id}",
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
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("nda.pdf", io.BytesIO(b"nda"), "application/pdf")},
        )
        doc_id = upload_resp.json()["id"]

        download = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/download",
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
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("report.pdf", io.BytesIO(b"report"), "application/pdf")},
        )
        doc_id = upload_resp.json()["id"]

        perm_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/permissions",
            headers=headers,
            json={"user_id": str(viewer.id), "permission_level": "viewer"},
        )

        assert perm_resp.status_code == 201
        body = perm_resp.json()
        assert body["user_id"] == str(viewer.id)
        assert body["permission_level"] == "viewer"
    finally:
        cleanup()


# ============================================================================
# FOLDER TESTS - Additional Coverage
# ============================================================================


def test_create_nested_folder(client, auth_context, seeded_deal):
    """Test creating nested folders (parent-child hierarchy)."""
    headers, cleanup, _, _ = auth_context
    try:
        # Create parent folder
        parent_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Legal"},
        )
        assert parent_resp.status_code == 201
        parent_id = parent_resp.json()["id"]

        # Create child folder
        child_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Contracts", "parent_folder_id": parent_id},
        )
        assert child_resp.status_code == 201
        child_body = child_resp.json()
        assert child_body["name"] == "Contracts"
        assert child_body["parent_folder_id"] == parent_id
    finally:
        cleanup()


def test_rename_folder(client, auth_context, seeded_deal):
    """Test renaming a folder."""
    headers, cleanup, _, _ = auth_context
    try:
        create_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Old Name"},
        )
        folder_id = create_resp.json()["id"]

        update_resp = client.put(
            f"/api/deals/{seeded_deal.id}/folders/{folder_id}",
            headers=headers,
            json={"name": "New Name"},
        )
        assert update_resp.status_code == 200
        assert update_resp.json()["name"] == "New Name"
    finally:
        cleanup()


def test_delete_empty_folder(client, auth_context, seeded_deal):
    """Test deleting an empty folder."""
    headers, cleanup, _, _ = auth_context
    try:
        create_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Empty Folder"},
        )
        folder_id = create_resp.json()["id"]

        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/folders/{folder_id}",
            headers=headers,
        )
        assert delete_resp.status_code == 204
    finally:
        cleanup()


def test_delete_non_empty_folder_fails(client, auth_context, seeded_deal):
    """Test that deleting a folder with documents fails."""
    headers, cleanup, _, _ = auth_context
    try:
        # Create folder
        folder_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Non-Empty"},
        )
        folder_id = folder_resp.json()["id"]

        # Upload document to folder
        client.post(
            f"/api/deals/{seeded_deal.id}/documents?folder_id={folder_id}",
            headers=headers,
            files={"file": ("doc.pdf", io.BytesIO(b"content"), "application/pdf")},
        )

        # Attempt to delete non-empty folder
        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/folders/{folder_id}",
            headers=headers,
        )
        assert delete_resp.status_code == 400
        assert "not empty" in delete_resp.json()["detail"].lower()
    finally:
        cleanup()


def test_folder_requires_authentication(client, seeded_deal):
    """Test that folder endpoints require authentication."""
    # Ensure no auth override is active
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    # Clear any existing overrides
    app.dependency_overrides.pop(get_current_user, None)

    response = client.post(
        f"/api/deals/{seeded_deal.id}/folders",
        json={"name": "Unauthorized"},
    )
    assert response.status_code in [401, 403]


def test_folder_organization_isolation(client, auth_context, seeded_deal, create_user, create_organization):
    """Test that folders are isolated by organization."""
    headers, cleanup, _, org_id = auth_context
    try:
        # Create folder in org 1
        folder_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Org1 Folder"},
        )
        folder_id = folder_resp.json()["id"]

        # Create user in different organization
        other_org = create_organization(name="Other Org")
        other_user = create_user(
            email="other@example.com",
            role=UserRole.enterprise,
            organization_id=str(other_org.id),
        )

        from app.api.dependencies.auth import get_current_user
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: other_user
        other_headers = {"Authorization": f"Bearer mock_token_{other_user.id}"}

        # Attempt to access folder from other org
        get_resp = client.get(
            f"/api/deals/{seeded_deal.id}/folders/{folder_id}",
            headers=other_headers,
        )
        assert get_resp.status_code == 404  # Should not find folder from other org
    finally:
        cleanup()


# ============================================================================
# DOCUMENT TESTS - Additional Coverage
# ============================================================================


def test_upload_multiple_documents(client, auth_context, seeded_deal):
    """Test uploading multiple documents at once."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload first document
        resp1 = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("doc1.pdf", io.BytesIO(b"content1"), "application/pdf")},
        )
        assert resp1.status_code == 201

        # Upload second document
        resp2 = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("doc2.pdf", io.BytesIO(b"content2"), "application/pdf")},
        )
        assert resp2.status_code == 201

        # List documents
        list_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
        )
        assert list_resp.status_code == 200
        assert list_resp.json()["total"] >= 2
    finally:
        cleanup()


def test_upload_unsupported_file_type(client, auth_context, seeded_deal):
    """Test that unsupported file types are rejected."""
    headers, cleanup, _, _ = auth_context
    try:
        response = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("malware.exe", io.BytesIO(b"virus"), "application/x-msdownload")},
        )
        assert response.status_code == 400
        assert "unsupported" in response.json()["detail"].lower() or "not allowed" in response.json()["detail"].lower()
    finally:
        cleanup()


def test_upload_creates_audit_log(client, auth_context, seeded_deal, db_session):
    """Test that uploads are logged in audit trail."""
    headers, cleanup, _, _ = auth_context
    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("audit.pdf", io.BytesIO(b"content"), "application/pdf")},
        )
        doc_id = upload_resp.json()["id"]

        log_count = (
            db_session.query(DocumentAccessLog)
            .filter_by(document_id=doc_id, action="upload")
            .count()
        )
        assert log_count == 1
    finally:
        cleanup()


def test_search_documents_by_filename(client, auth_context, seeded_deal):
    """Test searching documents by filename."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload documents
        client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("financial_report_2024.pdf", io.BytesIO(b"data"), "application/pdf")},
        )
        client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("legal_contract.pdf", io.BytesIO(b"data"), "application/pdf")},
        )

        # Search for "financial"
        search_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents?search=financial",
            headers=headers,
        )
        assert search_resp.status_code == 200
        items = search_resp.json()["items"]
        assert len(items) == 1
        assert "financial" in items[0]["name"].lower()
    finally:
        cleanup()


def test_filter_documents_by_file_type(client, auth_context, seeded_deal):
    """Test filtering documents by file type."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload PDF
        client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("doc.pdf", io.BytesIO(b"pdf"), "application/pdf")},
        )
        # Upload Excel
        client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("sheet.xlsx", io.BytesIO(b"xlsx"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        )

        # Filter for PDFs
        filter_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents?file_type=pdf",
            headers=headers,
        )
        assert filter_resp.status_code == 200
        items = filter_resp.json()["items"]
        assert all("pdf" in item["file_type"].lower() for item in items)
    finally:
        cleanup()

