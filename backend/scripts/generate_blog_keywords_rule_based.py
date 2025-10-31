#!/usr/bin/env python3
"""
Generate SEO keywords for blog posts using rule-based analysis (no API required).

This script analyzes blog post content and generates:
- primary_keyword (2-5 words, focused search term)
- secondary_keywords (4-5 related terms, comma-separated)
- meta_description (140-160 characters, compelling, SEO-optimized)

Usage:
    python generate_blog_keywords_rule_based.py
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
from collections import Counter


class RuleBasedKeywordGenerator:
    """Generate SEO keywords using rule-based content analysis."""

    # Industry-specific keyword templates
    KEYWORD_PATTERNS = {
        "M&A Strategy": {
            "primary_terms": ["M&A", "merger", "acquisition", "deal flow", "due diligence", "valuation"],
            "secondary_terms": ["M&A strategy", "deal pipeline", "M&A process", "acquisition strategy",
                               "merger planning", "dealmaking", "M&A software", "deal sourcing"],
        },
        "FP&A": {
            "primary_terms": ["FP&A", "financial planning", "budgeting", "forecasting", "KPI"],
            "secondary_terms": ["FP&A best practices", "financial analysis", "budget planning",
                               "financial forecasting", "CFO tools", "financial modeling", "variance analysis"],
        },
        "Post-Merger Integration": {
            "primary_terms": ["PMI", "post-merger integration", "integration", "synergy"],
            "secondary_terms": ["PMI best practices", "merger integration", "acquisition integration",
                               "synergy realization", "integration planning", "M&A integration"],
        },
        "Working Capital": {
            "primary_terms": ["working capital", "cash flow", "liquidity", "cash management"],
            "secondary_terms": ["working capital management", "cash flow optimization", "liquidity planning",
                               "cash conversion", "receivables", "payables", "inventory management"],
        },
        "Pricing Strategy": {
            "primary_terms": ["pricing strategy", "pricing", "value-based pricing", "price optimization"],
            "secondary_terms": ["pricing models", "pricing strategy guide", "SaaS pricing",
                               "pricing optimization", "value pricing", "competitive pricing"],
        },
        "Due Diligence": {
            "primary_terms": ["due diligence", "DD", "financial due diligence", "M&A due diligence"],
            "secondary_terms": ["due diligence checklist", "financial analysis", "deal evaluation",
                               "DD process", "due diligence best practices", "M&A analysis"],
        },
        "Valuation": {
            "primary_terms": ["valuation", "business valuation", "DCF", "company valuation"],
            "secondary_terms": ["valuation methods", "DCF valuation", "comp analysis",
                               "precedent transactions", "M&A valuation", "valuation multiples"],
        },
    }

    def __init__(self):
        """Initialize the generator."""
        pass

    def extract_key_phrases(self, text: str, min_length: int = 2, max_length: int = 5) -> List[str]:
        """Extract meaningful multi-word phrases from text."""
        # Clean text
        text = text.lower()
        text = re.sub(r'[^\w\s&-]', ' ', text)

        # Split into words
        words = text.split()

        # Extract n-grams (2-5 words)
        phrases = []
        for n in range(min_length, max_length + 1):
            for i in range(len(words) - n + 1):
                phrase = ' '.join(words[i:i+n])
                # Filter out common words and short phrases
                if len(phrase) > 5 and not self._is_stopword_phrase(phrase):
                    phrases.append(phrase)

        return phrases

    def _is_stopword_phrase(self, phrase: str) -> bool:
        """Check if phrase is composed mainly of stopwords."""
        stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                     'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
                     'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                     'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that'}

        words = phrase.split()
        stopword_count = sum(1 for w in words if w in stopwords)
        return stopword_count / len(words) > 0.6

    def _generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title."""
        slug = title.lower()
        # Replace & with 'and'
        slug = slug.replace('&', 'and')
        # Remove special characters
        slug = re.sub(r'[^\w\s-]', '', slug)
        # Replace spaces with hyphens
        slug = re.sub(r'[\s]+', '-', slug)
        # Remove consecutive hyphens
        slug = re.sub(r'-+', '-', slug)
        # Trim hyphens from start/end
        slug = slug.strip('-')
        return slug

    def infer_category(self, title: str, content: str) -> str:
        """Infer category from title and content."""
        text = (title + " " + content[:1000]).lower()

        # Check for specific patterns
        if any(term in text for term in ["m&a", "merger", "acquisition", "deal flow", "valuation"]):
            if "integration" in text or "pmi" in text:
                return "Post-Merger Integration"
            elif "due diligence" in text:
                return "Due Diligence"
            elif "valuation" in text or "dcf" in text:
                return "Valuation"
            return "M&A Strategy"
        elif any(term in text for term in ["fp&a", "forecast", "budget", "planning"]):
            return "FP&A"
        elif any(term in text for term in ["working capital", "cash flow", "liquidity"]):
            return "Working Capital"
        elif any(term in text for term in ["pricing", "price"]):
            return "Pricing Strategy"
        else:
            return "M&A Strategy"  # Default

    def generate_keywords(self, title: str, excerpt: str, content: str) -> Dict[str, str]:
        """Generate SEO keywords for a blog post."""
        # Infer category
        category = self.infer_category(title, content)

        # Get category-specific keywords
        patterns = self.KEYWORD_PATTERNS.get(category, self.KEYWORD_PATTERNS["M&A Strategy"])

        # Extract phrases from title and content
        title_phrases = self.extract_key_phrases(title, 2, 4)
        content_phrases = self.extract_key_phrases(excerpt + " " + content[:2000], 2, 5)

        # Find most relevant primary keyword
        primary_keyword = self._select_primary_keyword(title, title_phrases, patterns["primary_terms"])

        # Generate secondary keywords
        secondary_keywords = self._select_secondary_keywords(
            content_phrases, patterns["secondary_terms"], primary_keyword
        )

        # Generate meta description
        meta_description = self._generate_meta_description(title, excerpt, primary_keyword)

        return {
            "primary_keyword": primary_keyword,
            "secondary_keywords": secondary_keywords,
            "meta_description": meta_description,
        }

    def _select_primary_keyword(self, title: str, title_phrases: List[str],
                                primary_terms: List[str]) -> str:
        """Select the most relevant primary keyword."""
        title_lower = title.lower()

        # Check for exact matches in title
        for term in primary_terms:
            if term.lower() in title_lower:
                return term

        # Check for phrase matches in title
        for phrase in title_phrases[:5]:  # Top 5 title phrases
            if any(term.lower() in phrase for term in primary_terms):
                return phrase.replace("  ", " ").strip()

        # Fallback: use most relevant term
        return primary_terms[0]

    def _select_secondary_keywords(self, content_phrases: List[str],
                                   secondary_terms: List[str], primary_keyword: str) -> str:
        """Select 4-5 secondary keywords."""
        # Count phrase frequency
        phrase_counts = Counter(content_phrases)
        top_phrases = [p for p, _ in phrase_counts.most_common(20)]

        # Select secondary keywords
        selected = []

        # Add template terms that appear in content
        for term in secondary_terms:
            if any(term.lower() in phrase for phrase in top_phrases):
                selected.append(term)
                if len(selected) >= 5:
                    break

        # Add unique phrases from content if needed
        for phrase in top_phrases:
            if len(selected) >= 5:
                break
            # Avoid duplicating primary keyword
            if phrase != primary_keyword.lower() and phrase not in selected:
                # Must be related to business/finance
                if any(word in phrase for word in ["strategy", "process", "management", "analysis",
                                                   "planning", "guide", "best", "practices"]):
                    selected.append(phrase)

        # Ensure we have at least 4 keywords
        if len(selected) < 4:
            selected.extend(secondary_terms[:4 - len(selected)])

        return ", ".join(selected[:5])

    def _generate_meta_description(self, title: str, excerpt: str, primary_keyword: str) -> str:
        """Generate a compelling meta description (140-160 characters)."""
        # Extract first compelling sentence from excerpt
        sentences = excerpt.split('. ')
        first_sentence = sentences[0] if sentences else excerpt

        # Truncate to 140-160 characters
        max_length = 155
        description = first_sentence.strip()

        # Ensure primary keyword is included
        if primary_keyword.lower() not in description.lower():
            # Try to insert naturally
            description = f"Master {primary_keyword} with this guide. {description}"

        # Truncate if too long
        if len(description) > max_length:
            description = description[:max_length].rsplit(' ', 1)[0] + "..."

        # Ensure it ends properly
        if not description.endswith('.') and not description.endswith('...'):
            description += "."

        return description

    def process_posts(self, full_content_path: str, existing_keywords_path: str,
                     output_path: str) -> int:
        """Process all blog posts and generate keywords."""
        print("=" * 70)
        print("BLOG KEYWORD GENERATION - RULE-BASED ANALYSIS")
        print("=" * 70)

        # Load existing keyword data
        print(f"\n[1/5] Loading existing keyword data from {existing_keywords_path}...")
        with open(existing_keywords_path, 'r', encoding='utf-8') as f:
            existing_posts = json.load(f)

        keywords_map = {post['slug']: post for post in existing_posts}
        print(f"  Found {len(keywords_map)} posts with existing keywords")

        # Load full content
        print(f"\n[2/5] Loading full content from {full_content_path}...")
        with open(full_content_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        all_posts = data.get('results', data) if isinstance(data, dict) else data
        print(f"  Loaded {len(all_posts)} posts with full content")

        # Process posts missing keywords
        posts_needing_keywords = []
        for item in all_posts:
            post = item.get('output', item) if 'output' in item else item
            title = post.get('title', '')

            # Generate slug from title if not present
            slug = post.get('slug', '')
            if not slug and title:
                slug = self._generate_slug(title)
                post['slug'] = slug

            if slug and slug not in keywords_map:
                posts_needing_keywords.append(post)

        print(f"\n[3/5] Identified {len(posts_needing_keywords)} posts needing keywords")

        # Generate keywords
        print(f"\n[4/5] Generating keywords for {len(posts_needing_keywords)} posts...")
        generated_count = 0

        for idx, post in enumerate(posts_needing_keywords, 1):
            try:
                title = post.get('title', '')
                excerpt = post.get('excerpt', '')
                content = post.get('content', '')
                slug = post.get('slug', '')

                print(f"\n  [{idx}/{len(posts_needing_keywords)}] {title[:60]}...")

                keywords = self.generate_keywords(title, excerpt, content)

                print(f"    Primary: {keywords['primary_keyword']}")
                print(f"    Secondary: {keywords['secondary_keywords'][:60]}...")

                # Add to map
                keywords_map[slug] = {
                    'slug': slug,
                    'primary_keyword': keywords['primary_keyword'],
                    'secondary_keywords': keywords['secondary_keywords'],
                    'meta_description': keywords['meta_description'],
                }
                generated_count += 1

            except Exception as e:
                print(f"    FAILED: {e}")

        # Save results
        print(f"\n[5/5] Saving results to {output_path}...")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(list(keywords_map.values()), f, indent=2, ensure_ascii=False)

        print(f"\n  Generated keywords for {generated_count} posts")
        print(f"  Total posts with keywords: {len(keywords_map)}")
        print(f"\n[OK] Results saved to: {output_path}")

        return generated_count


def main():
    """Main entry point."""
    project_root = Path(__file__).parent.parent.parent
    full_content_path = project_root / "docs" / "blog_posts_full_content.json"
    existing_keywords_path = project_root / "blog_posts_for_database.json"
    output_path = project_root / "blog_posts_for_database_COMPLETE.json"

    generator = RuleBasedKeywordGenerator()

    try:
        generated_count = generator.process_posts(
            str(full_content_path),
            str(existing_keywords_path),
            str(output_path)
        )

        print("\n" + "=" * 70)
        print("SUCCESS! Keywords generated using rule-based analysis.")
        print("=" * 70)
        print(f"\n[OK] {generated_count} posts processed")
        print(f"[OK] Output: {output_path}")
        print("\nNext steps:")
        print("1. Review generated keywords for quality")
        print("2. Run fix_blog_sql.py to merge into SQL file")
        print("3. Import SQL to production database")

    except Exception as e:
        print(f"\n\nFATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
