"""Marketing API routes for public website (contact, newsletter, etc.)."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
import logging
import httpx

from app.core.config import settings
from app.db.session import get_db
from app.models.contact_message import ContactMessage
from app.models.newsletter_subscription import NewsletterSubscription
from app.services.gohighlevel_service import sync_contact_to_gohighlevel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/marketing", tags=["marketing"])


class ContactRequest(BaseModel):
    """Contact form submission schema."""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    message: str = Field(..., min_length=10, max_length=5000)


class ContactResponse(BaseModel):
    """Contact form response schema."""
    success: bool
    message: str
    id: Optional[int] = None


class SubscribeRequest(BaseModel):
    """Newsletter subscription schema."""
    email: EmailStr
    source: Optional[str] = Field("website", max_length=100)


class SubscribeResponse(BaseModel):
    """Newsletter subscription response schema."""
    success: bool
    message: str


def send_contact_notification(contact_id: int, name: str, email: str, message: str):
    """Send notification email to team about new contact form submission."""

    if not settings.sendgrid_api_key or not settings.contact_notification_email:
        logger.warning(
            "Skipping contact notification for #%s; SendGrid not configured",
            contact_id,
        )
        return

    payload = {
        "personalizations": [
            {
                "to": [
                    {
                        "email": settings.contact_notification_email,
                        "name": settings.sendgrid_from_name,
                    }
                ],
                "subject": f"New contact form submission from {name}",
            }
        ],
        "from": {
            "email": settings.sendgrid_from_email,
            "name": settings.sendgrid_from_name,
        },
        "reply_to": {"email": email, "name": name},
        "content": [
            {
                "type": "text/plain",
                "value": (
                    f"Contact ID: {contact_id}\n"
                    f"Name: {name}\n"
                    f"Email: {email}\n\n"
                    f"Message:\n{message}"
                ),
            }
        ],
    }

    try:
        response = httpx.post(
            "https://api.sendgrid.com/v3/mail/send",
            headers={
                "Authorization": f"Bearer {settings.sendgrid_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=10,
        )
        response.raise_for_status()
        logger.info("SendGrid notification sent for contact #%s", contact_id)
    except httpx.HTTPError as exc:
        logger.error("Failed to send SendGrid notification: %s", exc)


@router.post("/contact", response_model=ContactResponse)
def submit_contact_form(
    contact: ContactRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> ContactResponse:
    """
    Submit a contact form message from the marketing website.

    - **name**: Full name of the contact
    - **email**: Email address
    - **company**: Optional company name
    - **phone**: Optional phone number
    - **message**: Message content (10-5000 characters)
    """
    try:
        # Create contact message record
        db_contact = ContactMessage(
            name=contact.name,
            email=contact.email,
            company=contact.company,
            phone=contact.phone,
            message=contact.message,
            status="new"
        )

        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)

        # Send notification email in background
        background_tasks.add_task(
            send_contact_notification,
            contact_id=db_contact.id,
            name=contact.name,
            email=contact.email,
            message=contact.message
        )
        
        # Sync to GoHighLevel CRM in background (if configured)
        if settings.gohighlevel_api_key:
            background_tasks.add_task(
                sync_contact_to_gohighlevel,
                name=contact.name,
                email=contact.email,
                phone=contact.phone,
                company=contact.company,
                message=contact.message
            )

        return ContactResponse(
            success=True,
            message="Thank you for contacting us! We'll get back to you within 24 hours.",
            id=db_contact.id
        )

    except Exception as e:
        logger.error(f"Error submitting contact form: {e}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to submit contact form. Please try again later."
        )


@router.post("/subscribe", response_model=SubscribeResponse)
def subscribe_newsletter(
    subscription: SubscribeRequest,
    db: Session = Depends(get_db),
) -> SubscribeResponse:
    """Subscribe to the marketing newsletter and persist the record."""

    try:
        existing = (
            db.query(NewsletterSubscription)
            .filter(NewsletterSubscription.email == subscription.email)
            .one_or_none()
        )

        if existing:
            existing.source = subscription.source or existing.source
            db.commit()
            logger.info(
                "Newsletter subscription already exists for %s; source updated to %s",
                subscription.email,
                existing.source,
            )
        else:
            db_sub = NewsletterSubscription(
                email=subscription.email,
                source=subscription.source or "website",
            )
            db.add(db_sub)
            db.commit()
            logger.info(
                "New newsletter subscription stored for %s (%s)",
                subscription.email,
                subscription.source,
            )

        return SubscribeResponse(
            success=True,
            message="Thank you for subscribing! Check your inbox for a confirmation email.",
        )

    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {e}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to subscribe. Please try again later.",
        )
