# Blog SEO Keyword Generation Script

## Purpose

This script generates missing SEO keywords for 47 blog posts using OpenAI GPT-4, enabling full 50-post production deployment.

## Current Status

- **Total blog posts**: 50
- **Posts with complete keyword data**: 12
- **Posts missing keyword data**: 47 (need `primary_keyword` and `secondary_keywords`)

## Prerequisites

### 1. OpenAI API Key

You need an OpenAI API key with access to GPT-4.

**Get your API key**:
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

**Set your API key** (choose one method):

**Option A: Environment Variable (Recommended)**
```bash
# Windows (Command Prompt)
set OPENAI_API_KEY=sk-your-api-key-here

# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-your-api-key-here"

# macOS/Linux
export OPENAI_API_KEY='sk-your-api-key-here'
```

**Option B: .env File**
```bash
# Create backend/.env file
cd backend
echo "OPENAI_API_KEY=sk-your-api-key-here" > .env
```

**Option C: Interactive Prompt**
```bash
# Use the batch file wrapper (Windows)
cd backend/scripts
run_keyword_generation.bat --test
# Script will prompt for API key if not found
```

### 2. Python Dependencies

Install required packages:
```bash
cd backend
pip install -r requirements.txt
# or specifically:
pip install "openai>=1.3.0"
```

## Usage

### Test Mode (Recommended First)

Generate keywords for only 3 sample posts to validate setup:

**Windows:**
```bash
cd backend\scripts
python generate_blog_keywords.py --test
```

**macOS/Linux:**
```bash
cd backend/scripts
python3 generate_blog_keywords.py --test
```

**Expected output:**
```
======================================================================
BLOG KEYWORD GENERATION - GPT-4
======================================================================

[1/6] Loading existing keyword data from blog_posts_for_database.json...
  Found 12 posts with existing keywords

[2/6] Loading full content from docs/blog_posts_full_content.json...
  Loaded 50 posts with full content

[3/6] Found 12 slugs from existing data

[4/6] Identified 47 posts needing keywords

  TEST MODE: Processing only 3 sample posts

[5/6] Generating keywords for 3 posts...

  [1/3] DCF Valuation Explained: A Step-by-Step Guide for Dealmak...
    Primary: DCF valuation
    Secondary: discounted cash flow, valuation methods, M&A valuation...

  [2/3] 13-Week Cash Flow Forecasting: The CFO's Secret Weapon...
    Primary: cash flow forecasting
    Secondary: 13-week forecast, CFO tools, liquidity management...

  [3/3] Working Capital Optimization: Unlocking Hidden Cash...
    Primary: working capital optimization
    Secondary: cash conversion, working capital management...

[6/6] Generation complete!
  Success: 3
  Failed: 0
  Total posts with keywords: 15

Results saved to: blog_keywords_generated.json

======================================================================
SUCCESS! Keywords generated and saved.
======================================================================
```

### Full Production Run

Generate keywords for all 47 missing posts:

```bash
cd backend/scripts
python generate_blog_keywords.py
```

**Estimated**:
- **Time**: 2-3 minutes (with API delays)
- **Cost**: $0.50-$1.50 (47 × ~$0.01-$0.03 per GPT-4 call)
- **Output**: `blog_keywords_generated.json` with all 50 posts

### Advanced Options

**Limit to specific number of posts:**
```bash
python generate_blog_keywords.py --limit 10
```

**Custom output file:**
```bash
python generate_blog_keywords.py --output my_keywords.json
```

## Output Format

The script generates a JSON file with this structure:

```json
[
  {
    "slug": "dcf-valuation-explained-a-step-by-step-guide-for-dealmakers",
    "primary_keyword": "DCF valuation",
    "secondary_keywords": "discounted cash flow, valuation methods, M&A valuation, financial modeling",
    "meta_description": "Master DCF valuation with this step-by-step guide. Learn how to build discounted cash flow models for M&A deals and make confident investment decisions."
  },
  {
    "slug": "13-week-cash-flow-forecasting-the-cfos-secret-weapon",
    "primary_keyword": "cash flow forecasting",
    "secondary_keywords": "13-week forecast, CFO tools, liquidity management, cash flow planning",
    "meta_description": "Discover why CFOs rely on 13-week cash flow forecasts for liquidity management. This guide covers methodology, best practices, and common pitfalls."
  }
]
```

## Quality Review

After generation, review the output file for:

1. **Primary Keyword Quality**
   - ✅ 2-5 words, focused and natural
   - ✅ High search intent, relevant to target audience
   - ❌ Not keyword-stuffed or overly broad

2. **Secondary Keywords Quality**
   - ✅ 4-5 related terms
   - ✅ Mix of exact match and related phrases
   - ✅ Diverse (not all synonyms)
   - ❌ Not repetitive

