"""
Financial Narrative Generation Service - DEV-010
Uses OpenAI GPT-4 to generate AI-powered financial analysis narratives
"""

import os
import re
from typing import Dict, List, Optional
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from openai import AsyncOpenAI

from app.models.financial_ratio import FinancialRatio
from app.models.financial_statement import FinancialStatement
from app.models.financial_narrative import FinancialNarrative
from app.models.deal import Deal


# Initialize OpenAI client
openai_client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "dummy_key_for_tests")
)


def _build_narrative_prompt(ratios: FinancialRatio, statement: FinancialStatement) -> str:
    """
    Build a comprehensive prompt for GPT-4 to generate financial narrative.

    Args:
        ratios: Financial ratios object with calculated metrics
        statement: Financial statement with raw financial data

    Returns:
        Formatted prompt string for GPT-4
    """
    prompt = """You are a senior financial analyst at a leading M&A advisory firm. Analyze the following financial data and provide a comprehensive yet concise assessment.

## Financial Data

### Income Statement
"""

    # Add income statement data if available
    if statement.revenue:
        prompt += f"- Revenue: £{statement.revenue:,.2f}\n"
    if statement.net_income:
        prompt += f"- Net Income: £{statement.net_income:,.2f}\n"
    if statement.gross_profit:
        prompt += f"- Gross Profit: £{statement.gross_profit:,.2f}\n"
    if statement.operating_income:
        prompt += f"- Operating Income: £{statement.operating_income:,.2f}\n"
    if statement.ebitda:
        prompt += f"- EBITDA: £{statement.ebitda:,.2f}\n"

    prompt += "\n### Balance Sheet\n"

    # Add balance sheet data if available
    if statement.total_assets:
        prompt += f"- Total Assets: £{statement.total_assets:,.2f}\n"
    if statement.total_liabilities:
        prompt += f"- Total Liabilities: £{statement.total_liabilities:,.2f}\n"
    if statement.total_equity:
        prompt += f"- Total Equity: £{statement.total_equity:,.2f}\n"
    if statement.current_assets:
        prompt += f"- Current Assets: £{statement.current_assets:,.2f}\n"
    if statement.current_liabilities:
        prompt += f"- Current Liabilities: £{statement.current_liabilities:,.2f}\n"

    prompt += "\n### Financial Ratios\n"

    # Add liquidity ratios
    prompt += "\n**Liquidity Ratios:**\n"
    if ratios.current_ratio:
        prompt += f"- Current Ratio: {ratios.current_ratio}\n"
    if ratios.quick_ratio:
        prompt += f"- Quick Ratio: {ratios.quick_ratio}\n"
    if ratios.cash_ratio:
        prompt += f"- Cash Ratio: {ratios.cash_ratio}\n"

    # Add profitability ratios
    prompt += "\n**Profitability Ratios:**\n"
    if ratios.gross_profit_margin:
        prompt += f"- Gross Profit Margin: {float(ratios.gross_profit_margin) * 100:.2f}%\n"
    if ratios.operating_profit_margin:
        prompt += f"- Operating Profit Margin: {float(ratios.operating_profit_margin) * 100:.2f}%\n"
    if ratios.net_profit_margin:
        prompt += f"- Net Profit Margin: {float(ratios.net_profit_margin) * 100:.2f}%\n"
    if ratios.return_on_assets:
        prompt += f"- Return on Assets (ROA): {float(ratios.return_on_assets) * 100:.2f}%\n"
    if ratios.return_on_equity:
        prompt += f"- Return on Equity (ROE): {float(ratios.return_on_equity) * 100:.2f}%\n"
    if ratios.ebitda_margin:
        prompt += f"- EBITDA Margin: {float(ratios.ebitda_margin) * 100:.2f}%\n"

    # Add leverage ratios
    prompt += "\n**Leverage Ratios:**\n"
    if ratios.debt_to_equity:
        prompt += f"- Debt-to-Equity: {ratios.debt_to_equity}\n"
    if ratios.debt_to_assets:
        prompt += f"- Debt-to-Assets: {ratios.debt_to_assets}\n"
    if ratios.interest_coverage:
        prompt += f"- Interest Coverage: {ratios.interest_coverage}\n"

    # Add growth ratios
    prompt += "\n**Growth Ratios:**\n"
    if ratios.revenue_growth_yoy:
        prompt += f"- Revenue Growth (YoY): {float(ratios.revenue_growth_yoy) * 100:.2f}%\n"
    if ratios.ebitda_growth_yoy:
        prompt += f"- EBITDA Growth (YoY): {float(ratios.ebitda_growth_yoy) * 100:.2f}%\n"
    if ratios.net_income_growth_yoy:
        prompt += f"- Net Income Growth (YoY): {float(ratios.net_income_growth_yoy) * 100:.2f}%\n"

    # Add efficiency ratios
    prompt += "\n**Efficiency Ratios:**\n"
    if ratios.asset_turnover:
        prompt += f"- Asset Turnover: {ratios.asset_turnover}\n"
    if ratios.inventory_turnover:
        prompt += f"- Inventory Turnover: {ratios.inventory_turnover}\n"
    if ratios.receivables_turnover:
        prompt += f"- Receivables Turnover: {ratios.receivables_turnover}\n"

    # Add instructions for GPT-4
    prompt += """

## Task

Provide a comprehensive financial analysis following this EXACT format:

# Financial Analysis Summary

[Write a concise 2-3 paragraph summary highlighting the overall financial health, key trends, and critical insights. Focus on what matters most for M&A evaluation.]

## Strengths
- [List the top 3 financial strengths, each as a bullet point]
- [Be specific and quantitative where possible]
- [Focus on competitive advantages and positive indicators]

## Weaknesses
- [List the top 3 financial weaknesses or concerns, each as a bullet point]
- [Be specific about areas that need improvement]
- [Include potential risks or limitations]

## Red Flags
[List any significant red flags that would concern M&A investors, or write "None identified" if there are no major concerns]

## Growth Signals
- [List observable growth signals or positive momentum indicators]
- [Include market expansion, efficiency improvements, margin expansion, etc.]

IMPORTANT:
- Be concise but specific
- Use concrete numbers from the data
- Avoid generic statements
- Focus on M&A decision-making insights
- Format exactly as shown above with markdown headers
"""

    return prompt


