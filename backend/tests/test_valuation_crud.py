"""TDD tests for valuation service CRUD operations (RED phase).

These tests drive the implementation of valuation service functions.
Following TDD: Write tests first (RED), implement to pass (GREEN), refactor.
"""

import uuid
from decimal import Decimal

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.valuation import (
    ValuationModel,
    ComparableCompany,
    PrecedentTransaction,
)
from app.services import valuation_service


@pytest.fixture
def sample_valuation_data():
    """Sample DCF valuation data for testing."""
    return {
        "deal_id": str(uuid.uuid4()),
        "organization_id": str(uuid.uuid4()),
        "created_by": str(uuid.uuid4()),
        "forecast_years": 5,
        "discount_rate": 0.12,
        "terminal_growth_rate": 0.03,
        "terminal_method": "gordon_growth",
        "cash_flows": [500000, 650000, 800000, 950000, 1100000],
        "terminal_cash_flow": 1200000,
        "net_debt": 2000000,
        "shares_outstanding": 1000000,
    }


@pytest.fixture
def sample_comparable_data():
    """Sample comparable company data for testing."""
    return {
        "company_name": "Acme Corp",
        "ticker": "ACME",
        "industry": "Technology",
        "country": "USA",
        "revenue": 10000000,
        "ebitda": 2500000,
        "enterprise_value": 20000000,
        "ev_revenue_multiple": 2.0,
        "ev_ebitda_multiple": 8.0,
        "weight": 1.0,
    }


@pytest.fixture
def sample_precedent_data():
    """Sample precedent transaction data for testing."""
    return {
        "target_company": "Target Inc",
        "acquirer_company": "Buyer Corp",
        "deal_value": 15000000,
        "target_revenue": 8000000,
        "target_ebitda": 2000000,
        "ev_revenue_multiple": 1.875,
        "ev_ebitda_multiple": 7.5,
        "industry": "Manufacturing",
        "deal_type": "strategic",
        "weight": 1.0,
    }


