# P0 Credential Rotation Plan

**Date**: 2025-11-11
**Priority**: P0 - CRITICAL SECURITY
**Status**: ⏳ READY TO EXECUTE

---

## Executive Summary

Database credentials were exposed in repository documentation and scripts during deployment troubleshooting sessions. This plan outlines the steps to rotate credentials and scrub sensitive data from the repository.

---

## Exposed Credentials Inventory

### Database Password
- **Exposed Value**: `iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t`
- **Database**: `ma_saas_platform` (PostgreSQL on Render)
- **Host**: `dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com`
- **User**: `ma_saas_user`

### Files Containing Exposed Credentials (14 files)
1. docs/DATABASE_RECOVERY_INDEX.md
2. docs/DATABASE_RECOVERY_PROCEDURE.md
3. docs/DEPLOYMENT-COMPLETE-RECORD.md
4. docs/DEPLOYMENT-SESSION-SUMMARY.md
5. docs/NEXT_STEPS_FOR_USER.md
6. docs/PRODUCTION_DATABASE_ANALYSIS.md
7. docs/SECURITY_INCIDENT_2025-11-10.md
8. docs/SESSION_SUMMARY_2025-11-10.md
9. docs/bmad/BMAD_PROGRESS_TRACKER.md
10. scripts/generate_sitemap.py
11. scripts/import_blog_production.py
12. ApexDeliver Environment Variables - Master Reference.md
13. ENV-CONFIGURATION-STRATEGY.md
14. RENDER-BACKEND-ENV-UPDATES.md

---

## Rotation Procedure

### Phase 1: Scrub Repository (BEFORE rotation)
**Duration**: 15-20 minutes

1. **Replace exposed password with placeholder** in all 14 files
   - Pattern: `iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t`
   - Replacement: `[REDACTED-ROTATED-2025-11-11]`

2. **Commit scrubbed files**
   ```bash
   git add docs/ scripts/ *.md
   git commit -m "security(credentials): scrub exposed database password from documentation

   - Replace exposed password in 14 files with [REDACTED-ROTATED-2025-11-11] placeholder
   - Preparation for credential rotation (credentials will be rotated after commit)
   - Files affected: documentation, scripts, and configuration guides

   Security incident: Database password was exposed in repository during deployment troubleshooting.
   This commit removes the exposed password BEFORE rotation to ensure clean git history."
   ```

3. **Push to remote**
   ```bash
   git push origin main
   ```

### Phase 2: Rotate Render Database Credentials
**Duration**: 5-10 minutes

1. **Access Render Dashboard**
   - Navigate to: https://dashboard.render.com
   - Select: `ma_saas_platform` PostgreSQL database
   - Service ID: `dpg-d3ii7jjipnbc73e7chfg-a`

2. **Rotate Database Password**
   - Click "Reset Password" or "Rotate Credentials"
   - Copy new password to secure location (password manager)

3. **Update Backend Service Environment Variable**
   - Navigate to: `ma-saas-backend` service settings
   - Update `DATABASE_URL` with new password
   - Save changes (will trigger redeploy)

### Phase 3: Verify Rotation
**Duration**: 5-10 minutes

1. **Wait for Backend Redeploy**
   - Monitor deployment status in Render Dashboard
   - Expected duration: 2-3 minutes

2. **Verify Backend Health**
   ```bash
   curl https://ma-saas-backend.onrender.com/health
   # Expected: {"status": "healthy", ...}
   ```

3. **Test Database Connectivity**
   ```bash
   cd backend
   python -m pytest tests/smoke_tests.py -v
   # Expected: 2/2 PASSED
   ```

### Phase 4: Document Rotation
**Duration**: 5 minutes

1. **Create rotation record**
   - Document: `docs/CREDENTIAL-ROTATION-2025-11-11.md`
   - Include: Date, time, affected services, verification results

2. **Update DEPLOYMENT_HEALTH.md**
   - Add rotation completion to deployment history
   - Mark P0-3 as complete

---

## Verification Checklist

### Before Rotation
- [ ] All 14 files scrubbed with placeholder
- [ ] Scrubbed files committed to git
- [ ] Scrubbed commit pushed to remote
- [ ] Git history cleaned (no exposed credentials in latest commit)

### During Rotation
- [ ] Render database password rotated
- [ ] New password saved to secure location
- [ ] Backend `DATABASE_URL` updated with new password
- [ ] Backend redeploy triggered

