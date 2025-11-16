#!/usr/bin/env python3
"""
Stamp the Render database to migration version 774225e563ca.

This bypasses the aborted transaction issue by directly updating the
alembic_version table to indicate that migration 774225e563ca has completed.
"""

import os
import sys
import urllib.parse
import psycopg2
from psycopg2 import sql

# Get DATABASE_URL from environment or use Render production URL
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://ma_saas_db_user:PASSWORD@HOST/ma_saas_db"
)

def stamp_database():
    """Stamp the database to version 774225e563ca."""
    print("=" * 70)
    print("ALEMBIC DATABASE STAMPING TOOL")
    print("=" * 70)
    print(f"Target version: 774225e563ca")
    print()

    # Parse DATABASE_URL to extract connection parameters
    parsed = urllib.parse.urlparse(DATABASE_URL)

    # Connection parameters
    conn_params = {
        'host': parsed.hostname,
        'port': parsed.port or 5432,
        'database': parsed.path[1:],  # Remove leading '/'
        'user': parsed.username,
        'password': parsed.password,
        'sslmode': 'require'
    }

    print(f"Connecting to: {conn_params['host']}:{conn_params['port']}/{conn_params['database']}")
    print(f"User: {conn_params['user']}")
    print()

    try:
        # Connect to database
        print("[INFO] Establishing database connection...")
        conn = psycopg2.connect(**conn_params)
        conn.autocommit = True  # Use autocommit to avoid transaction issues
        cursor = conn.cursor()

        # Step 1: Create alembic_version table if it doesn't exist
        print("[INFO] Ensuring alembic_version table exists...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alembic_version (
                version_num VARCHAR(32) NOT NULL PRIMARY KEY
            );
        """)
        print("[OK] alembic_version table ready")

        # Step 2: Update or insert version
        print("[INFO] Stamping database to version 774225e563ca...")
        cursor.execute("""
            WITH up AS (
                UPDATE alembic_version
                SET version_num='774225e563ca'
                RETURNING 1
            )
            INSERT INTO alembic_version(version_num)
            SELECT '774225e563ca'
            WHERE NOT EXISTS (SELECT 1 FROM up);
        """)
        print("[OK] Database stamped successfully")

        # Step 3: Verify
        print("[INFO] Verifying current version...")
        cursor.execute("SELECT version_num FROM alembic_version;")
        result = cursor.fetchone()

        if result and result[0] == '774225e563ca':
            print(f"[SUCCESS] ✓ Current version: {result[0]}")
            print()
            print("=" * 70)
            print("STAMPING COMPLETE")
            print("=" * 70)
            print()
            print("Next steps:")
            print("1. Redeploy the backend service on Render")
            print("2. Alembic will now continue from version 774225e563ca")
            print("3. Subsequent migrations (if any) will run normally")
            print()
            return 0
        else:
            print(f"[ERROR] Verification failed. Current version: {result[0] if result else 'None'}")
            return 1

    except psycopg2.Error as e:
        print(f"[ERROR] Database error: {e}")
        return 1
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        return 1
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
            print("[INFO] Database connection closed")

if __name__ == "__main__":
    # Check if DATABASE_URL is set
    if DATABASE_URL == "postgresql://ma_saas_db_user:PASSWORD@HOST/ma_saas_db":
        print("[ERROR] DATABASE_URL not set!")
        print()
        print("Please set DATABASE_URL environment variable:")
        print('  export DATABASE_URL="postgresql://user:pass@host:port/dbname"')
        print()
        print("You can get this from Render dashboard:")
        print("  Dashboard > Database > Connection > External Connection String")
        sys.exit(1)

    sys.exit(stamp_database())
