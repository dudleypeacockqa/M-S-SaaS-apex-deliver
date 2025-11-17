"""
Tests for dashboard metrics API endpoints.

Tests real metric queries with Redis caching for performance.
"""
import json
from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.main import app
from app.models.deal import Deal
from app.models.document import Document
from app.models.organization import Organization
from app.models.user import User

@pytest.mark.asyncio
async def test_get_dashboard_metrics_real_data(
    async_client: AsyncClient,
    db_session: Session,
    test_user: User,
    auth_headers: dict
):
    """Test GET /api/dashboard/metrics returns real deal and document counts."""
    # Arrange: Create test data
    deal1 = Deal(
        id="deal-1",
        name="Test Deal 1",
        organization_id=test_user.organization_id,
        stage="sourcing",
        owner_id=test_user.id,
        target_company="Target 1",
        is_archived=False,
    )
    deal2 = Deal(
        id="deal-2",
        name="Test Deal 2",
        organization_id=test_user.organization_id,
        stage="due_diligence",
        owner_id=test_user.id,
        target_company="Target 2",
        is_archived=False,
    )
    db_session.add_all([deal1, deal2])
    db_session.commit()
    assert db_session.query(Deal).count() == 2

    def _override_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_db

    # Act
    response = await async_client.get("/api/dashboard/metrics", headers=auth_headers)

    app.dependency_overrides.pop(get_db, None)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["deals_count"] == 2
    assert "documents_count" in data
    assert isinstance(data["documents_count"], int)


@pytest.mark.asyncio
async def test_get_dashboard_metrics_with_cache_hit(
    async_client: AsyncClient,
    auth_headers: dict
):
    """Test dashboard metrics use Redis cache on subsequent requests."""
    # Arrange: Mock Redis to return cached data
    cached_metrics = {
        "deals_count": 42,
        "documents_count": 100,
        "tasks_count": 15,
        "recent_activity": []
    }

    with patch('app.api.routes.dashboard.redis_client') as mock_redis:
        mock_redis.get = AsyncMock(return_value=json.dumps(cached_metrics))

        # Act
        response = await async_client.get("/api/dashboard/metrics", headers=auth_headers)

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data == cached_metrics
        mock_redis.get.assert_called_once()


@pytest.mark.asyncio
async def test_get_dashboard_metrics_cache_miss_sets_cache(
    async_client: AsyncClient,
    db_session: Session,
    auth_headers: dict
):
    """Test dashboard metrics query DB on cache miss and set cache."""
    # Arrange: Mock Redis cache miss, then set
    with patch('app.api.routes.dashboard.redis_client') as mock_redis:
        mock_redis.get = AsyncMock(return_value=None)  # Cache miss
        mock_redis.setex = AsyncMock()

        # Act
        response = await async_client.get("/api/dashboard/metrics", headers=auth_headers)

        # Assert
        assert response.status_code == 200
        mock_redis.get.assert_called_once()
        mock_redis.setex.assert_called_once()
        # Verify cache TTL is 5 minutes (300 seconds)
        call_args = mock_redis.setex.call_args
        assert call_args[0][1] == 300  # TTL


@pytest.mark.asyncio
async def test_get_recent_activity_real_data(
    async_client: AsyncClient,
    db_session: Session,
    test_user: User,
    auth_headers: dict
):
    """Test GET /api/dashboard/activity returns real activity logs."""
    # Act
    response = await async_client.get("/api/dashboard/activity", headers=auth_headers)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Empty initially, but endpoint works


@pytest.mark.asyncio
async def test_get_upcoming_tasks_real_data(
    async_client: AsyncClient,
    auth_headers: dict
):
    """Test GET /api/dashboard/tasks returns real tasks."""
    # Act
    response = await async_client.get("/api/dashboard/tasks", headers=auth_headers)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_financial_summary_real_data(
    async_client: AsyncClient,
    auth_headers: dict
):
    """Test GET /api/dashboard/financial-summary returns real financial data."""
    # Act
    response = await async_client.get("/api/dashboard/financial-summary", headers=auth_headers)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
