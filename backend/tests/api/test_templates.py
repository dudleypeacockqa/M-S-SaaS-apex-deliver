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


class TestUpdateTemplate:
    """Test PUT /api/master-admin/templates/{id} endpoint."""
    
    @pytest.mark.asyncio
    async def test_update_template(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test updating a template."""
        template = _create_template(db_session, master_admin_user.organization_id, name="Original")

        update_data = {
            "name": "Updated Template",
            "subject": "Updated {{first_name}}",
            "content": "Updated content {{first_name}}",
        }

        response = await async_client.put(
            f"/api/master-admin/templates/{template.id}",
            json=update_data,
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Template"
        assert data["subject"] == "Updated {{first_name}}"
    
    @pytest.mark.asyncio
    async def test_update_template_not_found(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
    ):
        """Test updating a non-existent template."""
        update_data = {"name": "Updated Template"}

        response = await async_client.put(
            "/api/master-admin/templates/99999",
            json=update_data,
            headers=auth_headers_master_admin
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    @pytest.mark.asyncio
    async def test_update_template_partial(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test partial update (only name)."""
        template = _create_template(db_session, master_admin_user.organization_id, name="Original")

        update_data = {"name": "Partially Updated"}

        response = await async_client.put(
            f"/api/master-admin/templates/{template.id}",
            json=update_data,
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Partially Updated"
        # Original subject should remain
        assert data["subject"] == "Hello {{first_name}}"


class TestDeleteTemplate:
    """Test DELETE /api/master-admin/templates/{id} endpoint."""
    
    @pytest.mark.asyncio
    async def test_delete_template(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test deleting a template."""
        template = _create_template(db_session, master_admin_user.organization_id)

        response = await async_client.delete(
            f"/api/master-admin/templates/{template.id}",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 204
        
        # Verify template is deleted
        get_response = await async_client.get(
            f"/api/master-admin/templates/{template.id}",
            headers=auth_headers_master_admin
        )
        assert get_response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_delete_template_not_found(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
    ):
        """Test deleting a non-existent template."""
        response = await async_client.delete(
            "/api/master-admin/templates/99999",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


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
    
    @pytest.mark.asyncio
    async def test_render_template_preview_missing_variables(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test preview with missing required variables."""
        template = _create_template(
            db_session,
            master_admin_user.organization_id,
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}, welcome to {{company}}!",
            variables=["first_name", "company"]
        )

        # Missing 'company' variable
        contact_data = {"first_name": "John"}

        response = await async_client.post(
            f"/api/master-admin/templates/{template.id}/preview",
            json={"contact_data": contact_data},
            headers=auth_headers_master_admin
        )

        assert response.status_code == 400
        assert "missing" in response.json()["detail"].lower() or "required" in response.json()["detail"].lower()
    
    @pytest.mark.asyncio
    async def test_render_template_preview_not_found(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
    ):
        """Test preview for non-existent template."""
        contact_data = {"first_name": "John"}

        response = await async_client.post(
            "/api/master-admin/templates/99999/preview",
            json={"contact_data": contact_data},
            headers=auth_headers_master_admin
        )

        assert response.status_code == 404


class TestTemplateErrorPaths:
    """Test error paths for template endpoints."""
    
    @pytest.mark.asyncio
    async def test_get_template_not_found(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
    ):
        """Test getting a non-existent template."""
        response = await async_client.get(
            "/api/master-admin/templates/99999",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_list_templates_with_is_default_filter(
        self,
        async_client: AsyncClient,
        auth_headers_master_admin: dict,
        db_session,
        master_admin_user,
    ):
        """Test listing templates filtered by is_default flag."""
        _create_template(db_session, master_admin_user.organization_id, is_default=True)
        _create_template(db_session, master_admin_user.organization_id, is_default=False)

        response = await async_client.get(
            "/api/master-admin/templates?is_default=true",
            headers=auth_headers_master_admin
        )

        assert response.status_code == 200
        data = response.json()
        assert all(template["is_default"] is True for template in data["items"])

