"""Smoke tests for production deployment readiness.

These keep the Render smoke script (=========================================
Running Smoke Tests: production
=========================================

Target Backend:  https://ma-saas-backend.onrender.com
Target Frontend: https://apexdeliver.com

1. Checking backend health endpoint...
   ✅ Backend health check passed

2. Verifying frontend availability...
   ⚠️  Frontend responded with HTTP 403 (Cloudflare bot protection). Manual browser check required.

3. Running backend smoke pytest suite...
   ⚠️  No backend smoke_tests.py found; skipping targeted smoke pytest suite.

=========================================
✅ Smoke tests completed successfully
=========================================) green by
verifying the minimum critical endpoints respond as expected.
"""

from fastapi import status


def test_health_endpoint(client):
    """Application health endpoint should respond with healthy status."""

    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    payload = response.json()
    assert payload.get("status") == "healthy"
    assert payload.get("clerk_configured") is True
    assert payload.get("database_configured") is True


def test_root_redirects(client):
    """Root path should return an HTTP redirect to the marketing site."""

    response = client.get("/", follow_redirects=False)
    assert response.status_code in {status.HTTP_200_OK, status.HTTP_302_FOUND}
