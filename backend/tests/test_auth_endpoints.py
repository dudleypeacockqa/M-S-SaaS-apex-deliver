"""Tests for Clerk JWT authentication dependency."""
from __future__ import annotations

from datetime import datetime, timezone

from jose import jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User, UserRole


def _create_user(db_session: Session, **kwargs) -> User:
    user = User(
        clerk_user_id=kwargs.get("clerk_user_id", "user_auth"),
        email=kwargs.get("email", "auth@example.com"),
        first_name=kwargs.get("first_name"),
        last_name=kwargs.get("last_name"),
        role=kwargs.get("role", UserRole.solo),
        is_active=kwargs.get("is_active", True),
        last_login_at=kwargs.get("last_login_at"),
    )
    db_session.add(user)
    db_session.commit()
    return user


def _make_token(subject: str, extra: dict | None = None) -> str:
    payload = {"sub": subject, "iat": int(datetime.now(tz=timezone.utc).timestamp())}
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.clerk_secret_key, algorithm=settings.clerk_jwt_algorithm)


def test_auth_me_returns_current_user(client, db_session: Session) -> None:
    user = _create_user(db_session, clerk_user_id="user_token", email="token@example.com", role=UserRole.admin)
    token = _make_token(user.clerk_user_id)

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    data = response.json()
    assert data["clerk_user_id"] == "user_token"
    assert data["email"] == "token@example.com"
    assert data["role"] == "admin"


def test_auth_me_requires_token(client) -> None:
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_auth_me_rejects_invalid_token(client) -> None:
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401
