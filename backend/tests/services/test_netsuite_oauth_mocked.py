"""
NetSuite OAuth Service Mock-Based Tests - Coverage Enhancement
Tests OAuth flow, token management, and error handling without requiring real credentials

Following TDD methodology: RED → GREEN → REFACTOR
Target: +18 tests for NetSuite OAuth service
"""

import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timezone

# Import module to test
from app.services.netsuite_oauth_service import MockNetSuiteClient, RealNetSuiteClient


# ==============================================================================
# PHASE 1: MockNetSuiteClient Initialization Tests
# ==============================================================================

class TestNetSuiteClientInitialization:
    """Test NetSuiteClient initialization and configuration"""

    def test_mock_client_initializes_without_credentials(self):
        """
        TDD GREEN: MockNetSuiteClient should initialize without credentials

        Expected: PASS - mock client doesn't require credentials
        """
        client = MockNetSuiteClient()
        assert client is not None

    def test_real_client_requires_credentials(self):
        """
        TDD RED: RealNetSuiteClient should raise ValueError without credentials

        Expected: PASS - validates environment configuration
        """
        with patch.dict("os.environ", {}, clear=True):
            with pytest.raises(ValueError, match="NetSuite credentials not configured"):
                RealNetSuiteClient()

    def test_real_client_initializes_with_credentials(self):
        """
        TDD GREEN: RealNetSuiteClient should initialize successfully with credentials

        Expected: PASS - client initializes correctly
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_client_id",
            "NETSUITE_CLIENT_SECRET": "test_client_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()
            assert client.client_id == "test_client_id"
            assert client.client_secret == "test_client_secret"
            assert client.account_id == "1234567"


# ==============================================================================
# PHASE 2: OAuth Authorization URL Generation Tests
# ==============================================================================

class TestNetSuiteAuthorizationURL:
    """Test OAuth authorization URL generation"""

    def test_mock_authorization_url_contains_state(self):
        """
        TDD RED: Authorization URL must contain state parameter

        Expected: PASS - URL includes state for CSRF protection
        """
        client = MockNetSuiteClient()
        state = "test_state_token"
        auth_url = client.get_authorization_url(state)

        assert "state=" in auth_url
        assert state in auth_url

    def test_real_authorization_url_contains_required_parameters(self):
        """
        TDD GREEN: Real authorization URL must contain all required OAuth parameters

        Expected: PASS - URL includes client_id, redirect_uri, scope, state
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_client_id",
            "NETSUITE_CLIENT_SECRET": "test_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()
            state = "test_state_token"
            auth_url = client.get_authorization_url(state)

            # Verify base URL
            assert auth_url.startswith("https://system.netsuite.com/app/login/oauth2/authorize.nl")

            # Verify parameters
            assert "client_id=test_client_id" in auth_url
            assert "redirect_uri=" in auth_url
            assert "scope=rest_webservices" in auth_url
            assert f"state={state}" in auth_url
            assert "response_type=code" in auth_url

    def test_authorization_url_includes_rest_webservices_scope(self):
        """
        TDD GREEN: NetSuite requires 'rest_webservices' scope for API access

        Expected: PASS - scope parameter is rest_webservices
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_id",
            "NETSUITE_CLIENT_SECRET": "test_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()
            auth_url = client.get_authorization_url("state123")
            assert "scope=rest_webservices" in auth_url


# ==============================================================================
# PHASE 3: Token Exchange Tests
# ==============================================================================

class TestNetSuiteTokenExchange:
    """Test exchanging authorization code for access tokens"""

    def test_mock_exchange_code_for_token_returns_required_fields(self):
        """
        TDD RED: Token exchange should return all required fields

        Expected: PASS - returns access_token, refresh_token, expires_in
        """
        client = MockNetSuiteClient()
        result = client.exchange_code_for_token("auth_code_123")

        assert "access_token" in result
        assert "refresh_token" in result
        assert "expires_in" in result
        assert "token_type" in result

    def test_mock_exchange_generates_unique_tokens(self):
        """
        TDD GREEN: Multiple exchanges should generate unique tokens

        Expected: PASS - each exchange returns different tokens
        """
        client = MockNetSuiteClient()

        result1 = client.exchange_code_for_token("code1")
        result2 = client.exchange_code_for_token("code2")

        # Tokens should be unique
        assert result1["access_token"] != result2["access_token"]
        assert result1["refresh_token"] != result2["refresh_token"]

    @patch('requests.post')
    def test_real_exchange_code_for_token_success(self, mock_post):
        """
        TDD GREEN: Real token exchange should call NetSuite API correctly

        Expected: PASS - makes correct API call and returns tokens
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_id",
            "NETSUITE_CLIENT_SECRET": "test_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()

            # Mock successful token response
            mock_response = Mock()
            mock_response.json.return_value = {
                "access_token": "netsuite_access_token_12345",
                "refresh_token": "netsuite_refresh_token_67890",
                "expires_in": 3600,
                "token_type": "Bearer"
            }
            mock_response.raise_for_status = Mock()
            mock_post.return_value = mock_response

            result = client.exchange_code_for_token("auth_code_123")

            assert result["access_token"] == "netsuite_access_token_12345"
            assert result["refresh_token"] == "netsuite_refresh_token_67890"
            assert result["expires_in"] == 3600
            assert result["token_type"] == "Bearer"

    @patch('requests.post')
    def test_real_exchange_code_http_error(self, mock_post):
        """
        TDD RED: Token exchange should handle HTTP errors gracefully

        Expected: PASS - raises appropriate exception
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_id",
            "NETSUITE_CLIENT_SECRET": "test_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()

            # Mock HTTP error response
            mock_response = Mock()
            mock_response.raise_for_status.side_effect = Exception("400 Bad Request")
            mock_post.return_value = mock_response

            with pytest.raises(Exception, match="400 Bad Request"):
                client.exchange_code_for_token("invalid_code")


# ==============================================================================
# PHASE 4: Token Refresh Tests
# ==============================================================================

class TestNetSuiteTokenRefresh:
    """Test refreshing expired access tokens"""

    def test_mock_refresh_access_token_returns_new_token(self):
        """
        TDD RED: Token refresh should return new access token

        Expected: PASS - returns refreshed token data
        """
        client = MockNetSuiteClient()
        result = client.refresh_access_token("old_refresh_token")

        assert "access_token" in result
        assert "refresh_token" in result
        assert "expires_in" in result

    def test_mock_refresh_generates_unique_tokens(self):
        """
        TDD GREEN: Multiple refreshes should generate unique access tokens

        Expected: PASS - each refresh returns different access token
        """
        client = MockNetSuiteClient()

        result1 = client.refresh_access_token("refresh1")
        result2 = client.refresh_access_token("refresh2")

        # Access tokens should be unique
        assert result1["access_token"] != result2["access_token"]

    @patch('requests.post')
    def test_real_refresh_access_token_success(self, mock_post):
        """
        TDD GREEN: Real token refresh should call NetSuite API correctly

        Expected: PASS - makes correct API call and returns new tokens
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_id",
            "NETSUITE_CLIENT_SECRET": "test_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()

            # Mock successful refresh response
            mock_response = Mock()
            mock_response.json.return_value = {
                "access_token": "new_access_token_98765",
                "refresh_token": "new_refresh_token_43210",
                "expires_in": 3600
            }
            mock_response.raise_for_status = Mock()
            mock_post.return_value = mock_response

            result = client.refresh_access_token("old_refresh_token")

            assert result["access_token"] == "new_access_token_98765"
            assert result["refresh_token"] == "new_refresh_token_43210"
            assert result["expires_in"] == 3600


