"""
PMI AI Service - AI-powered features for Post-Merger Integration
Uses GPT-4 for analysis and Claude for reasoning
"""

from __future__ import annotations

import json
from typing import List, Dict, Optional, Any
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select

try:
    from openai import AsyncOpenAI
    _OPENAI_AVAILABLE = True
except ModuleNotFoundError:
    AsyncOpenAI = None
    _OPENAI_AVAILABLE = False

try:
    from anthropic import AsyncAnthropic
    _ANTHROPIC_AVAILABLE = True
except ModuleNotFoundError:
    AsyncAnthropic = None
    _ANTHROPIC_AVAILABLE = False

from app.models.pmi import (
    PMIProject,
    PMIWorkstream,
    PMIRisk,
    PMISynergy,
    PMIRiskSeverity,
    PMIRiskStatus,
    PMISynergyCategory,
    PMISynergyStatus,
)
from app.models.deal import Deal
from app.core.config import get_settings


# Lazy OpenAI client proxy
_openai_client_instance = None


class _MissingOpenAIClient:
    """Placeholder when OpenAI SDK is unavailable."""
    class chat:
        class completions:
            @staticmethod
            async def create(*_args, **_kwargs):
                raise ModuleNotFoundError("openai package is not installed.")


class _OpenAIClientProxy:
    """Proxy that lazily instantiates AsyncOpenAI when available."""
    async def _ensure_async(self):
        return self

    def __getattr__(self, name):
        if name.startswith('_'):
            raise AttributeError(name)
        global _openai_client_instance
        if _openai_client_instance is None:
            if not _OPENAI_AVAILABLE:
                _openai_client_instance = _MissingOpenAIClient()
            else:
                settings = get_settings()
                api_key = settings.openai_api_key
                if not api_key:
                    # Don't raise error at import time - allow graceful degradation
                    _openai_client_instance = _MissingOpenAIClient()
                else:
                    _openai_client_instance = AsyncOpenAI(api_key=api_key)
        return getattr(_openai_client_instance, name)


openai_client = _OpenAIClientProxy()


# Lazy Anthropic client proxy
_anthropic_client_instance = None


class _MissingAnthropicClient:
    """Placeholder when Anthropic SDK is unavailable."""
    class messages:
        @staticmethod
        async def create(*_args, **_kwargs):
            raise ModuleNotFoundError("anthropic package is not installed.")


class _AnthropicClientProxy:
    """Proxy that lazily instantiates AsyncAnthropic when available."""
    async def _ensure_async(self):
        return self

    def __getattr__(self, name):
        if name.startswith('_'):
            raise AttributeError(name)
        global _anthropic_client_instance
        if _anthropic_client_instance is None:
            if not _ANTHROPIC_AVAILABLE:
                _anthropic_client_instance = _MissingAnthropicClient()
            else:
                settings = get_settings()
                api_key = settings.anthropic_api_key
                if not api_key:
                    # Don't raise error at import time - allow graceful degradation
                    _anthropic_client_instance = _MissingAnthropicClient()
                else:
                    _anthropic_client_instance = AsyncAnthropic(api_key=api_key)
        return getattr(_anthropic_client_instance, name)


anthropic_client = _AnthropicClientProxy()


async def identify_risks_from_project_data(
    project_id: str,
    organization_id: str,
    db: Session,
) -> List[Dict[str, Any]]:
    """
    Use GPT-4 to analyze PMI project data and identify potential risks.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        List of identified risks with title, description, severity, and mitigation suggestions
    """
    # Fetch project and related data
    project = db.scalar(
        select(PMIProject).where(
            PMIProject.id == project_id,
            PMIProject.organization_id == organization_id,
        )
    )
    if not project:
        raise ValueError(f"PMI project {project_id} not found")
    
    deal = db.scalar(select(Deal).where(Deal.id == project.deal_id))
    workstreams = db.scalars(
        select(PMIWorkstream).where(PMIWorkstream.project_id == project_id)
    ).all()
    existing_risks = db.scalars(
        select(PMIRisk).where(PMIRisk.project_id == project_id)
    ).all()
    
    # Build prompt for GPT-4
    prompt = f"""You are a senior M&A integration consultant. Analyze the following PMI project data and identify potential risks that could impact the integration success.

## Project Information
- Project Name: {project.name}
- Status: {project.status.value}
- Current Phase: {project.current_phase.value if project.current_phase else 'N/A'}
- Target Completion: {project.target_completion_date.strftime('%Y-%m-%d') if project.target_completion_date else 'N/A'}

## Deal Information
- Deal Name: {deal.name if deal else 'N/A'}
- Target Company: {deal.target_company if deal else 'N/A'}
- Deal Size: {deal.deal_size if deal and deal.deal_size else 'N/A'}

## Workstreams
"""
    for ws in workstreams:
        prompt += f"- {ws.name} ({ws.workstream_type.value}): Status={ws.status.value}, Progress={ws.progress_percentage}%\n"
    
    prompt += f"""
## Existing Risks
"""
    for risk in existing_risks:
        prompt += f"- {risk.title}: {risk.severity.value}, Status={risk.status.value}\n"
    
    prompt += """
## Task
Identify 5-10 additional potential risks that are not already in the list above. For each risk, provide:
1. A clear, concise title
2. A detailed description of the risk
3. Severity level (low, medium, high, critical)
4. Initial mitigation strategy suggestion

Format your response as a JSON array of objects with keys: title, description, severity, mitigation_suggestion.
"""
    
    # Call OpenAI API
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a senior M&A integration risk analyst. Always respond with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    
    # Parse response
    content = response.choices[0].message.content
    try:
        data = json.loads(content)
        risks = data.get("risks", []) if isinstance(data, dict) else data
        return risks if isinstance(risks, list) else []
    except json.JSONDecodeError:
        # Fallback: try to extract JSON from text
        import re
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return []


