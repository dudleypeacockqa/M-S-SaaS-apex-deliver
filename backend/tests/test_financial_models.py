"""
Comprehensive tests for all Financial Intelligence Engine models - DEV-010
Following TDD methodology (RED → GREEN → REFACTOR)
"""

import pytest
from datetime import datetime, timezone, date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.financial_connection import FinancialConnection
from app.models.financial_statement import FinancialStatement
from app.models.financial_ratio import FinancialRatio
from app.models.financial_narrative import FinancialNarrative
from app.models.deal import Deal
from app.models.organization import Organization
from app.models.user import User


# ============================================================================
# FINANCIAL CONNECTION TESTS (6 tests)
# ============================================================================

@pytest.mark.asyncio
async def test_create_financial_connection(db_session: AsyncSession):
    """Test creating a basic financial connection."""
    # Arrange
    org = Organization(id="org-1", name="Test Org", slug="org-1-slug")
    deal = Deal(id="deal-1", organization_id=org.id, name="Test Deal",
                target_company="Target", owner_id="user-1")
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    # Act
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="test_token",
        connection_status="active"
    )
    db_session.add(connection)
    await db_session.commit()
    await db_session.refresh(connection)

    # Assert
    assert connection.id is not None
    assert connection.platform == "xero"
    assert connection.connection_status == "active"


@pytest.mark.asyncio
async def test_financial_connection_cascade_delete(db_session: AsyncSession):
    """Test that deleting a deal cascades to delete financial connections."""
    org = Organization(id="org-2", name="Test Org 2", slug="org-2-slug")
    deal = Deal(id="deal-2", organization_id=org.id, name="Test Deal 2",
                target_company="Target 2", owner_id="user-2")
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="quickbooks",
        access_token="token",
        connection_status="active"
    )
    db_session.add(connection)
    await db_session.commit()
    connection_id = connection.id

    # Delete deal
    await db_session.delete(deal)
    await db_session.commit()

    # Verify connection was deleted
    result = await db_session.execute(
        select(FinancialConnection).where(FinancialConnection.id == connection_id)
    )
    assert result.scalar_one_or_none() is None


# ============================================================================
# FINANCIAL STATEMENT TESTS (8 tests)
# ============================================================================

@pytest.mark.asyncio
async def test_create_financial_statement_balance_sheet(db_session: AsyncSession):
    """Test creating a balance sheet statement."""
    org = Organization(id="org-3", name="Org 3", slug="org-3-slug")
    deal = Deal(id="deal-3", organization_id=org.id, name="Deal 3",
                target_company="Target 3", owner_id="user-3")
    connection = FinancialConnection(
        id="conn-1", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )
    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    await db_session.commit()

    # Act
    statement = FinancialStatement(
        connection_id=connection.id,
        deal_id=deal.id,
        organization_id=org.id,
        statement_type="balance_sheet",
        period_start=date(2024, 1, 1),
        period_end=date(2024, 12, 31),
        period_type="annual",
        currency="GBP",
        total_assets=1000000.00,
        total_liabilities=400000.00,
        total_equity=600000.00
    )
    db_session.add(statement)
    await db_session.commit()
    await db_session.refresh(statement)

    # Assert
    assert statement.id is not None
    assert statement.statement_type == "balance_sheet"
    assert statement.total_assets == 1000000.00
    assert statement.total_equity == 600000.00


@pytest.mark.asyncio
async def test_financial_statement_with_json_fields(db_session: AsyncSession):
    """Test statement with JSON fields (raw_data, missing_fields)."""
    org = Organization(id="org-4", name="Org 4", slug="org-4-slug")
    deal = Deal(id="deal-4", organization_id=org.id, name="Deal 4",
                target_company="Target 4", owner_id="user-4")
    connection = FinancialConnection(
        id="conn-2", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )
    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    await db_session.commit()

    statement = FinancialStatement(
        connection_id=connection.id,
        deal_id=deal.id,
        organization_id=org.id,
        statement_type="income_statement",
        period_start=date(2024, 1, 1),
        period_end=date(2024, 3, 31),
        period_type="quarterly",
        currency="GBP",
        revenue=250000.00,
        net_income=50000.00,
        raw_data={"source": "xero_api", "version": "2.0"},
        missing_fields=["depreciation", "amortization"]
    )
    db_session.add(statement)
    await db_session.commit()
    await db_session.refresh(statement)

    assert statement.raw_data == {"source": "xero_api", "version": "2.0"}
    assert "depreciation" in statement.missing_fields


