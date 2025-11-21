"""
Campaign API Routes

API endpoints for campaign management.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.api.dependencies.auth import get_current_master_admin_user

# Legacy compatibility: some deployments still reference get_current_user
# for these endpoints. Alias it to the stricter dependency so we fail safe.
get_current_user = get_current_master_admin_user
from app.db.session import get_db
from app.models.user import User
from app.models.master_admin import AdminCampaign, CampaignActivity, AdminCampaignRecipient
from app.models.organization import Organization
from app.schemas.master_admin import (
    AdminCampaignCreate,
    AdminCampaignUpdate,
    AdminCampaignResponse,
    AdminCampaignListResponse,
    AdminCampaignRecipientCreate,
    AdminCampaignRecipientUpdate,
    AdminCampaignRecipientResponse,
    AdminCampaignRecipientListResponse,
    CampaignAnalyticsResponse,
    CampaignActivityListResponse,
    ScheduleCampaignRequest,
)
from app.services import campaign_service, master_admin_service

router = APIRouter(prefix="/master-admin/campaigns", tags=["campaigns"])


@router.post("", response_model=AdminCampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    campaign_data: AdminCampaignCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new campaign.
    
    Args:
        campaign_data: Campaign creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created campaign
    """
    campaign_dict = campaign_data.model_dump()
    campaign_dict["type"] = campaign_dict.pop("campaign_type", campaign_dict.get("type"))
    
    campaign = campaign_service.create_campaign(campaign_dict, current_user, db)
    return campaign