async def analyze_risk_mitigation_strategies(
    risk_title: str,
    risk_description: str,
    severity: str,
    project_context: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Use Claude to provide reasoning-based risk mitigation recommendations.
    
    Args:
        risk_title: Risk title
        risk_description: Risk description
        severity: Risk severity level
        project_context: Additional project context
        
    Returns:
        Detailed mitigation strategy with reasoning
    """
    prompt = f"""You are a senior M&A integration consultant specializing in risk mitigation. Analyze the following risk and provide a comprehensive mitigation strategy with clear reasoning.

## Risk Details
- Title: {risk_title}
- Description: {risk_description}
- Severity: {severity}

## Project Context
- Project Phase: {project_context.get('phase', 'N/A')}
- Workstream Type: {project_context.get('workstream_type', 'N/A')}
- Days into PMI: {project_context.get('days_into_pmi', 'N/A')}

## Task
Provide a detailed mitigation strategy that includes:
1. Immediate actions (next 7 days)
2. Short-term actions (next 30 days)
3. Long-term actions (next 90 days)
4. Key stakeholders to involve
5. Success metrics to track
6. Reasoning for why this approach will be effective

Format your response as JSON with keys: immediate_actions, short_term_actions, long_term_actions, stakeholders, success_metrics, reasoning.
"""
    
    # Call Anthropic API
    response = await anthropic_client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
    
    # Parse response
    content = response.content[0].text
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # Return structured response even if JSON parsing fails
        return {
            "reasoning": content,
            "immediate_actions": [],
            "short_term_actions": [],
            "long_term_actions": [],
            "stakeholders": [],
            "success_metrics": [],
        }


async def predict_risk_escalation(
    project_id: str,
    organization_id: str,
    db: Session,
) -> List[Dict[str, Any]]:
    """
    Use GPT-4 to predict which risks may escalate based on patterns.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        List of risks with escalation predictions
    """
    risks = db.scalars(
        select(PMIRisk).where(
            PMIRisk.project_id == project_id,
            PMIRisk.organization_id == organization_id,
        )
    ).all()
    
    if not risks:
        return []
    
    # Build prompt
    prompt = f"""Analyze the following PMI risks and predict which ones are most likely to escalate in severity.

## Current Risks
"""
    for risk in risks:
        prompt += f"""
- {risk.title}
  Severity: {risk.severity.value}
  Status: {risk.status.value}
  Description: {risk.description or 'N/A'}
  Mitigation: {risk.mitigation_plan or 'None'}
"""
    
    prompt += """
## Task
For each risk, predict:
1. Likelihood of escalation (low, medium, high)
2. Potential new severity level if escalated
3. Timeframe for escalation (days)
4. Key indicators to watch

Format as JSON array with keys: risk_id, escalation_likelihood, potential_severity, timeframe_days, indicators.
"""
    
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a risk prediction analyst. Respond with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1500,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    
    content = response.choices[0].message.content
    try:
        data = json.loads(content)
        predictions = data.get("predictions", []) if isinstance(data, dict) else data
        return predictions if isinstance(predictions, list) else []
    except json.JSONDecodeError:
        return []


async def suggest_synergy_opportunities(
    project_id: str,
    organization_id: str,
    db: Session,
) -> List[Dict[str, Any]]:
    """
    Use GPT-4 to analyze deal data and suggest synergy opportunities.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        List of suggested synergies
    """
    project = db.scalar(
        select(PMIProject).where(
            PMIProject.id == project_id,
            PMIProject.organization_id == organization_id,
        )
    )
    if not project:
        raise ValueError(f"PMI project {project_id} not found")
    
    deal = db.scalar(select(Deal).where(Deal.id == project.deal_id))
    workstreams = db.scalars(
        select(PMIWorkstream).where(PMIWorkstream.project_id == project_id)
    ).all()
    existing_synergies = db.scalars(
        select(PMISynergy).where(PMISynergy.project_id == project_id)
    ).all()
    
    prompt = f"""You are a senior M&A integration consultant. Analyze this deal and suggest synergy opportunities.

## Deal Information
- Deal Name: {deal.name if deal else 'N/A'}
- Target Company: {deal.target_company if deal else 'N/A'}
- Industry: {deal.industry if deal else 'N/A'}
- Deal Size: {deal.deal_size if deal and deal.deal_size else 'N/A'}

## Workstreams
"""
    for ws in workstreams:
        prompt += f"- {ws.name} ({ws.workstream_type.value})\n"
    
    prompt += f"""
## Existing Synergies
"""
    for syn in existing_synergies:
        prompt += f"- {syn.name}: {syn.category.value}, Planned={syn.planned_value}, Status={syn.status.value}\n"
    
    prompt += """
## Task
Identify 5-10 additional synergy opportunities across cost, revenue, and operational efficiency categories. For each, provide:
1. Name
2. Category (cost_synergy, revenue_synergy, operational_efficiency)
3. Estimated value (in GBP)
4. Realization timeline (days)
5. Key dependencies

Format as JSON array with keys: name, category, estimated_value, timeline_days, dependencies.
"""
    
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a synergy identification expert. Respond with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    
    content = response.choices[0].message.content
    try:
        data = json.loads(content)
        synergies = data.get("synergies", []) if isinstance(data, dict) else data
        return synergies if isinstance(synergies, list) else []
    except json.JSONDecodeError:
        return []


async def validate_synergy_feasibility(
    synergy_name: str,
    synergy_category: str,
    estimated_value: float,
    project_context: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Use Claude to reason about synergy realization likelihood.
    
    Args:
        synergy_name: Synergy name
        synergy_category: Synergy category
        estimated_value: Estimated value
        project_context: Project context
        
    Returns:
        Feasibility analysis with reasoning
    """
    prompt = f"""You are a senior M&A integration consultant. Evaluate the feasibility of realizing this synergy.

## Synergy Details
- Name: {synergy_name}
- Category: {synergy_category}
- Estimated Value: £{estimated_value:,.2f}

## Project Context
- Project Phase: {project_context.get('phase', 'N/A')}
- Days into PMI: {project_context.get('days_into_pmi', 'N/A')}
- Workstream Status: {project_context.get('workstream_status', 'N/A')}

## Task
Provide a feasibility assessment including:
1. Realization likelihood (0-100%)
2. Key success factors
3. Potential blockers
4. Recommended approach
5. Risk factors
6. Reasoning for the assessment

Format as JSON with keys: likelihood_percent, success_factors, blockers, recommended_approach, risk_factors, reasoning.
"""
    
    response = await anthropic_client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
    
    content = response.content[0].text
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "likelihood_percent": 50,
            "reasoning": content,
            "success_factors": [],
            "blockers": [],
            "recommended_approach": "",
            "risk_factors": [],
        }


