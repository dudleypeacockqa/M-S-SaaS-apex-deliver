"""
Xero OAuth Integration Service - DEV-010
Handles OAuth 2.0 flow, token management, and data import from Xero accounting platform
"""

import os
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.models.financial_connection import FinancialConnection
from app.models.financial_statement import FinancialStatement
from app.models.deal import Deal


# Mock Xero client for now (will be replaced with actual SDK)
class XeroClient:
    """Mock Xero client for testing."""

    def exchange_code_for_token(self, code: str) -> Dict:
        """Exchange authorization code for access/refresh tokens."""
        return {
            "access_token": f"xero_access_{secrets.token_hex(16)}",
            "refresh_token": f"xero_refresh_{secrets.token_hex(16)}",
            "expires_in": 1800,
            "token_type": "Bearer",
        }

    def get_connections(self, access_token: str) -> List[Dict]:
        """Get list of Xero organizations (tenants)."""
        return [
            {
                "tenantId": f"tenant-{secrets.token_hex(8)}",
                "tenantName": "Default Organization"
            }
        ]

    def refresh_access_token(self, refresh_token: str) -> Dict:
        """Refresh access token using refresh token."""
        return {
            "access_token": f"xero_new_access_{secrets.token_hex(16)}",
            "refresh_token": f"xero_new_refresh_{secrets.token_hex(16)}",
            "expires_in": 1800,
        }

    def get_report(self, platform_organization_id: str, access_token: str, report_type: str) -> Dict:
        """Fetch financial report from Xero."""
        return {"Reports": [{"Rows": []}]}


# Global client instance
xero_client = XeroClient()


def initiate_xero_oauth(deal_id: str, db: Session) -> Dict[str, str]:
    """
    Initiate Xero OAuth 2.0 flow.

    Args:
        deal_id: ID of the deal to connect Xero to
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

    # Build Xero authorization URL
    client_id = os.getenv("XERO_CLIENT_ID", "xero_client_id_placeholder")
    redirect_uri = os.getenv("XERO_REDIRECT_URI", "http://localhost:3000/api/financial/connect/xero/callback")
    scope = "offline_access accounting.transactions.read accounting.reports.read accounting.settings.read"

    authorization_url = (
        f"https://login.xero.com/identity/connect/authorize?"
        f"response_type=code&"
        f"client_id={client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"scope={scope}&"
        f"state={state}"
    )

    return {
        "authorization_url": authorization_url,
        "state": state,
    }


def handle_xero_callback(
    deal_id: str,
    code: str,
    state: str,
    db: Session
) -> FinancialConnection:
    """
    Handle Xero OAuth callback and store connection.

    Args:
        deal_id: ID of the deal
        code: Authorization code from Xero
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
    tokens = xero_client.exchange_code_for_token(code)

    # Get Xero connections (tenant selection)
    connections = xero_client.get_connections(tokens["access_token"])

    if not connections:
        raise Exception("No Xero organizations found for this account")

    # Use first tenant by default
    tenant = connections[0]

    # Calculate token expiration
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=tokens["expires_in"])

    # Create or update connection
    existing = db.execute(
        select(FinancialConnection).where(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "xero"
        )
    ).scalar_one_or_none()

    if existing:
        # Update existing connection
        existing.access_token = tokens["access_token"]
        existing.refresh_token = tokens["refresh_token"]
        existing.token_expires_at = expires_at
        existing.platform_organization_id = tenant["tenantId"]
        existing.platform_organization_name = tenant["tenantName"]
        existing.connection_status = "active"
        existing.last_sync_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    # Create new connection
    connection = FinancialConnection(
        deal_id=deal_id,
        organization_id=deal.organization_id,
        platform="xero",
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_expires_at=expires_at,
        platform_organization_id=tenant["tenantId"],
        platform_organization_name=tenant["tenantName"],
        connection_status="active",
        last_sync_at=datetime.now(timezone.utc),
    )

    db.add(connection)
    db.commit()
    db.refresh(connection)

    return connection


