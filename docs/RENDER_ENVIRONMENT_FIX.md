# Render Environment Variables Fix Guide

**Date**: 2025-11-18  
**Purpose**: Fix SKIP_MIGRATIONS to allow database migrations to run

---

## Problem

The `SKIP_MIGRATIONS` environment variable is set to `true` in Render, which prevents the prestart script from running database migrations. This causes:

- Blog posts table never created
- API endpoints return 500 errors
- Site breaks with Cloudflare 500 errors

---

## Solution

### Option 1: Remove SKIP_MIGRATIONS (Recommended)

**Steps**:

1. **Go to Render Dashboard**:
   - Navigate to: https://dashboard.render.com
   - Select: `ma-saas-backend` service

2. **Open Environment Tab**:
   - Click on "Environment" in the left sidebar
   - Or go to: Service → Environment

3. **Find SKIP_MIGRATIONS**:
   - Scroll through environment variables
   - Look for: `SKIP_MIGRATIONS`

4. **Remove the Variable**:
   - Click the "X" or "Remove" button next to `SKIP_MIGRATIONS`
   - **OR** set its value to empty string `""`
   - **OR** change value from `true` to `false`

5. **Save Changes**:
   - Click "Save Changes" button
   - Render will automatically redeploy the service

6. **Verify**:
   - Go to "Logs" tab
   - Wait for deployment to complete
   - Look for: `✅ SUCCESS: All migrations applied`
   - Look for: `✅ blog_posts table exists`

### Option 2: Verify RENDER_PRESTART_RUN_MIGRATIONS

**Current Configuration**:

The `render.yaml` file already sets `RENDER_PRESTART_RUN_MIGRATIONS=1` in the startCommand:

```yaml
startCommand: "unset SKIP_MIGRATIONS && RENDER_PRESTART_RUN_MIGRATIONS=1 bash prestart.sh && cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

**This should work**, but if `SKIP_MIGRATIONS=true` is set as an environment variable, it might still interfere.

**Recommended**: Remove `SKIP_MIGRATIONS` entirely (Option 1)

---

## Verification Steps

### 1. Check Environment Variables

**Via Render Dashboard**:
- Go to: Service → Environment
- Verify: `SKIP_MIGRATIONS` is NOT present (or set to empty/false)

**Via Render Shell**:
```bash
# On Render shell
echo "SKIP_MIGRATIONS: ${SKIP_MIGRATIONS:-not set}"
echo "RENDER_PRESTART_RUN_MIGRATIONS: ${RENDER_PRESTART_RUN_MIGRATIONS:-not set}"
```

**Expected**:
```
SKIP_MIGRATIONS: not set
RENDER_PRESTART_RUN_MIGRATIONS: 1
```

### 2. Check Deployment Logs

**After redeploy**, check logs for:

✅ **Success Indicators**:
```
Running database migrations...
Applying migrations...
✅ Migrations applied successfully
✅ blog_posts table exists
```

❌ **Failure Indicators**:
```
SKIP_MIGRATIONS is set - skipping database migrations
⚠️  WARNING: blog_posts table does not exist!
```

### 3. Test API Endpoint

```bash
curl https://ma-saas-backend.onrender.com/api/blog
```

**Expected**: `[]` or array of blog posts (200 OK)  
**If 500**: Migrations didn't run - check logs

### 4. Verify Database Table

**Via Render Shell**:
```bash
# On Render shell
cd /app/backend
python3 <<'PY'
import os
from sqlalchemy import create_engine, text

db_url = os.environ.get("DATABASE_URL")
engine = create_engine(db_url)
with engine.connect() as conn:
    result = conn.execute(text(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts')"
    ))
    exists = result.scalar()
    print(f"blog_posts table exists: {exists}")
PY
```

**Expected**: `blog_posts table exists: True`

---

## Alternative: Manual Migration

If environment variable fix doesn't work, run migrations manually:

```bash
# On Render shell
cd /app/backend
alembic upgrade head
```

**Expected Output**:
```
INFO  [alembic.runtime.migration] Running upgrade 1038e72b10f1 -> 9913803fac51, add blog_posts table for marketing content
```

---

## Troubleshooting

### Issue: SKIP_MIGRATIONS Still Set

**Check**:
1. Render Dashboard → Environment → Look for `SKIP_MIGRATIONS`
2. If present, remove it
3. Save and redeploy

### Issue: Migrations Still Don't Run

**Check**:
1. Render logs for prestart script execution
2. Verify `RENDER_PRESTART_RUN_MIGRATIONS=1` in startCommand
3. Check if prestart.sh has BOM (should be fixed now)

### Issue: blog_posts Table Still Missing

**Check**:
1. Run: `alembic current` - should show `9913803fac51`
2. If not, run: `alembic upgrade head`
3. Verify table: `SELECT * FROM blog_posts LIMIT 1;`

---

## Quick Reference

### Render Dashboard Path
```
Dashboard → ma-saas-backend → Environment → [Remove SKIP_MIGRATIONS]
```

### Verification Commands
```bash
# Check environment
echo $SKIP_MIGRATIONS

# Check migrations
cd /app/backend && alembic current

# Check table
psql $DATABASE_URL -c "\d blog_posts"
```

---

**Status**: ✅ Documentation complete. Manual Render Dashboard fix required.

**Action Required**: Remove `SKIP_MIGRATIONS` from Render environment variables.

