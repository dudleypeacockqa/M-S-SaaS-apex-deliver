"""
TDD Tests for Campaign API Endpoints

Tests for campaign management API endpoints following TDD principles.
"""
import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

from app.models.master_admin import AdminCampaign, CampaignTemplate
from app.models.enums import CampaignType, CampaignStatus


def _create_campaign(db_session, user_id: str, **overrides) -> AdminCampaign:
    campaign = AdminCampaign(
        user_id=user_id,
        name=overrides.get('name', 'Sample Campaign'),
        type=overrides.get('type', CampaignType.EMAIL),
        status=overrides.get('status', CampaignStatus.DRAFT),
        subject=overrides.get('subject', 'Subject'),
        content=overrides.get('content', 'Content body'),
        total_recipients=overrides.get('total_recipients', 0),
        sent_count=overrides.get('sent_count', 0),
        opened_count=overrides.get('opened_count', 0),
        clicked_count=overrides.get('clicked_count', 0),
    )
    db_session.add(campaign)
    db_session.commit()
    db_session.refresh(campaign)
    return campaign


def _create_template(db_session, organization_id: str) -> CampaignTemplate:
    template = CampaignTemplate(
        organization_id=organization_id,
        name='Welcome Template',
        subject='Hello {{first_name}}',
        content='Hi {{first_name}}',
        type='email',
        variables=['first_name'],
        is_default=False,
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)
    return template


class TestCreateCampaign:
    """Test POST /api/master-admin/campaigns endpoint."""
    
    @pytest.mark.asyncio
    async def test_create_campaign(self, async_client: AsyncClient, auth_headers_master_admin: dict):
        """Test creating a new campaign."""
        campaign_data = {
            "name": "Test Campaign",
            "type": "email",
            "subject": "Test Subject",
            "content": "Test content",
        }

        response = await async_client.post(
            "/api/master-admin/campaigns",
            json=campaign_data,
            headers=auth_headers_master_admin
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Test Campaign"
        assert data["type"] == "email"
        assert data["status"] == "draft"
    
    @pytest.mark.asyncio
    async def test_create_campaign_with_template(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test creating a campaign with a template."""
        template = _create_template(db_session, master_admin_user.organization_id)

        campaign_data = {
            "name": "Templated Campaign",
            "type": "email",
            "template_id": template.id,
            "subject": "Hello {{first_name}}",
            "content": "Hi {{first_name}}!",
        }

        response = await async_client.post(
            "/api/master-admin/campaigns",
            json=campaign_data,
            headers=auth_headers_master_admin
        )

        assert response.status_code == 201
        data = response.json()
        assert data["template_id"] == template.id


class TestListCampaigns:
    """Test GET /api/master-admin/campaigns endpoint."""
    
    @pytest.mark.asyncio
    async def test_list_campaigns(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test listing campaigns."""
        _create_campaign(db_session, master_admin_user.id, name="First")
        _create_campaign(db_session, master_admin_user.id, name="Second")

        response = await async_client.get(
            "/api/master-admin/campaigns",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    @pytest.mark.asyncio
    async def test_list_campaigns_with_filters(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test listing campaigns with filters."""
        _create_campaign(db_session, master_admin_user.id, name="Draft Campaign")
        _create_campaign(db_session, master_admin_user.id, name="Sent Campaign", status=CampaignStatus.SENT)

        response = await async_client.get(
            "/api/master-admin/campaigns?status=draft&type=email",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["status"] == "draft"


class TestGetCampaign:
    """Test GET /api/master-admin/campaigns/{id} endpoint."""
    
    @pytest.mark.asyncio
    async def test_get_campaign(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test getting a specific campaign."""
        campaign = _create_campaign(db_session, master_admin_user.id)

        response = await async_client.get(
            f"/api/master-admin/campaigns/{campaign.id}",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == campaign.id

    @pytest.mark.asyncio
    async def test_get_campaign_not_found(self, async_client: AsyncClient, auth_headers_master_admin: dict):
        """Test getting a non-existent campaign."""
        response = await async_client.get(
            "/api/master-admin/campaigns/99999",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 404


class TestUpdateCampaign:
    """Test PUT /api/master-admin/campaigns/{id} endpoint."""
    
    @pytest.mark.asyncio
    async def test_update_campaign(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test updating a campaign."""
        campaign = _create_campaign(db_session, master_admin_user.id)

        update_data = {
            "name": "Updated Campaign Name",
            "subject": "Updated Subject",
        }

        response = await async_client.put(
            f"/api/master-admin/campaigns/{campaign.id}",
            json=update_data,
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Campaign Name"


class TestDeleteCampaign:
    """Test DELETE /api/master-admin/campaigns/{id} endpoint."""
    
    @pytest.mark.asyncio
    async def test_delete_campaign(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test deleting a campaign."""
        campaign = _create_campaign(db_session, master_admin_user.id)

        response = await async_client.delete(
            f"/api/master-admin/campaigns/{campaign.id}",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 204
        assert db_session.get(AdminCampaign, campaign.id) is None


class TestScheduleCampaign:
    """Test POST /api/master-admin/campaigns/{id}/schedule endpoint."""
    
    @pytest.mark.asyncio
    async def test_schedule_campaign(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test scheduling a campaign."""
        campaign = _create_campaign(db_session, master_admin_user.id)
        schedule_time = (datetime.utcnow() + timedelta(hours=1)).replace(microsecond=0).isoformat() + "Z"

        response = await async_client.post(
            f"/api/master-admin/campaigns/{campaign.id}/schedule",
            json={"schedule_at": schedule_time},
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "scheduled"
        assert data["schedule_at"].startswith(schedule_time[:19])


class TestGetCampaignAnalytics:
    """Test GET /api/master-admin/campaigns/{id}/analytics endpoint."""
    
    @pytest.mark.asyncio
    async def test_get_campaign_analytics(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test getting campaign analytics."""
        campaign = _create_campaign(
            db_session,
            master_admin_user.id,
            total_recipients=100,
            sent_count=80,
            opened_count=20,
            clicked_count=5,
        )

        response = await async_client.get(
            f"/api/master-admin/campaigns/{campaign.id}/analytics",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total_recipients"] == 100
        assert data["sent_count"] == 80
        assert data["open_rate"] == 0.25

