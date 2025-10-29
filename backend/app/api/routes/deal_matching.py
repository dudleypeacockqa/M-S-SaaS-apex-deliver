"""
API Routes for DEV-018 Intelligent Deal Matching
Endpoints for creating match criteria and finding deal matches
"""

from typing import List, Optional
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.core.subscription import require_tier
from app.models.user import User
from app.models.deal import Deal
from app.models.deal_match import DealMatchCriteria, DealMatch
from app.services.deal_matching_service import DealMatchingService, MatchResult
from app.schemas.deal_match import (
    MatchCriteriaCreate,
    MatchCriteriaResponse,
    FindMatchesRequest,
    FindMatchesResponse,
    DealMatchResponse
)

router = APIRouter(tags=["deal-matching"])


@router.post("/match-criteria", response_model=MatchCriteriaResponse, status_code=status.HTTP_201_CREATED)
@require_tier(["professional", "premium", "growth", "enterprise"])
async def create_match_criteria(
    criteria: MatchCriteriaCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create new matching criteria for deal discovery.

    Requires Professional tier or above.
    """
    import uuid
    from sqlalchemy import select

    # Create criteria
    db_criteria = DealMatchCriteria(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        organization_id=current_user.organization_id,
        name=criteria.name,
        deal_type=criteria.deal_type,
        industries=criteria.industries,
        min_deal_size=Decimal(str(criteria.min_deal_size)),
        max_deal_size=Decimal(str(criteria.max_deal_size)),
        geographies=criteria.geographies,
        structures=criteria.structures,
        negative_filters=criteria.negative_filters or {},
        weights=criteria.weights or {"industry": 0.4, "size": 0.3, "geography": 0.2, "other": 0.1}
    )

    db.add(db_criteria)
    await db.commit()
    await db.refresh(db_criteria)

    return db_criteria


@router.get("/match-criteria", response_model=List[MatchCriteriaResponse])
async def list_match_criteria(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all match criteria for current organization."""
    from sqlalchemy import select

    query = select(DealMatchCriteria).where(
        DealMatchCriteria.organization_id == current_user.organization_id
    ).order_by(DealMatchCriteria.created_at.desc())

    result = await db.execute(query)
    criteria_list = result.scalars().all()

    return criteria_list


@router.post("/deals/{deal_id}/find-matches", response_model=FindMatchesResponse)
@require_tier(["professional", "premium", "growth", "enterprise"])
async def find_matches_for_deal(
    deal_id: str,
    request: FindMatchesRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Find matching deals based on criteria.

    Runs the matching algorithm and returns ranked results.
    Requires Professional tier or above.
    """
    from sqlalchemy import select, and_

    # Verify deal exists and user has access
    deal_query = select(Deal).where(
        and_(
            Deal.id == deal_id,
            Deal.organization_id == current_user.organization_id
        )
    )
    result = await db.execute(deal_query)
    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )

    # Convert request criteria to DealMatchCriteria object for matching
    import uuid
    criteria = DealMatchCriteria(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        organization_id=current_user.organization_id,
        name="Ad-hoc Search",
        deal_type=request.criteria.get("deal_type", "buy_side"),
        industries=request.criteria.get("industries", []),
        min_deal_size=Decimal(str(request.criteria.get("min_deal_size", 0))),
        max_deal_size=Decimal(str(request.criteria.get("max_deal_size", 999999999))),
        geographies=request.criteria.get("geographies"),
        structures=request.criteria.get("structures"),
        negative_filters=request.criteria.get("negative_filters", {}),
        weights=request.criteria.get("weights", {"industry": 0.4, "size": 0.3, "geography": 0.2, "other": 0.1})
    )

    # Get candidate deals (exclude deals from same org for now)
    candidate_query = select(Deal).where(
        and_(
            Deal.organization_id != current_user.organization_id,
            Deal.id != deal_id
        )
    ).limit(request.limit or 10)

    result = await db.execute(candidate_query)
    candidates = result.scalars().all()

    # Run matching algorithm
    matching_service = DealMatchingService()
    matches: List[MatchResult] = matching_service.find_matches(criteria, candidates)

    # Filter by minimum score
    min_score = request.min_score if request.min_score is not None else 40.0
    filtered_matches = [m for m in matches if m.score >= min_score]

    # Store matches in database for future reference
    for match in filtered_matches[:10]:  # Store top 10
        import uuid as uuid_lib
        db_match = DealMatch(
            id=str(uuid_lib.uuid4()),
            deal_id=deal_id,
            matched_deal_id=match.deal.id,
            match_score=match.score,
            confidence=match.confidence,
            explanation=match.explanation,
            status="pending"
        )
        db.add(db_match)

    await db.commit()

    return {
        "matches": [
            {
                "deal_id": m.deal.id,
                "deal_name": m.deal.name,
                "score": m.score,
                "confidence": m.confidence,
                "explanation": m.explanation
            }
            for m in filtered_matches
        ],
        "total_count": len(filtered_matches)
    }


@router.get("/deals/{deal_id}/matches", response_model=List[DealMatchResponse])
async def list_deal_matches(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List existing matches for a deal."""
    from sqlalchemy import select, and_

    # Verify deal access
    deal_query = select(Deal).where(
        and_(
            Deal.id == deal_id,
            Deal.organization_id == current_user.organization_id
        )
    )
    result = await db.execute(deal_query)
    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )

    # Get matches
    match_query = select(DealMatch).where(
        DealMatch.deal_id == deal_id
    ).order_by(DealMatch.match_score.desc())

    result = await db.execute(match_query)
    matches = result.scalars().all()

    return matches
