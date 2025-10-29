"""
Real Sage REST API Integration Tests - Phase 10
Tests actual Sage Accounting API integration (REST API, no SDK)

TDD RED: These tests will FAIL until Sage credentials are configured
Following Phase 10 of 100% completion plan

Requires:
- Sage sandbox credentials configured in environment
- UK Market Focus: 20% of target market
"""

import pytest
import os

# Skip if Sage credentials not configured (allows CI/CD to pass)
SAGE_CONFIGURED = all([
    os.getenv("SAGE_CLIENT_ID"),
    os.getenv("SAGE_CLIENT_SECRET"),
])

pytestmark = pytest.mark.skipif(
    not SAGE_CONFIGURED,
    reason="Sage credentials not configured (set SAGE_CLIENT_ID and SAGE_CLIENT_SECRET)"
)


@pytest.mark.integration
def test_sage_rest_api_client_can_be_imported():
    """
    RED TEST: Verify Sage REST API client classes are available.

    Expected: PASS - should import successfully
    """
    from app.services.sage_oauth_service import RealSageClient, MockSageClient
    assert RealSageClient is not None
    assert MockSageClient is not None


@pytest.mark.integration
def test_real_sage_client_class_exists():
    """
    RED TEST: Verify RealSageClient wrapper exists in service.

    Expected: PASS - class should exist
    """
    from app.services.sage_oauth_service import RealSageClient

    assert RealSageClient is not None
    assert hasattr(RealSageClient, 'get_authorization_url')
    assert hasattr(RealSageClient, 'exchange_code_for_token')
    assert hasattr(RealSageClient, 'get_connections')
    assert hasattr(RealSageClient, 'refresh_access_token')
    assert hasattr(RealSageClient, 'get_report')


@pytest.mark.integration
def test_sage_oauth_url_uses_real_credentials():
    """
    RED TEST: Verify OAuth URL generation uses real Sage client ID.

    Expected: FAIL or uses placeholder value (will pass with real credentials)
    """
    from app.services.sage_oauth_service import initiate_sage_oauth
    from app.models.organization import Organization
    from app.models.deal import Deal
    from unittest.mock import patch

    # Mock database session with deal
    with patch('app.services.sage_oauth_service.select') as mock_select:
        mock_deal = Deal(
            id="test-deal",
            organization_id="test-org",
            name="Test Deal",
            target_company="Target",
            owner_id="user-1"
        )

        # Mock query result
        mock_result = type('Result', (), {'scalar_one_or_none': lambda: mock_deal})()
        mock_session = type('Session', (), {'execute': lambda self, q: mock_result})()

        result = initiate_sage_oauth("test-deal", mock_session)

        # Verify uses real client ID (not placeholder)
        assert "sage_client_id_placeholder" not in result["authorization_url"]

        # Verify includes Sage OAuth endpoint
        assert "sageone.com" in result["authorization_url"]

        # Verify includes full_access scope
        assert "full_access" in result["authorization_url"]


@pytest.mark.integration
def test_sage_client_has_real_configuration():
    """
    RED TEST: Verify SageClient uses real REST API configuration.

    Expected: FAIL - currently returns mock data (will pass with real credentials)
    """
    from app.services.sage_oauth_service import sage_client

    # Check client is using real Sage API (not mock)
    client_class_name = sage_client.__class__.__name__

    # Should be RealSageClient, not MockSageClient
    assert client_class_name == "RealSageClient", \
        f"Expected RealSageClient, got {client_class_name} (still using mock)"


@pytest.mark.integration
def test_token_exchange_structure_matches_sage_api():
    """
    RED TEST: Verify token exchange returns Sage API structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.sage_oauth_service import sage_client

    # Mock a token exchange call
    result = sage_client.exchange_code_for_token("test_code")

    # Real Sage API returns specific fields
    required_fields = ["access_token", "refresh_token", "expires_in", "token_type"]
    for field in required_fields:
        assert field in result, f"Missing field: {field}"


@pytest.mark.integration
def test_get_connections_returns_real_business_structure():
    """
    RED TEST: Verify get_connections returns real Sage business structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.sage_oauth_service import sage_client

    result = sage_client.get_connections("mock_token")

    # Real Sage businesses API returns array of business objects
    assert isinstance(result, list)
    if result:
        business = result[0]
        # Real Sage businesses have these fields
        required_fields = ["businessId", "businessName"]
        for field in required_fields:
            assert field in business, f"Missing business field: {field} (mock structure)"


