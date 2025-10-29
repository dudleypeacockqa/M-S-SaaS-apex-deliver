"""
Test suite for Deal Matching Service - DEV-018 Phase 2 (TDD RED)
Tests for intelligent deal matching algorithm with OpenAI embeddings
"""

import pytest
from decimal import Decimal
from unittest.mock import Mock, patch, AsyncMock
from sqlalchemy.orm import Session

from app.services.deal_matching_service import DealMatchingService, MatchResult
from app.models.deal import Deal
from app.models.deal_match import DealMatchCriteria
from app.models.organization import Organization
from app.models.user import User


@pytest.fixture
def matching_service():
    """Create DealMatchingService instance."""
    return DealMatchingService()


@pytest.fixture
def sample_criteria(match_org: Organization, match_user: User) -> DealMatchCriteria:
    """Create sample matching criteria."""
    return DealMatchCriteria(
        id="criteria-test-1",
        user_id=match_user.id,
        organization_id=match_org.id,
        name="Tech Acquisitions",
        deal_type="buy_side",
        industries=["saas", "fintech"],
        min_deal_size=Decimal("1000000"),
        max_deal_size=Decimal("10000000"),
        geographies=["UK", "EU"],
        weights={
            "industry": 0.4,
            "size": 0.3,
            "geography": 0.2,
            "description": 0.1,
        },
    )


@pytest.fixture
def target_deal(match_org: Organization) -> Deal:
    """Create target deal for matching."""
    return Deal(
        id="deal-target-1",
        organization_id=match_org.id,
        name="SaaS Acquisition",
        target_company="CloudTech Ltd",
        description="B2B SaaS platform in fintech sector with 500 customers",
        industry="saas",
        deal_size=Decimal("5000000"),
        currency="GBP",
        stage="sourcing",
    )


@pytest.fixture
def candidate_deals(match_org: Organization) -> list[Deal]:
    """Create candidate deals for matching."""
    return [
        Deal(
            id="deal-candidate-1",
            organization_id=match_org.id,
            name="Perfect Match",
            target_company="FinSaaS Inc",
            description="Fintech SaaS platform with strong growth in UK market",
            industry="fintech",
            deal_size=Decimal("4500000"),
            currency="GBP",
            stage="evaluation",
        ),
        Deal(
            id="deal-candidate-2",
            organization_id=match_org.id,
            name="Good Match",
            target_company="TechServe Ltd",
            description="Enterprise software company in UK",
            industry="saas",
            deal_size=Decimal("8000000"),
            currency="GBP",
            stage="sourcing",
        ),
        Deal(
            id="deal-candidate-3",
            organization_id=match_org.id,
            name="Poor Match",
            target_company="Hardware Co",
            description="Hardware manufacturing company in Asia",
            industry="manufacturing",
            deal_size=Decimal("20000000"),
            currency="USD",
            stage="sourcing",
        ),
    ]


