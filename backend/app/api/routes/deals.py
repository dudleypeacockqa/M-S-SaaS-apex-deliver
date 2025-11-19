"""Deal CRUD API endpoints."""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.api.dependencies.tenant_scope import require_scoped_organization_id
from app.db.session import get_db
from app.models.user import User
from app.models.deal import Deal
from app.schemas.deal import DealCreate, DealListResponse, DealResponse, DealUpdate, DealStageUpdate
from app.services import deal_service

router = APIRouter(prefix="/deals", tags=["deals"])


@router.post("", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
def create_deal(
    deal: DealCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new deal.

    The deal is automatically associated with the current user's organization
    and the user is set as the owner.
    """
    created_deal = deal_service.create_deal(deal, current_user, db)
    return created_deal


@router.get("", response_model=DealListResponse)
def list_deals(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    stage: Optional[str] = Query(None, description="Filter by deal stage"),
    search: Optional[str] = Query(None, description="Search by name or target company"),
    sort: Optional[str] = Query(None, description="Sort field (prefix with - for descending)"),
    include_archived: bool = Query(False, description="Include archived deals"),
    current_user: User = Depends(get_current_user),
    organization_id: str = Depends(require_scoped_organization_id),
    db: Session = Depends(get_db),
):
    """
    List all deals for the current user's organization.

    Supports pagination, filtering, and sorting.
    """
    deals, total = deal_service.list_deals(
        organization_id=organization_id,
        db=db,
        page=page,
        per_page=per_page,
        stage=stage,
        search=search,
        sort=sort,
        include_archived=include_archived,
    )

    return {
        "items": deals,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/{deal_id}", response_model=DealResponse)
def get_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    organization_id: str = Depends(require_scoped_organization_id),
    db: Session = Depends(get_db),
):
    """
    Get deal details by ID.

    Users can only view deals within their organization.
    """
    deal = deal_service.get_deal_by_id(deal_id, organization_id, db)
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found"
        )

    return deal


@router.put("/{deal_id}", response_model=DealResponse)
def update_deal(
    deal_id: str,
    deal_update: DealUpdate,
    current_user: User = Depends(get_current_user),
    organization_id: str = Depends(require_scoped_organization_id),
    db: Session = Depends(get_db),
):
    """
    Update an existing deal.

    Supports partial updates - only provided fields will be updated.
    Users can only update deals within their organization.
    """
    # First check if deal exists and belongs to user's org
    existing_deal = deal_service.get_deal_by_id(deal_id, organization_id, db)
    if not existing_deal:
        # Check if deal exists in another org
        other_org_deal = db.get(Deal, deal_id)
        if other_org_deal:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update this deal",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found"
        )

    updated_deal = deal_service.update_deal(deal_id, deal_update, organization_id, db)
    return updated_deal


@router.put("/{deal_id}/stage", response_model=DealResponse)
def update_deal_stage_endpoint(
    deal_id: str,
    stage_update: DealStageUpdate,
    current_user: User = Depends(get_current_user),
    organization_id: str = Depends(require_scoped_organization_id),
    db: Session = Depends(get_db),
):
    """Update the stage of an existing deal within the user's organization."""
    updated_deal = deal_service.update_deal_stage(
        deal_id,
        organization_id=organization_id,
        stage=stage_update.stage,
        db=db,
    )
    if not updated_deal:
        other_org_deal = db.get(Deal, deal_id)
        if other_org_deal:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to update this deal",
            )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    return updated_deal


@router.delete("/{deal_id}")
def archive_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    organization_id: str = Depends(require_scoped_organization_id),
    db: Session = Depends(get_db),
):
    """
    Archive a deal (soft delete).

    The deal will be hidden from default list views but can be restored.
    Users can only archive deals within their organization.
    """
    # First check if deal exists and belongs to user's org
    existing_deal = deal_service.get_deal_by_id(deal_id, organization_id, db)
    if not existing_deal:
        # Check if deal exists in another org
        other_org_deal = db.get(Deal, deal_id)
        if other_org_deal:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to archive this deal",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found"
        )

    deal_service.archive_deal(deal_id, organization_id, db)
    return {"message": "Deal archived successfully"}


@router.post("/{deal_id}/restore", response_model=DealResponse)
def restore_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    organization_id: str = Depends(require_scoped_organization_id),
    db: Session = Depends(get_db),
):
    """
    Restore an archived deal.

    Users can only restore deals within their organization.
    """
    # First check if deal exists and belongs to user's org
    existing_deal = db.scalar(
        db.query(Deal)
        .filter(Deal.id == deal_id, Deal.organization_id == organization_id)
        .statement
    )
    if not existing_deal:
        # Check if deal exists in another org
        other_org_deal = db.get(Deal, deal_id)
        if other_org_deal:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to restore this deal",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found"
        )

    restored_deal = deal_service.unarchive_deal(deal_id, organization_id, db)
    return restored_deal
