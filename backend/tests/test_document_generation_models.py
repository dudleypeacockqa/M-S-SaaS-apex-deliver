"""
Test Document Generation Models
TDD Loop 1 - GREEN Phase
Feature: F-009 Automated Document Generation
"""
import pytest
from datetime import datetime, UTC
from sqlalchemy.orm import Session
from app.models.document_generation import (
    DocumentTemplate,
    GeneratedDocument,
    TemplateStatus,
    DocumentStatus,
)


@pytest.fixture
def test_organization(db_session: Session):
    """Create a test organization for document generation tests"""
    from app.models.organization import Organization

    org = Organization(
        id="doc-test-org-123",
        name="Document Test Organization",
        slug="doc-test-org",
    )
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)
    return org


def test_create_document_template(db_session: Session, test_organization):
    """Test creating a document template"""
    template = DocumentTemplate(
        name="NDA Template",
        description="Non-Disclosure Agreement",
        template_type="legal",
        content="This NDA is between {{party_a}} and {{party_b}}...",
        variables=["party_a", "party_b", "effective_date"],
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    assert template.id is not None
    assert template.name == "NDA Template"
    assert template.template_type == "legal"
    assert len(template.variables) == 3
    assert template.status == TemplateStatus.ACTIVE
    assert template.version == 1


def test_template_status_enum(db_session: Session, test_organization):
    """Test template status enum values"""
    template = DocumentTemplate(
        name="Test Template",
        content="Content",
        organization_id=test_organization.id,
        created_by_user_id="user-123",
        status=TemplateStatus.DRAFT,
    )
    db_session.add(template)
    db_session.commit()

    assert template.status == TemplateStatus.DRAFT

    # Test transitioning states
    template.status = TemplateStatus.ACTIVE
    db_session.commit()
    assert template.status == TemplateStatus.ACTIVE

    template.status = TemplateStatus.ARCHIVED
    db_session.commit()
    assert template.status == TemplateStatus.ARCHIVED


def test_template_version_tracking(db_session: Session, test_organization):
    """Test template version tracking"""
    template = DocumentTemplate(
        name="Versioned Template",
        content="Version 1 content",
        organization_id=test_organization.id,
        created_by_user_id="user-123",
        version=1,
    )
    db_session.add(template)
    db_session.commit()

    assert template.version == 1

    # Simulate version increment
    template.version = 2
    template.content = "Version 2 content"
    db_session.commit()

    assert template.version == 2


def test_template_repr(db_session: Session, test_organization):
    """Test template __repr__ method"""
    template = DocumentTemplate(
        name="Test Template",
        content="Content",
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    repr_str = repr(template)
    assert "DocumentTemplate" in repr_str
    assert "Test Template" in repr_str


def test_create_generated_document(db_session: Session, test_organization):
    """Test creating a generated document"""
    # First create a template
    template = DocumentTemplate(
        name="Test Template",
        content="Hello {{name}}",
        variables=["name"],
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    # Create generated document
    generated = GeneratedDocument(
        template_id=template.id,
        generated_content="Hello John Doe",
        variable_values={"name": "John Doe"},
        organization_id=test_organization.id,
        generated_by_user_id="user-456",
    )
    db_session.add(generated)
    db_session.commit()
    db_session.refresh(generated)

    assert generated.id is not None
    assert generated.template_id == template.id
    assert generated.generated_content == "Hello John Doe"
    assert generated.variable_values == {"name": "John Doe"}
    assert generated.status == DocumentStatus.GENERATED


def test_generated_document_status_enum(db_session: Session, test_organization):
    """Test generated document status enum values"""
    template = DocumentTemplate(
        name="Template",
        content="Content",
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()

    generated = GeneratedDocument(
        template_id=template.id,
        generated_content="Content",
        variable_values={},
        organization_id=test_organization.id,
        generated_by_user_id="user-123",
        status=DocumentStatus.DRAFT,
    )
    db_session.add(generated)
    db_session.commit()

    assert generated.status == DocumentStatus.DRAFT

    # Test status transitions
    generated.status = DocumentStatus.GENERATED
    db_session.commit()
    assert generated.status == DocumentStatus.GENERATED

    generated.status = DocumentStatus.FINALIZED
    db_session.commit()
    assert generated.status == DocumentStatus.FINALIZED

    generated.status = DocumentStatus.SENT
    db_session.commit()
    assert generated.status == DocumentStatus.SENT


def test_generated_document_timestamps(db_session: Session, test_organization):
    """Test that generated document has proper timestamps"""
    template = DocumentTemplate(
        name="Template",
        content="Content",
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()

    generated = GeneratedDocument(
        template_id=template.id,
        generated_content="Content",
        variable_values={},
        organization_id=test_organization.id,
        generated_by_user_id="user-123",
    )
    db_session.add(generated)
    db_session.commit()
    db_session.refresh(generated)

    assert generated.created_at is not None
    assert isinstance(generated.created_at, datetime)


def test_generated_document_file_path(db_session: Session, test_organization):
    """Test generated document with file path"""
    template = DocumentTemplate(
        name="Template",
        content="Content",
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()

    generated = GeneratedDocument(
        template_id=template.id,
        generated_content="Content",
        variable_values={},
        file_path="/documents/generated/nda-2025-11-13.pdf",
        organization_id=test_organization.id,
        generated_by_user_id="user-123",
    )
    db_session.add(generated)
    db_session.commit()
    db_session.refresh(generated)

    assert generated.file_path == "/documents/generated/nda-2025-11-13.pdf"


def test_template_document_relationship(db_session: Session, test_organization):
    """Test relationship between template and generated documents"""
    template = DocumentTemplate(
        name="Template with Docs",
        content="Content {{var}}",
        variables=["var"],
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    # Create multiple generated documents from same template
    for i in range(3):
        generated = GeneratedDocument(
            template_id=template.id,
            generated_content=f"Content {i}",
            variable_values={"var": str(i)},
            organization_id=test_organization.id,
            generated_by_user_id="user-123",
        )
        db_session.add(generated)
    db_session.commit()
    db_session.refresh(template)

    # Test relationship
    assert len(template.generated_documents) == 3
    assert all(doc.template_id == template.id for doc in template.generated_documents)


def test_template_variables_json_field(db_session: Session, test_organization):
    """Test that variables field properly handles JSON list"""
    template = DocumentTemplate(
        name="Template",
        content="{{var1}} and {{var2}}",
        variables=["var1", "var2", "var3"],
        organization_id=test_organization.id,
        created_by_user_id="user-123",
    )
    db_session.add(template)
    db_session.commit()
    db_session.refresh(template)

    assert isinstance(template.variables, list)
    assert len(template.variables) == 3
    assert "var1" in template.variables
    assert "var2" in template.variables
    assert "var3" in template.variables