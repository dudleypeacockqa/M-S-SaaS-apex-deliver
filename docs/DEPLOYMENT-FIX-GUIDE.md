# Production Deployment Fix Guide

**Date**: 2025-11-12
**Issue**: Dashboard buttons not working, "Failed to fetch" errors
**Root Cause**: Missing environment variables on Render frontend deployment
**Status**: Code fixes committed, Render configuration required

---

## Issue Summary

### What's Broken
1. ❌ **Dashboard buttons** (New Deal, Upload Document, Run Valuation, View Reports) - not working
2. ❌ **API calls failing** with "Failed to fetch" errors
3. ❌ **Master Admin Portal** showing but backend API not deployed

### Root Cause
Frontend is making API calls to `http://localhost:8000` instead of `https://ma-saas-backend.onrender.com` because environment variables aren't set on Render.

---

## Quick Fix (15 Minutes)

### Step 1: Access Render Dashboard

1. Go to https://dashboard.render.com
2. Log in with your account
3. Find your frontend service (likely named `ma-saas-platform` or `ma-saas-frontend`)

### Step 2: Set Environment Variables

1. Click on your frontend service
2. Go to **Environment** tab (left sidebar)
3. Click **Add Environment Variable** button
4. Add these variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `VITE_API_URL` | `https://ma-saas-backend.onrender.com` | **CRITICAL** - Points frontend to backend |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Get from your Clerk dashboard or `.env` file |
| `VITE_ENABLE_MASTER_ADMIN` | `false` | Hides Master Admin Portal (backend not deployed) |

**Finding your Clerk key**:
- Option A: Check your local `.env` file for `VITE_CLERK_PUBLISHABLE_KEY`
- Option B: Clerk Dashboard → API Keys → Publishable Key (starts with `pk_live_`)

### Step 3: Trigger Redeploy

1. After adding all variables, click **Manual Deploy** button (top right)
2. Select **Clear build cache & deploy**
3. Wait 3-5 minutes for build to complete
4. Watch the deployment logs for errors

### Step 4: Verify Fix

Once deployed:

1. Visit https://100daysandbeyond.com
2. Sign in to your account
3. Navigate to Dashboard
4. Open browser DevTools → Network tab
5. Click "New Deal" button
6. **Expected**: See API requests going to `https://ma-saas-backend.onrender.com/api/...`
7. **Expected**: Should see either **200 OK** or **401 Unauthorized** (not network timeout)
8. **Expected**: Dashboard should show deal pipeline (or auth errors, not "Failed to fetch")

---

## Code Changes (Already Committed)

The following code changes have been committed to `origin/main` and will be deployed automatically:

### Files Modified
1. ✅ `frontend/.env.production` - Added `VITE_ENABLE_MASTER_ADMIN=false`
2. ✅ `render.yaml` - Added Master Admin feature flag configuration
3. ✅ `frontend/scripts/validate-env.js` - New validation script
4. ✅ `frontend/src/const.ts` - Conditionally include Master Admin nav item
5. ✅ `frontend/src/pages/FeatureNotAvailable.tsx` - New "feature disabled" page
6. ✅ `frontend/src/App.tsx` - Wrapped Master Admin routes with feature flag check

### What These Changes Do
- **Navigation**: Master Admin link hidden from menu when feature flag is `false`
- **Routes**: Accessing `/master-admin` directly shows "Feature Not Available" page
- **Environment**: Production defaults set, Render variables take precedence
- **Validation**: Build-time script checks required variables are set

---

## Verification Checklist

After following the Quick Fix steps:

### ✅ Backend Verification
```bash
# Test backend health (should return 200 OK)
curl https://ma-saas-backend.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "...",
  "clerk_configured": true,
  "database_configured": true
}
```

### ✅ Frontend Verification
1. Visit https://100daysandbeyond.com
2. Sign in with your account
3. Check these features:

| Feature | Expected Behavior | Status |
|---------|-------------------|--------|
| Dashboard loads | Shows deal pipeline stats | ⏳ Test |
| "New Deal" button | Navigates to `/deals/new` | ⏳ Test |
| "Upload Document" button | Shows file picker or navigates | ⏳ Test |
| Deal Pipeline | Shows list of deals (or empty state) | ⏳ Test |
| Master Admin link | **Should NOT appear** in navigation | ⏳ Test |
| `/master-admin` URL | Shows "Feature Not Available" page | ⏳ Test |

### ✅ API Connectivity
Open browser DevTools (F12) → Network tab:

