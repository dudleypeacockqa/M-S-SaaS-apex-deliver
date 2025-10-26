"""
Financial Intelligence API Routes - DEV-010
Endpoints for financial analysis, ratio calculations, and AI narratives
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime

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
from app.api.dependencies.auth import get_current_user

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

    # TODO: Query FinancialRatio model for latest ratios
    # For now, return stub indicating no ratios calculated yet
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No financial ratios have been calculated for this deal yet. Use POST /deals/{deal_id}/financial/calculate-ratios to calculate them."
    )


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

    # TODO: Query FinancialConnection model
    # For now, return empty list (no connections yet)
    return []


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

    # TODO: Query FinancialNarrative model for latest narrative
    # For now, return 404
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No financial narrative has been generated for this deal yet"
    )
