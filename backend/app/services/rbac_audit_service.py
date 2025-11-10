"""Service helpers for RBAC audit logging."""
from __future__ import annotations

from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.rbac_audit_log import RBACAuditAction, RBACAuditLog

CLAIM_SNAPSHOT_KEYS = ("sub", "org_id", "org_role", "sid", "iss", "session_id")


def _persist_log(
    db: Session,
    *,
    actor_user_id: str | None,
    target_user_id: str | None,
    organization_id: str | None,
    action: RBACAuditAction,
    detail: str | None = None,
    claim_snapshot: Mapping[str, Any] | None = None,
) -> RBACAuditLog:
    entry = RBACAuditLog(
        actor_user_id=actor_user_id,
        target_user_id=target_user_id,
        organization_id=organization_id,
        action=action.value,
        detail=detail,
        claim_snapshot=(
            {key: claim_snapshot[key] for key in CLAIM_SNAPSHOT_KEYS if claim_snapshot and key in claim_snapshot}
            if claim_snapshot
            else None
        ),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def log_role_change(
    db: Session,
    *,
    actor_user_id: str,
    target_user_id: str,
    organization_id: str | None,
    previous_role: str,
    new_role: str,
) -> RBACAuditLog:
    detail = f"Role changed from {previous_role} to {new_role}"
    return _persist_log(
        db,
        actor_user_id=actor_user_id,
        target_user_id=target_user_id,
        organization_id=organization_id,
        action=RBACAuditAction.ROLE_CHANGE,
        detail=detail,
    )


def log_user_status_change(
    db: Session,
    *,
    actor_user_id: str,
    target_user_id: str,
    organization_id: str | None,
    action: RBACAuditAction,
    detail: str,
) -> RBACAuditLog:
    if action not in (RBACAuditAction.USER_DELETED, RBACAuditAction.USER_RESTORED):
        raise ValueError("Unsupported action for status change logging")
    return _persist_log(
        db,
        actor_user_id=actor_user_id,
        target_user_id=target_user_id,
        organization_id=organization_id,
        action=action,
        detail=detail,
    )


def log_claim_mismatch(
    db: Session,
    *,
    actor_user_id: str,
    organization_id: str | None,
    detail: str,
    claim_snapshot: Mapping[str, Any] | None = None,
) -> RBACAuditLog:
    return _persist_log(
        db,
        actor_user_id=actor_user_id,
        target_user_id=actor_user_id,
        organization_id=organization_id,
        action=RBACAuditAction.CLAIM_MISMATCH,
        detail=detail,
        claim_snapshot=claim_snapshot,
    )
