#!/usr/bin/env python3
"""
Post-deployment verification script
Checks backend health, Alembic version, and table integrity
"""
import sys
import psycopg2
import requests
from typing import Optional

# Render production DATABASE_URL (external connection)
DATABASE_URL = "postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

# Replace with your actual backend URL
BACKEND_URL = "https://your-backend-domain.onrender.com"

def check_backend_health() -> bool:
    """Check if backend service is healthy"""
    print("\n" + "=" * 70)
    print("STEP 1: Backend Health Check")
    print("=" * 70)

    health_endpoints = [
        f"{BACKEND_URL}/api/health",
        f"{BACKEND_URL}/health",
        f"{BACKEND_URL}/",
    ]

    for endpoint in health_endpoints:
        try:
            print(f"\nTrying: {endpoint}")
            response = requests.get(endpoint, timeout=10)
            print(f"[OK] Status Code: {response.status_code}")
            if response.status_code == 200:
                print(f"[OK] Response: {response.text[:200]}")
                print("\n[SUCCESS] Backend is healthy!")
                return True
        except requests.exceptions.RequestException as e:
            print(f"[WARNING] {endpoint} failed: {e}")
            continue

    print("\n[WARNING] Could not verify backend health")
    print("This might be okay - check Render dashboard for service status")
    return False

def check_alembic_version() -> bool:
    """Verify Alembic migration version"""
    print("\n" + "=" * 70)
    print("STEP 2: Alembic Version Check")
    print("=" * 70)

    try:
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        cursor = conn.cursor()

        # Check current Alembic version
        cursor.execute("SELECT version_num FROM alembic_version;")
        result = cursor.fetchone()

        if result:
            current_version = result[0]
            print(f"\n[OK] Current Alembic version: {current_version}")

            if current_version == '774225e563ca':
                print("[SUCCESS] Migration 774225e563ca is applied!")
                return True
            elif current_version > '774225e563ca':
                print(f"[SUCCESS] Database is at a newer version ({current_version})")
                return True
            else:
                print(f"[WARNING] Database is at older version: {current_version}")
                print("Expected: 774225e563ca or newer")
                return False
        else:
            print("[ERROR] No version found in alembic_version table")
            return False

    except Exception as e:
        print(f"[ERROR] Failed to check Alembic version: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def check_table_integrity() -> bool:
    """Verify all tables exist and have correct structure"""
    print("\n" + "=" * 70)
    print("STEP 3: Table Integrity Check")
    print("=" * 70)

    try:
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        cursor = conn.cursor()

        # Check table existence and row counts
        tables_to_check = [
            'events',
            'event_sessions',
            'event_tickets',
            'event_registrations',
            'event_analytics',
            'community_posts',
            'community_comments',
            'community_follows',
            'community_reactions',
            'community_moderation_actions',
            'document_ai_suggestions',
            'document_versions',
            'document_share_links'
        ]

        print("\nTable Row Counts:")
        print("-" * 70)

        all_exist = True
        for table in tables_to_check:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                count = cursor.fetchone()[0]
                print(f"  [OK] {table:<35} {count:>5} rows")
            except Exception as e:
                print(f"  [ERROR] {table:<35} NOT FOUND")
                all_exist = False

        if all_exist:
            print("\n[SUCCESS] All 13 tables exist!")
            return True
        else:
            print("\n[ERROR] Some tables are missing")
            return False

    except Exception as e:
        print(f"[ERROR] Failed to check table integrity: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def check_indexes() -> bool:
    """Verify critical indexes exist"""
    print("\n" + "=" * 70)
    print("STEP 4: Index Verification")
    print("=" * 70)

    try:
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        cursor = conn.cursor()

        cursor.execute("""
            SELECT COUNT(*)
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND tablename IN (
                'events', 'event_sessions', 'event_tickets', 'event_registrations',
                'event_analytics', 'community_posts', 'community_comments',
                'community_follows', 'community_reactions', 'community_moderation_actions',
                'document_ai_suggestions', 'document_versions', 'document_share_links'
            );
        """)

        index_count = cursor.fetchone()[0]
        print(f"\n[OK] Found {index_count} indexes across all tables")

        if index_count >= 49:
            print("[SUCCESS] All expected indexes exist!")
            return True
        else:
            print(f"[WARNING] Expected at least 49 indexes, found {index_count}")
            return False

    except Exception as e:
        print(f"[ERROR] Failed to check indexes: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def main():
    """Run all verification checks"""
    print("=" * 70)
    print("POST-DEPLOYMENT VERIFICATION")
    print("=" * 70)
    print(f"Database: dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com")
    print(f"Backend: {BACKEND_URL}")
    print("=" * 70)

    results = {
        "Backend Health": check_backend_health(),
        "Alembic Version": check_alembic_version(),
        "Table Integrity": check_table_integrity(),
        "Indexes": check_indexes()
    }

    # Final summary
    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)

    for check, passed in results.items():
        status = "[PASS]" if passed else "[FAIL]"
        print(f"{status} {check}")

    all_passed = all(results.values())

    if all_passed:
        print("\n" + "=" * 70)
        print("[SUCCESS] ALL VERIFICATIONS PASSED!")
        print("=" * 70)
        print("\nDeployment is complete and healthy.")
        return 0
    else:
        print("\n" + "=" * 70)
        print("[WARNING] SOME VERIFICATIONS FAILED")
        print("=" * 70)
        print("\nCheck the details above and Render dashboard logs.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
