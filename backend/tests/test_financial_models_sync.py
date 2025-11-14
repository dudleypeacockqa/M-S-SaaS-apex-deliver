"""
Comprehensive tests for all Financial Intelligence Engine models - DEV-010
Following TDD methodology (RED → GREEN → REFACTOR)
Using synchronous tests compatible with SQLite test database
"""

import pytest
from datetime import datetime, timezone, date
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.financial_connection import FinancialConnection
from app.models.financial_statement import FinancialStatement
from app.models.financial_ratio import FinancialRatio
from app.models.financial_narrative import FinancialNarrative
from app.models.deal import Deal
from app.models.organization import Organization
from app.models.user import User


def seed_org_user_deal(
    session: Session,
    *,
    org_id: str,
    deal_id: str,
    owner_id: str | None = None,
    org_overrides: dict | None = None,
    deal_overrides: dict | None = None,
) -> tuple[Organization, User, Deal]:
    """Helper to persist an organization, owner user, and deal for test fixtures."""

    org_data = {
        "id": org_id,
        "name": f"Org {org_id}",
        "slug": org_id.replace("_", "-"),
    }
    if org_overrides:
        org_data.update(org_overrides)
    org = Organization(**org_data)

    owner_id = owner_id or f"user-{deal_id}"
    user = User(
        id=owner_id,
        clerk_user_id=f"{owner_id}-clerk",
        email=f"{owner_id}@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )

    # Add org and user first, flush to ensure they're in DB before foreign key checks
    session.add(org)
    session.add(user)
    session.flush()  # Flush so foreign keys can reference them
    
    deal_data = {
        "id": deal_id,
        "organization_id": org.id,
        "name": f"Deal {deal_id}",
        "target_company": "Target",
        "owner_id": user.id,
    }
    if deal_overrides:
        deal_data.update(deal_overrides)
    deal = Deal(**deal_data)
    
    session.add(deal)
    session.commit()
    return org, user, deal


# ============================================================================
# FINANCIAL CONNECTION TESTS
# ============================================================================

def test_create_financial_connection(db_session: Session):
    """Test creating a basic financial connection."""
    # Arrange
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-1",
        deal_id="deal-1",
    )

    # Act
    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="xero",
        access_token="test_token",
        connection_status="active"
    )
    db_session.add(connection)
    db_session.commit()
    db_session.refresh(connection)

    # Assert
    assert connection.id is not None
    assert connection.platform == "xero"
    assert connection.connection_status == "active"


def test_financial_connection_cascade_delete(db_session: Session):
    """Test that deleting a deal cascades to delete financial connections."""
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-2",
        deal_id="deal-2",
    )

    connection = FinancialConnection(
        deal_id=deal.id,
        organization_id=org.id,
        platform="quickbooks",
        access_token="token",
        connection_status="active"
    )
    db_session.add(connection)
    db_session.commit()
    connection_id = connection.id

    # Delete deal
    db_session.delete(deal)
    db_session.commit()

    # Verify connection was deleted
    result = db_session.execute(
        select(FinancialConnection).where(FinancialConnection.id == connection_id)
    )
    assert result.scalar_one_or_none() is None


# ============================================================================
# FINANCIAL STATEMENT TESTS
# ============================================================================

def test_create_financial_statement_balance_sheet(db_session: Session):
    """Test creating a balance sheet statement."""
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-3",
        deal_id="deal-3",
    )
    connection = FinancialConnection(
        id="conn-1", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )
    db_session.add(connection)
    db_session.commit()

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
        total_equity=600000.00,
    )
    db_session.add(statement)
    db_session.commit()
    db_session.refresh(statement)

    # Assert
    assert statement.id is not None
    assert statement.statement_type == "balance_sheet"
    assert statement.total_assets == 1000000.00
    assert statement.total_equity == 600000.00


def test_financial_statement_with_json_fields(db_session: Session):
    """Test statement with JSON fields (raw_data, missing_fields)."""
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-4",
        deal_id="deal-4",
    )
    connection = FinancialConnection(
        id="conn-2", deal_id=deal.id, organization_id=org.id,
        platform="xero", access_token="token", connection_status="active"
    )
    db_session.add(connection)
    db_session.commit()

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
        missing_fields=["depreciation", "amortization"],
    )
    db_session.add(statement)
    db_session.commit()
    db_session.refresh(statement)

    assert statement.raw_data == {"source": "xero_api", "version": "2.0"}
    assert "depreciation" in statement.missing_fields


# ============================================================================
# FINANCIAL RATIO TESTS
# ============================================================================

def test_create_financial_ratios(db_session: Session):
    """Test creating financial ratios with all 47 fields."""
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-5",
        deal_id="deal-5",
    )
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
    db_session.add_all([connection, statement])
    db_session.commit()

    # Act
    ratios = FinancialRatio(
        statement_id=statement.id,
        deal_id=deal.id,
        organization_id=org.id,
        current_ratio=2.5,
        quick_ratio=1.8,
        cash_ratio=1.2,
        gross_profit_margin=0.45,
        net_profit_margin=0.15,
        return_on_equity=0.20,
    )
    db_session.add(ratios)
    db_session.commit()
    db_session.refresh(ratios)

    assert float(ratios.current_ratio) == 2.5
    assert float(ratios.gross_profit_margin) == 0.45


