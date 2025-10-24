import json
import hmac
import hashlib
from datetime import datetime, timezone
from typing import Generator

import pytest
from httpx import ASGITransport, AsyncClient
from jose import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.services.user_service import get_user_by_clerk_id

TEST_WEBHOOK_SECRET = "test_webhook_secret"
TEST_JWT_SECRET = "test_jwt_secret"
TEST_JWT_ALGORITHM = "HS256"


def _sign_payload(payload: bytes) -> str:
    return hmac.new(TEST_WEBHOOK_SECRET.encode(), payload, hashlib.sha256).hexdigest()


@pytest.fixture(autouse=True)
def configure_settings() -> None:
    settings.clerk_webhook_secret = TEST_WEBHOOK_SECRET
    settings.clerk_secret_key = TEST_JWT_SECRET
    settings.algorithm = TEST_JWT_ALGORITHM


@pytest.fixture()
def session_override() -> Generator[sessionmaker, None, None]:
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(engine)

    def _get_db_override():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _get_db_override
    yield TestingSessionLocal
    app.dependency_overrides.pop(get_db, None)
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture()
async def async_client() -> Generator[AsyncClient, None, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client


@pytest.mark.asyncio
async def test_webhook_creates_user(session_override: sessionmaker, async_client: AsyncClient) -> None:
    payload_dict = {
        "type": "user.created",
        "data": {
            "id": "user_abc123",
            "email_addresses": [{"email_address": "demo@example.com"}],
            "first_name": "Demo",
            "last_name": "User",
            "profile_image_url": "https://example.com/avatar.png",
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    }
    payload = json.dumps(payload_dict).encode()

    response = await async_client.post(
        "/api/webhooks/clerk",
        content=payload,
        headers={"svix-signature": _sign_payload(payload)},
    )

    assert response.status_code == 200

    session = session_override()
    try:
        user = get_user_by_clerk_id(session, "user_abc123")
        assert user is not None
        assert user.email == "demo@example.com"
        assert user.first_name == "Demo"
        assert user.profile_image_url == "https://example.com/avatar.png"
    finally:
        session.close()


@pytest.mark.asyncio
async def test_webhook_rejects_invalid_signature(async_client: AsyncClient) -> None:
    payload = json.dumps({"type": "user.created", "data": {"id": "user_bad"}}).encode()

    response = await async_client.post(
        "/api/webhooks/clerk",
        content=payload,
        headers={"svix-signature": "invalid"},
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_jwt_dependency_returns_current_user(session_override: sessionmaker, async_client: AsyncClient) -> None:
    payload_dict = {
        "type": "user.created",
        "data": {
            "id": "user_token_1",
            "email_addresses": [{"email_address": "token@example.com"}],
            "first_name": "Token",
            "last_name": "Tester",
        },
    }
    payload = json.dumps(payload_dict).encode()
    await async_client.post(
        "/api/webhooks/clerk",
        content=payload,
        headers={"svix-signature": _sign_payload(payload)},
    )

    token = jwt.encode(
        {
            "sub": "user_token_1",
            "email": "token@example.com",
            "exp": datetime.now(timezone.utc).timestamp() + 3600,
        },
        TEST_JWT_SECRET,
        algorithm=TEST_JWT_ALGORITHM,
    )

    response = await async_client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["clerk_user_id"] == "user_token_1"
    assert body["email"] == "token@example.com"


@pytest.mark.asyncio
async def test_jwt_dependency_rejects_missing_token(async_client: AsyncClient) -> None:
    response = await async_client.get("/api/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_session_created_updates_last_login(session_override: sessionmaker, async_client: AsyncClient) -> None:
    create_payload = json.dumps(
        {
            "type": "user.created",
            "data": {
                "id": "user_session",
                "email_addresses": [{"email_address": "session@example.com"}],
            },
        }
    ).encode()
    await async_client.post(
        "/api/webhooks/clerk",
        content=create_payload,
        headers={"svix-signature": _sign_payload(create_payload)},
    )

    session_payload = json.dumps(
        {
            "type": "session.created",
            "data": {
                "id": "sess_123",
                "user_id": "user_session",
                "last_active_at": datetime.now(timezone.utc).isoformat(),
            },
        }
    ).encode()

    response = await async_client.post(
        "/api/webhooks/clerk",
        content=session_payload,
        headers={"svix-signature": _sign_payload(session_payload)},
    )

    assert response.status_code == 200

    session = session_override()
    try:
        user = get_user_by_clerk_id(session, "user_session")
        assert user is not None
        assert user.last_login_at is not None
    finally:
        session.close()


@pytest.mark.asyncio
async def test_user_deleted_marks_inactive(session_override: sessionmaker, async_client: AsyncClient) -> None:
    create_payload = json.dumps(
        {
            "type": "user.created",
            "data": {
                "id": "user_delete",
                "email_addresses": [{"email_address": "delete@example.com"}],
            },
        }
    ).encode()
    await async_client.post(
        "/api/webhooks/clerk",
        content=create_payload,
        headers={"svix-signature": _sign_payload(create_payload)},
    )

    delete_payload = json.dumps(
        {
            "type": "user.deleted",
            "data": {
                "id": "user_delete",
            },
        }
    ).encode()

    response = await async_client.post(
        "/api/webhooks/clerk",
        content=delete_payload,
        headers={"svix-signature": _sign_payload(delete_payload)},
    )

    assert response.status_code == 200

    session = session_override()
    try:
        user = get_user_by_clerk_id(session, "user_delete")
        assert user is not None
        assert user.is_active is False
    finally:
        session.close()