async def optimize_synergy_timing(
    project_id: str,
    organization_id: str,
    db: Session,
) -> Dict[str, Any]:
    """
    Use GPT-4 to suggest optimal synergy realization timeline.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        Optimized timing recommendations
    """
    synergies = db.scalars(
        select(PMISynergy).where(
            PMISynergy.project_id == project_id,
            PMISynergy.organization_id == organization_id,
        )
    ).all()
    
    if not synergies:
        return {"recommendations": []}
    
    prompt = f"""Analyze the following synergies and recommend an optimal realization timeline.

## Synergies
"""
    for syn in synergies:
        prompt += f"""
- {syn.name} ({syn.category.value})
  Planned Value: £{syn.planned_value:,.2f}
  Target Date: {syn.target_date.strftime('%Y-%m-%d') if syn.target_date else 'Not set'}
  Status: {syn.status.value}
"""
    
    prompt += """
## Task
Provide an optimized timeline that:
1. Prioritizes quick wins
2. Sequences dependencies correctly
3. Balances resource allocation
4. Maximizes early value realization

Format as JSON with recommendations array containing: synergy_id, recommended_start_day, recommended_completion_day, priority, reasoning.
"""
    
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a PMI timeline optimization expert. Respond with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    
    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {"recommendations": []}


async def generate_best_practices(
    project_phase: str,
    workstream_type: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Use GPT-4 to provide industry best practices based on project phase.
    
    Args:
        project_phase: Current PMI phase (stabilization, integration, optimization)
        workstream_type: Optional workstream type filter
        
    Returns:
        Best practices recommendations
    """
    prompt = f"""You are a senior M&A integration consultant with 20+ years of experience. Provide industry best practices for PMI projects.

## Current Phase
- Phase: {project_phase}
- Workstream Focus: {workstream_type or 'All workstreams'}

## Task
Provide best practices including:
1. Key success factors for this phase
2. Common pitfalls to avoid
3. Recommended actions
4. Industry benchmarks
5. Lessons learned from similar integrations

Format as JSON with keys: success_factors, pitfalls, recommended_actions, benchmarks, lessons_learned.
"""
    
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a PMI best practices expert. Respond with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    
    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "success_factors": [],
            "pitfalls": [],
            "recommended_actions": [],
            "benchmarks": {},
            "lessons_learned": [],
        }


async def recommend_actions(
    project_id: str,
    organization_id: str,
    db: Session,
) -> List[Dict[str, Any]]:
    """
    Use Claude to reason about next steps based on current project state.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        Recommended actions with reasoning
    """
    project = db.scalar(
        select(PMIProject).where(
            PMIProject.id == project_id,
            PMIProject.organization_id == organization_id,
        )
    )
    if not project:
        raise ValueError(f"PMI project {project_id} not found")
    
    workstreams = db.scalars(
        select(PMIWorkstream).where(PMIWorkstream.project_id == project_id)
    ).all()
    risks = db.scalars(
        select(PMIRisk).where(PMIRisk.project_id == project_id)
    ).all()
    synergies = db.scalars(
        select(PMISynergy).where(PMISynergy.project_id == project_id)
    ).all()
    
    prompt = f"""Analyze this PMI project and recommend the top 5-7 priority actions for the next 30 days.

## Project State
- Phase: {project.current_phase.value if project.current_phase else 'N/A'}
- Status: {project.status.value}
- Days into PMI: {(datetime.now(timezone.utc) - project.close_date).days if project.close_date else 'N/A'}

## Workstreams
"""
    for ws in workstreams:
        prompt += f"- {ws.name}: {ws.status.value}, {ws.progress_percentage}% complete\n"
    
    prompt += f"""
## Risks
- Total: {len(risks)}
- High/Critical: {len([r for r in risks if r.severity.value in ['high', 'critical']])}

## Synergies
- Total: {len(synergies)}
- Realized: {len([s for s in synergies if s.status.value == 'realized'])}
"""
    
    prompt += """
## Task
Recommend 5-7 priority actions with:
1. Action description
2. Priority (high, medium, low)
3. Owner recommendation
4. Timeline (days)
5. Expected impact
6. Reasoning

Format as JSON array with keys: action, priority, recommended_owner, timeline_days, expected_impact, reasoning.
"""
    
    response = await anthropic_client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )
    
    content = response.content[0].text
    try:
        data = json.loads(content)
        actions = data.get("actions", []) if isinstance(data, dict) else data
        return actions if isinstance(actions, list) else []
    except json.JSONDecodeError:
        return []


async def benchmark_against_industry(
    project_id: str,
    organization_id: str,
    db: Session,
) -> Dict[str, Any]:
    """
    Compare project metrics to industry standards using GPT-4.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        Benchmark comparison results
    """
    project = db.scalar(
        select(PMIProject).where(
            PMIProject.id == project_id,
            PMIProject.organization_id == organization_id,
        )
    )
    if not project:
        raise ValueError(f"PMI project {project_id} not found")
    
    workstreams = db.scalars(
        select(PMIWorkstream).where(PMIWorkstream.project_id == project_id)
    ).all()
    synergies = db.scalars(
        select(PMISynergy).where(PMISynergy.project_id == project_id)
    ).all()
    
    days_into_pmi = (datetime.now(timezone.utc) - project.close_date).days if project.close_date else 0
    avg_progress = sum(ws.progress_percentage for ws in workstreams) / len(workstreams) if workstreams else 0
    srr = sum(s.realized_value or 0 for s in synergies) / sum(s.planned_value for s in synergies) * 100 if synergies and sum(s.planned_value for s in synergies) > 0 else 0
    
    prompt = f"""Compare this PMI project's performance against industry benchmarks.

## Project Metrics
- Days into PMI: {days_into_pmi}
- Average Workstream Progress: {avg_progress:.1f}%
- Synergy Realization Rate: {srr:.1f}%
- Number of Workstreams: {len(workstreams)}
- Number of Synergies: {len(synergies)}

## Task
Compare against industry standards and provide:
1. Performance rating (above average, average, below average) for each metric
2. Industry benchmarks for comparison
3. Areas of strength
4. Areas for improvement
5. Recommendations

Format as JSON with keys: performance_ratings, benchmarks, strengths, improvements, recommendations.
"""
    
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a PMI benchmarking expert. Respond with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    
    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "performance_ratings": {},
            "benchmarks": {},
            "strengths": [],
            "improvements": [],
            "recommendations": [],
        }

