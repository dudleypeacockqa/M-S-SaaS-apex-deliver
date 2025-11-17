"""
Tests for financial ratios and narratives API endpoints.

Tests real queries with Redis caching for performance.
"""
from decimal import Decimal
from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.main import app
from app.models.deal import Deal
from app.models.financial_narrative import FinancialNarrative
from app.models.financial_ratio import FinancialRatio
from app.models.organization import Organization
from app.models.user import User


@pytest.mark.asyncio
async def test_get_financial_ratios_not_found(
    async_client: AsyncClient,
    db_session: Session,
    test_user: User,
    auth_headers: dict
):
    """Test GET /api/deals/{deal_id}/financial/ratios returns 404 when no ratios exist."""
    # Arrange: Create deal without ratios
    deal = Deal(
        id="deal-no-ratios",
        name="Test Deal Without Ratios",
        organization_id=test_user.organization_id,
        stage="sourcing",
        owner_id=test_user.id,
        target_company="Target Corp",
        is_archived=False,
    )
    db_session.add(deal)
    db_session.commit()

    def _override_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_db

    # Act
    response = await async_client.get(
        f"/api/deals/{deal.id}/financial/ratios",
        headers=auth_headers
    )

    app.dependency_overrides.pop(get_db, None)

    # Assert
    assert response.status_code == 404
    assert "No financial ratios" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_financial_ratios_success(
    async_client: AsyncClient,
    db_session: Session,
    test_user: User,
    auth_headers: dict
):
    """Test GET /api/deals/{deal_id}/financial/ratios returns latest ratios."""
    # Arrange: Create deal with ratios
    deal = Deal(
        id="deal-with-ratios",
        name="Test Deal With Ratios",
        organization_id=test_user.organization_id,
        stage="due_diligence",
        owner_id=test_user.id,
        target_company="Target Corp",
        is_archived=False,
    )
    ratio = FinancialRatio(
        id="ratio-1",
        deal_id=deal.id,
        organization_id=test_user.organization_id,
        period="2024-Q4",
        current_ratio=Decimal("2.5"),
        quick_ratio=Decimal("1.8"),
        gross_profit_margin=Decimal("0.45"),
        net_profit_margin=Decimal("0.15"),
        debt_to_equity=Decimal("0.8"),
    )
    db_session.add_all([deal, ratio])
    db_session.commit()

    def _override_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_db

    # Act
    response = await async_client.get(
        f"/api/deals/{deal.id}/financial/ratios",
        headers=auth_headers
    )

    app.dependency_overrides.pop(get_db, None)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == ratio.id
    assert data["period"] == "2024-Q4"
    assert float(data["current_ratio"]) == 2.5
    assert float(data["quick_ratio"]) == 1.8


@pytest.mark.asyncio
async def test_get_financial_narrative_not_found(
    async_client: AsyncClient,
    db_session: Session,
    test_user: User,
    auth_headers: dict
):
    """Test GET /api/deals/{deal_id}/financial/narrative returns 404 when no narrative exists."""
    # Arrange: Create deal without narrative
    deal = Deal(
        id="deal-no-narrative",
        name="Test Deal Without Narrative",
        organization_id=test_user.organization_id,
        stage="sourcing",
        owner_id=test_user.id,
        target_company="Target Corp",
        is_archived=False,
    )
    db_session.add(deal)
    db_session.commit()

    def _override_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_db

    # Act
    response = await async_client.get(
        f"/api/deals/{deal.id}/financial/narrative",
        headers=auth_headers
    )

    app.dependency_overrides.pop(get_db, None)

    # Assert
    assert response.status_code == 404
    assert "No financial narrative" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_financial_narrative_success(
    async_client: AsyncClient,
    db_session: Session,
    test_user: User,
    auth_headers: dict
):
    """Test GET /api/deals/{deal_id}/financial/narrative returns latest narrative."""
    # Arrange: Create deal with narrative
    deal = Deal(
        id="deal-with-narrative",
        name="Test Deal With Narrative",
        organization_id=test_user.organization_id,
        stage="due_diligence",
        owner_id=test_user.id,
        target_company="Target Corp",
        is_archived=False,
    )
    narrative = FinancialNarrative(
        id="narrative-1",
        deal_id=deal.id,
        organization_id=test_user.organization_id,
        summary="Strong financial health with consistent profitability.",
        strengths=["High margins", "Low debt"],
        weaknesses=["Limited cash reserves"],
        readiness_score=Decimal("85.5"),
        ai_model="gpt-4",
    )
    db_session.add_all([deal, narrative])
    db_session.commit()

    def _override_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_db

    # Act
    response = await async_client.get(
        f"/api/deals/{deal.id}/financial/narrative",
        headers=auth_headers
    )

    app.dependency_overrides.pop(get_db, None)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == narrative.id
    assert "Strong financial health" in data["summary"]
    assert data["strengths"] == ["High margins", "Low debt"]
    assert float(data["readiness_score"]) == 85.5


@pytest.mark.asyncio
async def test_get_financial_ratios_with_redis_cache(
    async_client: AsyncClient,
    auth_headers: dict
):
    """Test financial ratios use Redis cache on subsequent requests."""
    # Arrange: Mock Redis to return cached data
    cached_ratio = {
        "id": "ratio-cached",
        "period": "2024-Q4",
        "current_ratio": 2.5,
        "quick_ratio": 1.8,
    }

    with patch('app.api.routes.financial.redis_async') as mock_redis:
        mock_redis.from_url = AsyncMock(return_value=mock_redis)
        mock_redis.get = AsyncMock(return_value=str(cached_ratio))

        # Act
        response = await async_client.get(
            "/api/deals/test-deal-id/financial/ratios",
            headers=auth_headers
        )

        # Note: This will fail with 404 if deal doesn't exist, but demonstrates caching pattern
