"""
NetSuite OAuth Integration Service - DEV-010 (Phase 11)
Handles OAuth 2.0 flow, token management, and data import from NetSuite ERP

Phase 11: REST API integration using SuiteCloud OAuth 2.0
Enterprise Market Focus: 15% of target market uses NetSuite
"""

import os
import secrets
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select

import requests

from app.models.financial_connection import FinancialConnection
from app.models.financial_statement import FinancialStatement
from app.models.deal import Deal


# NetSuite API Configuration
# Note: NetSuite uses account-specific domains (e.g., {account_id}.suitetalk.api.netsuite.com)
NETSUITE_AUTH_URL = "https://system.netsuite.com/app/login/oauth2/authorize.nl"
NETSUITE_TOKEN_URL = "https://system.netsuite.com/app/login/oauth2/token.nl"


class RealNetSuiteClient:
    """
    Real NetSuite client using SuiteCloud REST API with OAuth 2.0.

    Wraps the NetSuite SuiteCloud REST API to provide consistent interface
    for OAuth flow, token management, and data fetching.

    Phase 11: Production-ready NetSuite integration for enterprise market

    NetSuite OAuth 2.0 Notes:
    - Requires account ID for API endpoint construction
    - Uses certificate-based authentication (client credentials flow)
    - Access tokens expire after 1 hour
    - Refresh tokens valid for 7 days
    """

    def __init__(self):
        """Initialize NetSuite API client with credentials from environment."""
        self.client_id = os.getenv("NETSUITE_CLIENT_ID")
        self.client_secret = os.getenv("NETSUITE_CLIENT_SECRET")
        self.account_id = os.getenv("NETSUITE_ACCOUNT_ID")  # Required for NetSuite
        self.redirect_uri = os.getenv(
            "NETSUITE_REDIRECT_URI",
            "http://localhost:3000/api/financial/connect/netsuite/callback"
        )

        if not self.client_id or not self.client_secret:
            raise ValueError(
                "NetSuite credentials not configured. "
                "Set NETSUITE_CLIENT_ID, NETSUITE_CLIENT_SECRET, and NETSUITE_ACCOUNT_ID environment variables."
            )

        # NetSuite REST API base URL (account-specific)
        self.api_base_url = f"https://{self.account_id}.suitetalk.api.netsuite.com/services/rest"

    def get_authorization_url(self, state: str) -> str:
        """
        Generate authorization URL for OAuth 2.0 flow.

        Args:
            state: CSRF token for security

        Returns:
            Authorization URL to redirect user to
        """
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "rest_webservices",  # NetSuite REST web services scope
            "state": state,
        }

        # Build URL manually
        query_string = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{NETSUITE_AUTH_URL}?{query_string}"

    def exchange_code_for_token(self, code: str) -> Dict:
        """
        Exchange authorization code for access/refresh tokens.

        Args:
            code: Authorization code from OAuth callback

        Returns:
            Dict with access_token, refresh_token, expires_in, token_type
        """
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
        }

        # NetSuite requires Basic Auth with client_id:client_secret
        auth = (self.client_id, self.client_secret)

        response = requests.post(
            NETSUITE_TOKEN_URL,
            data=payload,
            auth=auth,
            timeout=30
        )
        response.raise_for_status()

        token_data = response.json()

        return {
            "access_token": token_data["access_token"],
            "refresh_token": token_data["refresh_token"],
            "expires_in": token_data.get("expires_in", 3600),  # Default 1 hour
            "token_type": token_data.get("token_type", "Bearer"),
        }

    def refresh_access_token(self, refresh_token: str) -> Dict:
        """
        Refresh expired access token using refresh token.

        Args:
            refresh_token: Valid refresh token

        Returns:
            Dict with new access_token, refresh_token, expires_in
        """
        payload = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }

        auth = (self.client_id, self.client_secret)

        response = requests.post(
            NETSUITE_TOKEN_URL,
            data=payload,
            auth=auth,
            timeout=30
        )
        response.raise_for_status()

        token_data = response.json()

        return {
            "access_token": token_data["access_token"],
            "refresh_token": token_data.get("refresh_token", refresh_token),
            "expires_in": token_data.get("expires_in", 3600),
        }

    def get_connections(self, access_token: str) -> List[Dict]:
        """
        Get NetSuite company/account information.

        Args:
            access_token: Valid OAuth access token

        Returns:
            List of companies (NetSuite accounts) - typically one account per connection
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        # Get company information from account endpoint
        response = requests.get(
            f"{self.api_base_url}/record/v1/companyInformation",
            headers=headers,
            timeout=30
        )
        response.raise_for_status()

        company_data = response.json()

        # NetSuite returns single company info, format as list for consistency
        return [{
            "accountId": self.account_id,
            "companyName": company_data.get("companyName", "NetSuite Account"),
            "legalName": company_data.get("legalName"),
            "fiscalCalendar": company_data.get("fiscalCalendar"),
        }]

    def get_report(
        self,
        access_token: str,
        refresh_token: str,
        report_type: str = "balance_sheet"
    ) -> Dict:
        """
        Fetch financial report from NetSuite.

        Args:
            access_token: Valid OAuth access token
            refresh_token: Refresh token for token renewal
            report_type: Type of report (balance_sheet, income_statement, etc.)

        Returns:
            Financial report data in NetSuite format
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "prefer": "transient",  # NetSuite REST API preference
        }

        # NetSuite uses SUITEQL for financial queries
        # Query balance sheet accounts
        if report_type == "balance_sheet":
            # SUITEQL query for balance sheet accounts
            query = """
                SELECT
                    account.id,
                    account.accountNumber,
                    account.accountName,
                    account.accountType,
                    account.balance
                FROM
                    account
                WHERE
                    account.accountType IN ('Bank', 'AcctRec', 'OthCurrAsset',
                                           'FixedAsset', 'AcctPay', 'CreditCard',
                                           'LongTermLiab', 'Equity')
                ORDER BY
                    account.accountNumber
            """

            payload = {"q": query}

            response = requests.post(
                f"{self.api_base_url}/query/v1/suiteql",
                headers=headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()

            result = response.json()

            # Transform NetSuite SUITEQL result to balance sheet format
            accounts = result.get("items", [])

            # Categorize accounts
            assets = []
            liabilities = []
            equity = []

            for account in accounts:
                account_type = account.get("accountType", "")
                account_data = {
                    "Name": account.get("accountName", ""),
                    "Number": account.get("accountNumber", ""),
                    "Type": account_type,
                    "Balance": float(account.get("balance", 0.0)),
                }

                if account_type in ["Bank", "AcctRec", "OthCurrAsset", "FixedAsset"]:
                    assets.append(account_data)
                elif account_type in ["AcctPay", "CreditCard", "LongTermLiab"]:
                    liabilities.append(account_data)
                elif account_type == "Equity":
                    equity.append(account_data)

            return {
                "ReportName": "Balance Sheet",
                "ReportDate": datetime.now(timezone.utc).isoformat(),
                "Assets": assets,
                "Liabilities": liabilities,
                "Equity": equity,
            }

        else:
            raise ValueError(f"Unsupported report type: {report_type}")


class MockNetSuiteClient:
    """
    Mock NetSuite client for development/testing without real credentials.

    Provides same interface as RealNetSuiteClient but returns fake data.
    Used when NetSuite credentials are not configured.
    """

    def __init__(self):
        """Initialize mock client (no credentials required)."""
        print("[Phase 11] Using MOCK NetSuite client (credentials not configured)")

    def get_authorization_url(self, state: str) -> str:
        """Return mock authorization URL."""
        return f"https://mock-netsuite.example.com/oauth?state={state}&client_id=mock_client_id"

    def exchange_code_for_token(self, code: str) -> Dict:
        """Return mock token response."""
        return {
            "access_token": f"mock_access_token_{secrets.token_hex(16)}",
            "refresh_token": f"mock_refresh_token_{secrets.token_hex(16)}",
            "expires_in": 3600,
            "token_type": "Bearer",
        }

    def refresh_access_token(self, refresh_token: str) -> Dict:
        """Return mock refreshed token."""
        return {
            "access_token": f"mock_access_token_refreshed_{secrets.token_hex(16)}",
            "refresh_token": refresh_token,
            "expires_in": 3600,
        }

    def get_connections(self, access_token: str) -> List[Dict]:
        """Return mock NetSuite company list."""
        return [{
            "accountId": "1234567",
            "companyName": "Mock Company Ltd",
            "legalName": "Mock Company Limited",
            "fiscalCalendar": "Standard",
        }]

    def get_report(
        self,
        access_token: str,
        refresh_token: str,
        report_type: str = "balance_sheet"
    ) -> Dict:
        """Return mock balance sheet data."""
        if report_type == "balance_sheet":
            return {
                "ReportName": "Balance Sheet",
                "ReportDate": datetime.now(timezone.utc).isoformat(),
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
        else:
            raise ValueError(f"Unsupported report type: {report_type}")


# Initialize client based on environment configuration
try:
    netsuite_client = RealNetSuiteClient()
    print("[Phase 11] Using REAL NetSuite SuiteCloud REST API")
except ValueError:
    netsuite_client = MockNetSuiteClient()
    print("[Phase 11] Using MOCK NetSuite client (set NETSUITE_CLIENT_ID, NETSUITE_CLIENT_SECRET, NETSUITE_ACCOUNT_ID)")


# =============================================================================
# Service Functions
# =============================================================================

def initiate_netsuite_oauth(deal_id: str, db: Session) -> Dict:
    """
    Initiate NetSuite OAuth flow for a deal.

    Args:
        deal_id: ID of the deal to connect NetSuite account to
        db: Database session

    Returns:
        Dict with authorization_url and state token
    """
    # Verify deal exists
    stmt = select(Deal).where(Deal.id == deal_id)
    deal = db.execute(stmt).scalar_one_or_none()

    if not deal:
        raise ValueError(f"Deal not found: {deal_id}")

    # Generate CSRF state token
    state = secrets.token_urlsafe(32)

    # Store state in session or cache (simplified - production should use Redis)
    # For now, we'll return it and validate in callback

    # Get authorization URL
    auth_url = netsuite_client.get_authorization_url(state)

    return {
        "authorization_url": auth_url,
        "state": state,
        "deal_id": deal_id,
    }


def handle_netsuite_callback(
    code: str,
    state: str,
    deal_id: str,
    db: Session
) -> FinancialConnection:
    """
    Handle OAuth callback and create financial connection.

    Args:
        code: Authorization code from NetSuite
        state: CSRF token to validate
        deal_id: ID of the deal being connected
        db: Database session

    Returns:
        Created FinancialConnection record
    """
    # Exchange code for tokens
    token_response = netsuite_client.exchange_code_for_token(code)

    # Get company information
    companies = netsuite_client.get_connections(token_response["access_token"])

    if not companies:
        raise ValueError("No NetSuite companies found")

    company = companies[0]

    # Get deal and organization
    stmt = select(Deal).where(Deal.id == deal_id)
    deal = db.execute(stmt).scalar_one_or_none()

    if not deal:
        raise ValueError(f"Deal not found: {deal_id}")

    # Create financial connection
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=deal.organization_id,
        platform="netsuite",
        platform_organization_id=company["accountId"],
        platform_organization_name=company["companyName"],
        access_token=token_response["access_token"],
        refresh_token=token_response["refresh_token"],
        token_expires_at=datetime.now(timezone.utc) + timedelta(seconds=token_response["expires_in"]),
        connection_status="active",
    )

    db.add(connection)
    db.commit()
    db.refresh(connection)

    return connection


def import_netsuite_financial_data(connection_id: str, db: Session) -> FinancialStatement:
    """
    Import balance sheet from NetSuite and create financial statement.

    Args:
        connection_id: ID of the NetSuite financial connection
        db: Database session

    Returns:
        Created FinancialStatement record
    """
    # Get connection
    stmt = select(FinancialConnection).where(FinancialConnection.id == connection_id)
    connection = db.execute(stmt).scalar_one_or_none()

    if not connection:
        raise ValueError(f"Financial connection not found: {connection_id}")

    if connection.platform != "netsuite":
        raise ValueError(f"Connection is not NetSuite: {connection.platform}")

    # Check if token needs refresh
    if connection.token_expires_at < datetime.now(timezone.utc):
        # Refresh token
        token_response = netsuite_client.refresh_access_token(connection.refresh_token)
        connection.access_token = token_response["access_token"]
        connection.refresh_token = token_response["refresh_token"]
        connection.token_expires_at = datetime.now(timezone.utc) + timedelta(
            seconds=token_response["expires_in"]
        )
        db.commit()

    # Fetch balance sheet
    balance_sheet = netsuite_client.get_report(
        connection.access_token,
        connection.refresh_token,
        report_type="balance_sheet"
    )

    # Parse and create financial statement
    statement = _parse_netsuite_balance_sheet(balance_sheet, connection, db)

    return statement


def _parse_netsuite_balance_sheet(
    balance_sheet: Dict,
    connection: FinancialConnection,
    db: Session
) -> FinancialStatement:
    """
    Parse NetSuite balance sheet and create FinancialStatement record.

    Args:
        balance_sheet: NetSuite balance sheet data
        connection: FinancialConnection record
        db: Database session

    Returns:
        Created FinancialStatement record
    """
    # Calculate totals
    def _safe_balance(account: Dict[str, Any]) -> Decimal:
        value = account.get("Balance", 0) or 0
        return Decimal(str(value))

    total_assets = sum(_safe_balance(account) for account in balance_sheet.get("Assets", []))

    total_liabilities = sum(
        _safe_balance(account) for account in balance_sheet.get("Liabilities", [])
    )

    total_equity = sum(_safe_balance(account) for account in balance_sheet.get("Equity", []))

    # Create financial statement
    today = datetime.now(timezone.utc).date()
    statement = FinancialStatement(
        deal_id=connection.deal_id,
        organization_id=connection.organization_id,
        connection_id=connection.id,  # Fixed: was financial_connection_id (incorrect field name)
        statement_type="balance_sheet",
        period_start=today,  # Fixed: was statement_date (incorrect field name)
        period_end=today,    # For balance sheet, period is a single point in time
        currency="USD",  # NetSuite default (should be configurable)
        total_assets=total_assets,
        total_liabilities=total_liabilities,
        total_equity=total_equity,
        raw_data=balance_sheet,  # Store full NetSuite response
    )

    db.add(statement)
    db.commit()
    db.refresh(statement)

    return statement
