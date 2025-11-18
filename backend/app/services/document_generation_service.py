"""
Document Generation Service
Feature: F-009 Automated Document Generation
"""
import re
from pathlib import Path
from typing import List, Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.orm import Session
from datetime import datetime, UTC

from app.models.document_generation import (
    DocumentTemplate,
    GeneratedDocument,
    TemplateStatus,
    DocumentStatus,
)
from app.schemas.document_generation import (
    DocumentTemplateCreate,
    DocumentTemplateUpdate,
    GeneratedDocumentCreate,
    TemplateRenderRequest,
)
from app.core.config import settings


class DocumentGenerationService:
    """Service for managing document templates and generation"""

    @staticmethod
    def _write_generated_file(
        *,
        organization_id: str,
        document_id: str,
        content: str,
        file_format: str,
    ) -> str:
        """Persist generated file content to storage directory."""
        base_path = Path(settings.storage_path) / "generated_documents" / organization_id
        base_path.mkdir(parents=True, exist_ok=True)
        extension = "pdf" if file_format in ("pdf", "application/pdf") else "docx"
        file_name = f"{document_id}.{extension}"
        file_path = base_path / file_name
        file_path.write_text(content, encoding="utf-8")
        return str(file_path)

    # ========================================================================
    # Template CRUD Operations
    # ========================================================================

    @staticmethod
    def create_template(
        db: Session,
        template_data: DocumentTemplateCreate,
    ) -> DocumentTemplate:
        """Create a new document template"""
        template = DocumentTemplate(
            name=template_data.name,
            description=template_data.description,
            template_type=template_data.template_type,
            content=template_data.content,
            variables=template_data.variables,
            organization_id=template_data.organization_id,
            created_by_user_id=template_data.created_by_user_id,
            status=TemplateStatus.ACTIVE,
            version=1,
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        return template

    @staticmethod
    def get_template(
        db: Session,
        template_id: str,
        organization_id: str,
    ) -> Optional[DocumentTemplate]:
        """Get a template by ID (with organization check)"""
        return db.scalar(
            select(DocumentTemplate).where(
                DocumentTemplate.id == template_id,
                DocumentTemplate.organization_id == organization_id,
            )
        )

    @staticmethod
    def list_templates(
        db: Session,
        organization_id: str,
        status: Optional[str] = None,
        template_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[DocumentTemplate]:
        """List templates for an organization with optional filters"""
        query = select(DocumentTemplate).where(
            DocumentTemplate.organization_id == organization_id
        )

        if status:
            query = query.where(DocumentTemplate.status == status)
        if template_type:
            query = query.where(DocumentTemplate.template_type == template_type)

        query = query.order_by(DocumentTemplate.created_at.desc())
        query = query.offset(skip).limit(limit)

        return list(db.scalars(query).all())

    @staticmethod
    def update_template(
        db: Session,
        template_id: str,
        organization_id: str,
        update_data: DocumentTemplateUpdate,
    ) -> Optional[DocumentTemplate]:
        """Update an existing template"""
        template = DocumentGenerationService.get_template(
            db, template_id, organization_id
        )
        if not template:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(template, field, value)

        template.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(template)
        return template

    @staticmethod
    def delete_template(
        db: Session,
        template_id: str,
        organization_id: str,
    ) -> bool:
        """Archive a template (soft delete)"""
        template = DocumentGenerationService.get_template(
            db, template_id, organization_id
        )
        if not template:
            return False

        template.status = TemplateStatus.ARCHIVED
        template.updated_at = datetime.now(UTC)
        db.commit()
        return True

    # ========================================================================
    # Template Rendering & Document Generation
    # ========================================================================

    @staticmethod
    def extract_variables(template_content: str) -> List[str]:
        """Extract variable names from template content ({{variable_name}})"""
        pattern = r'\{\{(\w+)\}\}'
        variables = re.findall(pattern, template_content)
        return list(set(variables))  # Remove duplicates

    @staticmethod
    def render_template(
        template_content: str,
        variable_values: Dict[str, Any],
    ) -> str:
        """Replace {{variables}} in template with actual values"""
        rendered = template_content

        for var_name, var_value in variable_values.items():
            pattern = f'{{{{{var_name}}}}}'
            rendered = rendered.replace(pattern, str(var_value))

        return rendered

    @staticmethod
    def generate_document(
        db: Session,
        template_id: str,
        organization_id: str,
        generated_by_user_id: str,
        render_request: TemplateRenderRequest,
    ) -> Optional[GeneratedDocument]:
        """Generate a document from a template"""
        # Get template
        template = DocumentGenerationService.get_template(
            db, template_id, organization_id
        )
        if not template or template.status != TemplateStatus.ACTIVE:
            return None

        # Validate variables
        required_vars = set(template.variables)
        provided_vars = set(render_request.variable_values.keys())
        missing_vars = required_vars - provided_vars

        if missing_vars:
            raise ValueError(f"Missing required variables: {', '.join(missing_vars)}")

        # Render template
        generated_content = DocumentGenerationService.render_template(
            template.content,
            render_request.variable_values,
        )

        # Create generated document
        generated = GeneratedDocument(
            template_id=template_id,
            generated_content=generated_content,
            variable_values=render_request.variable_values,
            organization_id=organization_id,
            generated_by_user_id=generated_by_user_id,
            status=DocumentStatus.GENERATED,
        )

        # TODO: If generate_file is True, generate PDF/DOCX and set file_path
        # This would integrate with a library like WeasyPrint (PDF) or python-docx (DOCX)
        if render_request.generate_file:
            generated.file_path = DocumentGenerationService._write_generated_file(
                organization_id=organization_id,
                document_id=str(generated.id),
                content=generated_content,
                file_format=render_request.file_format or "pdf",
            )

        db.add(generated)
        db.flush()  # Flush to get the document ID
        
        # Create initial version snapshot
        from app.models.document_generation import DocumentVersion
        initial_version = DocumentVersion(
            document_id=generated.id,
            version_number=1,
            content=generated_content,
            label="v1.0",
            summary="Initial version",
            organization_id=organization_id,
            created_by_user_id=generated_by_user_id,
        )
        db.add(initial_version)
        
        db.commit()
        db.refresh(generated)
        return generated

    # ========================================================================
    # Generated Document Operations
    # ========================================================================

    @staticmethod
    def get_generated_document(
        db: Session,
        document_id: str,
        organization_id: str,
    ) -> Optional[GeneratedDocument]:
        """Get a generated document by ID (with organization check)"""
        return db.scalar(
            select(GeneratedDocument).where(
                GeneratedDocument.id == document_id,
                GeneratedDocument.organization_id == organization_id,
            )
        )

    @staticmethod
    def list_generated_documents(
        db: Session,
        organization_id: str,
        template_id: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[GeneratedDocument]:
        """List generated documents for an organization"""
        query = select(GeneratedDocument).where(
            GeneratedDocument.organization_id == organization_id
        )

        if template_id:
            query = query.where(GeneratedDocument.template_id == template_id)
        if status:
            query = query.where(GeneratedDocument.status == status)

        query = query.order_by(GeneratedDocument.created_at.desc())
        query = query.offset(skip).limit(limit)

        return list(db.scalars(query).all())

    @staticmethod
    def update_generated_document_status(
        db: Session,
        document_id: str,
        organization_id: str,
        new_status: DocumentStatus,
    ) -> Optional[GeneratedDocument]:
        """Update the status of a generated document"""
        document = DocumentGenerationService.get_generated_document(
            db, document_id, organization_id
        )
        if not document:
            return None

        document.status = new_status
        document.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(document)
        return document

    @staticmethod
    def update_generated_document(
        db: Session,
        document_id: str,
        organization_id: str,
        update_data: "GeneratedDocumentUpdate",
        user_id: Optional[str] = None,
    ) -> Optional[GeneratedDocument]:
        """Update a generated document (content, status, file_path)"""
        from app.schemas.document_generation import GeneratedDocumentUpdate
        from app.models.document_generation import DocumentVersion
        from sqlalchemy import select, desc
        
        document = DocumentGenerationService.get_generated_document(
            db, document_id, organization_id
        )
        if not document:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        
        # If content is being updated, create a version snapshot first
        if "generated_content" in update_dict and update_dict["generated_content"] != document.generated_content:
            # Get latest version number
            latest_version = db.scalar(
                select(DocumentVersion)
                .where(DocumentVersion.document_id == document_id)
                .order_by(desc(DocumentVersion.version_number))
                .limit(1)
            )
            
            # Create version snapshot of current content
            new_version_number = (latest_version.version_number + 1) if latest_version else 1
            version = DocumentVersion(
                document_id=document_id,
                version_number=new_version_number,
                content=document.generated_content,  # Save current content before update
                label=f"v{new_version_number}",
                summary="Auto-saved version",
                organization_id=organization_id,
                created_by_user_id=user_id or document.generated_by_user_id,
            )
            db.add(version)
            
            # Update document content
            document.generated_content = update_dict["generated_content"]
        
        if "status" in update_dict:
            document.status = DocumentStatus(update_dict["status"])
        if "file_path" in update_dict:
            document.file_path = update_dict["file_path"]

        document.updated_at = datetime.now(UTC)
        db.commit()
        db.refresh(document)
        return document
