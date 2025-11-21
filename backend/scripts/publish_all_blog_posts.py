#!/usr/bin/env python3
"""
Publish all blog posts in the database.
Sets published=True and published_at=now() for all posts where published=False.
"""

import sys
from pathlib import Path
from datetime import datetime, timezone

# Add backend directory to path
possible_backend_dirs = [
    Path(__file__).parent.parent,  # backend/ from backend/scripts/
    Path('/app/backend'),  # Render deployment
    Path.cwd() / 'backend',  # Current directory
]

for backend_dir in possible_backend_dirs:
    if backend_dir.exists():
        sys.path.insert(0, str(backend_dir))
        break

from sqlalchemy import create_engine, update
from sqlalchemy.orm import sessionmaker
from app.models.blog_post import BlogPost
import os

def publish_all_blog_posts():
    """Publish all blog posts that are currently unpublished."""
    
    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        return False
    
    # Create engine and session
    engine = create_engine(database_url)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Count unpublished posts
        unpublished_count = session.query(BlogPost).filter(BlogPost.published == False).count()
        total_count = session.query(BlogPost).count()
        
        print(f"Total blog posts in database: {total_count}")
        print(f"Unpublished posts: {unpublished_count}")
        
        if unpublished_count == 0:
            print("\n✅ All blog posts are already published!")
            return True
        
        # Update all unpublished posts
        now = datetime.now(timezone.utc)
        updated = session.execute(
            update(BlogPost)
            .where(BlogPost.published == False)
            .values(
                published=True,
                published_at=now
            )
        )
        
        session.commit()
        
        print(f"\n✅ Successfully published {updated.rowcount} blog posts!")
        print(f"   Set published=True and published_at={now.isoformat()}")
        
        # Verify
        remaining_unpublished = session.query(BlogPost).filter(BlogPost.published == False).count()
        published_count = session.query(BlogPost).filter(BlogPost.published == True).count()
        
        print(f"\n📊 Final Status:")
        print(f"   Published: {published_count}")
        print(f"   Unpublished: {remaining_unpublished}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        session.rollback()
        return False
    finally:
        session.close()

if __name__ == '__main__':
    print("=" * 70)
    print("PUBLISH ALL BLOG POSTS")
    print("=" * 70)
    print()
    
    success = publish_all_blog_posts()
    sys.exit(0 if success else 1)

