# Render Database Migration Instructions (DEV-019)

**Status**: ⚠️ MANUAL ACTION REQUIRED - Blog API Fix Pending

## Problem

The blog API is returning 500 errors in production because the `blog_posts` table doesn't exist. The migration merge has been created locally (commit `9c3a9b5`) but needs to be applied to the Render production database.

## Solution: Run Migration Manually via Render Shell

### Option 1: Render Dashboard Shell (RECOMMENDED - 2 minutes)

1. **Go to Render Dashboard**
   - Navigate to: https://dashboard.render.com
   - Sign in with your account

2. **Open Backend Service**
   - Find your backend service: `ma-saas-backend` (or similar name)
   - Click on the service name

3. **Open Shell Access**
   - Click the **"Shell"** tab in the left sidebar
   - Wait for shell to connect (may take 10-30 seconds)

4. **Run Migration Commands**
   Copy and paste these commands one at a time:

   ```bash
   # Navigate to backend directory
   cd backend

   # Check current migration status
   alembic current

   # Show available migration heads
   alembic heads

   # Apply all pending migrations (including merge migration)
   alembic upgrade head

   # Verify migration succeeded
   alembic current
   ```

5. **Verify Blog API**
   - Open a new browser tab
   - Go to: https://ma-saas-backend.onrender.com/api/blog?limit=5
   - Should return JSON array (not "Internal Server Error")

   **OR use curl**:
   ```bash
   curl https://ma-saas-backend.onrender.com/api/blog?limit=5
   ```

   Expected response:
   ```json
   [
     {
       "id": 1,
       "title": "Blog Post Title",
       "slug": "blog-post-title",
       ...
     }
   ]
   ```

---

### Option 2: Update Render Start Command (PERMANENT - 5 minutes)

This ensures migrations run automatically on every deployment.

#### Step 2.1: Update Start Command in Dashboard

1. Go to your backend service in Render Dashboard
2. Click **"Settings"** tab
3. Find **"Start Command"** field
4. Change from:
   ```
   cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

   To:
   ```
   bash ./prestart.sh && cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

5. Click **"Save Changes"**
6. Render will automatically redeploy with the new start command

#### Step 2.2: Monitor Deployment Logs

1. Go to **"Logs"** tab
2. Look for prestart.sh output:
   ```
   =========================================
   Render Prestart Script - Database Migrations
   =========================================
   Applying database migrations...
   ✅ SUCCESS: All migrations applied
   ```

3. Once deployment completes, verify blog API as shown above

---

### Option 3: Use Render Blueprint (render.yaml) - FUTURE DEPLOYMENTS

A `render.yaml` file has been added to the repository (commit `TODO`). To use it:

1. In Render Dashboard, go to **"Blueprints"**
2. Click **"New Blueprint Instance"**
3. Connect to GitHub repository: `dudleypeacockqa/M-S-SaaS-apex-deliver`
4. Select branch: `main`
5. Render will detect `render.yaml` and configure services automatically
6. This will set up automatic migrations on every deployment

**Note**: This will create new service instances. Coordinate with team before using.

---

## What Was Fixed in DEV-019

### Commits

1. **9c3a9b5**: `fix(blog): resolve blog API 500 error with migration merge`
   - Created merge migration `4424a0552789_merge_newsletter_and_blog_migrations.py`
   - Merged two migration branches: newsletter_subscriptions (1e0b14d2c1a3) and blog_posts (9913803fac51)
   - Added 6 comprehensive tests for blog API (all passing locally)

2. **c1e7aa0**: `chore(deploy): add Render prestart script for automatic migrations`
   - Created `prestart.sh` to run migrations before app startup
   - Comprehensive logging for debugging Render deployments

### Migration History

**Before DEV-019**:
```
1e0b14d2c1a3 (head) - newsletter_subscriptions
5c9c13500fb2 (head) - contact_messages
[separate branch] 9913803fac51 - blog_posts  ← MISSING IN PRODUCTION
```

**After DEV-019** (after running migration):
```
4424a0552789 (head, mergepoint) - merge newsletter and blog migrations
├── 1e0b14d2c1a3 - newsletter_subscriptions
└── 5c9c13500fb2 - contact_messages
    └── 9913803fac51 - blog_posts  ← NOW INCLUDED
```

---

## Expected Outcome

After running the migration:

✅ Blog API returns 200 OK with JSON array
✅ Marketing website blog section works
✅ No more 500 errors on /api/blog endpoint
✅ blog_posts table exists in production database
✅ Single migration head (no more branch conflicts)

---

## Troubleshooting

### Issue: "alembic: command not found"

**Solution**: Install alembic in Render shell:
```bash
pip install alembic
```

### Issue: "ERROR [alembic.util.messaging] Can't locate revision identified by '...'  "

**Solution**: The production database is out of sync. Run:
```bash
cd backend
alembic stamp head  # Mark current state
alembic upgrade head  # Apply pending migrations
```

### Issue: Migration succeeds but blog API still returns 500

**Solution**:
1. Check Render logs for errors: Dashboard → Backend Service → Logs
2. Restart the service: Dashboard → Backend Service → Manual Deploy → "Clear build cache & deploy"
3. Verify DATABASE_URL environment variable is set correctly

### Issue: "Multiple heads" error during migration

**Solution**: This is expected before applying the merge migration. The merge migration (`4424a0552789`) resolves this. Just run `alembic upgrade head`.

---

## Files Added in DEV-019

### New Files
- `backend/tests/api/test_blog_api.py` (6 comprehensive tests)
- `backend/alembic/versions/4424a0552789_merge_newsletter_and_blog_migrations.py` (merge migration)
- `prestart.sh` (automatic migration runner for Render)
- `render.yaml` (Infrastructure-as-Code for future deployments)
- `docs/bmad/stories/DEV-019-blog-api-500-fix.md` (story documentation)
- `RENDER_MIGRATION_INSTRUCTIONS.md` (this file)

### Test Results
```bash
$ cd backend && python -m pytest tests/api/test_blog_api.py -v
tests\api\test_blog_api.py::test_list_blog_posts_returns_200 PASSED           [ 16%]
tests\api\test_blog_api.py::test_list_blog_posts_with_data PASSED             [ 33%]
tests\api\test_blog_api.py::test_list_blog_posts_category_filter PASSED       [ 50%]
tests\api\test_blog_api.py::test_list_blog_posts_search PASSED                [ 66%]
tests\api\test_blog_api.py::test_list_blog_posts_pagination PASSED            [ 83%]
tests\api\test_blog_api.py::test_list_blog_posts_published_only PASSED        [100%]

======================== 6 passed, 7 warnings in 1.05s ========================
```

---

## Next Steps After Migration

Once the migration is applied and blog API is working:

1. ✅ Mark DEV-019 as COMPLETE in BMAD tracker
2. ✅ Update BMAD_PROGRESS_TRACKER.md with Phase 1 completion
3. Move to **PHASE 2**: Fix backend test collection error (boto3 S3 issue)
4. Continue with **PHASE 3**: Complete MARK-004 marketing test coverage (57 tests remaining)

---

**Questions?** Contact the dev team or check Render documentation: https://render.com/docs/databases#running-migrations

---

**Last Updated**: 2025-10-30 09:45 UTC
**Status**: ⏳ Awaiting manual migration execution via Render Shell
