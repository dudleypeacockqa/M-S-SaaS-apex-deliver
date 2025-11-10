# Database Recovery Documentation Index

**Purpose**: Quick reference guide to all database recovery documentation and scripts.

**Status**: 🚧 BLOCKED - Awaiting User Database Admin Actions

**Last Updated**: 2025-11-10

---

## Quick Start

**If you just want to fix the database and resume development:**

1. **START HERE**: [NEXT_STEPS_FOR_USER.md](NEXT_STEPS_FOR_USER.md)
   - Plain English explanation
   - Actionable checklist
   - Timeline estimates
   - Decision guidance

---

## Documentation Files

### Executive Level

📄 **[NEXT_STEPS_FOR_USER.md](NEXT_STEPS_FOR_USER.md)** - **START HERE**
- Current situation summary (what's working, what's broken)
- Security alert (credential rotation steps)
- 6-phase action plan with timeline
- Decision matrix (UUID→VARCHAR vs code refactor)
- Progress tracking checklist
- Q&A section

**Who should read this**: Everyone (especially project owner, DevOps)

**Estimated reading time**: 15 minutes

---

### Technical Deep Dive

📄 **[PRODUCTION_DATABASE_ANALYSIS.md](PRODUCTION_DATABASE_ANALYSIS.md)**
- Verified production database state
- Schema mismatch details
- Root cause analysis
- Missing tables inventory
- Why deployments appear successful but aren't

**Who should read this**: Database admins, senior developers

**Estimated reading time**: 10 minutes

---

📄 **[DATABASE_RECOVERY_PROCEDURE.md](DATABASE_RECOVERY_PROCEDURE.md)**
- Phase 1: Investigation (identify actual migration state)
- Phase 2: UUID→VARCHAR conversion (with backup strategy)
- Phase 3: Reset alembic_version correctly
- Phase 4: Run migrations forward
- Phase 5: Security credential rotation
- Phase 6: Deployment verification
- Detailed SQL examples for each phase
- Rollback procedures

**Who should read this**: Database admins executing the recovery

**Estimated reading time**: 30 minutes

---

### Historical Context

📄 **[SESSION_SUMMARY_2025-11-10.md](SESSION_SUMMARY_2025-11-10.md)**
- What happened in this session
- Mistakes made in previous session
- Lessons learned
- What was completed
- What's blocked and why
- Handoff notes

**Who should read this**: Future developers, post-mortem analysis

**Estimated reading time**: 20 minutes

---

📄 **[DEPLOYMENT_RECOVERY_SUCCESS.md](DEPLOYMENT_RECOVERY_SUCCESS.md)**
- Previous session's (premature) success claim
- Initial recovery attempts
- Why health checks passing ≠ schema correctness
- Historical reference only

**Who should read this**: Context for understanding the journey

**Estimated reading time**: 15 minutes

---

## Script Files

### Execution Scripts

📜 **[scripts/uuid_to_varchar_conversion.sql](../scripts/uuid_to_varchar_conversion.sql)**
- 700+ line SQL conversion script
- Transaction-wrapped for safety
- Automatic FK constraint detection and recreation
- Pre/post validation checks
- Data integrity verification
- Waits for manual COMMIT (no auto-commit)

**When to use**: During Phase 2 (database conversion)

**Estimated execution time**: 5-15 minutes (depending on data size)

**Prerequisites**:
- Full database backup exists
- Maintenance window scheduled
- Database admin access
- Read the script completely before running

---

### Verification Scripts

📜 **[scripts/verify_deployment.sh](../scripts/verify_deployment.sh)**
- Comprehensive deployment verification
- 10+ automated checks:
  - Backend/frontend health
  - Alembic version
  - ID column types
  - Missing tables
  - Data integrity
  - FK constraints
- Color-coded pass/fail output
- Requires `psql` and `curl`

**When to use**: During Phase 5 (verification) and after any deployment

**Estimated execution time**: 2-5 minutes

**Prerequisites**:
- `DATABASE_URL` environment variable set
- `psql` command available
- Network access to backend/frontend

---

### Helper Scripts (Existing)

📜 **[fix_production_alembic.py](../fix_production_alembic.py)**
- Python script to update alembic_version table
- Used to reset version to actual state
- Connects directly to production database

**When to use**: During Phase 3 (reset alembic_version)

**Status**: Already exists, can be reused

---

📜 **[trigger_render_deploy.py](../trigger_render_deploy.py)**
- Python script to trigger Render deployments via API
- Requires Render API key

**When to use**: During Phase 4 (run migrations forward)

**Status**: Already exists, but API key must be rotated first!

---

📜 **[update_render_predeploy.py](../update_render_predeploy.py)**
- Python script to configure Pre-Deploy Command via API
- Already executed in previous session

**When to use**: Only if Pre-Deploy Command needs changing

