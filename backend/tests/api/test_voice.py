"""
TDD Tests for Voice API Endpoints

Tests for voice call API endpoints following TDD principles.
"""
import pytest
from httpx import AsyncClient
from unittest.mock import patch

from app.models.master_admin import VoiceCall, AdminProspect


def _create_prospect(db_session, user_id: str) -> AdminProspect:
    prospect = AdminProspect(
        user_id=user_id,
        name="Prospect",
        phone="+15555555555",
        email="prospect@example.com",
    )
    db_session.add(prospect)
    db_session.commit()
    db_session.refresh(prospect)
    return prospect


def _create_voice_call(db_session, organization_id: str, user_id: str) -> VoiceCall:
    prospect = AdminProspect(
        user_id=user_id,
        name="Call Prospect",
        phone="+14444444444",
        email="call@example.com",
    )
    db_session.add(prospect)
    db_session.commit()
    db_session.refresh(prospect)

    call = VoiceCall(
        organization_id=organization_id,
        contact_id=prospect.id,
        phone_number="+15555555555",
        status="queued",
    )
    db_session.add(call)
    db_session.commit()
    db_session.refresh(call)
    return call


class TestCreateVoiceAgent:
    """Test POST /api/master-admin/voice/agents endpoint."""
    
    @pytest.mark.asyncio
    @patch('app.services.voice_service.requests.post')
    async def test_create_voice_agent(self, mock_post, async_client: AsyncClient, auth_headers_master_admin: dict):
        """Test creating a voice agent."""
        mock_response = type('MockResponse', (), {
            'status_code': 201,
            'json': lambda: {
                "id": "agent-123",
                "name": "Sales Agent",
                "status": "active",
            }
        })()
        mock_post.return_value = mock_response
        
        agent_data = {
            "name": "Sales Agent",
            "voice": "alloy",
            "instructions": "You are a professional sales agent.",
        }
        
        response = await async_client.post(
            "/api/master-admin/voice/agents",
            json=agent_data,
            headers=auth_headers_master_admin
        )
        assert response.status_code == 201
        data = response.json()
        assert data["id"] == "agent-123"


class TestMakeVoiceCall:
    """Test POST /api/master-admin/voice/calls endpoint."""
    
    @pytest.mark.asyncio
    @patch('app.services.voice_service.requests.post')
    async def test_make_voice_call(
        self,
        mock_post,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test initiating a voice call."""
        mock_response = type('MockResponse', (), {
            'status_code': 201,
            'json': lambda: {
                "id": "call-123",
                "status": "queued",
            }
        })()
        mock_post.return_value = mock_response
        
        prospect = _create_prospect(db_session, master_admin_user.id)

        call_data = {
            "agent_id": "agent-123",
            "phone_number": prospect.phone,
            "contact_id": prospect.id,
        }

        response = await async_client.post(
            "/api/master-admin/voice/calls",
            json=call_data,
            headers=auth_headers_master_admin
        )
        assert response.status_code == 201
        data = response.json()
        assert data["phone_number"] == prospect.phone


class TestGetVoiceCallStatus:
    """Test GET /api/master-admin/voice/calls/{id} endpoint."""
    
    @pytest.mark.asyncio
    async def test_get_voice_call_status(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test getting voice call status."""
        call = _create_voice_call(db_session, master_admin_user.organization_id, master_admin_user.id)

        response = await async_client.get(
            f"/api/master-admin/voice/calls/{call.id}",
            headers=auth_headers_master_admin
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == call.id


class TestVoiceWebhook:
    """Test POST /api/webhooks/voice/incoming endpoint."""
    
    @pytest.mark.asyncio
    @patch('app.services.voice_service.handle_voice_webhook', return_value={"status": "processed"})
    async def test_voice_webhook(self, mock_handler, async_client: AsyncClient, db_session):
        """Test processing incoming voice webhook."""
        webhook_data = {
            "event": "call.completed",
            "call_id": "call-123",
            "status": "completed",
            "duration": 120,
            "transcript": "Test conversation",
        }

        response = await async_client.post(
            "/api/webhooks/voice/incoming",
            json=webhook_data
        )
        assert response.status_code == 200
        assert response.json() == {"status": "processed"}
        mock_handler.assert_called_once()

