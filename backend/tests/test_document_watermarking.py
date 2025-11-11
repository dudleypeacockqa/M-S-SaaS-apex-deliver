"""Tests for document watermarking functionality (user name, timestamp)."""
import pytest
from datetime import datetime
from io import BytesIO
from PIL import Image, ImageDraw
from starlette.testclient import TestClient
from sqlalchemy.orm import Session
from uuid import uuid4

from app.models.document import Document
from app.models.deal import Deal
from app.models.organization import Organization
from app.models.user import User


def test_watermark_pdf_with_user_info(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test watermarking a PDF document with user name and timestamp (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="sensitive-doc.pdf",
        file_key=f"documents/{uuid4()}/sensitive-doc.pdf",
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

    # Request watermarked version
    response = client.get(
        f"/api/documents/{document.id}/download",
        params={"watermark": "true"}
    )

    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/pdf"

    # Verify watermark metadata in response headers
    assert "X-Watermark-User" in response.headers
    assert "X-Watermark-Timestamp" in response.headers
    assert response.headers["X-Watermark-User"] == test_user.id


def test_watermark_image_with_visual_overlay(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test watermarking an image with visible text overlay (RED)."""
    # Create an image document
    document = Document(
        id=str(uuid4()),
        name="chart.png",
        file_key=f"documents/{uuid4()}/chart.png",
        file_size=1024 * 50,
        file_type="image/png",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Request watermarked version
    response = client.get(
        f"/api/documents/{document.id}/download",
        params={"watermark": "true"}
    )

    assert response.status_code == 200
    assert response.headers["Content-Type"] == "image/png"

    # Verify the response contains image data
    assert len(response.content) > 0

    # Verify watermark metadata
    assert "X-Watermark-Applied" in response.headers
    assert response.headers["X-Watermark-Applied"] == "true"


def test_watermark_includes_user_email_and_timestamp(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test that watermark includes user email and formatted timestamp (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="financial-report.pdf",
        file_key=f"documents/{uuid4()}/financial-report.pdf",
        file_size=1024 * 200,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Request watermarked version with user context
    response = client.get(
        f"/api/documents/{document.id}/download",
        params={"watermark": "true"},
        headers={"X-User-Email": "john.doe@example.com"}
    )

    assert response.status_code == 200

    # Verify watermark metadata includes email
    assert "X-Watermark-User-Email" in response.headers
    assert "john.doe@example.com" in response.headers["X-Watermark-User-Email"]

    # Verify timestamp format (ISO 8601)
    timestamp = response.headers.get("X-Watermark-Timestamp")
    assert timestamp is not None
    # Should be parseable as ISO datetime
    parsed_timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    assert parsed_timestamp.year >= 2025


def test_watermark_disabled_by_default(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test that watermarking is opt-in, not applied by default (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="public-doc.pdf",
        file_key=f"documents/{uuid4()}/public-doc.pdf",
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

    # Download WITHOUT watermark parameter
    response = client.get(f"/api/documents/{document.id}/download")

    assert response.status_code == 200

    # Verify NO watermark headers present
    assert "X-Watermark-Applied" not in response.headers
    assert "X-Watermark-User" not in response.headers
    assert "X-Watermark-Timestamp" not in response.headers


def test_watermark_logs_download_with_metadata(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test that watermarked downloads are logged with metadata (RED)."""
    # Create a document
    document = Document(
        id=str(uuid4()),
        name="audit-trail-doc.pdf",
        file_key=f"documents/{uuid4()}/audit-trail-doc.pdf",
        file_size=1024 * 150,
        file_type="application/pdf",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Download with watermark
    response = client.get(
        f"/api/documents/{document.id}/download",
        params={"watermark": "true"},
        headers={"X-Forwarded-For": "203.0.113.42"}
    )

    assert response.status_code == 200

    # Check access log was created
    logs_response = client.get(
        f"/api/documents/{document.id}/access-logs",
        params={"limit": 10}
    )

    assert logs_response.status_code == 200
    logs_data = logs_response.json()

    # Verify the download was logged
    assert len(logs_data["logs"]) >= 1
    latest_log = logs_data["logs"][0]
    assert latest_log["action"] == "download"
    assert latest_log["metadata"]["watermarked"] is True
    assert latest_log["ip_address"] == "203.0.113.42"


def test_watermark_supports_multiple_formats(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test watermarking works for PDF, PNG, JPG file types (RED)."""
    file_types = [
        ("document.pdf", "application/pdf"),
        ("image.png", "image/png"),
        ("photo.jpg", "image/jpeg"),
    ]

    for filename, mime_type in file_types:
        # Create a document
        document = Document(
            id=str(uuid4()),
            name=filename,
            file_key=f"documents/{uuid4()}/{filename}",
            file_size=1024 * 80,
            file_type=mime_type,
            deal_id=test_deal.id,
            organization_id=test_organization.id,
            uploaded_by=test_user.id,
            version=1
        )
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)

        # Request watermarked version
        response = client.get(
            f"/api/documents/{document.id}/download",
            params={"watermark": "true"}
        )

        assert response.status_code == 200, f"Failed for {filename}"
        assert response.headers["Content-Type"] == mime_type
        assert response.headers.get("X-Watermark-Applied") == "true"


def test_watermark_fails_gracefully_for_unsupported_types(
    client: TestClient,
    test_organization: Organization,
    test_user: User,
    test_deal: Deal,
    db_session: Session
):
    """Test watermarking unsupported file types returns original file (RED)."""
    # Create a text document (unsupported for watermarking)
    document = Document(
        id=str(uuid4()),
        name="notes.txt",
        file_key=f"documents/{uuid4()}/notes.txt",
        file_size=1024 * 5,
        file_type="text/plain",
        deal_id=test_deal.id,
        organization_id=test_organization.id,
        uploaded_by=test_user.id,
        version=1
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    # Request watermarked version
    response = client.get(
        f"/api/documents/{document.id}/download",
        params={"watermark": "true"}
    )

    assert response.status_code == 200
    assert response.headers["Content-Type"] == "text/plain"

    # Should NOT have watermark applied (unsupported type)
    assert response.headers.get("X-Watermark-Applied") != "true"
    # Should have warning header
    assert "X-Watermark-Warning" in response.headers
    assert "unsupported" in response.headers["X-Watermark-Warning"].lower()
