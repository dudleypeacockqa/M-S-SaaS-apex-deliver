"""Service helpers for RBAC audit logging."""
from __future__ import annotations

from typing import Any, Mapping

from sqlalchemy.orm import Session

from app.models.rbac_audit_log import RBACAuditAction, RBACAuditLog
from app.services.audit_event_sink import emit_audit_event

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


def log_permission_denied(
    db: Session,
    *,
    actor_user_id: str,
    organization_id: str | None,
    permission: str,
) -> RBACAuditLog:
    detail = f"Permission '{permission}' denied"
    return _persist_log(
        db,
        actor_user_id=actor_user_id,
        target_user_id=actor_user_id,
        organization_id=organization_id,
        action=RBACAuditAction.PERMISSION_DENIED,
        detail=detail,
    )


def log_impersonation(
    db: Session,
    *,
    actor_user_id: str,
    organization_id: str | None,
    tenant_id: str | None,
    customer_id: str | None,
) -> RBACAuditLog:
    parts: list[str] = []
    if tenant_id:
        parts.append(f"tenant={tenant_id}")
    if customer_id:
        parts.append(f"customer={customer_id}")
    detail = "Scoped via headers: " + ", ".join(parts) if parts else "Scoped via headers"
    return _persist_log(
        db,
        actor_user_id=actor_user_id,
        target_user_id=actor_user_id,
        organization_id=organization_id or tenant_id,
        action=RBACAuditAction.IMPERSONATION,
        detail=detail,
    )


def log_resource_scope_violation(
    db: Session,
    *,
    actor_user_id: str,
    organization_id: str | None,
    resource_type: str,
    resource_id: str,
    detail: str | None = None,
) -> RBACAuditLog:
    message = detail or "resource scope violation"
    full_detail = f"{resource_type}({resource_id}) scope violation: {message}"
    entry = _persist_log(
        db,
        actor_user_id=actor_user_id,
        target_user_id=actor_user_id,
        organization_id=organization_id,
        action=RBACAuditAction.RESOURCE_SCOPE_VIOLATION,
        detail=full_detail,
    )
    emit_audit_event(
        RBACAuditAction.RESOURCE_SCOPE_VIOLATION.value,
        actor_user_id=actor_user_id,
        organization_id=organization_id,
        detail=full_detail,
        metadata={"resource_type": resource_type, "resource_id": resource_id},
    )
    return entry
