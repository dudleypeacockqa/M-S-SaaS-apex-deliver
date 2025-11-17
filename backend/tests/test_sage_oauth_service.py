"""Comprehensive unit tests for sage_oauth_service.py - TDD Approach.

Target: Achieve 100% coverage for sage_oauth_service.py (currently 21.4%)
Methodology: RED → GREEN → REFACTOR
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime, timezone, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.services import sage_oauth_service
from app.models.financial_connection import FinancialConnection
from app.models.financial_statement import FinancialStatement
from app.models.deal import Deal


class TestRealSageClient:
    """Test RealSageClient class methods."""

    def test_init_raises_error_when_credentials_missing(self):
        """Test __init__ raises ValueError when credentials not configured."""
        with patch.dict('os.environ', {}, clear=True):
            with pytest.raises(ValueError, match="Sage credentials not configured"):
                sage_oauth_service.RealSageClient()

    def test_init_sets_credentials_from_env(self):
        """Test __init__ sets credentials from environment variables."""
        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            assert client.client_id == 'test_client_id'
            assert client.client_secret == 'test_client_secret'

    def test_init_uses_default_redirect_uri(self):
        """Test __init__ uses default redirect URI when not set."""
        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            assert 'localhost:3000' in client.redirect_uri

    def test_get_authorization_url_builds_correct_url(self):
        """Test get_authorization_url builds correct OAuth URL."""
        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            url = client.get_authorization_url("test_state")
            assert "sageone.com/oauth2/auth/central" in url
            assert "client_id=test_client_id" in url
            assert "state=test_state" in url
            assert "scope=full_access" in url

    @patch('app.services.sage_oauth_service.requests.post')
    def test_exchange_code_for_token_success(self, mock_post):
        """Test exchange_code_for_token successfully exchanges code for tokens."""
        mock_response = Mock()
        mock_response.json.return_value = {
            "access_token": "test_access_token",
            "refresh_token": "test_refresh_token",
            "expires_in": 3600,
            "token_type": "Bearer"
        }
        mock_response.raise_for_status = Mock()
        mock_post.return_value = mock_response

        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            result = client.exchange_code_for_token("test_code")

            assert result["access_token"] == "test_access_token"
            assert result["refresh_token"] == "test_refresh_token"
            assert result["expires_in"] == 3600
            assert result["token_type"] == "Bearer"

    @patch('app.services.sage_oauth_service.requests.post')
    def test_exchange_code_for_token_handles_http_error(self, mock_post):
        """Test exchange_code_for_token raises exception on HTTP error."""
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = Exception("HTTP 400")
        mock_post.return_value = mock_response

        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            with pytest.raises(Exception):
                client.exchange_code_for_token("test_code")

    @patch('app.services.sage_oauth_service.requests.get')
    def test_get_connections_returns_business_info(self, mock_get):
        """Test get_connections returns business information."""
        mock_response = Mock()
        mock_response.json.return_value = {
            "$items": [
                {
                    "id": "business_123",
                    "name": "Test Business",
                    "country": "GB",
                    "base_currency": "GBP"
                }
            ]
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            result = client.get_connections("test_token")

            assert len(result) == 1
            assert result[0]["businessId"] == "business_123"
            assert result[0]["businessName"] == "Test Business"

    @patch('app.services.sage_oauth_service.requests.get')
    def test_get_connections_handles_empty_response(self, mock_get):
        """Test get_connections handles empty business list."""
        mock_response = Mock()
        mock_response.json.return_value = {"$items": []}
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            result = client.get_connections("test_token")

            assert result == []

    @patch('app.services.sage_oauth_service.requests.post')
    def test_refresh_access_token_success(self, mock_post):
        """Test refresh_access_token successfully refreshes token."""
        mock_response = Mock()
        mock_response.json.return_value = {
            "access_token": "new_access_token",
            "refresh_token": "new_refresh_token",
            "expires_in": 3600
        }
        mock_response.raise_for_status = Mock()
        mock_post.return_value = mock_response

        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            result = client.refresh_access_token("old_refresh_token")

            assert result["access_token"] == "new_access_token"
            assert result["refresh_token"] == "new_refresh_token"
            assert result["expires_in"] == 3600

    @patch('app.services.sage_oauth_service.requests.post')
    def test_refresh_access_token_handles_http_error(self, mock_post):
        """Test refresh_access_token raises exception on HTTP error."""
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = Exception("HTTP 401")
        mock_post.return_value = mock_response

        with patch.dict('os.environ', {
            'SAGE_CLIENT_ID': 'test_client_id',
            'SAGE_CLIENT_SECRET': 'test_client_secret',
        }):
            client = sage_oauth_service.RealSageClient()
            with pytest.raises(Exception):
                client.refresh_access_token("old_refresh_token")


class TestHandleSageCallback:
    """Test handle_sage_callback function."""

    @patch('app.services.sage_oauth_service.sage_client')
    def test_handle_sage_callback_raises_error_when_deal_not_found(self, mock_client, db_session):
        """Test handle_sage_callback raises ValueError when deal not found."""
        with pytest.raises(ValueError, match="Deal.*not found"):
            sage_oauth_service.handle_sage_callback(
                deal_id="nonexistent_deal",
                code="test_code",
                state="test_state",
                db=db_session
            )

    @patch('app.services.sage_oauth_service.sage_client')
    def test_handle_sage_callback_creates_new_connection(self, mock_client, db_session, create_deal_for_org):
        """Test handle_sage_callback creates new FinancialConnection."""
        deal, _, _ = create_deal_for_org()
        mock_client.exchange_code_for_token.return_value = {
            "access_token": "test_access_token",
            "refresh_token": "test_refresh_token",
            "expires_in": 3600
        }
        mock_client.get_connections.return_value = [{
            "businessId": "business_123",
            "businessName": "Test Business",
            "country": "GB",
            "currency": "GBP"
        }]

        connection = sage_oauth_service.handle_sage_callback(
            deal_id=str(deal.id),
            code="test_code",
            state="test_state",
            db=db_session
        )

        assert connection.platform == "sage"
        assert connection.access_token == "test_access_token"
        assert connection.connection_status == "active"

    @patch('app.services.sage_oauth_service.sage_client')
    def test_handle_sage_callback_updates_existing_connection(self, mock_client, db_session, create_deal_for_org):
        """Test handle_sage_callback updates existing connection."""
        deal, _, _ = create_deal_for_org()
        # Create existing connection
        existing_connection = FinancialConnection(
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="old_token",
            refresh_token="old_refresh",
            connection_status="active"
        )
        db_session.add(existing_connection)
        db_session.commit()

        mock_client.exchange_code_for_token.return_value = {
            "access_token": "new_access_token",
            "refresh_token": "new_refresh_token",
            "expires_in": 3600
        }
        mock_client.get_connections.return_value = [{
            "businessId": "business_123",
            "businessName": "Test Business",
            "country": "GB",
            "currency": "GBP"
        }]

        connection = sage_oauth_service.handle_sage_callback(
            deal_id=str(deal.id),
            code="test_code",
            state="test_state",
            db=db_session
        )

        assert connection.id == existing_connection.id
        assert connection.access_token == "new_access_token"

    @patch('app.services.sage_oauth_service.sage_client')
    def test_handle_sage_callback_raises_error_when_no_businesses(self, mock_client, db_session, create_deal_for_org):
        """Test handle_sage_callback raises error when no businesses found."""
        deal, _, _ = create_deal_for_org()
        mock_client.exchange_code_for_token.return_value = {
            "access_token": "test_token",
            "refresh_token": "test_refresh",
            "expires_in": 3600
        }
        mock_client.get_connections.return_value = []

        with pytest.raises(Exception, match="No Sage businesses found"):
            sage_oauth_service.handle_sage_callback(
                deal_id=str(deal.id),
                code="test_code",
                state="test_state",
                db=db_session
            )


class TestRefreshSageToken:
    """Test refresh_sage_token function."""

    def test_refresh_sage_token_raises_error_when_connection_not_found(self, db_session):
        """Test refresh_sage_token raises ValueError when connection not found."""
        with pytest.raises(ValueError, match="Connection.*not found"):
            sage_oauth_service.refresh_sage_token(
                connection_id="nonexistent_connection",
                db=db_session
            )

    @patch('app.services.sage_oauth_service.sage_client')
    def test_refresh_sage_token_success(self, mock_client, db_session, create_deal_for_org):
        """Test refresh_sage_token successfully refreshes token."""
        deal, _, _ = create_deal_for_org()
        connection = FinancialConnection(
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="old_token",
            refresh_token="old_refresh",
            connection_status="active"
        )
        db_session.add(connection)
        db_session.commit()
        connection_id = str(connection.id)

        mock_client.refresh_access_token.return_value = {
            "access_token": "new_access_token",
            "refresh_token": "new_refresh_token",
            "expires_in": 3600
        }

        updated = sage_oauth_service.refresh_sage_token(
            connection_id=connection_id,
            db=db_session
        )

        assert updated.access_token == "new_access_token"
        assert updated.refresh_token == "new_refresh_token"
        assert updated.connection_status == "active"

    @patch('app.services.sage_oauth_service.sage_client')
    def test_refresh_sage_token_marks_expired_on_failure(self, mock_client, db_session, create_deal_for_org):
        """Test refresh_sage_token marks connection as expired on failure."""
        deal, _, _ = create_deal_for_org()
        connection = FinancialConnection(
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="old_token",
            refresh_token="old_refresh",
            connection_status="active"
        )
        db_session.add(connection)
        db_session.commit()
        connection_id = str(connection.id)

        mock_client.refresh_access_token.side_effect = Exception("Token expired")

        with pytest.raises(Exception):
            sage_oauth_service.refresh_sage_token(
                connection_id=connection_id,
                db=db_session
            )

        db_session.refresh(connection)
        assert connection.connection_status == "expired"


class TestFetchSageStatements:
    """Test fetch_sage_statements function."""

    def test_fetch_sage_statements_raises_error_when_connection_not_found(self, db_session):
        """Test fetch_sage_statements raises ValueError when connection not found."""
        with pytest.raises(ValueError, match="Connection.*not found"):
            sage_oauth_service.fetch_sage_statements(
                connection_id="nonexistent_connection",
                db=db_session
            )

    @patch('app.services.sage_oauth_service.sage_client')
    @patch('app.services.sage_oauth_service.refresh_sage_token')
    def test_fetch_sage_statements_auto_refreshes_expired_token(
        self, mock_refresh, mock_client, db_session, create_deal_for_org
    ):
        """Test fetch_sage_statements auto-refreshes expired token."""
        deal, _, _ = create_deal_for_org()
        expired_time = datetime.now(timezone.utc) - timedelta(hours=1)
        connection = FinancialConnection(
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="expired_token",
            refresh_token="refresh_token",
            token_expires_at=expired_time,
            platform_organization_id="business_123",
            connection_status="active"
        )
        db_session.add(connection)
        db_session.commit()
        connection_id = str(connection.id)

        # Mock refreshed connection
        refreshed_connection = FinancialConnection(
            id=connection.id,
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="new_token",
            refresh_token="refresh_token",
            token_expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
            platform_organization_id="business_123",
            connection_status="active"
        )
        mock_refresh.return_value = refreshed_connection

        mock_client.get_report.return_value = {
            "Assets": [{"Balance": 1000}],
            "Liabilities": [{"Balance": 500}],
            "Equity": [{"Balance": 500}]
        }

        statements = sage_oauth_service.fetch_sage_statements(
            connection_id=connection_id,
            db=db_session
        )

        # Should have called refresh
        mock_refresh.assert_called_once()

    @patch('app.services.sage_oauth_service.sage_client')
    def test_fetch_sage_statements_handles_api_error_gracefully(
        self, mock_client, db_session, create_deal_for_org
    ):
        """Test fetch_sage_statements handles API errors gracefully."""
        deal, _, _ = create_deal_for_org()
        connection = FinancialConnection(
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="test_token",
            refresh_token="refresh_token",
            token_expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
            platform_organization_id="business_123",
            connection_status="active"
        )
        db_session.add(connection)
        db_session.commit()
        connection_id = str(connection.id)

        mock_client.get_report.side_effect = Exception("API Error")

        # Should not raise, just return empty list
        statements = sage_oauth_service.fetch_sage_statements(
            connection_id=connection_id,
            db=db_session
        )

        assert statements == []


class TestDisconnectSage:
    """Test disconnect_sage function."""

    def test_disconnect_sage_deletes_connection(self, db_session, create_deal_for_org):
        """Test disconnect_sage deletes connection."""
        deal, _, _ = create_deal_for_org()
        connection = FinancialConnection(
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="test_token",
            refresh_token="refresh_token",
            connection_status="active"
        )
        db_session.add(connection)
        db_session.commit()
        connection_id = str(connection.id)

        sage_oauth_service.disconnect_sage(
            deal_id=str(deal.id),
            db=db_session
        )

        result = db_session.query(FinancialConnection).filter_by(id=connection_id).first()
        assert result is None

    def test_disconnect_sage_handles_no_connection_gracefully(self, db_session, create_deal_for_org):
        """Test disconnect_sage handles missing connection gracefully."""
        deal, _, _ = create_deal_for_org()
        # Should not raise error
        sage_oauth_service.disconnect_sage(
            deal_id=str(deal.id),
            db=db_session
        )


class TestGetSageConnectionStatus:
    """Test get_sage_connection_status function."""

    def test_get_sage_connection_status_returns_none_when_no_connection(self, db_session, create_deal_for_org):
        """Test get_sage_connection_status returns None when no connection."""
        deal, _, _ = create_deal_for_org()
        status = sage_oauth_service.get_sage_connection_status(
            deal_id=str(deal.id),
            db=db_session
        )
        assert status is None

    def test_get_sage_connection_status_returns_connection_info(self, db_session, create_deal_for_org):
        """Test get_sage_connection_status returns connection information."""
        deal, _, _ = create_deal_for_org()
        connection = FinancialConnection(
            deal_id=str(deal.id),
            organization_id=deal.organization_id,
            platform="sage",
            access_token="test_token",
            refresh_token="refresh_token",
            platform_organization_id="business_123",
            platform_organization_name="Test Business",
            connection_status="active",
            last_sync_at=datetime.now(timezone.utc)
        )
        db_session.add(connection)
        db_session.commit()

        status = sage_oauth_service.get_sage_connection_status(
            deal_id=str(deal.id),
            db=db_session
        )

        assert status is not None
        assert status["status"] == "active"
        assert status["business_name"] == "Test Business"

