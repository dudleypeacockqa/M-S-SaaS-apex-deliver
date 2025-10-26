"""
Tests for Financial Narrative Generation Service - DEV-010 Phase 3
Testing AI-powered narrative generation, scoring, and parsing
"""

import pytest
from unittest.mock import AsyncMock, Mock, patch
from decimal import Decimal
from datetime import datetime, timezone

from app.services.financial_narrative_service import (
    _build_narrative_prompt,
    _parse_narrative_response,
    calculate_readiness_score,
    generate_financial_narrative,
)
from app.models.financial_ratio import FinancialRatio
from app.models.financial_statement import FinancialStatement
from app.models.financial_narrative import FinancialNarrative
from app.models.deal import Deal
from app.models.organization import Organization


# Test _build_narrative_prompt()
def test_build_narrative_prompt_with_complete_data():
    """Test prompt building with all financial data available."""
    # Create mock ratio object
    ratios = Mock(spec=FinancialRatio)
    ratios.current_ratio = 2.0
    ratios.quick_ratio = 1.5
    ratios.cash_ratio = 0.8
    ratios.gross_profit_margin = Decimal("0.40")
    ratios.operating_profit_margin = Decimal("0.20")
    ratios.net_profit_margin = Decimal("0.10")
    ratios.return_on_assets = Decimal("0.15")
    ratios.return_on_equity = Decimal("0.25")
    ratios.ebitda_margin = Decimal("0.25")
    ratios.debt_to_equity = 0.5
    ratios.debt_to_assets = 0.33
    ratios.interest_coverage = 8.0
    ratios.revenue_growth_yoy = Decimal("0.15")
    ratios.ebitda_growth_yoy = Decimal("0.20")
    ratios.net_income_growth_yoy = Decimal("0.18")
    ratios.asset_turnover = 1.2
    ratios.inventory_turnover = 6.0
    ratios.receivables_turnover = 10.0

    # Create mock statement object
    statement = Mock(spec=FinancialStatement)
    statement.revenue = Decimal("1000000")
    statement.net_income = Decimal("100000")
    statement.gross_profit = Decimal("400000")
    statement.operating_income = Decimal("200000")
    statement.ebitda = Decimal("250000")
    statement.total_assets = Decimal("800000")
    statement.total_liabilities = Decimal("300000")
    statement.total_equity = Decimal("500000")
    statement.current_assets = Decimal("300000")
    statement.current_liabilities = Decimal("150000")

    prompt = _build_narrative_prompt(ratios, statement)

    # Assertions
    assert "£1,000,000.00" in prompt  # Revenue
    assert "£100,000.00" in prompt  # Net Income
    assert "Current Ratio: 2.0" in prompt
    assert "Gross Profit Margin: 40.00%" in prompt
    assert "Net Profit Margin: 10.00%" in prompt
    assert "Debt-to-Equity: 0.5" in prompt
    assert "Revenue Growth (YoY): 15.00%" in prompt
    assert "Asset Turnover: 1.2" in prompt
    assert "## Task" in prompt
    assert "Strengths" in prompt
    assert "Weaknesses" in prompt
    assert "Red Flags" in prompt


def test_build_narrative_prompt_with_minimal_data():
    """Test prompt building with minimal financial data."""
    ratios = Mock(spec=FinancialRatio)
    ratios.current_ratio = 1.5
    ratios.quick_ratio = None
    ratios.cash_ratio = None
    ratios.gross_profit_margin = None
    ratios.operating_profit_margin = None
    ratios.net_profit_margin = Decimal("0.05")
    ratios.return_on_assets = None
    ratios.return_on_equity = None
    ratios.ebitda_margin = None
    ratios.debt_to_equity = None
    ratios.debt_to_assets = None
    ratios.interest_coverage = None
    ratios.revenue_growth_yoy = None
    ratios.ebitda_growth_yoy = None
    ratios.net_income_growth_yoy = None
    ratios.asset_turnover = None
    ratios.inventory_turnover = None
    ratios.receivables_turnover = None

    statement = Mock(spec=FinancialStatement)
    statement.revenue = Decimal("500000")
    statement.net_income = None
    statement.gross_profit = None
    statement.operating_income = None
    statement.ebitda = None
    statement.total_assets = None
    statement.total_liabilities = None
    statement.total_equity = None
    statement.current_assets = None
    statement.current_liabilities = None

    prompt = _build_narrative_prompt(ratios, statement)

    # Assertions
    assert "£500,000.00" in prompt  # Revenue
    assert "Current Ratio: 1.5" in prompt
    assert "Net Profit Margin: 5.00%" in prompt
    assert "## Task" in prompt


