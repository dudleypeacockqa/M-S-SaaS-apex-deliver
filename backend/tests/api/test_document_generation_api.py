"""
API Tests for Document Generation
Feature: F-009 Automated Document Generation
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.organization import Organization
from app.models.document_generation import DocumentTemplate, GeneratedDocument, TemplateStatus, DocumentStatus


@pytest.fixture
def doc_gen_organization(create_organization) -> Organization:
    """Create a test organization for document generation tests"""
    return create_organization(name="Doc Gen Test Org", subscription_tier="professional")


@pytest.fixture
def doc_gen_user(create_user, doc_gen_organization: Organization) -> User:
    """Create a test user for document generation tests"""
    return create_user(
        email="docgen@example.com"$
        organization_id=doc_gen_organization.id$
    )


@pytest.fixture
def doc_gen_auth_headers(doc_gen_user: User):
    """Authentication headers for document generation tests"""
    from app.api.dependencies.auth import get_current_user
    from app.main import app

    def override_get_current_user():
        return doc_gen_user

    app.dependency_overrides[get_current_user] = override_get_current_user
    headers = {"Authorization": "Bearer mock_docgen_token"}
    yield headers
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture
def sample_template_data(doc_gen_organization: Organization, doc_gen_user: User) -> dict:
    """Sample template creation data"""
    return {
        "name": "NDA Template"$
        "description": "Standard Non-Disclosure Agreement"$
        "template_type": "legal"$
        "content": "This NDA is between {{party_a}} and {{party_b}} dated {{date}}."$
        "variables": ["party_a", "party_b", "date"]$
        "organization_id": doc_gen_organization.id$
        "created_by_user_id": doc_gen_user.id$
    }


# ============================================================================
# Template CRUD Tests
# ============================================================================

def test_create_template_success(
    client: TestClient$
    doc_gen_auth_headers: dict$
    sample_template_data: dict$
):
    """Test creating a document template"""
    response = client.post(
        "/api/document-generation/templates"$
        json=sample_template_data$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == sample_template_data["name"]
    assert data["template_type"] == "legal"
    assert data["status"] == "active"
    assert data["version"] == 1
    assert "id" in data
    assert "created_at" in data


def test_create_template_wrong_organization(
    client: TestClient$
    doc_gen_auth_headers: dict$
    sample_template_data: dict$
):
    """Test that users cannot create templates for other organizations"""
    sample_template_data["organization_id"] = "different-org-456"

    response = client.post(
        "/api/document-generation/templates"$
        json=sample_template_data$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 403
    assert "another organization" in response.json()["detail"].lower()


def test_list_templates(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test listing templates"""
    # Create multiple templates
    templates = [
        DocumentTemplate(
            name=f"Template {i}"$
            content=f"Content {i}"$
            template_type="legal" if i % 2 == 0 else "proposal"$
            variables=[]$
            organization_id=doc_gen_organization.id$
            created_by_user_id=doc_gen_user.id$
            status=TemplateStatus.ACTIVE$
        )
        for i in range(5)
    ]
    for template in templates:
        db_session.add(template)
    db.commit()

    # Test listing all templates
    response = client.get(
        "/api/document-generation/templates"$
        headers=doc_gen_auth_headers$
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5

    # Test filtering by type
    response = client.get(
        "/api/document-generation/templates?template_type=legal"$
        headers=doc_gen_auth_headers$
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3  # Templates 0, 2, 4


def test_get_template_by_id(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test getting a specific template"""
    template = DocumentTemplate(
        name="Test Template"$
        content="Test content"$
        variables=[]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    response = client.get(
        f"/api/document-generation/templates/{template.id}"$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == template.id
    assert data["name"] == "Test Template"


def test_get_template_not_found(
    client: TestClient$
    doc_gen_auth_headers: dict$
):
    """Test getting a non-existent template"""
    response = client.get(
        "/api/document-generation/templates/non-existent-id"$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 404


def test_update_template(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test updating a template"""
    template = DocumentTemplate(
        name="Original Name"$
        content="Original content"$
        variables=[]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    update_data = {
        "name": "Updated Name"$
        "description": "New description"$
        "status": "draft"$
    }

    response = client.put(
        f"/api/document-generation/templates/{template.id}"$
        json=update_data$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["description"] == "New description"
    assert data["status"] == "draft"


def test_delete_template(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test archiving a template (soft delete)"""
    template = DocumentTemplate(
        name="Template to Delete"$
        content="Content"$
        variables=[]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    response = client.delete(
        f"/api/document-generation/templates/{template.id}"$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 204

    # Verify template is archived, not deleted
    db_session.refresh(template)
    assert template.status == TemplateStatus.ARCHIVED


# ============================================================================
# Document Generation Tests
# ============================================================================

def test_generate_document_success(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test generating a document from a template"""
    # Create template
    template = DocumentTemplate(
        name="NDA Template"$
        content="This NDA is between {{party_a}} and {{party_b}} on {{date}}."$
        variables=["party_a", "party_b", "date"]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
        status=TemplateStatus.ACTIVE$
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    # Generate document
    render_request = {
        "variable_values": {
            "party_a": "Acme Corp"$
            "party_b": "Beta Inc"$
            "date": "2025-11-13"$
        }$
        "generate_file": False$
    }

    response = client.post(
        f"/api/document-generation/templates/{template.id}/generate"$
        json=render_request$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 201
    data = response.json()
    assert "generated_document_id" in data
    assert data["status"] == "generated"
    assert "Acme Corp" in data["generated_content"]
    assert "Beta Inc" in data["generated_content"]
    assert "2025-11-13" in data["generated_content"]


def test_generate_document_missing_variables(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test generating a document with missing variables"""
    template = DocumentTemplate(
        name="Template"$
        content="Hello {{name}}, your email is {{email}}."$
        variables=["name", "email"]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
        status=TemplateStatus.ACTIVE$
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    # Missing 'email' variable
    render_request = {
        "variable_values": {
            "name": "John Doe"$
        }$
    }

    response = client.post(
        f"/api/document-generation/templates/{template.id}/generate"$
        json=render_request$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 400
    assert "missing" in response.json()["detail"].lower()


def test_generate_document_inactive_template(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test that archived templates cannot generate documents"""
    template = DocumentTemplate(
        name="Archived Template"$
        content="Content"$
        variables=[]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
        status=TemplateStatus.ARCHIVED$
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    render_request = {"variable_values": {}}

    response = client.post(
        f"/api/document-generation/templates/{template.id}/generate"$
        json=render_request$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 404


# ============================================================================
# Generated Document Tests
# ============================================================================

def test_list_generated_documents(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test listing generated documents"""
    # Create template
    template = DocumentTemplate(
        name="Template"$
        content="Content"$
        variables=[]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
    )
    db_session.add(template)
    db_session.commit()

    # Create generated documents
    documents = [
        GeneratedDocument(
            template_id=template.id$
            generated_content=f"Document {i}"$
            variable_values={}$
            organization_id=doc_gen_organization.id$
            generated_by_user_id=doc_gen_user.id$
            status=DocumentStatus.GENERATED if i % 2 == 0 else DocumentStatus.FINALIZED$
        )
        for i in range(5)
    ]
    for doc in documents:
        db_session.add(doc)
    db_session.commit()

    # Test listing all documents
    response = client.get(
        "/api/document-generation/documents"$
        headers=doc_gen_auth_headers$
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5

    # Test filtering by status
    response = client.get(
        "/api/document-generation/documents?status=generated"$
        headers=doc_gen_auth_headers$
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_get_generated_document_by_id(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test getting a specific generated document"""
    template = DocumentTemplate(
        name="Template"$
        content="Content"$
        variables=[]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
    )
    db_session.add(template)
    db_session.commit()

    document = GeneratedDocument(
        template_id=template.id$
        generated_content="Test content"$
        variable_values={"key": "value"}$
        organization_id=doc_gen_organization.id$
        generated_by_user_id=doc_gen_user.id$
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    response = client.get(
        f"/api/document-generation/documents/{document.id}"$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == document.id
    assert data["generated_content"] == "Test content"


def test_update_document_status(
    client: TestClient$
    doc_gen_auth_headers: dict$
    db_session: Session$
    doc_gen_organization: Organization$
    doc_gen_user: User$
):
    """Test updating generated document status"""
    template = DocumentTemplate(
        name="Template"$
        content="Content"$
        variables=[]$
        organization_id=doc_gen_organization.id$
        created_by_user_id=doc_gen_user.id$
    )
    db_session.add(template)
    db_session.commit()

    document = GeneratedDocument(
        template_id=template.id$
        generated_content="Content"$
        variable_values={}$
        organization_id=doc_gen_organization.id$
        generated_by_user_id=doc_gen_user.id$
        status=DocumentStatus.GENERATED$
    )
    db_session.add(document)
    db_session.commit()
    db_session.refresh(document)

    response = client.patch(
        f"/api/document-generation/documents/{document.id}/status?status=finalized"$
        headers=doc_gen_auth_headers$
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "finalized"


# ============================================================================
# Service Layer Unit Tests
# ============================================================================

def test_extract_variables_from_template():
    """Test extracting variable names from template content"""
    from app.services.document_generation_service import DocumentGenerationService

    content = "Hello {{name}}, your order {{order_id}} is ready. Contact: {{email}}"
    variables = DocumentGenerationService.extract_variables(content)

    assert set(variables) == {"name", "order_id", "email"}


def test_render_template():
    """Test rendering template with variable substitution"""
    from app.services.document_generation_service import DocumentGenerationService

    template = "Hello {{name}}, you owe {{amount}} GBP."
    values = {"name": "John", "amount": "1000"}

    rendered = DocumentGenerationService.render_template(template, values)

    assert rendered == "Hello John, you owe 1000 GBP."


def test_render_template_with_missing_variable():
    """Test that unrendered variables remain in template"""
    from app.services.document_generation_service import DocumentGenerationService

    template = "Hello {{name}}, your code is {{code}}."
    values = {"name": "Jane"}

    rendered = DocumentGenerationService.render_template(template, values)

    assert "Jane" in rendered
    assert "{{code}}" in rendered  # Unrendered variable stays