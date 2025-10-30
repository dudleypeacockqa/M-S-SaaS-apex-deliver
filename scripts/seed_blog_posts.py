"""Seed blog posts into the database."""
import json
import sys
from pathlib import Path
from datetime import datetime

# Add backend directory to path - try multiple locations
possible_backend_dirs = [
    Path(__file__).parent.parent / 'backend',  # Local development
    Path('/app/backend'),  # Render deployment
    Path.cwd() / 'backend',  # Current directory
]

for backend_dir in possible_backend_dirs:
    if backend_dir.exists():
        sys.path.insert(0, str(backend_dir))
        break

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.blog_post import BlogPost
from app.db.base import Base
import os

def seed_blog_posts():
    """Seed blog posts from JSON file into database."""

    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        return

    # Create engine and session
    # Note: Not calling Base.metadata.create_all(engine) to avoid foreign key errors
    # Tables already exist from Alembic migrations
    engine = create_engine(database_url)
    Session = sessionmaker(bind=engine)
    session = Session()

    # DEBUG: Show current environment
    print(f"DEBUG: Current working directory: {Path.cwd()}")
    print(f"DEBUG: Script location: {Path(__file__).resolve()}")
    print(f"DEBUG: Script parent: {Path(__file__).parent.resolve()}")

    # List files in current directory
    print(f"DEBUG: Files in current directory:")
    try:
        for item in sorted(Path.cwd().iterdir())[:20]:  # Show first 20 items
            print(f"  - {item.name} {'(dir)' if item.is_dir() else f'({item.stat().st_size} bytes)'}")
    except Exception as e:
        print(f"  Could not list directory: {e}")

    # Load blog posts - try multiple possible paths with explicit priority
    possible_paths = [
        Path('/app/blog_posts_for_database.json'),  # Render deployment - FIRST PRIORITY
        Path(__file__).parent.parent / 'blog_posts_for_database.json',  # Local development
        Path.cwd() / 'blog_posts_for_database.json',  # Current directory
        Path('/app') / 'blog_posts_for_database.json',  # Alternative Render path
    ]

    blog_posts_file = None
    print(f"\nDEBUG: Searching for blog_posts_for_database.json...")
    for i, path in enumerate(possible_paths, 1):
        resolved = path.resolve()
        exists = path.exists()
        print(f"  {i}. {path}")
        print(f"     Resolved: {resolved}")
        print(f"     Exists: {exists}")
        if exists:
            try:
                size = path.stat().st_size
                print(f"     Size: {size} bytes")
                blog_posts_file = path
                print(f"     ✓ USING THIS FILE")
                break
            except Exception as e:
                print(f"     Error reading: {e}")

    if not blog_posts_file:
        print(f"\nERROR: Could not find blog_posts_for_database.json")
        print(f"All paths failed. Listing /app directory:")
        try:
            app_dir = Path('/app')
            if app_dir.exists():
                for item in sorted(app_dir.iterdir())[:30]:
                    print(f"  - {item.name}")
            else:
                print("  /app directory does not exist")
        except Exception as e:
            print(f"  Could not list /app: {e}")
        return

    with open(blog_posts_file, 'r') as f:
        blog_posts_data = json.load(f)
    
    print(f"Seeding {len(blog_posts_data)} blog posts...")
    
    for post_data in blog_posts_data:
        # Check if post already exists
        existing_post = session.query(BlogPost).filter_by(slug=post_data['slug']).first()
        if existing_post:
            print(f"  [SKIP] '{post_data['title']}' (already exists)")
            continue
        
        # Create new blog post
        # Parse published_at datetime if present
        published_at = None
        if post_data.get('published_at'):
            try:
                published_at = datetime.fromisoformat(post_data['published_at'].replace('Z', '+00:00'))
            except (ValueError, AttributeError):
                published_at = None

        blog_post = BlogPost(
            title=post_data['title'],
            slug=post_data['slug'],
            excerpt=post_data['excerpt'],
            content=post_data['content'],
            author=post_data['author'],
            category=post_data['category'],
            primary_keyword=post_data['primary_keyword'],
            secondary_keywords=post_data['secondary_keywords'],
            meta_description=post_data['meta_description'],
            published=post_data['published'],
            published_at=published_at,
            read_time_minutes=post_data['read_time_minutes']
        )
        
        session.add(blog_post)
        print(f"  [OK] Added '{post_data['title']}'")
    
    # Commit all changes
    session.commit()
    print(f"\n[SUCCESS] Successfully seeded {len(blog_posts_data)} blog posts!")
    session.close()

if __name__ == '__main__':
    seed_blog_posts()
