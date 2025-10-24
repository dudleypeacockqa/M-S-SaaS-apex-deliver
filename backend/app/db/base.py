"""Database base class definitions."""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Declarative base for SQLAlchemy models."""

    pass


# Import models for metadata registration
from app import models  # noqa: E402,F401
