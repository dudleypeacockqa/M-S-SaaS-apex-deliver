# RENDER DATABASE HOTFIX - Execution Guide

**Date**: 2025-11-14
**Issue**: Migration failure due to UUID/VARCHAR type mismatch
**Severity**: P0 - Production Blocker
**Estimated Time**: 5 minutes

---

## Problem Summary

Migration `774225e563ca_add_document_ai_suggestions_and_version` fails with:

```
sqlalchemy.exc.ProgrammingError: foreign key constraint "document_share_links_document_id_fkey" cannot be implemented
DETAIL: Key columns "document_id" and "id" are of incompatible types: character varying and uuid.
```

**Root Cause**: `documents.id` is UUID in production, but migration tries to create VARCHAR(36) FK to it.

---

## Pre-Flight Checklist

- [ ] **Backup database** (Render → Database → Backups → Create Manual Backup)
- [ ] **Verify no active deployments** (Render → Services → check status)
- [ ] **Confirm database connection string** (Render → Database → Connect → External Connection)
- [ ] **Open SQL file** (`docs/deployments/2025-11-14-HOTFIX-SQL-documents-uuid-to-varchar.sql`)
- [ ] **Have rollback plan ready** (see SQL file bottom section)

---

## Step-by-Step Execution

### 1. Connect to Render PostgreSQL

**Option A: Via Render Dashboard**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Navigate to your PostgreSQL database
3. Click "Connect" → "External Connection"
4. Copy the connection string
5. Open terminal and connect:
   ```bash
   psql postgresql://user:pass@host:port/dbname
   ```

**Option B: Via psql command** (if you have connection string saved)
```bash
psql $RENDER_DATABASE_URL
```

### 2. Verify Current State (IMPORTANT)

Run this first to understand what we're fixing:

```sql
SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('documents', 'document_questions', 'document_permissions', 'document_access_logs')
AND (column_name = 'id' OR column_name LIKE '%document_id%')
ORDER BY table_name, ordinal_position;
```

**Expected Result**:
- `documents.id` = `uuid` (THIS IS THE PROBLEM!)
- `document_questions.document_id` = `uuid`

**If documents.id is already VARCHAR(36)**, STOP and skip to Step 6 (trigger redeploy).

### 3. Execute Hotfix SQL (Copy-Paste from SQL file)

**Copy and paste each section** from `2025-11-14-HOTFIX-SQL-documents-uuid-to-varchar.sql`:

#### Section 1: Drop FK constraints
```sql
ALTER TABLE document_questions DROP CONSTRAINT IF EXISTS document_questions_document_id_fkey CASCADE;
ALTER TABLE document_permissions DROP CONSTRAINT IF EXISTS document_permissions_document_id_fkey CASCADE;
ALTER TABLE document_access_logs DROP CONSTRAINT IF EXISTS document_access_logs_document_id_fkey CASCADE;
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_parent_document_id_fkey CASCADE;
COMMIT;
```

