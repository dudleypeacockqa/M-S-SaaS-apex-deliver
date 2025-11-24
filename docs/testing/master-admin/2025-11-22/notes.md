# Master Admin QA Notes - 2025-11-22

## Setup Complete

- Evidence directories created: `screenshots/`, `logs/`, `har/`, `crud-evidence/`
- Checklist prepared: `checklist.md`
- Automated script ready: `scripts/exercise-master-admin-crud.mjs`

## Prerequisites

1. **Clerk Sign-In Token**: Required for authentication
   - User: `dudley@qamarketing.com`
   - Obtain token from Clerk dashboard or via API

2. **Test Data Seeding**: 
   ```bash
   MASTER_ADMIN_USER_ID=<user-id> python scripts/seed_master_admin_demo.py
   ```

3. **Environment Variables**:
   - `CLERK_SIGN_IN_TOKEN` - For automated script
   - `MASTER_ADMIN_USER_ID` - For seeding
   - `MASTER_ADMIN_TENANT_ID` - Default: `qa-dge-tenant`

## Execution Instructions

### Manual QA
1. Navigate to https://100daysandbeyond.com/master-admin
2. Sign in with Clerk test account
3. Execute checklist items for each of the 7 surfaces
4. Capture screenshots and API logs

### Automated QA
```bash
CLERK_SIGN_IN_TOKEN=<token> node scripts/exercise-master-admin-crud.mjs
```

## Findings

(To be filled during execution)

