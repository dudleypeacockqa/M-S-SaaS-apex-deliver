# Database Recovery Procedure - Complete Action Plan

**Date**: 2025-11-10
**Status**: BLOCKED - Requires Manual Intervention
**Current State**: Production database schema mismatch with application code

---

## Executive Summary

The production database (`ma_saas_platform`) is in an inconsistent state:

- **alembic_version**: Manually set to `dc2c0f69c1b1` WITHOUT running migrations
- **Schema State**: 165 tables exist from partial migration history
- **Type Mismatch**: `users.id` and `organizations.id` are UUID but code expects VARCHAR(36)
- **Missing Tables**: `folders`, `pipeline_templates`, `pipeline_template_stages`, `rbac_audit_logs`

**Blocker**: Cannot run `alembic upgrade head` because database thinks it's already at head, but actual schema doesn't match.

---

## Phase 1: Identify Actual Schema State (SAFE - READ-ONLY)

### Goal
Determine which migration the 165 existing tables actually correspond to.

### Steps

1. **Get list of all tables in production**:
```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

2. **Compare against migration history**:
```bash
cd backend
alembic history --verbose
```

3. **Check for key indicator tables**:
```sql
-- Check which features exist
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'folders');
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pipeline_templates');
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rbac_audit_logs');
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deals');
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents');
```

4. **Identify the true migration version**:
Based on table analysis, likely between:
- `58ea862c1242` (if basic deal/org tables exist)
- `c3a7b4bbf913` (if rbac features missing)

**Action Required**: Someone with database access must run these queries and report results.

---

## Phase 2: Database Type Conversion (REQUIRES DB ADMIN ACCESS)

### Goal
Convert `users.id` and `organizations.id` from UUID to VARCHAR(36) to match application code.

### WARNING
This is a **DESTRUCTIVE OPERATION** that affects the entire database. MUST have backup before proceeding.

### Prerequisites
```bash
# 1. Create full database backup
pg_dump $DATABASE_URL > ma_saas_platform_backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Verify backup
psql $DATABASE_URL < ma_saas_platform_backup_*.sql --dry-run
```

### Conversion Script

**File**: `scripts/uuid_to_varchar_conversion.sql`

```sql
-- ============================================================================
-- UUID to VARCHAR(36) Conversion Script
-- ============================================================================
-- WARNING: This will lock tables during conversion. Run during maintenance window.
-- REQUIREMENT: Full database backup MUST exist before running.
-- ============================================================================

BEGIN;

-- Step 1: Find all foreign keys referencing users.id
DO $$
DECLARE
    fk_record RECORD;
BEGIN
    FOR fk_record IN
        SELECT
            tc.constraint_name,
            tc.table_name,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'users'
        AND ccu.column_name = 'id'
    LOOP
        -- Drop FK constraint
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I',
            fk_record.table_name,
            fk_record.constraint_name
        );

        RAISE NOTICE 'Dropped FK: %.% (%)',
            fk_record.table_name,
            fk_record.column_name,
            fk_record.constraint_name;
    END LOOP;
END $$;

-- Step 2: Find all foreign keys referencing organizations.id
DO $$
DECLARE
    fk_record RECORD;
BEGIN
    FOR fk_record IN
        SELECT
            tc.constraint_name,
            tc.table_name,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'organizations'
        AND ccu.column_name = 'id'
    LOOP
        -- Drop FK constraint
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I',
            fk_record.table_name,
            fk_record.constraint_name
        );

        RAISE NOTICE 'Dropped FK: %.% (%)',
            fk_record.table_name,
            fk_record.column_name,
            fk_record.constraint_name;
    END LOOP;
END $$;

-- Step 3: Convert users.id and all FK columns
ALTER TABLE users
    ALTER COLUMN id TYPE VARCHAR(36) USING id::text;

-- Convert all columns that reference users.id
DO $$
DECLARE
    col_record RECORD;
BEGIN
    FOR col_record IN
        SELECT
            table_name,
            column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND data_type = 'uuid'
        AND column_name IN ('user_id', 'created_by', 'updated_by', 'owner_id', 'assignee_id')
    LOOP
        EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE VARCHAR(36) USING %I::text',
            col_record.table_name,
            col_record.column_name,
            col_record.column_name
        );

        RAISE NOTICE 'Converted %.% to VARCHAR(36)',
            col_record.table_name,
            col_record.column_name;
    END LOOP;
END $$;

-- Step 4: Convert organizations.id and all FK columns
ALTER TABLE organizations
    ALTER COLUMN id TYPE VARCHAR(36) USING id::text;

-- Convert all columns that reference organizations.id
DO $$
DECLARE
    col_record RECORD;
