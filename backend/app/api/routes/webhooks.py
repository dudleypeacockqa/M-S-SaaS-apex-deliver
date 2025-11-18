"""
Webhook API Routes

API endpoints for webhook management and incoming webhook processing.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services import voice_service

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/voice/incoming")
async def handle_voice_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Handle incoming voice call webhook from Synthflow.
    
    This endpoint processes webhooks from Synthflow when voice call events occur.
    No authentication required (webhook signature validation should be added).
    
    Args:
        request: FastAPI request object
        db: Database session
        
    Returns:
        Webhook processing result
    """
    try:
        webhook_data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    try:
        result = voice_service.handle_voice_webhook(webhook_data, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing webhook: {str(e)}")

