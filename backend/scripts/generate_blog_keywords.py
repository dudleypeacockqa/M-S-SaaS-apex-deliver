#!/usr/bin/env python3
"""
Generate SEO keywords for blog posts using GPT-4.

This script reads blog posts from JSON files, identifies posts missing
keyword data, and uses OpenAI GPT-4 to generate:
- primary_keyword (2-5 words, focused search term)
- secondary_keywords (4-5 related terms, comma-separated)
- meta_description (140-160 characters, compelling, SEO-optimized)

Usage:
    python generate_blog_keywords.py [--test] [--limit N]

Options:
    --test      Test mode: only process 3 sample posts
    --limit N   Limit to N posts (for testing)
"""

import json
import os
import sys
import asyncio
import argparse
from pathlib import Path
from typing import Dict, List, Optional

# Add backend to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

try:
    from openai import AsyncOpenAI
except ImportError:
    print("ERROR: openai package not installed. Run: pip install openai>=1.3.0")
    sys.exit(1)


class BlogKeywordGenerator:
    """Generate SEO keywords for blog posts using GPT-4."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize with OpenAI API key."""
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OpenAI API key required. Set OPENAI_API_KEY environment variable "
                "or pass api_key parameter."
            )
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def generate_keywords(
        self,
        title: str,
        excerpt: str,
        content: str,
        category: str,
    ) -> Dict[str, str]:
        """
        Generate SEO keywords for a single blog post.

        Args:
            title: Blog post title
            excerpt: Blog post excerpt (2-3 paragraphs)
            content: Full blog post content (HTML/Markdown)
            category: Post category (M&A Strategy, FP&A, PMI, etc.)

        Returns:
            Dict with primary_keyword, secondary_keywords, meta_description
        """
        # Truncate content for API efficiency
        excerpt_sample = excerpt[:400] if len(excerpt) > 400 else excerpt
        content_sample = content[:1200] if len(content) > 1200 else content

        prompt = f"""You are an SEO expert for a M&A SaaS platform targeting M&A professionals, CFOs, and finance leaders.

Generate SEO keywords for this blog post:

**Title:** {title}
**Category:** {category}
**Excerpt:** {excerpt_sample}
**Content Sample:** {content_sample}

Based on the examples below, generate appropriate SEO metadata:

**Example 1 (M&A):**
- Primary Keyword: "M&A deal flow management"
- Secondary Keywords: "deal pipeline, M&A software, deal sourcing, M&A CRM"
- Meta Description: "Master M&A deal flow management in 2025. This guide covers the 5-stage deal pipeline, common challenges, and how M&A software can boost your deal velocity."

**Example 2 (Due Diligence):**
- Primary Keyword: "financial due diligence"
- Secondary Keywords: "due diligence checklist, M&A due diligence, financial analysis, deal evaluation"
- Meta Description: "Master financial due diligence with this ultimate guide. Learn the 7-step process, key metrics to analyze, and common red flags that kill deals."

**Example 3 (PMI):**
- Primary Keyword: "post-merger integration"
- Secondary Keywords: "PMI best practices, M&A integration, merger success, acquisition integration"
- Meta Description: "Avoid PMI pitfalls with this comprehensive guide. Learn the proven framework for successful post-merger integration and synergy realization."

**Requirements:**
1. Primary Keyword: 2-5 words, natural language, focused on main topic, high search intent
2. Secondary Keywords: 4-5 related terms (comma-separated), mix of exact match and related phrases
3. Meta Description: 140-160 characters, compelling, includes primary keyword, action-oriented

Return ONLY valid JSON (no markdown formatting):
{{
  "primary_keyword": "your primary keyword here",
  "secondary_keywords": "keyword1, keyword2, keyword3, keyword4",
  "meta_description": "Your compelling meta description here (140-160 chars)"
}}"""

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=300,
            )

            content_text = response.choices[0].message.content.strip()

            # Remove markdown code blocks if present
            if content_text.startswith("```json"):
                content_text = content_text[7:]
            if content_text.startswith("```"):
                content_text = content_text[3:]
            if content_text.endswith("```"):
                content_text = content_text[:-3]

            result = json.loads(content_text.strip())

            # Validate response structure
            required_keys = ["primary_keyword", "secondary_keywords", "meta_description"]
            if not all(key in result for key in required_keys):
                raise ValueError(f"Missing required keys in GPT-4 response: {result}")

            return result

        except json.JSONDecodeError as e:
            print(f"ERROR: Failed to parse GPT-4 response as JSON: {e}")
            print(f"Response content: {response.choices[0].message.content}")
            raise
        except Exception as e:
            print(f"ERROR: Failed to generate keywords: {e}")
            raise

    def load_existing_keywords(self, filepath: str) -> Dict[str, Dict]:
        """Load posts with existing keyword data."""
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                posts = json.load(f)

            # Create slug -> keywords mapping
            keywords_map = {}
            for post in posts:
                if "slug" in post and "primary_keyword" in post:
                    keywords_map[post["slug"]] = {
                        "primary_keyword": post["primary_keyword"],
                        "secondary_keywords": post.get("secondary_keywords", ""),
                        "meta_description": post.get("meta_description", ""),
                    }

            return keywords_map

        except FileNotFoundError:
            print(f"WARNING: File not found: {filepath}")
            return {}
        except Exception as e:
            print(f"ERROR: Failed to load existing keywords: {e}")
            return {}

    def load_full_content(self, filepath: str) -> List[Dict]:
        """Load full blog post content."""
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Handle different JSON structures
            if isinstance(data, dict) and "results" in data:
                # Structure: {"results": [{"input": "...", "output": {...}}]}
                posts = []
                for item in data["results"]:
                    if "output" in item and isinstance(item["output"], dict):
                        posts.append(item["output"])
                return posts
            elif isinstance(data, list):
                return data
            else:
                print(f"ERROR: Unexpected JSON structure in {filepath}")
                return []

        except FileNotFoundError:
            print(f"ERROR: File not found: {filepath}")
            sys.exit(1)
        except Exception as e:
            print(f"ERROR: Failed to load full content: {e}")
            sys.exit(1)

    def match_post_to_slug(self, post: Dict, sql_slugs: List[str]) -> Optional[str]:
        """Match a post from full_content.json to a slug from SQL."""
        title = post.get("title", "")

        # Create slug from title (simplified version)
        slug_candidate = title.lower()
        slug_candidate = slug_candidate.replace(" ", "-")
        slug_candidate = slug_candidate.replace("&", "and")
        slug_candidate = slug_candidate.replace(":", "")
        slug_candidate = slug_candidate.replace("'", "")
        slug_candidate = slug_candidate.replace('"', "")
        slug_candidate = slug_candidate.replace("?", "")
        slug_candidate = slug_candidate.replace("!", "")
        slug_candidate = slug_candidate.replace(",", "")
        slug_candidate = slug_candidate.replace(".", "")
        slug_candidate = slug_candidate.replace("(", "")
        slug_candidate = slug_candidate.replace(")", "")

        # Try to find exact match
        if slug_candidate in sql_slugs:
            return slug_candidate

        # Try to find partial match
        for sql_slug in sql_slugs:
            if sql_slug in slug_candidate or slug_candidate in sql_slug:
                return sql_slug

        return None

    async def process_posts(
        self,
        full_content_path: str,
        existing_keywords_path: str,
        sql_slugs_path: str,
        test_mode: bool = False,
        limit: Optional[int] = None,
    ) -> Dict:
        """
        Process blog posts and generate missing keywords.

        Args:
            full_content_path: Path to blog_posts_full_content.json
            existing_keywords_path: Path to blog_posts_for_database.json
            sql_slugs_path: Path to file with SQL slugs (or SQL file itself)
            test_mode: If True, only process 3 sample posts
            limit: Maximum number of posts to process

        Returns:
            Dict with all posts including generated keywords
        """
        print("=" * 70)
        print("BLOG KEYWORD GENERATION - GPT-4")
        print("=" * 70)

        # Load existing keyword data
        print(f"\n[1/6] Loading existing keyword data from {existing_keywords_path}...")
        existing_keywords = self.load_existing_keywords(existing_keywords_path)
        print(f"  Found {len(existing_keywords)} posts with existing keywords")

        # Load full content
        print(f"\n[2/6] Loading full content from {full_content_path}...")
        all_posts = self.load_full_content(full_content_path)
        print(f"  Loaded {len(all_posts)} posts with full content")

        # Extract SQL slugs (simplified: just get from existing keywords + assume 50 total)
        sql_slugs = list(existing_keywords.keys())
        print(f"\n[3/6] Found {len(sql_slugs)} slugs from existing data")

        # Identify posts missing keywords
        posts_needing_keywords = []
        for post in all_posts:
            slug = self.match_post_to_slug(post, sql_slugs)
            if slug and slug not in existing_keywords:
                posts_needing_keywords.append({
                    "slug": slug,
                    "title": post.get("title", ""),
                    "excerpt": post.get("excerpt", ""),
                    "content": post.get("content", ""),
                    "category": self.infer_category(post.get("title", "")),
                })

        print(f"\n[4/6] Identified {len(posts_needing_keywords)} posts needing keywords")

        # Apply test mode or limit
        if test_mode:
            print("\n  TEST MODE: Processing only 3 sample posts")
            posts_needing_keywords = posts_needing_keywords[:3]
        elif limit:
            print(f"\n  LIMIT MODE: Processing only {limit} posts")
            posts_needing_keywords = posts_needing_keywords[:limit]

        # Generate keywords
        print(f"\n[5/6] Generating keywords for {len(posts_needing_keywords)} posts...")
        generated_count = 0
        failed_count = 0

        for idx, post in enumerate(posts_needing_keywords, 1):
            try:
                print(f"\n  [{idx}/{len(posts_needing_keywords)}] {post['title'][:60]}...")

                keywords = await self.generate_keywords(
                    title=post["title"],
                    excerpt=post["excerpt"],
                    content=post["content"],
                    category=post["category"],
                )

                print(f"    Primary: {keywords['primary_keyword']}")
                print(f"    Secondary: {keywords['secondary_keywords'][:60]}...")

                # Store generated keywords
                existing_keywords[post["slug"]] = keywords
                generated_count += 1

                # Small delay to avoid rate limits
                await asyncio.sleep(0.5)

            except Exception as e:
                print(f"    FAILED: {e}")
                failed_count += 1

        print(f"\n[6/6] Generation complete!")
        print(f"  Success: {generated_count}")
        print(f"  Failed: {failed_count}")
        print(f"  Total posts with keywords: {len(existing_keywords)}")

        return existing_keywords

    def infer_category(self, title: str) -> str:
        """Infer category from post title."""
        title_lower = title.lower()

        if any(term in title_lower for term in ["m&a", "merger", "acquisition", "deal", "valuation", "due diligence"]):
            return "M&A Strategy"
        elif any(term in title_lower for term in ["fp&a", "forecast", "budget", "planning", "kpi"]):
            return "FP&A"
        elif any(term in title_lower for term in ["pmi", "post-merger", "integration", "synergy"]):
            return "Post-Merger Integration"
        elif any(term in title_lower for term in ["working capital", "cash flow", "inventory", "receivable", "payable"]):
            return "Working Capital"
        elif any(term in title_lower for term in ["pricing", "price"]):
            return "Pricing Strategy"
        else:
            return "M&A Strategy"  # Default

    def save_results(self, keywords_map: Dict, output_path: str):
        """Save generated keywords to JSON file."""
        # Convert to list format
        results = []
        for slug, data in keywords_map.items():
            results.append({
                "slug": slug,
                **data
            })

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"\nResults saved to: {output_path}")


