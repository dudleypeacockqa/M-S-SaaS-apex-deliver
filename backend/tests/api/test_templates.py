"""
TDD Tests for Template API Endpoints

Tests for template management API endpoints following TDD principles.
"""
import pytest
from httpx import AsyncClient

from app.models.master_admin import CampaignTemplate


def _create_template(db_session, organization_id: str, **overrides) -> CampaignTemplate:
    template = CampaignTemplate(
        organization_id=organization_id,
        name=overrides.get('name', 'Template'),
        subject=overrides.get('subject', 'Hello {{first_name}}'),
        content=overrides.get('content', 'Body {{first_name}}'),
        type=overrides.get('type', 'email'),
        variables=overrides.get('variables', ['first_name']),
        is_default=overrides.get('is_default', False),
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)
    return template


class TestCreateTemplate:
    """Test POST /api/master-admin/templates endpoint."""
    
    @pytest.mark.asyncio
    async def test_create_template(self, async_client: AsyncClient, auth_headers_master_admin: dict):
        """Test creating a template."""
        template_data = {
            "name": "Welcome Email Template",
            "subject": "Welcome {{first_name}}!",
            "content": "Hi {{first_name}}, welcome to {{company}}!",
            "type": "email",
        }

        response = await async_client.post(
            "/api/master-admin/templates",
            json=template_data,
            headers=auth_headers_master_admin
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Welcome Email Template"


class TestListTemplates:
    """Test GET /api/master-admin/templates endpoint."""
    
    @pytest.mark.asyncio
    async def test_list_templates(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test listing templates."""
        _create_template(db_session, master_admin_user.organization_id, name="One")

        response = await async_client.get(
            "/api/master-admin/templates",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 1
        assert any(item["name"] == "One" for item in data["items"])
    
    @pytest.mark.asyncio
    async def test_list_templates_with_type_filter(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test listing templates filtered by type."""
        _create_template(db_session, master_admin_user.organization_id, type='email')
        _create_template(db_session, master_admin_user.organization_id, type='voice')

        response = await async_client.get(
            "/api/master-admin/templates?type=email",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert all(template["type"] == "email" for template in data["items"])


class TestGetTemplate:
    """Test GET /api/master-admin/templates/{id} endpoint."""
    
    @pytest.mark.asyncio
    async def test_get_template(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test getting a specific template."""
        template = _create_template(db_session, master_admin_user.organization_id)

        response = await async_client.get(
            f"/api/master-admin/templates/{template.id}",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == template.id


class TestRenderTemplatePreview:
    """Test POST /api/master-admin/templates/{id}/preview endpoint."""
    
    @pytest.mark.asyncio
    async def test_render_template_preview(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test rendering a template preview."""
        template = _create_template(db_session, master_admin_user.organization_id)

        contact_data = {
            "first_name": "John",
            "company": "Acme Corp",
        }

        response = await async_client.post(
            f"/api/master-admin/templates/{template.id}/preview",
            json={"contact_data": contact_data},
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert "subject" in data
        assert "content" in data

