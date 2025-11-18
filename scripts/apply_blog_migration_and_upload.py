#!/usr/bin/env python3
"""
Apply blog migration and upload blog posts to production.

This script:
1. Verifies blog_posts table exists (or applies migration)
2. Uploads 52 blog posts via API
3. Verifies upload success

Usage:
    python scripts/apply_blog_migration_and_upload.py
"""

import json
import sys
import requests
from pathlib import Path

# API endpoint
API_BASE_URL = "https://ma-saas-backend.onrender.com"
API_ENDPOINT = f"{API_BASE_URL}/api/blog"

def check_blog_api() -> bool:
    """Check if blog API is working."""
    try:
        response = requests.get(f"{API_ENDPOINT}?limit=1", timeout=10)
        if response.status_code == 200:
            print("[OK] Blog API is working")
            return True
        elif response.status_code == 500:
            print("[ERROR] Blog API returns 500 - table likely missing")
            return False
        else:
            print(f"[WARN] Blog API returns {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Error checking blog API: {e}")
        return False

def upload_blog_posts() -> tuple[int, int, int]:
    """Upload blog posts from JSON file."""
    project_root = Path(__file__).parent.parent
    json_file = project_root / 'blog_posts_final_52.json'
    
    if not json_file.exists():
        print(f"[ERROR] {json_file} not found")
        return (0, 0, 52)
    
    with open(json_file, 'r', encoding='utf-8') as f:
        blog_posts_data = json.load(f)
    
    print(f"\nFound {len(blog_posts_data)} blog posts to upload")
    print(f"API Endpoint: {API_ENDPOINT}\n")
    
    inserted = 0
    skipped = 0
    errors = 0
    
    for idx, post_data in enumerate(blog_posts_data, 1):
        try:
            # Prepare payload
            secondary_keywords = post_data.get('secondary_keywords', '')
            if isinstance(secondary_keywords, str):
                secondary_keywords_list = [kw.strip() for kw in secondary_keywords.split(',') if kw.strip()]
            elif isinstance(secondary_keywords, list):
                secondary_keywords_list = secondary_keywords
            else:
                secondary_keywords_list = []
            
            from datetime import datetime, timezone
            published_at = post_data.get('published_at')
            if isinstance(published_at, str):
                try:
                    published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                except:
                    published_at = None
            
            meta_description = post_data.get('meta_description', '').strip()
            if not meta_description:
                meta_description = post_data.get('excerpt', '')[:157] + '...' if post_data.get('excerpt') else 'M&A Strategy and Finance Insights'
            elif len(meta_description) > 160:
                meta_description = meta_description[:157] + '...'
            
            primary_keyword = post_data.get('primary_keyword')
            if not primary_keyword or primary_keyword.strip() == '':
                title_words = post_data.get('title', '').split()[:3]
                primary_keyword = ' '.join(title_words) if title_words else 'M&A Strategy'
            
            payload = {
                "title": post_data.get('title'),
                "slug": post_data.get('slug'),
                "excerpt": post_data.get('excerpt'),
                "content": post_data.get('content'),
                "category": post_data.get('category'),
                "primary_keyword": primary_keyword[:255],
                "secondary_keywords": secondary_keywords_list if secondary_keywords_list else None,
                "meta_description": meta_description,
                "featured_image_url": post_data.get('featured_image_url'),
                "author": post_data.get('author', 'Dudley Peacock'),
                "read_time_minutes": post_data.get('read_time_minutes', 10),
                "published": post_data.get('published', True),
                "published_at": published_at.isoformat() if published_at else datetime.now(timezone.utc).isoformat(),
            }
            
            payload = {k: v for k, v in payload.items() if v is not None or k in ['title', 'slug', 'excerpt', 'content', 'category', 'primary_keyword', 'meta_description']}
            
            response = requests.post(API_ENDPOINT, json=payload, timeout=30)
            
            if response.status_code == 201:
                inserted += 1
                print(f"[{idx}/{len(blog_posts_data)}] [OK] Inserted: {post_data.get('title', 'Unknown')[:60]}...")
            elif response.status_code == 409:
                skipped += 1
                print(f"[{idx}/{len(blog_posts_data)}] [SKIP] Skipped (duplicate): {post_data.get('title', 'Unknown')[:60]}...")
            else:
                errors += 1
                error_detail = response.text[:200] if response.text else "No error details"
                if idx <= 3:  # Show first few errors in detail
                    print(f"[{idx}/{len(blog_posts_data)}] [ERROR] Error: {post_data.get('title', 'Unknown')[:60]}... - HTTP {response.status_code}: {error_detail}")
                else:
                    print(f"[{idx}/{len(blog_posts_data)}] [ERROR] Error: {post_data.get('title', 'Unknown')[:60]}... - HTTP {response.status_code}")
        
        except Exception as e:
            errors += 1
            print(f"[{idx}/{len(blog_posts_data)}] [ERROR] Exception: {str(e)[:100]}")
    
    return (inserted, skipped, errors)

def verify_upload() -> bool:
    """Verify blog posts were uploaded."""
    try:
        response = requests.get(f"{API_ENDPOINT}?limit=100&published_only=false", timeout=10)
        if response.status_code == 200:
            posts = response.json()
            count = len(posts)
            print(f"\n[OK] Verification: {count} posts found in database")
            if count >= 52:
                print("[OK] All 52 posts are present!")
                return True
            else:
                print(f"[WARN] Expected 52 posts, found {count}")
                return False
        else:
            print(f"[ERROR] Verification failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] Verification error: {e}")
        return False

def main():
    print("=" * 70)
    print("BLOG MIGRATION AND UPLOAD SCRIPT")
    print("=" * 70)
    print()
    
    # Step 1: Check if blog API is working
    print("Step 1: Checking blog API...")
    if not check_blog_api():
        print("\n[ERROR] Blog API is not working. Please apply migrations first:")
        print("   1. Go to Render Dashboard -> Backend Service -> Shell")
        print("   2. Run: cd backend && alembic upgrade head")
        print("   3. Then re-run this script")
        sys.exit(1)
    
    # Step 2: Upload blog posts
    print("\nStep 2: Uploading blog posts...")
    inserted, skipped, errors = upload_blog_posts()
    
    print()
    print("=" * 70)
    print("UPLOAD SUMMARY")
    print("=" * 70)
    print(f"[OK] Inserted: {inserted}")
    print(f"[SKIP] Skipped (duplicates): {skipped}")
    print(f"[ERROR] Errors: {errors}")
    print(f"[TOTAL] Total: {inserted + skipped + errors}")
    
    if errors > 0:
        print(f"\n[WARN] {errors} posts failed to upload. Check errors above.")
        sys.exit(1)
    
    # Step 3: Verify upload
    print("\nStep 3: Verifying upload...")
    if verify_upload():
        print("\n[SUCCESS] All blog posts uploaded and verified!")
        sys.exit(0)
    else:
        print("\n[WARN] Upload completed but verification failed. Check manually.")
        sys.exit(1)

if __name__ == "__main__":
    main()

