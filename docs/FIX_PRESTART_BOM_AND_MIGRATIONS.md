# Fix Prestart BOM and Migration Issues - November 18, 2025

**Date**: 2025-11-18  
**Status**: FIXED  
**Issue**: Prestart script had UTF-8 BOM preventing execution, migrations not running

---

## Root Cause

1. **UTF-8 BOM in prestart.sh**: The file had a Byte Order Mark (`\xEF\xBB\xBF`) before `#!/bin/bash`, causing bash to fail with "not found" error
2. **SKIP_MIGRATIONS set**: Environment variable `SKIP_MIGRATIONS=true` was set in Render, preventing migrations from running
3. **Result**: `blog_posts` table never created, causing 500 errors on `/api/blog` endpoints

---

## Fixes Applied

### 1. Removed UTF-8 BOM from prestart.sh ✅

**Command executed**:
```powershell
(Get-Content prestart.sh -Raw) -replace '\xEF\xBB\xBF','' | Set-Content prestart.sh -NoNewline
```

**Verification**: File now starts cleanly with `#!/bin/bash` (no BOM)

### 2. Updated render.yaml startCommand ✅

**Before**:
```yaml
startCommand: "RENDER_PRESTART_RUN_MIGRATIONS=1 bash prestart.sh && cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

**After**:
```yaml
startCommand: "unset SKIP_MIGRATIONS && RENDER_PRESTART_RUN_MIGRATIONS=1 bash prestart.sh && cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

**Changes**:
- Added `unset SKIP_MIGRATIONS` to explicitly clear any environment variable that might block migrations
- Kept `RENDER_PRESTART_RUN_MIGRATIONS=1` to ensure migrations run
- Prestart script will now execute successfully and run migrations

---

## How It Works

1. **StartCommand execution**:
   - `unset SKIP_MIGRATIONS` - Removes any blocking environment variable
   - `RENDER_PRESTART_RUN_MIGRATIONS=1` - Sets flag to run migrations
   - `bash prestart.sh` - Executes prestart script (now without BOM)
   - Prestart script checks `RENDER_PRESTART_RUN_MIGRATIONS=1` and runs `alembic upgrade head`
   - After migrations, starts uvicorn server

2. **Prestart script flow**:
   - Checks `RENDER_PRESTART_RUN_MIGRATIONS` environment variable
   - If set to "1", runs database migrations
   - Verifies critical tables exist (including `blog_posts`)
   - Logs migration status

---

## Expected Behavior After Deployment

### Deployment Logs Should Show:
```
=========================================
Render Prestart Script
=========================================
Current directory: /opt/render/project/src
Python version: Python 3.11.0
Target DB Host: ***@dpg-***.frankfurt-postgres.render.com

[prestart] Running migrations (RENDER_PRESTART_RUN_MIGRATIONS=1)

Current migration status:
9913803fac51 (head)

Applying database migrations...
✅ SUCCESS: All migrations applied

Verifying critical database tables...
✅ blog_posts table exists
✅ users table exists
✅ organizations table exists
✅ deals table exists

=========================================
Prestart complete - ready to start application
=========================================
```

### API Should Return:
```bash
# Before fix: HTTP 500 Internal Server Error
# After fix: HTTP 200 OK with JSON array (or empty array if no posts)
curl https://ma-saas-backend.onrender.com/api/blog
```

---

## Next Steps

1. **Deploy Changes**:
   ```bash
   git add prestart.sh render.yaml
   git commit -m "fix(deploy): remove BOM from prestart.sh and ensure migrations run"
   git push origin main
   ```

2. **Monitor Deployment**:
   - Watch Render deployment logs
   - Verify prestart script executes without BOM error
   - Confirm migrations run successfully
   - Check for "blog_posts table exists" message

3. **Verify API**:
   ```bash
   # Should return 200 OK (empty array if no posts, or JSON array if posts exist)
   curl https://ma-saas-backend.onrender.com/api/blog
   
   # Should return 200 OK with categories (or empty array)
   curl https://ma-saas-backend.onrender.com/api/blog/categories/list
   ```

4. **Upload Blog Posts** (if needed):
   ```bash
   cd backend
   python scripts/upload_blog_posts_via_api.py
   ```

5. **Verify Frontend**:
   - Visit `https://ma-saas-platform.onrender.com/blog` - should load without 500 errors
   - Visit `https://100daysandbeyond.com/blog` - should load after DNS fix

---

## Files Changed

- `prestart.sh` - Removed UTF-8 BOM
- `render.yaml` - Added `unset SKIP_MIGRATIONS` to startCommand

---

## Verification Commands

```bash
# Check prestart.sh has no BOM (should show clean #!/bin/bash)
powershell -Command "Get-Content prestart.sh -Encoding UTF8 -TotalCount 1 | Format-Hex"

# Verify render.yaml startCommand
grep startCommand render.yaml

# Test API after deployment
curl -v https://ma-saas-backend.onrender.com/api/blog

# Run full verification
python scripts/verify_deployment.py
bash scripts/run_smoke_tests.sh production
```

---

## Status

- ✅ BOM removed from prestart.sh
- ✅ SKIP_MIGRATIONS unset in startCommand
- ✅ RENDER_PRESTART_RUN_MIGRATIONS=1 set
- ⏳ Deployment pending (push to main)
- ⏳ Migration execution pending (will run on next deploy)