**Status**: Already configured (`cd backend && alembic upgrade head`)

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CURRENT STATE                            │
│                                                              │
│  Production DB:                    Application Code:        │
│  ✗ users.id = UUID                 ✓ users.id = VARCHAR(36) │
│  ✗ organizations.id = UUID         ✓ org.id = VARCHAR(36)   │
│  ✗ Missing tables (4)              ✓ Expects all tables     │
│  ✗ alembic_version = dc2c0f69c1b1  ✓ Migrations exist       │
│     (manually set, wrong)                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  PHASE 1: INVESTIGATION                      │
│                  (Read-Only, Safe)                           │
│                                                              │
│  1. Connect to production DB                                │
│  2. List all 165 tables                                     │
│  3. Identify actual migration state                         │
│  4. Document findings                                       │
│                                                              │
│  Time: 2 hours                                              │
│  Risk: None (read-only)                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              PHASE 2: UUID→VARCHAR CONVERSION                │
│              (Destructive, Requires Backup)                  │
│                                                              │
│  1. Create full DB backup                                   │
│  2. Schedule maintenance window                             │
│  3. Run uuid_to_varchar_conversion.sql                      │
│  4. Review output                                           │
│  5. Manual COMMIT or ROLLBACK                               │
│                                                              │
│  Time: 1-2 hours                                            │
│  Risk: Medium (mitigated by backup + transaction)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           PHASE 3: RESET ALEMBIC_VERSION                     │
│           (Quick SQL Update)                                 │
│                                                              │
│  1. Connect to production DB                                │
│  2. UPDATE alembic_version to actual state                  │
│  3. Verify with SELECT                                      │
│                                                              │
│  Time: 5 minutes                                            │
│  Risk: Low (single row update)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          PHASE 4: RUN MIGRATIONS FORWARD                     │
│          (Via Render Pre-Deploy Command)                     │
│                                                              │
│  1. Trigger Render deployment                               │
│  2. Monitor logs for migration execution                    │
│  3. Verify all migrations applied                           │
│  4. Check for errors                                        │
│                                                              │
│  Time: 10-20 minutes                                        │
│  Risk: Low (migrations are idempotent)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  PHASE 5: VERIFICATION                       │
│                  (Automated Checks)                          │
│                                                              │
│  1. Run verify_deployment.sh                                │
│  2. Check all 10+ validation points                         │
│  3. Test API endpoints                                      │
│  4. Review application logs                                 │
│                                                              │
│  Time: 1 hour                                               │
│  Risk: None (read-only verification)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    TARGET STATE                              │
│                                                              │
│  Production DB:                    Application Code:        │
│  ✓ users.id = VARCHAR(36)          ✓ users.id = VARCHAR(36) │
│  ✓ organizations.id = VARCHAR(36)  ✓ org.id = VARCHAR(36)   │
│  ✓ All tables exist (170+)         ✓ Expects all tables     │
│  ✓ alembic_version = dc2c0f69c1b1  ✓ Migrations exist       │
│     (correctly applied)                                      │
│                                                              │
│  RESULT: ✅ 100% Schema Match, Fully Functional             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           PHASE 6: RESUME BMAD 100% COMPLETION               │
│                                                              │
│  1. Update BMAD Progress Tracker                            │
│  2. Update BMM Workflow Status                              │
│  3. Run /bmad:bmm:workflows:workflow-status                 │
│  4. Continue with next story                                │
│  5. Follow TDD methodology                                  │
│                                                              │
│  Status: 🚀 DEVELOPMENT UNBLOCKED                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Critical Information

### Security Alert 🔐

**Exposed Credentials (ROTATE WITHIN 24 HOURS)**:

1. **Render API Key**: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
   - Where: Render Dashboard → Account Settings → API Keys
   - Action: Revoke and generate new

2. **Production DB Password**: `iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t`
   - Where: Render Dashboard → ma_saas_platform database → Settings
   - Action: Reset password, update backend service env vars

3. **Test DB Password**: `CSgcCKzGdnh5PKok489sgcqaMH3eNsEH`
   - Where: Render Dashboard → capliquify_test_db → Settings
   - Action: Reset password, update local .env

---

### Timeline Summary

| Phase | Description | Duration | Risk Level |
|-------|-------------|----------|------------|
| 0. Security | Rotate credentials | 1 hour | None |
| 1. Investigation | Identify actual state | 2 hours | None |
| 2. Conversion | UUID→VARCHAR | 1-2 hours | Medium |
| 3. Reset Version | Update alembic_version | 5 min | Low |
| 4. Migrations | Run migrations forward | 10-20 min | Low |
| 5. Verification | Validate success | 1 hour | None |
| **TOTAL** | **End-to-end** | **5-6 hours** | |

**Calendar Time**: 2-3 days (accounting for scheduling, approvals, maintenance windows)

---

### Decision Matrix

#### Option A: Convert Database (RECOMMENDED) ✅

