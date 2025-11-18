"""
Voice API Routes

API endpoints for AI-powered voice outreach.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_master_admin_user

# Keep backwards-compatible alias during rollout
get_current_user = get_current_master_admin_user
from app.db.session import get_db
from app.models.user import User
from app.models.organization import Organization
from sqlalchemy import select
from app.schemas.master_admin import (
    VoiceCallCreate,
    VoiceCallResponse,
    VoiceAgentCreate,
    VoiceAgentResponse,
)
from app.services import voice_service

router = APIRouter(prefix="/master-admin/voice", tags=["voice"])


@router.post("/agents", response_model=VoiceAgentResponse, status_code=status.HTTP_201_CREATED)
def create_voice_agent(
    agent_data: VoiceAgentCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Create a Synthflow AI agent.
    
    Args:
        agent_data: Agent configuration
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created agent information
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    agent_dict = agent_data.model_dump()
    agent = voice_service.create_synthflow_agent(
        agent_dict,
        str(organization.id),
        str(current_user.id),
        db
    )
    return agent


@router.get("/agents", response_model=list[VoiceAgentResponse])
def list_voice_agents(
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    List Synthflow agents.
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of agents
    """
    # This would call Synthflow API to list agents
    # For now, return empty list until implemented
    # agents = voice_service.list_synthflow_agents(db)
    # return agents
    return []


@router.post("/calls", response_model=VoiceCallResponse, status_code=status.HTTP_201_CREATED)
def make_voice_call(
    call_data: VoiceCallCreate,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Initiate a voice call via Synthflow.
    
    Args:
        call_data: Voice call configuration
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created voice call record
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    call_dict = call_data.model_dump()
    voice_call = voice_service.make_voice_call(
        call_dict,
        call_dict["contact_id"],
        str(organization.id),
        db,
        campaign_id=call_dict.get("campaign_id")
    )
    return voice_call


@router.get("/calls/{call_id}", response_model=VoiceCallResponse)
def get_voice_call_status(
    call_id: int,
    current_user: User = Depends(get_current_master_admin_user),
    db: Session = Depends(get_db),
):
    """
    Get voice call status.
    
    Args:
        call_id: Voice call ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Voice call details
        
    Raises:
        HTTPException: If call not found
    """
    org_result = db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    organization = org_result.scalar_one_or_none()
    
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    voice_call = voice_service.get_voice_call_status(call_id, db)
    
    if not voice_call or voice_call.organization_id != str(organization.id):
        raise HTTPException(status_code=404, detail="Voice call not found")
    
    return voice_call

