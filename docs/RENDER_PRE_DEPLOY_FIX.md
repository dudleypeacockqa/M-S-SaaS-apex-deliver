# Render Pre-Deploy Command Fix - CRITICAL

**Date**: 2025-11-10
**Status**: ⚠️ ACTION REQUIRED
**Priority**: P0 - BLOCKING DEPLOYMENTS

---

## 🚨 **Issue Summary**

Backend deployments are failing with `update_failed` status because the **Pre-Deploy Command is not configured** in Render.

### **Root Causes Identified:**

1. ✅ **FIXED**: Alembic version table pointed to deleted migration
   - Fixed `f5b6c2c9d4f2` → `dc2c0f69c1b1` (head)
   - Applied to: `capliquify_test_db` database

2. ❌ **NOT FIXED**: Pre-Deploy Command missing in Render backend service
   - Migrations are not running before service startup
   - Service starts with potentially stale database schema
   - Health checks fail, deployment marked as `update_failed`

---

## 🔧 **Required Fix**

### **Backend Service: `ma-saas-backend`**

**Service ID**: `srv-d3ii9qk9c44c73aqsli0`

#### **Steps to Fix:**

1. Go to Render Dashboard → `ma-saas-backend` → **Settings**
2. Scroll to **"Build & Deploy"** section
3. Find **"Pre-Deploy Command"** field (currently empty)
4. Click **"Edit"**
5. Enter:
   ```bash
   alembic upgrade head
   ```
6. Click **"Save Changes"**
7. Click **"Manual Deploy"** button at top to trigger new deployment

---

## 📊 **Database Configuration Check**

### **Databases Identified:**

1. **ma_saas_platform** (Primary Production DB?)
   - Host: `dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com`
   - Database: `ma_saas_platform`
   - User: `ma_saas_user`
   - Status: ⚠️ Alembic version status unknown

2. **capliquify_test_db** (Test/Staging DB)
   - Host: `dpg-d3r4aa7diees73apt8ng-a.frankfurt-postgres.render.com`
   - Database: `capliquify_test_db`
   - User: `capliquify_test_db_user`
   - Status: ✅ Alembic version fixed to `dc2c0f69c1b1`

### **⚠️ IMPORTANT: Which Database is Production?**

**Need to verify which database the backend service actually uses.**

If `ma_saas_platform` is the production database (not `capliquify_test_db`), then:
- The alembic version fix needs to be applied to `ma_saas_platform` as well
- Check `ma_saas_platform` alembic_version table
- Apply same fix if needed

---

## 📋 **Verification Steps**

### **After Adding Pre-Deploy Command:**

1. **Trigger Manual Deploy**
   - Click "Manual Deploy" button in Render dashboard
   - Monitor deployment progress

2. **Watch for Pre-Deploy Phase**
   - Deployment logs should show: `Running pre-deploy command...`
   - Then: `alembic upgrade head`
   - Migration output should appear in logs

3. **Check Deployment Status**
   ```bash
   # Poll deployment status
   curl -H "Authorization: Bearer rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM" \
     "https://api.render.com/v1/services/srv-d3ii9qk9c44c73aqsli0/deploys?limit=1"
   ```

4. **Verify Health Endpoint**
   ```bash
   curl https://ma-saas-backend.onrender.com/health
   ```

   **Expected Output:**
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-11-10T...",
     "clerk_configured": true,
     "database_configured": true,
     "webhook_configured": true
   }
   ```

5. **Check Alembic Current Version**
   ```bash
   # SSH into running container (if possible) or check logs
   alembic current
   ```

   **Expected Output:**
   ```
   dc2c0f69c1b1 (head)
   ```

---

## 🎯 **Expected Deployment Flow (After Fix)**

### **Before (Current - FAILING):**

```
1. Build Phase → ✅ SUCCESS (Docker builds)
2. Pre-Deploy Phase → ⚠️ SKIPPED (no command configured)
3. Start Phase → ❌ FAILED (schema mismatch or missing tables)
4. Health Check → ❌ TIMEOUT (service not responding)
5. Deployment Status → ❌ update_failed
```

### **After (With Pre-Deploy Command - SHOULD SUCCEED):**

```
1. Build Phase → ✅ SUCCESS (Docker builds)
2. Pre-Deploy Phase → ✅ SUCCESS (alembic upgrade head)
   - Connects to database
   - Checks current version
   - Applies pending migrations (if any)
   - Updates alembic_version table
3. Start Phase → ✅ SUCCESS (service starts with correct schema)
4. Health Check → ✅ SUCCESS (/health returns 200 OK)
5. Deployment Status → ✅ live
```

---

## 🔍 **Debugging Failed Deployments**

### **If Deployment Still Fails After Adding Pre-Deploy Command:**

1. **Check Pre-Deploy Logs**
   - Look for Alembic errors in deployment logs
   - Common issues:
     - Can't connect to database (check DATABASE_URL)
     - Migration conflicts (check alembic history)
     - Missing migration files

2. **Check Database Connection**
   ```bash
   # From local machine
   python fix_alembic_version.py
   ```
   Should connect successfully and show current version

3. **Check Migration Chain**
   ```bash
   cd backend
   alembic heads    # Should show single head: dc2c0f69c1b1
   alembic history  # Should show clean chain, no missing migrations
   ```

4. **Manual Migration Test**
   ```bash
   cd backend
   alembic current  # Check current version
   alembic upgrade head  # Try upgrade manually
   ```

### **If Still Failing:**

Contact support with:
- Deployment ID (e.g., `dep-d492c32li9vc73cf6rc0`)
- Deployment logs (especially Pre-Deploy phase)
- Output of `alembic current` from production database

---

## 📚 **Related Documentation**

- **Migration Fix Strategy**: `docs/migrations/UUID_CONVERSION_STRATEGY.md`
- **BMAD Progress Tracker**: `docs/bmad/BMAD_PROGRESS_TRACKER.md`
- **Deployment Health**: `docs/DEPLOYMENT_HEALTH.md`
- **Workflow Status**: `docs/bmad/bmm-workflow-status.md`

---

## ✅ **Success Criteria**

Pre-Deploy Command fix is successful when:

- ✅ Backend deployment status: `live`
- ✅ Health endpoint returns: `{"status": "healthy"}`
- ✅ Alembic version in DB: `dc2c0f69c1b1`
- ✅ No migration errors in deployment logs
- ✅ Service responding to API requests

---

## 🚀 **Next Steps After Fix**

1. ✅ Verify backend deployment successful
2. ✅ Check frontend deployment status
3. ✅ Run end-to-end smoke tests
4. ✅ Update BMAD progress tracker
5. ✅ Commit documentation updates
6. ✅ Continue with Phase 2 test coverage work

---

**Last Updated**: 2025-11-10
**Author**: Claude Code Migration Recovery Agent
