"""SQLAlchemy session management."""
from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(settings.database_url, future=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)


def get_db() -> Iterator[Session]:
    """Yield a transactional database session."""

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
