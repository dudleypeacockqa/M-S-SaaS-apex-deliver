"""Tests for document external sharing API with expiring links."""
import pytest
from datetime import datetime, timedelta
from starlette.testclient import TestClient
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.document import Document
from app.models.deal import Deal
from app.models.organization import Organization
from app.models.user import User


def test_create_share_link_for_document(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test creating an expiring share link for a document (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="test-document.pdf",
        file_key=f"documents/{uuid4()}/test-document.pdf",
        file_size=1024 * 50,  # 50KB
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create share link with 7-day expiration
    response = client.post(
        f"/api/documents/{document.id}/share",
        json={
            "expires_in_days": 7,
            "allow_download": True,
            "password_protected": False
        }
    )

    assert response.status_code == 201
    data = response.json()

    # Verify response structure
    assert "share_link_id" in data
    assert "share_url" in data
    assert "expires_at" in data
    assert "created_at" in data

    # Verify the share URL is properly formatted
    assert data["share_url"].startswith("http")
    assert "/shared/" in data["share_url"]

    # Verify expiration is approximately 7 days from now
    expires_at = datetime.fromisoformat(data["expires_at"].replace("Z", "+00:00"))
    expected_expiry = datetime.utcnow() + timedelta(days=7)
    time_diff = abs((expires_at - expected_expiry).total_seconds())
    assert time_diff < 60  # Within 60 seconds tolerance


def test_create_share_link_with_password(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test creating a password-protected share link (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="confidential.pdf",
        file_key=f"documents/{uuid4()}/confidential.pdf",
        file_size=1024 * 100,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create password-protected share link
    response = client.post(
        f"/api/documents/{document.id}/share",
        json={
            "expires_in_days": 3,
            "allow_download": True,
            "password_protected": True,
            "password": "SecurePass123!"
        }
    )

    assert response.status_code == 201
    data = response.json()

    assert "share_link_id" in data
    assert "share_url" in data
    assert "password_required" in data
    assert data["password_required"] is True

    # Password should NOT be in the response
    assert "password" not in data


def test_access_shared_document_valid_link(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test accessing a document via a valid share link (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="shared-doc.pdf",
        file_key=f"documents/{uuid4()}/shared-doc.pdf",
        file_size=1024 * 75,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create share link
    create_response = client.post(
        f"/api/documents/{document.id}/share",
        json={
            "expires_in_days": 7,
            "allow_download": True,
            "password_protected": False
        }
    )
    assert create_response.status_code == 201
    share_data = create_response.json()
    share_link_id = share_data["share_link_id"]

    # Access the shared document (no auth required for public share link)
    access_response = client.get(f"/api/shared/{share_link_id}")

    assert access_response.status_code == 200
    access_data = access_response.json()

    assert access_data["document_name"] == "shared-doc.pdf"
    assert access_data["file_size"] == 1024 * 75
    assert access_data["file_type"] == "application/pdf"
    assert "download_url" in access_data
    assert access_data["allow_download"] is True


def test_access_shared_document_expired_link(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test accessing a document via an expired share link (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="expired-doc.pdf",
        file_key=f"documents/{uuid4()}/expired-doc.pdf",
        file_size=1024 * 30,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create share link with 0 days (should expire immediately for testing)
    create_response = client.post(
        f"/api/documents/{document.id}/share",
        json={
            "expires_in_days": 0,  # Expires immediately
            "allow_download": False,
            "password_protected": False
        }
    )
    assert create_response.status_code == 201
    share_data = create_response.json()
    share_link_id = share_data["share_link_id"]

    # Try to access the expired shared document
    access_response = client.get(f"/api/shared/{share_link_id}")

    assert access_response.status_code == 410  # 410 Gone
    assert "expired" in access_response.json()["detail"].lower()


def test_access_shared_document_with_password(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test accessing a password-protected shared document (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="protected-doc.pdf",
        file_key=f"documents/{uuid4()}/protected-doc.pdf",
        file_size=1024 * 40,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create password-protected share link
    create_response = client.post(
        f"/api/documents/{document.id}/share",
        json={
            "expires_in_days": 5,
            "allow_download": True,
            "password_protected": True,
            "password": "MySecret123"
        }
    )
    assert create_response.status_code == 201
    share_data = create_response.json()
    share_link_id = share_data["share_link_id"]

    # Try to access without password (should fail)
    no_pass_response = client.get(f"/api/shared/{share_link_id}")
    assert no_pass_response.status_code == 401
    assert "password" in no_pass_response.json()["detail"].lower()

    # Try to access with wrong password (should fail)
    wrong_pass_response = client.post(
        f"/api/shared/{share_link_id}/verify",
        json={"password": "WrongPassword"}
    )
    assert wrong_pass_response.status_code == 401
    assert "incorrect" in wrong_pass_response.json()["detail"].lower()

    # Access with correct password (should succeed)
    correct_pass_response = client.post(
        f"/api/shared/{share_link_id}/verify",
        json={"password": "MySecret123"}
    )
    assert correct_pass_response.status_code == 200
    access_data = correct_pass_response.json()
    assert access_data["document_name"] == "protected-doc.pdf"
    assert "download_url" in access_data


def test_list_active_share_links_for_document(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test listing all active share links for a document (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="multi-share.pdf",
        file_key=f"documents/{uuid4()}/multi-share.pdf",
        file_size=1024 * 60,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create multiple share links
    for i in range(3):
        client.post(
            f"/api/documents/{document.id}/share",
            json={
                "expires_in_days": 7 + i,
                "allow_download": i % 2 == 0,
                "password_protected": False
            }
        )

    # List all share links for the document
    response = client.get(f"/api/documents/{document.id}/shares")

    assert response.status_code == 200
    data = response.json()

    assert "share_links" in data
    assert len(data["share_links"]) == 3

    # Verify each share link has required fields
    for share_link in data["share_links"]:
        assert "share_link_id" in share_link
        assert "share_url" in share_link
        assert "expires_at" in share_link
        assert "created_at" in share_link
        assert "allow_download" in share_link
        assert "password_required" in share_link
        assert "access_count" in share_link


def test_revoke_share_link(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test revoking a share link before expiration (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="revoked-doc.pdf",
        file_key=f"documents/{uuid4()}/revoked-doc.pdf",
        file_size=1024 * 45,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create share link
    create_response = client.post(
        f"/api/documents/{document.id}/share",
        json={
            "expires_in_days": 30,
            "allow_download": True,
            "password_protected": False
        }
    )
    assert create_response.status_code == 201
    share_data = create_response.json()
    share_link_id = share_data["share_link_id"]

    # Verify link is accessible
    access_response = client.get(f"/api/shared/{share_link_id}")
    assert access_response.status_code == 200

    # Revoke the link
    revoke_response = client.delete(
        f"/api/documents/{document.id}/shares/{share_link_id}"
    )
    assert revoke_response.status_code == 200
    assert "revoked" in revoke_response.json()["message"].lower()

    # Verify link is no longer accessible
    after_revoke_response = client.get(f"/api/shared/{share_link_id}")
    assert after_revoke_response.status_code == 404
    assert "not found" in after_revoke_response.json()["detail"].lower()


def test_track_share_link_access_count(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test tracking access count for share links (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="tracked-doc.pdf",
        file_key=f"documents/{uuid4()}/tracked-doc.pdf",
        file_size=1024 * 55,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Create share link
    create_response = client.post(
        f"/api/documents/{document.id}/share",
        json={
            "expires_in_days": 7,
            "allow_download": True,
            "password_protected": False
        }
    )
    assert create_response.status_code == 201
    share_data = create_response.json()
    share_link_id = share_data["share_link_id"]

    # Access the link multiple times
    for _ in range(5):
        client.get(f"/api/shared/{share_link_id}")

    # Check access count
    stats_response = client.get(
        f"/api/documents/{document.id}/shares/{share_link_id}/stats"
    )

    assert stats_response.status_code == 200
    stats_data = stats_response.json()

    assert stats_data["access_count"] == 5
    assert "last_accessed_at" in stats_data
    assert "total_downloads" in stats_data
