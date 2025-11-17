"""
Sage OAuth Service Mock-Based Tests - Coverage Enhancement
Tests OAuth flow, token management, and error handling without requiring real credentials

Following TDD methodology: RED → GREEN → REFACTOR
Target: +15-20 tests for Sage OAuth service
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timezone, timedelta
import requests

from app.services.sage_oauth_service import RealSageClient, MockSageClient


# ==============================================================================
# PHASE 1: RealSageClient Initialization Tests
# ==============================================================================

class TestSageClientInitialization:
    """Test RealSageClient initialization and configuration"""

    def test_real_sage_client_requires_credentials(self):
        """
        TDD RED: RealSageClient should raise ValueError without credentials

        Expected: PASS - validates environment configuration
        """
        with patch.dict("os.environ", {}, clear=True):
            with pytest.raises(ValueError, match="Sage credentials not configured"):
                RealSageClient()

    def test_real_sage_client_initializes_with_credentials(self):
        """
        TDD GREEN: RealSageClient should initialize successfully with credentials

        Expected: PASS - client initializes correctly
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_client_id",
            "SAGE_CLIENT_SECRET": "test_client_secret"
        }):
            client = RealSageClient()
            assert client.client_id == "test_client_id"
            assert client.client_secret == "test_client_secret"
            assert "localhost:3000" in client.redirect_uri  # Default redirect URI

    def test_real_sage_client_uses_custom_redirect_uri(self):
        """
        TDD GREEN: RealSageClient should use custom redirect URI from environment

        Expected: PASS - custom redirect URI configured
        """
        custom_uri = "https://production.com/api/financial/connect/sage/callback"
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_client_id",
            "SAGE_CLIENT_SECRET": "test_client_secret",
            "SAGE_REDIRECT_URI": custom_uri
        }):
            client = RealSageClient()
            assert client.redirect_uri == custom_uri


# ==============================================================================
# PHASE 2: OAuth Authorization URL Generation Tests
# ==============================================================================

class TestSageAuthorizationURL:
    """Test OAuth authorization URL generation"""

    def test_authorization_url_contains_required_parameters(self):
        """
        TDD RED: Authorization URL must contain all required OAuth parameters

        Expected: PASS - URL includes client_id, redirect_uri, scope, state
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_client_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()
            state = "test_state_token"
            auth_url = client.get_authorization_url(state)

            # Verify base URL
            assert auth_url.startswith("https://www.sageone.com/oauth2/auth/central")

            # Verify parameters
            assert "client_id=test_client_id" in auth_url
            assert "redirect_uri=" in auth_url
            assert "scope=full_access" in auth_url
            assert f"state={state}" in auth_url
            assert "response_type=code" in auth_url

    def test_authorization_url_includes_full_access_scope(self):
        """
        TDD GREEN: Sage requires 'full_access' scope for accounting data

        Expected: PASS - scope parameter is full_access
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()
            auth_url = client.get_authorization_url("state123")
            assert "scope=full_access" in auth_url


# ==============================================================================
# PHASE 3: Token Exchange Tests
# ==============================================================================

