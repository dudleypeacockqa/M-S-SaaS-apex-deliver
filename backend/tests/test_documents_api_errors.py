"""Document API multi-tenant isolation tests."""
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.models.document import Document

def _create_document(db_session: Session, deal, org, uploader, name="doc.pdf") -> Document:
    document = Document(
        name=name,
        file_key=f"key-{name}",
        file_size=128,
        file_type="application/pdf",
        deal_id=deal.id,
        organization_id=org.id,
        uploaded_by=uploader.id,
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)
    return document

def test_get_document_returns_404_for_other_org(
    client: TestClient,
    create_deal_for_org,
    create_organization,
    create_user,
    db_session: Session,
    dependency_overrides,
):
    deal, owner, org = create_deal_for_org()
    other_org = create_organization(name="Other Org")
    other_user = create_user(email="other@example.com", organization_id=str(other_org.id))
    document = _create_document(db_session, deal, org, owner)

    dependency_overrides(get_current_user, lambda: other_user)
    response = client.get(f"/api/deals/{deal.id}/documents/{document.id}")

    assert response.status_code == 404
    assert "Document not found" in response.json()["detail"]

def test_update_document_returns_404_for_other_org(
    client: TestClient,
    create_deal_for_org,
    create_organization,
    create_user,
    db_session: Session,
    dependency_overrides,
):
    deal, owner, org = create_deal_for_org()
    other_org = create_organization(name="Other Org")
    other_user = create_user(email="other-update@example.com", organization_id=str(other_org.id))
    document = _create_document(db_session, deal, org, owner)

    dependency_overrides(get_current_user, lambda: other_user)
    response = client.put(
        f"/api/deals/{deal.id}/documents/{document.id}",
        json={"folder_id": None},
    )

    assert response.status_code == 404
    assert "Document not found" in response.json()["detail"]


def test_get_document_returns_404_when_deal_id_mismatch(
    client: TestClient,
    create_deal_for_org,
    create_user,
    dependency_overrides,
    db_session: Session,
):
    deal, owner, org = create_deal_for_org()
    other_deal, _, _ = create_deal_for_org(organization=org, owner=owner, name="Other Deal")
    document = _create_document(db_session, deal, org, owner)

    dependency_overrides(get_current_user, lambda: owner)
    response = client.get(f"/api/deals/{other_deal.id}/documents/{document.id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_grant_permission_returns_404_when_deal_id_mismatch(
    client: TestClient,
    create_deal_for_org,
    create_user,
    dependency_overrides,
    db_session: Session,
):
    deal, owner, org = create_deal_for_org()
    other_deal, _, _ = create_deal_for_org(organization=org, owner=owner, name="Permissions Deal")
    document = _create_document(db_session, deal, org, owner)
    target_user = create_user(email="target@example.com", organization_id=str(org.id))

    dependency_overrides(get_current_user, lambda: owner)
    response = client.post(
        f"/api/deals/{other_deal.id}/documents/{document.id}/permissions",
        json={"user_id": str(target_user.id), "permission_level": "viewer"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_access_log_creation_returns_404_when_deal_id_mismatch(
    client: TestClient,
    create_deal_for_org,
    dependency_overrides,
    db_session: Session,
):
    deal, owner, org = create_deal_for_org()
    other_deal, _, _ = create_deal_for_org(organization=org, owner=owner, name="Logs Deal")
    document = _create_document(db_session, deal, org, owner)

    dependency_overrides(get_current_user, lambda: owner)
    response = client.post(
        f"/api/deals/{other_deal.id}/documents/{document.id}/access-logs",
        json={"action": "manual"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_bulk_download_returns_404_when_document_not_in_deal(
    client: TestClient,
    create_deal_for_org,
    create_user,
    dependency_overrides,
    db_session: Session,
):
    deal, owner, org = create_deal_for_org()
    other_deal, _, _ = create_deal_for_org(organization=org, owner=owner, name="Other Deal")
    document = _create_document(db_session, deal, org, owner)

    dependency_overrides(get_current_user, lambda: owner)
    response = client.post(
        f"/api/deals/{other_deal.id}/documents/bulk-download",
        json={"document_ids": [str(document.id)]},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_bulk_delete_returns_404_when_document_not_in_deal(
    client: TestClient,
    create_deal_for_org,
    create_user,
    dependency_overrides,
    db_session: Session,
):
    deal, owner, org = create_deal_for_org()
    other_deal, _, _ = create_deal_for_org(organization=org, owner=owner, name="Other Deal")
    document = _create_document(db_session, deal, org, owner)

    dependency_overrides(get_current_user, lambda: owner)
    response = client.post(
        f"/api/deals/{other_deal.id}/documents/bulk-delete",
        json={"document_ids": [str(document.id)]},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"


def test_bulk_delete_returns_403_when_user_lacks_owner_permission(
    client: TestClient,
    create_deal_for_org,
    create_user,
    dependency_overrides,
    db_session: Session,
):
    deal, owner, org = create_deal_for_org()
    document = _create_document(db_session, deal, org, owner)
    other_user = create_user(email="reviewer@example.com", organization_id=str(org.id))

    dependency_overrides(get_current_user, lambda: other_user)
    response = client.post(
        f"/api/deals/{deal.id}/documents/bulk-delete",
        json={"document_ids": [str(document.id)]},
    )

    assert response.status_code == 403
    assert "Insufficient permissions" in response.json()["detail"]
