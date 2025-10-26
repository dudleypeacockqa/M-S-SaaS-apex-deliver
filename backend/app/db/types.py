"""Database type helpers for cross-dialect compatibility."""
from __future__ import annotations

from functools import lru_cache

from sqlalchemy.types import JSON as SQLAlchemyJSON

try:  # pragma: no cover - JSONB available when psycopg2 installed
    from sqlalchemy.dialects.postgresql import JSONB as PostgreSQLJSONB
except ImportError:  # pragma: no cover - fallback when dialect missing
    PostgreSQLJSONB = SQLAlchemyJSON  # type: ignore

from app.core.config import settings


@lru_cache(maxsize=1)
def json_type():
    """Return the appropriate JSON column type for the configured database."""

    database_url = (settings.database_url or "").lower()
    if database_url.startswith("postgresql") or database_url.startswith("postgres"):
        return PostgreSQLJSONB
    return SQLAlchemyJSON


# Convenience alias so models can simply import JSONType
JSONType = json_type()
