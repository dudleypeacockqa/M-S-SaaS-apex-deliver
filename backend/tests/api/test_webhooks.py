"""
TDD Tests for Webhook API Routes

Tests for webhook management endpoints following TDD principles.
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session

from app.models.master_admin import Webhook, WebhookDelivery
from app.models.user import User
from app.models.organization import Organization


class TestCreateWebhook:
    """Test webhook creation."""
    
    async def test_create_webhook(self, async_client: AsyncClient, auth_headers_master_admin: dict, test_user: User, test_org: Organization, db: Session):
        """Test creating a webhook configuration."""
        webhook_data = {
            "name": "Test Webhook",
            "url": "https://example.com/webhook",
            "events": ["campaign.sent", "voice.call.completed"],
            "is_active": True,
        }
        
        response = await async_client.post(
            "/api/master-admin/webhooks",
            json=webhook_data,
            headers=auth_headers_master_admin
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Webhook"
        assert data["url"] == "https://example.com/webhook"
        assert len(data["events"]) == 2
        assert data["is_active"] is True


class TestListWebhooks:
    """Test webhook listing."""
    
    async def test_list_webhooks(self, async_client: AsyncClient, auth_headers_master_admin: dict, test_user: User, test_org: Organization, db: Session):
        """Test listing webhooks."""
        # Create a test webhook
        webhook = Webhook(
            organization_id=str(test_org.id),
            name="Test Webhook",
            url="https://example.com/webhook",
            events=["campaign.sent"],
            created_by=str(test_user.id),
        )
        db.add(webhook)
        db.commit()
        
        response = await async_client.get(
            "/api/master-admin/webhooks",
            headers=auth_headers_master_admin
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert len(data["items"]) >= 1


class TestGetWebhook:
    """Test getting a specific webhook."""
    
    async def test_get_webhook(self, async_client: AsyncClient, auth_headers_master_admin: dict, test_user: User, test_org: Organization, db: Session):
        """Test getting a specific webhook."""
        # Create a test webhook
        webhook = Webhook(
            organization_id=str(test_org.id),
            name="Test Webhook",
            url="https://example.com/webhook",
            events=["campaign.sent"],
            created_by=str(test_user.id),
        )
        db.add(webhook)
        db.commit()
        db.refresh(webhook)
        
        response = await async_client.get(
            f"/api/master-admin/webhooks/{webhook.id}",
            headers=auth_headers_master_admin
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == webhook.id
        assert data["name"] == "Test Webhook"


class TestUpdateWebhook:
    """Test webhook updates."""
    
    async def test_update_webhook(self, async_client: AsyncClient, auth_headers_master_admin: dict, test_user: User, test_org: Organization, db: Session):
        """Test updating a webhook."""
        # Create a test webhook
        webhook = Webhook(
            organization_id=str(test_org.id),
            name="Test Webhook",
            url="https://example.com/webhook",
            events=["campaign.sent"],
            created_by=str(test_user.id),
        )
        db.add(webhook)
        db.commit()
        db.refresh(webhook)
        
        update_data = {
            "name": "Updated Webhook",
            "is_active": False,
        }
        
        response = await async_client.put(
            f"/api/master-admin/webhooks/{webhook.id}",
            json=update_data,
            headers=auth_headers_master_admin
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Webhook"
        assert data["is_active"] is False


class TestDeleteWebhook:
    """Test webhook deletion."""
    
    async def test_delete_webhook(self, async_client: AsyncClient, auth_headers_master_admin: dict, test_user: User, test_org: Organization, db: Session):
        """Test deleting a webhook."""
        # Create a test webhook
        webhook = Webhook(
            organization_id=str(test_org.id),
            name="Test Webhook",
            url="https://example.com/webhook",
            events=["campaign.sent"],
            created_by=str(test_user.id),
        )
        db.add(webhook)
        db.commit()
        db.refresh(webhook)
        webhook_id = webhook.id
        
        response = await async_client.delete(
            f"/api/master-admin/webhooks/{webhook_id}",
            headers=auth_headers_master_admin
        )
        
        assert response.status_code == 204
        
        # Verify webhook is deleted
        from sqlalchemy import select
        result = db.execute(select(Webhook).where(Webhook.id == webhook_id))
        assert result.scalar_one_or_none() is None


class TestVoiceWebhook:
    """Test voice webhook endpoint."""
    
    async def test_handle_voice_webhook(self, async_client: AsyncClient, db: Session):
        """Test handling incoming voice webhook."""
        webhook_data = {
            "event": "call.completed",
            "call_id": "call-123",
            "status": "completed",
            "duration": 120,
        }
        
        response = await async_client.post(
            "/api/master-admin/webhooks/voice/incoming",
            json=webhook_data
        )
        
        # Should return 200 even if processing fails (to prevent retries)
        assert response.status_code == 200

