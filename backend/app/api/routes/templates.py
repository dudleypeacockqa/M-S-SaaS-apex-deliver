"""
Template API Routes

API endpoints for campaign template management.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.api.dependencies.auth import get_current_master_admin_user
from app.db.session import get_db
from app.models.user import User
from app.models.master_admin import CampaignTemplate
from app.models.organization import Organization
from app.schemas.master_admin import (
    CampaignTemplateCreate,
    CampaignTemplateUpdate,
    CampaignTemplateResponse,
    CampaignTemplateListResponse,
    TemplatePreviewRequest,
    TemplatePreviewResponse,
)
from app.services import template_service

router = APIRouter(prefix="/master-admin/templates", tags=["templates"])


@router.post("", response_model=CampaignTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    template_data: CampaignTemplateCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a new campaign template.
    
    Args:
        template_data: Template creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created template
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    template_dict = template_data.model_dump()
    template = template_service.create_template(
        template_dict,
        str(organization.id),
        str(current_user.id),
        db
    )
    return template


@router.get("", response_model=CampaignTemplateListResponse)
def list_templates(
    type_filter: Optional[str] = Query(None, alias="type"),
    is_default: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List templates for the current user's organization.
    
    Args:
        type_filter: Filter by template type
        is_default: Filter by is_default flag
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of templates
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    templates = template_service.list_templates(
        str(organization.id),
        db,
        template_type=type_filter,
        is_default=is_default
    )
    
    return {
        "items": templates,
        "total": len(templates),
    }


@router.get("/{template_id}", response_model=CampaignTemplateResponse)
def get_template(
    template_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get a specific template.
    
    Args:
        template_id: Template ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Template details
        
    Raises:
        HTTPException: If template not found
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    template = template_service.get_template(template_id, str(organization.id), db)
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template


@router.put("/{template_id}", response_model=CampaignTemplateResponse)
def update_template(
    template_id: int,
    template_update: CampaignTemplateUpdate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Update a template.
    
    Args:
        template_id: Template ID
        template_update: Template update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated template
        
    Raises:
        HTTPException: If template not found
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    template = template_service.get_template(template_id, str(organization.id), db)
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    update_data = template_update.model_dump(exclude_unset=True)
    template = template_service.update_template(template, update_data, db)
    
    return template


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Delete a template.
    
    Args:
        template_id: Template ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If template not found
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    template = template_service.get_template(template_id, str(organization.id), db)
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    template_service.delete_template(template, db)


@router.post("/{template_id}/preview", response_model=TemplatePreviewResponse)
def render_template_preview(
    template_id: int,
    preview_request: TemplatePreviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Preview a template with sample contact data.
    
    Args:
        template_id: Template ID
        preview_request: Request with contact_data for variable substitution
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Rendered template (subject and content)
        
    Raises:
        HTTPException: If template not found or variables missing
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    template = template_service.get_template(template_id, str(organization.id), db)
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    try:
        rendered = template_service.render_template(
            template_id,
            preview_request.contact_data,
            db
        )
        return rendered
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

