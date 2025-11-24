"""GoHighLevel CRM integration service for contact form submissions."""

import logging
from typing import Optional
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


async def sync_contact_to_gohighlevel(
    name: str,
    email: str,
    phone: Optional[str] = None,
    company: Optional[str] = None,
    message: Optional[str] = None,
) -> bool:
    """
    Sync contact form submission to GoHighLevel CRM.
    
    Args:
        name: Contact full name
        email: Contact email address
        phone: Optional phone number
        company: Optional company name
        message: Optional message content
        
    Returns:
        True if sync successful, False otherwise
    """
    if not settings.gohighlevel_api_key or not settings.gohighlevel_location_id:
        logger.warning("GoHighLevel not configured; skipping CRM sync")
        return False
    
    try:
        # GoHighLevel API endpoint for creating contacts
        url = f"https://services.leadconnectorhq.com/contacts/"
        
        headers = {
            "Authorization": f"Bearer {settings.gohighlevel_api_key}",
            "Version": "2021-07-28",
            "Content-Type": "application/json",
        }
        
        payload = {
            "name": name,
            "email": email,
            "phone": phone or "",
            "companyName": company or "",
            "source": "Website Contact Form",
            "tags": ["website", "contact-form"],
        }
        
        # Add custom field for message if supported
        if message:
            payload["customFields"] = [
                {
                    "name": "Message",
                    "value": message[:500]  # Limit length
                }
            ]
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                url,
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            
        logger.info(f"Successfully synced contact {email} to GoHighLevel")
        return True
        
    except httpx.HTTPError as exc:
        logger.error(f"Failed to sync contact to GoHighLevel: {exc}")
        return False
    except Exception as exc:
        logger.error(f"Unexpected error syncing to GoHighLevel: {exc}")
        return False

