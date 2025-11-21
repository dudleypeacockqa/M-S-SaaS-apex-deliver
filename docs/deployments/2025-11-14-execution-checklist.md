# Migration Fix Execution Checklist

**Date**: 2025-11-14  
**Migration**: 774225e563ca  
**Commit**: 49ad77e...  
**Status**: Ready for execution

## Pre-Deployment Verification ✅

- [x] Migration guards implemented for all admin tables (11 tables)
- [x] Migration guards implemented for `deal_matches` table
- [x] Migration guards implemented for `document_templates.variables` column
- [x] Migration guards implemented for `document_templates.version` column
- [x] Both `upgrade()` and `downgrade()` functions protected
- [x] Documentation updated
- [x] Smoke test template created

## Execution Steps

### Step 1: Verify Current Commit
```bash
git log --oneline -1
# Should show: 49ad77e... (or later commit with migration fixes)
```

### Step 2: Trigger Render Deployment

**Option A: Via Render Dashboard (Recommended)**
1. Go to https://dashboard.render.com
2. Navigate to `ma-saas-backend` service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Monitor deployment logs

**Option B: Via API Script**
```bash
# Set API key from .env or environment
export RENDER_API_KEY=$(grep RENDER_API_KEY .env | cut -d '=' -f2)

# Trigger deployment
python trigger_render_deploy.py

# Check status
python check_render_status.py
```

**Option C: Via Render Shell (Manual Migration)**
1. Go to Render Dashboard → `ma-saas-backend` → **"Shell"**
2. Run:
```bash
cd backend
alembic upgrade head
```
3. Check for "upgrade ... complete" message

### Step 3: Monitor Migration Logs

Watch for these indicators in Render logs:

**✅ Success Indicators:**
```
INFO  [alembic.runtime.migration] Running upgrade b354d12d1e7d -> 774225e563ca
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
[No ProgrammingError exceptions]
INFO  [alembic.runtime.migration] Running upgrade ... complete
```

**❌ Failure Indicators:**
```
psycopg2.errors.UndefinedTable: relation "..." does not exist
psycopg2.errors.UndefinedColumn: column "..." does not exist
ProgrammingError: ...
```

### Step 4: Verify Migration Completion

**Check Health Endpoint:**
```bash
curl https://ma-saas-backend.onrender.com/health
# Expected: {"status":"healthy",...}
```

**Check Migration Status (via Shell):**
```bash
cd backend
alembic current
# Should show: 774225e563ca (head)
```

### Step 5: Run Smoke Tests

Execute smoke tests from `docs/tests/2025-11-14-render-smoke.txt`:

1. Health Check: `GET /health`
2. API Root: `GET /api`
3. Authentication: `GET /api/auth/me`
4. Deals List: `GET /api/deals`
5. Documents List: `GET /api/deals/{deal_id}/documents`
6. Valuations List: `GET /api/deals/{deal_id}/valuations`
7. Tasks List: `GET /api/deals/{deal_id}/tasks`
8. Financial Connections: `GET /api/financial/connections`
9. Document Templates: `GET /api/document-templates`
10. Frontend Load: https://ma-saas-platform.onrender.com

### Step 6: Update Documentation

Once deployment succeeds:

1. **Update Deployment Log:**
   - File: `docs/deployments/2025-11-14-backend-redeploy.txt`
   - Add success entry with:
     - Deploy ID
     - Commit hash
     - Migration completion timestamp
     - Smoke test results

2. **Update Status Report:**
   - File: `docs/bmad/COMPREHENSIVE-STATUS-REPORT-2025-11-14.md`
   - Change "Render Deployment Stability" status from "Pending redeploy verification" to "✅ RESOLVED"

3. **Update Smoke Test Results:**
   - File: `docs/tests/2025-11-14-render-smoke.txt`
   - Fill in all test results
   - Add execution timestamp

## Troubleshooting

### If Migration Still Fails

1. **Check Logs for Specific Error:**
   - Identify which table/column is causing the issue
   - Verify guard is in place for that resource

2. **Verify Guard Implementation:**
   ```bash
   grep -n "_table_exists\|_column_exists" backend/alembic/versions/774225e563ca*.py
   # Should show 33+ matches
   ```

3. **Manual Skip (Last Resort):**
   ```bash
   # In Render Shell
   cd backend
   alembic stamp 774225e563ca
   # This marks migration as complete without running it
   ```

### If Deployment Hangs

1. Check Render service status
2. Review resource limits (memory/CPU)
3. Check database connection
4. Review prestart script logs

## Success Criteria

- [ ] Migration completes without errors
- [ ] Health endpoint returns 200 OK
- [ ] All 10 smoke tests pass
- [ ] No `ProgrammingError` exceptions in logs
- [ ] Documentation updated with success confirmation

## Notes

- Migration guards allow graceful skipping of missing tables/columns
- Production environment may not have all tables (Admin, Deal Matching, etc.)
- This is expected behavior - guards ensure migration completes regardless
- Development/staging environments will run full migration

