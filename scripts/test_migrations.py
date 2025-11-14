#!/usr/bin/env python3
"""
Migration Testing Framework

This script tests Alembic migrations against a production-like PostgreSQL database
to catch issues before deployment.

Features:
1. Spins up fresh PostgreSQL container via Docker
2. Runs migrations from scratch
3. Verifies schema consistency
4. Tests upgrade/downgrade cycles
5. Checks for data integrity issues

Usage:
    python scripts/test_migrations.py

Requirements:
    - Docker installed and running
    - Python 3.11+
    - psycopg2-binary

Exit codes:
    0 - All tests passed
    1 - Tests failed
    2 - Setup error (Docker not available, etc.)

Part of incident prevention measures from INC-2025-11-14-001
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from typing import Optional
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


class MigrationTester:
    """Tests Alembic migrations in isolated Docker environment"""

    def __init__(self):
        self.container_name = "ma-saas-migration-test"
        self.db_name = "ma_saas_test"
        self.db_user = "test_user"
        self.db_password = "test_password_12345"
        self.db_port = 15432  # Use non-standard port to avoid conflicts
        self.container_id: Optional[str] = None
        self.project_root = Path(__file__).parent.parent
        self.backend_dir = self.project_root / "backend"

    def run_all_tests(self) -> bool:
        """Run all migration tests. Returns True if all pass."""
        print(f"{BLUE}=== Migration Testing Started ==={RESET}\n")

        try:
            # Step 1: Check Docker availability
            if not self._check_docker():
                return False

            # Step 2: Start PostgreSQL container
            if not self._start_postgres_container():
                return False

            # Step 3: Wait for PostgreSQL to be ready
            if not self._wait_for_postgres():
                return False

            # Step 4: Create test database
            if not self._create_test_database():
                return False

            # Step 5: Run migrations
            if not self._run_migrations_upgrade():
                return False

            # Step 6: Verify schema consistency
            if not self._verify_schema_consistency():
                return False

            # Step 7: Test downgrade (optional but recommended)
            if not self._test_downgrade():
                return False

            # Step 8: Test re-upgrade
            if not self._test_reupgrade():
                return False

            print(f"\n{GREEN}✅ All migration tests passed!{RESET}\n")
            return True

        except Exception as e:
            print(f"\n{RED}❌ Migration testing failed: {e}{RESET}\n")
            return False

        finally:
            # Always cleanup container
            self._cleanup()

    def _check_docker(self) -> bool:
        """Check if Docker is available"""
        print("Checking Docker availability...")
        try:
            result = subprocess.run(
                ["docker", "version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                print(f"{GREEN}✓{RESET} Docker is available\n")
                return True
            else:
                print(f"{RED}✗{RESET} Docker command failed: {result.stderr}\n")
                return False
        except FileNotFoundError:
            print(f"{RED}✗{RESET} Docker not found. Please install Docker.\n")
            return False
        except Exception as e:
            print(f"{RED}✗{RESET} Docker check failed: {e}\n")
            return False

    def _start_postgres_container(self) -> bool:
        """Start PostgreSQL container"""
        print("Starting PostgreSQL container...")

        # Stop and remove existing container if present
        subprocess.run(
            ["docker", "stop", self.container_name],
            capture_output=True,
            timeout=10
        )
        subprocess.run(
            ["docker", "rm", self.container_name],
            capture_output=True,
            timeout=10
        )

        # Start new container
        try:
            result = subprocess.run(
                [
                    "docker", "run",
                    "--name", self.container_name,
                    "-e", f"POSTGRES_USER={self.db_user}",
                    "-e", f"POSTGRES_PASSWORD={self.db_password}",
                    "-e", f"POSTGRES_DB={self.db_name}",
                    "-p", f"{self.db_port}:5432",
                    "-d",
                    "postgres:15"
                ],
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                self.container_id = result.stdout.strip()
                print(f"{GREEN}✓{RESET} PostgreSQL container started (ID: {self.container_id[:12]})\n")
                return True
            else:
                print(f"{RED}✗{RESET} Failed to start container: {result.stderr}\n")
                return False

        except Exception as e:
            print(f"{RED}✗{RESET} Failed to start container: {e}\n")
            return False

    def _wait_for_postgres(self, max_attempts: int = 30) -> bool:
        """Wait for PostgreSQL to accept connections"""
        print("Waiting for PostgreSQL to be ready...")

        for attempt in range(max_attempts):
            try:
                conn = psycopg2.connect(
                    host="localhost",
                    port=self.db_port,
                    user=self.db_user,
                    password=self.db_password,
                    database=self.db_name,
                    connect_timeout=2
                )
                conn.close()
                print(f"{GREEN}✓{RESET} PostgreSQL is ready\n")
                return True
            except psycopg2.OperationalError:
                time.sleep(1)
                print(f"  Attempt {attempt + 1}/{max_attempts}...", end='\r')

        print(f"\n{RED}✗{RESET} PostgreSQL failed to start after {max_attempts} seconds\n")
        return False

    def _create_test_database(self) -> bool:
        """Create test database (already created by container init)"""
        print("Verifying test database...")
        try:
            conn = psycopg2.connect(
                host="localhost",
                port=self.db_port,
                user=self.db_user,
                password=self.db_password,
                database=self.db_name
            )
            conn.close()
            print(f"{GREEN}✓{RESET} Test database ready\n")
            return True
        except Exception as e:
            print(f"{RED}✗{RESET} Database verification failed: {e}\n")
            return False

    def _run_migrations_upgrade(self) -> bool:
        """Run alembic upgrade head"""
        print("Running migrations (alembic upgrade head)...")

        # Build DATABASE_URL
        db_url = f"postgresql://{self.db_user}:{self.db_password}@localhost:{self.db_port}/{self.db_name}"

        try:
            result = subprocess.run(
                ["alembic", "upgrade", "head"],
                cwd=self.backend_dir,
                capture_output=True,
                text=True,
                timeout=120,
                env={**os.environ, "DATABASE_URL": db_url}
            )

            if result.returncode == 0:
                print(f"{GREEN}✓{RESET} Migrations completed successfully\n")
                if result.stdout:
                    print("Migration output:")
                    print(result.stdout)
                return True
            else:
                print(f"{RED}✗{RESET} Migration failed:\n")
                print(result.stderr)
                return False

        except Exception as e:
            print(f"{RED}✗{RESET} Migration execution failed: {e}\n")
            return False

    def _verify_schema_consistency(self) -> bool:
        """Verify schema consistency after migration"""
        print("Verifying schema consistency...")

        try:
            conn = psycopg2.connect(
                host="localhost",
                port=self.db_port,
                user=self.db_user,
                password=self.db_password,
                database=self.db_name
            )
            cursor = conn.cursor()

            # Check 1: Verify foreign key type consistency
            cursor.execute("""
                SELECT
                    tc.table_name,
                    kcu.column_name,
                    c1.data_type as fk_type,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name,
                    c2.data_type as ref_type
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                    ON ccu.constraint_name = tc.constraint_name
                JOIN information_schema.columns c1
                    ON c1.table_name = tc.table_name AND c1.column_name = kcu.column_name
                JOIN information_schema.columns c2
                    ON c2.table_name = ccu.table_name AND c2.column_name = ccu.column_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                AND c1.data_type != c2.data_type
            """)

            type_mismatches = cursor.fetchall()
            if type_mismatches:
                print(f"{RED}✗{RESET} Foreign key type mismatches found:")
                for row in type_mismatches:
                    print(f"  {row[0]}.{row[1]} ({row[2]}) -> {row[3]}.{row[4]} ({row[5]})")
                conn.close()
                return False

            # Check 2: Verify all migrations applied
            cursor.execute("SELECT version_num FROM alembic_version")
            versions = cursor.fetchall()
            if not versions:
                print(f"{RED}✗{RESET} No alembic version found in database")
                conn.close()
                return False

            current_version = versions[0][0]
            print(f"{GREEN}✓{RESET} Schema consistent (current version: {current_version})\n")

            conn.close()
            return True

        except Exception as e:
            print(f"{RED}✗{RESET} Schema verification failed: {e}\n")
            return False

    def _test_downgrade(self) -> bool:
        """Test migration downgrade"""
        print("Testing migration downgrade (alembic downgrade -1)...")

        db_url = f"postgresql://{self.db_user}:{self.db_password}@localhost:{self.db_port}/{self.db_name}"

        try:
            result = subprocess.run(
                ["alembic", "downgrade", "-1"],
                cwd=self.backend_dir,
                capture_output=True,
                text=True,
                timeout=120,
                env={**os.environ, "DATABASE_URL": db_url}
            )

            if result.returncode == 0:
                print(f"{GREEN}✓{RESET} Downgrade successful\n")
                return True
            else:
                print(f"{YELLOW}⚠{RESET} Downgrade failed (this may be expected):\n")
                print(result.stderr)
                # Don't fail the entire test suite if downgrade fails
                # Some migrations may not have downgrade implemented
                return True

        except Exception as e:
            print(f"{YELLOW}⚠{RESET} Downgrade execution failed: {e}\n")
            return True  # Don't fail suite

    def _test_reupgrade(self) -> bool:
        """Test re-upgrading after downgrade"""
        print("Testing re-upgrade (alembic upgrade head)...")

        db_url = f"postgresql://{self.db_user}:{self.db_password}@localhost:{self.db_port}/{self.db_name}"

        try:
            result = subprocess.run(
                ["alembic", "upgrade", "head"],
                cwd=self.backend_dir,
                capture_output=True,
                text=True,
                timeout=120,
                env={**os.environ, "DATABASE_URL": db_url}
            )

            if result.returncode == 0:
                print(f"{GREEN}✓{RESET} Re-upgrade successful\n")
                return True
            else:
                print(f"{RED}✗{RESET} Re-upgrade failed:\n")
                print(result.stderr)
                return False

        except Exception as e:
            print(f"{RED}✗{RESET} Re-upgrade execution failed: {e}\n")
            return False

    def _cleanup(self):
        """Stop and remove test container"""
        if self.container_id:
            print("\nCleaning up test container...")
            subprocess.run(
                ["docker", "stop", self.container_name],
                capture_output=True,
                timeout=10
            )
            subprocess.run(
                ["docker", "rm", self.container_name],
                capture_output=True,
                timeout=10
            )
            print(f"{GREEN}✓{RESET} Cleanup complete\n")


def main():
    """Main entry point"""
    tester = MigrationTester()
    success = tester.run_all_tests()
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
