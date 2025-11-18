"""
PMI Dependency Service - Workstream dependency analysis
Uses GPT-4 for dependency identification and Claude for optimization
"""

from __future__ import annotations

import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.services.pmi_ai_service import openai_client, anthropic_client
from app.models.pmi import PMIProject, PMIWorkstream, PMIWorkstreamType


async def analyze_workstream_dependencies(
    project_id: str,
    organization_id: str,
    db: Session,
) -> List[Dict[str, Any]]:
    """
    Use GPT-4 to identify dependencies between workstreams.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        List of dependencies with source, target, and type
    """
    workstreams = db.scalars(
        select(PMIWorkstream).where(
            PMIWorkstream.project_id == project_id,
            PMIWorkstream.organization_id == organization_id,
        )
    ).all()
    
    if len(workstreams) < 2:
        return []
    
    # Build prompt for GPT-4
    prompt = f"""Analyze the following PMI workstreams and identify dependencies between them.

## Workstreams
"""
    for ws in workstreams:
        prompt += f"""
- {ws.name} (ID: {ws.id})
  Type: {ws.workstream_type.value}
  Status: {ws.status.value}
  Progress: {ws.progress_percentage}%
  Phase: {ws.phase.value if ws.phase else 'N/A'}
"""
    
    prompt += """
## Task
Identify dependencies between workstreams. A dependency means one workstream must complete certain tasks before another can proceed effectively.

For each dependency, provide:
1. Source workstream ID (the one that must complete first)
2. Target workstream ID (the one that depends on the source)
3. Dependency type (blocking, informational, resource)
4. Description of the dependency
5. Criticality (high, medium, low)

Format as JSON array with keys: source_workstream_id, target_workstream_id, dependency_type, description, criticality.
"""
    
    # Call OpenAI API
    response = await openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a PMI dependency analysis expert. Always respond with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    
    content = response.choices[0].message.content
    try:
        data = json.loads(content)
        dependencies = data.get("dependencies", []) if isinstance(data, dict) else data
        return dependencies if isinstance(dependencies, list) else []
    except json.JSONDecodeError:
        return []


async def optimize_workstream_sequence(
    project_id: str,
    organization_id: str,
    db: Session,
    dependencies: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Use Claude to reason about optimal workstream execution order.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        dependencies: Optional pre-analyzed dependencies
        
    Returns:
        Optimized sequence with reasoning
    """
    if dependencies is None:
        dependencies = await analyze_workstream_dependencies(project_id, organization_id, db)
    
    workstreams = db.scalars(
        select(PMIWorkstream).where(
            PMIWorkstream.project_id == project_id,
            PMIWorkstream.organization_id == organization_id,
        )
    ).all()
    
    prompt = f"""You are a senior PMI consultant. Analyze workstream dependencies and recommend an optimal execution sequence.

## Workstreams
"""
    for ws in workstreams:
        prompt += f"- {ws.name} ({ws.workstream_type.value}): {ws.status.value}, {ws.progress_percentage}% complete\n"
    
    prompt += f"""
## Dependencies
{json.dumps(dependencies, indent=2)}

## Task
Provide an optimized execution sequence that:
1. Respects all dependencies
2. Maximizes parallel execution where possible
3. Prioritizes critical path workstreams
4. Balances resource allocation

Format as JSON with:
- sequence: Array of workstream IDs in recommended execution order
- parallel_groups: Array of arrays showing which workstreams can run in parallel
- critical_path: Array of workstream IDs on the critical path
- reasoning: Explanation of the sequence
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
            "sequence": [ws.id for ws in workstreams],
            "parallel_groups": [],
            "critical_path": [],
            "reasoning": content,
        }


async def detect_critical_path(
    project_id: str,
    organization_id: str,
    db: Session,
) -> List[str]:
    """
    Identify workstreams on the critical path.
    
    Args:
        project_id: PMI project ID
        organization_id: Organization ID
        db: Database session
        
    Returns:
        List of workstream IDs on critical path
    """
    optimization = await optimize_workstream_sequence(project_id, organization_id, db)
    return optimization.get("critical_path", [])

