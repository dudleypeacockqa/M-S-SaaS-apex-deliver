# Evidence Collection Master Guide

**Date**: 2025-11-22  
**Purpose**: Comprehensive guide for collecting all required evidence for 100% completion validation  
**Status**: Ready for execution

---

## Overview

This guide consolidates all evidence collection procedures for:
1. Master Admin CRUD operations
2. BlogAdmin proof capture
3. Lighthouse & Axe audits
4. SEO validation

---

## Prerequisites

### Environment Setup
- Node.js 22.13.0+ installed
- Python 3.11+ installed
- Playwright installed (`npm install -g playwright`)
- Lighthouse and Axe CLI installed globally or locally
- Clerk credentials available in `.env-backend.md`

### Required Credentials
- **Clerk Secret Key**: `sk_live_Jc8hTM6uXOtii2mqHMeRoUqADh7o3cp5snh4YEaEMi` (from `.env-backend.md`)
- **Clerk Publishable Key**: `pk_live_Y2xlcmsuZmluYW5jZWZsby5haSQ` (from `.env-frontend.md`)
- **Master Admin User ID**: Required for generating sign-in token

---

## 1. Master Admin CRUD Evidence Collection

### Purpose
Capture evidence of all Master Admin CRUD operations (activities, campaigns, content, leads/collateral)

### Prerequisites
- Clerk sign-in token (generated via Clerk API)
- Master Admin user account with appropriate permissions
- Backend API accessible at `https://ma-saas-backend.onrender.com`

### Execution Steps

#### Step 1: Generate Clerk Sign-In Token

```bash
# Using Clerk API
curl -X POST "https://api.clerk.com/v1/sign_in_tokens" \
  -H "Authorization: Bearer sk_live_Jc8hTM6uXOtii2mqHMeRoUqADh7o3cp5snh4YEaEMi" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"<master_admin_user_id>"}'
```

**Response**: Extract `id` field (this is the sign-in token)

#### Step 2: Execute CRUD Script

```bash
# Set environment variables
export CLERK_SIGN_IN_TOKEN="<token_from_step_1>"
export MASTER_ADMIN_BASE_URL="https://ma-saas-platform.onrender.com"
export API_BASE_URL="https://ma-saas-backend.onrender.com"
export MASTER_ADMIN_TENANT_ID="qa-dge-tenant"

# Run script
node scripts/exercise-master-admin-crud.mjs
```

#### Step 3: Verify Evidence Collection

**Expected Outputs**:
- `docs/testing/master-admin/2025-11-21/crud-evidence/crud-operations.json` - All CRUD operations log
- `docs/testing/master-admin/2025-11-21/crud-evidence/headers.md` - Sanitized curl/JWT examples
- `docs/testing/master-admin/2025-11-21/screenshots/` - Screenshots of operations
- `docs/testing/master-admin/2025-11-21/logs/` - API request/response logs

**Verification Checklist**:
- [ ] All 7 CRUD operations executed (activities, campaigns, content, leads/collateral)
- [ ] JSON log file contains all operations
- [ ] Headers.md updated with sanitized examples
- [ ] Screenshots captured for each operation
- [ ] API logs contain request/response data

#### Step 4: Update Notes

Update `docs/testing/master-admin/2025-11-21/notes.md` with:
- Pass/fail status for each operation
- Any errors encountered
- Screenshot locations
- API log locations

### Troubleshooting

**Issue**: Clerk sign-in token expired
- **Solution**: Tokens expire after ~5 minutes. Generate new token and re-run immediately.

**Issue**: API calls failing with 401/403
- **Solution**: Verify Clerk token is valid and user has master admin permissions.

**Issue**: Screenshots not captured
- **Solution**: Ensure Playwright is running in non-headless mode or check screenshot directory permissions.

---

## 2. BlogAdmin Proof Capture

### Purpose
Capture proof of BlogAdminEditor functionality (screenshots and API mocks)

### Prerequisites
- Vite preview server running on `http://127.0.0.1:4173`
- Test routes enabled via environment variables

### Execution Steps

#### Step 1: Start Preview Server

```bash
cd frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZmluYW5jZWZsby5haSQ npm run preview:test
```

**Verify**: Server should be running on `http://127.0.0.1:4173`

#### Step 2: Verify Test Routes

Check that test routes are accessible:
- `http://127.0.0.1:4173/__tests__/admin/blog/new`
- `http://127.0.0.1:4173/__tests__/admin/blog/edit/1`

#### Step 3: Execute Proof Capture Script

```bash
# In a new terminal
PLAYWRIGHT_ENABLE_TEST_ROUTES=true \
VITE_ENABLE_TEST_ROUTES=true \
MARKETING_BASE_URL=http://127.0.0.1:4173 \
node scripts/capture-blogadmin-proof.mjs
```

#### Step 4: Verify Evidence Collection

**Expected Outputs**:
- `docs/testing/blog-admin/2025-11-22/screenshots/` - 7+ screenshots
- `docs/testing/blog-admin/2025-11-22/proof-evidence.json` - Evidence JSON

**Verification Checklist**:
- [ ] Screenshots captured for create/edit/publish workflows
- [ ] Evidence JSON contains API mock responses
- [ ] All test scenarios covered

#### Step 5: Update Notes

Update `docs/testing/blog-admin/2025-11-22/notes.md` with execution status.

### Troubleshooting

