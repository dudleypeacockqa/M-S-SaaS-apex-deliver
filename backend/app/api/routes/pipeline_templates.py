"""Pipeline template CRUD endpoints."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.ownership import require_template_access
from app.db.session import get_db
from app.models.user import User
from app.schemas.pipeline_template import (
    PipelineTemplateCreate,
    PipelineTemplateResponse,
    PipelineTemplateUpdate,
)
from app.services import pipeline_template_service

router = APIRouter(prefix="/pipeline-templates", tags=["pipeline-templates"])


@router.get("", response_model=list[PipelineTemplateResponse])
def list_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    templates = pipeline_template_service.list_templates(db, current_user.organization_id)
    return templates


@router.post("", response_model=PipelineTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    payload: PipelineTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    template = pipeline_template_service.create_template(
        db=db,
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        data=payload,
    )
    return template


@router.get("/{template_id}", response_model=PipelineTemplateResponse)
def get_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    template = require_template_access(template_id=template_id, current_user=current_user, db=db)
    return template


@router.put("/{template_id}", response_model=PipelineTemplateResponse)
def update_template(
    template_id: str,
    payload: PipelineTemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    template = require_template_access(template_id=template_id, current_user=current_user, db=db)
    return pipeline_template_service.update_template(db=db, template=template, data=payload)


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    template = require_template_access(template_id=template_id, current_user=current_user, db=db)
    pipeline_template_service.delete_template(db, template)
    return {"status": "deleted"}
