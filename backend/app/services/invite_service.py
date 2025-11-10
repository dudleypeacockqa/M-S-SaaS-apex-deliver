"""Organization invitation helpers powered by Clerk."""
from __future__ import annotations

from functools import lru_cache
from typing import Any, Mapping, Optional

from clerk_backend_api import Clerk
from clerk_backend_api.models import ClerkErrors, ClerkErrorsData, ClerkError, OrganizationInvitation, OrganizationInvitations
from clerk_backend_api.models.sdkerror import SDKError

from app.core.config import settings


class InvitationError(Exception):
    """Raised when Clerk invitation calls fail."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


@lru_cache()
def get_clerk_client() -> Clerk:
    """Return a cached Clerk client."""

    if not settings.clerk_secret_key:
        raise InvitationError("Clerk secret key is not configured", status_code=500)
    return Clerk(bearer_auth=settings.clerk_secret_key)


def _extract_error_message(error: ClerkErrors) -> str:
    data: ClerkErrorsData = getattr(error, "data", None)  # type: ignore[arg-type]
    if not data or not data.errors:
        return "Clerk invitation failed"
    first: ClerkError = data.errors[0]
    return first.long_message or first.message


def create_invitation(
    *,
    organization_id: str,
    email_address: str,
    role: str,
    inviter_user_id: Optional[str],
    public_metadata: Optional[Mapping[str, Any]] = None,
    private_metadata: Optional[Mapping[str, Any]] = None,
    redirect_url: Optional[str] = None,
) -> OrganizationInvitation:
    """Create a new organization invitation via Clerk."""

    client = get_clerk_client()
    try:
        return client.organization_invitations.create(
            organization_id=organization_id,
            email_address=email_address,
            role=role,
            inviter_user_id=inviter_user_id,
            public_metadata=public_metadata,
            private_metadata=private_metadata,
            redirect_url=redirect_url,
        )
    except (ClerkErrors, SDKError) as exc:  # pragma: no cover - exercised via unit tests with fake errors
        message = _extract_error_message(exc) if isinstance(exc, ClerkErrors) else str(exc)
        raise InvitationError(message, status_code=400) from exc


def list_pending_invitations(
    *,
    organization_id: str,
    limit: int = 25,
    offset: int = 0,
) -> OrganizationInvitations:
    """List pending invitations for an organization."""

    client = get_clerk_client()
    try:
        return client.organization_invitations.list_pending(
            organization_id=organization_id,
            limit=limit,
            offset=offset,
        )
    except (ClerkErrors, SDKError) as exc:  # pragma: no cover
        message = _extract_error_message(exc) if isinstance(exc, ClerkErrors) else str(exc)
        raise InvitationError(message, status_code=400) from exc
