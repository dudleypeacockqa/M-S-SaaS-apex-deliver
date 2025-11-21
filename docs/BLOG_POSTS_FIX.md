# Blog Posts Visibility Fix

**Date**: 2025-11-18  
**Issue**: 52 blog posts uploaded but not visible on `/blog` page  
**Root Cause**: Blog posts uploaded with `published=False` by default

---

## Problem

The blog listing page shows "Unable to load blog posts" because:

1. **Default Value**: Blog posts have `published=False` by default (model definition)
2. **API Filter**: The `/api/blog` endpoint filters by `published_only=True` by default
3. **Upload Script**: The upload script defaults to `published=False` if not specified in JSON

Result: All 52 blog posts exist in the database but are marked as unpublished, so they don't appear in the listing.

---

## Solution

### Option 1: Publish All Existing Posts (Immediate Fix)

Run the publish script to mark all existing posts as published:

```bash
# On Render (via shell)
cd /app/backend
python scripts/publish_all_blog_posts.py
```

Or via Python:
```bash
python backend/scripts/publish_all_blog_posts.py
```

This script will:
- Find all posts with `published=False`
- Set `published=True`
- Set `published_at=now()` for posts without a published_at date
- Show summary of published/unpublished counts

### Option 2: Update Upload Script (Future Uploads)

The upload script has been updated to default to `published=True` for future uploads.

**Changes Made**:
- `backend/scripts/upload_blog_posts_via_api.py`:
  - Changed `"published": post_data.get('published', False)` → `"published": post_data.get('published', True)`
  - Changed `published_at` to default to current time if not provided

---

## Verification

After running the publish script, verify:

1. **API Endpoint**: `GET /api/blog` should return all 52 posts
2. **Frontend**: `/blog` page should display all posts
3. **Database**: Check `SELECT COUNT(*) FROM blog_posts WHERE published = true;` should return 52

---

## Files Modified

1. ✅ `backend/scripts/publish_all_blog_posts.py` - New script to publish all posts
2. ✅ `backend/scripts/upload_blog_posts_via_api.py` - Updated to default `published=True`

---

## Deployment Steps

1. **Deploy Script** (if not already in repo):
   ```bash
   git add backend/scripts/publish_all_blog_posts.py
   git commit -m "fix(blog): add script to publish all blog posts"
   git push origin main
   ```

2. **Run Script on Render**:
   - Via Render Shell:
     ```bash
     cd /app/backend
     python scripts/publish_all_blog_posts.py
     ```
   - Or via Render API/CLI

3. **Verify**:
   - Visit `https://100daysandbeyond.com/blog`
   - Should see all 52 blog posts displayed

---

## Expected Result

✅ All 52 blog posts visible on `/blog` page  
✅ Blog listing shows posts in all categories  
✅ Individual blog post pages accessible  
✅ 100% project completion achieved

---

**Status**: Ready for deployment

