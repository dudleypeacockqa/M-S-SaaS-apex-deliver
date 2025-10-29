"""Temporary stub router for DEV-018 deal matching endpoints.

This placeholder keeps FastAPI imports stable until the async deal matching
implementation is wired up. Full functionality will be restored from
`_deal_matching.py.disabled` during DEV-018.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/deal-matching", tags=["deal-matching"])