def _parse_narrative_response(response_text: str) -> Dict[str, any]:
    """
    Parse GPT-4 response into structured narrative components.

    Args:
        response_text: Raw response text from GPT-4

    Returns:
        Dictionary with summary, strengths, weaknesses, red_flags, growth_signals
    """
    result = {
        "summary": "",
        "strengths": [],
        "weaknesses": [],
        "red_flags": [],
        "growth_signals": [],
    }

    # Extract summary (everything before first ## header)
    summary_match = re.search(r"# Financial Analysis Summary\n+(.*?)(?=\n##)", response_text, re.DOTALL)
    if summary_match:
        result["summary"] = summary_match.group(1).strip()
    else:
        # Fallback: take first paragraph
        first_para = response_text.split("\n\n")[0]
        result["summary"] = first_para.strip()

    # Extract strengths
    strengths_match = re.search(r"## Strengths\n+(.*?)(?=\n##|\Z)", response_text, re.DOTALL)
    if strengths_match:
        strengths_text = strengths_match.group(1).strip()
        result["strengths"] = [
            line.strip("- ").strip()
            for line in strengths_text.split("\n")
            if line.strip().startswith("-")
        ]

    # Extract weaknesses
    weaknesses_match = re.search(r"## Weaknesses\n+(.*?)(?=\n##|\Z)", response_text, re.DOTALL)
    if weaknesses_match:
        weaknesses_text = weaknesses_match.group(1).strip()
        result["weaknesses"] = [
            line.strip("- ").strip()
            for line in weaknesses_text.split("\n")
            if line.strip().startswith("-")
        ]

    # Extract red flags
    red_flags_match = re.search(r"## Red Flags\n+(.*?)(?=\n##|\Z)", response_text, re.DOTALL)
    if red_flags_match:
        red_flags_text = red_flags_match.group(1).strip()
        if "none identified" not in red_flags_text.lower():
            result["red_flags"] = [
                line.strip("- ").strip()
                for line in red_flags_text.split("\n")
                if line.strip().startswith("-")
            ]

    # Extract growth signals
    growth_match = re.search(r"## Growth Signals\n+(.*?)(?=\n##|\Z)", response_text, re.DOTALL)
    if growth_match:
        growth_text = growth_match.group(1).strip()
        result["growth_signals"] = [
            line.strip("- ").strip()
            for line in growth_text.split("\n")
            if line.strip().startswith("-")
        ]

    return result