### After Rotation
- [ ] Backend service shows "live" status
- [ ] Health endpoint returns healthy
- [ ] Smoke tests pass (2/2)
- [ ] Database connectivity confirmed
- [ ] Rotation documented

---

## Rollback Plan

If rotation causes deployment failure:

1. **Immediate**: Revert `DATABASE_URL` to previous password (if still valid)
2. **Trigger**: Manual redeploy of backend service
3. **Verify**: Health endpoint and smoke tests
4. **Investigate**: Check Render deployment logs for error details
5. **Fix**: Correct configuration issue
6. **Retry**: Rotation procedure

---

## Timeline (Total: 30-45 minutes)

```
T+0:00  - Start Phase 1: Scrub repository
T+0:15  - Commit and push scrubbed files
T+0:20  - Start Phase 2: Rotate Render password
T+0:25  - Update DATABASE_URL and trigger redeploy
T+0:30  - Start Phase 3: Verify rotation
T+0:35  - Backend redeploy complete
T+0:40  - Health checks pass
T+0:45  - Start Phase 4: Document rotation
T+0:50  - P0-3 COMPLETE
```

---

## Security Best Practices Applied

✅ **Scrub Before Rotate**: Remove exposed credentials from git history before rotation
✅ **Commit Separation**: Separate scrub commit from rotation documentation
✅ **Placeholder Pattern**: Use descriptive placeholder `[REDACTED-ROTATED-YYYY-MM-DD]`
✅ **Verification Steps**: Health checks and smoke tests after rotation
✅ **Documentation**: Comprehensive record of rotation procedure
✅ **Rollback Plan**: Defined procedure for recovery if rotation fails

---

## Post-Rotation Actions

1. **Add to .gitignore** (if not already present):
   ```
   # Local database scripts with credentials
   fix_production_*.py
   *_credentials.txt
   *.env.local
   ```

2. **Update Team Documentation**:
   - Notify team that database password has been rotated
   - Update internal password manager entries
   - Remove old password from all local .env files

3. **Git History Audit** (optional, for high security):
   - Consider using `git filter-branch` or BFG Repo-Cleaner to remove credentials from git history
   - Note: This requires force-push and coordination with all developers

---

## Files to Modify in Phase 1

### Documentation Files (9)
1. [docs/DATABASE_RECOVERY_INDEX.md](../docs/DATABASE_RECOVERY_INDEX.md)
2. [docs/DATABASE_RECOVERY_PROCEDURE.md](../docs/DATABASE_RECOVERY_PROCEDURE.md)
3. [docs/DEPLOYMENT-COMPLETE-RECORD.md](../docs/DEPLOYMENT-COMPLETE-RECORD.md)
4. [docs/DEPLOYMENT-SESSION-SUMMARY.md](../docs/DEPLOYMENT-SESSION-SUMMARY.md)
5. [docs/NEXT_STEPS_FOR_USER.md](../docs/NEXT_STEPS_FOR_USER.md)
6. [docs/PRODUCTION_DATABASE_ANALYSIS.md](../docs/PRODUCTION_DATABASE_ANALYSIS.md)
7. [docs/SECURITY_INCIDENT_2025-11-10.md](../docs/SECURITY_INCIDENT_2025-11-10.md)
8. [docs/SESSION_SUMMARY_2025-11-10.md](../docs/SESSION_SUMMARY_2025-11-10.md)
9. [docs/bmad/BMAD_PROGRESS_TRACKER.md](../docs/bmad/BMAD_PROGRESS_TRACKER.md)

### Scripts (2)
10. [scripts/generate_sitemap.py](../scripts/generate_sitemap.py)
11. [scripts/import_blog_production.py](../scripts/import_blog_production.py)

### Configuration Guides (3)
12. [ApexDeliver Environment Variables - Master Reference.md](../ApexDeliver%20Environment%20Variables%20-%20Master%20Reference.md)
13. [ENV-CONFIGURATION-STRATEGY.md](../ENV-CONFIGURATION-STRATEGY.md)
14. [RENDER-BACKEND-ENV-UPDATES.md](../RENDER-BACKEND-ENV-UPDATES.md)

---

**Next Step**: Execute Phase 1 (Scrub Repository)

**Status**: Ready to execute - awaiting confirmation to proceed with credential rotation
