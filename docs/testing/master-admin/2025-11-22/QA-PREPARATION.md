# Master Admin QA Preparation - 2025-11-22

**Status**: IN PROGRESS
**Environment**: Production (https://100daysandbeyond.com)
**Test Accounts**: Ready (confirmed)

---

## Prerequisites Verification

### 1. Environment Configuration
- [x] `VITE_ENABLE_MASTER_ADMIN=true` in render.yaml (verified in checklist)
- [x] Feature flag enabled in production deployment
- [x] Master Admin routes registered in App.tsx
- [x] Master Admin API endpoints exist (`/api/master-admin/*`)

### 2. Test Account Setup
- [x] Clerk test account with `master_admin` role exists
- [ ] Verified account can access `/master-admin` routes
- [ ] Backend API accessible: https://ma-saas-backend.onrender.com/api/master-admin/dashboard

### 3. Evidence Directories
- [x] `docs/testing/master-admin/2025-11-22/screenshots/` created
- [x] `docs/testing/master-admin/2025-11-22/logs/` created
- [x] `docs/testing/master-admin/2025-11-22/data/` created

---

## Test Data Seeding (Optional)

If test data is needed, run:
```bash
# Set environment variables
$env:MASTER_ADMIN_USER_ID="<clerk-user-id>"
$env:MASTER_ADMIN_SEED_OUTPUT="docs/testing/master-admin/2025-11-22/data/records.json"

# Run seed script
python scripts/seed_master_admin_demo.py
```

---

## Automated QA Script

For automated evidence capture, use:
```bash
# Set Clerk sign-in token
$env:CLERK_SIGN_IN_TOKEN="<token>"
$env:MASTER_ADMIN_BASE_URL="https://100daysandbeyond.com"
$env:API_BASE_URL="https://ma-saas-backend.onrender.com"

# Run automated QA
node scripts/exercise-master-admin-crud.mjs
```

This will:
- Navigate to all 7 Master Admin features
- Exercise CRUD operations
- Capture screenshots
- Log API calls
- Generate evidence in `docs/testing/master-admin/2025-11-22/crud-evidence/`

---

## Manual QA Checklist Reference

See: `docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md`

---

**Next Step**: Execute QA (automated or manual)

