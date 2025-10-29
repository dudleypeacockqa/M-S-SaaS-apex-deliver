"""
Real QuickBooks SDK Integration Tests - Phase 4
Tests actual python-quickbooks SDK integration (not mocks)

TDD RED: These tests will FAIL until we implement real QuickBooks SDK
Following Phase 4 of 100% completion plan

Requires:
- python-quickbooks SDK installed
- intuit-oauth SDK installed
- QuickBooks sandbox credentials configured in environment
"""

import pytest
import os

# Skip if QuickBooks credentials not configured (allows CI/CD to pass)
QUICKBOOKS_CONFIGURED = all([
    os.getenv("QUICKBOOKS_CLIENT_ID"),
    os.getenv("QUICKBOOKS_CLIENT_SECRET"),
])

pytestmark = pytest.mark.skipif(
    not QUICKBOOKS_CONFIGURED,
    reason="QuickBooks credentials not configured (set QUICKBOOKS_CLIENT_ID and QUICKBOOKS_CLIENT_SECRET)"
)


@pytest.mark.integration
def test_quickbooks_python_sdk_can_be_imported():
    """
    RED TEST: Verify python-quickbooks and intuit-oauth SDKs are installed.

    Expected: FAIL - SDKs not yet in requirements.txt
    """
    try:
        from intuitlib.client import AuthClient
        from intuitlib.enums import Scopes
        from quickbooks import QuickBooks
        from quickbooks.objects.account import Account
        assert AuthClient is not None
        assert Scopes is not None
        assert QuickBooks is not None
        assert Account is not None
    except ImportError as e:
        pytest.fail(f"python-quickbooks or intuit-oauth SDK not installed: {e}")


@pytest.mark.integration
def test_real_quickbooks_client_class_exists():
    """
    RED TEST: Verify RealQuickBooksClient wrapper exists in service.

    Expected: FAIL - RealQuickBooksClient not yet implemented
    """
    from app.services.quickbooks_oauth_service import RealQuickBooksClient

    assert RealQuickBooksClient is not None
    assert hasattr(RealQuickBooksClient, 'get_authorization_url')
    assert hasattr(RealQuickBooksClient, 'exchange_code_for_token')
    assert hasattr(RealQuickBooksClient, 'get_connections')
    assert hasattr(RealQuickBooksClient, 'refresh_access_token')
    assert hasattr(RealQuickBooksClient, 'get_report')


@pytest.mark.integration
def test_quickbooks_oauth_url_uses_real_credentials():
    """
    RED TEST: Verify OAuth URL generation uses real QuickBooks client ID.

    Expected: FAIL or uses placeholder value
    """
    from app.services.quickbooks_oauth_service import initiate_quickbooks_oauth
    from app.models.organization import Organization
    from app.models.deal import Deal
    from unittest.mock import patch

    # Mock database session with deal
    with patch('app.services.quickbooks_oauth_service.select') as mock_select:
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

        result = initiate_quickbooks_oauth("test-deal", mock_session)

        # Verify uses real client ID (not placeholder)
        assert "qb_client_id_placeholder" not in result["authorization_url"]

        # Verify includes QuickBooks OAuth endpoint
        assert "appcenter.intuit.com/connect/oauth2" in result["authorization_url"]

        # Verify includes accounting scope
        assert "accounting" in result["authorization_url"].lower()


@pytest.mark.integration
def test_quickbooks_client_has_real_configuration():
    """
    RED TEST: Verify QuickBooksClient uses real SDK configuration.

    Expected: FAIL - currently returns mock data
    """
    from app.services.quickbooks_oauth_service import quickbooks_client

    # Check client is using real QuickBooks SDK (not mock)
    client_class_name = quickbooks_client.__class__.__name__

    # Should be RealQuickBooksClient, not MockQuickBooksClient
    assert client_class_name == "RealQuickBooksClient", \
        f"Expected RealQuickBooksClient, got {client_class_name} (still using mock)"


