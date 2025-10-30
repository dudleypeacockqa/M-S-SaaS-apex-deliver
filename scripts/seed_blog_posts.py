"""Seed blog posts into the database."""
import json
import sys
from pathlib import Path
from datetime import datetime

# Add backend directory to path
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_dir))

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
    engine = create_engine(database_url)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Load blog posts
    blog_posts_file = Path(__file__).parent.parent / 'blog_posts_for_database.json'
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
