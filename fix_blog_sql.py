#!/usr/bin/env python3
"""
Script to add missing primary_keyword and secondary_keywords columns to blog_import.sql
The current SQL file is missing these required columns, causing import failures.
"""

import json
import re

# Load the JSON data with blog posts (complete version with all keywords)
keywords_file = 'blog_posts_for_database_COMPLETE.json'
try:
    with open(keywords_file, 'r', encoding='utf-8') as f:
        blog_posts = json.load(f)
except FileNotFoundError:
    print(f"WARNING: {keywords_file} not found, falling back to blog_posts_for_database.json")
    with open('blog_posts_for_database.json', 'r', encoding='utf-8') as f:
        blog_posts = json.load(f)

# Create a mapping of slug -> keywords
keywords_map = {}
for post in blog_posts:
    keywords_map[post['slug']] = {
        'primary_keyword': post['primary_keyword'],
        'secondary_keywords': post['secondary_keywords']
    }

print(f"Loaded {len(keywords_map)} posts from JSON")

# Read the SQL file
with open('docs/blog_import.sql', 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Pattern to match INSERT statements
# We need to:
# 1. Add columns to the column list
# 2. Add values to the VALUES list

# First, fix the column list in all INSERT statements
sql_content = sql_content.replace(
    "published, published_at, author, read_time_minutes,",
    "published, published_at, author, read_time_minutes, primary_keyword, secondary_keywords,"
)

# Now we need to add the actual values
# This is trickier - we need to find each slug and add the corresponding keywords

# Split into individual INSERT statements
inserts = re.split(r'(INSERT INTO blog_posts)', sql_content)

fixed_sql = inserts[0]  # Header comment

for i in range(1, len(inserts), 2):
    if i + 1 >= len(inserts):
        break

    insert_keyword = inserts[i]
    insert_body = inserts[i + 1]

    # Extract the slug from the VALUES
    slug_match = re.search(r"'([a-z0-9-]+)',\s*'", insert_body)
    if slug_match:
        slug = slug_match.group(1)

        if slug in keywords_map:
            # Find the last value before the closing parenthesis and timestamp
            # Pattern: 'Dudley Peacock',\n    12,\n    NOW(),
            # We need to add after the read_time_minutes value (12)

            # Find the pattern: author, read_time_minutes, created_at
            pattern = r"(\'Dudley Peacock\',\s*\n\s*)(\d+)(,\s*\n\s*NOW\(\))"

            primary_kw = keywords_map[slug]['primary_keyword'].replace("'", "''")
            secondary_kw = keywords_map[slug]['secondary_keywords'].replace("'", "''")

            replacement = rf"\1\2,\n    '{primary_kw}',\n    '{secondary_kw}'\3"

            insert_body = re.sub(pattern, replacement, insert_body, count=1)

    fixed_sql += insert_keyword + insert_body

# Write the fixed SQL
with open('docs/blog_import_FIXED.sql', 'w', encoding='utf-8') as f:
    f.write(fixed_sql)

print("[OK] Fixed SQL written to docs/blog_import_FIXED.sql")
print(f"[OK] Processed {len(keywords_map)} posts with keywords")
print("Please review the file and then rename it to blog_import.sql")