def refresh_xero_token(connection_id: str, db: Session) -> FinancialConnection:
    """
    Refresh expired Xero access token.

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
        # Call Xero refresh endpoint
        new_tokens = xero_client.refresh_access_token(connection.refresh_token)

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


def fetch_xero_statements(connection_id: str, db: Session) -> List[FinancialStatement]:
    """
    Fetch financial statements from Xero and store in database.

    Args:
        connection_id: ID of the Xero connection
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

    # Check if token is expired
    if connection.token_expires_at < datetime.now(timezone.utc):
        # Auto-refresh token
        connection = refresh_xero_token(connection_id, db)

    statements = []

    # Fetch Balance Sheet
    try:
        balance_sheet_data = xero_client.get_report(
            platform_organization_id=connection.platform_organization_id,
            access_token=connection.access_token,
            report_type="BalanceSheet"
        )

        # Parse balance sheet and create statement
        statement = _parse_xero_balance_sheet(balance_sheet_data, connection, db)
        if statement:
            statements.append(statement)

    except Exception as e:
        print(f"Error fetching Xero balance sheet: {e}")

    # Update last sync time
    connection.last_sync_at = datetime.now(timezone.utc)
    db.commit()

    return statements


def _parse_xero_balance_sheet(data: Dict, connection: FinancialConnection, db: Session) -> Optional[FinancialStatement]:
    """
    Parse Xero balance sheet report into FinancialStatement.

    Args:
        data: Xero report data
        connection: FinancialConnection object
        db: Database session

    Returns:
        Created FinancialStatement or None if parsing fails
    """
    try:
        report = data["Reports"][0]

        # Initialize default values
        financial_data = {
            "total_assets": Decimal("0"),
            "total_liabilities": Decimal("0"),
            "total_equity": Decimal("0"),
            "current_assets": Decimal("0"),
            "current_liabilities": Decimal("0"),
        }

        # Parse rows to extract values
        for row in report.get("Rows", []):
            if row.get("RowType") == "Section":
                title = row.get("Title", "")

                for sub_row in row.get("Rows", []):
                    cells = sub_row.get("Cells", [])
                    if len(cells) >= 2:
                        label = cells[0].get("Value", "")
                        value_str = cells[1].get("Value", "0")

                        # Convert to Decimal
                        try:
                            value = Decimal(value_str.replace(",", ""))
                        except:
                            value = Decimal("0")

                        # Map to fields
                        if "Total Assets" in label:
                            financial_data["total_assets"] = value
                        elif "Current Assets" in label:
                            financial_data["current_assets"] = value
                        elif "Total Liabilities" in label:
                            financial_data["total_liabilities"] = value
                        elif "Current Liabilities" in label:
                            financial_data["current_liabilities"] = value
                        elif "Total Equity" in label:
                            financial_data["total_equity"] = value

        # Create statement
        statement = FinancialStatement(
            connection_id=connection.id,
            deal_id=connection.deal_id,
            organization_id=connection.organization_id,
            statement_type="balance_sheet",
            period_start=datetime(2024, 1, 1).date(),
            period_end=datetime(2024, 12, 31).date(),
            period_type="annual",
            currency="GBP",
            **financial_data
        )

        db.add(statement)
        db.commit()
        db.refresh(statement)

        return statement

    except Exception as e:
        print(f"Error parsing Xero balance sheet: {e}")
        return None


def disconnect_xero(deal_id: str, db: Session) -> None:
    """
    Disconnect and delete Xero connection for a deal.

    Args:
        deal_id: ID of the deal
        db: Database session
    """
    result = db.execute(
        select(FinancialConnection).where(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "xero"
        )
    )
    connection = result.scalar_one_or_none()

    if connection:
        db.delete(connection)
        db.commit()


def get_xero_connection_status(deal_id: str, db: Session) -> Dict:
    """
    Get Xero connection status for a deal.

    Args:
        deal_id: ID of the deal
        db: Database session

    Returns:
        Dict with connection status information
    """
    result = db.execute(
        select(FinancialConnection).where(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "xero"
        )
    )
    connection = result.scalar_one_or_none()

    if not connection:
        return {
            "connected": False,
            "platform": None,
        }

    return {
        "connected": True,
        "platform": "xero",
        "platform_organization_name": connection.platform_organization_name,
        "status": connection.connection_status,
        "last_sync": connection.last_sync_at.isoformat() if connection.last_sync_at else None,
    }
