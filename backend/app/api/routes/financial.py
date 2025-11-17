"""
Financial Intelligence API Routes - DEV-010
Endpoints for financial analysis, ratio calculations, and AI narratives
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime, date

from app.db.session import get_db
from app.models.user import User
from app.models.deal import Deal
from app.schemas.financial import (
    FinancialRatiosResponse,
    FinancialDataInput,
    FinancialConnectionResponse,
    FinancialNarrativeResponse,
)
from app.services.financial_ratios import calculate_all_ratios
from app.services.xero_oauth_service import (
    initiate_xero_oauth,
    handle_xero_callback,
    fetch_xero_statements,
)
from app.services.quickbooks_oauth_service import (
    initiate_quickbooks_oauth,
    handle_quickbooks_callback,
    fetch_quickbooks_statements,
    disconnect_quickbooks,
    get_quickbooks_connection_status,
)
from app.services.netsuite_oauth_service import (
    initiate_netsuite_oauth,
    handle_netsuite_callback,
    import_netsuite_financial_data,
)
from app.services.sage_oauth_service import (
    initiate_sage_oauth,
    handle_sage_callback,
    fetch_sage_statements,
)
from app.api.dependencies.auth import get_current_user
from app.models.financial_connection import FinancialConnection
from app.models.financial_narrative import FinancialNarrative
from app.models.financial_ratio import FinancialRatio
from sqlalchemy import select, desc

router = APIRouter()


@router.post(
    "/deals/{deal_id}/financial/calculate-ratios",
    response_model=FinancialRatiosResponse,
    summary="Calculate financial ratios from provided data",
    description="""
    Calculate all 19+ financial ratios from the provided financial data.

    This endpoint accepts Balance Sheet, Income Statement, and Cash Flow data
    and returns calculated liquidity, profitability, and leverage ratios.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
    status_code=status.HTTP_200_OK,
)
def calculate_financial_ratios(
    deal_id: str,
    financial_data: FinancialDataInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Calculate financial ratios from provided data.

    This is the primary endpoint for financial analysis. It accepts raw financial
    statement data and returns comprehensive ratio calculations.

    Args:
        deal_id: ID of the deal to associate ratios with
        financial_data: Financial statement data (Balance Sheet, P&L, Cash Flow)
        db: Database session
        current_user: Authenticated user

    Returns:
        FinancialRatiosResponse with calculated ratios

    Raises:
        HTTPException 404: Deal not found
        HTTPException 403: User doesn't have access to deal's organization
    """
    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    # Check user has access to deal's organization (multi-tenant security)
    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    # Convert Pydantic model to dict for calculation service
    financial_dict = financial_data.model_dump(exclude_none=True)

    # Calculate all ratios using the pure calculation service
    calculated_ratios = calculate_all_ratios(financial_dict)

    # Assess data quality based on how many fields were provided
    total_fields = len(financial_data.model_dump(exclude_none=True))
    if total_fields >= 15:
        data_quality = "complete"
    elif total_fields >= 8:
        data_quality = "partial"
    else:
        data_quality = "minimal"

    # Build response
    response = FinancialRatiosResponse(
        deal_id=deal_id,
        organization_id=deal.organization_id,
        calculated_at=datetime.utcnow(),
        data_quality=data_quality,
        **calculated_ratios  # Unpack all calculated ratios into response
    )

    return response


@router.get(
    "/deals/{deal_id}/financial/ratios",
    response_model=FinancialRatiosResponse,
    summary="Get latest calculated ratios for a deal",
    description="""
    Retrieve the most recently calculated financial ratios for a deal.

    Returns ratios from the latest financial statement sync or manual calculation.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
    status_code=status.HTTP_200_OK,
)
def get_financial_ratios(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get latest financial ratios for a deal.

    Currently returns a stub response. In future iterations, this will:
    1. Query the FinancialRatio model for latest ratios
    2. Return calculated values from the database
    3. Include historical trend data

    Args:
        deal_id: ID of the deal
        db: Database session
        current_user: Authenticated user

    Returns:
        FinancialRatiosResponse with latest ratios

    Raises:
        HTTPException 404: Deal not found or no ratios calculated
        HTTPException 403: User doesn't have access to deal's organization
    """
    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    # Multi-tenant security check
    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    # Query FinancialRatio model for latest ratios
    latest_ratio = db.query(FinancialRatio).filter(
        FinancialRatio.deal_id == deal_id,
        FinancialRatio.organization_id == current_user.organization_id,
        FinancialRatio.deleted_at.is_(None)
    ).order_by(desc(FinancialRatio.calculated_at)).first()

    if not latest_ratio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No financial ratios have been calculated for this deal yet. Use POST /deals/{deal_id}/financial/calculate-ratios to calculate them."
        )

    # Convert to response model (Pydantic will handle serialization)
    return latest_ratio


@router.get(
    "/deals/{deal_id}/financial/connections",
    response_model=list[FinancialConnectionResponse],
    summary="Get accounting platform connections for a deal",
    description="""
    List all accounting platform connections (Xero, QuickBooks) for a deal.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def get_financial_connections(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all financial platform connections for a deal.

    This endpoint returns connections to Xero, QuickBooks, and other accounting platforms.

    Args:
        deal_id: ID of the deal
        db: Database session
        current_user: Authenticated user

    Returns:
        List of FinancialConnectionResponse

    Raises:
        HTTPException 404: Deal not found
        HTTPException 403: User doesn't have access
    """
    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    connections = (
        db.query(FinancialConnection)
        .filter(FinancialConnection.deal_id == deal_id)
        .order_by(FinancialConnection.created_at.desc())
        .all()
    )

    return [FinancialConnectionResponse.model_validate(conn) for conn in connections]


@router.get(
    "/deals/{deal_id}/financial/narrative",
    response_model=FinancialNarrativeResponse,
    summary="Get latest AI-generated financial narrative",
    description="""
    Retrieve the most recent AI-generated financial analysis narrative for a deal.

    The narrative includes:
    - Executive summary (2-3 paragraphs)
    - Key strengths (top 3)
    - Key weaknesses (top 3)
    - Red flags (if any)
    - Growth signals
    - Deal Readiness Score (0-100)

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def get_financial_narrative(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get latest AI-generated financial narrative.

    Args:
        deal_id: ID of the deal
        db: Database session
        current_user: Authenticated user

    Returns:
        FinancialNarrativeResponse with AI analysis

    Raises:
        HTTPException 404: Deal not found or no narrative generated
        HTTPException 403: User doesn't have access
    """
    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    # Query FinancialNarrative model for latest narrative
    latest_narrative = db.query(FinancialNarrative).filter(
        FinancialNarrative.deal_id == deal_id,
        FinancialNarrative.organization_id == current_user.organization_id
    ).order_by(desc(FinancialNarrative.generated_at)).first()

    if not latest_narrative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No financial narrative has been generated for this deal yet"
        )

    # Convert to response model (Pydantic will handle serialization)
    return latest_narrative


# ============================================================================
# NEW ENDPOINTS - DEV-010 Phase 1.2
# OAuth, Sync, and Readiness Score
# ============================================================================

@router.post(
    "/deals/{deal_id}/financial/connect/xero",
    summary="Initiate Xero OAuth 2.0 flow",
    description="""
    Start the OAuth 2.0 authorization flow to connect a Xero accounting platform.

    Returns an authorization URL that the frontend should redirect the user to.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def connect_xero(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Initiate Xero OAuth flow.

    Args:
        deal_id: ID of the deal to connect
        db: Database session
        current_user: Authenticated user

    Returns:
        Dict with authorization_url and state token

    Raises:
        HTTPException 404: Deal not found
        HTTPException 403: User doesn't have access
    """
    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    # Initiate OAuth flow
    oauth_data = initiate_xero_oauth(deal_id, db)

    return oauth_data


@router.get(
    "/deals/{deal_id}/financial/connect/xero/callback",
    response_model=FinancialConnectionResponse,
    summary="Handle Xero OAuth callback",
    description="""
    Handle the OAuth 2.0 callback from Xero after user authorization.

    This endpoint is called automatically by Xero after the user authorizes access.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def xero_oauth_callback(
    deal_id: str,
    code: str,
    state: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Handle Xero OAuth callback.

    Args:
        deal_id: ID of the deal
        code: Authorization code from Xero
        state: State token for CSRF validation
        db: Database session
        current_user: Authenticated user

    Returns:
        FinancialConnectionResponse with created connection

    Raises:
        HTTPException 400: Missing code or state parameter
        HTTPException 404: Deal not found
        HTTPException 403: User doesn't have access
    """
    # Validate query parameters
    if not code or not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required query parameters: code and state"
        )

    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    # Handle OAuth callback and create connection
    connection = handle_xero_callback(deal_id, code, state, db)

    # Build response
    return FinancialConnectionResponse(
        id=connection.id,
        deal_id=connection.deal_id,
        organization_id=connection.organization_id,
        platform=connection.platform,
        connection_status=connection.connection_status,
        platform_organization_name=connection.platform_organization_name,
        last_sync_at=connection.last_sync_at,
        created_at=connection.created_at,
    )


@router.post(
    "/deals/{deal_id}/financial/sync",
    summary="Manually sync financial data from accounting platform",
    description="""
    Trigger a manual sync of financial data from the connected accounting platform (Xero).

    This fetches the latest financial statements and updates the database.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def sync_financial_data(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Manually sync financial data.

    Args:
        deal_id: ID of the deal
        db: Database session
        current_user: Authenticated user

    Returns:
        Dict with sync status and number of statements synced

    Raises:
        HTTPException 404: Deal not found or no connection exists
        HTTPException 403: User doesn't have access
    """
    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    # Check for existing connection
    result = db.execute(
        select(FinancialConnection).where(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "xero"
        )
    )
    connection = result.scalar_one_or_none()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Xero connection found for this deal. Please connect Xero first."
        )

    # Fetch statements from Xero
    statements = fetch_xero_statements(connection.id, db)

    return {
        "success": True,
        "statements_synced": len(statements),
        "platform": connection.platform,
        "last_sync_at": connection.last_sync_at.isoformat() if connection.last_sync_at else None
    }


@router.post(
    "/deals/{deal_id}/financial/connect/quickbooks",
    summary="Initiate QuickBooks OAuth 2.0 flow",
    description="""
    Start the OAuth 2.0 authorization flow to connect a QuickBooks Online account.

    Returns an authorization URL that the frontend should redirect the user to.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def connect_quickbooks(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Initiate QuickBooks OAuth flow."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    return initiate_quickbooks_oauth(deal_id, db)


@router.get(
    "/deals/{deal_id}/financial/connect/quickbooks/callback",
    response_model=FinancialConnectionResponse,
    summary="Handle QuickBooks OAuth callback",
    description="""
    Handle the OAuth 2.0 callback from QuickBooks Online after user authorization.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def quickbooks_oauth_callback(
    deal_id: str,
    code: str,
    state: str,
    realm_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Handle QuickBooks OAuth callback."""

    if not code or not state or not realm_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required query parameters: code, state, realm_id",
        )

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    connection = handle_quickbooks_callback(
        deal_id,
        code,
        state,
        realm_id,
        db,
    )

    return FinancialConnectionResponse.model_validate(connection)


@router.get(
    "/deals/{deal_id}/financial/connect/quickbooks/status",
    summary="Get QuickBooks connection status",
    description="""
    Retrieve QuickBooks connection status for a deal.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def quickbooks_connection_status(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return QuickBooks connection status for the deal."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    return get_quickbooks_connection_status(deal_id, db)


@router.post(
    "/deals/{deal_id}/financial/sync/quickbooks",
    summary="Sync financial data from QuickBooks",
    description="""
    Trigger a manual sync of financial data from QuickBooks Online.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def sync_quickbooks_financial_data(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Manually sync financial data from QuickBooks."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    connection = (
        db.query(FinancialConnection)
        .filter(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "quickbooks",
        )
        .first()
    )

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No QuickBooks connection found for this deal. Please connect QuickBooks first.",
        )

    statements = fetch_quickbooks_statements(connection.id, db)

    return {
        "success": True,
        "statements_synced": len(statements),
        "platform": connection.platform,
        "last_sync_at": connection.last_sync_at.isoformat() if connection.last_sync_at else None,
    }


@router.delete(
    "/deals/{deal_id}/financial/connect/quickbooks",
    summary="Disconnect QuickBooks from a deal",
    description="""
    Disconnect the QuickBooks integration and remove stored tokens for this deal.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def disconnect_quickbooks_connection(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove QuickBooks connection for the specified deal."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    disconnect_quickbooks(deal_id, db)

    return {"success": True}


@router.post(
    "/deals/{deal_id}/financial/connect/netsuite",
    summary="Initiate NetSuite OAuth 2.0 flow",
    description="""
    Start the OAuth 2.0 authorization flow to connect a NetSuite account.

    Returns an authorization URL that the frontend should redirect the user to.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def connect_netsuite(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Initiate NetSuite OAuth flow for a deal."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    return initiate_netsuite_oauth(deal_id, db)


@router.get(
    "/deals/{deal_id}/financial/connect/netsuite/callback",
    response_model=FinancialConnectionResponse,
    summary="Handle NetSuite OAuth callback",
    description="""
    Handle the OAuth 2.0 callback from NetSuite after user authorization.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def netsuite_oauth_callback(
    deal_id: str,
    code: str,
    state: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Handle NetSuite OAuth callback."""

    if not code or not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required query parameters: code, state",
        )

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    connection = handle_netsuite_callback(
        code=code,
        state=state,
        deal_id=deal_id,
        db=db,
    )

    return FinancialConnectionResponse.model_validate(connection)


@router.post(
    "/deals/{deal_id}/financial/sync/netsuite",
    summary="Sync financial data from NetSuite",
    description="""
    Trigger a manual sync of financial data from NetSuite.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def sync_netsuite_financial_data(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Manually sync financial data from NetSuite for a connected deal."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    connection = (
        db.query(FinancialConnection)
        .filter(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "netsuite",
        )
        .first()
    )

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No NetSuite connection found for this deal. Please connect NetSuite first.",
        )

    statement = import_netsuite_financial_data(connection.id, db)

    def _iso(value):
        if isinstance(value, (datetime, date)):
            return value.isoformat()
        return None

    generated_at = (
        _iso(getattr(statement, 'imported_at', None))
        or _iso(getattr(statement, 'statement_date', None))
        or _iso(getattr(statement, 'generated_at', None))
    )

    return {
        "success": True,
        "platform": connection.platform,
        "statement_id": str(getattr(statement, 'id', '')),
        "generated_at": generated_at,
        "period_end": _iso(getattr(statement, 'period_end', None)),
        "currency": getattr(statement, "currency", None),
    }


@router.post(
    "/deals/{deal_id}/financial/connect/sage",
    summary="Initiate Sage OAuth 2.0 flow",
    description="""
    Start the OAuth 2.0 authorization flow to connect a Sage Accounting account.

    Returns an authorization URL that the frontend should redirect the user to.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def connect_sage(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Initiate Sage OAuth flow for a deal."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    return initiate_sage_oauth(deal_id, db)


@router.get(
    "/deals/{deal_id}/financial/connect/sage/callback",
    response_model=FinancialConnectionResponse,
    summary="Handle Sage OAuth callback",
    description="""
    Handle the OAuth 2.0 callback from Sage after user authorization.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def sage_oauth_callback(
    deal_id: str,
    code: str,
    state: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Handle Sage OAuth callback."""

    if not code or not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required query parameters: code, state",
        )

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    connection = handle_sage_callback(
        deal_id=deal_id,
        code=code,
        state=state,
        db=db,
    )

    return FinancialConnectionResponse.model_validate(connection)


@router.post(
    "/deals/{deal_id}/financial/sync/sage",
    summary="Sync financial data from Sage",
    description="""
    Trigger a manual sync of financial data from Sage Accounting.

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def sync_sage_financial_data(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Manually sync financial data from Sage for a connected deal."""

    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    connection = (
        db.query(FinancialConnection)
        .filter(
            FinancialConnection.deal_id == deal_id,
            FinancialConnection.platform == "sage",
        )
        .first()
    )

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Sage connection found for this deal. Please connect Sage first.",
        )

    statements = fetch_sage_statements(connection.id, db)

    return {
        "success": True,
        "platform": connection.platform,
        "statements_synced": len(statements),
        "statement_ids": [str(getattr(stmt, 'id', '')) for stmt in statements],
        "last_sync_at": connection.last_sync_at.isoformat() if connection.last_sync_at else None,
    }


@router.get(
    "/deals/{deal_id}/financial/readiness-score",
    summary="Get Deal Readiness Score",
    description="""
    Retrieve the Deal Readiness Score (0-100) for a deal.

    The score is calculated based on:
    - Data Quality (25 points): Completeness of financial data
    - Financial Health (40 points): Liquidity, profitability, leverage
    - Growth Trajectory (20 points): Revenue and profit growth
    - Risk Assessment (15 points): Red flags and warning signs

    **Authentication**: Required
    **Authorization**: User must have access to the deal's organization
    """,
)
def get_readiness_score(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get Deal Readiness Score.

    Args:
        deal_id: ID of the deal
        db: Database session
        current_user: Authenticated user

    Returns:
        Dict with overall score and component scores

    Raises:
        HTTPException 404: Deal not found or no narrative generated
        HTTPException 403: User doesn't have access
    """
    # Verify deal exists and user has access
    deal = db.query(Deal).filter(Deal.id == deal_id).first()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Deal with ID {deal_id} not found"
        )

    if deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this deal's organization"
        )

    # Get latest narrative with readiness score
    result = db.execute(
        select(FinancialNarrative)
        .where(FinancialNarrative.deal_id == deal_id)
        .order_by(desc(FinancialNarrative.created_at))
    )
    narrative = result.scalar_one_or_none()

    if not narrative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No financial narrative has been generated for this deal yet. Generate one first."
        )

    return {
        "score": float(narrative.readiness_score),
        "data_quality_score": float(narrative.data_quality_score) if narrative.data_quality_score else 0.0,
        "financial_health_score": float(narrative.financial_health_score) if narrative.financial_health_score else 0.0,
        "growth_trajectory_score": float(narrative.growth_trajectory_score) if narrative.growth_trajectory_score else 0.0,
        "risk_assessment_score": float(narrative.risk_assessment_score) if narrative.risk_assessment_score else 0.0,
        "calculated_at": narrative.created_at.isoformat() if narrative.created_at else None,
        "ai_model": narrative.ai_model,
        "version": narrative.version
    }
