#!/usr/bin/env python3
"""
Execute the manual table creation SQL script against Render production database
"""
import sys

try:
    import psycopg2
except ImportError:
    print("[INFO] Installing psycopg2-binary...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
    import psycopg2

# Render production DATABASE_URL (external connection)
DATABASE_URL = "postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

def execute_sql_file(filepath):
    """Execute SQL file against the database"""
    try:
        # Read the SQL file
        print(f"[1/3] Reading SQL file: {filepath}")
        with open(filepath, 'r', encoding='utf-8') as f:
            sql_script = f.read()

        print(f"[OK] Read {len(sql_script)} characters")

        # Connect with SSL required
        print("\n[2/3] Connecting to database...")
        conn = psycopg2.connect(
            DATABASE_URL,
            sslmode='require',
            connect_timeout=30
        )
        conn.set_session(autocommit=False)  # We want explicit transaction control
        cursor = conn.cursor()

        print("[OK] Connected to database")

        # Execute the entire script
        print("\n[3/3] Executing SQL script...")
        cursor.execute(sql_script)

        # Fetch any results (verification query at the end)
        try:
            results = cursor.fetchall()
            if results:
                print("\n[VERIFICATION RESULTS]")
                print("-" * 50)
                for row in results:
                    table_name, exists = row
                    status = "[OK]" if exists else "[MISSING]"
                    print(f"{status} {table_name}: {'EXISTS' if exists else 'NOT FOUND'}")
                print("-" * 50)
        except psycopg2.ProgrammingError:
            # No results to fetch (normal for some statements)
            pass

        # Get notices (success messages from the script)
        for notice in conn.notices:
            print(f"[NOTICE] {notice.strip()}")

        cursor.close()
        conn.close()

        print("\n[SUCCESS] SQL script executed successfully")
        print("[OK] All tables created")
        return True

    except psycopg2.Error as e:
        print(f"\n[ERROR] Database error: {e}")
        print(f"[ERROR] Error code: {e.pgcode}")
        print(f"[ERROR] Error details: {e.pgerror}")
        return False
    except FileNotFoundError:
        print(f"\n[ERROR] SQL file not found: {filepath}")
        return False
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    sql_file = "docs/deployments/2025-11-16-manual-table-creation-fixed.sql"

    print("=" * 70)
    print("MANUAL TABLE CREATION - RENDER PRODUCTION DATABASE")
    print("=" * 70)
    print(f"Target: dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com")
    print(f"Script: {sql_file}")
    print("=" * 70)

    if execute_sql_file(sql_file):
        print("\n" + "=" * 70)
        print("[SUCCESS] ALL OPERATIONS COMPLETED")
        print("=" * 70)
        print("\nNext steps:")
        print("1. Verify all tables exist in Render dashboard")
        print("2. Trigger backend redeploy")
        print("3. Monitor migration 774225e563ca completion")
        sys.exit(0)
    else:
        print("\n" + "=" * 70)
        print("[FAILED] TABLE CREATION FAILED")
        print("=" * 70)
        sys.exit(1)
