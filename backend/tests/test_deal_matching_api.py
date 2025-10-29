"""
API Integration Tests for DEV-018 Deal Matching
RED tests to drive API endpoint implementation following TDD
"""

import pytest
from httpx import AsyncClient
from fastapi import status

from app.models.deal_match import DealMatchCriteria, DealMatch


@pytest.mark.asyncio
async def test_create_match_criteria(client: AsyncClient, auth_headers: dict, test_deal):
    """Test POST /api/match-criteria creates new matching criteria"""
    payload = {
        "name": "Tech Acquisitions Q4 2025",
        "deal_type": "buy_side",
        "industries": ["saas", "fintech"],
        "min_deal_size": 1000000,
        "max_deal_size": 10000000,
        "geographies": ["UK", "EU"],
        "structures": ["asset_purchase", "stock_purchase"],
        "negative_filters": {"distressed": True},
        "weights": {"industry": 0.4, "size": 0.3, "geography": 0.2, "other": 0.1}
    }

    response = await client.post(
        "/api/match-criteria",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Tech Acquisitions Q4 2025"
    assert data["deal_type"] == "buy_side"
    assert len(data["industries"]) == 2
    assert data["min_deal_size"] == "1000000.00"


@pytest.mark.asyncio
async def test_list_match_criteria(client: AsyncClient, auth_headers: dict):
    """Test GET /api/match-criteria returns user's criteria"""
    response = await client.get(
        "/api/match-criteria",
        headers=auth_headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_find_matches_for_deal(client: AsyncClient, auth_headers: dict, test_deal):
    """Test POST /api/deals/{deal_id}/find-matches triggers matching algorithm"""
    payload = {
        "criteria": {
            "industries": ["saas", "technology"],
            "min_deal_size": 1000000,
            "max_deal_size": 20000000,
            "geographies": ["UK"],
            "deal_type": "buy_side"
        },
        "min_score": 40.0,
        "limit": 10
    }

    response = await client.post(
        f"/api/deals/{test_deal.id}/find-matches",
        json=payload,
        headers=auth_headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "matches" in data
    assert "total_count" in data
    assert isinstance(data["matches"], list)


@pytest.mark.asyncio
async def test_list_deal_matches(client: AsyncClient, auth_headers: dict, test_deal):
    """Test GET /api/deals/{deal_id}/matches returns existing matches"""
    response = await client.get(
        f"/api/deals/{test_deal.id}/matches",
        headers=auth_headers
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_find_matches_requires_authentication(client: AsyncClient, test_deal):
    """Test matching endpoints require authentication"""
    response = await client.post(
        f"/api/deals/{test_deal.id}/find-matches",
        json={"criteria": {}}
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_match_criteria_scoped_to_organization(
    client: AsyncClient,
    auth_headers: dict,
    create_organization_with_user
):
    """Test users can only see their own organization's match criteria"""
    # Create criteria as first org
    org1, user1 = await create_organization_with_user()
    headers1 = {"Authorization": f"Bearer {user1.id}"}

    payload = {
        "name": "Org 1 Criteria",
        "deal_type": "buy_side",
        "industries": ["saas"],
        "min_deal_size": 1000000,
        "max_deal_size": 5000000
    }

    await client.post("/api/match-criteria", json=payload, headers=headers1)

    # Create second org and try to list criteria
    org2, user2 = await create_organization_with_user()
    headers2 = {"Authorization": f"Bearer {user2.id}"}

    response = await client.get("/api/match-criteria", headers=headers2)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    # Should not see org1's criteria
    assert all(item["organization_id"] == org2.id for item in data)


@pytest.mark.asyncio
async def test_starter_tier_cannot_use_matching(
    client: AsyncClient,
    create_organization_with_tier
):
    """Test Starter tier receives upgrade prompt for matching features"""
    org, user = await create_organization_with_tier("starter")
    headers = {"Authorization": f"Bearer {user.id}"}

    payload = {
        "name": "Test Criteria",
        "deal_type": "buy_side",
        "industries": ["saas"],
        "min_deal_size": 1000000,
        "max_deal_size": 5000000
    }

    response = await client.post("/api/match-criteria", json=payload, headers=headers)

    assert response.status_code == status.HTTP_403_FORBIDDEN
    data = response.json()
    assert "upgrade" in data["detail"].lower()
