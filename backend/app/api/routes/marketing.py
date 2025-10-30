"""Marketing API routes for public website (contact, newsletter, etc.)."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
import logging

from app.db.session import get_db
from app.models.contact_message import ContactMessage

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
    """Send notification email to team about new contact form submission.

    This is a placeholder for email notification logic.
    In production, integrate with SendGrid, AWS SES, or similar.
    """
    logger.info(f"New contact form submission #{contact_id} from {name} ({email})")
    logger.info(f"Message preview: {message[:100]}...")
    # TODO: Implement actual email sending logic
    # Example with SendGrid:
    # sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
    # message = Mail(
    #     from_email='noreply@100daysandbeyond.com',
    #     to_emails='contact@100daysandbeyond.com',
    #     subject=f'New Contact Form: {name}',
    #     html_content=f'<p><strong>Name:</strong> {name}</p>...'
    # )
    # sg.send(message)


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
    """
    Subscribe to the marketing newsletter.

    - **email**: Email address to subscribe
    - **source**: Source of subscription (website, popup, etc.)
    """
    try:
        # TODO: Integrate with email service provider (Mailchimp, SendGrid, etc.)
        # For now, just log the subscription
        logger.info(f"New newsletter subscription: {subscription.email} from {subscription.source}")

        # Example Mailchimp integration:
        # from mailchimp_marketing import Client
        # mailchimp = Client()
        # mailchimp.set_config({
        #     "api_key": settings.MAILCHIMP_API_KEY,
        #     "server": settings.MAILCHIMP_SERVER_PREFIX
        # })
        #
        # member_info = {
        #     "email_address": subscription.email,
        #     "status": "subscribed",
        #     "merge_fields": {
        #         "SOURCE": subscription.source
        #     }
        # }
        #
        # mailchimp.lists.add_list_member(settings.MAILCHIMP_LIST_ID, member_info)

        return SubscribeResponse(
            success=True,
            message="Thank you for subscribing! Check your inbox for a confirmation email."
        )

    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to subscribe. Please try again later."
        )