BEGIN
    FOR col_record IN
        SELECT
            table_name,
            column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND data_type = 'uuid'
        AND column_name = 'organization_id'
    LOOP
        EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE VARCHAR(36) USING %I::text',
            col_record.table_name,
            col_record.column_name,
            col_record.column_name
        );

        RAISE NOTICE 'Converted %.% to VARCHAR(36)',
            col_record.table_name,
            col_record.column_name;
    END LOOP;
END $$;

-- Step 5: Recreate foreign key constraints
-- Note: This will need to be customized based on actual schema
-- The following is a template - adjust table/column names as needed

-- Users FK constraints (examples)
ALTER TABLE deals
    ADD CONSTRAINT fk_deals_organization_id
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE deals
    ADD CONSTRAINT fk_deals_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add more FK constraints as discovered in Step 1 and Step 2

-- Step 6: Verify conversions
DO $$
BEGIN
    -- Check users.id
    IF (SELECT data_type FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'id') != 'character varying' THEN
        RAISE EXCEPTION 'users.id conversion failed';
    END IF;

    -- Check organizations.id
    IF (SELECT data_type FROM information_schema.columns
        WHERE table_name = 'organizations' AND column_name = 'id') != 'character varying' THEN
        RAISE EXCEPTION 'organizations.id conversion failed';
    END IF;

    RAISE NOTICE 'All conversions verified successfully';
END $$;

COMMIT;

-- ============================================================================
-- Post-Conversion Verification
-- ============================================================================

-- Verify data integrity
SELECT 'users.id samples:', id FROM users LIMIT 5;
SELECT 'organizations.id samples:', id FROM organizations LIMIT 5;

-- Verify all FKs are working
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND (ccu.table_name IN ('users', 'organizations'))
ORDER BY tc.table_name;
```

### Execution Instructions

**CRITICAL**: Only someone with direct production database access can execute this.

```bash
# 1. Connect to production database
psql "postgresql://ma_saas_user:PASSWORD@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com/ma_saas_platform"

# 2. Verify backup exists
\! ls -lh ma_saas_platform_backup_*.sql

# 3. Run conversion script
\i scripts/uuid_to_varchar_conversion.sql

# 4. If any errors occur, rollback and restore from backup
-- The script uses a transaction, so ROLLBACK will undo everything

# 5. If successful, verify schema
\d users
\d organizations
```

---

## Phase 3: Reset alembic_version Correctly (REQUIRES DB ADMIN ACCESS)

### Goal
Set `alembic_version` to the ACTUAL migration that corresponds to the 165 existing tables.

### Steps

1. **Identify the true version** (from Phase 1 analysis)

2. **Reset alembic_version**:
```sql
-- Replace <actual_version> with result from Phase 1
UPDATE alembic_version
SET version_num = '<actual_version>'
WHERE version_num = 'dc2c0f69c1b1';
```

3. **Verify alembic state**:
```bash
cd backend
alembic current
alembic heads
```

---

## Phase 4: Run Migrations Forward (REQUIRES NETWORK ACCESS)

### Goal
Apply all missing migrations from true version to head.

### Steps

1. **Test migrations locally first**:
```bash
cd backend

# Connect to test database
export DATABASE_URL="postgresql://localhost/ma_saas_test"

# Run migrations
alembic upgrade head

# Verify no errors
```

2. **Apply to production** (via Render Pre-Deploy Command):
```bash
# Pre-Deploy Command is already configured:
# cd backend && alembic upgrade head

# Trigger deployment via Render dashboard or API
```

3. **Monitor migration execution**:
- Watch Render deployment logs
- Look for migration output
- Verify all tables created

4. **Verify final state**:
```sql
-- Check alembic version
SELECT version_num FROM alembic_version;
-- Should show: dc2c0f69c1b1

-- Check all tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- Should include: folders, pipeline_templates, pipeline_template_stages, rbac_audit_logs

-- Verify ID column types
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name IN ('users', 'organizations')
AND column_name = 'id';
-- Should show: character varying, 36
```

---

## Phase 5: Security - Credential Rotation (IMMEDIATE)

### Exposed Credentials

The following credentials were exposed in the chat and MUST be rotated immediately:

1. **Render API Key**: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
2. **Production DB Password**: `[REDACTED-ROTATED-2025-11-11]`
3. **Test DB Password**: `CSgcCKzGdnh5PKok489sgcqaMH3eNsEH`

### Rotation Steps

**Render API Key**:
1. Log into Render dashboard
2. Go to Account Settings → API Keys
3. Revoke key `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
4. Generate new API key
5. Update any scripts/CI that use the old key

**Database Passwords**:
1. Log into Render dashboard
2. Go to ma_saas_platform database → Settings
3. Click "Reset Password"
4. Update all services with new password:
   - Backend service environment variables
   - Any local .env files
   - CI/CD secrets