**Issue**: Preview server not starting
- **Solution**: Ensure port 4173 is not in use. Check `npm run preview:test` output.

**Issue**: Test routes not accessible
- **Solution**: Verify `VITE_ENABLE_TEST_ROUTES=true` is set and check `frontend/src/App.tsx` for test route logic.

**Issue**: Playwright script fails
- **Solution**: Ensure Playwright is installed (`npx playwright install`) and browser binaries are available.

---

## 3. Lighthouse & Axe Audits

### Purpose
Run performance and accessibility audits

### Prerequisites
- Preview server running on `http://127.0.0.1:4173`
- Lighthouse and Axe CLI installed

### Execution Steps

#### Step 1: Start Preview Server

```bash
cd frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZmluYW5jZWZsby5haSQ npm run preview:test
```

#### Step 2: Execute Audit Script

```bash
# In a new terminal
node scripts/run-lighthouse-axe.mjs
```

#### Step 3: Handle Windows Permissions (If Needed)

If you encounter `EPERM` errors on Windows:

**Option A**: Run in WSL or Linux environment
```bash
# In WSL
node scripts/run-lighthouse-axe.mjs
```

**Option B**: Manually run commands
```bash
cd frontend
npm run lighthouse:local
npm run axe:local
```

**Option C**: Use Render preview URL
```bash
LIGHTHOUSE_AUDIT_URL=https://financeflo.ai node scripts/run-lighthouse-axe.mjs
```

#### Step 4: Verify Reports

**Expected Outputs**:
- `docs/testing/lighthouse/2025-11-22/lighthouse-local-preview.html`
- `docs/testing/lighthouse/2025-11-22/lighthouse-local-preview.json`
- `docs/testing/axe/2025-11-22/axe-local-preview.json`

**Verification Checklist**:
- [ ] HTML report generated and viewable
- [ ] JSON report contains performance metrics
- [ ] Axe report contains accessibility violations (if any)

#### Step 5: Update Execution Status

Update `docs/testing/lighthouse/2025-11-22/EXECUTION_STATUS.md` with:
- Execution method used
- Any errors encountered
- Report locations
- Key findings

### Troubleshooting

**Issue**: Windows permission errors (EPERM)
- **Solution**: Use Option A, B, or C above. Document workaround in execution status.

**Issue**: Lighthouse/Axe not found
- **Solution**: Install globally (`npm install -g lighthouse @axe-core/cli`) or use npx.

**Issue**: Preview server not accessible
- **Solution**: Verify server is running and accessible at `http://127.0.0.1:4173`.

---

## 4. SEO Validation

### Purpose
Verify SEO metadata, structured data, canonical URLs, sitemap, and robots.txt

### Execution Steps

#### Step 1: Run SEO Validation Tests

```bash
cd frontend
npm run test -- src/__tests__/seo-comprehensive-validation.test.ts --run
```

#### Step 2: Review Test Results

**Expected**: All 18 tests passing

#### Step 3: Review Validation Report

Check `docs/testing/seo/2025-11-22/seo-validation-report.md` for:
- Sitemap validation results
- Robots.txt validation results
- Meta tags validation
- Structured data validation
- Domain consistency

### Troubleshooting

**Issue**: Tests failing
- **Solution**: Review test output and fix issues in sitemap.xml, robots.txt, or component code.

---

## Evidence Archive Locations

### Master Admin Evidence
- **CRUD Operations**: `docs/testing/master-admin/2025-11-21/crud-evidence/`
- **Screenshots**: `docs/testing/master-admin/2025-11-21/screenshots/`
- **API Logs**: `docs/testing/master-admin/2025-11-21/logs/`
- **Headers**: `docs/testing/master-admin/2025-11-21/crud-evidence/headers.md`
- **Notes**: `docs/testing/master-admin/2025-11-21/notes.md`

### BlogAdmin Evidence
- **Screenshots**: `docs/testing/blog-admin/2025-11-22/screenshots/`
- **Evidence JSON**: `docs/testing/blog-admin/2025-11-22/proof-evidence.json`
- **Notes**: `docs/testing/blog-admin/2025-11-22/notes.md`

### Lighthouse & Axe Reports
- **Lighthouse HTML**: `docs/testing/lighthouse/2025-11-22/lighthouse-local-preview.html`
- **Lighthouse JSON**: `docs/testing/lighthouse/2025-11-22/lighthouse-local-preview.json`
- **Axe JSON**: `docs/testing/axe/2025-11-22/axe-local-preview.json`
- **Execution Status**: `docs/testing/lighthouse/2025-11-22/EXECUTION_STATUS.md`

### SEO Validation
- **Validation Report**: `docs/testing/seo/2025-11-22/seo-validation-report.md`
- **Test Results**: Run `npm run test -- src/__tests__/seo-comprehensive-validation.test.ts`

---

## Execution Order

1. **SEO Validation** (Automated, no external resources needed)
2. **BlogAdmin Proof** (Requires preview server)
3. **Lighthouse & Axe** (Requires preview server)
4. **Master Admin CRUD** (Requires Clerk token)

---

## Success Criteria

- ✅ Master Admin CRUD: All 7 operations executed, evidence collected
- ✅ BlogAdmin Proof: Screenshots and evidence JSON captured
- ✅ Lighthouse & Axe: Reports archived (even if manual execution required)
- ✅ SEO Validation: All 18 tests passing

---

**Generated**: 2025-11-22  
**Status**: Ready for execution

