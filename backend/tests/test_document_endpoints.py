"""Integration tests for document and folder endpoints (DEV-008)."""
from __future__ import annotations

import io
import os
from uuid import uuid4

import pytest
from fastapi import status

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
        email="docs@example.com", first_name="Doc", last_name="Owner",
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


# ============================================================================
# DOCUMENT VERSIONING TESTS (US-8.5)
# ============================================================================


def test_upload_same_name_creates_new_version(client, auth_context, seeded_deal, db_session):
    """Test uploading file with same name creates new version instead of replacing."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload v1
        v1_content = b"Version 1 content"
        response_v1 = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("report.pdf", io.BytesIO(v1_content), "application/pdf")},
        )
        assert response_v1.status_code == 201
        doc_v1 = response_v1.json()
        assert doc_v1["version"] == 1
        doc_id = doc_v1["id"]

        # Upload v2 with same name
        v2_content = b"Version 2 content - updated"
        response_v2 = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("report.pdf", io.BytesIO(v2_content), "application/pdf")},
        )
        assert response_v2.status_code == 201
        doc_v2 = response_v2.json()
        assert doc_v2["version"] == 2
        assert doc_v2["parent_document_id"] == doc_id
        assert doc_v2["name"] == "report.pdf"
        assert doc_v2["file_size"] == len(v2_content)
    finally:
        cleanup()


def test_list_document_versions(client, auth_context, seeded_deal):
    """Test listing all versions of a document."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload 3 versions
        doc_id = None
        for i in range(1, 4):
            content = f"Version {i}".encode()
            response = client.post(
                f"/api/deals/{seeded_deal.id}/documents",
                headers=headers,
                files={"file": ("contract.pdf", io.BytesIO(content), "application/pdf")},
            )
            if i == 1:
                doc_id = response.json()["id"]

        # List versions (should return all 3)
        versions_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/versions",
            headers=headers,
        )
        assert versions_resp.status_code == 200
        versions = versions_resp.json()
        assert len(versions) == 3
        assert versions[0]["version"] == 1
        assert versions[1]["version"] == 2
        assert versions[2]["version"] == 3
    finally:
        cleanup()


def test_download_specific_version(client, auth_context, seeded_deal):
    """Test downloading a specific version of a document."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload v1 and v2
        v1_content = b"Original content"
        v2_content = b"Updated content"

        response_v1 = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("memo.pdf", io.BytesIO(v1_content), "application/pdf")},
        )
        doc_id = response_v1.json()["id"]

        response_v2 = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("memo.pdf", io.BytesIO(v2_content), "application/pdf")},
        )
        v2_id = response_v2.json()["id"]

        # Download v1 specifically
        download_v1 = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/download",
            headers=headers,
        )
        assert download_v1.status_code == 200
        assert download_v1.content == v1_content

        # Download v2 specifically
        download_v2 = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{v2_id}/download",
            headers=headers,
        )
        assert download_v2.status_code == 200
        assert download_v2.content == v2_content
    finally:
        cleanup()


def test_restore_previous_version(client, auth_context, seeded_deal):
    """Test restoring a previous version creates a new version."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload v1, v2, v3
        for i in range(1, 4):
            content = f"Version {i}".encode()
            client.post(
                f"/api/deals/{seeded_deal.id}/documents",
                headers=headers,
                files={"file": ("plan.pdf", io.BytesIO(content), "application/pdf")},
            )

        # Get doc ID from list
        list_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
        )
        docs = list_resp.json()["items"]
        latest_doc = next(d for d in docs if d["name"] == "plan.pdf" and d["version"] == 3)

        # Get v1 ID from versions list
        versions_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents/{latest_doc['parent_document_id']}/versions",
            headers=headers,
        )
        versions = versions_resp.json()
        v1_id = versions[0]["id"]

        # Restore v1 (should create v4 with v1's content)
        restore_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{latest_doc['id']}/restore/{v1_id}",
            headers=headers,
        )
        assert restore_resp.status_code == 201
        restored = restore_resp.json()
        assert restored["version"] == 4
        assert restored["name"] == "plan.pdf"

        # Download restored version and verify content matches v1
        download_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{restored['id']}/download",
            headers=headers,
        )
        assert download_resp.content == b"Version 1"
    finally:
        cleanup()