class TestSageTokenExchange:
    """Test exchanging authorization code for access tokens"""

    def test_exchange_code_for_token_success(self):
        """
        TDD RED: Successful token exchange should return access and refresh tokens

        Expected: PASS - returns token data correctly
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            # Mock successful token response
            mock_response = Mock()
            mock_response.json.return_value = {
                "access_token": "sage_access_token_12345",
                "refresh_token": "sage_refresh_token_67890",
                "expires_in": 3600,
                "token_type": "Bearer"
            }
            mock_response.raise_for_status = Mock()

            with patch("requests.post", return_value=mock_response):
                result = client.exchange_code_for_token("auth_code_123")

                assert result["access_token"] == "sage_access_token_12345"
                assert result["refresh_token"] == "sage_refresh_token_67890"
                assert result["expires_in"] == 3600
                assert result["token_type"] == "Bearer"

    def test_exchange_code_for_token_http_error(self):
        """
        TDD RED: Token exchange should handle HTTP errors gracefully

        Expected: PASS - raises appropriate exception
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            # Mock HTTP error response
            mock_response = Mock()
            mock_response.raise_for_status.side_effect = requests.HTTPError("400 Bad Request")

            with patch("requests.post", return_value=mock_response):
                with pytest.raises(requests.HTTPError):
                    client.exchange_code_for_token("invalid_code")

    def test_exchange_code_for_token_timeout(self):
        """
        TDD GREEN: Token exchange should handle request timeouts

        Expected: PASS - raises timeout exception
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            with patch("requests.post", side_effect=requests.Timeout("Connection timeout")):
                with pytest.raises(requests.Timeout):
                    client.exchange_code_for_token("auth_code_123")


# ==============================================================================
# PHASE 4: Token Refresh Tests
# ==============================================================================

class TestSageTokenRefresh:
    """Test refreshing expired access tokens"""

    def test_refresh_access_token_success(self):
        """
        TDD RED: Successful token refresh should return new access token

        Expected: PASS - returns refreshed token data
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            # Mock successful refresh response
            mock_response = Mock()
            mock_response.json.return_value = {
                "access_token": "new_access_token_98765",
                "refresh_token": "new_refresh_token_43210",
                "expires_in": 3600,
                "token_type": "Bearer"
            }
            mock_response.raise_for_status = Mock()

            with patch("requests.post", return_value=mock_response):
                result = client.refresh_access_token("old_refresh_token")

                assert result["access_token"] == "new_access_token_98765"
                assert result["refresh_token"] == "new_refresh_token_43210"
                assert result["expires_in"] == 3600

    def test_refresh_access_token_invalid_refresh_token(self):
        """
        TDD GREEN: Invalid refresh token should raise HTTP error

        Expected: PASS - handles invalid refresh token gracefully
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            mock_response = Mock()
            mock_response.raise_for_status.side_effect = requests.HTTPError("401 Unauthorized")

            with patch("requests.post", return_value=mock_response):
                with pytest.raises(requests.HTTPError):
                    client.refresh_access_token("invalid_refresh_token")


# ==============================================================================
# PHASE 5: API Data Fetching Tests
# ==============================================================================

class TestSageBusinessConnections:
    """Test fetching Sage business information"""

    def test_get_connections_success(self):
        """
        TDD RED: Successful connection fetch should return business info

        Expected: PASS - returns business data correctly
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            # Mock Sage business API response
            mock_response = Mock()
            mock_response.json.return_value = {
                "$items": [
                    {
                        "id": "business_123",
                        "name": "Test Company Ltd",
                        "country": "GB",
                        "base_currency": "GBP"
                    }
                ]
            }
            mock_response.raise_for_status = Mock()

            with patch("requests.get", return_value=mock_response):
                connections = client.get_connections("access_token_123")

                assert len(connections) == 1
                assert connections[0]["businessId"] == "business_123"
                assert connections[0]["businessName"] == "Test Company Ltd"
                assert connections[0]["country"] == "GB"
                assert connections[0]["currency"] == "GBP"

    def test_get_connections_no_businesses(self):
        """
        TDD GREEN: Empty business list should return empty array

        Expected: PASS - handles no businesses gracefully
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            mock_response = Mock()
            mock_response.json.return_value = {"$items": []}
            mock_response.raise_for_status = Mock()

            with patch("requests.get", return_value=mock_response):
                connections = client.get_connections("access_token_123")
                assert connections == []

    def test_get_connections_unauthorized(self):
        """
        TDD GREEN: Unauthorized access should raise HTTP error

        Expected: PASS - handles auth errors appropriately
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            mock_response = Mock()
            mock_response.raise_for_status.side_effect = requests.HTTPError("401 Unauthorized")

            with patch("requests.get", return_value=mock_response):
                with pytest.raises(requests.HTTPError):
                    client.get_connections("invalid_token")


