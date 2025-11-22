"""
Alembic migration regression tests that ensure `alembic upgrade head`
can be executed multiple times (idempotent) before the API starts.

These tests reuse the hardened docker-based harness in `scripts/test_migrations.py`
so we exercise the same workflow Render uses (PostgreSQL + Alembic CLI).
"""
from __future__ import annotations

import shutil
import socket
import uuid
from contextlib import contextmanager

import psycopg2
import pytest

from scripts.test_migrations import MigrationTester


DOCKER_AVAILABLE = shutil.which("docker") is not None


def _get_ephemeral_port() -> int:
    """Return an available localhost port for the temporary PostgreSQL container."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("", 0))
        return sock.getsockname()[1]


@contextmanager
def _migration_tester():
    tester = MigrationTester()
    suffix = uuid.uuid4().hex[:8]
    tester.container_name = f"{tester.container_name}-{suffix}"
    tester.db_name = f"{tester.db_name}_{suffix}"
    tester.db_port = _get_ephemeral_port()
    try:
        yield tester
    finally:
        tester._cleanup()


def _assert_required_schema_state(tester: MigrationTester) -> None:
    conn = psycopg2.connect(
        host="localhost",
        port=tester.db_port,
        user=tester.db_user,
        password=tester.db_password,
        database=tester.db_name,
        connect_timeout=10,
    )
    try:
        with conn.cursor() as cur:
            # Required tables
            for table_name in ("users", "organizations", "deals", "pipeline_stages"):
                cur.execute("SELECT to_regclass(%s)", (table_name,))
                row = cur.fetchone()
                assert row and row[0] == table_name, f"Table {table_name} missing after migrations"

            # users.deleted_at column
            cur.execute(
                """
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = %s AND column_name = %s
                """,
                ("users", "deleted_at"),
            )
            assert cur.fetchone(), "users.deleted_at column must exist"

            # Alembic version should be a single head
            cur.execute("SELECT COUNT(*) FROM alembic_version")
            count = cur.fetchone()[0]
            assert count == 1, f"Expected single alembic_version row, found {count}"
    finally:
        conn.close()


@pytest.mark.skipif(not DOCKER_AVAILABLE, reason="Docker CLI is required for migration idempotency test")
def test_alembic_upgrade_can_run_twice_without_failures():
    """Run `alembic upgrade head` twice to verify migrations stay idempotent."""
    with _migration_tester() as tester:
        if not tester._check_docker():
            pytest.skip("Docker daemon is not available on this host")
        assert tester._start_postgres_container(), "Failed to start PostgreSQL container"
        assert tester._wait_for_postgres(), "PostgreSQL container did not become ready"
        assert tester._create_test_database(), "Test database was not reachable"

        assert tester._run_migrations_upgrade(), "Initial migration run failed"
        assert tester._verify_schema_consistency(), "Schema verification failed after first upgrade"

        # Re-run to catch duplicate DDL or unsupported assumptions
        assert tester._test_reupgrade(), "Second `alembic upgrade head` failed"

        _assert_required_schema_state(tester)

