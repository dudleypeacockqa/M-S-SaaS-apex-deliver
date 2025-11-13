# User Action Plan: Database Recovery & 100% Completion

**Date**: 2025-11-13
**Status**: ⏸️ WAITING FOR USER EXECUTION
**Priority**: CRITICAL - Blocks ALL development

---

## Current Situation

You reported that:
1. ✅ Manually created 5 valuation tables in production
2. ✅ Ran `alembic upgrade head` locally (reached b354d12d1e7d)
3. ✅ Triggered Render backend deploy (dep-d4ai51muk2g5730jmaho)
4. ❌ Deploy failed: `document_questions.document_id` (VARCHAR) cannot FK to `documents.id` (UUID)

**Root Cause**: Production database has **UUID** primary keys, application code expects **VARCHAR(36)**.

**Impact**: TOTAL deployment blocker. Cannot apply ANY new migrations until conversion complete.

---

## Your Immediate Tasks

### Task 1: Security Credential Rotation (30-60 minutes) - URGENT

**Why**: API keys and passwords were exposed in conversation history

**Steps**:
1. Read: `docs/SECURITY_CREDENTIAL_ROTATION_REQUIRED.md`
2. Go to Render Dashboard
3. Revoke API key: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
4. Generate new API key → Store securely (1Password, etc.)
5. Reset production DB password → Update Render service `DATABASE_URL` env var
6. Reset test DB password → Update local .env files
7. Verify: `psql $DATABASE_URL -c "SELECT 1"`

**Output**: Check boxes in SECURITY_CREDENTIAL_ROTATION_REQUIRED.md when done

---

### Task 2: Database Investigation (1-2 hours)

**Why**: Need to know true migration state before conversion

**Steps**:
1. Read: `docs/DATABASE_INVESTIGATION_PROCEDURE.md`
2. Connect to production (read-only): `psql $DATABASE_URL`
3. Run all SQL queries from the procedure document
4. Record findings in the template at end of document

**Key Questions to Answer**:
- What is current `alembic_version`? (Likely `ba1a5bcdb110`, NOT `f867c7e3d51c`)
- Which indicator tables exist? (folders, rbac_audit_logs, pipeline_templates, document_questions)
- Is `users.id` UUID or VARCHAR(36)? (Determines if conversion needed)
- How many users/organizations? (Estimates conversion time)

**Output**: Completed investigation template in DATABASE_INVESTIGATION_PROCEDURE.md

---

### Task 3: Database Backup (15-30 minutes)

**Why**: Safety net before destructive operation

**Steps**:
```bash
# Option 1: Render Dashboard
# - Go to Database → Backups → Create Manual Backup
# - Wait for completion
# - Download backup file

# Option 2: pg_dump
export DATABASE_URL="postgresql://ma_saas_user:<NEW_PASSWORD>@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com:5432/ma_saas_platform"

pg_dump "$DATABASE_URL" | gzip > backups/ma_saas_platform_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Verify backup
gunzip -c backups/ma_saas_platform_backup_*.sql.gz | head -n 100
ls -lh backups/ma_saas_platform_backup_*.sql.gz
```

**Output**: Backup file stored securely with verified integrity

---

### Task 4: Decide on FK Recreation Approach (30 minutes)

**Why**: Phase 5 of conversion script is incomplete (see CONVERSION_SCRIPT_AUDIT_REPORT.md)

**Options**:

#### Option A: Enhanced Dynamic Recreation (RECOMMENDED)
- **Effort**: 2-3 hours to modify script
- **Reliability**: HIGH (automated, guarantees all FKs recreated)
- **Process**:
  1. Modify `scripts/uuid_to_varchar_conversion.sql`
  2. Add temp table to store dropped FK metadata in Phase 2
  3. Recreate from temp table in Phase 5
  4. See CONVERSION_SCRIPT_AUDIT_REPORT.md lines 150-200 for pseudocode

#### Option B: Manual Enumeration (FALLBACK)
- **Effort**: 4-6 hours to enumerate and code
- **Reliability**: MEDIUM (human error possible)
- **Process**:
  1. Run Phase 2 FK discovery query on production (read-only)
  2. Export all FK constraints to CSV
  3. Manually code Phase 5 with all 95+ constraints
  4. Cross-reference to ensure completeness