@router.get("", response_model=AdminCampaignListResponse)
def list_campaigns(
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    type_filter: Optional[str] = Query(None, alias="type"),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List campaigns for the current user.
    
    Args:
        page: Page number
        per_page: Items per page
        status_filter: Filter by status
        type_filter: Filter by type
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Paginated list of campaigns
    """
    query = select(AdminCampaign).where(AdminCampaign.user_id == str(current_user.id))
    
    if status_filter:
        query = query.where(AdminCampaign.status == status_filter)
    if type_filter:
        query = query.where(AdminCampaign.type == type_filter)
    
    # Get total count
    total_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(total_query) or 0
    
    # Apply pagination
    query = query.order_by(AdminCampaign.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    campaigns = list(db.scalars(query).all())
    
    return {
        "items": campaigns,
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/{campaign_id}", response_model=AdminCampaignResponse)
def get_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get a specific campaign.
    
    Args:
        campaign_id: Campaign ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Campaign details
        
    Raises:
        HTTPException: If campaign not found
    """
    result = db.execute(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == str(current_user.id)
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return campaign


@router.put("/{campaign_id}", response_model=AdminCampaignResponse)
def update_campaign(
    campaign_id: int,
    campaign_update: AdminCampaignUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update a campaign.
    
    Args:
        campaign_id: Campaign ID
        campaign_update: Campaign update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated campaign
        
    Raises:
        HTTPException: If campaign not found
    """
    result = db.execute(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == str(current_user.id)
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(campaign, key, value)
    
    db.commit()
    db.refresh(campaign)
    
    return campaign


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a campaign.
    
    Args:
        campaign_id: Campaign ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If campaign not found
    """
    result = db.execute(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == str(current_user.id)
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    db.delete(campaign)
    db.commit()


@router.post("/{campaign_id}/schedule", response_model=AdminCampaignResponse)
def schedule_campaign(
    campaign_id: int,
    schedule_request: ScheduleCampaignRequest,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Schedule a campaign for future execution.
    
    Args:
        campaign_id: Campaign ID
        schedule_request: Schedule request with schedule_at timestamp
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated campaign with schedule information
    """
    campaign = campaign_service.schedule_campaign(
        campaign_id,
        schedule_request.schedule_at,
        current_user,
        db
    )
    return campaign


@router.post("/{campaign_id}/execute")
def execute_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Execute a campaign immediately.
    
    Args:
        campaign_id: Campaign ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Execution results
    """
    result = campaign_service.execute_campaign(campaign_id, current_user, db)
    return result


def _get_user_campaign_or_404(campaign_id: int, current_user: User, db: Session) -> AdminCampaign:
    campaign = master_admin_service.get_admin_campaign_by_id(
        campaign_id,
        str(current_user.id),
        db,
    )
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.post("/{campaign_id}/send", response_model=AdminCampaignResponse)
def send_campaign(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Mark a campaign as sent (legacy compatibility endpoint).
    """
    campaign = _get_user_campaign_or_404(campaign_id, current_user, db)
    return master_admin_service.send_admin_campaign(campaign, db)


@router.post(
    "/{campaign_id}/recipients",
    response_model=AdminCampaignRecipientResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_campaign_recipient(
    campaign_id: int,
    recipient_data: AdminCampaignRecipientCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """Attach a prospect to the campaign recipient list."""
    campaign = _get_user_campaign_or_404(campaign_id, current_user, db)
    try:
        recipient = master_admin_service.add_admin_campaign_recipient(
            campaign,
            prospect_id=recipient_data.prospect_id,
            db=db,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return recipient


@router.get(
    "/{campaign_id}/recipients",
    response_model=AdminCampaignRecipientListResponse,
)
def list_campaign_recipients(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """Return all recipients for a campaign."""
    _get_user_campaign_or_404(campaign_id, current_user, db)
    recipients = master_admin_service.list_admin_campaign_recipients(
        campaign_id=campaign_id,
        user_id=str(current_user.id),
        db=db,
    )
    return {
        "items": recipients,
        "total": len(recipients),
        "page": 1,
        "per_page": len(recipients),
    }


@router.delete(
    "/{campaign_id}/recipients/{recipient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_campaign_recipient(
    campaign_id: int,
    recipient_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """Remove a recipient from the campaign."""
    campaign = _get_user_campaign_or_404(campaign_id, current_user, db)
    recipient = db.scalar(
        select(AdminCampaignRecipient).where(
            AdminCampaignRecipient.id == recipient_id,
            AdminCampaignRecipient.campaign_id == campaign_id,
        )
    )
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    master_admin_service.delete_admin_campaign_recipient(recipient, campaign, db)


@router.put(
    "/{campaign_id}/recipients/{recipient_id}",
    response_model=AdminCampaignRecipientResponse,
)
def update_campaign_recipient(
    campaign_id: int,
    recipient_id: int,
    recipient_update: AdminCampaignRecipientUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    campaign = _get_user_campaign_or_404(campaign_id, current_user, db)
    recipient = db.scalar(
        select(AdminCampaignRecipient).where(
            AdminCampaignRecipient.id == recipient_id,
            AdminCampaignRecipient.campaign_id == campaign_id,
        )
    )
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    updated = master_admin_service.update_admin_campaign_recipient(
        recipient,
        recipient_update,
        campaign,
        db,
    )
    return updated


@router.get("/{campaign_id}/analytics", response_model=CampaignAnalyticsResponse)
def get_campaign_analytics(
    campaign_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get campaign analytics.
    
    Args:
        campaign_id: Campaign ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Campaign analytics metrics
    """
    # Verify campaign belongs to user
    result = db.execute(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == str(current_user.id)
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    analytics = campaign_service.get_campaign_analytics(campaign_id, db)
    return analytics


@router.get("/{campaign_id}/activities", response_model=CampaignActivityListResponse)
def get_campaign_activities(
    campaign_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get campaign activities.
    
    Args:
        campaign_id: Campaign ID
        page: Page number
        per_page: Items per page
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Paginated list of campaign activities
    """
    # Verify campaign belongs to user
    result = db.execute(
        select(AdminCampaign).where(
            AdminCampaign.id == campaign_id,
            AdminCampaign.user_id == str(current_user.id)
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Get organization ID
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    query = select(CampaignActivity).where(
        CampaignActivity.campaign_id == campaign_id,
        CampaignActivity.organization_id == str(organization.id)
    )
    
    # Get total count
    total_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(total_query) or 0
    
    # Apply pagination
    query = query.order_by(CampaignActivity.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    activities = list(db.scalars(query).all())
    
    return {
        "items": activities,
        "total": total,
        "page": page,
        "per_page": per_page,
    }