# Test _parse_narrative_response()
def test_parse_narrative_response_with_complete_response():
    """Test parsing a complete GPT-4 response."""
    response_text = """# Financial Analysis Summary

The company demonstrates strong financial health with excellent liquidity ratios and solid profitability margins. The current ratio of 2.0 indicates robust short-term liquidity, while the gross profit margin of 40% suggests strong pricing power and operational efficiency.

However, moderate debt levels require careful monitoring. The debt-to-equity ratio of 0.5 is manageable but leaves limited room for additional leverage without increasing financial risk.

## Strengths
- Strong current ratio of 2.0 indicates excellent short-term liquidity
- Gross profit margin of 40% demonstrates strong pricing power
- Revenue growth of 15% YoY shows positive momentum

## Weaknesses
- Operating cash flow could be stronger relative to revenue
- Interest coverage of 8.0x is adequate but not exceptional
- Inventory turnover could be improved for working capital efficiency

## Red Flags
None identified

## Growth Signals
- Consistent revenue growth trajectory
- Expanding EBITDA margins
- Strong customer retention indicators
"""

    parsed = _parse_narrative_response(response_text)

    # Assertions
    assert "strong financial health" in parsed["summary"].lower()
    assert len(parsed["strengths"]) == 3
    assert len(parsed["weaknesses"]) == 3
    assert len(parsed["red_flags"]) == 0  # "None identified" should result in empty list
    assert len(parsed["growth_signals"]) == 3
    assert "current ratio of 2.0" in parsed["strengths"][0].lower()


def test_parse_narrative_response_with_red_flags():
    """Test parsing response with identified red flags."""
    response_text = """# Financial Analysis Summary

Critical liquidity concerns require immediate attention.

## Strengths
- Revenue growth remains positive

## Weaknesses
- Declining profit margins

## Red Flags
- Current ratio below 1.0 indicates liquidity crisis risk
- Negative operating cash flow for 2 consecutive quarters
- Debt covenant violations imminent

## Growth Signals
- None identified
"""

    parsed = _parse_narrative_response(response_text)

    assert len(parsed["red_flags"]) == 3
    assert "liquidity crisis" in parsed["red_flags"][0].lower()
    assert "covenant" in parsed["red_flags"][2].lower()


# Test calculate_readiness_score()
def test_calculate_readiness_score_high_quality_deal():
    """Test readiness score calculation for a high-quality deal."""
    ratios = Mock(spec=FinancialRatio)
    ratios.current_ratio = 2.5
    ratios.net_profit_margin = Decimal("0.18")  # 18%
    ratios.debt_to_equity = 0.4  # Low debt
    ratios.revenue_growth_yoy = Decimal("0.28")  # 28% growth
    ratios.ebitda_growth_yoy = Decimal("0.30")  # 30% growth

    statement = Mock(spec=FinancialStatement)
    statement.data_completeness_score = Decimal("1.0")  # 100% complete
    statement.revenue = Decimal("1000000")
    statement.net_income = Decimal("180000")
    statement.total_assets = Decimal("800000")
    statement.total_liabilities = Decimal("200000")
    statement.total_equity = Decimal("600000")
    statement.operating_income = Decimal("250000")
    statement.current_assets = Decimal("400000")
    statement.current_liabilities = Decimal("160000")
    statement.ebitda = Decimal("300000")
    statement.operating_cash_flow = Decimal("220000")

    score = calculate_readiness_score(ratios, statement)

    # High quality deal should score 80+
    assert score >= 80.0
    assert score <= 100.0


