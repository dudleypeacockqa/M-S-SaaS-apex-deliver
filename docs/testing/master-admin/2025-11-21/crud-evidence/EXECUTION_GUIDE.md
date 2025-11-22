# Master Admin CRUD Evidence Collection - Execution Guide

**Date**: 2025-11-22  
**Script**: `scripts/exercise-master-admin-crud.mjs`  
**Status**: Ready for execution with Clerk credentials

---

## Prerequisites

1. **Clerk Sign-In Token**: Generate a new sign-in token via Clerk API:
   ```bash
   curl -X POST "https://api.clerk.com/v1/sign_in_tokens" \
     -H "Authorization: Bearer sk_live_REDACTED" \
     -H "Content-Type: application/json" \
     -d '{"user_id":"user_35gkQKcoVJ3hpFnp6GDx39e9h8E"}'
   ```

2. **Environment Variables**:
   ```bash
   export CLERK_SIGN_IN_TOKEN="<token_from_clerk_api>"
   export MASTER_ADMIN_BASE_URL="https://ma-saas-platform.onrender.com"
   export API_BASE_URL="https://ma-saas-backend.onrender.com"
   export MASTER_ADMIN_TENANT_ID="qa-dge-tenant"
   ```

---

## Execution Steps

1. **Generate Clerk Sign-In Token** (if not already available):
   - Use Clerk API to create sign-in token for master admin user
   - Token expires after ~5 minutes, so execute script immediately

2. **Run CRUD Script**:
   ```bash
   node scripts/exercise-master-admin-crud.mjs
   ```

3. **Verify Evidence Collection**:
   - Check `crud-evidence/crud-operations.json` for all operations
   - Verify `headers.md` has been updated with sanitized curl examples
   - Review screenshots/logs in parent directory

---

## Expected CRUD Operations

The script exercises the following operations:

### 1. Activity CRUD
- ✅ CREATE: POST `/api/master-admin/activities`
- ✅ UPDATE: PUT `/api/master-admin/activities/{id}`
- ✅ DELETE: DELETE `/api/master-admin/activities/{id}`

### 2. Campaign Recipient Operations
- ✅ LIST: GET `/api/master-admin/campaigns`
- ✅ LIST_RECIPIENTS: GET `/api/master-admin/campaigns/{id}/recipients`
- ✅ CREATE_RECIPIENT: POST `/api/master-admin/campaigns/{id}/recipients`

### 3. Content CRUD
- ✅ CREATE_SCRIPT: POST `/api/master-admin/content/scripts`
- ✅ UPDATE_SCRIPT: PUT `/api/master-admin/content/scripts/{id}`
- ✅ CREATE_PIECE: POST `/api/master-admin/content/pieces`
- ✅ UPDATE_PIECE: PUT `/api/master-admin/content/pieces/{id}`
- ✅ DELETE_PIECE: DELETE `/api/master-admin/content/pieces/{id}`
- ✅ DELETE_SCRIPT: DELETE `/api/master-admin/content/scripts/{id}`

### 4. Collateral Operations
- ✅ LIST: GET `/api/master-admin/collateral`
- ⚠️ UPLOAD/DOWNLOAD: Requires manual file verification

---

## Evidence Output

After execution, the following files will be created:

- `crud-evidence/crud-operations.json` - Full request/response evidence for all CRUD operations
- `headers.md` (updated) - Sanitized curl/JWT examples for each operation
- Console output - Logs of all API calls and responses

---

## Troubleshooting

**Issue**: Script fails with "CLERK_SIGN_IN_TOKEN env var is required"
- **Solution**: Export the token before running: `export CLERK_SIGN_IN_TOKEN="<token>"`

**Issue**: API calls return 401 Unauthorized
- **Solution**: Token may have expired. Generate a new sign-in token and retry.

**Issue**: API calls return 404 Not Found
- **Solution**: Verify `MASTER_ADMIN_BASE_URL` and `API_BASE_URL` are correct.

**Issue**: Tenant ID mismatch
- **Solution**: Ensure `MASTER_ADMIN_TENANT_ID` matches seeded tenant (`qa-dge-tenant`).

---

## Next Steps After Execution

1. Review `crud-operations.json` for any failed operations
2. Update `notes.md` with execution summary
3. Update `headers.md` with sanitized curl examples (if script didn't auto-update)
4. Proceed to BlogAdmin proof capture
5. Update README/TODO/BMAD with CRUD evidence completion

---

**Generated**: 2025-11-22  
**Status**: Ready for execution

