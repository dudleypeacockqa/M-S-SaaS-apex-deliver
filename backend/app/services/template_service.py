"""
Template Service

Service for managing campaign templates with variable substitution.
"""
import re
from typing import Dict, List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.master_admin import CampaignTemplate
from app.models.user import User


def extract_variables(content: str) -> List[str]:
    """
    Extract template variables from content.
    
    Variables are in the format {{variable_name}}.
    
    Args:
        content: Template content string
        
    Returns:
        List of unique variable names found in content
    """
    pattern = r'\{\{(\w+)\}\}'
    variables = re.findall(pattern, content)
    return list(set(variables))  # Return unique variables


def validate_template(content: str) -> Tuple[bool, List[str]]:
    """
    Validate template syntax.
    
    Args:
        content: Template content to validate
        
    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors = []
    
    # Check for unclosed variables
    open_count = content.count('{{')
    close_count = content.count('}}')
    
    if open_count != close_count:
        errors.append(f"Mismatched variable brackets: {open_count} opening, {close_count} closing")
    
    # Check for nested variables (not supported)
    if re.search(r'\{\{[^}]+\{\{', content):
        errors.append("Nested variables are not supported")
    
    # Check for malformed variables
    malformed = re.findall(r'\{\{[^}]*[^}]$', content)
    if malformed:
        errors.append(f"Malformed variables found: {malformed}")
    
    return len(errors) == 0, errors


def render_template(template_id: int, contact_data: Dict[str, str], db: Session) -> Dict[str, str]:
    """
    Render a template with contact data.
    
    Args:
        template_id: ID of the template to render
        contact_data: Dictionary of variable values
        db: Database session
        
    Returns:
        Dictionary with 'subject' and 'content' keys containing rendered strings
        
    Raises:
        ValueError: If template not found or required variables missing
    """
    result = db.execute(select(CampaignTemplate).where(CampaignTemplate.id == template_id))
    template = result.scalar_one_or_none()
    
    if not template:
        raise ValueError(f"Template {template_id} not found")
    
    # Get required variables
    required_vars = template.variables or []
    if not required_vars:
        # Auto-detect if not set
        required_vars = extract_variables(template.content or "")
        if template.subject:
            required_vars.extend(extract_variables(template.subject))
        required_vars = list(set(required_vars))
    
    # Check for missing variables
    missing = [var for var in required_vars if var not in contact_data]
    if missing:
        raise ValueError(f"Missing required variables: {', '.join(missing)}")
    
    # Render subject
    rendered_subject = template.subject or ""
    for var in required_vars:
        if var in contact_data:
            rendered_subject = rendered_subject.replace(f"{{{{{var}}}}}", str(contact_data[var]))
    
    # Render content
    rendered_content = template.content or ""
    for var in required_vars:
        if var in contact_data:
            rendered_content = rendered_content.replace(f"{{{{{var}}}}}", str(contact_data[var]))
    
    return {
        "subject": rendered_subject,
        "content": rendered_content,
    }


def create_template(
    template_data: Dict,
    organization_id: str,
    user_id: str,
    db: Session
) -> CampaignTemplate:
    """
    Create a new campaign template.
    
    Args:
        template_data: Dictionary with template fields (name, subject, content, type, etc.)
        organization_id: Organization ID
        user_id: User ID of creator
        db: Database session
        
    Returns:
        Created CampaignTemplate instance
    """
    # Auto-detect variables if not provided
    variables = template_data.get("variables")
    if not variables:
        variables = []
        if template_data.get("subject"):
            variables.extend(extract_variables(template_data["subject"]))
        if template_data.get("content"):
            variables.extend(extract_variables(template_data["content"]))
        variables = list(set(variables))
    
    template = CampaignTemplate(
        organization_id=organization_id,
        name=template_data["name"],
        subject=template_data.get("subject"),
        content=template_data["content"],
        type=template_data["type"],
        variables=variables,
        is_default=template_data.get("is_default", False),
        created_by=user_id,
    )
    
    db.add(template)
    db.commit()
    db.refresh(template)
    
    return template


def get_template(template_id: int, organization_id: str, db: Session) -> Optional[CampaignTemplate]:
    """
    Get a template by ID.
    
    Args:
        template_id: Template ID
        organization_id: Organization ID for access control
        db: Database session
        
    Returns:
        CampaignTemplate instance or None if not found
    """
    result = db.execute(
        select(CampaignTemplate).where(
            CampaignTemplate.id == template_id,
            CampaignTemplate.organization_id == organization_id
        )
    )
    return result.scalar_one_or_none()


def list_templates(
    organization_id: str,
    db: Session,
    template_type: Optional[str] = None,
    is_default: Optional[bool] = None
) -> List[CampaignTemplate]:
    """
    List templates for an organization.
    
    Args:
        organization_id: Organization ID
        db: Database session
        template_type: Optional filter by type
        is_default: Optional filter by is_default flag
        
    Returns:
        List of CampaignTemplate instances
    """
    query = select(CampaignTemplate).where(
        CampaignTemplate.organization_id == organization_id
    )
    
    if template_type:
        query = query.where(CampaignTemplate.type == template_type)
    
    if is_default is not None:
        query = query.where(CampaignTemplate.is_default == is_default)
    
    result = db.execute(query)
    return list(result.scalars().all())


def update_template(
    template: CampaignTemplate,
    template_data: Dict,
    db: Session
) -> CampaignTemplate:
    """
    Update an existing template.
    
    Args:
        template: Template instance to update
        template_data: Dictionary with fields to update
        db: Database session
        
    Returns:
        Updated CampaignTemplate instance
    """
    if "name" in template_data:
        template.name = template_data["name"]
    if "subject" in template_data:
        template.subject = template_data["subject"]
    if "content" in template_data:
        template.content = template_data["content"]
    if "type" in template_data:
        template.type = template_data["type"]
    if "is_default" in template_data:
        template.is_default = template_data["is_default"]
    
    # Re-extract variables if content or subject changed
    if "content" in template_data or "subject" in template_data:
        variables = []
        if template.subject:
            variables.extend(extract_variables(template.subject))
        if template.content:
            variables.extend(extract_variables(template.content))
        template.variables = list(set(variables))
    
    db.commit()
    db.refresh(template)
    
    return template


def delete_template(template: CampaignTemplate, db: Session) -> None:
    """
    Delete a template.
    
    Args:
        template: Template instance to delete
        db: Database session
    """
    db.delete(template)
    db.commit()

