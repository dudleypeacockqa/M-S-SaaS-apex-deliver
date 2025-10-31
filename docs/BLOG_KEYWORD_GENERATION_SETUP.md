# Blog Keyword Generation - Quick Setup Guide

**Status**: Script ready, awaiting OpenAI API key to run
**Created**: 2025-10-30

---

## What's Been Built

I've created a complete GPT-4 keyword generation system to generate missing SEO keywords for 47 blog posts:

### Files Created

1. **[backend/scripts/generate_blog_keywords.py](../backend/scripts/generate_blog_keywords.py)** (450 lines)
   - Full-featured Python script for GPT-4 keyword generation
   - Async implementation for efficient API calls
   - Test mode, limit mode, custom output options
   - Comprehensive error handling and validation

2. **[backend/scripts/README_KEYWORD_GENERATION.md](../backend/scripts/README_KEYWORD_GENERATION.md)**
   - Complete usage guide
   - Troubleshooting section
   - Cost estimates
   - Quality review checklist

3. **[backend/scripts/run_keyword_generation.bat](../backend/scripts/run_keyword_generation.bat)**
   - Windows batch file wrapper
   - Interactive API key prompt
   - Easier for non-technical users

---

## What You Need To Do

### Step 1: Get OpenAI API Key (5 minutes)

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

**Cost**: This will cost approximately **$0.50-$1.50** to generate all 47 keywords

### Step 2: Set API Key (1 minute)

Choose ONE method:

**Option A: Environment Variable (Quick)**
```bash
# Windows Command Prompt
set OPENAI_API_KEY=sk-your-actual-api-key-here

# Windows PowerShell
$env:OPENAI_API_KEY="sk-your-actual-api-key-here"

# macOS/Linux
export OPENAI_API_KEY='sk-your-actual-api-key-here'
```

**Option B: .env File (Persistent)**
```bash
# Create backend/.env file
cd backend
echo OPENAI_API_KEY=sk-your-actual-api-key-here > .env
```

**Option C: Interactive Prompt (Easiest)**
```bash
# Use the wrapper script (Windows)
cd backend\scripts
run_keyword_generation.bat --test
# Script will ask for your API key
```

### Step 3: Test the Script (2 minutes)

Run in test mode to validate setup (processes only 3 posts):

```bash
cd backend\scripts
python generate_blog_keywords.py --test
```

**Expected output:**
```
======================================================================
BLOG KEYWORD GENERATION - GPT-4
======================================================================

[1/6] Loading existing keyword data...
  Found 12 posts with existing keywords

[2/6] Loading full content...
  Loaded 50 posts with full content

[3/6] Found 12 slugs from existing data

[4/6] Identified 47 posts needing keywords

  TEST MODE: Processing only 3 sample posts

[5/6] Generating keywords for 3 posts...

  [1/3] DCF Valuation Explained: A Step-by-Step Guide...
    Primary: DCF valuation
    Secondary: discounted cash flow, valuation methods, M&A valuation...

  [2/3] 13-Week Cash Flow Forecasting...
    Primary: cash flow forecasting
    Secondary: 13-week forecast, CFO tools, liquidity planning...

  [3/3] Working Capital Optimization...
    Primary: working capital optimization
    Secondary: cash conversion, working capital management...

[6/6] Generation complete!
  Success: 3
  Failed: 0

Results saved to: blog_keywords_generated.json

======================================================================
SUCCESS! Keywords generated and saved.
======================================================================
```

### Step 4: Review Test Results (3 minutes)

1. Open the generated file:
   ```bash
   code blog_keywords_generated.json
   # or on Windows: notepad blog_keywords_generated.json
   ```

2. Check quality:
   - ✅ Primary keywords are 2-5 words, focused and natural
   - ✅ Secondary keywords are diverse (not all synonyms)
   - ✅ Meta descriptions are 140-160 characters and compelling

3. If quality looks good, proceed to Step 5
4. If quality needs improvement, adjust prompts in script and re-run

### Step 5: Generate All Keywords (5 minutes)

Run full generation for all 47 missing posts:

```bash
cd backend\scripts
python generate_blog_keywords.py
```

