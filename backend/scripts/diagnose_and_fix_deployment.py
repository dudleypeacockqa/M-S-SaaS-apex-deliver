#!/usr/bin/env python3
"""
Diagnostic and Fix Script for Deployment Issues

This script:
1. Checks if blog_posts table exists
2. Runs migrations if needed
3. Publishes blog posts
4. Verifies the fix
"""
import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from sqlalchemy import create_engine, text
from alembic.config import Config
from alembic import command

def check_blog_table():
    """Check if blog_posts table exists."""
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("❌ ERROR: DATABASE_URL not set")
        return False
    
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts')"
            ))
            exists = result.scalar()
            if exists:
                print("✅ blog_posts table exists")
                return True
            else:
                print("❌ blog_posts table does NOT exist")
                return False
    except Exception as e:
        print(f"❌ Error checking blog_posts table: {e}")
        return False

def run_migrations():
    """Run Alembic migrations."""
    print("\n" + "="*70)
    print("RUNNING DATABASE MIGRATIONS")
    print("="*70)
    
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("❌ ERROR: DATABASE_URL not set")
        return False
    
    try:
        # Change to backend directory where alembic.ini is located
        os.chdir(backend_path)
        
        # Configure Alembic
        alembic_cfg = Config("alembic.ini")
        
        # Show current revision
        print("\nCurrent migration status:")
        try:
            command.current(alembic_cfg)
        except Exception as e:
            print(f"  No current revision (fresh database): {e}")
        
        # Show heads
        print("\nAvailable migration heads:")
        command.heads(alembic_cfg)
        
        # Run migrations
        print("\nApplying migrations...")
        command.upgrade(alembic_cfg, "head")
        
        print("\n✅ Migrations applied successfully")
        return True
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def publish_blog_posts():
    """Publish all blog posts."""
    print("\n" + "="*70)
    print("PUBLISHING BLOG POSTS")
    print("="*70)
    
    try:
        from app.models.blog_post import BlogPost
        from app.db.session import SessionLocal
        from datetime import datetime, timezone
        from sqlalchemy import update
        
        db = SessionLocal()
        try:
            total_posts = db.query(BlogPost).count()
            unpublished_posts = db.query(BlogPost).filter_by(published=False).count()
            
            print(f"Total blog posts: {total_posts}")
            print(f"Unpublished posts: {unpublished_posts}")
            
            if unpublished_posts == 0:
                print("✅ All blog posts are already published")
                return True
            
            # Update all unpublished posts
            now_utc = datetime.now(timezone.utc)
            stmt = (
                update(BlogPost)
                .where(BlogPost.published == False)
                .values(published=True, published_at=now_utc, updated_at=now_utc)
            )
            result = db.execute(stmt)
            db.commit()
            
            print(f"✅ Successfully published {result.rowcount} blog posts")
            
            # Verify
            final_published = db.query(BlogPost).filter_by(published=True).count()
            print(f"📊 Final status: {final_published} published, {total_posts - final_published} unpublished")
            
            return True
        finally:
            db.close()
    except Exception as e:
        print(f"❌ Error publishing blog posts: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main diagnostic and fix routine."""
    print("="*70)
    print("DEPLOYMENT DIAGNOSTIC AND FIX SCRIPT")
    print("="*70)
    print(f"Working directory: {os.getcwd()}")
    print(f"Backend path: {backend_path}")
    print(f"DATABASE_URL: {'SET' if os.environ.get('DATABASE_URL') else 'NOT SET'}")
    
    # Step 1: Check blog table
    print("\n" + "="*70)
    print("STEP 1: CHECKING blog_posts TABLE")
    print("="*70)
    table_exists = check_blog_table()
    
    # Step 2: Run migrations if needed
    if not table_exists:
        print("\n" + "="*70)
        print("STEP 2: RUNNING MIGRATIONS")
        print("="*70)
        migration_success = run_migrations()
        
        if not migration_success:
            print("\n❌ FAILED: Could not run migrations")
            sys.exit(1)
        
        # Verify table was created
        table_exists = check_blog_table()
        if not table_exists:
            print("\n❌ FAILED: blog_posts table still does not exist after migration")
            sys.exit(1)
    else:
        print("\n✅ blog_posts table exists - skipping migrations")
    
    # Step 3: Publish blog posts
    print("\n" + "="*70)
    print("STEP 3: PUBLISHING BLOG POSTS")
    print("="*70)
    publish_success = publish_blog_posts()
    
    if not publish_success:
        print("\n⚠️  WARNING: Could not publish blog posts (non-fatal)")
    
    # Final summary
    print("\n" + "="*70)
    print("DIAGNOSTIC COMPLETE")
    print("="*70)
    print("✅ blog_posts table: EXISTS" if table_exists else "❌ blog_posts table: MISSING")
    print("✅ Blog posts: PUBLISHED" if publish_success else "⚠️  Blog posts: PUBLISH FAILED")
    print("\nNext steps:")
    print("1. Test API: curl https://ma-saas-backend.onrender.com/api/blog")
    print("2. Test frontend: https://100daysandbeyond.com/blog")
    
    sys.exit(0 if table_exists else 1)

if __name__ == "__main__":
    main()