#### Option C: Run Phase 2 First, Then Complete Phase 5
- **Effort**: 3-4 hours
- **Reliability**: MEDIUM-HIGH
- **Process**:
  1. Run conversion script UP TO end of Phase 2
  2. Review Phase 2 output (lists all dropped FKs)
  3. Code Phase 5 based on actual output
  4. Resume script from Phase 3

**Decision Required**: Which approach will you use?

**Output**: Updated conversion script with complete Phase 5, OR decision to use Option C

---

### Task 5: Test Conversion on Test Database (1-2 hours)

**Why**: Verify script works before touching production

**Steps**:
```bash
# Connect to test database
export DATABASE_URL_TEST="postgresql://ma_saas_user:<NEW_PASSWORD>@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com:5432/ma_saas_test"

# Run conversion script
psql "$DATABASE_URL_TEST" -f scripts/uuid_to_varchar_conversion.sql

# Review output carefully
# If successful: COMMIT;
# If errors: ROLLBACK;

# Verify FK count
psql "$DATABASE_URL_TEST" -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type='FOREIGN KEY';"

# Run test migrations
cd backend
export DATABASE_URL="$DATABASE_URL_TEST"
alembic upgrade head

# Expected: Migrations from ba1a5bcdb110 → b354d12d1e7d succeed
```

**Output**: Successful test conversion with all migrations applied

---

### Task 6: Schedule Production Maintenance Window

**Why**: Conversion requires 30-60 minutes downtime

**Recommended Window**:
- **Date**: Weekend (Saturday or Sunday)
- **Time**: 2am-4am UTC (low traffic period)
- **Duration**: 2 hours (buffer for issues)

**Preparation**:
- [ ] Notify stakeholders (if any active users)
- [ ] Prepare rollback team (if needed)
- [ ] Set up monitoring alerts
- [ ] Test backup restore procedure

**Output**: Scheduled maintenance window with team availability confirmed

---

### Task 7: Execute Production Conversion (30-60 minutes) - DURING MAINTENANCE WINDOW

**Steps**:

#### 7.1: Pre-Conversion Checks (5 min)
```bash
# Verify backup exists
ls -lh backups/ma_saas_platform_backup_*.sql.gz

# Verify credentials rotated
echo $DATABASE_URL | grep -o "@.*:5432"  # Should show correct host

# Verify no active users
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM pg_stat_activity WHERE datname='ma_saas_platform' AND pid <> pg_backend_pid();"
# Should be 0 or very low
```

#### 7.2: Enable Maintenance Mode (5 min)
```bash
# Option 1: Stop backend service on Render
# Dashboard → Backend Service → Settings → Stop Service

# Option 2: Set maintenance env var
# Dashboard → Backend Service → Environment → Add MAINTENANCE_MODE=true
# Redeploy service

# Verify backend returns 503
curl https://ma-saas-platform-backend.onrender.com/health
# Expected: 503 Service Unavailable (or connection refused)
```

#### 7.3: Run Conversion Script (30-45 min)
```bash
# Run script with output logging
psql "$DATABASE_URL" -f scripts/uuid_to_varchar_conversion.sql 2>&1 | tee logs/conversion_$(date +%Y%m%d_%H%M%S).log

# Review output carefully:
# - Phase 1: Verify current types (users.id=UUID, orgs.id=UUID)
# - Phase 2: Count dropped FKs (e.g., "Total users.id FKs dropped: 42")
# - Phase 3: Verify PKs converted (users.id→VARCHAR(36))
# - Phase 4: Count converted columns (e.g., "Total user FK columns: 38")
# - Phase 5: Verify FKs recreated (count should match Phase 2)
# - Phase 6: Validation checks pass

# If ALL validations pass:
COMMIT;

# If ANY errors:
ROLLBACK;
```

#### 7.4: Reset alembic_version (5 min)
```sql
-- Use value from Task 2 investigation
-- Example: If investigation found production is at ba1a5bcdb110
psql "$DATABASE_URL" -c "UPDATE alembic_version SET version_num = 'ba1a5bcdb110';"

-- Verify
psql "$DATABASE_URL" -c "SELECT version_num FROM alembic_version;"
```