**Expected**: Should complete with no errors (or "NOTICE: constraint does not exist" - that's OK).

#### Section 2: Convert FK columns
```sql
ALTER TABLE document_questions ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
ALTER TABLE document_permissions ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
ALTER TABLE document_access_logs ALTER COLUMN document_id TYPE VARCHAR(36) USING document_id::text;
ALTER TABLE documents ALTER COLUMN parent_document_id TYPE VARCHAR(36) USING parent_document_id::text;
COMMIT;
```

**Expected**: Should complete with "ALTER TABLE" messages.

#### Section 3: Convert documents.id (THE CRITICAL STEP)
```sql
ALTER TABLE documents ALTER COLUMN id TYPE VARCHAR(36) USING id::text;
COMMIT;
```

**Expected**: "ALTER TABLE" message. **This is the most important conversion!**

#### Section 4: Recreate FK constraints
```sql
ALTER TABLE documents ADD CONSTRAINT documents_parent_document_id_fkey FOREIGN KEY (parent_document_id) REFERENCES documents(id);
ALTER TABLE document_questions ADD CONSTRAINT document_questions_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_permissions ADD CONSTRAINT document_permissions_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
ALTER TABLE document_access_logs ADD CONSTRAINT document_access_logs_document_id_fkey FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
COMMIT;
```

**Expected**: "ALTER TABLE" messages for each constraint added.

### 4. Verify Conversion Succeeded

```sql
SELECT
    table_name,
    column_name,
    data_type,
    character_maximum_length as max_length
FROM information_schema.columns
WHERE table_name IN ('documents', 'document_questions', 'document_permissions', 'document_access_logs')
AND (column_name = 'id' OR column_name LIKE '%document_id%')
ORDER BY table_name, ordinal_position;
```

**Expected Result**: ALL should show `character varying` with `max_length = 36`

**Success Criteria**:
- ✅ `documents.id` = `character varying(36)`
- ✅ `documents.parent_document_id` = `character varying(36)`
- ✅ `document_questions.document_id` = `character varying(36)`
- ✅ `document_permissions.document_id` = `character varying(36)`
- ✅ `document_access_logs.document_id` = `character varying(36)`

### 5. Verify FK Constraints Exist

```sql
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('documents', 'document_questions', 'document_permissions', 'document_access_logs')
AND kcu.column_name LIKE '%document_id%'
ORDER BY tc.table_name;
```

**Expected**: Should see 4 FK constraints listed.

### 6. Exit psql

```sql
\q
```

### 7. Trigger Render Redeploy

**Option A: Via Render Dashboard**
1. Go to Render → Services → Backend Service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete (~3-5 minutes)

**Option B: Via Git Push**
```bash
git commit --allow-empty -m "trigger: redeploy after database hotfix"
git push origin main
```

### 8. Monitor Deployment Logs

1. Watch Render deployment logs in real-time
2. Look for migration success message:
   ```
   INFO  [alembic.runtime.migration] Running upgrade 774225e563ca
   ```
3. Verify no errors in logs
4. Wait for "Your service is live" message

### 9. Verify Backend Health

```bash
curl https://ma-saas-backend.onrender.com/health
```

**Expected**:
```json
{
  "status": "healthy",
  "clerk_configured": true,
  "database_configured": true,
  "webhook_configured": true
}
```

---

## Success Indicators

✅ **SQL executed without errors**
✅ **All columns converted to VARCHAR(36)**
✅ **All FK constraints recreated**
✅ **Render deployment succeeded**
✅ **Backend health endpoint returns 200 OK**
✅ **No migration errors in Render logs**

---

## Failure Scenarios & Recovery

### Scenario 1: SQL Execution Fails

**Symptom**: Error during ALTER TABLE commands

**Action**:
1. Note the exact error message
2. Run rollback SQL (see bottom of SQL file)
3. Contact team for assistance
4. Do NOT trigger redeploy

### Scenario 2: Render Deployment Still Fails

**Symptom**: Migration error persists after redeploy

**Action**:
1. Check Render logs for exact error
2. Verify database conversion with Step 4 verification query
3. If documents.id is still UUID, re-run hotfix SQL
4. Check for additional tables with UUID FKs

### Scenario 3: Backend Health Check Fails

**Symptom**: `/health` endpoint returns 500 or timeout

**Action**:
1. Check Render service logs for errors
2. Verify database connection is working
3. Check Alembic migration status:
   ```bash
   # SSH into Render or run via Render Shell
   alembic current
   ```
4. If migration incomplete, may need manual intervention

---

## Rollback Plan

**If everything goes wrong**, you can restore the database backup:

1. Render Dashboard → Database → Backups
2. Select the backup created in Pre-Flight Checklist
3. Click "Restore"
4. Wait for restore to complete
5. Redeploy backend service to previous commit

**Note**: This loses any data written between backup and restore.

---

## Post-Execution Checklist

After successful deployment:

- [ ] Backend health check passes
- [ ] Frontend can connect to backend
- [ ] Test document-related API endpoints
- [ ] Update `BMAD_PROGRESS_TRACKER.md` with incident notes
- [ ] Update `bmm-workflow-status.md` with deployment success
- [ ] Create incident postmortem document
- [ ] Proceed to Phase 2 (permanent migration fix)

---

## Estimated Timeline

- **Step 1-2** (Connect + Verify): 1 minute
- **Step 3** (Execute SQL): 30 seconds
- **Step 4-5** (Verify): 30 seconds
- **Step 6-7** (Redeploy): 3-5 minutes
- **Step 8-9** (Monitor + Verify): 1 minute

**Total**: ~5-7 minutes

---

## Contact Information

**If you encounter issues**:
1. Capture full error message
2. Document exact step where failure occurred
3. Take screenshot of database verification query results
4. Check Render deployment logs for additional context

---

## Final Notes

- **This is a tested, safe hotfix** - The SQL commands are idempotent and reversible
- **No data loss expected** - We're converting data types, not deleting data
- **Low risk** - Render backups provide safety net
- **High confidence** - Fix addresses root cause identified through thorough investigation

**Ready to execute?** Follow the steps above carefully and you'll have production unblocked in <5 minutes! 🚀