def calculate_readiness_score(ratios: FinancialRatio, statement: FinancialStatement) -> float:
    """
    Calculate Deal Readiness Score (0-100) based on financial data quality and health.

    Score Breakdown:
    - Data Quality (25 points): Completeness of financial data
    - Financial Health (40 points): Liquidity, profitability, leverage
    - Growth Trajectory (20 points): Revenue and profit growth trends
    - Risk Assessment (15 points): Red flags and warning signs

    Args:
        ratios: Financial ratios object
        statement: Financial statement object

    Returns:
        Float score between 0 and 100
    """
    score = 0.0

    # Component 1: Data Quality Score (0-25 points)
    data_quality = 0.0
    if statement.data_completeness_score:
        # Use the pre-calculated completeness score (0.0 to 1.0 scale → 0 to 25 points)
        data_quality = float(statement.data_completeness_score) * 25
    else:
        # Calculate based on available fields
        total_fields = 10
        available_fields = sum([
            1 if statement.revenue else 0,
            1 if statement.net_income else 0,
            1 if statement.total_assets else 0,
            1 if statement.total_liabilities else 0,
            1 if statement.total_equity else 0,
            1 if statement.operating_income else 0,
            1 if statement.current_assets else 0,
            1 if statement.current_liabilities else 0,
            1 if statement.ebitda else 0,
            1 if statement.operating_cash_flow else 0,
        ])
        data_quality = (available_fields / total_fields) * 25

    score += data_quality

    # Component 2: Financial Health Score (0-40 points)
    financial_health = 0.0

    # Liquidity (10 points)
    if ratios.current_ratio:
        current_ratio_val = float(ratios.current_ratio)
        if current_ratio_val >= 2.0:
            financial_health += 10
        elif current_ratio_val >= 1.5:
            financial_health += 7
        elif current_ratio_val >= 1.0:
            financial_health += 4
        else:
            financial_health += 0

    # Profitability (15 points)
    if ratios.net_profit_margin:
        npm = float(ratios.net_profit_margin)
        if npm >= 0.15:  # 15%+
            financial_health += 15
        elif npm >= 0.10:  # 10-15%
            financial_health += 10
        elif npm >= 0.05:  # 5-10%
            financial_health += 5
        elif npm >= 0:  # Positive
            financial_health += 2
        else:  # Negative
            financial_health += 0

    # Leverage (15 points)
    if ratios.debt_to_equity:
        dte = float(ratios.debt_to_equity)
        if dte <= 0.5:  # Low debt
            financial_health += 15
        elif dte <= 1.0:  # Moderate debt
            financial_health += 10
        elif dte <= 2.0:  # High debt
            financial_health += 5
        else:  # Very high debt
            financial_health += 0

    score += financial_health

    # Component 3: Growth Trajectory Score (0-20 points)
    growth_score = 0.0

    if ratios.revenue_growth_yoy:
        rev_growth = float(ratios.revenue_growth_yoy)
        if rev_growth >= 0.25:  # 25%+
            growth_score += 12
        elif rev_growth >= 0.15:  # 15-25%
            growth_score += 8
        elif rev_growth >= 0.05:  # 5-15%
            growth_score += 4
        elif rev_growth >= 0:  # Positive
            growth_score += 1
        else:  # Negative
            growth_score += 0

    if ratios.ebitda_growth_yoy:
        ebitda_growth = float(ratios.ebitda_growth_yoy)
        if ebitda_growth >= 0.25:
            growth_score += 8
        elif ebitda_growth >= 0.15:
            growth_score += 5
        elif ebitda_growth >= 0.05:
            growth_score += 2
        elif ebitda_growth >= 0:
            growth_score += 1
        else:
            growth_score += 0

    score += growth_score

    # Component 4: Risk Assessment Score (0-15 points)
    risk_score = 15.0  # Start with full points, deduct for risks

    # Deduct for red flags
    if ratios.current_ratio and float(ratios.current_ratio) < 1.0:
        risk_score -= 5  # Liquidity crisis risk

    if ratios.net_profit_margin and float(ratios.net_profit_margin) < 0:
        risk_score -= 5  # Profitability risk

    if ratios.debt_to_equity and float(ratios.debt_to_equity) > 3.0:
        risk_score -= 5  # Over-leveraged risk

    if ratios.revenue_growth_yoy and float(ratios.revenue_growth_yoy) < -0.10:
        risk_score -= 3  # Declining revenue risk

    risk_score = max(risk_score, 0)  # Floor at 0
    score += risk_score

    # Ensure score is within bounds
    score = max(0.0, min(100.0, score))

    return round(score, 2)