def test_calculate_readiness_score_low_quality_deal():
    """Test readiness score calculation for a distressed deal."""
    ratios = Mock(spec=FinancialRatio)
    ratios.current_ratio = 0.8  # Below 1.0 - liquidity risk
    ratios.net_profit_margin = Decimal("-0.05")  # Negative margin
    ratios.debt_to_equity = 3.5  # Overleveraged
    ratios.revenue_growth_yoy = Decimal("-0.15")  # Declining revenue
    ratios.ebitda_growth_yoy = Decimal("-0.20")

    statement = Mock(spec=FinancialStatement)
    statement.data_completeness_score = Decimal("0.6")  # 60% complete
    statement.revenue = Decimal("500000")
    statement.net_income = Decimal("-25000")
    statement.total_assets = Decimal("400000")
    statement.total_liabilities = Decimal("350000")
    statement.total_equity = Decimal("50000")
    statement.operating_income = Decimal("-10000")
    statement.current_assets = Decimal("100000")
    statement.current_liabilities = Decimal("125000")
    statement.ebitda = Decimal("5000")
    statement.operating_cash_flow = Decimal("-15000")

    score = calculate_readiness_score(ratios, statement)

    # Distressed deal should score below 40
    assert score < 40.0
    assert score >= 0.0


def test_calculate_readiness_score_moderate_deal():
    """Test readiness score for a moderate quality deal."""
    ratios = Mock(spec=FinancialRatio)
    ratios.current_ratio = 1.5
    ratios.net_profit_margin = Decimal("0.08")  # 8%
    ratios.debt_to_equity = 1.2
    ratios.revenue_growth_yoy = Decimal("0.05")  # 5% growth
    ratios.ebitda_growth_yoy = Decimal("0.06")

    statement = Mock(spec=FinancialStatement)
    statement.data_completeness_score = Decimal("0.8")
    statement.revenue = Decimal("750000")
    statement.net_income = Decimal("60000")
    statement.total_assets = Decimal("600000")
    statement.total_liabilities = Decimal("300000")
    statement.total_equity = Decimal("300000")
    statement.operating_income = Decimal("80000")
    statement.current_assets = Decimal("200000")
    statement.current_liabilities = Decimal("133000")
    statement.ebitda = Decimal("100000")
    statement.operating_cash_flow = Decimal("70000")

    score = calculate_readiness_score(ratios, statement)

    # Moderate deal should score 50-70
    assert 50.0 <= score <= 70.0