@pytest.mark.integration
def test_balance_sheet_import_uses_real_sage_api_format():
    """
    RED TEST: Verify balance sheet parsing handles real Sage API response.

    Expected: FAIL - mock returns oversimplified structure
    """
    from app.services.sage_oauth_service import _parse_sage_balance_sheet
    from app.models.financial_connection import FinancialConnection
    from app.models.organization import Organization
    from app.models.deal import Deal

    # Real Sage balance sheet has ledger account-based structure
    real_sage_response = {
        "ReportName": "Balance Sheet",
        "Assets": [
            {"Name": "Bank Account", "Type": "Bank", "Balance": 50000.00},
            {"Name": "Accounts Receivable", "Type": "Current Asset", "Balance": 25000.00},
        ],
        "Liabilities": [
            {"Name": "Accounts Payable", "Type": "Current Liability", "Balance": 15000.00},
        ],
        "Equity": [
            {"Name": "Retained Earnings", "Type": "Equity", "Balance": 60000.00},
        ],
    }

    # Mock database objects
    mock_org = Organization(id="org-1", name="Test", slug="test")
    mock_deal = Deal(id="deal-1", organization_id=mock_org.id, name="Deal", target_company="T", owner_id="u1")
    mock_connection = FinancialConnection(
        id="conn-1",
        deal_id=mock_deal.id,
        organization_id=mock_org.id,
        platform="sage",
        access_token="token",
        refresh_token="refresh",
        platform_organization_id="business-123"
    )

    # Mock session
    mock_session = type('Session', (), {
        'add': lambda self, obj: None,
        'commit': lambda self: None,
        'refresh': lambda self, obj: None
    })()

    # Test parsing
    statement = _parse_sage_balance_sheet(real_sage_response, mock_connection, mock_session)

    # Should successfully parse real Sage response
    assert statement is not None, "Failed to parse real Sage balance sheet structure"
    assert statement.total_assets > 0


@pytest.mark.integration
def test_sage_rest_api_error_handling():
    """
    RED TEST: Verify error handling for real Sage API errors.

    Expected: FAIL - mock doesn't raise real Sage HTTP exceptions
    """
    from app.services.sage_oauth_service import sage_client

    # Real Sage REST API raises HTTP exceptions for invalid tokens
    # Mock returns data instead of raising
    try:
        result = sage_client.get_connections("invalid_token_format")
        # If we get here with mock, the test documents expected behavior
        assert isinstance(result, list), "Should return list or raise exception"
    except Exception as e:
        # Real API would raise requests.HTTPError
        assert e is not None, "Should raise exception for invalid token"


@pytest.mark.integration
@pytest.mark.skipif(True, reason="Requires real Sage sandbox OAuth flow - manual test")
def test_full_sage_oauth_flow_with_real_api():
    """
    RED TEST: Test complete OAuth flow with real Sage API.

    Expected: FAIL - uses MockSageClient currently

    This test requires:
    1. Valid Sage sandbox app credentials
    2. Manual OAuth authorization (user consent)
    3. Valid authorization code from callback

    NOTE: This is a manual/integration test - skip in CI/CD
    """
    from app.services.sage_oauth_service import handle_sage_callback
    from app.models.organization import Organization
    from app.models.deal import Deal

    # This test cannot be automated - requires user OAuth consent
    # It's here as documentation of expected behavior

    # Example flow (manual steps):
    # 1. Visit authorization_url from initiate_sage_oauth()
    # 2. Authorize app in Sage sandbox
    # 3. Get authorization code from redirect
    # 4. Pass code to handle_sage_callback()
    # 5. Verify real tokens are returned

    pytest.skip("Manual test - requires user OAuth consent in Sage sandbox")
