#!/usr/bin/env python3
"""Verify tables exist in production database"""
import sys
import psycopg2

DATABASE_URL = "postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

try:
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = conn.cursor()

    # Check all 13 tables
    cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN (
            'community_follows', 'community_moderation_actions', 'community_posts',
            'community_reactions', 'community_comments',
            'events', 'event_analytics', 'event_sessions', 'event_tickets', 'event_registrations',
            'document_ai_suggestions', 'document_versions', 'document_share_links'
        )
        ORDER BY table_name;
    """)

    tables = cursor.fetchall()

    print(f"\n[VERIFICATION] Found {len(tables)} tables:")
    print("-" * 50)
    for table in tables:
        print(f"  [OK] {table[0]}")
    print("-" * 50)

    expected = 13
    if len(tables) == expected:
        print(f"\n[SUCCESS] All {expected} tables exist in production!")
    else:
        print(f"\n[WARNING] Expected {expected} tables, found {len(tables)}")

        # Show missing tables
        all_tables = {'community_follows', 'community_moderation_actions', 'community_posts',
                      'community_reactions', 'community_comments',
                      'events', 'event_analytics', 'event_sessions', 'event_tickets', 'event_registrations',
                      'document_ai_suggestions', 'document_versions', 'document_share_links'}
        found_tables = {t[0] for t in tables}
        missing = all_tables - found_tables
        if missing:
            print("\n[MISSING TABLES]:")
            for table in missing:
                print(f"  [X] {table}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"[ERROR] {e}")
    sys.exit(1)
