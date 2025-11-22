"""
TDD Tests for Template Service

Tests for template rendering and management service following TDD principles.
Write tests first (RED), then implement service (GREEN).
"""
import pytest
from sqlalchemy.orm import Session

from app.models.master_admin import CampaignTemplate
from app.models.user import User
from app.models.organization import Organization
from app.services import template_service


class TestCreateTemplate:
    """Test template creation functionality."""
    
    def test_create_template_with_variables(self, db: Session, test_user: User, test_org: Organization):
        """Test creating a template with variables."""
        template_data = {
            "name": "Welcome Email Template",
            "subject": "Welcome to {{company_name}}, {{first_name}}!",
            "content": "Hi {{first_name}}, welcome to {{company_name}}. We're excited to have you!",
            "type": "email",
            "variables": ["first_name", "company_name"],
        }
        
        template = template_service.create_template(
            template_data, str(test_org.id), str(test_user.id), db
        )
        
        assert template.id is not None
        assert template.name == "Welcome Email Template"
        assert len(template.variables) == 2
        assert "first_name" in template.variables
        assert "company_name" in template.variables
    
    def test_create_template_auto_detects_variables(self, db: Session, test_user: User, test_org: Organization):
        """Test that template automatically detects variables from content."""
        template_data = {
            "name": "Auto-detect Template",
            "subject": "Hello {{first_name}}",
            "content": "Hi {{first_name}}, your company {{company}} is great!",
            "type": "email",
        }
        
        template = template_service.create_template(
            template_data, str(test_org.id), str(test_user.id), db
        )
        
        assert "first_name" in template.variables
        assert "company" in template.variables


class TestRenderTemplate:
    """Test template rendering functionality."""
    
    def test_render_template(self, db: Session, test_user: User, test_org: Organization):
        """Test rendering a template with contact data."""
        # Create template
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Test Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}, welcome to {{company}}!",
            type="email",
            variables=["first_name", "company"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        contact_data = {
            "first_name": "John",
            "company": "Acme Corp",
        }
        
        rendered = template_service.render_template(template.id, contact_data, db)
        
        assert rendered["subject"] == "Hello John"
        assert rendered["content"] == "Hi John, welcome to Acme Corp!"
    
    def test_render_template_missing_variable(self, db: Session, test_user: User, test_org: Organization):
        """Test that rendering with missing variables raises an error."""
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Test Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        contact_data = {}  # Missing first_name
        
        with pytest.raises(ValueError, match="Missing required"):
            template_service.render_template(template.id, contact_data, db)
    
    def test_render_template_extra_variables(self, db: Session, test_user: User, test_org: Organization):
        """Test that extra variables in contact_data are ignored."""
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Test Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        contact_data = {
            "first_name": "John",
            "extra_field": "This should be ignored",
        }
        
        rendered = template_service.render_template(template.id, contact_data, db)
        
        assert rendered["subject"] == "Hello John"
        assert "extra_field" not in rendered["content"]
    
    def test_render_template_not_found(self, db: Session):
        """Test rendering a non-existent template."""
        contact_data = {"first_name": "John"}
        
        with pytest.raises(ValueError, match="not found"):
            template_service.render_template(99999, contact_data, db)
    
    def test_render_template_auto_detect_variables(self, db: Session, test_user: User, test_org: Organization):
        """Test rendering when variables are auto-detected from content."""
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Test Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}, welcome to {{company}}!",
            type="email",
            variables=None,  # Not set, should auto-detect
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        contact_data = {
            "first_name": "John",
            "company": "Acme Corp",
        }
        
        rendered = template_service.render_template(template.id, contact_data, db)
        
        assert rendered["subject"] == "Hello John"
        assert rendered["content"] == "Hi John, welcome to Acme Corp!"


class TestTemplateValidation:
    """Test template validation functionality."""
    
    def test_template_validation_valid(self, db: Session):
        """Test that valid template syntax passes validation."""
        template_content = "Hi {{first_name}}, welcome to {{company}}!"
        
        is_valid, errors = template_service.validate_template(template_content)
        
        assert is_valid == True
        assert len(errors) == 0
    
    def test_template_validation_unclosed_variable(self, db: Session):
        """Test that unclosed variables are detected."""
        template_content = "Hi {{first_name, welcome!"
        
        is_valid, errors = template_service.validate_template(template_content)
        
        assert is_valid == False
        assert len(errors) > 0
        assert any("mismatched" in error.lower() or "bracket" in error.lower() for error in errors)
    
    def test_template_validation_nested_variables(self, db: Session):
        """Test that nested variables are detected."""
        template_content = "Hi {{first_name}}, your {{company{{name}}}} is great!"
        
        is_valid, errors = template_service.validate_template(template_content)
        
        assert is_valid == False
        assert len(errors) > 0
        assert any("nested" in error.lower() for error in errors)
    
    def test_template_validation_malformed_variable(self, db: Session):
        """Test that malformed variables are detected."""
        template_content = "Hi {{first_name, welcome!"
        
        is_valid, errors = template_service.validate_template(template_content)
        
        assert is_valid == False
        assert len(errors) > 0


