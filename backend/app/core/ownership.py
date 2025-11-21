"""Helpers for enforcing resource ownership."""
from __future__ import annotations

from typing import Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.deal import Deal
from app.models.document import Document
from app.models.pipeline_template import PipelineTemplate
from app.models.user import User
from app.schemas.document import PermissionLevel
from app.services import document_service, pipeline_template_service, rbac_audit_service


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


def _deal_not_found() -> None:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={"code": "DEAL_NOT_FOUND", "message": "Deal not found"},
    )


def require_template_access(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PipelineTemplate:
    template = pipeline_template_service.get_template(db, template_id, current_user.organization_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pipeline template not found")
    return template


def require_document_access(
    *,
    document_id: str,
    deal_id: str,
    organization_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    minimum_level: Optional[str | PermissionLevel] = PermissionLevel.VIEWER,
    allow_editor_for_own: bool = True,
) -> Document:
    """Ensure the current user can access a specific document within a deal."""

    requested_org = str(organization_id)
    requested_deal = str(deal_id)
    document = db.get(Document, document_id)
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    actual_org = str(document.organization_id)
    actual_deal = str(document.deal_id)
    if actual_org != requested_org or actual_deal != requested_deal:
        rbac_audit_service.log_resource_scope_violation(
            db,
            actor_user_id=str(current_user.id),
            organization_id=requested_org,
            resource_type="document",
            resource_id=str(document.id),
            detail=f"expected deal {requested_deal} / org {requested_org}, actual deal {actual_deal} / org {actual_org}",
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    if minimum_level:
        required_level = (
            minimum_level.value
            if isinstance(minimum_level, PermissionLevel)
            else str(minimum_level)
        )
        document_service.ensure_document_permission(
            db=db,
            document=document,
            user=current_user,
            minimum_level=required_level,
            allow_editor_for_own=allow_editor_for_own,
        )
    return document


__all__ = ["require_deal_access", "require_template_access", "require_document_access"]
