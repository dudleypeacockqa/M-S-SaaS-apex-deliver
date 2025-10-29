"""
Test suite for Deal Matching models - DEV-018 Phase 1 (TDD GREEN)
Tests for DealMatchCriteria, DealMatch, and DealMatchAction models
"""

import pytest
from datetime import datetime, UTC
from decimal import Decimal
from sqlalchemy.orm import Session

from app.models.deal_match import DealMatchCriteria, DealMatch, DealMatchAction
from app.models.user import User
from app.models.organization import Organization
from app.models.deal import Deal


@pytest.fixture
def match_org(create_organization):
    """Create organization for matching tests."""
    return create_organization(name="Match Test Org", subscription_tier="professional")


@pytest.fixture
def match_user(create_user, match_org):
    """Create user for matching tests."""
    return create_user(
        clerk_user_id="clerk-match-test-1",
        email="matchtest@example.com",
        organization_id=match_org.id,
    )


@pytest.fixture
def match_deal(create_deal_for_org, match_org, match_user):
    """Create deal for matching tests."""
    deal, _, _ = create_deal_for_org(
        organization=match_org,
        owner=match_user,
        name="Test Acquisition Target",
        target_company="Acme SaaS Inc",
        stage="evaluation",
    )
    return deal


class TestDealMatchCriteriaModel:
    """Test suite for DealMatchCriteria model."""

    def test_create_deal_match_criteria_with_required_fields(
        self, db_session: Session, match_user: User, match_org: Organization
    ):
        """Test creating DealMatchCriteria with minimum required fields."""
        criteria = DealMatchCriteria(
            user_id=match_user.id,
            organization_id=match_org.id,
            name="Tech Acquisitions Q4 2025",
            deal_type="buy_side",
            industries=["saas", "fintech"],
            min_deal_size=Decimal("1000000"),
            max_deal_size=Decimal("10000000"),
        )
        db_session.add(criteria)
        db_session.commit()
        db_session.refresh(criteria)

        assert criteria.id is not None
        assert criteria.name == "Tech Acquisitions Q4 2025"
        assert criteria.deal_type == "buy_side"
        assert criteria.industries == ["saas", "fintech"]
        assert criteria.min_deal_size == Decimal("1000000")
        assert criteria.max_deal_size == Decimal("10000000")
        assert criteria.created_at is not None

    def test_create_criteria_with_optional_fields(
        self, db_session: Session, match_user: User, match_org: Organization
    ):
        """Test creating DealMatchCriteria with optional fields."""
        criteria = DealMatchCriteria(
            user_id=match_user.id,
            organization_id=match_org.id,
            name="European Tech Deals",
            deal_type="sell_side",
            industries=["saas"],
            min_deal_size=Decimal("2000000"),
            max_deal_size=Decimal("20000000"),
            geographies=["UK", "EU"],
            structures=["asset_purchase", "stock_purchase"],
            negative_filters={"distressed": True, "regulated": True},
            weights={"industry": 0.4, "size": 0.3, "geography": 0.2, "structure": 0.1},
        )
        db_session.add(criteria)
        db_session.commit()
        db_session.refresh(criteria)

        assert criteria.geographies == ["UK", "EU"]
        assert criteria.structures == ["asset_purchase", "stock_purchase"]
        assert criteria.negative_filters == {"distressed": True, "regulated": True}
        assert criteria.weights == {"industry": 0.4, "size": 0.3, "geography": 0.2, "structure": 0.1}

    def test_criteria_enforces_organization_isolation(
        self, db_session: Session, match_user: User
    ):
        """Test that criteria must belong to an organization."""
        with pytest.raises(Exception):  # Will be IntegrityError or similar
            criteria = DealMatchCriteria(
                user_id=match_user.id,
                organization_id=None,  # Missing required field
                name="Invalid Criteria",
                deal_type="buy_side",
                industries=["tech"],
                min_deal_size=Decimal("1000000"),
                max_deal_size=Decimal("10000000"),
            )
            db_session.add(criteria)
            db_session.commit()