**Effort**: 2-3 days
**Risk**: Medium (mitigated by backups)
**Code Changes**: None
**Testing**: Minimal (schema only)
**Downtime**: 30-60 min maintenance window

**Choose if**: You want the fastest path to unblock development

---

#### Option B: Refactor Code to Use UUID ❌

**Effort**: 2-3 weeks
**Risk**: High (widespread code changes)
**Code Changes**: 50+ files
**Testing**: Extensive (all models, migrations, tests)
**Downtime**: None

**Choose if**: You have strict no-downtime requirements and can afford weeks of refactoring

---

## Getting Help

### If Conversion Fails

1. **Check the error message** in the SQL output
2. **ROLLBACK the transaction** (don't commit)
3. **Restore from backup** if needed:
   ```bash
   psql "$DATABASE_URL" < ma_saas_platform_backup_*.sql
   ```
4. **Investigate the specific error**:
   - FK constraint issue? Check which FK is blocking
   - Data type issue? Check which column failed
   - Permission issue? Check database role grants

### If Verification Fails

Run individual checks from `verify_deployment.sh`:

```bash
# Check alembic version
psql "$DATABASE_URL" -c "SELECT version_num FROM alembic_version;"

# Check users.id type
psql "$DATABASE_URL" -c "SELECT data_type, character_maximum_length FROM information_schema.columns WHERE table_name='users' AND column_name='id';"

# Check for missing tables
psql "$DATABASE_URL" -c "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename IN ('folders', 'pipeline_templates', 'rbac_audit_logs');"
```

### If Migrations Fail

Check Render deployment logs:
1. Go to: Render Dashboard → Backend Service → Logs
2. Look for: "Running migrations..."
3. Find the specific migration that failed
4. Check error message (usually FK constraint or data type mismatch)

Common issues:
- **FK constraint violation**: UUID→VARCHAR conversion incomplete
- **Missing column**: alembic_version was set incorrectly
- **Permission error**: Database role lacks ALTER TABLE privilege

---

## Contact Information

### Who to Contact

**For Database Issues**:
- Database Admin / DevOps lead
- Requires: psql access, ALTER TABLE privileges, backup/restore capability

**For Render Deployment Issues**:
- DevOps / Platform Engineer
- Requires: Render dashboard access, API key management

**For Code/Migration Issues**:
- Senior Backend Developer
- Requires: Alembic knowledge, SQLAlchemy expertise

**For BMAD Methodology**:
- Refer to: `docs/BMAD-METHOD-IMPLEMENTATION.md`
- Workflow status: `docs/bmad/bmm-workflow-status.md`
- Progress tracker: `docs/bmad/BMAD_PROGRESS_TRACKER.md`

---

## Success Criteria

### ✅ Recovery is Complete When:

- [ ] Alembic version = `dc2c0f69c1b1` (verified via `alembic current`)
- [ ] `users.id` type = `VARCHAR(36)` (verified via `\d users`)
- [ ] `organizations.id` type = `VARCHAR(36)` (verified via `\d organizations`)
- [ ] All required tables exist (folders, pipeline_templates, etc.)
- [ ] Total table count = 170+ (was 165, added 4-5 tables)
- [ ] Backend health check passes with `database_configured: true`
- [ ] Frontend loads without errors
- [ ] API endpoints return valid data (no type mismatches)
- [ ] Application logs are clean (no "type mismatch" or "table not found" errors)
- [ ] Test deal/document creation works end-to-end
- [ ] All exposed credentials have been rotated

### 🚀 Development Can Resume When:

- [ ] All recovery success criteria met
- [ ] `verify_deployment.sh` shows 100% pass rate
- [ ] BMAD Progress Tracker updated
- [ ] BMM Workflow Status updated
- [ ] Next story identified and ready for development
- [ ] TDD workflow re-established (RED → GREEN → REFACTOR)

---

## Additional Resources

### Related Documentation
- [BMAD Progress Tracker](bmad/BMAD_PROGRESS_TRACKER.md)
- [BMM Workflow Status](bmad/bmm-workflow-status.md)
- [BMAD Method Implementation](BMAD-METHOD-IMPLEMENTATION.md)
- [Technical Specifications](bmad/technical_specifications.md)
- [PRD](bmad/prd.md)

### External References
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [SQLAlchemy Column Types](https://docs.sqlalchemy.org/en/14/core/type_basics.html)
- [Render Documentation](https://render.com/docs)

---

**Last Updated**: 2025-11-10
**Status**: 🚧 Documentation Complete, Awaiting User Execution
**Next Session**: After database recovery, resume BMAD 100% completion plan
**Questions**: Refer to [NEXT_STEPS_FOR_USER.md](NEXT_STEPS_FOR_USER.md) Q&A section

---

**Remember**: START HERE → [NEXT_STEPS_FOR_USER.md](NEXT_STEPS_FOR_USER.md)
