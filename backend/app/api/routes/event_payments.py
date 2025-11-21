"""
Event Payment API Routes (DEV-019)
Handles Stripe payment processing for event ticket purchases.
"""
from __future__ import annotations

import os
import json
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.services import event_payment_service as payment_service

router = APIRouter(tags=["event-payments"])


@router.post("/events/{event_id}/tickets/purchase")
async def initiate_purchase(
    event_id: str,
    request_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Initiate ticket purchase by creating Stripe Checkout session.
    
    Request body:
    {
        "ticket_type": "vip",
        "quantity": 2
    }
    
    Returns:
    {
        "checkout_session_id": "cs_test_...",
        "checkout_url": "https://checkout.stripe.com/...",
        "amount": 40000,
        "currency": "gbp"
    }
    """
    ticket_type = request_data.get("ticket_type")
    quantity = request_data.get("quantity")
    
    if not ticket_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ticket_type is required"
        )
    
    if not quantity or quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="quantity must be at least 1"
        )
    
    try:
        result = await payment_service.create_checkout_session(
            db=db,
            event_id=event_id,
            user_id=current_user.id,
            ticket_type=ticket_type,
            quantity=quantity,
        )
        return result
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
        elif "invalid" in error_msg.lower() or "sold out" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )


@router.post("/webhooks/stripe/events")
async def stripe_webhook_events(
    request: Request,
    db: Session = Depends(get_db),
    stripe_signature: str = Header(None, alias="stripe-signature"),
):
    """
    Handle Stripe webhook events for event payments.
    
    This endpoint processes payment_intent.succeeded and payment_intent.payment_failed events.
    """
    # Get webhook payload
    payload = await request.json()
    
    # Verify signature if provided
    signature = stripe_signature
    
    try:
        result = await payment_service.handle_webhook(
            db=db,
            webhook_payload=payload,
            signature=signature,
        )
        return result
    except ValueError as e:
        if "Invalid webhook signature" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )


@router.get("/payments/{payment_id}/receipt")
async def get_receipt(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get receipt for payment.
    
    Returns:
    {
        "receipt_number": "RCP-2025-001",
        "payment_id": "...",
        "event_name": "M&A Summit 2025",
        "amount": 40000,
        "currency": "gbp",
        "ticket_type": "vip",
        "quantity": 2,
        "purchased_at": "2025-11-15T10:00:00Z",
        "pdf_url": "/api/payments/{payment_id}/receipt.pdf"
    }
    """
    try:
        return await payment_service.get_receipt(
            db=db,
            payment_id=payment_id,
            user_id=current_user.id,
        )
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=error_msg
            )

