# Fix Render Start Command Issue

**Date**: 2025-11-22  
**Issue**: Backend deployment fails with `bash: /opt/render/project/src/render-start.sh: No such file or directory`

## Root Cause

Render dashboard has a start command configured that overrides the `render.yaml` file. When using Docker, Render should use the Dockerfile's `ENTRYPOINT` instead.

## Solution

### Step 1: Clear Start Command in Render Dashboard

1. Go to https://dashboard.render.com
2. Click on **ma-saas-backend** service
3. Click **Settings** in the left sidebar
4. Scroll to **"Build & Deploy"** section
5. Find **"Start Command"** field
6. **Clear it completely** (delete all text, leave it empty)
7. Click **Save Changes**

### Step 2: Verify Configuration

After clearing the start command, Render will:
- Use the Dockerfile's `ENTRYPOINT ["/app/entrypoint.sh"]`
- Run migrations via `prestart.sh`
- Start uvicorn server automatically

### Step 3: Redeploy

1. Go to **ma-saas-backend** → **Manual Deploy** → **Deploy latest commit**
2. Or push a new commit to trigger auto-deploy
3. Watch the logs - you should see:
   ```
   Starting Render Backend Service
   Running prestart script...
   Starting uvicorn server...
   ```

## Verification

After deployment succeeds, check logs for:
- ✅ "Starting Render Backend Service"
- ✅ "Running prestart script..."
- ✅ "Starting uvicorn server..."
- ✅ No errors about `/opt/render/project/src/render-start.sh`

## Current Configuration

- **render.yaml**: Uses `env: docker` with `dockerfilePath: backend/Dockerfile`
- **Dockerfile**: Has `ENTRYPOINT ["/app/entrypoint.sh"]`
- **entrypoint.sh**: Runs migrations then starts uvicorn

The `render.yaml` is correct - the issue is the dashboard override.

### Step 4: Repository Safeguard (2025-11-22)

- Added a root-level `render-start.sh` wrapper that simply `cd`s into `backend/` and executes `backend/render-start.sh`.
- This ensures that, even if the dashboard start command is set (or reverts), the script Render expects is always present inside the repo.
- The wrapper re-applies executable bits to `backend/render-start.sh`, `entrypoint.sh`, and `prestart.sh` before handing off, so Windows contributors cannot accidentally check in scripts without `+x`.
- Regression test `backend/tests/test_render_start_script.py` verifies the wrapper exists and points at the backend script.

