"""
Test Document Generation Models
TDD Loop 1 - RED Phase
Feature: F-009 Automated Document Generation
"""
import pytest
from datetime import datetime, UTC
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document_generation import (
    DocumentTemplate,
    GeneratedDocument,
    TemplateVariable,
    TemplateStatus,
    DocumentStatus,
)


class TestDocumentTemplate:
    """Test DocumentTemplate model"""

    @pytest.mark.asyncio
    async def test_create_document_template(self, db_session: AsyncSession):
        """Test creating a document template"""
        template = DocumentTemplate(
            name="NDA Template",
            description="Non-Disclosure Agreement",
            template_type="legal",
            content="This NDA is between {{party_a}} and {{party_b}}...",
            variables=["party_a", "party_b", "effective_date"],
            organization_id="test-org-123",
            created_by_user_id="user-123",
        )
        db_session.add(template)
        await db_session.commit()
        await db_session.refresh(template)

        assert template.id is not None
        assert template.name == "NDA Template"
        assert template.template_type == "legal"
        assert len(template.variables) == 3
        assert template.status == TemplateStatus.ACTIVE

    @pytest.mark.asyncio
    async def test_template_status_enum(self, db_session: AsyncSession):
        """Test template status enum values"""
        template = DocumentTemplate(
            name="Test Template",
            content="Content",
            organization_id="org-123",
            created_by_user_id="user-123",
            status=TemplateStatus.DRAFT,
        )
        db_session.add(template)
        await db_session.commit()

        assert template.status == TemplateStatus.DRAFT

    @pytest.mark.asyncio
    async def test_template_version_tracking(self, db_session: AsyncSession):
        """Test template version is tracked"""
        template = DocumentTemplate(
            name="Versioned Template",
            content="Version 1",
            organization_id="org-123",
            created_by_user_id="user-123",
            version=1,
        )
        db_session.add(template)
        await db_session.commit()

        assert template.version == 1

    @pytest.mark.asyncio
    async def test_template_repr(self, db_session: AsyncSession):
        """Test template string representation"""
        template = DocumentTemplate(
            name="Test",
            content="Content",
            organization_id="org-123",
            created_by_user_id="user-123",
        )
        db_session.add(template)
        await db_session.commit()

        repr_str = repr(template)
        assert "DocumentTemplate" in repr_str
        assert "Test" in repr_str


class TestGeneratedDocument:
    """Test GeneratedDocument model"""

    @pytest.mark.asyncio
    async def test_create_generated_document(self, db_session: AsyncSession):
        """Test creating a generated document"""
        # First create a template
        template = DocumentTemplate(
            name="NDA Template",
            content="NDA content",
            organization_id="org-123",
            created_by_user_id="user-123",
        )
        db_session.add(template)
        await db_session.flush()

        # Generate document from template
        generated = GeneratedDocument(
            template_id=template.id,
            generated_content="This NDA is between Acme Corp and Beta Inc...",
            variable_values={"party_a": "Acme Corp", "party_b": "Beta Inc"},
            organization_id="org-123",
            generated_by_user_id="user-123",
        )
        db_session.add(generated)
        await db_session.commit()
        await db_session.refresh(generated)

        assert generated.id is not None
        assert generated.template_id == template.id
        assert generated.status == DocumentStatus.GENERATED
        assert "Acme Corp" in generated.variable_values["party_a"]

    @pytest.mark.asyncio
    async def test_generated_document_status_enum(self, db_session: AsyncSession):
        """Test generated document status transitions"""
        template = DocumentTemplate(
            name="Template",
            content="Content",
            organization_id="org-123",
            created_by_user_id="user-123",
        )
        db_session.add(template)
        await db_session.flush()

        generated = GeneratedDocument(
            template_id=template.id,
            generated_content="Generated content",
            organization_id="org-123",
            generated_by_user_id="user-123",
            status=DocumentStatus.DRAFT,
        )
        db_session.add(generated)
        await db_session.commit()

        assert generated.status == DocumentStatus.DRAFT

        # Update status
        generated.status = DocumentStatus.FINALIZED
        await db_session.commit()
        await db_session.refresh(generated)

        assert generated.status == DocumentStatus.FINALIZED

    @pytest.mark.asyncio
    async def test_generated_document_timestamps(self, db_session: AsyncSession):
        """Test generated document has timestamps"""
        template = DocumentTemplate(
            name="Template",
            content="Content",
            organization_id="org-123",
            created_by_user_id="user-123",
        )
        db_session.add(template)
        await db_session.flush()

        generated = GeneratedDocument(
            template_id=template.id,
            generated_content="Content",
            organization_id="org-123",
            generated_by_user_id="user-123",
        )
        db_session.add(generated)
        await db_session.commit()
        await db_session.refresh(generated)

        assert generated.created_at is not None
        assert isinstance(generated.created_at, datetime)

    @pytest.mark.asyncio
    async def test_generated_document_file_path(self, db_session: AsyncSession):
        """Test generated document can have file path"""
        template = DocumentTemplate(
            name="Template",
            content="Content",
            organization_id="org-123",
            created_by_user_id="user-123",
        )
        db_session.add(template)
        await db_session.flush()

        generated = GeneratedDocument(
            template_id=template.id,
            generated_content="Content",
            file_path="documents/generated/nda-2025-11-13.pdf",
            organization_id="org-123",
            generated_by_user_id="user-123",
        )
        db_session.add(generated)
        await db_session.commit()

        assert generated.file_path == "documents/generated/nda-2025-11-13.pdf"
