# BlogAdmin Proof Capture - Execution Guide

**Date**: 2025-11-22  
**Script**: `scripts/capture-blogadmin-proof.mjs`  
**Playwright Spec**: `tests/blog-admin.spec.ts`  
**Status**: Ready for execution with test routes enabled

---

## Prerequisites

1. **Preview Server Running**: Start Vite preview server:
   ```bash
   cd frontend
   npm run preview:test
   # Server should be running on http://127.0.0.1:4173
   ```

2. **Environment Variables**:
   ```bash
   export PLAYWRIGHT_ENABLE_TEST_ROUTES=true
   export VITE_ENABLE_TEST_ROUTES=true
   export MARKETING_BASE_URL=http://127.0.0.1:4173
   ```

---

## Execution Steps

### Option 1: Run Proof Capture Script

```bash
PLAYWRIGHT_ENABLE_TEST_ROUTES=true VITE_ENABLE_TEST_ROUTES=true node scripts/capture-blogadmin-proof.mjs
```

**Expected Output**:
- Screenshots saved to `docs/testing/blog-admin/screenshots/`
- Evidence JSON saved to `docs/testing/blog-admin/proof-evidence.json`
- 7 screenshots covering create/edit/publish workflows

### Option 2: Run Playwright Test Suite

```bash
cd frontend
PLAYWRIGHT_ENABLE_TEST_ROUTES=true npm run test:e2e -- tests/blog-admin.spec.ts
```

**Expected Output**:
- Test results in Playwright HTML report
- Screenshots/videos in `test-results/` directory
- Both test scenarios should PASS

---

## Expected Evidence

### Screenshots (from capture script)
1. `01-new-post-empty.png` - Empty new post form
2. `02-new-post-filled.png` - Form filled with test data
3. `03-publish-confirmation.png` - Publish confirmation dialog
4. `04-publish-success.png` - Success message after publish
5. `05-edit-post-loaded.png` - Existing post loaded for editing
6. `06-edit-post-updated.png` - Post updated with new data
7. `07-draft-saved.png` - Draft save confirmation

### Test Scenarios (from Playwright spec)
1. **Create and publish post** - Creates new post via `/__tests__/admin/blog/new` route
2. **Load and edit existing post** - Loads existing post and saves draft update

---

## Test Routes

The BlogAdmin proof uses test harness routes that bypass authentication:
- `/__tests__/admin/blog/new` - New post creation form
- `/__tests__/admin/blog/{slug}/edit` - Edit existing post form

These routes are only enabled when `PLAYWRIGHT_ENABLE_TEST_ROUTES=true` and `VITE_ENABLE_TEST_ROUTES=true`.

---

## API Mocking

The scripts mock API responses for:
- `POST /api/blog` - Create new blog post
- `GET /api/blog/{slug}` - Get existing blog post
- `PUT /api/blog/{slug}` - Update blog post

Mock responses are defined in both `scripts/capture-blogadmin-proof.mjs` and `tests/blog-admin.spec.ts`.

---

## Troubleshooting

**Issue**: Script fails with "PLAYWRIGHT_ENABLE_TEST_ROUTES=true and VITE_ENABLE_TEST_ROUTES=true must be set"
- **Solution**: Export both environment variables before running the script

**Issue**: Cannot connect to preview server
- **Solution**: Ensure `npm run preview:test` is running on port 4173

**Issue**: Test routes return 404
- **Solution**: Verify `VITE_ENABLE_TEST_ROUTES=true` is set when building/running preview server

**Issue**: Screenshots are blank or missing elements
- **Solution**: Increase wait times in script, ensure page is fully loaded before screenshot

---

## Evidence Verification

After execution, verify:
1. ✅ All 7 screenshots exist in `screenshots/` directory
2. ✅ `proof-evidence.json` contains timestamp and test results
3. ✅ Playwright test suite shows 2/2 tests passing
4. ✅ Screenshots show correct UI states (forms filled, confirmations visible)

---

## Next Steps After Execution

1. Review screenshots for UI correctness
2. Verify API mocks worked correctly (check evidence JSON)
3. Update `docs/testing/blog-admin/2025-11-22/notes.md` with execution summary
4. Proceed to marketing parity backlog items
5. Update README/TODO/BMAD with BlogAdmin proof completion

---

**Generated**: 2025-11-22  
**Status**: Ready for execution

