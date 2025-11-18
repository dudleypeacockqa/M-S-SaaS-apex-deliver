"""Voice webhook endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services import voice_service

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/voice/incoming")
async def handle_voice_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """Handle incoming voice call webhooks from Synthflow."""
    try:
        webhook_data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    try:
        result = voice_service.handle_voice_webhook(webhook_data, db)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error processing webhook: {exc}")
