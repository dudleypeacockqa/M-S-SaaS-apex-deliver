"""Tenant scoping utilities for master admin impersonation."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user, is_master_admin
from app.db.session import get_db
from app.models.organization import Organization
from app.models.user import User, UserRole
from app.services import rbac_audit_service
from app.core.permissions import Permission


@dataclass
class AccessScope:
    """Represents the effective tenant/customer context for a request."""

    actor: User
    target_org: Optional[Organization] = None
    target_customer: Optional[User] = None

    @property
    def is_master_admin(self) -> bool:
        return self.actor.role == UserRole.master_admin

    @property
    def organization_id(self) -> Optional[str]:
        if self.target_org:
            return str(self.target_org.id)
        return self.actor.organization_id

    @property
    def customer_id(self) -> Optional[str]:
        if self.target_customer:
            return str(self.target_customer.id)
        return None

    def require_organization_id(self) -> str:
        """Return the scoped organization id or raise if unavailable."""
        org_id = self.organization_id
        if not org_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization context is required for this operation",
            )
        return org_id


def _fetch_organization(db: Session, organization_id: str) -> Organization:
    organization = db.get(Organization, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant organization not found",
        )
    return organization


def _fetch_user(db: Session, user_id: str) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested customer user not found",
        )
    return user


def get_access_scope(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    tenant_id: Optional[str] = Header(None, alias="X-Master-Tenant-Id"),
    customer_id: Optional[str] = Header(None, alias="X-Master-Customer-Id"),
) -> AccessScope:
    """
    Resolve the effective organization/customer context for the request.

    - Master admins can impersonate any tenant or customer by supplying headers
    - Non master users are restricted to their own organization
    """
    if (tenant_id or customer_id) and not is_master_admin(current_user):
        rbac_audit_service.log_permission_denied(
            db,
            actor_user_id=current_user.id,
            organization_id=current_user.organization_id,
            permission=Permission.MASTER_IMPERSONATE.value,
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Master admin access required to override tenant context",
        )

    target_org: Optional[Organization] = None
    target_customer: Optional[User] = None

    if tenant_id:
        target_org = _fetch_organization(db, tenant_id)

    if customer_id:
        target_customer = _fetch_user(db, customer_id)
        if tenant_id:
            if target_customer.organization_id != tenant_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Customer does not belong to the specified tenant",
                )
        elif target_customer.organization_id:
            # Infer tenant scope from the selected customer if not provided
            target_org = target_org or _fetch_organization(db, target_customer.organization_id)

    scope = AccessScope(
        actor=current_user,
        target_org=target_org,
        target_customer=target_customer,
    )

    if (tenant_id or customer_id) and is_master_admin(current_user):
        rbac_audit_service.log_impersonation(
            db,
            actor_user_id=current_user.id,
            organization_id=target_org.id if target_org else None,
            tenant_id=str(target_org.id) if target_org else tenant_id,
            customer_id=str(target_customer.id) if target_customer else customer_id,
        )

    return scope


def require_scoped_organization_id(
    scope: AccessScope = Depends(get_access_scope),
) -> str:
    """FastAPI dependency shortcut to inject the scoped organization ID."""
    return scope.require_organization_id()


__all__ = ["AccessScope", "get_access_scope", "require_scoped_organization_id"]