# Test generate_financial_narrative() - requires mocking OpenAI
@pytest.mark.asyncio
async def test_generate_financial_narrative_success(db_session):
    """Test successful narrative generation with mocked OpenAI."""
    # Create test data
    org = Organization(id="org-narrative-1", name="Test Org", slug="test-org")
    deal = Deal(
        id="deal-narrative-1",
        organization_id=org.id,
        name="Test Deal",
        target_company="Target Co",
        owner_id="user-1"
    )

    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

    # Create financial data
    statement = FinancialStatement(
        deal_id=deal.id,
        organization_id=org.id,
        period_start_date=datetime(2024, 1, 1, tzinfo=timezone.utc),
        period_end_date=datetime(2024, 12, 31, tzinfo=timezone.utc),
        revenue=Decimal("1000000"),
        net_income=Decimal("100000"),
        total_assets=Decimal("800000"),
        total_equity=Decimal("500000"),
        data_completeness_score=Decimal("0.9")
    )

    ratios = FinancialRatio(
        deal_id=deal.id,
        organization_id=org.id,
        period_start_date=datetime(2024, 1, 1, tzinfo=timezone.utc),
        period_end_date=datetime(2024, 12, 31, tzinfo=timezone.utc),
        current_ratio=Decimal("2.0"),
        net_profit_margin=Decimal("0.10"),
        debt_to_equity=Decimal("0.5"),
        revenue_growth_yoy=Decimal("0.15")
    )

    db_session.add(statement)
    db_session.add(ratios)
    db_session.commit()

    # Mock OpenAI response
    mock_response = Mock()
    mock_response.choices = [Mock()]
    mock_response.choices[0].message.content = """# Financial Analysis Summary

Strong financial performance with healthy ratios.

## Strengths
- Excellent liquidity with current ratio of 2.0

## Weaknesses
- Could improve asset turnover

## Red Flags
None identified

## Growth Signals
- 15% revenue growth YoY
"""
    mock_response.usage.total_tokens = 250

    # Patch OpenAI client
    with patch('app.services.financial_narrative_service.openai_client') as mock_client:
        mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

        # Generate narrative
        narrative = await generate_financial_narrative(deal.id, db_session)

        # Assertions
        assert narrative is not None
        assert narrative.deal_id == deal.id
        assert narrative.organization_id == org.id
        assert "financial performance" in narrative.summary.lower()
        assert len(narrative.strengths) == 1
        assert len(narrative.weaknesses) == 1
        assert len(narrative.red_flags) == 0
        assert narrative.readiness_score is not None
        assert 0 <= narrative.readiness_score <= 100
        assert narrative.ai_model == "gpt-4"
        assert narrative.token_count == 250


@pytest.mark.asyncio
async def test_generate_financial_narrative_returns_existing_by_default(db_session):
    """Test that generate_financial_narrative returns existing narrative without regenerate flag."""
    # Create test data
    org = Organization(id="org-narrative-2", name="Test Org 2", slug="test-org-2")
    deal = Deal(
        id="deal-narrative-2",
        organization_id=org.id,
        name="Test Deal 2",
        target_company="Target Co 2",
        owner_id="user-2"
    )

    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

    # Create existing narrative
    existing_narrative = FinancialNarrative(
        deal_id=deal.id,
        organization_id=org.id,
        summary="Existing summary",
        strengths=["Strength 1"],
        weaknesses=["Weakness 1"],
        red_flags=[],
        growth_signals=["Signal 1"],
        readiness_score=Decimal("75.0"),
        ai_model="gpt-4",
        token_count=200,
        generation_time_ms=1500,
        version=1
    )

    db_session.add(existing_narrative)
    db_session.commit()

    # Generate narrative (should return existing)
    with patch('app.services.financial_narrative_service.openai_client') as mock_client:
        narrative = await generate_financial_narrative(deal.id, db_session, regenerate=False)

        # Should NOT call OpenAI
        assert not mock_client.chat.completions.create.called

        # Should return existing narrative
        assert narrative.id == existing_narrative.id
        assert narrative.summary == "Existing summary"


@pytest.mark.asyncio
async def test_generate_financial_narrative_raises_error_when_no_data(db_session):
    """Test that generate_financial_narrative raises error when no financial data exists."""
    # Create deal without financial data
    org = Organization(id="org-narrative-3", name="Test Org 3", slug="test-org-3")
    deal = Deal(
        id="deal-narrative-3",
        organization_id=org.id,
        name="Test Deal 3",
        target_company="Target Co 3",
        owner_id="user-3"
    )

    db_session.add(org)
    db_session.add(deal)
    db_session.commit()

    # Attempt to generate narrative without data
    with pytest.raises(ValueError, match="No financial data found"):
        await generate_financial_narrative(deal.id, db_session)


@pytest.mark.asyncio
async def test_generate_financial_narrative_raises_error_when_deal_not_found(db_session):
    """Test that generate_financial_narrative raises error for non-existent deal."""
    with pytest.raises(ValueError, match="Deal .* not found"):
        await generate_financial_narrative("nonexistent-deal-id", db_session)
