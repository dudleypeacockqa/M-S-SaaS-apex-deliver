"""API router definitions."""
from fastapi import APIRouter

from app.api.routes import admin, auth, dashboard, deals, documents, financial, podcasts, subscriptions, tasks, valuation
from app.api.webhooks import clerk
# deal_matching temporarily disabled - DEV-018 not yet complete

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(clerk.router)
api_router.include_router(admin.router)
api_router.include_router(dashboard.router)
api_router.include_router(deals.router)
# api_router.include_router(deal_matching.router)  # DEV-018
api_router.include_router(documents.router)
api_router.include_router(subscriptions.router)
api_router.include_router(financial.router)
api_router.include_router(podcasts.router)
api_router.include_router(tasks.router)
api_router.include_router(valuation.router)


