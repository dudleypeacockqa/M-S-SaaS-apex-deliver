#!/usr/bin/env python3
"""
Upload blog posts to production database.
Reads from blog_posts_final_52.json and inserts into blog_posts table.
"""

import json
import sys
from pathlib import Path
from datetime import datetime
import os

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.blog_post import BlogPost

def upload_blog_posts():
    """Upload blog posts from JSON file to database."""
    
    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        return False
    
    # Use pymysql driver
    database_url = database_url.replace('mysql://', 'mysql+pymysql://')
    
    # Create engine and session
    engine = create_engine(database_url)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Load blog posts JSON
    json_file = backend_dir.parent / 'blog_posts_final_52.json'
    if not json_file.exists():
        print(f"ERROR: {json_file} not found")
        return False
    
    with open(json_file, 'r') as f:
        blog_posts_data = json.load(f)
    
    print(f"Found {len(blog_posts_data)} blog posts to upload")
    
    # Track statistics
    inserted = 0
    updated = 0
    skipped = 0
    
    for post_data in blog_posts_data:
        try:
            # Ensure post_data is a dict
            if not isinstance(post_data, dict):
                print(f"ERROR: Expected dict, got {type(post_data)}")
                skipped += 1
                continue
            
            # Add default values for missing fields
            if 'featured_image_url' not in post_data:
                post_data['featured_image_url'] = None
            
            # Check if post already exists by slug
            existing_post = session.query(BlogPost).filter_by(slug=post_data['slug']).first()
            
            if existing_post:
                # Update existing post
                for key, value in post_data.items():
                    if key == 'published_at' and isinstance(value, str):
                        value = datetime.fromisoformat(value.replace('Z', '+00:00'))
                    if hasattr(existing_post, key):
                        setattr(existing_post, key, value)
                updated += 1
                print(f"Updated: {post_data['title'][:60]}...")
            else:
                # Insert new post
                # Convert published_at string to datetime if needed
                if 'published_at' in post_data and isinstance(post_data['published_at'], str):
                    post_data['published_at'] = datetime.fromisoformat(post_data['published_at'].replace('Z', '+00:00'))
                
                # Remove fields that aren't in the model
                allowed_fields = ['title', 'slug', 'excerpt', 'content', 'author', 'category', 
                                'primary_keyword', 'secondary_keywords', 'meta_description', 
                                'featured_image_url', 'published', 'published_at', 'read_time_minutes']
                filtered_data = {k: v for k, v in post_data.items() if k in allowed_fields}
                
                # Create new blog post
                blog_post = BlogPost(**filtered_data)
                session.add(blog_post)
                inserted += 1
                print(f"Inserted: {filtered_data['title'][:60]}...")
            
            # Commit after each post to avoid losing progress
            session.commit()
            
        except Exception as e:
            import traceback
            print(f"ERROR processing post '{post_data.get('title', 'Unknown') if isinstance(post_data, dict) else 'Invalid data'}': {e}")
            print(traceback.format_exc())
            session.rollback()
            skipped += 1
            continue
    
    print(f"\n=== Upload Summary ===")
    print(f"Inserted: {inserted}")
    print(f"Updated: {updated}")
    print(f"Skipped: {skipped}")
    print(f"Total: {len(blog_posts_data)}")
    
    session.close()
    return True

if __name__ == "__main__":
    success = upload_blog_posts()
    sys.exit(0 if success else 1)
