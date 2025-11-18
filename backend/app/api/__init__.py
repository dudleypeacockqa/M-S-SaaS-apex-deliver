"""API router definitions."""
from fastapi import APIRouter

from app.api.routes import auth, blog, community, dashboard, deal_matching, deals, documents, document_generation, events, event_payments, financial, fpa, marketing, master_admin, notifications, podcasts, pmi, subscriptions, tasks, valuation, pipeline_templates
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
api_router.include_router(document_generation.router)  # F-009: Automated Document Generation
api_router.include_router(events.router)  # F-012: Event Management Hub
api_router.include_router(event_payments.router)  # DEV-019: Stripe Event Payments
api_router.include_router(notifications.router)  # DEV-020: Email Notifications
api_router.include_router(subscriptions.router)
api_router.include_router(pipeline_templates.router)
api_router.include_router(financial.router)
api_router.include_router(podcasts.router)
api_router.include_router(tasks.router)
api_router.include_router(valuation.router)
api_router.include_router(blog.router)
api_router.include_router(marketing.router)
api_router.include_router(fpa.router)  # FP&A Module - CapLiquify FP&A Dashboard
api_router.include_router(pmi.router)  # PMI Module - Post-Merger Integration
api_router.include_router(master_admin.router)  # Master Admin Portal - Full implementation
api_router.include_router(community.router)  # F-013: Community Platform - Full implementation