1. Refresh dashboard page
2. Look for API calls
3. **Expected**: All requests go to `https://ma-saas-backend.onrender.com`
4. **Not Expected**: No requests to `http://localhost:8000`
5. **Expected**: 200 OK responses or authentication errors (401/403)
6. **Not Expected**: Network timeout errors or "Failed to fetch"

---

## Troubleshooting

### Issue: Still seeing "Failed to fetch" after redeploy

**Solution**: Check build logs for environment variable errors

1. Render Dashboard → Frontend Service → Events/Logs
2. Search for "VITE_API_URL"
3. Should see: `VITE_API_URL=https://ma-saas-backend.onrender.com`
4. If not found, environment variables weren't picked up - try:
   - Clear build cache and redeploy
   - Verify variables are in **Environment** tab (not Secrets)
   - Check variable names match exactly (case-sensitive)

### Issue: Master Admin Portal still showing in navigation

**Solution**: Feature flag not working

1. Check Render environment variables include `VITE_ENABLE_MASTER_ADMIN=false`
2. Verify build logs show this variable
3. Clear browser cache (`Ctrl+Shift+Delete`)
4. Hard refresh page (`Ctrl+F5`)

### Issue: Clerk authentication errors

**Solution**: Wrong Clerk key or domain mismatch

1. Verify `VITE_CLERK_PUBLISHABLE_KEY` starts with `pk_live_` (not `pk_test_`)
2. Check Clerk Dashboard → Domains → Ensure `100daysandbeyond.com` is added
3. Verify frontend application ID matches backend `CLERK_PUBLISHABLE_KEY`

### Issue: CORS errors in console

**Solution**: Backend not allowing frontend domain

1. Check backend logs for CORS errors
2. Verify `backend/app/core/config.py` includes `https://100daysandbeyond.com` in allowed origins
3. Backend should have this in `BACKEND_CORS_ORIGINS` environment variable

---

## Advanced: Local Development Setup

To test these changes locally before deploying:

### 1. Create `.env.local`
```bash
cd frontend
cat > .env.local <<EOF
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_test_key
VITE_ENABLE_MASTER_ADMIN=false
EOF
```

### 2. Run Validation Script
```bash
cd frontend
node scripts/validate-env.js
```

**Expected output**:
```
🔍 Validating environment variables...

✅ VITE_API_URL: http://***:8000
✅ VITE_CLERK_PUBLISHABLE_KEY: pk_test_***key

⚠️  Optional variables not set (using defaults):
   - VITE_ENABLE_MASTER_ADMIN

✅ Environment validation passed!
```

### 3. Test Locally
```bash
# Terminal 1: Start backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` and verify:
- Dashboard loads
- API calls go to `http://localhost:8000`
- Master Admin link is hidden

---

## Production Checklist

Before marking this complete, verify:

- [ ] All 3 environment variables set on Render
- [ ] Frontend redeployed successfully
- [ ] Dashboard loads without "Failed to fetch" errors
- [ ] All Quick Action buttons work
- [ ] Master Admin Portal link is hidden
- [ ] API calls go to production backend URL
- [ ] No console errors related to environment variables
- [ ] User can create new deals
- [ ] Deal pipeline displays correctly

---

## Next Steps (After Fix is Live)

### Optional Enhancements

1. **Master Admin Backend Implementation** (if planned)
   - Create `/api/master-admin/*` endpoints
   - Add authentication/authorization
   - Write tests (TDD)
   - Deploy backend
   - Set `VITE_ENABLE_MASTER_ADMIN=true` on Render

2. **Monitoring Setup**
   - Add Sentry for error tracking
   - Set up Render health check alerts
   - Configure uptime monitoring (UptimeRobot, Pingdom)

3. **Performance Optimization**
   - Run Lighthouse audit
   - Optimize bundle size
   - Enable CDN caching

---

## Support

If you encounter issues not covered in this guide:

1. **Check Render Logs**: Dashboard → Service → Logs tab
2. **Check Browser Console**: F12 → Console tab for JavaScript errors
3. **Check Network Tab**: F12 → Network tab for API call details
4. **Review DEPLOYMENT_HEALTH.md**: For deployment status details

---

## Summary

**Problem**: Frontend can't reach backend API (environment variables missing)

**Solution**: Set `VITE_API_URL` and `VITE_CLERK_PUBLISHABLE_KEY` on Render + redeploy

**Time to Fix**: 15 minutes (configure Render) + 5 minutes (deploy + verify)

**Expected Result**: Fully functional dashboard with all buttons working

---

**Last Updated**: 2025-11-12
**Status**: Ready for deployment
**Commit**: Pending (code changes ready to commit)