**This will:**
- Process 47 blog posts
- Make 47 API calls to GPT-4
- Cost approximately $0.50-$1.50
- Take 2-3 minutes to complete
- Output: `blog_keywords_generated.json` with all 50 posts

### Step 6: Review & Adjust (15 minutes)

1. Open the complete output file
2. Review all generated keywords for quality
3. Manually adjust any that don't meet standards
4. Save the file

### Step 7: Next Steps

After keywords are generated and reviewed, you'll need to:

1. **Merge keywords with SQL file** (see `BLOG_PRODUCTION_IMPORT.md`)
2. **Update SQL INSERT statements** to include `primary_keyword` and `secondary_keywords` columns
3. **Import to production database**
4. **Verify blog posts appear on live site**

---

## Quick Command Reference

```bash
# Install dependencies (if needed)
cd backend
pip install "openai>=1.3.0"

# Test mode (3 posts, ~$0.03)
cd scripts
python generate_blog_keywords.py --test

# Full run (47 posts, ~$1.50)
python generate_blog_keywords.py

# Limited run (10 posts for testing)
python generate_blog_keywords.py --limit 10

# Custom output file
python generate_blog_keywords.py --output custom_keywords.json
```

---

## Troubleshooting

### "openai package not installed"
```bash
cd backend
pip install "openai>=1.3.0"
```

### "OpenAI API key required"
```bash
# Set environment variable
export OPENAI_API_KEY='sk-your-key-here'

# Or create .env file
echo "OPENAI_API_KEY=sk-your-key-here" > backend/.env
```

### "Failed to parse GPT-4 response"
- Check your API key is valid
- Verify you have GPT-4 access (not all accounts do by default)
- Try running with `--test` flag first

### "Rate limit exceeded"
- Script includes 0.5s delay between requests
- If you still hit limits, use `--limit 10` to process in batches

---

## Cost Breakdown

| Mode | Posts | API Calls | Estimated Cost |
|------|-------|-----------|----------------|
| Test | 3 | 3 | $0.03-$0.09 |
| Limit 10 | 10 | 10 | $0.10-$0.30 |
| Full Run | 47 | 47 | **$0.50-$1.50** |

**Note**: Costs are estimates based on standard GPT-4 pricing. Actual cost depends on your OpenAI pricing tier.

---

## What Happens Next

Once you run the script and provide your API key:

1. ✅ Script generates keywords for all 47 posts (2-3 minutes)
2. ✅ You review and adjust keywords (15 minutes)
3. ✅ Keywords are merged into SQL file (10 minutes)
4. ✅ SQL file is imported to production (5 minutes)
5. ✅ Blog goes live with all 50 posts! 🎉

**Total time to deployment**: ~1 hour from now

---

## Alternative Approaches

If you don't want to use GPT-4 or pay for API calls:

### Option B: Manual Keyword Creation
- Time: 8-10 hours
- Cost: $0
- See template in `BLOG_PRODUCTION_IMPORT.md`

### Option C: Deploy with 12 Posts Only
- Time: 30 minutes
- Cost: $0
- Blog goes live immediately with 12 complete posts
- Complete remaining 38 posts later

---

## Files Reference

- **Script**: [backend/scripts/generate_blog_keywords.py](../backend/scripts/generate_blog_keywords.py)
- **Usage Guide**: [backend/scripts/README_KEYWORD_GENERATION.md](../backend/scripts/README_KEYWORD_GENERATION.md)
- **Wrapper (Windows)**: [backend/scripts/run_keyword_generation.bat](../backend/scripts/run_keyword_generation.bat)
- **Import Guide**: [BLOG_PRODUCTION_IMPORT.md](BLOG_PRODUCTION_IMPORT.md)
- **Status Report**: [BLOG_SYSTEM_STATUS.md](BLOG_SYSTEM_STATUS.md)

---

**Ready to proceed?** Follow Step 1 above to get your OpenAI API key and run the test mode!

**Questions or issues?** See the troubleshooting section in [README_KEYWORD_GENERATION.md](../backend/scripts/README_KEYWORD_GENERATION.md)

---

**Last Updated**: 2025-10-30
**Status**: ⏳ Awaiting user to provide OpenAI API key and run script
