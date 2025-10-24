"""API router definitions."""
from fastapi import APIRouter

from app.api.routes import auth, deals, admin
from app.api.webhooks import clerk

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(clerk.router)
api_router.include_router(admin.router)
api_router.include_router(deals.router)
# TODO: Add documents router once implemented (DEV-008)
# api_router.include_router(documents.router)
# api_router.include_router(documents.folder_router)
