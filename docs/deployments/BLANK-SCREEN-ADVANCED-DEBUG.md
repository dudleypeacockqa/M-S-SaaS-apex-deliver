# Blank Screen Advanced Debugging - Environment Variables Correct

## Situation
- ✅ `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- ✅ All environment variables present
- ❌ Still seeing blank screens on Render

## Diagnostic Steps

### 1. Check Browser Console (CRITICAL)

Open DevTools (F12) on the blank screen page:

**Console Tab - Look for:**
```
❌ Failed to load module script
❌ Uncaught SyntaxError
❌ Clerk error
❌ CORS error
❌ NetworkError when attempting to fetch resource
```

**Network Tab - Check:**
```
✅ index.html - Should return 200 OK
✅ /assets/index-*.js - Should return 200 OK (not 404)
✅ /assets/index-*.css - Should return 200 OK (not 404)
❌ Any 404 errors on assets?
❌ Any CORS errors?
```

### 2. Check Render Build Logs

**In Render Dashboard → Events tab:**

```bash
# Should see successful build output:
cd frontend && npm install && npm run build
...
✓ built in X.XXs
==> Uploading build...
Build successful 🎉
```

**Common build issues:**
```
❌ npm ERR! - Dependency installation failed
❌ vite build failed - Build error
❌ Out of memory - Node heap size exceeded
```

### 3. Verify Static Asset Paths

**Test these URLs directly in browser:**

```bash
# Your frontend URL (replace with actual)
https://ma-saas-frontend.onrender.com

# Index page (should return HTML)
https://ma-saas-frontend.onrender.com/index.html

# Check assets (get actual hash from index.html)
https://ma-saas-frontend.onrender.com/assets/index-E0yThnTk.js
https://ma-saas-frontend.onrender.com/assets/index-D46e3KtG.css