async def generate_financial_narrative(
    deal_id: str,
    db: Session,
    regenerate: bool = False
) -> FinancialNarrative:
    """
    Generate AI-powered financial narrative using OpenAI GPT-4.

    Args:
        deal_id: ID of the deal to generate narrative for
        db: Database session
        regenerate: If True, generate new narrative even if one exists

    Returns:
        FinancialNarrative object

    Raises:
        ValueError: If no financial data exists for the deal
        Exception: If OpenAI API call fails
    """
    # Fetch deal
    result = db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise ValueError(f"Deal {deal_id} not found")

    # Check if narrative already exists
    if not regenerate:
        existing = db.execute(
            select(FinancialNarrative)
            .where(FinancialNarrative.deal_id == deal_id)
            .order_by(desc(FinancialNarrative.created_at))
        ).scalar_one_or_none()

        if existing:
            return existing

    # Fetch latest financial ratios
    ratios_result = db.execute(
        select(FinancialRatio)
        .where(FinancialRatio.deal_id == deal_id)
        .order_by(desc(FinancialRatio.created_at))
    )
    ratios = ratios_result.scalar_one_or_none()

    # Fetch latest financial statement
    statement_result = db.execute(
        select(FinancialStatement)
        .where(FinancialStatement.deal_id == deal_id)
        .order_by(desc(FinancialStatement.created_at))
    )
    statement = statement_result.scalar_one_or_none()

    if not ratios or not statement:
        raise ValueError(f"No financial data found for deal {deal_id}")

    # Build prompt for GPT-4
    prompt = _build_narrative_prompt(ratios, statement)

    # Call OpenAI API
    start_time = datetime.now(timezone.utc)

    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a senior M&A financial analyst."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
        temperature=0.7,
    )

    generation_time_ms = int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)

    # Parse response
    narrative_content = response.choices[0].message.content
    parsed = _parse_narrative_response(narrative_content)

    # Calculate readiness score
    readiness_score = calculate_readiness_score(ratios, statement)

    # Calculate score breakdown
    data_quality_score = float(statement.data_completeness_score or 0) * 0.25
    financial_health_score = readiness_score * 0.40  # Simplified
    growth_trajectory_score = readiness_score * 0.20  # Simplified
    risk_assessment_score = readiness_score * 0.15  # Simplified

    # Create narrative record
    narrative = FinancialNarrative(
        deal_id=deal_id,
        organization_id=deal.organization_id,
        summary=parsed["summary"],
        strengths=parsed["strengths"],
        weaknesses=parsed["weaknesses"],
        red_flags=parsed["red_flags"],
        growth_signals=parsed["growth_signals"],
        readiness_score=Decimal(str(readiness_score)),
        data_quality_score=Decimal(str(data_quality_score)),
        financial_health_score=Decimal(str(financial_health_score)),
        growth_trajectory_score=Decimal(str(growth_trajectory_score)),
        risk_assessment_score=Decimal(str(risk_assessment_score)),
        ai_model="gpt-4",
        token_count=response.usage.total_tokens,
        generation_time_ms=generation_time_ms,
        version=1,
    )

    db.add(narrative)
    db.commit()
    db.refresh(narrative)

    return narrative
