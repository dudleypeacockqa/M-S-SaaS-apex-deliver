"""Route package exports."""

from . import admin, auth, dashboard, deal_matching, deals, documents, financial, podcasts, subscriptions, tasks, valuation
# NOTE: master_admin temporarily disabled - incomplete schemas
# from . import master_admin

__all__ = [
    "admin",
    "auth",
    "dashboard",
    "deal_matching",
    "deals",
    "documents",
    "financial",
    # "master_admin",  # Disabled - incomplete schemas
    "podcasts",
    "subscriptions",
    "tasks",
    "valuation",
]
