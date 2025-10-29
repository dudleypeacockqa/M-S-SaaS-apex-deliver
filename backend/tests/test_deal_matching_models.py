"""
Test suite for Deal Matching models - DEV-018 Phase 1 (RED)
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
def test_user(db_session: Session) -> User:
    """Create a test user."""
    user = User(
        id="user-test-match-1",
        email="matchtest@example.com",
        organization_id="org-test-match-1",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_organization(db_session: Session) -> Organization:
    """Create a test organization."""
    org = Organization(
        id="org-test-match-1",
        name="Match Test Org",
        slug="match-test-org",
        subscription_tier="professional",
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


@pytest.fixture
def test_deal(db_session: Session, test_organization: Organization) -> Deal:
    """Create a test deal."""
    deal = Deal(
        id="deal-test-match-1",
        organization_id=test_organization.id,
        name="Test Acquisition Target",
            target_company="Matched Target",
        stage="evaluation",
        description="SaaS company in fintech sector",
        deal_size=Decimal("5000000"),
        currency="GBP",
    )
    db_session.add(deal)
    db_session.commit()
    db_session.refresh(deal)
    return deal


class TestDealMatchCriteriaModel:
    """Test suite for DealMatchCriteria model."""

    def test_create_deal_match_criteria_with_required_fields(
        self, db_session: Session, test_user: User, test_organization: Organization
    ):
        """Test creating DealMatchCriteria with minimum required fields."""
        criteria = DealMatchCriteria(
            user_id=test_user.id,
            organization_id=test_organization.id,
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
        self, db_session: Session, test_user: User, test_organization: Organization
    ):
        """Test creating DealMatchCriteria with optional fields."""
        criteria = DealMatchCriteria(
            user_id=test_user.id,
            organization_id=test_organization.id,
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
        self, db_session: Session, test_user: User
    ):
        """Test that criteria must belong to an organization."""
        with pytest.raises(Exception):  # Will be IntegrityError or similar
            criteria = DealMatchCriteria(
                user_id=test_user.id,
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
        self, db_session: Session, test_deal: Deal, test_organization: Organization
    ):
        """Test creating a DealMatch between two deals."""
        # Create a second deal to match against
        matched_deal = Deal(
            id="deal-test-match-2",
            organization_id=test_organization.id,
            name="Matching Target",
            target_company="Matched Target",
            stage="sourcing",
            description="Fintech SaaS platform",
            deal_size=Decimal("4500000"),
            currency="GBP",
        )
        db_session.add(matched_deal)
        db_session.commit()

        # Create match
        match = DealMatch(
            deal_id=test_deal.id,
            matched_deal_id=matched_deal.id,
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
        self, db_session: Session, test_deal: Deal, test_organization: Organization
    ):
        """Test that match scores are within valid range (0-100)."""
        matched_deal = Deal(
            id="deal-test-match-3",
            organization_id=test_organization.id,
            name="Another Target",
            target_company="Matched Target",
            stage="sourcing",
        )
        db_session.add(matched_deal)
        db_session.commit()

        # Valid score
        match = DealMatch(
            deal_id=test_deal.id,
            matched_deal_id=matched_deal.id,
            match_score=95.0,
            confidence="high",
            explanation={},
            status="pending",
        )
        db_session.add(match)
        db_session.commit()
        assert match.match_score == 95.0

    def test_match_status_tracking(
        self, db_session: Session, test_deal: Deal, test_organization: Organization
    ):
        """Test tracking match status changes."""
        matched_deal = Deal(
            id="deal-test-match-4",
            organization_id=test_organization.id,
            name="Status Test Deal",
            target_company="Matched Target",
            stage="sourcing",
        )
        db_session.add(matched_deal)
        db_session.commit()

        match = DealMatch(
            deal_id=test_deal.id,
            matched_deal_id=matched_deal.id,
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
        self, db_session: Session, test_user: User, test_deal: Deal, test_organization: Organization
    ):
        """Test creating a DealMatchAction to track user actions."""
        # Create match first
        matched_deal = Deal(
            id="deal-test-match-5",
            organization_id=test_organization.id,
            name="Action Test Deal",
            target_company="Matched Target",
            stage="sourcing",
        )
        db_session.add(matched_deal)

        match = DealMatch(
            deal_id=test_deal.id,
            matched_deal_id=matched_deal.id,
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
            user_id=test_user.id,
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
        self, db_session: Session, test_user: User, test_deal: Deal, test_organization: Organization
    ):
        """Test tracking multiple user actions on a single match."""
        matched_deal = Deal(
            id="deal-test-match-6",
            organization_id=test_organization.id,
            name="Multi-Action Test Deal",
            target_company="Matched Target",
            stage="sourcing",
        )
        db_session.add(matched_deal)

        match = DealMatch(
            deal_id=test_deal.id,
            matched_deal_id=matched_deal.id,
            match_score=90.0,
            confidence="high",
            explanation={},
            status="pending",
        )
        db_session.add(match)
        db_session.commit()

        # Track multiple actions
        actions = [
            DealMatchAction(match_id=match.id, user_id=test_user.id, action="view", action_metadata={}),
            DealMatchAction(match_id=match.id, user_id=test_user.id, action="save", action_metadata={"list": "favorites"}),
            DealMatchAction(match_id=match.id, user_id=test_user.id, action="request_intro", action_metadata={"message": "Interested in learning more"}),
        ]
        for action in actions:
            db_session.add(action)
        db_session.commit()

        # Verify all actions recorded
        recorded_actions = db_session.query(DealMatchAction).filter_by(match_id=match.id).all()
        assert len(recorded_actions) == 3
        assert {a.action for a in recorded_actions} == {"view", "save", "request_intro"}
