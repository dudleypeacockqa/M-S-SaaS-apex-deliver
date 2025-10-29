"""
Tests for DEV-018 Phase 3: Deal Matching API Endpoints
TDD RED phase - Comprehensive endpoint testing
"""

import pytest
from decimal import Decimal
from app.models.deal_match import DealMatchCriteria, DealMatch, DealMatchAction


# Use fixtures from conftest and test_deal_matching_models
pytestmark = pytest.mark.usefixtures("match_org", "match_user", "match_deal")


class TestDealMatchingCriteriaAPI:
    """Test suite for deal matching criteria CRUD endpoints."""

    def test_create_criteria_success(self, client, match_user, match_org):
        """Test creating new deal matching criteria."""
        from app.api.dependencies.auth import get_current_user, require_feature
        from app.main import app

        # Mock both authentication dependencies
        app.dependency_overrides[get_current_user] = lambda: match_user
        app.dependency_overrides[require_feature] = lambda feature: lambda: match_user

        response = client.post(
            "/api/match-criteria",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
            json={
                "name": "Tech Acquisitions Q4",
                "deal_type": "buy_side",
                "industries": ["saas", "fintech"],
                "min_deal_size": 1000000,
                "max_deal_size": 10000000,
                "geographies": ["UK", "EU"],
                "structures": ["asset_purchase", "stock_purchase"],
                "negative_filters": {"industries": ["gambling"]},
                "weights": {
                    "industry": 0.4,
                    "size": 0.3,
                    "geography": 0.2,
                    "description": 0.1,
                },
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Tech Acquisitions Q4"
        assert data["deal_type"] == "buy_side"
        assert "saas" in data["industries"]
        assert data["min_deal_size"] == "1000000.00"
        assert "id" in data
        assert "created_at" in data

        app.dependency_overrides.clear()

    def test_create_criteria_requires_auth(self, client):
        """Test creating criteria requires authentication."""
        response = client.post(
            "/api/match-criteria",
            json={
                "name": "Test",
                "deal_type": "buy_side",
                "industries": ["saas"],
                "min_deal_size": 1000000,
                "max_deal_size": 5000000,
            },
        )

        assert response.status_code == 401

    def test_list_criteria(self, client, match_user, db_session):
        """Test listing all criteria for current user."""
        from app.api.dependencies.auth import get_current_user
        from app.main import app

        # Create test criteria
        criteria1 = DealMatchCriteria(
            user_id=match_user.id,
            organization_id=match_user.organization_id,
            name="Criteria 1",
            deal_type="buy_side",
            industries=["tech"],
            min_deal_size=Decimal("1000000"),
            max_deal_size=Decimal("5000000"),
        )
        criteria2 = DealMatchCriteria(
            user_id=match_user.id,
            organization_id=match_user.organization_id,
            name="Criteria 2",
            deal_type="sell_side",
            industries=["healthcare"],
            min_deal_size=Decimal("500000"),
            max_deal_size=Decimal("2000000"),
        )
        db_session.add(criteria1)
        db_session.add(criteria2)
        db_session.commit()

        app.dependency_overrides[get_current_user] = lambda: match_user

        response = client.get(
            "/api/match-criteria",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
        assert any(c["name"] == "Criteria 1" for c in data)
        assert any(c["name"] == "Criteria 2" for c in data)

        app.dependency_overrides.clear()


class TestDealMatchingAPI:
    """Test suite for deal matching operations endpoints."""

    def test_find_matches_for_deal(
        self, client, match_user, match_deal, create_deal_for_org, match_org, db_session
    ):
        """Test finding matches for a specific deal."""
        from app.api.dependencies.auth import get_current_user, require_feature
        from app.main import app

        # Create candidate deals
        candidate1, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Candidate 1",
            target_company="SaaS Corp",
            stage="sourcing",
        )
        candidate2, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Candidate 2",
            target_company="FinTech Inc",
            stage="evaluation",
        )

        app.dependency_overrides[get_current_user] = lambda: match_user
        app.dependency_overrides[require_feature] = lambda feature: lambda: match_user

        response = client.post(
            f"/api/deals/{match_deal.id}/find-matches",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
            json={
                "criteria": {
                    "deal_type": "buy_side",
                    "industries": ["saas", "fintech"],
                    "min_deal_size": 1000000,
                    "max_deal_size": 10000000,
                },
                "min_score": 40.0,
                "limit": 5,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "matches" in data
        assert "total_count" in data
        assert isinstance(data["matches"], list)

        app.dependency_overrides.clear()

    def test_find_matches_requires_auth(self, client, match_deal):
        """Test finding matches requires authentication."""
        response = client.post(
            f"/api/deals/{match_deal.id}/find-matches",
            json={
                "criteria": {
                    "deal_type": "buy_side",
                    "industries": ["saas"],
                    "min_deal_size": 1000000,
                    "max_deal_size": 5000000,
                }
            },
        )

        assert response.status_code == 401

    def test_list_matches_for_deal(
        self, client, match_user, match_deal, create_deal_for_org, match_org, db_session
    ):
        """Test listing all matches for a specific deal."""
        from app.api.dependencies.auth import get_current_user
        from app.main import app

        # Create test matches
        matched_deal1, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Match 1",
            target_company="Corp 1",
            stage="sourcing",
        )
        matched_deal2, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Match 2",
            target_company="Corp 2",
            stage="evaluation",
        )

        match1 = DealMatch(
            deal_id=match_deal.id,
            matched_deal_id=matched_deal1.id,
            organization_id=match_deal.organization_id,
            match_score=Decimal("85.5"),
            confidence="high",
            explanation={},
            status="pending",
        )
        match2 = DealMatch(
            deal_id=match_deal.id,
            matched_deal_id=matched_deal2.id,
            organization_id=match_deal.organization_id,
            match_score=Decimal("72.3"),
            confidence="medium",
            explanation={},
            status="pending",
        )
        db_session.add(match1)
        db_session.add(match2)
        db_session.commit()

        app.dependency_overrides[get_current_user] = lambda: match_user

        response = client.get(
            f"/api/deals/{match_deal.id}/matches",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
        assert any(float(m["match_score"]) == 85.5 for m in data)
        assert any(float(m["match_score"]) == 72.3 for m in data)

        app.dependency_overrides.clear()

    def test_list_matches_requires_auth(self, client, match_deal):
        """Test listing matches requires authentication."""
        response = client.get(f"/api/deals/{match_deal.id}/matches")

        assert response.status_code == 401

    def test_list_matches_deal_not_found(self, client, match_user):
        """Test listing matches for non-existent deal."""
        from app.api.dependencies.auth import get_current_user
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: match_user

        response = client.get(
            "/api/deals/nonexistent-deal-id/matches",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
        )

        assert response.status_code == 404

        app.dependency_overrides.clear()

    def test_find_matches_deal_not_found(self, client, match_user):
        """Test finding matches for non-existent deal."""
        from app.api.dependencies.auth import get_current_user, require_feature
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: match_user
        app.dependency_overrides[require_feature] = lambda feature: lambda: match_user

        response = client.post(
            "/api/deals/nonexistent-deal-id/find-matches",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
            json={
                "criteria": {
                    "deal_type": "buy_side",
                    "industries": ["saas"],
                    "min_deal_size": 1000000,
                    "max_deal_size": 5000000,
                }
            },
        )

        assert response.status_code == 404

        app.dependency_overrides.clear()


class TestDealMatchingIntegration:
    """Integration tests for end-to-end matching workflow."""

    def test_create_criteria_and_find_matches_workflow(
        self, client, match_user, match_deal, create_deal_for_org, match_org
    ):
        """Test complete workflow: create criteria, find matches, verify results."""
        from app.api.dependencies.auth import get_current_user, require_feature
        from app.main import app

        app.dependency_overrides[get_current_user] = lambda: match_user
        app.dependency_overrides[require_feature] = lambda feature: lambda: match_user

        # Step 1: Create matching criteria
        create_response = client.post(
            "/api/match-criteria",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
            json={
                "name": "Integration Test Criteria",
                "deal_type": "buy_side",
                "industries": ["saas"],
                "min_deal_size": 1000000,
                "max_deal_size": 10000000,
            },
        )

        assert create_response.status_code == 201
        criteria_id = create_response.json()["id"]

        # Step 2: Create candidate deals
        candidate, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Candidate SaaS Deal",
            target_company="Integration Test Corp",
            stage="sourcing",
        )

        # Step 3: Find matches
        match_response = client.post(
            f"/api/deals/{match_deal.id}/find-matches",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
            json={
                "criteria": {
                    "deal_type": "buy_side",
                    "industries": ["saas"],
                    "min_deal_size": 1000000,
                    "max_deal_size": 10000000,
                },
                "limit": 10,
            },
        )

        assert match_response.status_code == 200
        match_data = match_response.json()
        assert "matches" in match_data
        assert "total_count" in match_data

        # Step 4: List created criteria
        list_response = client.get(
            "/api/match-criteria",
            headers={"Authorization": f"Bearer mock_token_{match_user.id}"},
        )

        assert list_response.status_code == 200
        criteria_list = list_response.json()
        assert any(c["id"] == criteria_id for c in criteria_list)

        app.dependency_overrides.clear()
