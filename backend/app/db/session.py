"""Database session management - imports from core.database for lazy init."""
from __future__ import annotations

# Re-export from core.database for backward compatibility
from app.core.database import SessionLocal, engine, get_db, init_engine

__all__ = ["engine", "SessionLocal", "get_db", "init_engine"]
