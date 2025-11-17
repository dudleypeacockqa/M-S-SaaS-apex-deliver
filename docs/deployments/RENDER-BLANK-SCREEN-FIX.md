# Render Blank Screen Fix - 2025-11-17

## Issue

Blank screens on Render deployment despite successful build.

## Root Cause

Missing `VITE_CLERK_PUBLISHABLE_KEY` environment variable in Render frontend service.

**Previous Behavior:**
- In DEV mode: Shows console warning, renders without Clerk
- In production: Silently renders without Clerk, causing blank screen if routes expect authentication

**Current Behavior (After Fix):**
- In DEV mode: Shows console warning, renders without Clerk (for testing)
- In production: **Build fails** if key is missing (build-time validation)
- If build succeeds but key is missing at runtime: Shows user-friendly error UI instead of blank screen

## Diagnosis

### Check Build Output
```bash
cd frontend
npm run build
# ✅ Build succeeds locally
```

### Check index.html
```bash
cat frontend/dist/index.html
# ✅ Assets correctly referenced
# ✅ Scripts loaded: /assets/index-E0yThnTk.js
```

### Check main.tsx Logic
```typescript
const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ??
  (import.meta.env.MODE === "test" ? "test-clerk-publishable-key" : undefined)

if (!publishableKey) {
  if (import.meta.env.DEV) {
    console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY...")  // Only in DEV!
    return <App />  // Allow in dev for testing
  }
  // In production: Show error UI instead of blank screen
  return <ClerkKeyMissingError />
}
```

**Previous Problem:** In production build, missing Clerk key caused silent failure (blank screen).

**Current Solution:** 
- Build-time validation prevents builds without required env vars
- Runtime error UI shows helpful message if key is missing

## Solution

### Step 1: Set Environment Variable in Render Dashboard

1. Go to https://dashboard.render.com
2. Navigate to **ma-saas-frontend** service
3. Go to **Environment** tab
4. Add/Update environment variable:
   - **Key:** `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value:** `pk_test_...` (get from Clerk dashboard at https://dashboard.clerk.com)
   - Click **Save Changes**

### Step 2: Verify render.yaml Configuration

Ensure `render.yaml` has correct setup:

```yaml
# Frontend Static Site
- type: web
  name: ma-saas-frontend
  env: static
  region: oregon
  buildCommand: "cd frontend && npm install && npm run build"
  staticPublishPath: frontend/dist
  routes:
    - type: rewrite
      source: /*
      destination: /index.html
  envVars:
    - key: VITE_API_URL
      value: https://ma-saas-backend.onrender.com
    - key: VITE_CLERK_PUBLISHABLE_KEY
      sync: false  # ✅ Syncs from Render dashboard
    - key: VITE_ENABLE_MASTER_ADMIN
      value: true
```

### Step 3: Trigger Redeploy

After setting environment variable:

```bash
# Manual redeploy via Render dashboard
# OR
git commit --allow-empty -m "chore: trigger Render redeploy"
git push origin main
```

### Step 4: Verify Deployment

1. **Check Render Build Logs:**
   ```
   cd frontend && npm install && npm run build
   ✓ built in 12.65s
   ```
   
   **Note:** If `VITE_CLERK_PUBLISHABLE_KEY` is missing, the build will **fail** with a clear error message:
   ```
   BUILD ERROR: Missing Required Environment Variables
   - VITE_CLERK_PUBLISHABLE_KEY
   Build aborted.
   ```

2. **Check Environment Variables in Build:**
   - Render should show `VITE_CLERK_PUBLISHABLE_KEY` as `***` (hidden)
   - Should NOT be `undefined`
   - Build should complete successfully

3. **Test in Browser:**
   - Visit https://ma-saas-frontend.onrender.com
   - Open DevTools Console (F12)
   - Should see app render, NOT blank screen
   - Should see Clerk authentication UI
   - If key is missing: You'll see a user-friendly error page with setup instructions (not a blank screen)

## Environment Variables Checklist

### Frontend (ma-saas-frontend)
- ✅ `VITE_API_URL` = `https://ma-saas-backend.onrender.com`
- ❓ `VITE_CLERK_PUBLISHABLE_KEY` = `pk_test_...` (CHECK THIS!)
- ✅ `VITE_ENABLE_MASTER_ADMIN` = `true`

### Backend (ma-saas-backend)
- ✅ `DATABASE_URL` = `postgresql://...`
- ✅ `CLERK_SECRET_KEY` = `sk_test_...`
- ✅ `CLERK_PUBLISHABLE_KEY` = `pk_test_...`
- ✅ `STRIPE_SECRET_KEY` = `sk_test_...`
- ✅ `OPENAI_API_KEY` = `sk-...`
- ✅ `ANTHROPIC_API_KEY` = `sk-ant-...`

## Common Pitfalls

### 1. Environment Variable Not Set
**Symptom:** Blank screen, no console errors
**Fix:** Set `VITE_CLERK_PUBLISHABLE_KEY` in Render dashboard

### 2. Wrong Clerk Key (Secret vs Publishable)
**Symptom:** Clerk errors in console
**Fix:** Use `pk_test_...` (publishable), NOT `sk_test_...` (secret)

### 3. Environment Variable Set After Build
**Symptom:** Still blank after setting env var
**Fix:** Trigger manual redeploy or push empty commit

### 4. CORS Issues
**Symptom:** Network errors in console
**Fix:** Ensure `VITE_API_URL` points to correct backend URL

### 5. Service Worker Cache
**Symptom:** Blank screen persists even after fix
**Fix:** Hard refresh (Ctrl+Shift+R) or clear browser cache

## Verification Commands

### Local Verification
```bash
# Build with production env vars
cd frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... npm run build

# Serve locally
npm run preview

# Test at http://localhost:4173
```

### Remote Verification
```bash
# Check deployed index.html
curl https://ma-saas-frontend.onrender.com/index.html | grep "index-"

# Check if assets load
curl -I https://ma-saas-frontend.onrender.com/assets/index-E0yThnTk.js
# Should return 200 OK

# Check service worker
curl -I https://ma-saas-frontend.onrender.com/service-worker.js
# Should return 200 OK
```

## Browser Console Debugging

### Open DevTools (F12) and check:

1. **Console Tab:**
   - ❌ "Missing VITE_CLERK_PUBLISHABLE_KEY" = ENV VAR NOT SET
   - ✅ No errors = Good

2. **Network Tab:**
   - Check if `/assets/index-*.js` loads (200 OK)
   - Check if Clerk API calls succeed
   - Check if API calls to backend work

3. **Application Tab:**
   - Check Local Storage for Clerk session
   - Check Service Worker status

## Prevention

### Add Build-Time Validation

Update `frontend/vite.config.ts`:

```typescript
export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(process.env.RENDER_GIT_COMMIT || 'local'),
  },
  build: {
    rollupOptions: {
      // Validate required env vars at build time
      onwarn(warning, warn) {
        if (!process.env.VITE_CLERK_PUBLISHABLE_KEY && process.env.NODE_ENV === 'production') {
          throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required for production builds')
        }
        warn(warning)
      }
    }
  }
})
```

## Support

If issues persist after following this guide:

1. Check Render build logs for errors
2. Check browser console for JavaScript errors
3. Verify all environment variables are set in Render dashboard
4. Contact Render support at https://render.com/support

---

**Created:** 2025-11-17
**Author:** Claude Code
**Status:** Active Fix
**Related:** DEPLOYMENT-GUIDE.md, MAINTENANCE-HANDOFF.md
