# Migration Deployment Instructions

**Date**: 2025-11-18  
**Purpose**: Apply master_admin role migrations to production database

## Migration Files to Apply

1. `7bd26aab8934_add_master_admin_role.py` - Adds master_admin role support (placeholder, role is string)
2. `b22b7d96dcfc_setup_master_admin_and_test_tenant.py` - Sets up master admin user and test tenant

## Migration Chain

```
20251118104453 (merge)
  ↓
d8ea8ff55322 (cold outreach features)
  ↓
7bd26aab8934 (add master_admin role) ← Apply this first
  ↓
b22b7d96dcfc (setup master admin and test tenant) ← Apply this second
```

## Deployment Steps

### Option 1: Render Dashboard Shell (Recommended)

1. **Access Render Dashboard**
   - Go to: https://dashboard.render.com
   - Navigate to your backend service (e.g., `ma-saas-backend`)

2. **Open Shell**
   - Click on **"Shell"** tab in the left sidebar
   - Wait for shell to connect (10-30 seconds)

3. **Check Current Migration Status**
   ```bash
   cd backend
   alembic current
   ```

4. **View Available Migrations**
   ```bash
   alembic heads
   alembic history
   ```

5. **Apply Migrations**
   ```bash
   alembic upgrade head
   ```

6. **Verify Success**
   ```bash
   alembic current
   ```
   Should show: `b22b7d96dcfc (head)`

7. **Check Migration Output**
   - Look for success messages:
     - `✅ Updated dudley@qamarketing.com to master_admin role`
     - `✅ Created test organization: Test Tenant Organization` (if new)
     - `✅ Updated dudley.peacock@icloud.com to admin role in test organization`

### Option 2: Automatic via Prestart Script

If `RENDER_PRESTART_RUN_MIGRATIONS=1` is set in Render environment variables:

1. The `prestart.sh` script will automatically run migrations on deployment
2. Check Render logs for migration output
3. Verify migrations completed successfully

### Option 3: Render CLI

If you have Render CLI configured:

```bash
render services:shell <service-name>
cd backend
alembic upgrade head
```

## Verification

After migrations are applied:

1. **Check Database**
   ```sql
   -- Verify master_admin role exists in users table
   SELECT email, role FROM users WHERE email = 'dudley@qamarketing.com';
   -- Should show: role = 'master_admin'
   
   -- Verify test organization exists
   SELECT id, name, slug FROM organizations WHERE slug = 'test-tenant-org';
   -- Should show: Test Tenant Organization
   
   -- Verify test user
   SELECT email, role, organization_id FROM users WHERE email = 'dudley.peacock@icloud.com';
   -- Should show: role = 'admin', organization_id = <test-org-id>
   ```

2. **Test Application**
   - Check application logs for startup errors
   - Test root endpoint: `https://ma-saas-backend.onrender.com/`
   - Verify 100daysandbeyond.com is accessible

3. **Test Master Admin Access**
   - Sign in as `dudley@qamarketing.com`
   - Verify master admin portal is accessible
   - Verify all features are accessible (master admin bypasses checks)

## Troubleshooting

### Migration Fails with "relation does not exist"

**Issue**: Organizations table doesn't exist yet  
**Solution**: Ensure migration `36b3e62b4148` (or earlier) has been applied first

### Migration Fails with "duplicate key value"

**Issue**: User or organization already exists  
**Solution**: This is expected - migration handles existing records gracefully

### Migration Fails with "column does not exist"

**Issue**: Users table structure doesn't match  
**Solution**: Check that all previous migrations have been applied

### User Not Found Warnings

**Issue**: Users don't exist in database yet  
**Solution**: This is normal - users will be created via Clerk webhook on first sign-in. The migration will update them when they exist.

## Rollback (if needed)

If you need to rollback:

```bash
cd backend
alembic downgrade -1  # Rollback one migration
# OR
alembic downgrade 7bd26aab8934  # Rollback to specific migration
```

**Note**: The setup migration (`b22b7d96dcfc`) will reset user roles in downgrade, but won't delete organizations.

## Post-Deployment Checklist

- [ ] Migrations applied successfully
- [ ] Application starts without errors
- [ ] 100daysandbeyond.com is accessible
- [ ] Master admin user can sign in
- [ ] Master admin has access to all features
- [ ] Test tenant organization exists
- [ ] Test tenant admin user can sign in
- [ ] No errors in application logs

