"""API routes for DEV-018 Intelligent Deal Matching."""
from __future__ import annotations

from decimal import Decimal
from typing import Dict, Iterable, List, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user, require_feature
from app.db.session import get_db
from app.models.deal import Deal
from app.models.deal_match import DealMatch, DealMatchAction, DealMatchCriteria
from app.models.user import User
from app.schemas.deal_match import (
    DealMatchResponse,
    FindMatchesRequest,
    FindMatchesResponse,
    MatchActionCreate,
    MatchActionResponse,
    MatchCriteriaCreate,
    MatchCriteriaResponse,
)
from app.services.deal_matching_service import DealMatchingService


router = APIRouter(tags=["deal-matching"])


def _decimal(value: Optional[float], default: float) -> Decimal:
    if value is None:
        value = default
    return Decimal(str(value))


@router.post("/match-criteria", response_model=MatchCriteriaResponse, status_code=status.HTTP_201_CREATED)
async def create_match_criteria(
    payload: MatchCriteriaCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a saved matching criteria profile for the current organization."""
    criteria = DealMatchCriteria(
        id=str(uuid4()),
        user_id=current_user.id,
        organization_id=current_user.organization_id,
        name=payload.name,
        deal_type=payload.deal_type,
        industries=payload.industries,
        min_deal_size=_decimal(payload.min_deal_size, 0),
        max_deal_size=_decimal(payload.max_deal_size, payload.min_deal_size or 0),
        geographies=payload.geographies,
        structures=payload.structures,
        negative_filters=payload.negative_filters or {},
        weights=payload.weights or {},
    )

    db.add(criteria)
    db.commit()
    db.refresh(criteria)
    return _serialize_criteria(criteria)


@router.get("/match-criteria", response_model=List[MatchCriteriaResponse])
async def list_match_criteria(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all saved criteria for the caller's organization."""
    criteria = (
        db.query(DealMatchCriteria)
        .filter(DealMatchCriteria.organization_id == current_user.organization_id)
        .order_by(DealMatchCriteria.created_at.desc())
        .all()
    )
    return [_serialize_criteria(item) for item in criteria]


def _build_ad_hoc_criteria(current_user: User, data: Dict) -> DealMatchCriteria:
    return DealMatchCriteria(
        id=str(uuid4()),
        user_id=current_user.id,
        organization_id=current_user.organization_id,
        name=data.get("name", "Ad-hoc Search"),
        deal_type=data.get("deal_type", "buy_side"),
        industries=data.get("industries", []),
        min_deal_size=_decimal(data.get("min_deal_size"), 0),
        max_deal_size=_decimal(data.get("max_deal_size"), data.get("min_deal_size", 0) or 0),
        geographies=data.get("geographies"),
        structures=data.get("structures"),
        negative_filters=data.get("negative_filters", {}),
        weights=data.get("weights", {}),
    )


@router.post("/deals/{deal_id}/find-matches", response_model=FindMatchesResponse)
async def find_matches_for_deal(
    deal_id: str,
    request: FindMatchesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Calculate intelligent matches for a given deal."""
    deal = (
        db.query(Deal)
        .filter(Deal.id == deal_id, Deal.organization_id == current_user.organization_id)
        .first()
    )
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    criteria_model = _build_ad_hoc_criteria(current_user, request.criteria)

    candidate_query = (
        db.query(Deal)
        .filter(
            Deal.organization_id == current_user.organization_id,
            Deal.id != deal_id,
            Deal.is_archived.is_(False),
        )
    )
    limit = request.limit or 10
    candidates = candidate_query.limit(limit * 2).all()
    candidate_map = {str(c.id): c for c in candidates}

    matching_service = DealMatchingService()
    matches = await matching_service.find_matches(
        criteria=criteria_model,
        target_deal=deal,
        candidate_deals=candidates,
        top_n=limit,
        min_score=request.min_score or 0.0,
    )

    response_matches = []
    for match in matches:
        candidate = candidate_map.get(match.deal_id)
        response_matches.append(
            {
                "deal_id": match.deal_id,
                "deal_name": candidate.name if candidate else match.deal_id,
                "score": match.score,
                "confidence": match.confidence,
                "explanation": match.explanation,
            }
        )

    for match in matches[: min(len(matches), 10)]:
        db_match = DealMatch(
            id=str(uuid4()),
            deal_id=deal_id,
            matched_deal_id=match.deal_id,
            organization_id=current_user.organization_id,
            match_score=match.score,
            confidence=match.confidence,
            explanation=match.explanation,
            status="pending",
        )
        db.add(db_match)

    db.commit()

    return {"matches": response_matches, "total_count": len(response_matches)}


@router.get("/deals/{deal_id}/matches", response_model=List[DealMatchResponse])
async def list_deal_matches(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return stored matches for a deal owned by the current organization."""
    deal = (
        db.query(Deal)
        .filter(Deal.id == deal_id, Deal.organization_id == current_user.organization_id)
        .first()
    )
    if deal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    matches = (
        db.query(DealMatch)
        .filter(DealMatch.deal_id == deal_id)
        .order_by(DealMatch.match_score.desc())
        .all()
    )
    return matches


def _serialize_criteria(model: DealMatchCriteria) -> MatchCriteriaResponse:
    return MatchCriteriaResponse(
        id=model.id,
        user_id=model.user_id,
        organization_id=model.organization_id,
        name=model.name,
        deal_type=model.deal_type,
        industries=model.industries or [],
        min_deal_size=f"{Decimal(model.min_deal_size):.2f}",
        max_deal_size=f"{Decimal(model.max_deal_size):.2f}",
        geographies=model.geographies or [],
        structures=model.structures or [],
        negative_filters=model.negative_filters or {},
        weights=model.weights or {},
        created_at=model.created_at,
    )


@router.post("/matches/{match_id}/actions", response_model=MatchActionResponse, status_code=status.HTTP_201_CREATED)
async def record_match_action(
    match_id: str,
    payload: MatchActionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Record a user action on a deal match (view, save, pass, request_intro)."""
    # Verify match exists and belongs to user's organization
    match = (
        db.query(DealMatch)
        .filter(DealMatch.id == match_id, DealMatch.organization_id == current_user.organization_id)
        .first()
    )
    if match is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")

    # Create action record
    action = DealMatchAction(
        id=str(uuid4()),
        match_id=match_id,
        user_id=current_user.id,
        action=payload.action,
        metadata=payload.metadata or {},
    )
    db.add(action)

    # Update match status based on action
    if payload.action == "pass":
        match.status = "declined"
        db.add(match)
    elif payload.action == "request_intro":
        match.status = "introduced"
        db.add(match)

    db.commit()
    db.refresh(action)

    return MatchActionResponse(
        id=action.id,
        match_id=action.match_id,
        user_id=action.user_id,
        action=action.action,
        metadata=action.metadata or {},
        created_at=action.created_at,
    )
