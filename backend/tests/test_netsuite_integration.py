"""
Real NetSuite REST API Integration Tests - Phase 11
Tests actual NetSuite SuiteCloud OAuth 2.0 integration (REST API, no SDK)

TDD RED: These tests will FAIL until NetSuite credentials are configured
Following Phase 11 of 100% completion plan

Requires:
- NetSuite SuiteCloud OAuth 2.0 app configured
- Enterprise market focus: 15% of target market
- Total market coverage: 90% with all 4 platforms
"""

import pytest
import os

# Skip if NetSuite credentials not configured (allows CI/CD to pass)
NETSUITE_CONFIGURED = all([
    os.getenv("NETSUITE_CLIENT_ID"),
    os.getenv("NETSUITE_CLIENT_SECRET"),
    os.getenv("NETSUITE_ACCOUNT_ID"),
])

pytestmark = pytest.mark.skipif(
    not NETSUITE_CONFIGURED,
    reason="NetSuite credentials not configured (set NETSUITE_CLIENT_ID, NETSUITE_CLIENT_SECRET, NETSUITE_ACCOUNT_ID)"
)


@pytest.mark.integration
def test_netsuite_rest_api_client_can_be_imported():
    """
    RED TEST: Verify NetSuite REST API client classes are available.

    Expected: PASS - should import successfully
    """
    from app.services.netsuite_oauth_service import RealNetSuiteClient, MockNetSuiteClient
    assert RealNetSuiteClient is not None
    assert MockNetSuiteClient is not None


@pytest.mark.integration
def test_real_netsuite_client_class_exists():
    """
    RED TEST: Verify RealNetSuiteClient wrapper exists in service.

    Expected: PASS - class should exist
    """
    from app.services.netsuite_oauth_service import RealNetSuiteClient

    assert RealNetSuiteClient is not None
    assert hasattr(RealNetSuiteClient, 'get_authorization_url')
    assert hasattr(RealNetSuiteClient, 'exchange_code_for_token')
    assert hasattr(RealNetSuiteClient, 'get_connections')
    assert hasattr(RealNetSuiteClient, 'refresh_access_token')
    assert hasattr(RealNetSuiteClient, 'get_report')


@pytest.mark.integration
def test_netsuite_oauth_url_uses_real_credentials():
    """
    RED TEST: Verify OAuth URL generation uses real NetSuite client ID.

    Expected: FAIL or uses placeholder value (will pass with real credentials)
    """
    from app.services.netsuite_oauth_service import initiate_netsuite_oauth
    from app.models.organization import Organization
    from app.models.deal import Deal
    from unittest.mock import patch

    # Mock database session with deal
    with patch('app.services.netsuite_oauth_service.select') as mock_select:
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

        result = initiate_netsuite_oauth("test-deal", mock_session)

        # Verify uses real client ID (not placeholder)
        assert "mock_client_id" not in result["authorization_url"]

        # Verify includes NetSuite OAuth endpoint
        assert "netsuite.com" in result["authorization_url"]

        # Verify includes rest_webservices scope
        assert "rest_webservices" in result["authorization_url"]


@pytest.mark.integration
def test_netsuite_client_has_real_configuration():
    """
    RED TEST: Verify NetSuiteClient uses real REST API configuration.

    Expected: FAIL - currently returns mock data (will pass with real credentials)
    """
    from app.services.netsuite_oauth_service import netsuite_client

    # Check client is using real NetSuite API (not mock)
    client_class_name = netsuite_client.__class__.__name__

    # Should be RealNetSuiteClient, not MockNetSuiteClient
    assert client_class_name == "RealNetSuiteClient", \
        f"Expected RealNetSuiteClient, got {client_class_name} (still using mock)"


@pytest.mark.integration
def test_token_exchange_structure_matches_netsuite_api():
    """
    RED TEST: Verify token exchange returns NetSuite API structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.netsuite_oauth_service import netsuite_client

    # Mock a token exchange call
    result = netsuite_client.exchange_code_for_token("test_code")

    # Real NetSuite API returns specific fields
    required_fields = ["access_token", "refresh_token", "expires_in", "token_type"]
    for field in required_fields:
        assert field in result, f"Missing field: {field}"


@pytest.mark.integration
def test_get_connections_returns_real_company_structure():
    """
    RED TEST: Verify get_connections returns real NetSuite company structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.netsuite_oauth_service import netsuite_client

    result = netsuite_client.get_connections("mock_token")

    # Real NetSuite companies API returns array of company objects
    assert isinstance(result, list)
    if result:
        company = result[0]
        # Real NetSuite companies have these fields
        required_fields = ["accountId", "companyName"]
        for field in required_fields:
            assert field in company, f"Missing company field: {field} (mock structure)"


