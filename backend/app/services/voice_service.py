"""
Voice Service

Service for AI-powered voice outreach via Synthflow API.
"""
import os
import requests
from typing import Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.master_admin import VoiceCall, AdminProspect, AdminCampaign
from app.models.organization import Organization


SYNTHFLOW_API_URL = os.getenv("SYNTHFLOW_API_URL", "https://api.synthflow.ai/v1")
SYNTHFLOW_API_KEY = os.getenv("SYNTHFLOW_API_KEY")


def create_synthflow_agent(
    agent_data: Dict,
    organization_id: str,
    user_id: str,
    db: Session
) -> Dict:
    """
    Create an AI agent in Synthflow.
    
    Args:
        agent_data: Dictionary with agent configuration
        organization_id: Organization ID
        user_id: User ID creating the agent
        db: Database session
        
    Returns:
        Dictionary with created agent data
        
    Raises:
        Exception: If API call fails
    """
    if not SYNTHFLOW_API_KEY:
        raise ValueError("Synthflow API key not configured")
    
    url = f"{SYNTHFLOW_API_URL}/agents"
    headers = {
        "Authorization": f"Bearer {SYNTHFLOW_API_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "name": agent_data["name"],
        "voice": agent_data.get("voice", "alloy"),
        "personality": agent_data.get("personality", "professional"),
        "instructions": agent_data["instructions"],
        "phone_number": agent_data.get("phone_number"),
        "webhook_url": agent_data.get("webhook_url"),
        "max_call_duration": agent_data.get("max_call_duration", 300),
        "language": agent_data.get("language", "en-US"),
    }
    
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    
    if response.status_code != 201:
        raise Exception(f"Failed to create Synthflow agent: {response.status_code} {response.text}")
    
    return response.json()


def make_voice_call(
    call_data: Dict,
    contact_id: int,
    organization_id: str,
    db: Session,
    campaign_id: Optional[int] = None
) -> VoiceCall:
    """
    Initiate a voice call via Synthflow API.
    
    Args:
        call_data: Dictionary with call configuration (agent_id, phone_number, metadata)
        contact_id: Contact/Prospect ID
        organization_id: Organization ID
        db: Database session
        campaign_id: Optional campaign ID
        
    Returns:
        Created VoiceCall instance
        
    Raises:
        Exception: If API call fails
    """
    if not SYNTHFLOW_API_KEY:
        raise ValueError("Synthflow API key not configured")
    
    # Get prospect
    prospect_result = db.execute(
        select(AdminProspect).where(AdminProspect.id == contact_id)
    )
    prospect = prospect_result.scalar_one_or_none()
    
    if not prospect:
        raise ValueError(f"Contact {contact_id} not found")
    
    phone_number = call_data.get("phone_number") or prospect.phone
    if not phone_number:
        raise ValueError("Phone number required for voice call")
    
    # Create voice call record
    voice_call = VoiceCall(
        organization_id=organization_id,
        campaign_id=campaign_id,
        contact_id=contact_id,
        phone_number=phone_number,
        status="queued",
        metadata=call_data.get("metadata", {}),
        synthflow_agent_id=call_data.get("agent_id"),
    )
    db.add(voice_call)
    db.commit()
    db.refresh(voice_call)
    
    # Make API call to Synthflow
    url = f"{SYNTHFLOW_API_URL}/calls"
    headers = {
        "Authorization": f"Bearer {SYNTHFLOW_API_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "agent_id": call_data["agent_id"],
        "phone_number": phone_number,
        "metadata": {
            "voice_call_id": voice_call.id,
            "contact_id": contact_id,
            "campaign_id": campaign_id,
            **(call_data.get("metadata", {})),
        },
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code != 201:
            voice_call.status = "failed"
            voice_call.metadata = {
                **(voice_call.metadata or {}),
                "error": f"API error: {response.status_code} {response.text}",
            }
            db.commit()
            raise Exception(f"Failed to initiate voice call: {response.status_code} {response.text}")
        
        call_response = response.json()
        voice_call.synthflow_call_id = call_response.get("id")
        voice_call.status = call_response.get("status", "queued")
        db.commit()
        db.refresh(voice_call)
        
    except requests.RequestException as e:
        voice_call.status = "failed"
        voice_call.metadata = {
            **(voice_call.metadata or {}),
            "error": str(e),
        }
        db.commit()
        raise
    
    return voice_call


def handle_voice_webhook(webhook_data: Dict, db: Session) -> Dict:
    """
    Process incoming voice call webhook from Synthflow.
    
    Args:
        webhook_data: Webhook payload from Synthflow
        db: Database session
        
    Returns:
        Dictionary with processed webhook data
    """
    event = webhook_data.get("event")
    call_id = webhook_data.get("call_id")
    
    if not call_id:
        raise ValueError("call_id required in webhook data")
    
    # Find voice call by synthflow_call_id
    result = db.execute(
        select(VoiceCall).where(VoiceCall.synthflow_call_id == call_id)
    )
    voice_call = result.scalar_one_or_none()
    
    if not voice_call:
        # Try to find by metadata
        # This is a fallback if call_id doesn't match
        return {"status": "voice_call_not_found"}
    
    # Update based on event type
    if event == "call.started":
        voice_call.status = "in_progress"
    elif event == "call.completed":
        voice_call.status = "completed"
        voice_call.duration = webhook_data.get("duration")
        voice_call.recording_url = webhook_data.get("recording_url")
        voice_call.transcript = webhook_data.get("transcript")
    elif event == "call.failed":
        voice_call.status = "failed"
        voice_call.metadata = {
            **(voice_call.metadata or {}),
            "error": webhook_data.get("error_message"),
        }
    elif event == "call.cancelled":
        voice_call.status = "cancelled"
    
    # Update metadata
    if webhook_data.get("metadata"):
        voice_call.metadata = {
            **(voice_call.metadata or {}),
            **webhook_data.get("metadata", {}),
        }
    
    db.commit()
    db.refresh(voice_call)
    
    return {
        "status": "processed",
        "voice_call": voice_call,
    }


def get_voice_call_status(voice_call_id: int, db: Session) -> Optional[VoiceCall]:
    """
    Get voice call status.
    
    Args:
        voice_call_id: Voice call ID
        db: Database session
        
    Returns:
        VoiceCall instance or None if not found
    """
    result = db.execute(
        select(VoiceCall).where(VoiceCall.id == voice_call_id)
    )
    return result.scalar_one_or_none()

