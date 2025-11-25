#!/usr/bin/env python3
"""
Fix Blog API Migration - Apply migration 9913803fac51 to production database.

This script:
1. Verifies the migration file exists
2. Checks current migration status
3. Applies the migration if needed
4. Verifies blog_posts table exists
5. Tests blog API endpoints

Usage:
    python scripts/fix_blog_api_migration.py [--dry-run]
"""

import sys
import os
import argparse
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

try:
    import psycopg2
    from psycopg2 import sql
    from sqlalchemy import create_engine, text
except ImportError:
    print("ERROR: Required packages not installed")
    print("Install with: pip install psycopg2-binary sqlalchemy")
    sys.exit(1)


def get_database_url():
    """Get DATABASE_URL from environment or .env file."""
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        # Try reading from .env file
        env_file = Path(__file__).parent.parent / ".env"
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    if line.startswith("DATABASE_URL="):
                        db_url = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
    
    if not db_url:
        print("ERROR: DATABASE_URL not found in environment or .env file")
        print("Set DATABASE_URL environment variable or add it to .env file")
        sys.exit(1)
    
    return db_url


def check_migration_file():
    """Verify migration file exists."""
    migration_file = Path(__file__).parent.parent / "backend" / "alembic" / "versions" / "9913803fac51_add_blog_posts_table_for_marketing_.py"
    
    if not migration_file.exists():
        print(f"ERROR: Migration file not found: {migration_file}")
        return False
    
    print(f"✅ Migration file exists: {migration_file}")
    return True


def check_table_exists(db_url, table_name="blog_posts"):
    """Check if table exists in database."""
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text(
                f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{table_name}')"
            ))
            exists = result.scalar()
            return exists
    except Exception as e:
        print(f"ERROR: Failed to check table existence: {e}")
        return None


def apply_migration(db_url, dry_run=False):
    """Apply migration using Alembic."""
    import subprocess
    
    backend_dir = Path(__file__).parent.parent / "backend"
    
    if dry_run:
        print("🔍 DRY RUN: Would run: alembic upgrade head")
        return True
    
    try:
        # Change to backend directory and run alembic
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=str(backend_dir),
            env={**os.environ, "DATABASE_URL": db_url},
            capture_output=True,
            text=True,
            check=True
        )
        
        print("✅ Migration applied successfully")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"ERROR: Migration failed: {e}")
        print(e.stderr)
        return False
    except FileNotFoundError:
        print("ERROR: Alembic not found. Install with: pip install alembic")
        return False


def test_blog_api():
    """Test blog API endpoints."""
    import requests
    
    base_url = os.getenv("API_URL", "https://ma-saas-backend.onrender.com")
    
    endpoints = [
        f"{base_url}/api/blog?limit=5",
        f"{base_url}/api/blog/categories/list",
    ]
    
    print("\n" + "=" * 70)
    print("Testing Blog API Endpoints")
    print("=" * 70)
    
    all_passed = True
    for endpoint in endpoints:
        try:
            response = requests.get(endpoint, timeout=10)
            if response.status_code == 200:
                print(f"✅ {endpoint} → 200 OK")
            else:
                print(f"❌ {endpoint} → {response.status_code}")
                all_passed = False
        except Exception as e:
            print(f"❌ {endpoint} → Error: {e}")
            all_passed = False
    
    return all_passed


def main():
    parser = argparse.ArgumentParser(description="Fix Blog API Migration")
    parser.add_argument("--dry-run", action="store_true", help="Don't apply migration, just check")
    args = parser.parse_args()
    
    print("=" * 70)
    print("Blog API Migration Fix")
    print("=" * 70)
    print()
    
    # Step 1: Check migration file
    print("[1/5] Checking migration file...")
    if not check_migration_file():
        sys.exit(1)
    
    # Step 2: Get database URL
    print()
    print("[2/5] Getting database connection...")
    db_url = get_database_url()
    print(f"✅ Database URL configured (length: {len(db_url)} chars)")
    
    # Step 3: Check if table exists
    print()
    print("[3/5] Checking if blog_posts table exists...")
    table_exists = check_table_exists(db_url)
    
    if table_exists:
        print("✅ blog_posts table already exists - migration may have been applied")
    else:
        print("❌ blog_posts table does not exist - migration needs to be applied")
    
    # Step 4: Apply migration if needed
    if not table_exists or not args.dry_run:
        print()
        print("[4/5] Applying migration...")
        if args.dry_run:
            apply_migration(db_url, dry_run=True)
        else:
            if not apply_migration(db_url, dry_run=False):
                sys.exit(1)
            
            # Verify table exists after migration
            print()
            print("Verifying migration...")
            table_exists_after = check_table_exists(db_url)
            if table_exists_after:
                print("✅ blog_posts table now exists")
            else:
                print("❌ blog_posts table still missing - migration may have failed")
                sys.exit(1)
    else:
        print()
        print("[4/5] Skipping migration (table exists or dry-run)")
    
    # Step 5: Test blog API
    print()
    print("[5/5] Testing blog API endpoints...")
    if test_blog_api():
        print()
        print("=" * 70)
        print("✅ SUCCESS: Blog API migration fix complete!")
        print("=" * 70)
    else:
        print()
        print("=" * 70)
        print("⚠️  WARNING: Blog API endpoints still failing")
        print("   Check Render deployment logs for errors")
        print("=" * 70)
        sys.exit(1)


if __name__ == "__main__":
    main()

