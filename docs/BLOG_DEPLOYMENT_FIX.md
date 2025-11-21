# Blog 500 Error - Deployment Fix Guide

**Date**: 2025-11-18  
**Issue**: Cloudflare 500 error on `100daysandbeyond.com/blog`  
**Root Causes**: BOM in prestart.sh, SKIP_MIGRATIONS set, missing blog_posts table

---

## Root Causes Identified

### 1. UTF-8 BOM in prestart.sh ✅ FIXED

**Problem**: 
- File had UTF-8 BOM (Byte Order Mark) before `#!/bin/bash`
- Error: `/app/prestart.sh: 1: ﻿#!/bin/bash: not found`
- Bash couldn't execute the script, so migrations never ran

**Fix Applied**:
- ✅ Removed BOM from `prestart.sh` (root)
- ✅ Removed BOM from `backend/prestart.sh`
- ✅ Files now start with clean `#!/bin/bash`

### 2. SKIP_MIGRATIONS Environment Variable ✅ DOCUMENTED

**Problem**:
- `SKIP_MIGRATIONS=true` set in Render environment
- Prevents migrations from running
- Blog posts table never created

**Fix Required**:
- Unset `SKIP_MIGRATIONS` in Render Dashboard
- Or ensure `RENDER_PRESTART_RUN_MIGRATIONS=1` is set (already in render.yaml)

### 3. Missing blog_posts Table ✅ VERIFIED

**Problem**:
- Migration `9913803fac51` exists but never ran
- Table doesn't exist in production database
- API returns 500 errors

**Fix**:
- Run migrations after fixing prestart.sh and SKIP_MIGRATIONS

---

## Files Fixed

1. ✅ `prestart.sh` (root) - BOM removed, file rewritten
2. ✅ `backend/prestart.sh` - BOM removed, file rewritten
3. ✅ `backend/alembic/versions/9913803fac51_add_blog_posts_table_for_marketing_.py` - Verified correct

---

## Deployment Steps

### Step 1: Deploy Fixed prestart.sh

```bash
git add prestart.sh backend/prestart.sh
git commit -m "fix(deploy): remove BOM from prestart.sh scripts"
git push origin main
```

### Step 2: Fix Render Environment Variables

**In Render Dashboard**:

1. Go to: Render Dashboard → `ma-saas-backend` service → Environment
2. **Remove/Unset** `SKIP_MIGRATIONS`:
   - Find `SKIP_MIGRATIONS` in environment variables
   - Click "Remove" or set value to empty
   - **OR** ensure it's not set at all
3. **Verify** `RENDER_PRESTART_RUN_MIGRATIONS`:
   - Should be set to `1` (already in render.yaml startCommand)
   - If not present, add it: `RENDER_PRESTART_RUN_MIGRATIONS=1`
4. **Save** changes
5. **Redeploy** service (or wait for auto-deploy from git push)

### Step 3: Verify Migrations Ran

**Check Render Logs**:

1. Go to: Render Dashboard → `ma-saas-backend` → Logs
2. Look for:
   ```
   ✅ SUCCESS: All migrations applied
   ✅ blog_posts table exists
   ```
3. If you see:
   ```
   ⚠️  WARNING: blog_posts table does not exist!
   ```
   Then migrations didn't run - check SKIP_MIGRATIONS

### Step 4: Test Blog API

```bash
# Should return 200 OK (even if empty list)
curl https://ma-saas-backend.onrender.com/api/blog
```

**Expected**: `[]` or array of blog posts (200 OK)

**If 500 error**: Check Render logs for migration errors

### Step 5: Publish Blog Posts

```bash
# On Render shell
cd /app/backend
python scripts/publish_all_blog_posts.py
```

**Expected Output**:
```
✅ Successfully published 52 blog posts!
📊 Final Status:
   Published: 52
   Unpublished: 0
```

### Step 6: Verify Frontend

1. Visit: `https://ma-saas-platform.onrender.com/blog`
2. Should see all 52 blog posts
3. Visit: `https://100daysandbeyond.com/blog`
4. Should see all 52 blog posts

---

## Troubleshooting

### If prestart.sh Still Fails

1. **Check file encoding**:
   ```bash
   # On Render shell
   file /app/prestart.sh
   head -1 /app/prestart.sh | od -An -tx1
   ```
   Should show: `23 21 2f 62 69 6e 2f 62 61 73 68` (#!/bin/bash in hex, no BOM)

2. **Manually fix BOM**:
   ```bash
   # On Render shell
   sed -i '1s/^\xEF\xBB\xBF//' /app/prestart.sh
   ```

### If Migrations Don't Run

1. **Check environment variables**:
   ```bash
   # On Render shell
   echo "SKIP_MIGRATIONS: $SKIP_MIGRATIONS"
   echo "RENDER_PRESTART_RUN_MIGRATIONS: $RENDER_PRESTART_RUN_MIGRATIONS"
   ```

2. **Manually run migrations**:
   ```bash
   # On Render shell
   cd /app/backend
   alembic upgrade head
   ```

3. **Check migration status**:
   ```bash
   # On Render shell
   cd /app/backend
   alembic current
   alembic heads
   ```

### If blog_posts Table Still Missing

1. **Check if migration exists**:
   ```bash
   # On Render shell
   cd /app/backend
   ls -la alembic/versions/ | grep 9913803fac51
   ```

2. **Manually apply migration**:
   ```bash
   # On Render shell
   cd /app/backend
   alembic upgrade 9913803fac51
   ```

3. **Verify table exists**:
   ```sql
   -- On Render shell, connect to database
   psql $DATABASE_URL -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts');"
   ```

---

## Verification Checklist

After deployment:

- [ ] prestart.sh has no BOM (files rewritten)
- [ ] SKIP_MIGRATIONS unset in Render Dashboard
- [ ] RENDER_PRESTART_RUN_MIGRATIONS=1 set (in render.yaml)
- [ ] Render logs show "✅ SUCCESS: All migrations applied"
- [ ] Render logs show "✅ blog_posts table exists"
- [ ] API endpoint returns 200 OK: `curl https://ma-saas-backend.onrender.com/api/blog`
- [ ] Blog posts published (52 posts)
- [ ] Frontend shows all posts: `https://100daysandbeyond.com/blog`

---

## Expected Log Output

After successful deployment, you should see in Render logs:

```
=========================================
Render Prestart Script
=========================================
Current directory: /app
Python version: Python 3.11.x
Target DB Host: dpg-xxx.frankfurt-postgres.render.com
Navigating to backend directory...
Current migration status:
9913803fac51 (head)
Available migration heads:
9913803fac51 (head)
Applying database migrations...
✅ SUCCESS: All migrations applied
Final migration status:
9913803fac51 (head)
Verifying critical database tables...
✅ blog_posts table exists
✅ users table exists
✅ organizations table exists
✅ deals table exists
=========================================
Prestart complete - ready to start application
=========================================
```

---

## Success Criteria

- [x] BOM removed from prestart.sh files
- [ ] SKIP_MIGRATIONS unset in Render (manual step)
- [ ] Migrations run successfully (verified in logs)
- [ ] blog_posts table exists (verified in logs)
- [ ] Blog API returns 200 OK
- [ ] All 52 posts visible on frontend

---

**Status**: ✅ Code fixes complete. Manual Render environment fix required.

**Next**: Unset SKIP_MIGRATIONS in Render Dashboard and redeploy.

