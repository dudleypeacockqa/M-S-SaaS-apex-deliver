"""Service layer for Deal CRUD operations."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.models.deal import Deal, DealStage
from app.models.user import User
from app.schemas.deal import DealCreate, DealUpdate


def create_deal(deal_data: DealCreate, owner: User, db: Session) -> Deal:
    """
    Create a new deal.

    Args:
        deal_data: Deal creation data
        owner: User creating the deal
        db: Database session

    Returns:
        Created deal instance
    """
    deal = Deal(
        name=deal_data.name,
        target_company=deal_data.target_company,
        industry=deal_data.industry,
        deal_size=deal_data.deal_size,
        currency=deal_data.currency,
        stage=deal_data.stage,
        description=deal_data.description,
        organization_id=owner.organization_id,
        owner_id=str(owner.id),
    )
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal


def get_deal_by_id(deal_id: str, organization_id: str, db: Session) -> Optional[Deal]:
    """
    Get deal by ID (organization-scoped).

    Args:
        deal_id: Deal ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Deal instance or None if not found
    """
    return db.scalar(
        select(Deal).where(Deal.id == deal_id, Deal.organization_id == organization_id)
    )


def list_deals(
    organization_id: str,
    db: Session,
    page: int = 1,
    per_page: int = 20,
    stage: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    include_archived: bool = False,
) -> tuple[list[Deal], int]:
    """
    List deals with pagination and filtering.

    Args:
        organization_id: Organization ID for multi-tenant isolation
        db: Database session
        page: Page number (1-indexed)
        per_page: Items per page
        stage: Filter by deal stage
        search: Search by name or target_company
        sort: Sort field (e.g., "created_at", "-created_at" for descending)
        include_archived: Include archived deals

    Returns:
        Tuple of (deal list, total count)
    """
    # Base query
    query = select(Deal).where(Deal.organization_id == organization_id)

    # Filter: archived
    if not include_archived:
        query = query.where(Deal.is_archived == False)

    # Filter: stage
    if stage:
        try:
            stage_enum = DealStage(stage)
            query = query.where(Deal.stage == stage_enum)
        except ValueError:
            pass  # Invalid stage, ignore filter

    # Filter: search
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Deal.name.ilike(search_pattern), Deal.target_company.ilike(search_pattern)
            )
        )

    # Sort
    if sort:
        if sort.startswith("-"):
            # Descending
            sort_field = sort[1:]
            if hasattr(Deal, sort_field):
                query = query.order_by(getattr(Deal, sort_field).desc())
        else:
            # Ascending
            if hasattr(Deal, sort):
                query = query.order_by(getattr(Deal, sort))
    else:
        # Default sort: newest first
        query = query.order_by(Deal.created_at.desc())

    # Get total count using scalar subquery
    from sqlalchemy import func

    count_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_query)

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    deals = list(db.scalars(query).all())

    return deals, total or 0


def update_deal(
    deal_id: str, deal_update: DealUpdate, organization_id: str, db: Session
) -> Optional[Deal]:
    """
    Update an existing deal.

    Args:
        deal_id: Deal ID
        deal_update: Update data (partial updates supported)
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Updated deal instance or None if not found
    """
    deal = get_deal_by_id(deal_id, organization_id, db)
    if not deal:
        return None

    # Apply updates (only set fields that are provided)
    update_data = deal_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(deal, field, value)

    db.commit()
    db.refresh(deal)
    return deal


def archive_deal(deal_id: str, organization_id: str, db: Session) -> Optional[Deal]:
    """
    Archive a deal (soft delete).

    Args:
        deal_id: Deal ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Archived deal instance or None if not found
    """
    deal = get_deal_by_id(deal_id, organization_id, db)
    if not deal:
        return None

    deal.is_archived = True
    deal.archived_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(deal)
    return deal


def unarchive_deal(deal_id: str, organization_id: str, db: Session) -> Optional[Deal]:
    """
    Restore an archived deal.

    Args:
        deal_id: Deal ID
        organization_id: Organization ID for multi-tenant isolation
        db: Database session

    Returns:
        Restored deal instance or None if not found
    """
    deal = db.scalar(
        select(Deal).where(Deal.id == deal_id, Deal.organization_id == organization_id)
    )
    if not deal:
        return None

    deal.is_archived = False
    deal.archived_at = None
    db.commit()
    db.refresh(deal)
    return deal
