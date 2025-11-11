"""API router definitions."""
from fastapi import APIRouter

from app.api.routes import auth, blog, dashboard, deal_matching, deals, documents, financial, marketing, master_admin, podcasts, subscriptions, tasks, valuation, pipeline_templates
from app.api import document_sharing
from app.api.webhooks import clerk

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(clerk.router)
api_router.include_router(dashboard.router)
api_router.include_router(deals.router)
api_router.include_router(deal_matching.router)
api_router.include_router(documents.router)
api_router.include_router(document_sharing.router)  # Document external sharing with expiring links
api_router.include_router(subscriptions.router)
api_router.include_router(pipeline_templates.router)
api_router.include_router(financial.router)
api_router.include_router(podcasts.router)
api_router.include_router(tasks.router)
api_router.include_router(valuation.router)
api_router.include_router(blog.router)
api_router.include_router(marketing.router)
api_router.include_router(master_admin.router)  # Master Admin Portal - Full implementation


