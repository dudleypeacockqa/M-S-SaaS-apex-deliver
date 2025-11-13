"""
Test Document Generation API Endpoints
TDD Loop 2 - GREEN Phase
Feature: F-009 Automated Document Generation
"""
import pytest
from sqlalchemy.orm import Session

from app.models.document_generation import DocumentTemplate, GeneratedDocument


class TestDocumentTemplateEndpoints:
    """Test document template CRUD endpoints"""

    def test_create_template(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test creating a new document template"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        template_data = {
            "name": "NDA Template",
            "description": "Standard Non-Disclosure Agreement",
            "template_type": "legal",
            "content": "This NDA is between {{party_a}} and {{party_b}}, effective {{effective_date}}.",
            "variables": ["party_a", "party_b", "effective_date"],
            "organization_id": str(org.id),
            "created_by_user_id": user.id,
        }

        response = client.post(
            "/api/document-generation/templates",
            json=template_data,
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "NDA Template"
        assert data["template_type"] == "legal"
        assert len(data["variables"]) == 3
        assert data["status"] == "active"
        assert data["version"] == 1
        assert "id" in data
        assert "created_at" in data

        app.dependency_overrides.pop(get_current_user, None)

    def test_create_template_forbidden_other_org(
        self,
        client,
        create_user,
        create_organization,
    ):
        """Test cannot create template for another organization"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        template_data = {
            "name": "Test Template",
            "content": "Content",
            "organization_id": "00000000-0000-0000-0000-000000000456",  # Different org (valid UUID format)
            "created_by_user_id": user.id,
            "variables": [],
        }

        response = client.post(
            "/api/document-generation/templates",
            json=template_data,
        )

        assert response.status_code == 403
        assert "another organization" in response.json()["detail"]

        app.dependency_overrides.pop(get_current_user, None)

    def test_list_templates(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test listing templates for an organization"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        # Create test templates
        template1 = DocumentTemplate(
            name="Template 1",
            content="Content 1",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        template2 = DocumentTemplate(
            name="Template 2",
            content="Content 2",
            template_type="legal",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add_all([template1, template2])
        db_session.commit()

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        response = client.get("/api/document-generation/templates")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2
        assert any(t["name"] == "Template 1" for t in data)
        assert any(t["name"] == "Template 2" for t in data)

        app.dependency_overrides.pop(get_current_user, None)

    def test_list_templates_with_filters(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test listing templates with status and type filters"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        # Create templates with different statuses and types
        template1 = DocumentTemplate(
            name="Legal Active",
            content="Content",
            template_type="legal",
            status="active",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        template2 = DocumentTemplate(
            name="Proposal Draft",
            content="Content",
            template_type="proposal",
            status="draft",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add_all([template1, template2])
        db_session.commit()

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        # Filter by status
        response = client.get("/api/document-generation/templates?status=active")
        assert response.status_code == 200
        data = response.json()
        assert all(t["status"] == "active" for t in data)

        # Filter by template_type
        response = client.get("/api/document-generation/templates?template_type=legal")
        assert response.status_code == 200
        data = response.json()
        assert all(t["template_type"] == "legal" for t in data if t["template_type"])

        app.dependency_overrides.pop(get_current_user, None)

    def test_get_template(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test getting a specific template by ID"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Test Template",
            content="Test Content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        response = client.get(f"/api/document-generation/templates/{template.id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == template.id
        assert data["name"] == "Test Template"

        app.dependency_overrides.pop(get_current_user, None)

    def test_get_template_not_found(
        self,
        client,
        create_user,
        create_organization,
    ):
        """Test getting non-existent template returns 404"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        response = client.get("/api/document-generation/templates/nonexistent-id")

        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

        app.dependency_overrides.pop(get_current_user, None)

    def test_update_template(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test updating an existing template"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Original Name",
            content="Original Content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        update_data = {
            "name": "Updated Name",
            "description": "Updated Description",
        }

        response = client.put(
            f"/api/document-generation/templates/{template.id}",
            json=update_data,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["description"] == "Updated Description"
        assert data["content"] == "Original Content"  # Unchanged

        app.dependency_overrides.pop(get_current_user, None)

    def test_delete_template(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test archiving a template (soft delete)"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="To Delete",
            content="Content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        response = client.delete(f"/api/document-generation/templates/{template.id}")

        assert response.status_code == 204

        # Verify template is archived
        db_session.refresh(template)
        assert template.status.value == "archived"

        app.dependency_overrides.pop(get_current_user, None)


class TestDocumentGenerationEndpoints:
    """Test document generation from templates"""

    def test_generate_document(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test generating a document from a template"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        # Create template
        template = DocumentTemplate(
            name="NDA Template",
            content="This NDA is between {{party_a}} and {{party_b}}, effective {{effective_date}}.",
            variables=["party_a", "party_b", "effective_date"],
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        # Generate document
        render_request = {
            "variable_values": {
                "party_a": "Acme Corp",
                "party_b": "Beta Inc",
                "effective_date": "2025-11-13",
            },
            "generate_file": False,
        }

        response = client.post(
            f"/api/document-generation/templates/{template.id}/generate",
            json=render_request,
        )

        assert response.status_code == 201
        data = response.json()
        assert "generated_document_id" in data
        assert "Acme Corp" in data["generated_content"]
        assert "Beta Inc" in data["generated_content"]
        assert "2025-11-13" in data["generated_content"]
        assert data["status"] == "generated"

        app.dependency_overrides.pop(get_current_user, None)

    def test_generate_document_missing_variables(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test generating document with missing required variables fails"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Template",
            content="Hello {{name}}, your code is {{code}}.",
            variables=["name", "code"],
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        # Missing 'code' variable
        render_request = {
            "variable_values": {
                "name": "John",
            },
        }

        response = client.post(
            f"/api/document-generation/templates/{template.id}/generate",
            json=render_request,
        )

        assert response.status_code == 400
        assert "Missing required variables" in response.json()["detail"]
        assert "code" in response.json()["detail"]

        app.dependency_overrides.pop(get_current_user, None)

    def test_generate_document_template_not_found(
        self,
        client,
        create_user,
        create_organization,
    ):
        """Test generating from non-existent template returns 404"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        render_request = {
            "variable_values": {},
        }

        response = client.post(
            "/api/document-generation/templates/nonexistent-id/generate",
            json=render_request,
        )

        assert response.status_code == 404

        app.dependency_overrides.pop(get_current_user, None)


class TestGeneratedDocumentEndpoints:
    """Test generated document management endpoints"""

    def test_list_generated_documents(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test listing all generated documents"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        # Create template
        template = DocumentTemplate(
            name="Template",
            content="Content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.flush()

        # Create generated documents
        doc1 = GeneratedDocument(
            template_id=template.id,
            generated_content="Generated 1",
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        doc2 = GeneratedDocument(
            template_id=template.id,
            generated_content="Generated 2",
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add_all([doc1, doc2])
        db_session.commit()

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        response = client.get("/api/document-generation/documents")

        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2

        app.dependency_overrides.pop(get_current_user, None)

    def test_get_generated_document(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test getting a specific generated document"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Template",
            content="Content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.flush()

        document = GeneratedDocument(
            template_id=template.id,
            generated_content="Test Generated Content",
            variable_values={"name": "Test"},
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        response = client.get(f"/api/document-generation/documents/{document.id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == document.id
        assert data["generated_content"] == "Test Generated Content"
        assert data["variable_values"]["name"] == "Test"

        app.dependency_overrides.pop(get_current_user, None)

    def test_update_document_status(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test updating generated document status"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Template",
            content="Content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.flush()

        document = GeneratedDocument(
            template_id=template.id,
            generated_content="Content",
            status="draft",
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        response = client.patch(
            f"/api/document-generation/documents/{document.id}/status?status=finalized",
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "finalized"

        app.dependency_overrides.pop(get_current_user, None)

    def test_update_document_content(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test updating generated document content"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Template",
            content="Content",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.flush()

        document = GeneratedDocument(
            template_id=template.id,
            generated_content="Original Content",
            status="draft",
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        update_data = {
            "generated_content": "Updated Content",
        }

        response = client.patch(
            f"/api/document-generation/documents/{document.id}",
            json=update_data,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["generated_content"] == "Updated Content"
        assert data["status"] == "draft"  # Status unchanged

        app.dependency_overrides.pop(get_current_user, None)


class TestTemplateRenderingService:
    """Test template rendering and variable substitution"""

    def test_complex_template_rendering(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test rendering a complex template with multiple variables"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template_content = """
CONTRACT AGREEMENT

This agreement is made between {{seller_name}} (the "Seller") and {{buyer_name}} (the "Buyer").

Purchase Price: {{purchase_price}}
Closing Date: {{closing_date}}
Property: {{property_address}}

Seller Signature: _________________
Buyer Signature: _________________
"""

        template = DocumentTemplate(
            name="Purchase Agreement",
            content=template_content,
            variables=["seller_name", "buyer_name", "purchase_price", "closing_date", "property_address"],
            template_type="legal",
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.commit()
        db_session.refresh(template)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        render_request = {
            "variable_values": {
                "seller_name": "Acme Corp",
                "buyer_name": "Beta Industries",
                "purchase_price": "$5,000,000",
                "closing_date": "December 31, 2025",
                "property_address": "123 Main St, London",
            },
        }

        response = client.post(
            f"/api/document-generation/templates/{template.id}/generate",
            json=render_request,
        )

        assert response.status_code == 201
        data = response.json()
        content = data["generated_content"]

        assert "Acme Corp" in content
        assert "Beta Industries" in content
        assert "$5,000,000" in content
        assert "December 31, 2025" in content
        assert "123 Main St, London" in content
        assert "{{" not in content  # All variables replaced

        app.dependency_overrides.pop(get_current_user, None)


class TestDocumentExportEndpoints:
    """Test document export endpoints (PDF/DOCX)"""

    def test_export_document_as_pdf(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test exporting a document as PDF"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Test Template",
            content="Test Content: {{name}}",
            variables=["name"],
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.flush()

        document = GeneratedDocument(
            template_id=template.id,
            generated_content="Test Content: John Doe",
            variable_values={"name": "John Doe"},
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        export_request = {
            "format": "application/pdf",
            "options": {
                "margin": 15,
                "font_family": "Inter",
                "include_cover_page": True,
            },
        }

        response = client.post(
            f"/api/document-generation/documents/{document.id}/export",
            json=export_request,
        )

        assert response.status_code == 200
        data = response.json()
        assert "job_id" in data or "download_url" in data
        assert data.get("file_type") == "application/pdf" or data.get("status") in ["completed", "processing"]

        app.dependency_overrides.pop(get_current_user, None)

    def test_export_document_as_docx(
        self,
        client,
        create_user,
        create_organization,
        db_session: Session,
    ):
        """Test exporting a document as DOCX"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        template = DocumentTemplate(
            name="Test Template",
            content="Test Content: {{name}}",
            variables=["name"],
            organization_id=str(org.id),
            created_by_user_id=user.id,
        )
        db_session.add(template)
        db_session.flush()

        document = GeneratedDocument(
            template_id=template.id,
            generated_content="Test Content: John Doe",
            variable_values={"name": "John Doe"},
            organization_id=str(org.id),
            generated_by_user_id=user.id,
        )
        db_session.add(document)
        db_session.commit()
        db_session.refresh(document)

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        export_request = {
            "format": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "options": {},
        }

        response = client.post(
            f"/api/document-generation/documents/{document.id}/export",
            json=export_request,
        )

        assert response.status_code == 200
        data = response.json()
        assert "job_id" in data or "download_url" in data
        assert data.get("file_type") == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" or data.get("status") in ["completed", "processing"]

        app.dependency_overrides.pop(get_current_user, None)

    def test_export_document_not_found(
        self,
        client,
        create_user,
        create_organization,
    ):
        """Test exporting non-existent document returns 404"""
        org = create_organization(name="Template Org")
        user = create_user(email="user@example.com", organization_id=str(org.id))

        from app.api.dependencies.auth import get_current_user
        from app.main import app
        app.dependency_overrides[get_current_user] = lambda: user

        export_request = {
            "format": "application/pdf",
        }

        response = client.post(
            "/api/document-generation/documents/nonexistent-id/export",
            json=export_request,
        )

        assert response.status_code == 404

        app.dependency_overrides.pop(get_current_user, None)
