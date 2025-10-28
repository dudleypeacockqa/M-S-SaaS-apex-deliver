"""
Smoke Tests for Production Deployment Verification
===================================================

Purpose: Verify critical system functionality after deployment
Environment: Run against staging or production environments
Usage: SMOKE_TEST_URL=https://ma-saas-backend.onrender.com pytest backend/tests/smoke_tests.py -v

These tests verify:
1. Core services are responding (health checks)
2. Authentication endpoints exist
3. Database connectivity
4. CORS configuration
5. API documentation accessibility

Exit codes:
    0 = All smoke tests passed (safe to proceed with deployment)
    1 = One or more smoke tests failed (DO NOT DEPLOY)
"""

import os
import pytest
import httpx
from typing import Dict, Optional

# ==============================================================================
# Configuration
# ==============================================================================

# Base URL for smoke tests (override via environment variable)
BASE_URL = os.getenv("SMOKE_TEST_URL", "https://ma-saas-backend.onrender.com")

# Frontend URL for CORS testing
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://100daysandbeyond.com")

# Timeout for HTTP requests (seconds)
REQUEST_TIMEOUT = 30.0

print(f"\n🔍 Running smoke tests against: {BASE_URL}\n")

# ==============================================================================
# Smoke Test Suite
# ==============================================================================

class TestProductionSmoke:
    """Critical path smoke tests for production deployment"""

    @pytest.mark.asyncio
    async def test_01_health_endpoint_responds(self):
        """
        Verify health endpoint returns 200 OK

        This is the most basic test - if this fails, nothing else will work.
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/health")

            assert response.status_code == 200, \
                f"Health endpoint returned {response.status_code}, expected 200"

            print(f"✓ Health endpoint responding: {response.status_code}")

    @pytest.mark.asyncio
    async def test_02_health_endpoint_json_format(self):
        """
        Verify health endpoint returns valid JSON with expected structure
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/health")

            assert response.status_code == 200

            data = response.json()
            assert "status" in data, "Health response missing 'status' field"
            assert data["status"] == "healthy", f"Expected status='healthy', got '{data['status']}'"

            print(f"✓ Health status: {data['status']}")

    @pytest.mark.asyncio
    async def test_03_health_clerk_configured(self):
        """
        Verify Clerk authentication is configured
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/health")
            data = response.json()

            assert "clerk_configured" in data, "Health response missing 'clerk_configured' field"
            assert data["clerk_configured"] is True, "Clerk is not configured"

            print(f"✓ Clerk configured: {data['clerk_configured']}")

    @pytest.mark.asyncio
    async def test_04_health_database_configured(self):
        """
        Verify database connection is configured
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/health")
            data = response.json()

            assert "database_configured" in data, "Health response missing 'database_configured' field"
            assert data["database_configured"] is True, "Database is not configured"

            print(f"✓ Database configured: {data['database_configured']}")

    @pytest.mark.asyncio
    async def test_05_health_webhook_configured(self):
        """
        Verify webhook secret is configured
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/health")
            data = response.json()

            assert "webhook_configured" in data, "Health response missing 'webhook_configured' field"
            assert data["webhook_configured"] is True, "Webhook secret is not configured"

            print(f"✓ Webhook configured: {data['webhook_configured']}")

    @pytest.mark.asyncio
    async def test_06_api_docs_accessible(self):
        """
        Verify API documentation (/docs) is accessible

        FastAPI auto-generates docs at /docs endpoint.
        If this fails, routing or FastAPI setup is broken.
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/docs")

            assert response.status_code == 200, \
                f"API docs returned {response.status_code}, expected 200"

            # Verify it's actually HTML (not JSON error)
            assert "text/html" in response.headers.get("content-type", ""), \
                "API docs should return HTML"

            print(f"✓ API documentation accessible at /docs")

    @pytest.mark.asyncio
    async def test_07_cors_headers_configured(self):
        """
        Verify CORS headers are configured for frontend origin

        Critical for frontend-backend communication.
        If this fails, frontend API calls will be blocked by browser.
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.options(
                f"{BASE_URL}/api/health",
                headers={"Origin": FRONTEND_URL}
            )

            # CORS headers should be present
            assert "access-control-allow-origin" in response.headers or \
                   "Access-Control-Allow-Origin" in response.headers, \
                   "CORS headers not configured"

            print(f"✓ CORS configured for {FRONTEND_URL}")

    @pytest.mark.asyncio
    async def test_08_authentication_endpoint_exists(self):
        """
        Verify authentication endpoints exist (not 404)

        Should return 401 Unauthorized (not authenticated),
        NOT 404 Not Found (endpoint doesn't exist).
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/api/users/me")

            assert response.status_code in [401, 403], \
                f"Auth endpoint returned {response.status_code}, expected 401 or 403 (not 404)"

            print(f"✓ Authentication endpoint exists (returned {response.status_code})")

    @pytest.mark.asyncio
    async def test_09_deals_endpoint_exists(self):
        """
        Verify core business logic endpoints exist

        Tests that /api/deals endpoint is configured.
        Should return 401 (not authenticated), not 404 (not found).
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/api/deals")

            assert response.status_code in [401, 403], \
                f"Deals endpoint returned {response.status_code}, expected 401 or 403 (not 404)"

            print(f"✓ Deals endpoint exists (returned {response.status_code})")

    @pytest.mark.asyncio
    async def test_10_response_time_acceptable(self):
        """
        Verify API response time is acceptable (<2 seconds)

        Slow response times indicate performance issues.
        """
        import time

        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            start_time = time.time()
            response = await client.get(f"{BASE_URL}/health")
            end_time = time.time()

            response_time = end_time - start_time

            assert response.status_code == 200
            assert response_time < 2.0, \
                f"Response time {response_time:.2f}s exceeds 2s threshold"

            print(f"✓ Response time: {response_time:.3f}s (< 2s threshold)")

    @pytest.mark.asyncio
    async def test_11_no_server_errors(self):
        """
        Verify server is not returning 500 errors on health check

        500 errors indicate application crashes or misconfigurations.
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/health")

            assert response.status_code < 500, \
                f"Server error detected: {response.status_code}"

            print(f"✓ No server errors (status: {response.status_code})")

    @pytest.mark.asyncio
    async def test_12_content_type_headers_correct(self):
        """
        Verify API returns correct Content-Type headers

        JSON endpoints should return application/json.
        """
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(f"{BASE_URL}/health")

            content_type = response.headers.get("content-type", "")
            assert "application/json" in content_type, \
                f"Expected application/json, got {content_type}"

            print(f"✓ Content-Type: {content_type}")


# ==============================================================================
# Test Summary Reporter
# ==============================================================================

def pytest_terminal_summary(terminalreporter, exitstatus, config):
    """
    Custom test summary displayed after all tests complete
    """
    print("\n" + "=" * 70)
    print("  SMOKE TEST SUMMARY")
    print("=" * 70)

    passed = len(terminalreporter.stats.get('passed', []))
    failed = len(terminalreporter.stats.get('failed', []))
    total = passed + failed

    if exitstatus == 0:
        print(f"\n✅ SUCCESS: All {passed} smoke tests passed")
        print("\n🚀 Production deployment: SAFE TO PROCEED")
        print(f"   Tested against: {BASE_URL}")
    else:
        print(f"\n❌ FAILURE: {failed}/{total} smoke tests failed")
        print("\n🛑 Production deployment: DO NOT PROCEED")
        print("\nReview failed tests above and fix issues before deploying.")
        print(f"   Tested against: {BASE_URL}")

    print("=" * 70 + "\n")