# ==============================================================================
# PHASE 5: Company Connections Tests
# ==============================================================================

class TestNetSuiteCompanyConnections:
    """Test fetching NetSuite company information"""

    def test_mock_get_connections_returns_company_list(self):
        """
        TDD RED: get_connections should return company info

        Expected: PASS - returns list with company data
        """
        client = MockNetSuiteClient()
        connections = client.get_connections("access_token_123")

        assert isinstance(connections, list)
        assert len(connections) == 1

    def test_mock_get_connections_contains_required_fields(self):
        """
        TDD GREEN: Company data should contain required fields

        Expected: PASS - accountId, companyName, legalName, fiscalCalendar present
        """
        client = MockNetSuiteClient()
        connections = client.get_connections("access_token_123")

        company = connections[0]
        assert "accountId" in company
        assert "companyName" in company
        assert "legalName" in company
        assert "fiscalCalendar" in company

    @patch('requests.get')
    def test_real_get_connections_success(self, mock_get):
        """
        TDD GREEN: Real connections fetch should call NetSuite API correctly

        Expected: PASS - makes correct API call and returns company data
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_id",
            "NETSUITE_CLIENT_SECRET": "test_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()

            # Mock NetSuite company API response
            mock_response = Mock()
            mock_response.json.return_value = {
                "companyName": "Test NetSuite Company",
                "legalName": "Test NetSuite Company LLC",
                "fiscalCalendar": "Standard Calendar"
            }
            mock_response.raise_for_status = Mock()
            mock_get.return_value = mock_response

            connections = client.get_connections("access_token_123")

            assert len(connections) == 1
            assert connections[0]["accountId"] == "1234567"
            assert connections[0]["companyName"] == "Test NetSuite Company"
            assert connections[0]["legalName"] == "Test NetSuite Company LLC"


# ==============================================================================
# PHASE 6: Report Fetching Tests
# ==============================================================================

class TestNetSuiteReportFetching:
    """Test fetching financial reports from NetSuite"""

    def test_mock_get_report_returns_balance_sheet(self):
        """
        TDD RED: get_report should return balance sheet data

        Expected: PASS - returns dict with balance sheet structure
        """
        client = MockNetSuiteClient()
        report = client.get_report(
            access_token="token",
            refresh_token="refresh",
            report_type="balance_sheet"
        )

        assert isinstance(report, dict)
        assert "ReportName" in report
        assert "Assets" in report
        assert "Liabilities" in report
        assert "Equity" in report

    def test_mock_get_report_balance_sheet_has_accounts(self):
        """
        TDD GREEN: Balance sheet should have account details

        Expected: PASS - accounts have Name, Number, Type, Balance
        """
        client = MockNetSuiteClient()
        report = client.get_report(
            access_token="token",
            refresh_token="refresh",
            report_type="balance_sheet"
        )

        # Check asset account structure
        if report["Assets"]:
            asset = report["Assets"][0]
            assert "Name" in asset
            assert "Number" in asset
            assert "Type" in asset
            assert "Balance" in asset

    def test_mock_get_report_unsupported_type_raises_error(self):
        """
        TDD REFACTOR: Unsupported report types should raise ValueError

        Expected: PASS - raises ValueError for unknown report types
        """
        client = MockNetSuiteClient()

        with pytest.raises(ValueError, match="Unsupported report type"):
            client.get_report(
                access_token="token",
                refresh_token="refresh",
                report_type="unsupported_report_type"
            )

    @patch('requests.post')
    def test_real_get_report_calls_suiteql_api(self, mock_post):
        """
        TDD GREEN: Real report fetch should use NetSuite SUITEQL API

        Expected: PASS - makes correct SUITEQL API call
        """
        with patch.dict("os.environ", {
            "NETSUITE_CLIENT_ID": "test_id",
            "NETSUITE_CLIENT_SECRET": "test_secret",
            "NETSUITE_ACCOUNT_ID": "1234567"
        }):
            client = RealNetSuiteClient()

            # Mock SUITEQL response
            mock_response = Mock()
            mock_response.json.return_value = {
                "items": [
                    {
                        "id": "1",
                        "accountNumber": "1000",
                        "accountName": "Cash",
                        "accountType": "Bank",
                        "balance": 50000.00
                    },
                    {
                        "id": "2",
                        "accountNumber": "2000",
                        "accountName": "Accounts Payable",
                        "accountType": "AcctPay",
                        "balance": 15000.00
                    }
                ]
            }
            mock_response.raise_for_status = Mock()
            mock_post.return_value = mock_response

            report = client.get_report(
                access_token="token",
                refresh_token="refresh",
                report_type="balance_sheet"
            )

            assert report["ReportName"] == "Balance Sheet"
            assert len(report["Assets"]) == 1  # Cash account
            assert len(report["Liabilities"]) == 1  # Accounts Payable


# ==============================================================================
# Test Summary
# ==============================================================================
"""
Total Tests Added: 18 tests for NetSuite OAuth service

Coverage Areas:
1. Client Initialization (3 tests)
   - Mock client initialization
   - Real client credential validation
   - Real client initialization with credentials

2. Authorization URL Generation (3 tests)
   - Mock URL with state
   - Real URL with required parameters
   - REST web services scope validation

3. Token Exchange (4 tests)
   - Mock exchange returns required fields
   - Mock generates unique tokens
   - Real exchange success
   - Real exchange HTTP error handling

4. Token Refresh (3 tests)
   - Mock refresh returns new token
   - Mock generates unique tokens
   - Real refresh success

5. Company Connections (3 tests)
   - Mock returns company list
   - Mock contains required fields
   - Real connections API call

6. Report Fetching (4 tests)
   - Mock returns balance sheet
   - Mock balance sheet has account details
   - Mock raises error for unsupported types
   - Real SUITEQL API call

TDD Methodology: All tests written following RED → GREEN → REFACTOR cycle
Mock Strategy: Uses MockNetSuiteClient + mocked requests for RealNetSuiteClient
Expected Coverage Improvement: +2-3% (NetSuite OAuth service fully covered)
"""
