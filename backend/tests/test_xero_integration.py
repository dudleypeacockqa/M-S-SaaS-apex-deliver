"""
Real Xero SDK Integration Tests - Phase 3
Tests actual xero-python SDK integration (not mocks)

TDD RED: These tests will FAIL until we implement real Xero SDK
Following Phase 3 of 100% completion plan

Requires:
- xero-python SDK installed
- Xero sandbox credentials configured in environment
"""

import pytest
import os
from unittest.mock import patch
from datetime import datetime, timezone, timedelta

# Skip if Xero credentials not configured (allows CI/CD to pass)
XERO_CONFIGURED = all([
    os.getenv("XERO_CLIENT_ID"),
    os.getenv("XERO_CLIENT_SECRET"),
])

pytestmark = pytest.mark.skipif(
    not XERO_CONFIGURED,
    reason="Xero credentials not configured (set XERO_CLIENT_ID and XERO_CLIENT_SECRET)"
)


@pytest.mark.integration
def test_xero_python_sdk_can_be_imported():
    """
    RED TEST: Verify xero-python SDK is installed and importable.

    Expected: FAIL - xero-python not yet in requirements.txt
    """
    try:
        from xeroapi import XeroClient as RealXeroClient
        from xeroapi.api import AccountingApi, IdentityApi
        assert RealXeroClient is not None
        assert AccountingApi is not None
        assert IdentityApi is not None
    except ImportError as e:
        pytest.fail(f"xero-python SDK not installed: {e}")


@pytest.mark.integration
def test_real_xero_client_class_exists():
    """
    RED TEST: Verify RealXeroClient wrapper exists in service.

    Expected: FAIL - RealXeroClient not yet implemented
    """
    from app.services.xero_oauth_service import RealXeroClient

    assert RealXeroClient is not None
    assert hasattr(RealXeroClient, 'exchange_code_for_token')
    assert hasattr(RealXeroClient, 'get_connections')
    assert hasattr(RealXeroClient, 'refresh_access_token')
    assert hasattr(RealXeroClient, 'get_report')


@pytest.mark.integration
def test_xero_oauth_url_uses_real_credentials():
    """
    RED TEST: Verify OAuth URL generation uses real Xero client ID.

    Expected: FAIL or uses placeholder value
    """
    from app.services.xero_oauth_service import initiate_xero_oauth
    from app.models.organization import Organization
    from app.models.deal import Deal

    # Mock database session with deal
    with patch('app.services.xero_oauth_service.select') as mock_select:
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

        result = initiate_xero_oauth("test-deal", mock_session)

        # Verify uses real client ID (not placeholder)
        assert "xero_client_id_placeholder" not in result["authorization_url"]

        # Verify includes required scopes
        required_scopes = [
            "offline_access",
            "accounting.transactions.read",
            "accounting.reports.read",
            "accounting.settings.read"
        ]
        for scope in required_scopes:
            assert scope in result["authorization_url"]


@pytest.mark.integration
@pytest.mark.skipif(True, reason="Requires real Xero sandbox OAuth flow - manual test")
def test_full_xero_oauth_flow_with_real_api():
    """
    RED TEST: Test complete OAuth flow with real Xero API.

    Expected: FAIL - uses mock XeroClient currently

    This test requires:
    1. Valid Xero sandbox app credentials
    2. Manual OAuth authorization (user consent)
    3. Valid authorization code from callback

    NOTE: This is a manual/integration test - skip in CI/CD
    """
    from app.services.xero_oauth_service import handle_xero_callback
    from app.models.organization import Organization
    from app.models.deal import Deal

    # This test cannot be automated - requires user OAuth consent
    # It's here as documentation of expected behavior

    # Example flow (manual steps):
    # 1. Visit authorization_url from initiate_xero_oauth()
    # 2. Authorize app in Xero sandbox
    # 3. Get authorization code from redirect
    # 4. Pass code to handle_xero_callback()
    # 5. Verify real tokens are returned

    pytest.skip("Manual test - requires user OAuth consent in Xero sandbox")


@pytest.mark.integration
def test_xero_client_has_real_configuration():
    """
    RED TEST: Verify XeroClient uses real SDK configuration.

    Expected: FAIL - currently returns mock data
    """
    from app.services.xero_oauth_service import xero_client

    # Check client is using real Xero SDK (not mock)
    client_class_name = xero_client.__class__.__name__

    # Should be RealXeroClient, not XeroClient (mock)
    assert client_class_name == "RealXeroClient", \
        f"Expected RealXeroClient, got {client_class_name} (still using mock)"