async def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Generate blog post SEO keywords using GPT-4")
    parser.add_argument("--test", action="store_true", help="Test mode: process only 3 posts")
    parser.add_argument("--limit", type=int, help="Limit number of posts to process")
    parser.add_argument("--output", default="blog_keywords_generated.json", help="Output file path")
    args = parser.parse_args()

    # File paths
    project_root = Path(__file__).parent.parent.parent
    full_content_path = project_root / "docs" / "blog_posts_full_content.json"
    existing_keywords_path = project_root / "blog_posts_for_database.json"
    sql_slugs_path = project_root / "docs" / "blog_import.sql"

    # Initialize generator
    try:
        generator = BlogKeywordGenerator()
    except ValueError as e:
        print(f"\nERROR: {e}")
        print("\nTo set your API key:")
        print("  export OPENAI_API_KEY='your-api-key-here'")
        sys.exit(1)

    # Process posts
    try:
        keywords_map = await generator.process_posts(
            full_content_path=str(full_content_path),
            existing_keywords_path=str(existing_keywords_path),
            sql_slugs_path=str(sql_slugs_path),
            test_mode=args.test,
            limit=args.limit,
        )

        # Save results
        output_path = project_root / args.output
        generator.save_results(keywords_map, str(output_path))

        print("\n" + "=" * 70)
        print("SUCCESS! Keywords generated and saved.")
        print("=" * 70)

    except Exception as e:
        print(f"\n\nFATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
