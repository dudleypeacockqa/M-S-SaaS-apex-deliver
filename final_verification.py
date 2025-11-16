#!/usr/bin/env python3
"""Final verification of tables before Render redeploy"""
import sys
import psycopg2

DATABASE_URL = "postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

def run_verification():
    try:
        conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        cursor = conn.cursor()

        print("=" * 70)
        print("FINAL VERIFICATION - RENDER PRODUCTION DATABASE")
        print("=" * 70)

        # 1. Verify table schemas (column counts)
        print("\n[1/3] Verifying table schemas (column counts):")
        print("-" * 70)
        cursor.execute("""
            SELECT table_name, COUNT(*) AS cols
            FROM information_schema.columns
            WHERE table_schema='public'
              AND table_name IN (
                'community_follows','community_posts','community_comments',
                'events','event_sessions','event_tickets','event_registrations',
                'document_ai_suggestions','document_versions','document_share_links'
              )
            GROUP BY table_name
            ORDER BY table_name;
        """)

        schemas = cursor.fetchall()
        for table, col_count in schemas:
            print(f"  [OK] {table:<30} {col_count:>3} columns")

        if len(schemas) == 10:
            print(f"\n[SUCCESS] All 10 core tables have schemas defined")
        else:
            print(f"\n[WARNING] Expected 10 tables, found {len(schemas)}")

        # 2. Quick row counts (should be zero initially)
        print("\n[2/3] Checking row counts (should be 0 for new tables):")
        print("-" * 70)
        cursor.execute("""
            SELECT 'community_follows' tbl, COUNT(*) FROM community_follows UNION ALL
            SELECT 'community_posts'  , COUNT(*) FROM community_posts  UNION ALL
            SELECT 'community_comments', COUNT(*) FROM community_comments UNION ALL
            SELECT 'events'           , COUNT(*) FROM events           UNION ALL
            SELECT 'event_sessions'   , COUNT(*) FROM event_sessions   UNION ALL
            SELECT 'event_tickets'    , COUNT(*) FROM event_tickets    UNION ALL
            SELECT 'event_registrations', COUNT(*) FROM event_registrations UNION ALL
            SELECT 'document_ai_suggestions', COUNT(*) FROM document_ai_suggestions UNION ALL
            SELECT 'document_versions', COUNT(*) FROM document_versions UNION ALL
            SELECT 'document_share_links', COUNT(*) FROM document_share_links;
        """)

        row_counts = cursor.fetchall()
        for table, count in row_counts:
            status = "[OK]" if count == 0 else "[DATA]"
            print(f"  {status} {table:<30} {count:>5} rows")

        # 3. Confirm critical indexes exist
        print("\n[3/3] Verifying critical indexes:")
        print("-" * 70)
        cursor.execute("""
            SELECT
                indexname,
                tablename
            FROM pg_indexes
            WHERE schemaname = 'public'
              AND tablename IN (
                'community_follows', 'community_posts', 'community_comments',
                'events', 'event_sessions', 'event_tickets', 'event_registrations',
                'document_ai_suggestions', 'document_versions', 'document_share_links'
              )
            ORDER BY tablename, indexname;
        """)

        indexes = cursor.fetchall()
        current_table = None
        for index_name, table_name in indexes:
            if table_name != current_table:
                if current_table is not None:
                    print()
                current_table = table_name
                print(f"  {table_name}:")
            print(f"    [OK] {index_name}")

        print(f"\n[SUCCESS] Found {len(indexes)} indexes across all tables")

        # Final summary
        print("\n" + "=" * 70)
        print("VERIFICATION SUMMARY")
        print("=" * 70)
        print(f"  Tables verified:  {len(schemas)}/10")
        print(f"  Indexes created:  {len(indexes)}")
        print(f"  Data rows:        {sum(count for _, count in row_counts)}")
        print("\n[READY] All tables and indexes are in place.")
        print("[NEXT]  Trigger Render backend redeploy to apply migration 774225e563ca")
        print("=" * 70)

        cursor.close()
        conn.close()
        return True

    except Exception as e:
        print(f"\n[ERROR] Verification failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if run_verification():
        sys.exit(0)
    else:
        sys.exit(1)