class TestUpdateTemplate:
    """Test template update functionality."""
    
    def test_update_template(self, db: Session, test_user: User, test_org: Organization):
        """Test updating a template."""
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Original Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        update_data = {
            "name": "Updated Template",
            "subject": "Updated {{first_name}}",
            "content": "Updated content {{first_name}}",
        }
        
        updated = template_service.update_template(template, update_data, db)
        
        assert updated.name == "Updated Template"
        assert updated.subject == "Updated {{first_name}}"
        assert updated.content == "Updated content {{first_name}}"
        # Variables should be re-extracted
        assert "first_name" in updated.variables
    
    def test_update_template_partial(self, db: Session, test_user: User, test_org: Organization):
        """Test partial update (only name)."""
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Original Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        update_data = {"name": "Partially Updated"}
        
        updated = template_service.update_template(template, update_data, db)
        
        assert updated.name == "Partially Updated"
        assert updated.subject == "Hello {{first_name}}"  # Unchanged
        assert updated.content == "Hi {{first_name}}!"  # Unchanged


class TestDeleteTemplate:
    """Test template deletion functionality."""
    
    def test_delete_template(self, db: Session, test_user: User, test_org: Organization):
        """Test deleting a template."""
        from sqlalchemy import select
        
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Template to Delete",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        template_id = template.id
        
        template_service.delete_template(template, db)
        
        # Verify template is deleted
        result = db.execute(
            select(CampaignTemplate).where(CampaignTemplate.id == template_id)
        )
        assert result.scalar_one_or_none() is None


class TestGetTemplate:
    """Test template retrieval functionality."""
    
    def test_get_template(self, db: Session, test_user: User, test_org: Organization):
        """Test getting a template by ID."""
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Test Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        retrieved = template_service.get_template(template.id, str(test_org.id), db)
        
        assert retrieved is not None
        assert retrieved.id == template.id
        assert retrieved.name == "Test Template"
    
    def test_get_template_not_found(self, db: Session, test_org: Organization):
        """Test getting a non-existent template."""
        retrieved = template_service.get_template(99999, str(test_org.id), db)
        
        assert retrieved is None
    
    def test_get_template_wrong_organization(self, db: Session, test_user: User, test_org: Organization):
        """Test getting a template from wrong organization."""
        template = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Test Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        # Try to get with different organization ID
        retrieved = template_service.get_template(template.id, "wrong-org-id", db)
        
        assert retrieved is None


class TestListTemplates:
    """Test template listing functionality."""
    
    def test_list_templates(self, db: Session, test_user: User, test_org: Organization):
        """Test listing all templates for an organization."""
        template1 = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Template 1",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        template2 = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Template 2",
            subject="Hello {{name}}",
            content="Hi {{name}}!",
            type="voice",
            variables=["name"],
            created_by=str(test_user.id),
        )
        db.add(template1)
        db.add(template2)
        db.commit()
        
        templates = template_service.list_templates(str(test_org.id), db)
        
        assert len(templates) >= 2
        assert any(t.name == "Template 1" for t in templates)
        assert any(t.name == "Template 2" for t in templates)
    
    def test_list_templates_with_type_filter(self, db: Session, test_user: User, test_org: Organization):
        """Test listing templates filtered by type."""
        template1 = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Email Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            created_by=str(test_user.id),
        )
        template2 = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Voice Template",
            subject="Hello {{name}}",
            content="Hi {{name}}!",
            type="voice",
            variables=["name"],
            created_by=str(test_user.id),
        )
        db.add(template1)
        db.add(template2)
        db.commit()
        
        templates = template_service.list_templates(str(test_org.id), db, template_type="email")
        
        assert all(t.type == "email" for t in templates)
        assert any(t.name == "Email Template" for t in templates)
    
    def test_list_templates_with_is_default_filter(self, db: Session, test_user: User, test_org: Organization):
        """Test listing templates filtered by is_default flag."""
        template1 = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Default Template",
            subject="Hello {{first_name}}",
            content="Hi {{first_name}}!",
            type="email",
            variables=["first_name"],
            is_default=True,
            created_by=str(test_user.id),
        )
        template2 = CampaignTemplate(
            organization_id=str(test_org.id),
            name="Non-Default Template",
            subject="Hello {{name}}",
            content="Hi {{name}}!",
            type="email",
            variables=["name"],
            is_default=False,
            created_by=str(test_user.id),
        )
        db.add(template1)
        db.add(template2)
        db.commit()
        
        templates = template_service.list_templates(str(test_org.id), db, is_default=True)
        
        assert all(t.is_default is True for t in templates)
        assert any(t.name == "Default Template" for t in templates)