def test_max_versions_enforced(client, auth_context, seeded_deal, db_session):
    """Test that maximum 20 versions are retained per document."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload 25 versions (should only keep latest 20)
        latest_doc_id = None
        for i in range(1, 26):
            content = f"Version {i}".encode()
            response = client.post(
                f"/api/deals/{seeded_deal.id}/documents",
                headers=headers,
                files={"file": ("policy.pdf", io.BytesIO(content), "application/pdf")},
            )
            assert response.status_code == 201
            latest_doc_id = response.json()["id"]

        # List versions using the latest document ID
        versions_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents/{latest_doc_id}/versions",
            headers=headers,
        )
        assert versions_resp.status_code == 200
        versions = versions_resp.json()
        assert len(versions) == 20
        # Should have versions 6-25 (oldest 5 deleted)
        assert versions[0]["version"] == 6
        assert versions[-1]["version"] == 25
    finally:
        cleanup()


def test_delete_document_archives_all_versions(client, auth_context, seeded_deal, db_session):
    """Test that deleting a document archives all its versions."""
    headers, cleanup, _, _ = auth_context
    try:
        # Upload 3 versions
        doc_id = None
        for i in range(1, 4):
            content = f"Version {i}".encode()
            response = client.post(
                f"/api/deals/{seeded_deal.id}/documents",
                headers=headers,
                files={"file": ("archive-test.pdf", io.BytesIO(content), "application/pdf")},
            )
            if i == 1:
                doc_id = response.json()["id"]

        # Delete the document
        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}",
            headers=headers,
        )
        assert delete_resp.status_code == 204

        # Verify all versions are archived (have archived_at timestamp)
        docs = db_session.query(Document).filter(
            Document.name == "archive-test.pdf",
            Document.deal_id == str(seeded_deal.id),
        ).all()
        assert len(docs) == 3
        assert all(doc.archived_at is not None for doc in docs)
    finally:
        cleanup()


# ============================================================================
# PERMISSION ENFORCEMENT TESTS (US-8.4)
# ============================================================================


def test_viewer_cannot_delete_document(client, auth_context, seeded_deal, create_user):
    """Viewers should not be able to delete documents."""
    headers, cleanup, owner_user, org_id = auth_context
    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("confidential.pdf", io.BytesIO(b"secret"), "application/pdf")},
        )
        doc_id = upload_resp.json()["id"]

        viewer = create_user(
            email="viewer@perm.example.com",
            role=UserRole.growth,
            organization_id=org_id,
        )

        # Owner grants viewer permission
        perm_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/permissions",
            headers=headers,
            json={"user_id": str(viewer.id), "permission_level": "viewer"},
        )
        assert perm_resp.status_code == 201

        from app.api.dependencies.auth import get_current_user
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: viewer
        viewer_headers = {"Authorization": f"Bearer mock_token_{viewer.id}"}

        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}",
            headers=viewer_headers,
        )
        assert delete_resp.status_code == 403
        assert "permission" in delete_resp.json()["detail"].lower()
    finally:
        cleanup()


def test_viewer_can_download_document(client, auth_context, seeded_deal, create_user):
    """Viewers should be allowed to download documents."""
    headers, cleanup, owner_user, org_id = auth_context
    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("factsheet.pdf", io.BytesIO(b"facts"), "application/pdf")},
        )
        doc_id = upload_resp.json()["id"]

        viewer = create_user(
            email="viewer-download@example.com",
            role=UserRole.growth,
            organization_id=org_id,
        )

        client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/permissions",
            headers=headers,
            json={"user_id": str(viewer.id), "permission_level": "viewer"},
        )

        from app.api.dependencies.auth import get_current_user
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: viewer
        viewer_headers = {"Authorization": f"Bearer mock_token_{viewer.id}"}

        download_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/download",
            headers=viewer_headers,
        )
        assert download_resp.status_code == 200
        assert download_resp.content == b"facts"
    finally:
        cleanup()


def test_editor_can_upload_with_folder_permission(client, auth_context, seeded_deal, create_user):
    """Editors with folder permission should be able to upload documents."""
    headers, cleanup, owner_user, org_id = auth_context
    try:
        folder_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Due Diligence"},
        )
        folder_id = folder_resp.json()["id"]

        editor = create_user(
            email="editor@perm.example.com",
            role=UserRole.growth,
            organization_id=org_id,
        )

        perm_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders/{folder_id}/permissions",
            headers=headers,
            json={"user_id": str(editor.id), "permission_level": "editor"},
        )
        assert perm_resp.status_code == 201

        from app.api.dependencies.auth import get_current_user
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: editor
        editor_headers = {"Authorization": f"Bearer mock_token_{editor.id}"}

        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents?folder_id={folder_id}",
            headers=editor_headers,
            files={"file": ("editor-note.txt", io.BytesIO(b"note"), "text/plain")},
        )
        assert upload_resp.status_code == 201
        assert upload_resp.json()["uploaded_by"] == str(editor.id)

        # Restore owner override for cleanup flows
        app.dependency_overrides[get_current_user] = lambda: owner_user
    finally:
        cleanup()


def test_document_listing_requires_permission(client, auth_context, seeded_deal, create_user):
    """Users without document or folder permission must not list deal documents."""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    headers, cleanup, owner_user, org_id = auth_context
    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("restricted.pdf", io.BytesIO(b"secret"), "application/pdf")},
        )
        assert upload_resp.status_code == status.HTTP_201_CREATED

        viewer = create_user(
            email="viewer-no-access@example.com",
            organization_id=org_id,
            role=UserRole.professional,
        )

        viewer_headers = {"Authorization": f"Bearer mock_token_{viewer.id}"}
        app.dependency_overrides[get_current_user] = lambda: viewer

        list_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=viewer_headers,
        )

        assert list_resp.status_code == status.HTTP_403_FORBIDDEN
    finally:
        app.dependency_overrides[get_current_user] = lambda: owner_user
        cleanup()


def test_granting_folder_permission_creates_audit_log(
    client,
    auth_context,
    seeded_deal,
    create_user,
):
    """Granting folder access should append an audit entry for contained documents."""
    headers, cleanup, owner_user, org_id = auth_context
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    try:
        folder_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Audit Room"},
        )
        assert folder_resp.status_code == status.HTTP_201_CREATED
        folder_id = folder_resp.json()["id"]

        doc_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents?folder_id={folder_id}",
            headers=headers,
            files={"file": ("folder-doc.pdf", io.BytesIO(b"audit"), "application/pdf")},
        )
        assert doc_resp.status_code == status.HTTP_201_CREATED
        document_id = doc_resp.json()["id"]

        viewer = create_user(
            email="audit-inherit@example.com",
            organization_id=org_id,
            role=UserRole.professional,
        )

        perm_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders/{folder_id}/permissions",
            headers=headers,
            json={"user_id": str(viewer.id), "permission_level": "viewer"},
        )
        assert perm_resp.status_code == status.HTTP_201_CREATED

        logs_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents/{document_id}/access-logs",
            headers=headers,
        )
        assert logs_resp.status_code == status.HTTP_200_OK
        actions = {entry["action"] for entry in logs_resp.json()}
        assert "permission_granted" in actions
    finally:
        cleanup()


def test_editor_cannot_delete_others_document(client, auth_context, seeded_deal, create_user):
    """Editors should not delete documents they did not upload."""
    headers, cleanup, owner_user, org_id = auth_context
    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("owner-file.pdf", io.BytesIO(b"owner"), "application/pdf")},
        )
        doc_id = upload_resp.json()["id"]

        editor = create_user(
            email="editor-delete@example.com",
            role=UserRole.growth,
            organization_id=org_id,
        )

        client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/permissions",
            headers=headers,
            json={"user_id": str(editor.id), "permission_level": "editor"},
        )

        from app.api.dependencies.auth import get_current_user
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: editor
        editor_headers = {"Authorization": f"Bearer mock_token_{editor.id}"}

        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}",
            headers=editor_headers,
        )
        assert delete_resp.status_code == 403
        assert "permission" in delete_resp.json()["detail"].lower()

        app.dependency_overrides[get_current_user] = lambda: owner_user
    finally:
        cleanup()


def test_editor_can_delete_own_document(client, auth_context, seeded_deal, create_user):
    """Editors should be able to delete documents they uploaded."""
    headers, cleanup, owner_user, org_id = auth_context
    try:
        folder_resp = client.post(
            f"/api/deals/{seeded_deal.id}/folders",
            headers=headers,
            json={"name": "Transactions"},
        )
        folder_id = folder_resp.json()["id"]

        editor = create_user(
            email="editor-own@example.com",
            role=UserRole.growth,
            organization_id=org_id,
        )

        client.post(
            f"/api/deals/{seeded_deal.id}/folders/{folder_id}/permissions",
            headers=headers,
            json={"user_id": str(editor.id), "permission_level": "editor"},
        )

        from app.api.dependencies.auth import get_current_user
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: editor
        editor_headers = {"Authorization": f"Bearer mock_token_{editor.id}"}

        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents?folder_id={folder_id}",
            headers=editor_headers,
            files={"file": ("editor-owned.pdf", io.BytesIO(b"content"), "application/pdf")},
        )
        assert upload_resp.status_code == 201
        doc_id = upload_resp.json()["id"]

        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}",
            headers=editor_headers,
        )
        assert delete_resp.status_code == 204

        app.dependency_overrides[get_current_user] = lambda: owner_user
    finally:
        cleanup()


def test_upload_same_name_creates_new_version(client, auth_context, seeded_deal):
    """Uploading a file with the same name should create a new version entry."""
    headers, cleanup, owner_user, _ = auth_context
    try:
        first_upload = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("financials.pdf", io.BytesIO(b"v1"), "application/pdf")},
        )
        assert first_upload.status_code == 201
        first_payload = first_upload.json()

        second_upload = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("financials.pdf", io.BytesIO(b"v2"), "application/pdf")},
        )
        assert second_upload.status_code == 201
        second_payload = second_upload.json()

        assert second_payload["version"] == 2
        assert second_payload["parent_document_id"] == first_payload["id"]
    finally:
        cleanup()


def test_delete_document_requires_editor_permission(
    client, auth_context, seeded_deal, create_user
):
    """View-only collaborators should be forbidden from deleting documents."""
    headers, cleanup, owner_user, org_id = auth_context
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("permission.pdf", io.BytesIO(b"content"), "application/pdf")},
        )
        assert upload_resp.status_code == 201
        document_id = upload_resp.json()["id"]

        viewer = create_user(email="viewer-permissions@example.com", organization_id=org_id)

        app.dependency_overrides[get_current_user] = lambda: owner_user
        grant_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{document_id}/permissions",
            headers=headers,
            json={"user_id": str(viewer.id), "permission_level": "viewer"},
        )
        assert grant_resp.status_code == 201

        viewer_headers = {"Authorization": f"Bearer mock_token_{viewer.id}"}
        app.dependency_overrides[get_current_user] = lambda: viewer
        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/documents/{document_id}",
            headers=viewer_headers,
        )
        assert delete_resp.status_code == 403
    finally:
        app.dependency_overrides[get_current_user] = lambda: owner_user
        cleanup()


def test_delete_document_records_audit_log(client, auth_context, seeded_deal):
    """Deleting a document should append a delete entry to the access log."""
    headers, cleanup, _, _ = auth_context
    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("audit.pdf", io.BytesIO(b"audit"), "application/pdf")},
        )
        assert upload_resp.status_code == 201
        document_id = upload_resp.json()["id"]

        delete_resp = client.delete(
            f"/api/deals/{seeded_deal.id}/documents/{document_id}",
            headers=headers,
        )
        assert delete_resp.status_code == 204
        logs_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents/{document_id}/access-logs",
            headers=headers,
        )
        assert logs_resp.status_code == 200
        actions = [entry["action"] for entry in logs_resp.json()]
        assert "delete" in actions
    finally:
        cleanup()


def test_access_logs_include_user_name(client, auth_context, seeded_deal):
    """Ensure audit log endpoint returns user-friendly actor details."""
    headers, cleanup, user, _ = auth_context
    try:
        upload_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents",
            headers=headers,
            files={"file": ("audit.pdf", io.BytesIO(b"audit"), "application/pdf")},
        )
        doc_id = upload_resp.json()["id"]

        download_resp = client.post(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/download",
            headers=headers,
        )
        assert download_resp.status_code == 200
        logs_resp = client.get(
            f"/api/deals/{seeded_deal.id}/documents/{doc_id}/access-logs",
            headers=headers,
        )

        assert logs_resp.status_code == 200
        entries = logs_resp.json()
        assert entries, "Expected at least one access log entry"

        latest = entries[0]
        assert latest["action"] == "download"
        assert latest["user_id"] == str(user.id)
        assert latest.get("user_name") == "Doc Owner"
    finally:
        cleanup()