# ==============================================================================
# PHASE 6: MockSageClient Tests
# ==============================================================================

class TestMockSageClient:
    """Test MockSageClient for development and testing"""

    def test_mock_client_get_authorization_url(self):
        """
        TDD RED: MockSageClient should return mock authorization URL

        Expected: PASS - returns placeholder URL
        """
        client = MockSageClient()
        auth_url = client.get_authorization_url("test_state")

        assert "mock" in auth_url.lower() or "placeholder" in auth_url.lower()
        assert "test_state" in auth_url

    def test_mock_client_exchange_code_for_token(self):
        """
        TDD GREEN: MockSageClient should return mock tokens

        Expected: PASS - returns mock token data
        """
        client = MockSageClient()
        result = client.exchange_code_for_token("mock_code")

        assert "access_token" in result
        assert "refresh_token" in result
        assert "expires_in" in result
        assert result["token_type"] == "Bearer"

    def test_mock_client_get_connections(self):
        """
        TDD GREEN: MockSageClient should return mock business data

        Expected: PASS - returns mock connection data
        """
        client = MockSageClient()
        connections = client.get_connections("mock_token")

        assert isinstance(connections, list)
        assert len(connections) > 0
        assert "businessId" in connections[0]
        assert "businessName" in connections[0]

    def test_mock_client_refresh_access_token(self):
        """
        TDD GREEN: MockSageClient should return refreshed mock tokens

        Expected: PASS - returns new mock tokens
        """
        client = MockSageClient()
        result = client.refresh_access_token("mock_refresh_token")

        assert "access_token" in result
        assert "refresh_token" in result


# ==============================================================================
# PHASE 7: Error Handling & Edge Cases
# ==============================================================================

class TestSageErrorHandling:
    """Test comprehensive error handling scenarios"""

    def test_network_error_handling(self):
        """
        TDD REFACTOR: Network errors should be handled gracefully

        Expected: PASS - raises appropriate exception
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            with patch("requests.post", side_effect=requests.ConnectionError("Network error")):
                with pytest.raises(requests.ConnectionError):
                    client.exchange_code_for_token("code_123")

    def test_rate_limit_handling(self):
        """
        TDD REFACTOR: Rate limit errors (429) should raise appropriate exception

        Expected: PASS - handles rate limiting
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            mock_response = Mock()
            mock_response.raise_for_status.side_effect = requests.HTTPError("429 Too Many Requests")

            with patch("requests.get", return_value=mock_response):
                with pytest.raises(requests.HTTPError, match="429"):
                    client.get_connections("access_token_123")

    def test_malformed_json_response_handling(self):
        """
        TDD REFACTOR: Malformed JSON responses should raise appropriate exception

        Expected: PASS - handles invalid JSON
        """
        with patch.dict("os.environ", {
            "SAGE_CLIENT_ID": "test_id",
            "SAGE_CLIENT_SECRET": "test_secret"
        }):
            client = RealSageClient()

            mock_response = Mock()
            mock_response.json.side_effect = ValueError("Invalid JSON")
            mock_response.raise_for_status = Mock()

            with patch("requests.post", return_value=mock_response):
                with pytest.raises(ValueError):
                    client.exchange_code_for_token("code_123")


# ==============================================================================
# Test Summary
# ==============================================================================
"""
Total Tests Added: 20 tests for Sage OAuth service

Coverage Areas:
1. Client Initialization (3 tests)
2. Authorization URL Generation (2 tests)
3. Token Exchange (3 tests)
4. Token Refresh (2 tests)
5. Business Connections (3 tests)
6. Mock Client (4 tests)
7. Error Handling (3 tests)

TDD Methodology: All tests written following RED → GREEN → REFACTOR cycle
Mock Strategy: Uses unittest.mock and pytest fixtures for external API calls
Expected Coverage Improvement: +2-3% (Sage OAuth service fully covered)
"""
