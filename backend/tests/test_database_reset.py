"""Regression tests for database reset helpers."""

from __future__ import annotations

import pytest
from sqlalchemy import inspect
from sqlalchemy.exc import OperationalError

from app.db.base import Base
from backend.tests.conftest import _reset_metadata, _safe_drop_schema


def test_reset_metadata_restores_dropped_tables(engine):
    """Dropping tables manually should not break metadata reset."""

    with engine.begin() as connection:
        connection.exec_driver_sql("DROP TABLE IF EXISTS podcast_transcripts")
        connection.exec_driver_sql("DROP TABLE IF EXISTS valuation_scenarios")

    _reset_metadata(engine)

    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    assert "podcast_transcripts" in tables
    assert "valuation_scenarios" in tables


def test_safe_drop_schema_handles_drop_all_errors(engine, monkeypatch):
    """_safe_drop_schema should swallow OperationalError from drop_all."""

    Base.metadata.create_all(engine, checkfirst=True)

    def boom(*_args, **_kwargs):  # pragma: no cover - forced failure path
        raise OperationalError("DROP TABLE", None, Exception("missing table"))

    monkeypatch.setattr(Base.metadata, "drop_all", boom)

    try:
        _safe_drop_schema(engine)
    except OperationalError as exc:  # pragma: no cover
        pytest.fail(f"_safe_drop_schema should not raise OperationalError: {exc}")
