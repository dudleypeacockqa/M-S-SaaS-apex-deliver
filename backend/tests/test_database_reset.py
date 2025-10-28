"""Regression tests for SQLite metadata reset stability."""
from __future__ import annotations

from sqlalchemy import inspect

from backend.tests.conftest import _reset_metadata


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