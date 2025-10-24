# Render Repository Update Guide

**Issue**: Render services pointing to old GitHub repository  
**Solution**: Update both backend and frontend services to new repository  
**Time Required**: 15 minutes  
**Difficulty**: Easy (just updating settings)

---

## Problem Summary

Your Render services (`ma-saas-backend` and `ma-saas-platform`) are currently configured to deploy from the old repository, but your new code is in:

**New Repository**: `https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver.git`

**What needs updating**:
1. ✅ Backend service (`ma-saas-backend`)
2. ✅ Frontend service (`ma-saas-platform`)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Access to Render dashboard (https://dashboard.render.com)
- ✅ New repository pushed to GitHub
- ✅ Render API key: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`

---

## Part 1: Update Backend Service (ma-saas-backend)

### Step 1: Sign into Render Dashboard

1. Go to https://dashboard.render.com
2. Sign in with your credentials
3. You should see your "100 Days and Beyond" project

---

### Step 2: Navigate to Backend Service

1. Click on **"ma-saas-backend"** in the services list
2. You'll see the service details page
3. Click on **"Settings"** in the left sidebar

---

### Step 3: Update Repository Settings

**3.1 - Find the "Build & Deploy" Section**

Scroll down to find:
- **Repository**: Currently showing old repo
- **Branch**: Currently showing `master` or old branch

**3.2 - Click "Disconnect Repository"** (if available)

- Look for a button or link that says "Disconnect" or "Change Repository"
- Click it to disconnect the old repository

**3.3 - Reconnect with New Repository**

1. Click **"Connect Repository"** or **"Add Repository"**
2. You'll be prompted to authorize GitHub (if not already done)
3. Search for: `dudleypeacockqa/M-S-SaaS-apex-deliver`
4. Click **"Connect"** next to the repository name

**3.4 - Update Branch**

- Change branch from `master` to **`main`**
- The new repository uses `main` as the default branch

**3.5 - Verify Root Directory**

- **Root Directory**: Should be `backend` or `/backend`
- This tells Render where the backend code lives

---

### Step 4: Update Environment Variables (if needed)

**4.1 - Navigate to Environment Tab**

1. Click **"Environment"** in the left sidebar
2. Review existing environment variables

**4.2 - Verify These Variables Exist**:

```
DATABASE_URL=your_database_url_here

CLERK_SECRET_KEY=your_clerk_secret_key_here

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

REDIS_URL=redis://localhost:6379

CORS_ORIGINS=https://apexdeliver.com,https://100daysandbeyond.com,http://localhost:5173
```

**4.3 - Add Any Missing Variables**

- Click **"Add Environment Variable"**
- Enter key and value
- Click **"Save Changes"**

---

### Step 5: Save and Deploy

1. Scroll to the bottom of the Settings page
2. Click **"Save Changes"**
3. Render will automatically trigger a new deployment
4. Click **"Manual Deploy"** → **"Deploy latest commit"** if it doesn't auto-deploy

---

### Step 6: Monitor Deployment

1. Click **"Logs"** in the left sidebar
2. Watch the build process
3. Look for:
   - ✅ "Build successful"
   - ✅ "Deploy live"
   - ✅ Service status: "Deployed"

**Expected Time**: 5-10 minutes

---

## Part 2: Update Frontend Service (ma-saas-platform)

### Step 1: Navigate to Frontend Service

1. Go back to the Render dashboard
2. Click on **"ma-saas-platform"** in the services list
3. Click on **"Settings"** in the left sidebar

---

### Step 2: Update Repository Settings

**2.1 - Disconnect Old Repository**

- Find the "Build & Deploy" section
- Click **"Disconnect Repository"** (if available)

**2.2 - Connect New Repository**

1. Click **"Connect Repository"**
2. Search for: `dudleypeacockqa/M-S-SaaS-apex-deliver`
3. Click **"Connect"**

**2.3 - Update Branch**

- Change branch from `master` to **`main`**

**2.4 - Verify Root Directory**

- **Root Directory**: Should be `frontend` or `/frontend`
- This tells Render where the frontend code lives

**2.5 - Verify Build Command**

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist` (Vite default)

---

### Step 3: Update Environment Variables

**3.1 - Navigate to Environment Tab**

1. Click **"Environment"** in the left sidebar

**3.2 - Verify These Variables Exist**:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

VITE_API_URL=https://ma-saas-backend.onrender.com
```

**3.3 - Add Any Missing Variables**

- Click **"Add Environment Variable"**
- Enter key and value (must start with `VITE_` for Vite to expose them)
- Click **"Save Changes"**

---

### Step 4: Save and Deploy

1. Scroll to the bottom
2. Click **"Save Changes"**
3. Render will trigger a new deployment
4. Click **"Manual Deploy"** → **"Deploy latest commit"** if needed

---

### Step 5: Monitor Deployment

1. Click **"Logs"** in the left sidebar
2. Watch the build process
3. Look for:
   - ✅ "Build successful"
   - ✅ "Deploy live"
   - ✅ Service status: "Deployed"

**Expected Time**: 5-10 minutes

---

## Part 3: Verify Everything Works

### Step 1: Test Backend

**Visit**: https://ma-saas-backend.onrender.com/health

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-24T...",
  "database": "connected"
}
```

**If it fails**:
- Check logs in Render dashboard
- Verify environment variables are correct
- Ensure database connection string is correct

---

### Step 2: Test Frontend

**Visit**: https://apexdeliver.com

**Expected Result**:
- ✅ Landing page loads
- ✅ "Get Started" button works
- ✅ Sign-in page loads
- ✅ No console errors

**If it fails**:
- Check browser console for errors
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
- Verify `VITE_API_URL` points to backend

---

### Step 3: Test End-to-End Flow

1. **Visit**: https://apexdeliver.com
2. **Click**: "Get Started" or "Sign In"
3. **Sign up** with a test email
4. **Verify**: You can access the dashboard
5. **Check**: User profile displays correctly

**If authentication fails**:
- Verify Clerk keys are correct
- Check Clerk dashboard for webhook status
- Review backend logs for errors

---

## Part 4: Configure Auto-Deploy (Recommended)

### Enable Auto-Deploy for Backend

1. Go to **ma-saas-backend** → **Settings**
2. Find **"Auto-Deploy"** section
3. Enable **"Auto-Deploy"**: Yes
4. Set **"Branch"**: `main`
5. Save changes

**Result**: Every push to `main` automatically deploys the backend

---

### Enable Auto-Deploy for Frontend

1. Go to **ma-saas-platform** → **Settings**
2. Find **"Auto-Deploy"** section
3. Enable **"Auto-Deploy"**: Yes
4. Set **"Branch"**: `main`
5. Save changes

**Result**: Every push to `main` automatically deploys the frontend

---

## Part 5: Test Auto-Deploy

### Make a Small Change

**In your local repository**:

```bash
cd C:\Projects\ma-saas-platform

# Make a small change
echo "# Test Auto-Deploy" >> README.md

# Commit and push
git add README.md
git commit -m "test: verify auto-deploy works"
git push origin main
```

---

### Watch Render Deploy

1. Go to Render dashboard
2. You should see both services start deploying automatically
3. Watch the logs to confirm successful deployment
4. Verify the change appears on your live site

**Expected Time**: 5-10 minutes for both services

---

## Troubleshooting

### Issue 1: "Repository not found"

**Cause**: Render doesn't have access to the new repository

**Fix**:
1. Go to Render dashboard → Account Settings → GitHub
2. Click **"Configure GitHub App"**
3. Ensure `M-S-SaaS-apex-deliver` is in the list of accessible repositories
4. If not, click **"Select repositories"** and add it
5. Save and try reconnecting

---

### Issue 2: "Build failed - command not found"

**Cause**: Build command is incorrect or dependencies missing

**Fix (Backend)**:
1. Verify **Build Command**: `pip install -r requirements.txt`
2. Verify **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Verify **Root Directory**: `backend`

**Fix (Frontend)**:
1. Verify **Build Command**: `npm install && npm run build`
2. Verify **Publish Directory**: `dist`
3. Verify **Root Directory**: `frontend`

---

### Issue 3: "Environment variable not found"

**Cause**: Environment variables not set in Render

**Fix**:
1. Go to service → **Environment** tab
2. Add missing variables
3. For frontend, ensure variables start with `VITE_`
4. Save and redeploy

---

### Issue 4: "Database connection failed"

**Cause**: Database URL is incorrect or database is down

**Fix**:
1. Verify `DATABASE_URL` in backend environment variables
2. Check database status in Render dashboard (should be "Available")
3. Verify IP restrictions allow Render internal network (100.64.0.0/10)
4. Test connection:
   ```bash
   psql your_database_url_here
   ```

---

### Issue 5: "CORS error in browser console"

**Cause**: Backend not allowing frontend origin

**Fix**:
1. Go to backend → **Environment** tab
2. Verify `CORS_ORIGINS` includes your frontend URL:
   ```
   CORS_ORIGINS=https://apexdeliver.com,https://100daysandbeyond.com,http://localhost:5173
   ```
3. Save and redeploy backend

---

## Alternative: Use Render API (Advanced)

If you prefer to update via API instead of the dashboard:

### Update Backend Service

```bash
curl -X PATCH \
  https://api.render.com/v1/services/srv-YOUR_BACKEND_SERVICE_ID \
  -H "Authorization: Bearer rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM" \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver",
    "branch": "main",
    "rootDir": "backend"
  }'
```

### Update Frontend Service

```bash
curl -X PATCH \
  https://api.render.com/v1/services/srv-YOUR_FRONTEND_SERVICE_ID \
  -H "Authorization: Bearer rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM" \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver",
    "branch": "main",
    "rootDir": "frontend"
  }'
```

**Note**: You'll need to find your service IDs in the Render dashboard URL.

---

## Summary Checklist

### Backend (ma-saas-backend)

- [ ] Repository updated to `M-S-SaaS-apex-deliver`
- [ ] Branch changed to `main`
- [ ] Root directory set to `backend`
- [ ] Environment variables verified
- [ ] Auto-deploy enabled
- [ ] Deployment successful
- [ ] Health check passing

### Frontend (ma-saas-platform)

- [ ] Repository updated to `M-S-SaaS-apex-deliver`
- [ ] Branch changed to `main`
- [ ] Root directory set to `frontend`
- [ ] Environment variables verified
- [ ] Auto-deploy enabled
- [ ] Deployment successful
- [ ] Site loading correctly

### Verification

- [ ] Backend health check: https://ma-saas-backend.onrender.com/health
- [ ] Frontend loading: https://apexdeliver.com
- [ ] Authentication working
- [ ] Auto-deploy tested
- [ ] No errors in logs

---

## Next Steps After Update

Once both services are updated and deployed:

1. **Test the complete user flow**:
   - Sign up → Sign in → Dashboard → Sign out

2. **Monitor logs for errors**:
   - Check Render dashboard logs regularly
   - Set up log streaming (optional)

3. **Continue development**:
   - Run DEV-003 (Protected Routing)
   - Run DEV-004 (Backend Clerk Sync)
   - Run DEV-005 (RBAC Implementation)

4. **Set up monitoring** (optional):
   - Add Datadog or similar monitoring
   - Set up uptime monitoring
   - Configure error alerts

---

## Support

If you encounter issues:

1. **Check Render Status**: https://status.render.com
2. **Review Logs**: Render dashboard → Service → Logs
3. **Render Documentation**: https://render.com/docs
4. **GitHub Repository**: https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver

---

**You're ready to update your Render services! Follow the steps above and you'll be live with the new repository in 15 minutes.** 🚀

