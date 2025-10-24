"""API router definitions."""
from fastapi import APIRouter

from app.api.routes import auth, deals
from app.api.webhooks import clerk
from app.api.admin import router as admin_router

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(clerk.router)
api_router.include_router(admin_router)
api_router.include_router(deals.router)
