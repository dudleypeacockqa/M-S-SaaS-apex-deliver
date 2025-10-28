import pytest

from sqlalchemy import inspect

from backend.tests import conftest as test_conftest


def test_reset_database_removes_unknown_tables(engine):
    """Ensure the reset fixture drops tables not defined in Base metadata."""

    with engine.begin() as connection:
        connection.exec_driver_sql("CREATE TABLE IF NOT EXISTS legacy_table (id INTEGER PRIMARY KEY)")

    reset_gen = test_conftest._reset_database(engine)
    next(reset_gen)
    with pytest.raises(StopIteration):
        next(reset_gen)

    inspector = inspect(engine)
    assert "legacy_table" not in inspector.get_table_names()
