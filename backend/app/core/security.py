"""Security utilities for JWT and webhook verification."""
from __future__ import annotations

import hashlib
import hmac
from typing import Any, Dict

from fastapi import HTTPException, status
from jose import JWTError, jwt

from app.core.config import settings


class AuthError(HTTPException):
    """Custom authentication error."""

    def __init__(self, detail: str = "Authentication failed", status_code: int = status.HTTP_401_UNAUTHORIZED) -> None:
        super().__init__(status_code=status_code, detail=detail)


def verify_webhook_signature(signature: str | None, payload: bytes) -> None:
    """Validate Clerk webhook signature using shared secret."""

    secret = settings.clerk_webhook_secret
    if not secret or not signature:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Webhook signature missing")

    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook signature")


def decode_clerk_jwt(token: str) -> Dict[str, Any]:
    """Decode a Clerk-issued JWT using the configured secret and algorithm."""

    secret = settings.clerk_secret_key
    if not secret:
        raise AuthError(detail="Clerk secret key is not configured")

    try:
        return jwt.decode(token, secret, algorithms=[settings.algorithm])
    except JWTError as exc:  # pragma: no cover - jose provides detailed message
        raise AuthError(detail="Invalid authentication token") from exc