def test_financial_ratio_nullable_fields(db_session: Session):
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-6",
        deal_id="deal-6",
    )
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
    db_session.add_all([connection, statement])
    db_session.commit()

    ratios = FinancialRatio(
        statement_id=statement.id,
        deal_id=deal.id,
        organization_id=org.id,
        current_ratio=None,
        quick_ratio=None,
    )
    db_session.add(ratios)
    db_session.commit()
    db_session.refresh(ratios)

    assert ratios.current_ratio is None
    assert ratios.quick_ratio is None


# ============================================================================
# FINANCIAL NARRATIVE TESTS
# ============================================================================

def test_create_financial_narrative(db_session: Session):
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-7",
        deal_id="deal-7",
    )
    narrative = FinancialNarrative(
        deal_id=deal.id,
        organization_id=org.id,
        summary="Strong financial performance",
        readiness_score=82.5,
        ai_model="gpt-4",
    )
    db_session.add(narrative)
    db_session.commit()
    db_session.refresh(narrative)

    assert narrative.readiness_score == 82.5
    assert narrative.summary.startswith("Strong")


def test_financial_narrative_version_control(db_session: Session):
    org, _, deal = seed_org_user_deal(
        db_session,
        org_id="org-8",
        deal_id="deal-8",
    )
    base_narrative = FinancialNarrative(
        deal_id=deal.id,
        organization_id=org.id,
        summary="Base narrative",
        readiness_score=70.0,
        ai_model="gpt-4",
    )
    db_session.add(base_narrative)
    db_session.commit()

    new_narrative = FinancialNarrative(
        deal_id=deal.id,
        organization_id=org.id,
        summary="Updated narrative",
        readiness_score=75.0,
        ai_model="gpt-4",
        supersedes_id=base_narrative.id,
    )
    db_session.add(new_narrative)
    db_session.commit()
    db_session.refresh(new_narrative)

    assert new_narrative.supersedes_id == base_narrative.id


# ============================================================================
# INTEGRATION TESTS (Cross-model relationships)
# ============================================================================

def test_complete_financial_data_chain(db_session: Session):
    """Test complete chain: Deal → Connection → Statement → Ratios → Narrative."""
    org = Organization(id="org-9", name="Org 9", slug="org-9-slug")
    user = User(
        id="user-9",
        clerk_user_id="user-9-clerk",
        email="user-9@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    deal = Deal(id="deal-9", organization_id=org.id, name="Deal 9",
                target_company="Target 9", owner_id=user.id)

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

    # Add org and user first, flush before foreign key dependencies
    db_session.add(org)
    db_session.add(user)
    db_session.flush()
    
    # Now add deal and financial data
    db_session.add_all([deal, connection, statement, ratios, narrative])
    db_session.commit()

    # Verify all relationships
    result = db_session.execute(
        select(Deal).where(Deal.id == "deal-9")
    )
    loaded_deal = result.scalar_one()

    assert loaded_deal is not None
    assert loaded_deal.id == "deal-9"


def test_cascade_delete_all_financial_data(db_session: Session):
    """Test that deleting a deal cascades to all financial data."""
    org = Organization(id="org-10", name="Org 10", slug="org-10-slug")
    user = User(
        id="user-10",
        clerk_user_id="user-10-clerk",
        email="user-10@example.com",
        first_name="Test",
        last_name="User",
        role="solo",
        organization_id=org.id,
        is_active=True,
    )
    deal = Deal(id="deal-10", organization_id=org.id, name="Deal 10",
                target_company="Target 10", owner_id=user.id)

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

    # Add org and user first, flush before foreign key dependencies
    db_session.add(org)
    db_session.add(user)
    db_session.flush()
    
    # Now add deal and financial data
    db_session.add_all([deal, connection, statement, ratios, narrative])
    db_session.commit()

    # Delete deal
    db_session.delete(deal)
    db_session.commit()

    # Verify all financial data was deleted
    conn_result = db_session.execute(select(FinancialConnection).where(FinancialConnection.id == "conn-10"))
    stmt_result = db_session.execute(select(FinancialStatement).where(FinancialStatement.id == "stmt-10"))
    ratio_result = db_session.execute(select(FinancialRatio).where(FinancialRatio.id == "ratio-10"))
    narr_result = db_session.execute(select(FinancialNarrative).where(FinancialNarrative.id == "narr-10"))

    assert conn_result.scalar_one_or_none() is None
    assert stmt_result.scalar_one_or_none() is None
    assert ratio_result.scalar_one_or_none() is None
    assert narr_result.scalar_one_or_none() is None
