#!/usr/bin/env python3
"""
Import blog posts to production Render PostgreSQL database.

This script reads docs/blog_import.sql and executes it against the production database.
It includes safety checks and verification steps.

Usage:
    python scripts/import_blog_production.py
"""

import sys
import os

# Check if psycopg2 is available
try:
    import psycopg2
    from psycopg2 import sql
except ImportError:
    print("ERROR: psycopg2 not installed")
    print("Install with: pip install psycopg2-binary")
    sys.exit(1)

# Database connection string
DATABASE_URL = "postgresql://ma_saas_user:[REDACTED-ROTATED-2025-11-11]@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

def main():
    print("=" * 70)
    print("BLOG POSTS PRODUCTION IMPORT")
    print("=" * 70)
    print()

    # Step 1: Read SQL file
    sql_file_path = os.path.join(os.path.dirname(__file__), '..', 'docs', 'blog_import.sql')

    print(f"[1/6] Reading SQL file: {sql_file_path}")
    try:
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        print(f"  Loaded {len(sql_content):,} characters")
        print(f"  Detected {sql_content.count('INSERT INTO blog_posts')} INSERT statements")
    except FileNotFoundError:
        print(f"  ERROR: SQL file not found at {sql_file_path}")
        sys.exit(1)
    except Exception as e:
        print(f"  ERROR: Failed to read SQL file: {e}")
        sys.exit(1)

    # Step 2: Connect to database
    print()
    print("[2/6] Connecting to production database...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("  Connected successfully")
    except Exception as e:
        print(f"  ERROR: Failed to connect: {e}")
        sys.exit(1)

    # Step 3: Verify migration applied
    print()
    print("[3/6] Verifying blog_posts table exists...")
    try:
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'blog_posts'
            );
        """)
        table_exists = cursor.fetchone()[0]

        if not table_exists:
            print("  ERROR: blog_posts table does not exist!")
            print("  Run migrations first: alembic upgrade head")
            cursor.close()
            conn.close()
            sys.exit(1)

        print("  Table exists [OK]")

        # Check current row count
        cursor.execute("SELECT COUNT(*) FROM blog_posts;")
        existing_count = cursor.fetchone()[0]
        print(f"  Current row count: {existing_count}")

        if existing_count > 0:
            print(f"  WARNING: {existing_count} posts already exist in database")
            response = input("  Delete existing posts before import? (yes/no): ")
            if response.lower() == 'yes':
                cursor.execute("DELETE FROM blog_posts;")
                conn.commit()
                print("  Existing posts deleted")
            else:
                print("  Keeping existing posts - may cause duplicates if slugs match")

    except Exception as e:
        print(f"  ERROR: Failed to verify table: {e}")
        cursor.close()
        conn.close()
        sys.exit(1)

    # Step 4: Execute SQL import
    print()
    print("[4/6] Executing SQL import...")
    try:
        cursor.execute(sql_content)
        conn.commit()
        print("  SQL executed successfully")
    except Exception as e:
        print(f"  ERROR: SQL execution failed: {e}")
        conn.rollback()
        cursor.close()
        conn.close()
        sys.exit(1)

    # Step 5: Verify import
    print()
    print("[5/6] Verifying import...")
    try:
        # Count total posts
        cursor.execute("SELECT COUNT(*) FROM blog_posts;")
        total_count = cursor.fetchone()[0]
        print(f"  Total posts: {total_count}")

        # Check keywords
        cursor.execute("""
            SELECT
                COUNT(*) as total,
                COUNT(primary_keyword) as with_primary,
                COUNT(secondary_keywords) as with_secondary
            FROM blog_posts;
        """)
        counts = cursor.fetchone()
        print(f"  Posts with primary_keyword: {counts[1]}/{counts[0]}")
        print(f"  Posts with secondary_keywords: {counts[2]}/{counts[0]}")

        if counts[1] < counts[0]:
            print(f"  WARNING: {counts[0] - counts[1]} posts missing primary_keyword!")

        # Check categories
        cursor.execute("""
            SELECT category, COUNT(*)
            FROM blog_posts
            GROUP BY category
            ORDER BY COUNT(*) DESC;
        """)
        categories = cursor.fetchall()
        print(f"  Categories:")
        for cat, count in categories:
            print(f"    - {cat}: {count} posts")

        # Check slugs are unique
        cursor.execute("""
            SELECT slug, COUNT(*)
            FROM blog_posts
            GROUP BY slug
            HAVING COUNT(*) > 1;
        """)
        duplicates = cursor.fetchall()
        if duplicates:
            print(f"  ERROR: {len(duplicates)} duplicate slugs found:")
            for slug, count in duplicates:
                print(f"    - {slug}: {count} occurrences")
        else:
            print("  All slugs unique [OK]")

    except Exception as e:
        print(f"  ERROR: Verification failed: {e}")
        cursor.close()
        conn.close()
        sys.exit(1)

    # Step 6: Sample posts
    print()
    print("[6/6] Sample posts:")
    try:
        cursor.execute("""
            SELECT title, primary_keyword, read_time_minutes, published
            FROM blog_posts
            LIMIT 5;
        """)
        posts = cursor.fetchall()
        for title, keyword, read_time, published in posts:
            status = "[PUBLISHED]" if published else "[DRAFT]"
            print(f"  {status} {title[:60]}...")
            print(f"     Keyword: {keyword}, Read time: {read_time} min")
    except Exception as e:
        print(f"  ERROR: Failed to fetch sample posts: {e}")

    # Close connection
    cursor.close()
    conn.close()

    print()
    print("=" * 70)
    print(f"SUCCESS! {total_count} blog posts imported to production")
    print("=" * 70)
    print()
    print("Next steps:")
    print("1. Test blog API: curl https://ma-saas-backend.onrender.com/api/blog")
    print("2. Visit frontend: https://100daysandbeyond.com/blog")
    print("3. Verify posts display correctly")
    print()

if __name__ == "__main__":
    main()
