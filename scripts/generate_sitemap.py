#!/usr/bin/env python3
"""
Generate complete sitemap.xml with all blog posts from production database.

This script:
1. Connects to production PostgreSQL database
2. Fetches all published blog posts
3. Generates sitemap.xml with all static pages + blog posts
4. Saves to frontend/public/sitemap.xml for deployment

Usage:
    python scripts/generate_sitemap.py
"""

import sys
import os
from datetime import datetime

# Check if psycopg2 is available
try:
    import psycopg2
except ImportError:
    print("ERROR: psycopg2 not installed")
    print("Install with: pip install psycopg2-binary")
    sys.exit(1)

# Database connection string
DATABASE_URL = "postgresql://ma_saas_user:[REDACTED-ROTATED-2025-11-11]@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"
BASE_URL = "https://financeflo.ai"

# Static pages configuration
STATIC_PAGES = [
    {"loc": "/", "changefreq": "weekly", "priority": "1.0"},
    {"loc": "/pricing", "changefreq": "weekly", "priority": "0.9"},
    {"loc": "/features", "changefreq": "monthly", "priority": "0.8"},
    {"loc": "/blog", "changefreq": "weekly", "priority": "0.7"},
    {"loc": "/about", "changefreq": "monthly", "priority": "0.6"},
    {"loc": "/contact", "changefreq": "monthly", "priority": "0.6"},
    {"loc": "/security", "changefreq": "monthly", "priority": "0.6"},
    {"loc": "/capliquify-fpa", "changefreq": "monthly", "priority": "0.6"},
    {"loc": "/sales-promotion-pricing", "changefreq": "monthly", "priority": "0.6"},
    {"loc": "/book-trial", "changefreq": "weekly", "priority": "0.7"},
    {"loc": "/team", "changefreq": "monthly", "priority": "0.5"},
    {"loc": "/faq", "changefreq": "monthly", "priority": "0.5"},
    {"loc": "/4-stage-cycle", "changefreq": "monthly", "priority": "0.5"},
    {"loc": "/case-studies", "changefreq": "monthly", "priority": "0.5"},
    {"loc": "/podcast", "changefreq": "weekly", "priority": "0.6"},
    {"loc": "/legal/terms", "changefreq": "yearly", "priority": "0.3"},
    {"loc": "/legal/privacy", "changefreq": "yearly", "priority": "0.3"},
    {"loc": "/legal/cookies", "changefreq": "yearly", "priority": "0.3"},
]


def generate_sitemap():
    """Generate sitemap.xml with static pages and dynamic blog posts."""
    print("=" * 70)
    print("SITEMAP GENERATION")
    print("=" * 70)
    print()

    # Step 1: Connect to database
    print("[1/4] Connecting to production database...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("  Connected successfully")
    except Exception as e:
        print(f"  ERROR: Failed to connect: {e}")
        sys.exit(1)

    # Step 2: Fetch blog posts
    print()
    print("[2/4] Fetching published blog posts...")
    try:
        cursor.execute("""
            SELECT slug, updated_at
            FROM blog_posts
            WHERE published = TRUE
            ORDER BY published_at DESC;
        """)
        blog_posts = cursor.fetchall()
        print(f"  Found {len(blog_posts)} published posts")
    except Exception as e:
        print(f"  ERROR: Failed to fetch posts: {e}")
        cursor.close()
        conn.close()
        sys.exit(1)

    # Step 3: Generate sitemap XML
    print()
    print("[3/4] Generating sitemap XML...")

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    # Add static pages
    for page in STATIC_PAGES:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{BASE_URL}{page['loc']}</loc>")
        xml_lines.append(f"    <changefreq>{page['changefreq']}</changefreq>")
        xml_lines.append(f"    <priority>{page['priority']}</priority>")
        xml_lines.append("  </url>")

    # Add blog posts
    for slug, updated_at in blog_posts:
        lastmod = updated_at.strftime("%Y-%m-%d") if updated_at else datetime.now().strftime("%Y-%m-%d")
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{BASE_URL}/blog/{slug}</loc>")
        xml_lines.append("    <changefreq>monthly</changefreq>")
        xml_lines.append("    <priority>0.6</priority>")
        xml_lines.append(f"    <lastmod>{lastmod}</lastmod>")
        xml_lines.append("  </url>")

    xml_lines.append("</urlset>")
    xml_content = "\n".join(xml_lines)

    print(f"  Generated sitemap with {len(STATIC_PAGES)} static pages + {len(blog_posts)} blog posts")

    # Step 4: Write sitemap file
    print()
    print("[4/4] Writing sitemap.xml...")

    sitemap_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "frontend",
        "public",
        "sitemap.xml"
    )

    try:
        with open(sitemap_path, "w", encoding="utf-8") as f:
            f.write(xml_content)
        print(f"  Sitemap written to: {sitemap_path}")
        print(f"  Total URLs: {len(STATIC_PAGES) + len(blog_posts)}")
    except Exception as e:
        print(f"  ERROR: Failed to write sitemap: {e}")
        cursor.close()
        conn.close()
        sys.exit(1)

    # Close connection
    cursor.close()
    conn.close()

    print()
    print("=" * 70)
    print(f"SUCCESS! Sitemap generated with {len(STATIC_PAGES) + len(blog_posts)} URLs")
    print("=" * 70)
    print()
    print("Next steps:")
    print("1. Commit updated sitemap.xml")
    print("2. Deploy to production")
    print("3. Submit to Google Search Console: https://search.google.com/search-console")
    print()


if __name__ == "__main__":
    generate_sitemap()
