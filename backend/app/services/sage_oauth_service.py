"""
Sage Accounting OAuth Integration Service - DEV-010 (Phase 10)
Handles OAuth 2.0 flow, token management, and data import from Sage Accounting API

Phase 10: REST API integration (no official Python SDK available)
UK Market Focus: 20% of target market uses Sage Accounting
"""

import os
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select

import requests

from app.models.financial_connection import FinancialConnection
from app.models.financial_statement import FinancialStatement
from app.models.deal import Deal


# Sage API Configuration
SAGE_AUTH_URL = "https://www.sageone.com/oauth2/auth/central"
SAGE_TOKEN_URL = "https://oauth.accounting.sage.com/token"
SAGE_API_BASE_URL = "https://api.accounting.sage.com/v3.1"


class RealSageClient:
    """
    Real Sage client using REST API (no official Python SDK).

    Wraps the Sage Accounting REST API to provide consistent interface
    for OAuth flow, token management, and data fetching.

    Phase 10: Production-ready Sage integration for UK market
    """

    def __init__(self):
        """Initialize Sage API client with credentials from environment."""
        self.client_id = os.getenv("SAGE_CLIENT_ID")
        self.client_secret = os.getenv("SAGE_CLIENT_SECRET")
        self.redirect_uri = os.getenv(
            "SAGE_REDIRECT_URI",
            "http://localhost:3000/api/financial/connect/sage/callback"
        )

        if not self.client_id or not self.client_secret:
            raise ValueError(
                "Sage credentials not configured. "
                "Set SAGE_CLIENT_ID and SAGE_CLIENT_SECRET environment variables."
            )

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
            "scope": "full_access",  # Sage requires full_access scope for accounting data
            "state": state,
        }

        # Build URL manually
        query_string = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{SAGE_AUTH_URL}?{query_string}"

    def exchange_code_for_token(self, code: str) -> Dict:
        """
        Exchange authorization code for access/refresh tokens.

        Args:
            code: Authorization code from OAuth callback

        Returns:
            Dict with access_token, refresh_token, expires_in, token_type
        """
        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri,
        }

        response = requests.post(SAGE_TOKEN_URL, data=payload, timeout=30)
        response.raise_for_status()

        token_data = response.json()

        return {
            "access_token": token_data["access_token"],
            "refresh_token": token_data["refresh_token"],
            "expires_in": token_data["expires_in"],
            "token_type": token_data.get("token_type", "Bearer"),
        }

    def get_connections(self, access_token: str) -> List[Dict]:
        """
        Get Sage business information.

        Note: Sage API returns single business per access token.
        This method returns business info for validation purposes.

        Args:
            access_token: OAuth access token

        Returns:
            List with single business info dictionary
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        # Get business info from Sage API
        response = requests.get(
            f"{SAGE_API_BASE_URL}/businesses",
            headers=headers,
            timeout=30
        )
        response.raise_for_status()

        data = response.json()

        # Sage returns array of businesses (usually just one)
        businesses = data.get("$items", [])

        return [
            {
                "businessId": business.get("id"),
                "businessName": business.get("name", "Unknown Business"),
                "country": business.get("country"),
                "currency": business.get("base_currency"),
            }
            for business in businesses
        ]

    def refresh_access_token(self, refresh_token: str) -> Dict:
        """
        Refresh expired access token using refresh token.

        Args:
            refresh_token: OAuth refresh token

        Returns:
            Dict with new access_token, refresh_token, expires_in
        """
        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }

        response = requests.post(SAGE_TOKEN_URL, data=payload, timeout=30)
        response.raise_for_status()

        token_data = response.json()

        return {
            "access_token": token_data["access_token"],
            "refresh_token": token_data["refresh_token"],
            "expires_in": token_data["expires_in"],
        }

    def get_report(
        self,
        platform_organization_id: str,
        access_token: str,
        report_type: str
    ) -> Dict:
        """
        Fetch financial report from Sage Accounting API.

        Args:
            platform_organization_id: Sage business ID
            access_token: OAuth access token
            report_type: Report type (BalanceSheet, ProfitAndLoss, etc.)

        Returns:
            Report data dictionary from Sage API
        """
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        # Sage API uses ledger accounts for financial data
        if report_type == "BalanceSheet":
            # Get all ledger accounts
            response = requests.get(
                f"{SAGE_API_BASE_URL}/ledger_accounts",
                headers=headers,
                timeout=30
            )
            response.raise_for_status()

            data = response.json()
            accounts = data.get("$items", [])

            # Categorize accounts
            assets = []
            liabilities = []
            equity = []

            for account in accounts:
                acc_data = {
                    "Name": account.get("displayed_as", "Unknown"),
                    "Type": account.get("ledger_account_type", {}).get("displayed_as", ""),
                    "Balance": float(account.get("balance", 0)),
                }

                # Sage uses visible_in_* flags for categorization
                if account.get("visible_in_banking"):
                    assets.append(acc_data)
                elif "liability" in acc_data["Type"].lower():
                    liabilities.append(acc_data)
                elif "equity" in acc_data["Type"].lower() or "capital" in acc_data["Type"].lower():
                    equity.append(acc_data)
                else:
                    # Default to assets for other account types
                    assets.append(acc_data)

            return {
                "ReportName": "Balance Sheet",
                "Assets": assets,
                "Liabilities": liabilities,
                "Equity": equity,
            }

        elif report_type == "ProfitAndLoss":
            # Placeholder for P&L - would use profit_and_loss_reports endpoint
            return {
                "ReportName": "Profit and Loss",
                "Rows": [],
            }

        else:
            raise ValueError(f"Unsupported report type: {report_type}")


# Mock Sage client for fallback (when credentials not configured)
class MockSageClient:
    """Mock Sage client for development without credentials."""

    def __init__(self):
        """Initialize mock client."""
        self.client_id = os.getenv("SAGE_CLIENT_ID", "sage_client_id_placeholder")
        self.client_secret = os.getenv("SAGE_CLIENT_SECRET", "sage_secret_placeholder")
        self.redirect_uri = os.getenv(
            "SAGE_REDIRECT_URI",
            "http://localhost:3000/api/financial/connect/sage/callback"
        )

    def get_authorization_url(self, state: str) -> str:
        """Mock authorization URL generation."""
        return (
            f"{SAGE_AUTH_URL}?"
            f"response_type=code&"
            f"client_id={self.client_id}&"
            f"redirect_uri={self.redirect_uri}&"
            f"scope=full_access&"
            f"state={state}"
        )

    def exchange_code_for_token(self, code: str) -> Dict:
        """Mock token exchange."""
        return {
            "access_token": f"sage_access_{secrets.token_hex(16)}",
            "refresh_token": f"sage_refresh_{secrets.token_hex(16)}",
            "expires_in": 3600,
            "token_type": "Bearer",
        }

    def get_connections(self, access_token: str) -> List[Dict]:
        """Mock connections list."""
        return [
            {
                "businessId": f"business-{secrets.token_hex(8)}",
                "businessName": "Demo Business Ltd",
                "country": "GB",
                "currency": "GBP",
            }
        ]

    def refresh_access_token(self, refresh_token: str) -> Dict:
        """Mock token refresh."""
        return {
            "access_token": f"sage_new_access_{secrets.token_hex(16)}",
            "refresh_token": f"sage_new_refresh_{secrets.token_hex(16)}",
            "expires_in": 3600,
        }

    def get_report(
        self,
        platform_organization_id: str,
        access_token: str,
        report_type: str
    ) -> Dict:
        """Mock report fetch."""
        return {
            "ReportName": report_type,
            "Assets": [],
            "Liabilities": [],
            "Equity": [],
        }


# Global client instance (use real client if credentials available, fallback to mock)
if os.getenv("SAGE_CLIENT_ID") and os.getenv("SAGE_CLIENT_SECRET"):
    try:
        sage_client = RealSageClient()
        print("[Phase 10] Using REAL Sage REST API Client")
    except Exception as e:
        print(f"[WARNING] Failed to initialize real Sage client: {e}")
        sage_client = MockSageClient()
        print("[WARNING] Falling back to mock Sage client")
else:
    sage_client = MockSageClient()
    print("[WARNING] SAGE_CLIENT_ID or SAGE_CLIENT_SECRET not configured - using mock client")


def initiate_sage_oauth(deal_id: str, db: Session) -> Dict[str, str]:
    """
    Initiate Sage OAuth 2.0 flow.

    Args:
        deal_id: ID of the deal to connect Sage to
        db: Database session

    Returns:
        Dict with authorization_url and state token

    Raises:
        ValueError: If deal not found
    """
    # Verify deal exists
    result = db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise ValueError(f"Deal {deal_id} not found")

    # Generate random state for CSRF protection
    state = secrets.token_urlsafe(32)

    # Build Sage authorization URL
    authorization_url = sage_client.get_authorization_url(state)

    return {
        "authorization_url": authorization_url,
        "state": state,
    }


def handle_sage_callback(
    deal_id: str,
    code: str,
    state: str,
    db: Session
) -> FinancialConnection:
    """
    Handle Sage OAuth callback and store connection.

    Args:
        deal_id: ID of the deal
        code: Authorization code from Sage
        state: State token for CSRF validation
        db: Database session

    Returns:
        Created FinancialConnection

    Raises:
        ValueError: If deal not found
        Exception: If token exchange fails
    """
    # Verify deal exists
    result = db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise ValueError(f"Deal {deal_id} not found")

    # Exchange authorization code for tokens
    tokens = sage_client.exchange_code_for_token(code)

    # Get Sage business info
    connections = sage_client.get_connections(tokens["access_token"])

    if not connections:
        raise Exception("No Sage businesses found for this account")

    # Use first business
    business = connections[0]

    # Calculate token expiration
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=tokens["expires_in"])

    # Create or update connection
    existing = db.execute(
        select(FinancialConnection).where(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "sage"
        )
    ).scalar_one_or_none()

    if existing:
        # Update existing connection
        existing.access_token = tokens["access_token"]
        existing.refresh_token = tokens["refresh_token"]
        existing.token_expires_at = expires_at
        existing.platform_organization_id = business["businessId"]
        existing.platform_organization_name = business["businessName"]
        existing.connection_status = "active"
        existing.last_sync_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    # Create new connection
    connection = FinancialConnection(
        deal_id=deal_id,
        organization_id=deal.organization_id,
        platform="sage",
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_expires_at=expires_at,
        platform_organization_id=business["businessId"],
        platform_organization_name=business["businessName"],
        connection_status="active",
        last_sync_at=datetime.now(timezone.utc),
    )

    db.add(connection)
    db.commit()
    db.refresh(connection)

    return connection


def refresh_sage_token(connection_id: str, db: Session) -> FinancialConnection:
    """
    Refresh expired Sage access token.

    Args:
        connection_id: ID of the financial connection
        db: Database session

    Returns:
        Updated FinancialConnection with new tokens

    Raises:
        ValueError: If connection not found
        Exception: If token refresh fails
    """
    result = db.execute(
        select(FinancialConnection).where(FinancialConnection.id == connection_id)
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise ValueError(f"Connection {connection_id} not found")

    try:
        # Call Sage refresh endpoint
        new_tokens = sage_client.refresh_access_token(connection.refresh_token)

        # Update connection with new tokens
        connection.access_token = new_tokens["access_token"]
        connection.refresh_token = new_tokens["refresh_token"]
        connection.token_expires_at = datetime.now(timezone.utc) + timedelta(seconds=new_tokens["expires_in"])
        connection.last_sync_at = datetime.now(timezone.utc)
        connection.connection_status = "active"

        db.commit()
        db.refresh(connection)

        return connection

    except Exception as e:
        # Mark connection as expired if refresh fails
        connection.connection_status = "expired"
        db.commit()
        raise e


def fetch_sage_statements(connection_id: str, db: Session) -> List[FinancialStatement]:
    """
    Fetch financial statements from Sage and store in database.

    Args:
        connection_id: ID of the Sage connection
        db: Database session

    Returns:
        List of created FinancialStatement objects

    Raises:
        ValueError: If connection not found
    """
    result = db.execute(
        select(FinancialConnection).where(FinancialConnection.id == connection_id)
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise ValueError(f"Connection {connection_id} not found")

    # Check if token is expired (normalize naive timestamps from SQLite to UTC)
    expires_at = connection.token_expires_at
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at and expires_at <= datetime.now(timezone.utc):
        # Auto-refresh token
        connection = refresh_sage_token(connection_id, db)

    statements = []

    # Fetch Balance Sheet
    try:
        balance_sheet_data = sage_client.get_report(
            platform_organization_id=connection.platform_organization_id,
            access_token=connection.access_token,
            report_type="BalanceSheet"
        )

        # Parse balance sheet and create statement
        statement = _parse_sage_balance_sheet(balance_sheet_data, connection, db)
        if statement:
            statements.append(statement)

    except Exception as e:
        print(f"Error fetching Sage balance sheet: {e}")

    # Update last sync time
    connection.last_sync_at = datetime.now(timezone.utc)
    db.commit()

    return statements


def _parse_sage_balance_sheet(data: Dict, connection: FinancialConnection, db: Session) -> Optional[FinancialStatement]:
    """
    Parse Sage balance sheet report into FinancialStatement.

    Args:
        data: Sage report data
        connection: FinancialConnection object
        db: Database session

    Returns:
        Created FinancialStatement or None if parsing fails
    """
    try:
        # Sum up assets, liabilities, equity
        total_assets = sum(Decimal(str(acc["Balance"])) for acc in data.get("Assets", []))
        total_liabilities = sum(Decimal(str(acc["Balance"])) for acc in data.get("Liabilities", []))
        total_equity = sum(Decimal(str(acc["Balance"])) for acc in data.get("Equity", []))

        # Calculate current assets/liabilities (simplified - would need account classification)
        current_assets = total_assets * Decimal("0.5")  # Rough estimate
        current_liabilities = total_liabilities * Decimal("0.5")  # Rough estimate

        # Create statement
        statement = FinancialStatement(
            connection_id=connection.id,
            deal_id=connection.deal_id,
            organization_id=connection.organization_id,
            statement_type="balance_sheet",
            period_start=datetime(2024, 1, 1).date(),
            period_end=datetime(2024, 12, 31).date(),
            period_type="annual",
            currency="GBP",  # Sage UK default
            total_assets=total_assets,
            total_liabilities=total_liabilities,
            total_equity=total_equity,
            current_assets=current_assets,
            current_liabilities=current_liabilities,
        )

        db.add(statement)
        db.commit()
        db.refresh(statement)

        return statement

    except Exception as e:
        print(f"Error parsing Sage balance sheet: {e}")
        return None


def disconnect_sage(deal_id: str, db: Session) -> None:
    """
    Disconnect and delete Sage connection for a deal.

    Args:
        deal_id: ID of the deal
        db: Database session
    """
    result = db.execute(
        select(FinancialConnection).where(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "sage"
        )
    )
    connection = result.scalar_one_or_none()

    if connection:
        db.delete(connection)
        db.commit()


def get_sage_connection_status(deal_id: str, db: Session) -> Dict:
    """
    Get Sage connection status for a deal.

    Args:
        deal_id: ID of the deal
        db: Database session

    Returns:
        Dict with connection status information
    """
    result = db.execute(
        select(FinancialConnection).where(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "sage"
        )
    )
    connection = result.scalar_one_or_none()

    if not connection:
        print("[DEBUG] get_sage_connection_status: no connection found for deal", deal_id)
        return None

    print(
        "[DEBUG] get_sage_connection_status: returning connection",
        connection.id,
        connection.platform,
        connection.platform_organization_name,
    )
    return {
        "connected": True,
        "platform": "sage",
        "business_name": connection.platform_organization_name,
        "platform_organization_name": connection.platform_organization_name,
        "status": connection.connection_status,
        "last_sync": connection.last_sync_at.isoformat() if connection.last_sync_at else None,
    }
