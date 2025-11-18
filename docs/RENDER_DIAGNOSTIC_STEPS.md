# Render Diagnostic Steps for 500 Error

**Date**: 2025-11-18  
**Issue**: Cloudflare 500 Internal Server Error  
**Render API Key**: Provided (use for diagnostics)

## Quick Diagnostic Steps

### Step 1: Check Render Service Status

Using Render CLI (if installed):
```bash
# Install Render CLI if not already installed
npm install -g render-cli

# Authenticate
render auth login

# List services
render services list

# Check service status
render services get <service-name>
```

Or via Render Dashboard:
1. Go to https://dashboard.render.com
2. Navigate to your backend service
3. Check the "Events" tab for recent deployments
4. Check the "Logs" tab for error messages

### Step 2: Check Application Logs

**Via Render Dashboard:**
1. Go to your backend service
2. Click "Logs" tab
3. Look for:
   - Python import errors
   - Database connection errors
   - Migration errors
   - Application startup failures

**Common Error Patterns to Look For:**
- `ModuleNotFoundError` - Missing import
- `AttributeError` - Code trying to access non-existent attribute
- `sqlalchemy.exc.ProgrammingError` - Database schema mismatch
- `alembic.util.exc.CommandError` - Migration failure
- `ImportError` - Circular import or missing module

### Step 3: Check Database Migration Status

**Via Render Shell:**
1. Go to Render Dashboard → Your Service → Shell
2. Run:
   ```bash
   cd backend
   alembic current
   ```
3. Check if migrations are up to date:
   ```bash
   alembic heads
   alembic history
   ```

**Expected Current Migration:**
- Should be at least `d8ea8ff55322` (cold outreach features)
- If behind, need to apply: `7bd26aab8934` and `b22b7d96dcfc`

### Step 4: Apply Pending Migrations

If migrations are pending:
```bash
cd backend
alembic upgrade head
```

Watch for:
- ✅ Success messages
- ⚠️ Warnings about missing users (normal if users don't exist yet)
- ❌ Errors (need to investigate)

### Step 5: Test Application Startup

**Check if application can start:**
```bash
cd backend
python -c "from app.main import app; print('✅ App imports successfully')"
```

**Test critical imports:**
```bash
cd backend
python -c "from app.api.dependencies.auth import is_master_admin; print('✅ Auth imports OK')"
python -c "from app.models.user import UserRole; print('✅ UserRole imports OK')"
python -c "print(UserRole.master_admin); print('✅ master_admin role exists')"
```

### Step 6: Check Environment Variables

**Via Render Dashboard:**
1. Go to your service → Environment
2. Verify critical variables are set:
   - `DATABASE_URL` - Database connection string
   - `CLERK_SECRET_KEY` - Clerk authentication
   - `RENDER_PRESTART_RUN_MIGRATIONS` - Should be `1` if using prestart script

### Step 7: Manual Service Restart

If needed, restart the service:
1. Go to Render Dashboard → Your Service
2. Click "Manual Deploy" → "Clear build cache & deploy"
3. Watch logs for startup errors

## Common Issues and Solutions

### Issue: "ModuleNotFoundError: No module named 'app'"

**Cause**: Python path issue or missing dependencies  
**Solution**: 
- Check that `requirements.txt` is up to date
- Verify virtual environment is activated
- Check `PYTHONPATH` environment variable

### Issue: "AttributeError: 'UserRole' object has no attribute 'master_admin'"

**Cause**: Migration not applied or code not deployed  
**Solution**:
- Apply migration `7bd26aab8934`
- Verify code deployment includes updated `user.py`

### Issue: "sqlalchemy.exc.ProgrammingError: column users.role does not exist"

**Cause**: Database schema out of sync  
**Solution**:
- Apply all pending migrations
- Check migration history matches code

### Issue: Application starts but returns 500 on all requests

**Cause**: Runtime error in request handling  
**Solution**:
- Check logs for specific error messages
- Verify `organization_id` None handling is deployed
- Check feature gate logic

## Using Render API (Alternative)

If you have API access, you can check service status programmatically:

```bash
# Set API key
export RENDER_API_KEY="rnd_oMIm1MFTqRNH8sE4fgIiIXTsNAqM"

# Get service info (requires service ID)
curl -H "Authorization: Bearer $RENDER_API_KEY" \
  https://api.render.com/v1/services/<service-id>
```

## Next Steps After Diagnosis

1. **If migrations are pending**: Apply them (Step 4)
2. **If code errors found**: Fix and redeploy
3. **If database issues**: Check connection and schema
4. **If application won't start**: Check import errors and dependencies

## Verification Checklist

After applying fixes:
- [ ] Migrations applied successfully
- [ ] Application starts without errors
- [ ] No import errors in logs
- [ ] Database schema matches code
- [ ] Root endpoint returns 200 OK
- [ ] 100daysandbeyond.com is accessible
- [ ] Cloudflare error is resolved

