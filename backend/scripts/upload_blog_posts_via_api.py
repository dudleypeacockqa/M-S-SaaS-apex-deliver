#!/usr/bin/env python3
"""
Upload blog posts to production database via API POST endpoint.
Reads from blog_posts_final_52.json and posts to /api/blog endpoint.
"""

import json
import sys
import requests
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Optional

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
project_root = backend_dir.parent

# API endpoint
API_BASE_URL = "https://ma-saas-backend.onrender.com"
API_ENDPOINT = f"{API_BASE_URL}/api/blog"

def upload_blog_posts() -> bool:
    """Upload blog posts from JSON file to database via API."""
    
    # Load blog posts JSON
    json_file = project_root / 'blog_posts_final_52.json'
    if not json_file.exists():
        print(f"ERROR: {json_file} not found")
        return False
    
    with open(json_file, 'r', encoding='utf-8') as f:
        blog_posts_data = json.load(f)
    
    print(f"Found {len(blog_posts_data)} blog posts to upload")
    print(f"API Endpoint: {API_ENDPOINT}")
    print()
    
    # Track statistics
    inserted = 0
    updated = 0
    skipped = 0
    errors = []
    
    for idx, post_data in enumerate(blog_posts_data, 1):
        try:
            # Ensure post_data is a dict
            if not isinstance(post_data, dict):
                print(f"[{idx}/{len(blog_posts_data)}] ERROR: Expected dict, got {type(post_data)}")
                skipped += 1
                continue
            
            # Prepare payload for API
            # Convert secondary_keywords from string to list if needed
            secondary_keywords = post_data.get('secondary_keywords', '')
            if isinstance(secondary_keywords, str):
                # Split by comma and clean up
                secondary_keywords_list = [kw.strip() for kw in secondary_keywords.split(',') if kw.strip()]
            elif isinstance(secondary_keywords, list):
                secondary_keywords_list = secondary_keywords
            else:
                secondary_keywords_list = []
            
            # Parse published_at if it's a string
            published_at = post_data.get('published_at')
            if isinstance(published_at, str):
                try:
                    # Try to parse ISO format
                    published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                except:
                    published_at = None
            
            # Truncate meta_description to 160 characters, ensure it's not empty
            meta_description = post_data.get('meta_description', '').strip()
            if not meta_description:
                # Use excerpt as fallback, truncated to 160
                meta_description = post_data.get('excerpt', '')[:157] + '...' if post_data.get('excerpt') else 'M&A Strategy and Finance Insights'
            elif len(meta_description) > 160:
                meta_description = meta_description[:157] + '...'
            
            # Handle missing primary_keyword - extract from title or use default
            primary_keyword = post_data.get('primary_keyword')
            if not primary_keyword or primary_keyword.strip() == '':
                # Try to extract from title (first few words)
                title_words = post_data.get('title', '').split()[:3]
                primary_keyword = ' '.join(title_words) if title_words else 'M&A Strategy'
            
            payload = {
                "title": post_data.get('title'),
                "slug": post_data.get('slug'),
                "excerpt": post_data.get('excerpt'),
                "content": post_data.get('content'),
                "category": post_data.get('category'),
                "primary_keyword": primary_keyword[:255],  # Ensure max length
                "secondary_keywords": secondary_keywords_list if secondary_keywords_list else None,
                "meta_description": meta_description,
                "featured_image_url": post_data.get('featured_image_url'),
                "author": post_data.get('author', 'Dudley Peacock'),
                "read_time_minutes": post_data.get('read_time_minutes', 10),
                "published": post_data.get('published', True),  # Default to True so posts are visible
                "published_at": published_at.isoformat() if published_at else datetime.now(timezone.utc).isoformat(),
            }
            
            # Remove None values for optional fields (but keep required ones)
            payload = {k: v for k, v in payload.items() if v is not None or k in ['title', 'slug', 'excerpt', 'content', 'category', 'primary_keyword', 'meta_description']}
            
            # Make POST request
            response = requests.post(API_ENDPOINT, json=payload, timeout=30)
            
            if response.status_code == 201:
                inserted += 1
                print(f"[{idx}/{len(blog_posts_data)}] [OK] Inserted: {post_data.get('title', 'Unknown')[:60]}...")
            elif response.status_code == 409:
                # Slug already exists - this is expected for updates
                updated += 1
                print(f"[{idx}/{len(blog_posts_data)}] [SKIP] Skipped (duplicate slug): {post_data.get('title', 'Unknown')[:60]}...")
            else:
                error_detail = response.text[:500] if response.text else "No error details"
                error_msg = f"HTTP {response.status_code}: {error_detail}"
                errors.append({
                    "title": post_data.get('title', 'Unknown'),
                    "slug": post_data.get('slug', 'Unknown'),
                    "error": error_msg
                })
                skipped += 1
                # Only show first few 500 errors in detail to avoid spam
                if response.status_code == 500 and idx <= 3:
                    print(f"[{idx}/{len(blog_posts_data)}] [ERROR] Error: {post_data.get('title', 'Unknown')[:60]}... - {error_msg}")
                else:
                    print(f"[{idx}/{len(blog_posts_data)}] [ERROR] Error: {post_data.get('title', 'Unknown')[:60]}... - HTTP {response.status_code}")
        
        except requests.exceptions.RequestException as e:
            error_msg = f"Request error: {str(e)}"
            errors.append({
                "title": post_data.get('title', 'Unknown') if isinstance(post_data, dict) else 'Invalid data',
                "slug": post_data.get('slug', 'Unknown') if isinstance(post_data, dict) else 'Unknown',
                "error": error_msg
            })
            skipped += 1
            print(f"[{idx}/{len(blog_posts_data)}] [ERROR] Network error: {error_msg}")
        except Exception as e:
            import traceback
            error_msg = f"Unexpected error: {str(e)}"
            errors.append({
                "title": post_data.get('title', 'Unknown') if isinstance(post_data, dict) else 'Invalid data',
                "slug": post_data.get('slug', 'Unknown') if isinstance(post_data, dict) else 'Unknown',
                "error": error_msg
            })
            skipped += 1
            print(f"[{idx}/{len(blog_posts_data)}] [ERROR] Error: {error_msg}")
            if '--verbose' in sys.argv:
                print(traceback.format_exc())
    
    print()
    print("=" * 70)
    print("UPLOAD SUMMARY")
    print("=" * 70)
    print(f"[OK] Inserted: {inserted}")
    print(f"[SKIP] Skipped (duplicates): {updated}")
    print(f"[ERROR] Errors: {skipped}")
    print(f"[TOTAL] Total: {len(blog_posts_data)}")
    
    if errors:
        print()
        print("ERRORS:")
        for error in errors[:10]:  # Show first 10 errors
            print(f"  - {error['title'][:50]}: {error['error']}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more errors")
    
    return skipped == 0

if __name__ == "__main__":
    print("=" * 70)
    print("BLOG POSTS API UPLOAD")
    print("=" * 70)
    print()
    
    success = upload_blog_posts()
    sys.exit(0 if success else 1)

