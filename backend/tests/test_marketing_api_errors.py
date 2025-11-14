"""
Tests for Marketing API Error Paths - Phase 3.5
TDD: RED → GREEN → REFACTOR
Feature: Error handling for marketing API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch, Mock

from app.main import app


class TestMarketingAPIErrorPaths:
    """Test error paths in marketing API endpoints"""
    
    def test_subscribe_with_invalid_email(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/subscribe with invalid email returns validation error."""
        response = client.post(
            "/api/marketing/subscribe",
            json={"email": "invalid-email"},
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_subscribe_with_missing_email(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/subscribe with missing email returns validation error."""
        response = client.post(
            "/api/marketing/subscribe",
            json={},
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_with_invalid_data(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/contact with invalid data returns validation error."""
        response = client.post(
            "/api/marketing/contact",
            json={
                "name": "",  # Empty name
                "email": "invalid-email",
                "message": "short",  # Too short
            },
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_with_missing_fields(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/contact with missing required fields returns validation error."""
        response = client.post(
            "/api/marketing/contact",
            json={
                "name": "Test User",
                # Missing email and message
            },
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_with_too_long_message(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/contact with message exceeding max length returns validation error."""
        long_message = "x" * 5001  # Exceeds 5000 character limit
        response = client.post(
            "/api/marketing/contact",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "message": long_message,
            },
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_with_too_long_name(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/contact with name exceeding max length returns validation error."""
        long_name = "x" * 256  # Exceeds 255 character limit
        response = client.post(
            "/api/marketing/contact",
            json={
                "name": long_name,
                "email": "test@example.com",
                "message": "This is a valid message with enough characters to pass validation.",
            },
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_contact_success_with_minimal_data(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/contact with minimal valid data succeeds."""
        with patch("app.api.routes.marketing.send_contact_notification"):
            response = client.post(
                "/api/marketing/contact",
                json={
                    "name": "Test User",
                    "email": "test@example.com",
                    "message": "This is a valid message with enough characters.",
                },
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert "id" in data
    
    def test_subscribe_success(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/subscribe with valid email succeeds."""
        response = client.post(
            "/api/marketing/subscribe",
            json={
                "email": "test@example.com",
                "source": "website",
            },
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
    
    def test_subscribe_duplicate_email(
        self,
        client: TestClient,
        db_session: Session,
    ):
        """Test POST /marketing/subscribe with duplicate email handles gracefully (idempotent)."""
        email = "duplicate@example.com"
        
        # First subscription
        response1 = client.post(
            "/api/marketing/subscribe",
            json={"email": email},
        )
        assert response1.status_code == 200
        
        # Duplicate subscription (idempotent - should succeed)
        response2 = client.post(
            "/api/marketing/subscribe",
            json={"email": email},
        )
        # Should succeed (idempotent behavior)
        assert response2.status_code == 200

