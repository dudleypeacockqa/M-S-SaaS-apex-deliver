# 🚨 DATABASE RECOVERY - START HERE

**Date**: 2025-11-13
**Status**: 🔴 CRITICAL BLOCKER - Production deployment failing
**Action Required**: User must execute recovery plan

---

## Quick Start

**IF YOU JUST WANT TO GET STARTED**:
1. Read this file (5 minutes)
2. Go to **[Step 1: Read the Plan](#step-1-read-the-plan)** below
3. Execute Task 1 (credential rotation) immediately

---

## What's Happening

Your production database has **UUID** primary keys, but your application code expects **VARCHAR(36)**. This type mismatch blocks ALL deployments because migrations cannot create foreign keys between incompatible types.

**Error You're Seeing**:
```
foreign key constraint "document_questions_document_id_fkey" cannot be implemented
DETAIL: Key columns "document_id" and "id" are of incompatible types: character varying and uuid
```

**Impact**:
- ❌ Cannot deploy latest code to production
- ❌ Cannot apply new migrations
- ❌ Cannot develop new features requiring user/org foreign keys
- ❌ Development completely blocked

**Solution**: Execute 10-task recovery plan to convert UUID → VARCHAR(36)

**Timeline**: 2-3 days calendar time, 30-60 minutes actual downtime

---

## What I've Prepared for You

I've created **comprehensive, production-ready documentation** covering every aspect of the recovery:

### 🔐 Security (Task 1)
**File**: `SECURITY_CREDENTIAL_ROTATION_REQUIRED.md`
**What**: Credentials exposed in conversation (Render API key, DB passwords)
**Action**: Rotate all credentials IMMEDIATELY before database work

### 🔍 Investigation (Task 2)
**File**: `DATABASE_INVESTIGATION_PROCEDURE.md`
**What**: SQL queries to understand current production state
**Action**: Determine true migration version, check for UUID vs VARCHAR

### 📊 Technical Analysis (Background)
**File**: `CONVERSION_SCRIPT_AUDIT_REPORT.md`
**What**: Detailed audit of conversion script with gap identification
**Finding**: Phase 5 (FK recreation) is INCOMPLETE - only 5 of ~100 FKs recreated
**Action**: Must complete Phase 5 before execution (Task 4)

### 📋 Execution Plan (MAIN GUIDE)
**File**: `USER_ACTION_PLAN_DATABASE_RECOVERY.md` ← **YOUR PRIMARY GUIDE**
**What**: 10-task step-by-step plan from start to finish
**Action**: Follow this plan sequentially

### 📝 Executive Summary (Overview)
**File**: `EXECUTIVE_SUMMARY_DATABASE_RECOVERY.md`
**What**: High-level summary of situation and solution
**Action**: Read this if you want the big picture first

### 📖 Session Details (For Reference)
**File**: `bmad/SESSION_2025-11-13_DATABASE_RECOVERY_PLAN.md`
**What**: Complete BMAD session log with all analysis and decisions
**Action**: Reference if you need detailed background

---

## Your Path Forward

### Step 1: Read the Plan
📄 **Go to**: `USER_ACTION_PLAN_DATABASE_RECOVERY.md`

This is your primary guide. It contains:
- 10 tasks with detailed instructions
- Expected outputs for each step
- Verification procedures
- Rollback strategies
- Timeline estimates

**Time to Read**: 20-30 minutes

---

### Step 2: Understand the Risk
📄 **Read**: `CONVERSION_SCRIPT_AUDIT_REPORT.md` (Section 10: Risks & Gotchas)

Key risks and mitigations:
- ✅ Data loss → Mitigated by transaction + backup
- ⚠️ Missing FKs → Must fix Phase 5 before execution
- ✅ Concurrent access → Maintenance mode required

**Time to Read**: 10 minutes

---

### Step 3: Execute Task 1 (IMMEDIATE)
📄 **Go to**: `SECURITY_CREDENTIAL_ROTATION_REQUIRED.md`

**Why Immediate**: Credentials exposed in conversation history
**What to Do**:
1. Revoke Render API key: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
2. Reset production DB password
3. Reset test DB password
4. Update all environment variables
5. Verify connections work

**Time to Complete**: 30-60 minutes

---

### Step 4: Execute Task 2 (Next 1-2 Hours)
📄 **Go to**: `DATABASE_INVESTIGATION_PROCEDURE.md`

**What to Do**:
1. Connect to production (read-only)
2. Run SQL queries to determine:
   - Current `alembic_version` (likely `ba1a5bcdb110`)
   - Which tables exist (165 reported, missing recent ones)
   - Is `users.id` UUID or VARCHAR(36)? (determines if conversion needed)
   - How many users/orgs? (estimates conversion time)
3. Record findings in template

**Time to Complete**: 1-2 hours

---

### Step 5: Execute Remaining Tasks (Next 1-2 Days)
📄 **Go to**: `USER_ACTION_PLAN_DATABASE_RECOVERY.md` (Tasks 3-10)

**Tasks 3-6**: Preparation
- Create database backup
- Complete Phase 5 FK recreation
- Test on test database
- Schedule maintenance window

**Task 7**: Production Conversion (30-60 min downtime)
- During scheduled maintenance window
- Enable maintenance mode
- Run conversion script
- Verify and commit
- Trigger deployment

**Tasks 8-10**: Post-Conversion
- Monitor for errors
- Update documentation
- Resume development

**Total Time**: 2-3 days (including scheduling), 30-60 min actual downtime

---

## Decision Points

### Decision 1: FK Recreation Approach (Task 4)

You must choose ONE approach to complete Phase 5:

| Approach | Effort | Reliability | Recommendation |
|----------|--------|-------------|----------------|
| **A: Dynamic Recreation** | 2-3 hrs | ⭐⭐⭐⭐⭐ | ✅ BEST - Guaranteed complete |
| **B: Manual Enumeration** | 4-6 hrs | ⭐⭐⭐ | ⚠️ OK - Error-prone |
| **C: Two-Phase Execution** | 3-4 hrs | ⭐⭐⭐⭐ | ✅ GOOD - Safe middle ground |

**Recommendation**: Approach A (modify script to dynamically recreate all FKs)

📄 **Details**: `CONVERSION_SCRIPT_AUDIT_REPORT.md` (Section 6)

---

### Decision 2: Maintenance Window (Task 6)

**Recommended**:
- **Day**: Saturday or Sunday
- **Time**: 2am-4am UTC (low traffic)
- **Duration**: 2-hour window (30-60 min actual + buffer)

---

## Success Criteria

### You'll Know Conversion Succeeded When:
- ✅ `users.id` type = character varying(36)
- ✅ `organizations.id` type = character varying(36)
- ✅ FK count before = FK count after (~100 constraints)
- ✅ Backend /health returns 200 OK
- ✅ Frontend loads correctly
- ✅ No FK violation errors in logs
- ✅ Can create test user, organization, deal, document

### You'll Know Development is Unblocked When:
- ✅ `alembic_version` = b354d12d1e7d (migration head)
- ✅ 7+ new tables exist (folders, rbac_audit_logs, etc.)
- ✅ Can apply new migrations without type errors
- ✅ Can proceed with MAP-REBUILD-001 (Master Admin backend)
- ✅ Can finish MARK-002 (Marketing audits)
- ✅ Can resume 100% completion roadmap (34 hours remaining)

---

## What Happens After Recovery

Once database schema is aligned:

### Immediate (Same Day)
- ✅ All deployments work
- ✅ Backend healthy
- ✅ Frontend healthy
- ✅ Can apply migrations

### Short-Term (Next Week)
- ✅ Complete DEV-008 documentation (2 hrs)
- ✅ Complete Master Admin backend (10 hrs TDD)
- ✅ Complete Marketing audits (2 hrs)

### Medium-Term (Next 2 Weeks)
- ✅ Feature polish (16 hrs)
- ✅ Final QA & release (4 hrs)
- ✅ 🎉 **100% PROJECT COMPLETION**

---

## Safety Net

### If Conversion Fails
1. **ROLLBACK** immediately (transaction protects you)
2. Review conversion output for specific error
3. Restore from backup if needed
4. Consult conversion script audit report
5. Fix issue and retry

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

## Quick Reference

### Documentation Map

```
DATABASE_RECOVERY_START_HERE.md ← YOU ARE HERE
├── EXECUTIVE_SUMMARY_DATABASE_RECOVERY.md (high-level overview)
├── USER_ACTION_PLAN_DATABASE_RECOVERY.md (step-by-step guide) ← YOUR PRIMARY GUIDE
├── SECURITY_CREDENTIAL_ROTATION_REQUIRED.md (Task 1: security)
├── DATABASE_INVESTIGATION_PROCEDURE.md (Task 2: investigation)
├── CONVERSION_SCRIPT_AUDIT_REPORT.md (background: script analysis)
└── bmad/SESSION_2025-11-13_DATABASE_RECOVERY_PLAN.md (full session log)
```

### Task Checklist

- [ ] Read this file (DATABASE_RECOVERY_START_HERE.md)
- [ ] Read USER_ACTION_PLAN_DATABASE_RECOVERY.md
- [ ] Read SECURITY_CREDENTIAL_ROTATION_REQUIRED.md
- [ ] **Task 1**: Rotate credentials (30-60 min) ← **START HERE**
- [ ] Read DATABASE_INVESTIGATION_PROCEDURE.md
- [ ] **Task 2**: Investigate database (1-2 hours)
- [ ] **Task 3**: Create backup (15-30 min)
- [ ] Read CONVERSION_SCRIPT_AUDIT_REPORT.md (Section 6)
- [ ] **Task 4**: Complete Phase 5 FK recreation (2-6 hours depending on approach)
- [ ] **Task 5**: Test conversion on test database (1-2 hours)
- [ ] **Task 6**: Schedule maintenance window (planning)
- [ ] **Task 7**: Execute production conversion (30-60 min downtime)
- [ ] **Task 8**: Monitor post-conversion (1-2 hours)
- [ ] **Task 9**: Update documentation (30 min)
- [ ] **Task 10**: Resume development 🎉

---

## Bottom Line

**Current State**: 🔴 Production database has UUID PKs, code expects VARCHAR(36). Deployment blocked.

**Your Mission**: Execute 10-task recovery plan to convert UUID → VARCHAR(36).

**First Step**: Read `USER_ACTION_PLAN_DATABASE_RECOVERY.md`, then execute Task 1 (credential rotation).

**Timeline**: 2-3 days calendar time, 30-60 minutes actual downtime.

**Outcome**: Development permanently unblocked, resume 100% completion roadmap.

**You Have Everything You Need**: All documentation is complete, detailed, and production-ready. You can execute this plan autonomously.

---

## Questions?

### If You're Confused About...

**Security**: Read `SECURITY_CREDENTIAL_ROTATION_REQUIRED.md`
**Investigation**: Read `DATABASE_INVESTIGATION_PROCEDURE.md`
**Technical Details**: Read `CONVERSION_SCRIPT_AUDIT_REPORT.md`
**Execution Steps**: Read `USER_ACTION_PLAN_DATABASE_RECOVERY.md`
**Big Picture**: Read `EXECUTIVE_SUMMARY_DATABASE_RECOVERY.md`
**Full Background**: Read `bmad/SESSION_2025-11-13_DATABASE_RECOVERY_PLAN.md`

---

## Ready to Start?

### ✅ Your Next Action:

1. Open `USER_ACTION_PLAN_DATABASE_RECOVERY.md`
2. Read Tasks 1-10 (20-30 minutes)
3. Open `SECURITY_CREDENTIAL_ROTATION_REQUIRED.md`
4. Execute Task 1: Rotate credentials (30-60 minutes)

**GO TO**: `USER_ACTION_PLAN_DATABASE_RECOVERY.md` → **Task 1**

---

**Status**: 📋 PLAN COMPLETE - AWAITING YOUR EXECUTION
**Priority**: 🚨 CRITICAL BLOCKER
**Next Owner**: YOU
**Next Action**: Read USER_ACTION_PLAN, execute Task 1

---

**Good luck! You've got this. 🚀**
