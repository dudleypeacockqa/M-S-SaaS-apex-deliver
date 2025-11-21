"""
Webhook API Routes

API endpoints for webhook configuration and processing.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.dependencies.auth import get_current_master_admin_user
from app.db.session import get_db
from app.models.user import User
from app.models.master_admin import Webhook, WebhookDelivery
from app.models.organization import Organization
from app.schemas.master_admin import (
    WebhookCreate,
    WebhookUpdate,
    WebhookResponse,
    WebhookListResponse,
    WebhookDeliveryResponse,
)
from app.services import voice_service

router = APIRouter(prefix="/master-admin/webhooks", tags=["webhooks"])


@router.post("", response_model=WebhookResponse, status_code=status.HTTP_201_CREATED)
def create_webhook(
    webhook_data: WebhookCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new webhook configuration.
    
    Args:
        webhook_data: Webhook configuration data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created webhook configuration
    """
    # Get user's organization
    result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Create webhook
    webhook = Webhook(
        organization_id=str(organization.id),
        name=webhook_data.name,
        url=webhook_data.url,
        events=webhook_data.events or [],
        secret_key=webhook_data.secret_key,
        is_active=webhook_data.is_active if webhook_data.is_active is not None else True,
        created_by=str(current_user.id),
    )
    
    db.add(webhook)
    db.commit()
    db.refresh(webhook)
    
    return webhook


@router.get("", response_model=WebhookListResponse)
def list_webhooks(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List all webhooks for the current user's organization.
    
    Args:
        page: Page number
        per_page: Items per page
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Paginated list of webhooks
    """
    from sqlalchemy import func
    
    # Get user's organization
    result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Query webhooks
    query = select(Webhook).where(Webhook.organization_id == str(organization.id))
    
    # Count total
    total_result = db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar() or 0
    
    # Paginate
    offset = (page - 1) * per_page
    paginated_query = query.order_by(Webhook.created_at.desc()).offset(offset).limit(per_page)
    result = db.execute(paginated_query)
    webhooks = result.scalars().all()
    
    return {
        "items": list(webhooks),
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/{webhook_id}", response_model=WebhookResponse)
def get_webhook(
    webhook_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get a specific webhook configuration.
    
    Args:
        webhook_id: Webhook ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Webhook configuration
    """
    # Get webhook
    result = db.execute(select(Webhook).where(Webhook.id == webhook_id))
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook not found"
        )
    
    # Verify organization access
    if webhook.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return webhook


@router.put("/{webhook_id}", response_model=WebhookResponse)
def update_webhook(
    webhook_id: int,
    webhook_data: WebhookUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update a webhook configuration.
    
    Args:
        webhook_id: Webhook ID
        webhook_data: Update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated webhook configuration
    """
    # Get webhook
    result = db.execute(select(Webhook).where(Webhook.id == webhook_id))
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook not found"
        )
    
    # Verify organization access
    if webhook.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Update fields
    update_data = webhook_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(webhook, field, value)
    
    db.commit()
    db.refresh(webhook)
    
    return webhook


@router.delete("/{webhook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_webhook(
    webhook_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a webhook configuration.
    
    Args:
        webhook_id: Webhook ID
        current_user: Current authenticated user
        db: Database session
    """
    # Get webhook
    result = db.execute(select(Webhook).where(Webhook.id == webhook_id))
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook not found"
        )
    
    # Verify organization access
    if webhook.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    db.delete(webhook)
    db.commit()
    
    return None


@router.post("/voice/incoming", status_code=status.HTTP_200_OK)
async def handle_voice_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Handle incoming voice call webhooks from Synthflow.
    
    This endpoint is public (no auth required) as it receives webhooks from external services.
    
    Args:
        request: FastAPI request object
        db: Database session
        
    Returns:
        Webhook processing result
    """
    try:
        # Get webhook payload
        payload = await request.json()
        
        # Process webhook via voice service
        result = await voice_service.process_voice_webhook(payload, db)
        
        return {"status": "processed", "result": result}
    except Exception as e:
        # Log error but return 200 to prevent webhook retries
        print(f"Error processing voice webhook: {e}")
        return {"status": "error", "message": str(e)}


@router.get("/{webhook_id}/deliveries", response_model=List[WebhookDeliveryResponse])
def get_webhook_deliveries(
    webhook_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get delivery history for a webhook.
    
    Args:
        webhook_id: Webhook ID
        page: Page number
        per_page: Items per page
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of webhook deliveries
    """
    from sqlalchemy import func
    
    # Get webhook
    result = db.execute(select(Webhook).where(Webhook.id == webhook_id))
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook not found"
        )
    
    # Verify organization access
    if webhook.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Query deliveries
    query = select(WebhookDelivery).where(WebhookDelivery.webhook_id == webhook_id)
    
    # Paginate
    offset = (page - 1) * per_page
    paginated_query = query.order_by(WebhookDelivery.created_at.desc()).offset(offset).limit(per_page)
    result = db.execute(paginated_query)
    deliveries = result.scalars().all()
    
    return list(deliveries)