@pytest.mark.integration
def test_token_exchange_structure_matches_xero_api():
    """
    RED TEST: Verify token exchange returns Xero API structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.xero_oauth_service import xero_client

    # Mock a token exchange call
    result = xero_client.exchange_code_for_token("test_code")

    # Real Xero API returns specific fields
    required_fields = ["access_token", "refresh_token", "expires_in", "token_type"]
    for field in required_fields:
        assert field in result, f"Missing field: {field}"

    # Verify token format (real Xero tokens are longer)
    assert len(result["access_token"]) > 100, \
        "Real Xero access tokens are >100 chars (mock tokens are shorter)"


@pytest.mark.integration
def test_get_connections_returns_real_tenant_structure():
    """
    RED TEST: Verify get_connections returns real Xero tenant structure.

    Expected: FAIL - mock returns simplified structure
    """
    from app.services.xero_oauth_service import xero_client

    result = xero_client.get_connections("mock_token")

    # Real Xero connections API returns array of tenant objects
    assert isinstance(result, list)
    if result:
        tenant = result[0]
        # Real Xero tenants have these fields
        required_fields = ["tenantId", "tenantName", "tenantType", "createdDateUtc"]
        for field in required_fields:
            assert field in tenant, f"Missing tenant field: {field} (mock structure)"


@pytest.mark.integration
def test_balance_sheet_import_uses_real_xero_api_format():
    """
    RED TEST: Verify balance sheet parsing handles real Xero API response.

    Expected: FAIL - mock returns oversimplified structure
    """
    from app.services.xero_oauth_service import _parse_xero_balance_sheet
    from app.models.financial_connection import FinancialConnection
    from app.models.organization import Organization
    from app.models.deal import Deal

    # Real Xero balance sheet has complex nested structure
    real_xero_response = {
        "Reports": [{
            "ReportID": "BalanceSheet",
            "ReportName": "Balance Sheet",
            "ReportDate": "31 December 2024",
            "UpdatedDateUTC": "/Date(1704067200000)/",
            "ReportTitles": ["Balance Sheet", "Demo Company (US)", "As at 31 December 2024"],
            "Rows": [
                {
                    "RowType": "Header",
                    "Cells": [
                        {"Value": ""},
                        {"Value": "31 Dec 24"},
                        {"Value": "31 Dec 23"}
                    ]
                },
                {
                    "RowType": "Section",
                    "Title": "Assets",
                    "Rows": [
                        {
                            "RowType": "Section",
                            "Title": "Current Assets",
                            "Rows": [
                                {
                                    "RowType": "Row",
                                    "Cells": [
                                        {"Value": "Cash", "Attributes": [{"Id": "account", "Value": "guid"}]},
                                        {"Value": "500000.00", "Attributes": [{"Id": "value"}]},
                                        {"Value": "400000.00"}
                                    ]
                                }
                            ]
                        },
                        {
                            "RowType": "SummaryRow",
                            "Cells": [
                                {"Value": "Total Assets"},
                                {"Value": "1000000.00"}
                            ]
                        }
                    ]
                }
            ]
        }]
    }

    # Mock database objects
    mock_org = Organization(id="org-1", name="Test", slug="test")
    mock_deal = Deal(id="deal-1", organization_id=mock_org.id, name="Deal", target_company="T", owner_id="u1")
    mock_connection = FinancialConnection(
        id="conn-1",
        deal_id=mock_deal.id,
        organization_id=mock_org.id,
        platform="xero",
        access_token="token",
        refresh_token="refresh",
        platform_organization_id="tenant"
    )

    # Mock session
    mock_session = type('Session', (), {
        'add': lambda self, obj: None,
        'commit': lambda self: None,
        'refresh': lambda self, obj: None
    })()

    # Test parsing
    statement = _parse_xero_balance_sheet(real_xero_response, mock_connection, mock_session)

    # Should successfully parse real Xero response
    assert statement is not None, "Failed to parse real Xero balance sheet structure"
    assert statement.total_assets > 0


@pytest.mark.integration
def test_xero_sdk_error_handling():
    """
    RED TEST: Verify error handling for real Xero API errors.

    Expected: FAIL - mock doesn't raise real Xero exceptions
    """
    from app.services.xero_oauth_service import xero_client

    # Real Xero SDK raises specific exceptions
    with pytest.raises(Exception) as exc_info:
        # Invalid token should raise XeroException
        xero_client.get_connections("invalid_token_format")

    # Real Xero errors have specific structure
    # This will fail with mock because mock returns data instead of raising
    assert exc_info.value is not None, "Should raise exception for invalid token"