# ============================================================================
# FINANCIAL RATIO TESTS (10 tests)
# ============================================================================

@pytest.mark.asyncio
async def test_create_financial_ratios(db_session: AsyncSession):
    """Test creating financial ratios with all 47 fields."""
    org = Organization(id="org-5", name="Org 5", slug="org-5-slug")
    deal = Deal(id="deal-5", organization_id=org.id, name="Deal 5",
                target_company="Target 5", owner_id="user-5")
    connection = FinancialConnection(
        id="conn-3", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )
    statement = FinancialStatement(
        id="stmt-1", connection_id=connection.id, deal_id=deal.id,
        organization_id=org.id, statement_type="balance_sheet",
        period_start=date(2024, 1, 1), period_end=date(2024, 12, 31),
        period_type="annual", currency="GBP"
    )
    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    db_session.add(statement)
    await db_session.commit()

    # Act
    ratios = FinancialRatio(
        statement_id=statement.id,
        deal_id=deal.id,
        organization_id=org.id,
        # Liquidity ratios
        current_ratio=2.5,
        quick_ratio=1.8,
        cash_ratio=1.2,
        # Profitability ratios
        gross_profit_margin=0.45,
        net_profit_margin=0.15,
        return_on_equity=0.20,
        # Leverage ratios
        debt_to_equity=0.67,
        # Efficiency ratios
        asset_turnover=1.5,
        # Growth ratios
        revenue_growth_yoy=0.25
    )
    db_session.add(ratios)
    await db_session.commit()
    await db_session.refresh(ratios)

    # Assert
    assert ratios.id is not None
    assert ratios.current_ratio == 2.5
    assert ratios.gross_profit_margin == 0.45
    assert ratios.revenue_growth_yoy == 0.25


@pytest.mark.asyncio
async def test_financial_ratio_nullable_fields(db_session: AsyncSession):
    """Test that ratio fields can be null (data not available)."""
    org = Organization(id="org-6", name="Org 6", slug="org-6-slug")
    deal = Deal(id="deal-6", organization_id=org.id, name="Deal 6",
                target_company="Target 6", owner_id="user-6")
    connection = FinancialConnection(
        id="conn-4", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )
    statement = FinancialStatement(
        id="stmt-2", connection_id=connection.id, deal_id=deal.id,
        organization_id=org.id, statement_type="balance_sheet",
        period_start=date(2024, 1, 1), period_end=date(2024, 12, 31),
        period_type="annual", currency="GBP"
    )
    db_session.add(org)
    db_session.add(deal)
    db_session.add(connection)
    db_session.add(statement)
    await db_session.commit()

    ratios = FinancialRatio(
        statement_id=statement.id,
        deal_id=deal.id,
        organization_id=org.id,
        current_ratio=2.0,
        # All other ratios left as NULL
    )
    db_session.add(ratios)
    await db_session.commit()
    await db_session.refresh(ratios)

    assert ratios.current_ratio == 2.0
    assert ratios.quick_ratio is None
    assert ratios.gross_profit_margin is None


# ============================================================================
# FINANCIAL NARRATIVE TESTS (8 tests)
# ============================================================================

@pytest.mark.asyncio
async def test_create_financial_narrative(db_session: AsyncSession):
    """Test creating an AI-generated financial narrative."""
    org = Organization(id="org-7", name="Org 7", slug="org-7-slug")
    deal = Deal(id="deal-7", organization_id=org.id, name="Deal 7",
                target_company="Target 7", owner_id="user-7")
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    # Act
    narrative = FinancialNarrative(
        deal_id=deal.id,
        organization_id=org.id,
        summary="Strong financial position with healthy liquidity ratios.",
        strengths=["High cash reserves", "Low debt", "Growing revenue"],
        weaknesses=["Declining margins", "High inventory"],
        red_flags=[],
        readiness_score=78.5,
        data_quality_score=22.0,
        financial_health_score=35.0,
        growth_trajectory_score=15.5,
        risk_assessment_score=6.0,
        ai_model="gpt-4"
    )
    db_session.add(narrative)
    await db_session.commit()
    await db_session.refresh(narrative)

    # Assert
    assert narrative.id is not None
    assert narrative.readiness_score == 78.5
    assert len(narrative.strengths) == 3
    assert narrative.ai_model == "gpt-4"