class TestDealMatchingService:
    """Test suite for DealMatchingService."""

    @pytest.mark.asyncio
    async def test_calculate_industry_match_exact(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test industry matching with exact match."""
        score = matching_service._calculate_industry_match(
            deal_industry="saas",
            criteria_industries=["saas", "fintech"],
        )
        assert score == 1.0  # Perfect match

    @pytest.mark.asyncio
    async def test_calculate_industry_match_partial(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test industry matching with related industry."""
        score = matching_service._calculate_industry_match(
            deal_industry="technology",
            criteria_industries=["saas", "fintech"],
        )
        assert 0.0 < score < 1.0  # Partial match

    @pytest.mark.asyncio
    async def test_calculate_industry_match_none(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test industry matching with no match."""
        score = matching_service._calculate_industry_match(
            deal_industry="manufacturing",
            criteria_industries=["saas", "fintech"],
        )
        assert score == 0.0  # No match

    @pytest.mark.asyncio
    async def test_calculate_size_match_within_range(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test size matching within criteria range."""
        score = matching_service._calculate_size_match(
            deal_size=Decimal("5000000"),
            min_size=Decimal("1000000"),
            max_size=Decimal("10000000"),
        )
        assert score >= 0.9  # High score for center of range

    @pytest.mark.asyncio
    async def test_calculate_size_match_outside_range(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test size matching outside criteria range."""
        score = matching_service._calculate_size_match(
            deal_size=Decimal("20000000"),
            min_size=Decimal("1000000"),
            max_size=Decimal("10000000"),
        )
        assert score < 0.5  # Low score for outside range

    @pytest.mark.asyncio
    async def test_calculate_geography_match_exact(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test geography matching with exact match."""
        score = matching_service._calculate_geography_match(
            deal_geography="UK",
            criteria_geographies=["UK", "EU"],
        )
        assert score == 1.0  # Perfect match

    @pytest.mark.asyncio
    async def test_calculate_geography_match_none(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test geography matching with no match."""
        score = matching_service._calculate_geography_match(
            deal_geography="US",
            criteria_geographies=["UK", "EU"],
        )
        assert score == 0.0  # No match

    @pytest.mark.asyncio
    @patch("app.services.deal_matching_service.openai.Embedding.create")
    async def test_calculate_semantic_similarity(
        self, mock_embedding, matching_service: DealMatchingService
    ):
        """Test semantic similarity using OpenAI embeddings."""
        # Mock OpenAI embedding response
        mock_embedding.return_value = {
            "data": [
                {"embedding": [0.1, 0.2, 0.3]},  # Deal description embedding
                {"embedding": [0.15, 0.25, 0.35]},  # Criteria description embedding
            ]
        }

        score = await matching_service._calculate_semantic_similarity(
            text1="Fintech SaaS platform",
            text2="Financial technology software",
        )

        assert 0.0 <= score <= 1.0
        assert score > 0.8  # High similarity expected
        mock_embedding.assert_called_once()

    @pytest.mark.asyncio
    async def test_calculate_weighted_score(
        self, matching_service: DealMatchingService, sample_criteria: DealMatchCriteria
    ):
        """Test weighted score calculation."""
        component_scores = {
            "industry": 0.9,
            "size": 0.8,
            "geography": 1.0,
            "description": 0.7,
        }

        total_score = matching_service._calculate_weighted_score(
            component_scores=component_scores,
            weights=sample_criteria.weights,
        )

        # Weighted: 0.9*0.4 + 0.8*0.3 + 1.0*0.2 + 0.7*0.1 = 0.87
        assert 0.85 <= total_score <= 0.90

    @pytest.mark.asyncio
    async def test_determine_confidence_level_high(
        self, matching_service: DealMatchingService
    ):
        """Test confidence level determination for high scores."""
        confidence = matching_service._determine_confidence_level(score=85.0)
        assert confidence == "high"

    @pytest.mark.asyncio
    async def test_determine_confidence_level_medium(
        self, matching_service: DealMatchingService
    ):
        """Test confidence level determination for medium scores."""
        confidence = matching_service._determine_confidence_level(score=70.0)
        assert confidence == "medium"

    @pytest.mark.asyncio
    async def test_determine_confidence_level_low(
        self, matching_service: DealMatchingService
    ):
        """Test confidence level determination for low scores."""
        confidence = matching_service._determine_confidence_level(score=50.0)
        assert confidence == "low"

    @pytest.mark.asyncio
    @patch("app.services.deal_matching_service.openai.Embedding.create")
    async def test_find_matches_returns_ranked_results(
        self,
        mock_embedding,
        matching_service: DealMatchingService,
        db_session: Session,
        sample_criteria: DealMatchCriteria,
        target_deal: Deal,
        candidate_deals: list[Deal],
    ):
        """Test finding matches returns ranked results."""
        # Mock OpenAI embeddings
        mock_embedding.return_value = {
            "data": [{"embedding": [0.1 + i*0.05 for i in range(1536)]} for _ in range(4)]
        }

        # Add deals to database
        db_session.add(target_deal)
        for deal in candidate_deals:
            db_session.add(deal)
        db_session.commit()

        # Find matches
        matches = await matching_service.find_matches(
            criteria=sample_criteria,
            target_deal=target_deal,
            candidate_deals=candidate_deals,
            top_n=3,
        )

        # Verify results
        assert len(matches) <= 3
        assert all(isinstance(m, MatchResult) for m in matches)
        assert matches[0].score >= matches[1].score >= matches[2].score  # Ranked

    @pytest.mark.asyncio
    @patch("app.services.deal_matching_service.openai.Embedding.create")
    async def test_find_matches_filters_low_scores(
        self,
        mock_embedding,
        matching_service: DealMatchingService,
        db_session: Session,
        sample_criteria: DealMatchCriteria,
        target_deal: Deal,
        candidate_deals: list[Deal],
    ):
        """Test finding matches filters out low-scoring deals."""
        # Mock OpenAI embeddings
        mock_embedding.return_value = {
            "data": [{"embedding": [0.1 + i*0.05 for i in range(1536)]} for _ in range(4)]
        }

        # Add deals to database
        db_session.add(target_deal)
        for deal in candidate_deals:
            db_session.add(deal)
        db_session.commit()

        # Find matches with high threshold
        matches = await matching_service.find_matches(
            criteria=sample_criteria,
            target_deal=target_deal,
            candidate_deals=candidate_deals,
            min_score=70.0,  # High threshold
        )

        # Verify low scores filtered out
        assert all(m.score >= 70.0 for m in matches)

    @pytest.mark.asyncio
    @patch("app.services.deal_matching_service.openai.Embedding.create")
    async def test_match_result_contains_explanation(
        self,
        mock_embedding,
        matching_service: DealMatchingService,
        db_session: Session,
        sample_criteria: DealMatchCriteria,
        target_deal: Deal,
        candidate_deals: list[Deal],
    ):
        """Test match results contain detailed explanations."""
        # Mock OpenAI embeddings
        mock_embedding.return_value = {
            "data": [{"embedding": [0.1 + i*0.05 for i in range(1536)]} for _ in range(4)]
        }

        # Add deals to database
        db_session.add(target_deal)
        for deal in candidate_deals:
            db_session.add(deal)
        db_session.commit()

        # Find matches
        matches = await matching_service.find_matches(
            criteria=sample_criteria,
            target_deal=target_deal,
            candidate_deals=candidate_deals,
        )

        # Verify explanation structure
        for match in matches:
            assert "industry_match" in match.explanation
            assert "size_match" in match.explanation
            assert "geography_match" in match.explanation
            assert "description_match" in match.explanation

            # Each component should have score and reason
            for component in match.explanation.values():
                assert "score" in component
                assert "reason" in component
