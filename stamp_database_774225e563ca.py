#!/usr/bin/env python3
"""
Manually stamp the database with migration 774225e563ca
This bypasses the aborted transaction issue by directly updating alembic_version
"""
import sys
import psycopg2

DATABASE_URL = "postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

def stamp_database():
    """Stamp the database with migration 774225e563ca"""
    try:
        print("=" * 70)
        print("MANUAL DATABASE STAMPING - Migration 774225e563ca")
        print("=" * 70)
        print(f"Target: dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com")
        print("=" * 70)

        # Connect with autocommit mode to avoid transaction issues
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        conn.autocommit = True
        cursor = conn.cursor()

        print("\n[1/4] Checking if alembic_version table exists...")
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'alembic_version'
            );
        """)
        table_exists = cursor.fetchone()[0]

        if not table_exists:
            print("[WARNING] alembic_version table does not exist. Creating it...")
            cursor.execute("""
                CREATE TABLE alembic_version (
                    version_num VARCHAR(32) NOT NULL PRIMARY KEY
                );
            """)
            print("[OK] Created alembic_version table")
        else:
            print("[OK] alembic_version table exists")

        print("\n[2/4] Checking current migration version...")
        cursor.execute("SELECT version_num FROM alembic_version;")
        result = cursor.fetchone()

        if result:
            current_version = result[0]
            print(f"[OK] Current version: {current_version}")

            if current_version == '774225e563ca':
                print("\n[INFO] Database is already at version 774225e563ca")
                print("[SUCCESS] No action needed!")
                return True
            elif current_version > '774225e563ca':
                print(f"\n[INFO] Database is at newer version: {current_version}")
                print("[SUCCESS] No action needed!")
                return True
        else:
            print("[INFO] No current version found (empty alembic_version table)")
            current_version = None

        print("\n[3/4] Updating alembic_version to 774225e563ca...")

        if current_version:
            # Update existing version
            cursor.execute("""
                UPDATE alembic_version
                SET version_num = '774225e563ca';
            """)
            print("[OK] Updated version from {} to 774225e563ca".format(current_version))
        else:
            # Insert new version
            cursor.execute("""
                INSERT INTO alembic_version (version_num)
                VALUES ('774225e563ca');
            """)
            print("[OK] Inserted version 774225e563ca")

        print("\n[4/4] Verifying the update...")
        cursor.execute("SELECT version_num FROM alembic_version;")
        new_version = cursor.fetchone()[0]
        print(f"[OK] Current version is now: {new_version}")

        if new_version == '774225e563ca':
            print("\n" + "=" * 70)
            print("[SUCCESS] DATABASE STAMPED SUCCESSFULLY!")
            print("=" * 70)
            print("\nNext steps:")
            print("1. Trigger a new backend redeploy on Render")
            print("2. Alembic will skip migration 774225e563ca (already applied)")
            print("3. Alembic will continue with subsequent migrations")
            print("=" * 70)
            return True
        else:
            print(f"\n[ERROR] Version mismatch. Expected 774225e563ca, got {new_version}")
            return False

    except Exception as e:
        print(f"\n[ERROR] Failed to stamp database: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    if stamp_database():
        sys.exit(0)
    else:
        sys.exit(1)