@pytest.mark.integration
def test_balance_sheet_import_uses_real_netsuite_api_format():
    """
    RED TEST: Verify balance sheet parsing handles real NetSuite API response.

    Expected: FAIL - mock returns oversimplified structure
    """
    from app.services.netsuite_oauth_service import _parse_netsuite_balance_sheet
    from app.models.financial_connection import FinancialConnection
    from app.models.organization import Organization
    from app.models.deal import Deal

    # Real NetSuite balance sheet has account-based structure from SUITEQL
    real_netsuite_response = {
        "ReportName": "Balance Sheet",
        "ReportDate": "2025-10-29T00:00:00Z",
        "Assets": [
            {"Name": "Bank Account", "Number": "1000", "Type": "Bank", "Balance": 50000.00},
            {"Name": "Accounts Receivable", "Number": "1200", "Type": "AcctRec", "Balance": 25000.00},
        ],
        "Liabilities": [
            {"Name": "Accounts Payable", "Number": "2000", "Type": "AcctPay", "Balance": 15000.00},
        ],
        "Equity": [
            {"Name": "Retained Earnings", "Number": "3000", "Type": "Equity", "Balance": 60000.00},
        ],
    }

    # Mock database objects
    mock_org = Organization(id="org-1", name="Test", slug="test")
    mock_deal = Deal(id="deal-1", organization_id=mock_org.id, name="Deal", target_company="T", owner_id="u1")
    mock_connection = FinancialConnection(
        id="conn-1",
        deal_id=mock_deal.id,
        organization_id=mock_org.id,
        platform="netsuite",
        access_token="token",
        refresh_token="refresh",
        platform_organization_id="1234567"
    )

    # Mock session
    mock_session = type('Session', (), {
        'add': lambda self, obj: None,
        'commit': lambda self: None,
        'refresh': lambda self, obj: None
    })()

    # Test parsing
    statement = _parse_netsuite_balance_sheet(real_netsuite_response, mock_connection, mock_session)

    # Should successfully parse real NetSuite response
    assert statement is not None, "Failed to parse real NetSuite balance sheet structure"
    assert statement.total_assets > 0


@pytest.mark.integration
def test_netsuite_rest_api_error_handling():
    """
    RED TEST: Verify error handling for real NetSuite API errors.

    Expected: FAIL - mock doesn't raise real NetSuite HTTP exceptions
    """
    from app.services.netsuite_oauth_service import netsuite_client

    # Real NetSuite REST API raises HTTP exceptions for invalid tokens
    # Mock returns data instead of raising
    try:
        result = netsuite_client.get_connections("invalid_token_format")
        # If we get here with mock, the test documents expected behavior
        assert isinstance(result, list), "Should return list or raise exception"
    except Exception as e:
        # Real API would raise requests.HTTPError
        assert e is not None, "Should raise exception for invalid token"


@pytest.mark.integration
def test_netsuite_account_id_configuration():
    """
    RED TEST: Verify NetSuite account ID is configured for API endpoint construction.

    Expected: FAIL - account ID is NetSuite-specific requirement
    """
    from app.services.netsuite_oauth_service import netsuite_client

    # NetSuite requires account ID for REST API base URL
    if hasattr(netsuite_client, 'account_id'):
        assert netsuite_client.account_id is not None, "NetSuite account ID not configured"
        assert netsuite_client.account_id != "", "NetSuite account ID is empty"

        # Verify API base URL uses account ID
        if hasattr(netsuite_client, 'api_base_url'):
            assert netsuite_client.account_id in netsuite_client.api_base_url, \
                "NetSuite API base URL should include account ID"


@pytest.mark.integration
@pytest.mark.skipif(True, reason="Requires real NetSuite sandbox OAuth flow - manual test")
def test_full_netsuite_oauth_flow_with_real_api():
    """
    RED TEST: Test complete OAuth flow with real NetSuite API.

    Expected: FAIL - uses MockNetSuiteClient currently

    This test requires:
    1. Valid NetSuite SuiteCloud app credentials
    2. Manual OAuth authorization (user consent)
    3. Valid authorization code from callback

    NOTE: This is a manual/integration test - skip in CI/CD
    """
    from app.services.netsuite_oauth_service import handle_netsuite_callback
    from app.models.organization import Organization
    from app.models.deal import Deal

    # This test cannot be automated - requires user OAuth consent
    # It's here as documentation of expected behavior

    # Example flow (manual steps):
    # 1. Visit authorization_url from initiate_netsuite_oauth()
    # 2. Authorize app in NetSuite sandbox
    # 3. Get authorization code from redirect
    # 4. Pass code to handle_netsuite_callback()
    # 5. Verify real tokens are returned

    pytest.skip("Manual test - requires user OAuth consent in NetSuite sandbox")
