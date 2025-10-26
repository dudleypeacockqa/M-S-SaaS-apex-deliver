"""API router definitions."""
from fastapi import APIRouter

from app.api.routes import admin, auth, deals, documents, subscriptions, financial
from app.api.webhooks import clerk

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(clerk.router)
api_router.include_router(admin.router)
api_router.include_router(deals.router)
api_router.include_router(documents.router)
api_router.include_router(subscriptions.router)
api_router.include_router(financial.router)

