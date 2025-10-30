"""Seed blog posts from JSON files into the database."""
import json
import os
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.session import init_engine
from app.models.blog_post import BlogPost
from app.core import database


def seed_blog_posts():
    """Load blog posts from JSON files and insert into database."""
    # Initialize engine first
    init_engine()
    db: Session = database.SessionLocal()

    try:
        blog_content_dir = Path(__file__).parent.parent.parent / "blog_content"
        json_files = list(blog_content_dir.glob("*.json"))

        print(f"Found {len(json_files)} blog post JSON files")

        for json_file in json_files:
            print(f"Processing {json_file.name}...")

            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Check if blog post already exists
            existing = db.query(BlogPost).filter(BlogPost.slug == data['slug']).first()
            if existing:
                print(f"  - Skipping {data['slug']} (already exists)")
                continue

            # Parse published_at datetime
            published_at = None
            if data.get('published_at'):
                try:
                    published_at = datetime.fromisoformat(data['published_at'].replace('Z', '+00:00'))
                except:
                    published_at = datetime.utcnow()

            # Create blog post
            blog_post = BlogPost(
                title=data['title'],
                slug=data['slug'],
                excerpt=data['excerpt'],
                content=data['content'],
                author=data.get('author', 'Dudley Peacock'),
                category=data['category'],
                primary_keyword=data['primary_keyword'],
                secondary_keywords=data.get('secondary_keywords', ''),
                meta_description=data['meta_description'],
                featured_image_url=data.get('featured_image_url'),
                published=data.get('published', True),
                published_at=published_at,
                read_time_minutes=data.get('read_time_minutes', 10),
            )

            db.add(blog_post)
            print(f"  [OK] Added {data['title']}")

        db.commit()
        print(f"\n[SUCCESS] Successfully seeded {len(json_files)} blog posts!")

    except Exception as e:
        print(f"[ERROR] Error seeding blog posts: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_blog_posts()