@pytest.mark.integration
def test_token_exchange_structure_matches_quickbooks_api():
    """
    RED TEST: Verify token exchange returns QuickBooks API structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.quickbooks_oauth_service import quickbooks_client

    # Mock a token exchange call
    result = quickbooks_client.exchange_code_for_token("test_code")

    # Real QuickBooks API returns specific fields
    required_fields = ["access_token", "refresh_token", "expires_in", "token_type", "realm_id"]
    for field in required_fields:
        assert field in result, f"Missing field: {field}"

    # Verify realm_id format (QuickBooks uses numeric realm IDs)
    # Mock would have "realm-{hex}", real would be numeric or different format
    # This is a heuristic - adjust based on actual API behavior


@pytest.mark.integration
def test_get_connections_returns_real_company_structure():
    """
    RED TEST: Verify get_connections returns real QuickBooks company structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.quickbooks_oauth_service import quickbooks_client

    result = quickbooks_client.get_connections("mock_token", "realm-123")

    # Real QuickBooks company info returns array with company details
    assert isinstance(result, list)
    if result:
        company = result[0]
        # Real QuickBooks companies have these fields
        required_fields = ["realmId", "companyName"]
        for field in required_fields:
            assert field in company, f"Missing company field: {field} (mock structure)"


@pytest.mark.integration
def test_balance_sheet_import_uses_real_quickbooks_api_format():
    """
    RED TEST: Verify balance sheet parsing handles real QuickBooks API response.

    Expected: FAIL - mock returns oversimplified structure
    """
    from app.services.quickbooks_oauth_service import _parse_quickbooks_balance_sheet
    from app.models.financial_connection import FinancialConnection
    from app.models.organization import Organization
    from app.models.deal import Deal

    # Real QuickBooks balance sheet has account-based structure
    real_quickbooks_response = {
        "ReportName": "Balance Sheet",
        "Assets": [
            {"Name": "Cash", "Type": "Bank", "Balance": 50000.00},
            {"Name": "Accounts Receivable", "Type": "Accounts Receivable", "Balance": 25000.00},
        ],
        "Liabilities": [
            {"Name": "Accounts Payable", "Type": "Accounts Payable", "Balance": 15000.00},
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
        platform="quickbooks",
        access_token="token",
        refresh_token="refresh",
        platform_organization_id="realm-123"
    )

    # Mock session
    mock_session = type('Session', (), {
        'add': lambda self, obj: None,
        'commit': lambda self: None,
        'refresh': lambda self, obj: None
    })()

    # Test parsing
    statement = _parse_quickbooks_balance_sheet(real_quickbooks_response, mock_connection, mock_session)

    # Should successfully parse real QuickBooks response
    assert statement is not None, "Failed to parse real QuickBooks balance sheet structure"
    assert statement.total_assets > 0


@pytest.mark.integration
def test_quickbooks_sdk_error_handling():
    """
    RED TEST: Verify error handling for real QuickBooks API errors.

    Expected: FAIL - mock doesn't raise real QuickBooks exceptions
    """
    from app.services.quickbooks_oauth_service import quickbooks_client

    # Real QuickBooks SDK raises specific exceptions
    with pytest.raises(Exception) as exc_info:
        # Invalid token should raise exception
        quickbooks_client.get_connections("invalid_token_format", "invalid_realm")

    # Real QuickBooks errors have specific structure
    # This will fail with mock because mock returns data instead of raising
    assert exc_info.value is not None, "Should raise exception for invalid token"


@pytest.mark.integration
@pytest.mark.skipif(True, reason="Requires real QuickBooks sandbox OAuth flow - manual test")
def test_full_quickbooks_oauth_flow_with_real_api():
    """
    RED TEST: Test complete OAuth flow with real QuickBooks API.

    Expected: FAIL - uses mock MockQuickBooksClient currently

    This test requires:
    1. Valid QuickBooks sandbox app credentials
    2. Manual OAuth authorization (user consent)
    3. Valid authorization code from callback

    NOTE: This is a manual/integration test - skip in CI/CD
    """
    from app.services.quickbooks_oauth_service import handle_quickbooks_callback
    from app.models.organization import Organization
    from app.models.deal import Deal

    # This test cannot be automated - requires user OAuth consent
    # It's here as documentation of expected behavior

    # Example flow (manual steps):
    # 1. Visit authorization_url from initiate_quickbooks_oauth()
    # 2. Authorize app in QuickBooks sandbox
    # 3. Get authorization code and realm_id from redirect
    # 4. Pass code and realm_id to handle_quickbooks_callback()
    # 5. Verify real tokens are returned

    pytest.skip("Manual test - requires user OAuth consent in QuickBooks sandbox")