# Check service worker
https://ma-saas-frontend.onrender.com/service-worker.js
```

**Expected Results:**
- `index.html` → Returns HTML with `<script>` tags
- `/assets/*.js` → Returns JavaScript code
- `/assets/*.css` → Returns CSS code
- NOT FOUND (404) → Asset path issue

### 4. Check Render Routes Configuration

**In render.yaml (already correct):**
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

**This ensures:**
- All routes (like `/dashboard`) rewrite to `/index.html`
- React Router handles client-side routing
- No 404s on page refresh

**If this is missing:** Direct navigation to `/dashboard` returns 404

### 5. Hard Refresh Browser Cache

**The blank screen might be cached:**

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R

OR

Chrome DevTools (F12) → Network tab → Disable cache checkbox
Then refresh
```

### 6. Check Service Worker

**Service worker might be caching old broken build:**

**In DevTools → Application tab:**
```
1. Click "Service Workers" in left sidebar
2. Check "Update on reload"
3. Click "Unregister" on service worker
4. Hard refresh (Ctrl+Shift+R)
```

**Or clear all storage:**
```
DevTools → Application → Storage → Clear site data
```

### 7. Check for CORS Issues

**If backend API calls fail:**

**In Network tab, check API calls:**
```
Request URL: https://ma-saas-backend.onrender.com/api/...
Status: (failed) net::ERR_BLOCKED_BY_CORS

Response Headers should include:
Access-Control-Allow-Origin: https://app.100daysandbeyond.com
Access-Control-Allow-Credentials: true
```

**Fix backend CORS (if needed):**
```python
# backend/app/core/config.py
CORS_ORIGINS = [
    "https://apexdeliver.com",
    "https://100daysandbeyond.com",
    "https://www.100daysandbeyond.com",
    "https://app.100daysandbeyond.com",
    "https://ma-saas-frontend.onrender.com",  # Add this!
]
```

### 8. Check Clerk Domain Configuration

**In Clerk Dashboard (https://dashboard.clerk.com):**

1. Go to **Domains** or **Allowed Origins**
2. Ensure your Render frontend URL is whitelisted:
   ```
   https://ma-saas-frontend.onrender.com
   https://app.100daysandbeyond.com
   https://www.100daysandbeyond.com
   ```

3. Check **Application URLs:**
   - Home URL: `https://app.100daysandbeyond.com`
   - Sign-in URL: `https://app.100daysandbeyond.com/sign-in`
   - Sign-up URL: `https://app.100daysandbeyond.com/sign-up`

### 9. Test with Curl

```bash
# Test index.html
curl -I https://ma-saas-frontend.onrender.com/index.html

# Should return:
HTTP/2 200
content-type: text/html

# Test JavaScript asset (get hash from index.html)
curl -I https://ma-saas-frontend.onrender.com/assets/index-E0yThnTk.js

# Should return:
HTTP/2 200
content-type: application/javascript

# Test API backend
curl https://ma-saas-backend.onrender.com/health

# Should return:
{"status":"healthy"}
```

### 10. Check Render Static Site Settings

**In Render Dashboard → ma-saas-frontend → Settings:**

**Verify:**
- ✅ Publish Directory: `frontend/dist` (NOT just `dist`)
- ✅ Build Command: `cd frontend && npm install && npm run build`
- ✅ Auto-Deploy: Yes (for main branch)

**Common mistakes:**
- ❌ Publish Directory: `dist` (wrong - missing `frontend/` prefix)
- ❌ Build Command missing `cd frontend &&`

### 11. Check Node Version Compatibility

**Your Render config shows:**
```
NODE_VERSION=22.13.0
```

**Vite may have issues with very new Node versions.**

**Try changing to stable LTS:**
```
NODE_VERSION=20.11.0
```

**In Render Dashboard:**
- Environment → Edit `NODE_VERSION` → `20.11.0`
- Save Changes → Triggers redeploy

## Quick Diagnostic Script

Run this in your browser DevTools Console:

```javascript
// Check if React loaded
console.log('React loaded:', typeof React !== 'undefined');

// Check if app root exists
console.log('Root element:', document.getElementById('root'));

// Check environment variables (they won't be visible, but check if app ran)
console.log('Environment:', import.meta?.env?.MODE);

// Check Clerk
console.log('Clerk loaded:', typeof window.Clerk !== 'undefined');

// Check for errors
console.log('Errors:', window.onerror);
```

## Most Likely Causes (Ranked)

### 1. Browser Cache (60% probability)
**Symptom:** Old broken build cached
**Fix:** Hard refresh (Ctrl+Shift+R) + Clear storage

### 2. Asset Path Mismatch (20% probability)
**Symptom:** 404 errors on `/assets/*.js` in Network tab
**Fix:** Verify `staticPublishPath: frontend/dist` in render.yaml

### 3. Service Worker Cache (10% probability)
**Symptom:** Old build served from SW cache
**Fix:** Unregister service worker, clear storage

### 4. JavaScript Runtime Error (5% probability)
**Symptom:** Console shows error during mount
**Fix:** Check console errors, fix code bug

### 5. Clerk Domain Not Whitelisted (3% probability)
**Symptom:** Clerk fails to initialize
**Fix:** Add domain in Clerk dashboard

### 6. CORS Issue (2% probability)
**Symptom:** API calls fail in Network tab
**Fix:** Add frontend domain to backend CORS_ORIGINS

## Immediate Action Plan

**Do this RIGHT NOW:**

1. **Visit your Render frontend URL**
2. **Press F12** to open DevTools
3. **Go to Console tab**
4. **Screenshot any errors you see**
5. **Go to Network tab**
6. **Refresh page**
7. **Look for failed requests (red text)**
8. **Screenshot the Network tab**

**Then report back:**
- Console errors (if any)
- Network tab errors (if any)
- HTTP status codes (404? 500?)

This will immediately tell us the root cause.

## Nuclear Option (Last Resort)

If nothing else works:

```bash
# In Render Dashboard → ma-saas-frontend

1. Settings → Delete Service (save your env vars first!)
2. Create New Static Site
3. Connect same GitHub repo
4. Set environment variables
5. Deploy

# Fresh deployment often fixes weird caching issues
```

---

**Next Steps:** Follow the **Immediate Action Plan** above and report what you find in the Console and Network tabs. That will tell us exactly what's wrong.