#### 7.5: Trigger Render Deployment (10-20 min)
```bash
# Option 1: Render Dashboard
# - Go to Backend Service
# - Click "Manual Deploy" → Deploy latest commit

# Option 2: Git push (triggers auto-deploy)
git push origin main

# Monitor deployment logs for migration execution:
# "Running upgrade ba1a5bcdb110 -> c3a7b4bbf913, add rbac audit logs"
# "Running upgrade c3a7b4bbf913 -> dc2c0f69c1b1, add pipeline templates"
# ...
# "Running upgrade f867c7e3d51c -> b354d12d1e7d, add document generation tables"

# Expected: ALL migrations succeed, service starts
```

#### 7.6: Verification (10-20 min)
```bash
# Health check
curl https://ma-saas-platform-backend.onrender.com/health
# Expected: {"status":"healthy","database_configured":true}

# Frontend check
curl https://100daysandbeyond.com/
# Expected: HTTP 200

# Database checks
psql "$DATABASE_URL" -c "SELECT version_num FROM alembic_version;"
# Expected: b354d12d1e7d

psql "$DATABASE_URL" -c "\d users"
# Expected: id | character varying(36)

psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM folders;"
# Expected: >= 0 (table exists)

# Run smoke tests (if available)
cd scripts
./verify_deployment.sh production
./run_smoke_tests.sh production
```

#### 7.7: Disable Maintenance Mode (5 min)
```bash
# Reverse Step 7.2
# Option 1: Start backend service
# Option 2: Remove MAINTENANCE_MODE env var and redeploy
```

**Output**: Production database converted, migrations applied, services healthy

---

### Task 8: Post-Conversion Monitoring (1-2 hours)

**Steps**:
1. Monitor Render logs for errors (especially FK violations)
2. Test critical user journeys:
   - User registration (Clerk)
   - Organization creation
   - Deal creation
   - Document upload
   - Financial connection
3. Check for FK violation errors in logs
4. Verify data integrity: `SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM organizations;`

**Output**: Stable production system with no errors

---

### Task 9: Update Documentation (30 minutes)

**Files to Update**:

#### docs/bmad/BMAD_PROGRESS_TRACKER.md
```markdown
## Session 2025-11-13: Database Recovery & Schema Alignment

**Date**: 2025-11-13
**Duration**: [X hours]
**Focus**: UUID → VARCHAR(36) conversion to align production with application code

### Completed
- [x] Security credential rotation (exposed API keys/passwords)
- [x] Database investigation (identified true migration state: ba1a5bcdb110)
- [x] Production database backup ([SIZE] GB)
- [x] Conversion script Phase 5 completion ([Approach A/B/C])
- [x] Test database conversion validation
- [x] Production conversion execution (30-60 min downtime)
- [x] alembic_version reset to ba1a5bcdb110
- [x] Deployment triggered, migrations applied (ba1a5bcdb110 → b354d12d1e7d)
- [x] Health verification (backend, frontend, database)

### Results
- users.id: UUID → VARCHAR(36) ✓
- organizations.id: UUID → VARCHAR(36) ✓
- Total FK constraints: [X] dropped, [X] recreated
- Migration state: ba1a5bcdb110 → b354d12d1e7d (6 migrations applied)
- New tables created: folders, rbac_audit_logs, pipeline_templates, document_questions, document_templates, generated_documents
- Deployment health: 100% ✓

### Next Steps
- [ ] Resume Phase 1 Sprint 1.3: DEV-008 Documentation (screenshots)
- [ ] Continue Phase 2: Marketing audits + Master Admin backend
```

#### docs/bmad/bmm-workflow-status.md
```markdown
NEXT_ACTION: Resume Phase 1 Sprint 1.3 (DEV-008 documentation)
NEXT_COMMAND: /bmad:bmm:workflows:dev-story --story=DEV-008
NEXT_AGENT: /bmad:bmm:agents:dev

BLOCKER_RESOLVED: Database schema mismatch (UUID vs VARCHAR) - Conversion complete
```

#### docs/DEPLOYMENT_HEALTH.md
```markdown
## Latest Deployment: 2025-11-13 (Post-Conversion)

**Backend**: [commit hash]
**Frontend**: [commit hash]
**Database**: schema aligned, migrations at b354d12d1e7d
**Health**: ✓ 100%
```

**Output**: All BMAD docs updated with conversion results

---

### Task 10: Resume Development (ONGOING)

**Now that schema is aligned, you can proceed with**:

#### Phase 1 Sprint 1.3: DEV-008 Documentation (2 hours)
- Capture Document Room screenshots
- Update story documentation
- Mark DEV-008 complete

#### Phase 2: Master Admin Backend (MAP-REBUILD-001) (10 hours TDD)
- Goals system (tables, models, endpoints, tests)
- Activities system
- Scoring & Focus systems
- Nudges & Meetings systems

#### Phase 2: Marketing Audits (MARK-002) (2 hours)
- Lighthouse production audit
- Axe accessibility audit
- Fix any issues

#### Phase 3: Feature Polish (16 hours)
- DEV-011 Valuation Suite export resilience
- DEV-012 Task Automation workflow templates
- DEV-016 Podcast Studio transcript UX
- DEV-018 Deal Matching algorithm tuning

#### Phase 4: Final QA & Release (4 hours)
- Full test suite (backend 100%, frontend 100%)
- Build verification
- Documentation update
- v1.0.0 release

---

## Timeline Summary

| Task | Duration | Status |
|------|----------|--------|
| 1. Credential Rotation | 30-60 min | ⏸️ Waiting |
| 2. Database Investigation | 1-2 hours | ⏸️ Waiting |
| 3. Database Backup | 15-30 min | ⏸️ Waiting |
| 4. FK Recreation Decision | 30 min | ⏸️ Waiting |
| 5. Test Conversion | 1-2 hours | ⏸️ Waiting |
| 6. Schedule Maintenance | Planning | ⏸️ Waiting |
| 7. Production Conversion | 30-60 min | ⏸️ Scheduled |
| 8. Monitoring | 1-2 hours | ⏸️ Pending |
| 9. Update Documentation | 30 min | ⏸️ Pending |
| 10. Resume Development | Ongoing | ⏸️ Blocked |

**Total Calendar Time**: 2-3 days (including scheduling)
**Total Downtime**: 30-60 minutes (Task 7 only)

---

## Support & Escalation

### If Conversion Fails
1. **ROLLBACK** immediately (transaction protects you)
2. Review logs for specific error
3. Check backup integrity
4. Consult conversion script audit report
5. Contact database admin if needed

### If Migrations Fail After Conversion
1. Check which migration failed (Render logs)
2. Investigate specific migration file
3. May need to downgrade: `UPDATE alembic_version SET version_num = '[previous]';`
4. Fix migration, push, redeploy

### If Services Won't Start
1. Check Render service logs
2. Verify `DATABASE_URL` env var correct (after password rotation)
3. Test database connection: `psql $DATABASE_URL -c "SELECT 1"`
4. Check for FK violations in logs

---

## Documentation Reference

**Created for You**:
1. `docs/SECURITY_CREDENTIAL_ROTATION_REQUIRED.md` - Security tasks
2. `docs/DATABASE_INVESTIGATION_PROCEDURE.md` - Investigation steps
3. `docs/CONVERSION_SCRIPT_AUDIT_REPORT.md` - Script analysis & gaps
4. `docs/USER_ACTION_PLAN_DATABASE_RECOVERY.md` - This file

**Existing Docs**:
- `docs/DATABASE_RECOVERY_INDEX.md` - Navigation
- `docs/NEXT_STEPS_FOR_USER.md` - Original user guide
- `docs/PRODUCTION_DATABASE_ANALYSIS.md` - Technical analysis
- `scripts/uuid_to_varchar_conversion.sql` - Conversion script

---

## Next Steps for YOU

1. **RIGHT NOW**: Read `docs/SECURITY_CREDENTIAL_ROTATION_REQUIRED.md` and rotate credentials
2. **WITHIN 2 HOURS**: Complete database investigation and backup
3. **WITHIN 1 DAY**: Decide on FK recreation approach and test conversion
4. **WITHIN 2-3 DAYS**: Schedule and execute production conversion
5. **AFTER CONVERSION**: Resume BMAD development to 100% completion

---

**Status**: ⏸️ WAITING FOR USER TO BEGIN TASK 1 (CREDENTIAL ROTATION)
**Priority**: CRITICAL
**Blocker**: Database schema mismatch (UUID vs VARCHAR)
**Resolution**: 10 tasks, 2-3 days, 30-60 min downtime
**Goal**: Unblock development permanently, achieve 100% completion

---

**END OF USER ACTION PLAN**