class TestValuationCreation:
    """Tests for creating DCF valuations."""

    @pytest.mark.asyncio
    async def test_create_valuation_calculates_enterprise_value(
        self, db_session: AsyncSession, sample_valuation_data
    ):
        """Test that creating a valuation calculates enterprise value."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        assert valuation is not None
        assert valuation.id is not None
        assert valuation.enterprise_value is not None
        assert valuation.enterprise_value > 0
        # Expected EV ~10.5M based on DCF calculation
        assert 10_000_000 < valuation.enterprise_value < 11_000_000

    @pytest.mark.asyncio
    async def test_create_valuation_calculates_equity_value(
        self, db_session: AsyncSession, sample_valuation_data
    ):
        """Test that equity value is calculated (EV - net debt)."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        assert valuation.equity_value is not None
        expected_equity = valuation.enterprise_value - sample_valuation_data["net_debt"]
        assert abs(valuation.equity_value - expected_equity) < 1  # Within $1

    @pytest.mark.asyncio
    async def test_create_valuation_calculates_share_price(
        self, db_session: AsyncSession, sample_valuation_data
    ):
        """Test that share price is calculated (equity value / shares)."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        assert valuation.implied_share_price is not None
        expected_price = valuation.equity_value / sample_valuation_data["shares_outstanding"]
        assert abs(valuation.implied_share_price - expected_price) < 0.01

    @pytest.mark.asyncio
    async def test_create_valuation_with_exit_multiple_method(
        self, db_session: AsyncSession, sample_valuation_data
    ):
        """Test valuation with exit multiple terminal value method."""
        sample_valuation_data["terminal_method"] = "exit_multiple"
        sample_valuation_data["terminal_ebitda_multiple"] = 8.5
        sample_valuation_data["terminal_growth_rate"] = None

        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        assert valuation.enterprise_value is not None
        assert valuation.terminal_method == "exit_multiple"


class TestValuationRetrieval:
    """Tests for retrieving valuations."""

    @pytest.mark.asyncio
    async def test_get_valuation_by_id(
        self, db_session: AsyncSession, sample_valuation_data
    ):
        """Test retrieving a valuation by ID."""
        created = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        retrieved = await valuation_service.get_valuation(
            db=db_session,
            valuation_id=created.id,
            organization_id=created.organization_id
        )

        assert retrieved is not None
        assert retrieved.id == created.id
        assert retrieved.discount_rate == created.discount_rate

    @pytest.mark.asyncio
    async def test_get_valuation_wrong_organization_returns_none(
        self, db_session: AsyncSession, sample_valuation_data
    ):
        """Test that getting valuation with wrong org returns None."""
        created = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        retrieved = await valuation_service.get_valuation(
            db=db_session,
            valuation_id=created.id,
            organization_id=str(uuid.uuid4())  # Different org
        )

        assert retrieved is None


class TestValuationUpdate:
    """Tests for updating valuations."""

    @pytest.mark.asyncio
    async def test_update_valuation_recalculates_enterprise_value(
        self, db_session: AsyncSession, sample_valuation_data
    ):
        """Test that updating assumptions recalculates EV."""
        created = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )
        original_ev = created.enterprise_value

        # Update discount rate
        updated = await valuation_service.update_valuation(
            db=db_session,
            valuation_id=created.id,
            organization_id=created.organization_id,
            discount_rate=0.15  # Higher discount rate
        )

        assert updated.enterprise_value != original_ev
        assert updated.enterprise_value < original_ev  # Higher rate = lower value


class TestComparableCompanyOperations:
    """Tests for comparable company operations."""

    @pytest.mark.asyncio
    async def test_add_comparable_to_valuation(
        self, db_session: AsyncSession, sample_valuation_data, sample_comparable_data
    ):
        """Test adding a comparable company to a valuation."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        comparable = await valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            **sample_comparable_data
        )

        assert comparable is not None
        assert comparable.valuation_id == valuation.id
        assert comparable.company_name == sample_comparable_data["company_name"]

    @pytest.mark.asyncio
    async def test_calculate_comparable_multiples(
        self, db_session: AsyncSession, sample_valuation_data, sample_comparable_data
    ):
        """Test calculating multiples from comparables."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        # Add 3 comparables with different multiples
        await valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp 1",
            ev_ebitda_multiple=8.0,
            weight=1.0,
        )
        await valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp 2",
            ev_ebitda_multiple=10.0,
            weight=1.0,
        )
        await valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            company_name="Comp 3",
            ev_ebitda_multiple=9.0,
            weight=1.0,
        )

        multiples = await valuation_service.calculate_comparable_multiples(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id
        )

        assert multiples is not None
        assert "ev_ebitda" in multiples
        assert multiples["ev_ebitda"]["min"] == 8.0
        assert multiples["ev_ebitda"]["max"] == 10.0
        assert multiples["ev_ebitda"]["median"] == 9.0


class TestPrecedentTransactionOperations:
    """Tests for precedent transaction operations."""

    @pytest.mark.asyncio
    async def test_add_precedent_transaction(
        self, db_session: AsyncSession, sample_valuation_data, sample_precedent_data
    ):
        """Test adding a precedent transaction to a valuation."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        precedent = await valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            **sample_precedent_data
        )

        assert precedent is not None
        assert precedent.valuation_id == valuation.id
        assert precedent.target_company == sample_precedent_data["target_company"]

    @pytest.mark.asyncio
    async def test_calculate_precedent_multiples(
        self, db_session: AsyncSession, sample_valuation_data, sample_precedent_data
    ):
        """Test calculating multiples from precedent transactions."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        # Add 2 precedent transactions
        await valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            target_company="Target 1",
            acquirer_company="Buyer 1",
            ev_ebitda_multiple=7.5,
            weight=1.0,
        )
        await valuation_service.add_precedent_transaction(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            target_company="Target 2",
            acquirer_company="Buyer 2",
            ev_ebitda_multiple=8.5,
            weight=1.0,
        )

        multiples = await valuation_service.calculate_precedent_multiples(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id
        )

        assert multiples is not None
        assert "ev_ebitda" in multiples
        assert multiples["ev_ebitda"]["min"] == 7.5
        assert multiples["ev_ebitda"]["max"] == 8.5


class TestValuationDeletion:
    """Tests for deleting valuations."""

    @pytest.mark.asyncio
    async def test_delete_valuation_cascades_to_comparables(
        self, db_session: AsyncSession, sample_valuation_data, sample_comparable_data
    ):
        """Test that deleting valuation cascades to comparables."""
        valuation = await valuation_service.create_valuation(
            db=db_session,
            **sample_valuation_data
        )

        comparable = await valuation_service.add_comparable(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id,
            **sample_comparable_data
        )

        # Delete valuation
        deleted = await valuation_service.delete_valuation(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id
        )

        assert deleted is True

        # Verify valuation is gone
        retrieved_val = await valuation_service.get_valuation(
            db=db_session,
            valuation_id=valuation.id,
            organization_id=valuation.organization_id
        )
        assert retrieved_val is None

        # Verify comparable is also gone (cascade delete)
        result = await db_session.get(ComparableCompany, comparable.id)
        assert result is None
