"""Helpers for enforcing resource ownership."""
from __future__ import annotations

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.deal import Deal
from app.models.pipeline_template import PipelineTemplate
from app.models.user import User
from app.services import pipeline_template_service


def require_deal_access(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Deal:
    deal = db.get(Deal, deal_id)
    if not deal:
        _deal_not_found()

    if current_user.organization_id and deal.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "DEAL_NOT_FOUND", "message": "Deal not found"},
        )

    return deal


def require_template_access(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PipelineTemplate:
    template = pipeline_template_service.get_template(db, template_id, current_user.organization_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pipeline template not found")
    return template


__all__ = ["require_deal_access", "require_template_access"]