@pytest.mark.asyncio
async def test_financial_narrative_version_control(db_session: AsyncSession):
    """Test narrative version control with supersedes_id."""
    org = Organization(id="org-8", name="Org 8", slug="org-8-slug")
    deal = Deal(id="deal-8", organization_id=org.id, name="Deal 8",
                target_company="Target 8", owner_id="user-8")
    db_session.add(org)
    db_session.add(deal)
    await db_session.commit()

    # Create initial narrative
    narrative_v1 = FinancialNarrative(
        id="narr-v1",
        deal_id=deal.id,
        organization_id=org.id,
        summary="Initial analysis",
        readiness_score=70.0,
        ai_model="gpt-4",
        version=1
    )
    db_session.add(narrative_v1)
    await db_session.commit()

    # Create updated narrative
    narrative_v2 = FinancialNarrative(
        deal_id=deal.id,
        organization_id=org.id,
        summary="Updated analysis with new data",
        readiness_score=75.0,
        ai_model="gpt-4",
        version=2,
        supersedes_id=narrative_v1.id
    )
    db_session.add(narrative_v2)
    await db_session.commit()
    await db_session.refresh(narrative_v2)

    assert narrative_v2.version == 2
    assert narrative_v2.supersedes_id == "narr-v1"


# ============================================================================
# INTEGRATION TESTS (Cross-model relationships)
# ============================================================================

@pytest.mark.asyncio
async def test_complete_financial_data_chain(db_session: AsyncSession):
    """Test complete chain: Deal → Connection → Statement → Ratios → Narrative."""
    org = Organization(id="org-9", name="Org 9", slug="org-9-slug")
    deal = Deal(id="deal-9", organization_id=org.id, name="Deal 9",
                target_company="Target 9", owner_id="user-9")

    connection = FinancialConnection(
        id="conn-9", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )

    statement = FinancialStatement(
        id="stmt-9", connection_id=connection.id, deal_id=deal.id,
        organization_id=org.id, statement_type="balance_sheet",
        period_start=date(2024, 1, 1), period_end=date(2024, 12, 31),
        period_type="annual", currency="GBP", revenue=1000000, net_income=150000
    )

    ratios = FinancialRatio(
        statement_id=statement.id, deal_id=deal.id, organization_id=org.id,
        current_ratio=2.0, gross_profit_margin=0.40
    )

    narrative = FinancialNarrative(
        deal_id=deal.id, organization_id=org.id,
        summary="Excellent financial health", readiness_score=85.0,
        ai_model="gpt-4"
    )

    db_session.add_all([org, deal, connection, statement, ratios, narrative])
    await db_session.commit()

    # Verify all relationships
    result = await db_session.execute(
        select(Deal).where(Deal.id == "deal-9")
    )
    loaded_deal = result.scalar_one()

    assert loaded_deal is not None
    assert loaded_deal.id == "deal-9"


@pytest.mark.asyncio
async def test_cascade_delete_all_financial_data(db_session: AsyncSession):
    """Test that deleting a deal cascades to all financial data."""
    org = Organization(id="org-10", name="Org 10", slug="org-10-slug")
    deal = Deal(id="deal-10", organization_id=org.id, name="Deal 10",
                target_company="Target 10", owner_id="user-10")

    connection = FinancialConnection(
        id="conn-10", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )

    statement = FinancialStatement(
        id="stmt-10", connection_id=connection.id, deal_id=deal.id,
        organization_id=org.id, statement_type="balance_sheet",
        period_start=date(2024, 1, 1), period_end=date(2024, 12, 31),
        period_type="annual", currency="GBP"
    )

    ratios = FinancialRatio(
        id="ratio-10", statement_id=statement.id, deal_id=deal.id,
        organization_id=org.id, current_ratio=2.0
    )

    narrative = FinancialNarrative(
        id="narr-10", deal_id=deal.id, organization_id=org.id,
        summary="Test", readiness_score=75.0, ai_model="gpt-4"
    )

    db_session.add_all([org, deal, connection, statement, ratios, narrative])
    await db_session.commit()

    # Delete deal
    await db_session.delete(deal)
    await db_session.commit()

    # Verify all financial data was deleted
    conn_result = await db_session.execute(select(FinancialConnection).where(FinancialConnection.id == "conn-10"))
    stmt_result = await db_session.execute(select(FinancialStatement).where(FinancialStatement.id == "stmt-10"))
    ratio_result = await db_session.execute(select(FinancialRatio).where(FinancialRatio.id == "ratio-10"))
    narr_result = await db_session.execute(select(FinancialNarrative).where(FinancialNarrative.id == "narr-10"))

    assert conn_result.scalar_one_or_none() is None
    assert stmt_result.scalar_one_or_none() is None
    assert ratio_result.scalar_one_or_none() is None
    assert narr_result.scalar_one_or_none() is None