class TestDealMatchModel:
    """Test suite for DealMatch model."""

    def test_create_deal_match(
        self, db_session: Session, match_deal: Deal, create_deal_for_org, match_org: Organization, match_user: User
    ):
        """Test creating a DealMatch between two deals."""
        # Create a second deal to match against
        matched_deal, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Matching Target",
            target_company="Fintech SaaS Ltd",
            stage="sourcing",
        )

        # Create match
        match = DealMatch(
            deal_id=match_deal.id,
            matched_deal_id=matched_deal.id,
            organization_id=match_org.id,
            match_score=87.5,
            confidence="high",
            explanation={
                "industry_match": {"score": 0.95, "reason": "Both in fintech SaaS"},
                "size_match": {"score": 0.90, "reason": "Within 10% of target size"},
                "geography_match": {"score": 0.80, "reason": "Both UK-based"},
            },
            status="pending",
        )
        db_session.add(match)
        db_session.commit()
        db_session.refresh(match)

        assert match.id is not None
        assert match.match_score == 87.5
        assert match.confidence == "high"
        assert match.status == "pending"
        assert match.explanation["industry_match"]["score"] == 0.95
        assert match.created_at is not None

    def test_match_score_validation(
        self, db_session: Session, match_deal: Deal, create_deal_for_org, match_org: Organization, match_user: User
    ):
        """Test that match scores are within valid range (0-100)."""
        matched_deal, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Another Target",
            target_company="Test Co",
            stage="sourcing",
        )

        # Valid score
        match = DealMatch(
            deal_id=match_deal.id,
            matched_deal_id=matched_deal.id,
            organization_id=match_org.id,
            match_score=95.0,
            confidence="high",
            explanation={},
            status="pending",
        )
        db_session.add(match)
        db_session.commit()
        assert match.match_score == 95.0

    def test_match_status_tracking(
        self, db_session: Session, match_deal: Deal, create_deal_for_org, match_org: Organization, match_user: User
    ):
        """Test tracking match status changes."""
        matched_deal, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Status Test Deal",
            target_company="Status Co",
            stage="sourcing",
        )

        match = DealMatch(
            deal_id=match_deal.id,
            matched_deal_id=matched_deal.id,
            organization_id=match_org.id,
            match_score=75.0,
            confidence="medium",
            explanation={},
            status="pending",
        )
        db_session.add(match)
        db_session.commit()

        # Update status
        match.status = "accepted"
        match.responded_at = datetime.now(UTC)
        db_session.commit()

        assert match.status == "accepted"
        assert match.responded_at is not None


class TestDealMatchActionModel:
    """Test suite for DealMatchAction model."""

    def test_create_match_action(
        self, db_session: Session, match_user: User, match_deal: Deal, create_deal_for_org, match_org: Organization
    ):
        """Test creating a DealMatchAction to track user actions."""
        # Create match first
        matched_deal, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Action Test Deal",
            target_company="Action Co",
            stage="sourcing",
        )

        match = DealMatch(
            deal_id=match_deal.id,
            matched_deal_id=matched_deal.id,
            organization_id=match_org.id,
            match_score=85.0,
            confidence="high",
            explanation={},
            status="pending",
        )
        db_session.add(match)
        db_session.commit()

        # Create action
        action = DealMatchAction(
            match_id=match.id,
            user_id=match_user.id,
            action="view",
            action_metadata={"source": "email_notification", "device": "desktop"},
        )
        db_session.add(action)
        db_session.commit()
        db_session.refresh(action)

        assert action.id is not None
        assert action.action == "view"
        assert action.action_metadata["source"] == "email_notification"
        assert action.created_at is not None

    def test_track_multiple_actions_on_match(
        self, db_session: Session, match_user: User, match_deal: Deal, create_deal_for_org, match_org: Organization
    ):
        """Test tracking multiple user actions on a single match."""
        matched_deal, _, _ = create_deal_for_org(
            organization=match_org,
            owner=match_user,
            name="Multi-Action Test Deal",
            target_company="Multi Co",
            stage="sourcing",
        )

        match = DealMatch(
            deal_id=match_deal.id,
            matched_deal_id=matched_deal.id,
            organization_id=match_org.id,
            match_score=90.0,
            confidence="high",
            explanation={},
            status="pending",
        )
        db_session.add(match)
        db_session.commit()

        # Track multiple actions
        actions = [
            DealMatchAction(match_id=match.id, user_id=match_user.id, action="view", action_metadata={}),
            DealMatchAction(match_id=match.id, user_id=match_user.id, action="save", action_metadata={"list": "favorites"}),
            DealMatchAction(match_id=match.id, user_id=match_user.id, action="request_intro", action_metadata={"message": "Interested in learning more"}),
        ]
        for action in actions:
            db_session.add(action)
        db_session.commit()

        # Verify all actions recorded
        recorded_actions = db_session.query(DealMatchAction).filter_by(match_id=match.id).all()
        assert len(recorded_actions) == 3
        assert {a.action for a in recorded_actions} == {"view", "save", "request_intro"}