**Verification**:
```bash
# Test old key fails
curl -H "Authorization: Bearer rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM" \
  https://api.render.com/v1/services
# Should return 401 Unauthorized

# Test new key works
curl -H "Authorization: Bearer <new_key>" \
  https://api.render.com/v1/services
# Should return service list
```

---

## Phase 6: Deployment Verification (REQUIRES NETWORK ACCESS)

### Goal
Verify the platform is fully operational after all fixes.

### Checklist

- [ ] Backend deployment status: LIVE
- [ ] Frontend deployment status: LIVE
- [ ] Health endpoint responding: `curl https://ma-saas-backend.onrender.com/health`
- [ ] Database connection working
- [ ] Alembic at head: `dc2c0f69c1b1`
- [ ] All tables exist (165+ tables)
- [ ] ID columns correct type (VARCHAR(36))
- [ ] No type mismatch errors in logs
- [ ] Sample API calls work:
  - [ ] GET /api/organizations
  - [ ] GET /api/users
  - [ ] GET /api/deals
  - [ ] POST /api/deals (create test deal)
- [ ] Frontend loads without errors
- [ ] User can log in via Clerk
- [ ] User can access their organization

### Test Script

```bash
#!/bin/bash
# File: scripts/verify_deployment.sh

echo "=========================================="
echo "Deployment Verification Script"
echo "=========================================="

BACKEND_URL="https://ma-saas-backend.onrender.com"
FRONTEND_URL="https://ma-saas-platform.onrender.com"

echo ""
echo "[1/6] Checking backend health..."
curl -s "$BACKEND_URL/health" | python -m json.tool

echo ""
echo "[2/6] Checking backend database status..."
curl -s "$BACKEND_URL/health" | grep -q "database_configured.*true" && echo "✓ DB Connected" || echo "✗ DB Issue"

echo ""
echo "[3/6] Checking alembic version..."
# This requires authenticated endpoint or direct DB access
psql "$DATABASE_URL" -c "SELECT version_num FROM alembic_version;"

echo ""
echo "[4/6] Checking ID column types..."
psql "$DATABASE_URL" -c "SELECT table_name, column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name IN ('users', 'organizations') AND column_name = 'id';"

echo ""
echo "[5/6] Checking for missing tables..."
psql "$DATABASE_URL" -c "SELECT 'folders' AS expected_table, EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='folders') AS exists;"
psql "$DATABASE_URL" -c "SELECT 'pipeline_templates' AS expected_table, EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='pipeline_templates') AS exists;"

echo ""
echo "[6/6] Checking frontend..."
curl -s -o /dev/null -w "Frontend HTTP Status: %{http_code}\n" "$FRONTEND_URL"

echo ""
echo "=========================================="
echo "Verification Complete"
echo "=========================================="
```

---

## Summary: What Can Be Done in Current Environment vs External Requirements

### ✅ Can Do in This Environment (Safe, Read-Only)

1. **Create SQL conversion scripts** (Done in Phase 2)
2. **Create verification scripts** (Done in Phase 6)
3. **Document recovery procedures** (This file)
4. **Analyze migration history** to identify true schema state
5. **Create test plans** for post-recovery verification

### ❌ Cannot Do - Requires External Access

1. **Execute SQL against production database** (No database admin access)
2. **Trigger Render deployments** (Network disabled in this session)
3. **Rotate credentials** (Requires Render dashboard access)
4. **Run alembic upgrade head** (Requires database write access)
5. **Verify deployment health** (Requires network access)

---

## Next Steps for User

**Immediate** (Security Critical):
1. Rotate Render API key: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
2. Rotate database passwords (exposed in chat)

**Phase 1** (Investigation):
3. Run read-only queries from Phase 1 to identify actual migration state
4. Report findings: Which migration do the 165 tables correspond to?

**Phase 2** (Database Conversion):
5. Create production database backup
6. Review `scripts/uuid_to_varchar_conversion.sql` (to be created)
7. Execute conversion script during maintenance window
8. Verify conversion success

**Phase 3** (Migration Sync):
9. Reset alembic_version to actual state (from Phase 1)
10. Run `alembic upgrade head` via Render Pre-Deploy Command
11. Monitor deployment logs

**Phase 4** (Verification):
12. Run `scripts/verify_deployment.sh`
13. Test all critical paths
14. Verify no type mismatch errors

**Phase 5** (Resume Development):
15. Once all blockers cleared, resume BMAD 100% completion plan
16. Continue with Phase 2: Test Coverage Sprint
17. Follow TDD methodology throughout

---

**Last Updated**: 2025-11-10
**Status**: ⚠️ BLOCKED - Awaiting External Database Admin Access
**Next Owner**: User (Database Admin / DevOps)