3. **Meta Description Quality**
   - ✅ 140-160 characters
   - ✅ Includes primary keyword naturally
   - ✅ Compelling and action-oriented
   - ❌ Not truncated or too short

## Examples of Good vs Bad Keywords

### Good Example ✅
```json
{
  "slug": "the-art-of-deal-sourcing",
  "primary_keyword": "deal sourcing strategies",
  "secondary_keywords": "M&A pipeline, proprietary deals, deal origination, investment sourcing",
  "meta_description": "Master the art of deal sourcing with proven strategies for building a proprietary M&A pipeline. Learn how top dealmakers find hidden opportunities."
}
```

**Why it's good:**
- Primary keyword is specific and searchable
- Secondary keywords are diverse and relevant
- Meta description is compelling and includes primary keyword

### Bad Example ❌
```json
{
  "slug": "the-art-of-deal-sourcing",
  "primary_keyword": "deal sourcing",
  "secondary_keywords": "deal source, sourcing deals, deals sourcing, source deals",
  "meta_description": "Deal sourcing article"
}
```

**Why it's bad:**
- Primary keyword too generic (missing "strategies")
- Secondary keywords are all synonyms (not diverse)
- Meta description too short and not compelling

## Troubleshooting

### Error: "openai package not installed"

**Solution:**
```bash
cd backend
pip install "openai>=1.3.0"
```

### Error: "OpenAI API key required"

**Solution:**
```bash
# Set environment variable
export OPENAI_API_KEY='sk-your-key-here'

# Or create .env file
echo "OPENAI_API_KEY=sk-your-key-here" > backend/.env
```

### Error: "Failed to parse GPT-4 response as JSON"

**Cause**: GPT-4 sometimes returns markdown-formatted JSON

**Solution**: Script already handles this automatically. If you still see this error:
1. Check your API key is valid
2. Try running with `--test` flag first
3. Check your OpenAI account has GPT-4 access

### Error: "Rate limit exceeded"

**Cause**: Too many API requests in short time

**Solution**: Script includes 0.5s delay between requests. If you still hit limits:
```bash
# Process in smaller batches
python generate_blog_keywords.py --limit 10
# Wait a few minutes, then run again with different slugs
```

### Warning: "Missing required keys in GPT-4 response"

**Cause**: GPT-4 response missing `primary_keyword`, `secondary_keywords`, or `meta_description`

**Solution**: Script will report the error and skip that post. You can:
1. Review the failed post slug
2. Manually add keywords for that post
3. Or re-run the script (it will retry failed posts)

## Next Steps After Generation

1. **Review Output** (15-30 min)
   ```bash
   # Open and review generated keywords
   code ../blog_keywords_generated.json
   ```

2. **Merge with SQL** (10 min)
   - Use the generated keywords to update `docs/blog_import.sql`
   - Add `primary_keyword` and `secondary_keywords` columns to INSERT statements
   - See `docs/BLOG_PRODUCTION_IMPORT.md` for detailed instructions

3. **Import to Production** (5 min)
   - Connect to Render PostgreSQL
   - Run updated SQL import file
   - Verify blog posts appear on production site

## Cost Estimate

### Test Mode (3 posts)
- **API calls**: 3 × GPT-4
- **Cost**: ~$0.03-$0.09 (negligible)

### Full Run (47 posts)
- **API calls**: 47 × GPT-4
- **Estimated tokens per request**: ~1,500 input + 200 output
- **Cost per request**: ~$0.01-$0.03
- **Total cost**: **$0.50-$1.50**

**Note**: Actual cost depends on your OpenAI pricing tier. These estimates use standard GPT-4 pricing as of October 2024.

## File Locations

- **Script**: `backend/scripts/generate_blog_keywords.py`
- **Input (existing keywords)**: `blog_posts_for_database.json` (12 posts)
- **Input (full content)**: `docs/blog_posts_full_content.json` (50 posts)
- **Output**: `blog_keywords_generated.json` (default)
- **SQL file to update**: `docs/blog_import.sql`

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review script output for specific error messages
3. Verify API key is valid and has GPT-4 access
4. Check OpenAI status page: https://status.openai.com

## Alternative Approaches

If you prefer not to use GPT-4:

### Manual Keyword Creation
See `docs/BLOG_PRODUCTION_IMPORT.md` Option C for template

### Alternative AI Services
- Anthropic Claude 3 (similar API pattern)
- Google Gemini Pro
- Manual keyword research tools (Ahrefs, SEMrush)

---

**Created**: 2025-10-30
**Last Updated**: 2025-10-30
**Version**: 1.0
