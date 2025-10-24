"""API router definitions."""
from fastapi import APIRouter

from app.api.routes import auth, admin
from app.api.webhooks import clerk

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(clerk.router)
api_router.include_router(admin.router)
