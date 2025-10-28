"""Regression tests for SQLite metadata reset stability."""
from __future__ import annotations

import pytest
from sqlalchemy import inspect
from sqlalchemy.exc import OperationalError

from app.db.base import Base
from backend.tests.conftest import _reset_metadata, _safe_drop_schema


def test_reset_metadata_handles_missing_tables(engine):
    """Dropping tables manually should not break metadata reset."""

    with engine.begin() as connection:
        connection.exec_driver_sql("DROP TABLE IF EXISTS podcast_transcripts")
        connection.exec_driver_sql("DROP TABLE IF EXISTS valuation_export_logs")
        connection.exec_driver_sql("DROP TABLE IF EXISTS financial_ratios")

    _reset_metadata(engine)

    inspector = inspect(engine)
    tables = set(inspector.get_table_names())
    assert "podcast_transcripts" in tables
    assert "valuation_export_logs" in tables
    assert "financial_ratios" in tables


def test_safe_drop_schema_ignores_drop_all_failure(engine, monkeypatch):
    """Ensure drop_all errors do not bubble when cleaning sqlite metadata."""

    Base.metadata.create_all(engine, checkfirst=True)

    def boom(*args, **kwargs):  # pragma: no cover - forced failure path
        raise OperationalError("DROP TABLE", None, Exception("missing table"))

    monkeypatch.setattr(Base.metadata, "drop_all", boom)

    try:
        _safe_drop_schema(engine)
    except OperationalError as exc:
        pytest.fail(f"_safe_drop_schema should swallow OperationalError: {exc}")
