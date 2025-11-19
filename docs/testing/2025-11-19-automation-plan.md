# Automation & Deployment Follow-Up Plan — 2025-11-19

The next QA wave requires fresh automation evidence plus Render deploy logs once marketing/QA fixes land. Use this guide so reruns feed directly into `docs/tests/` and `docs/deployments/` without guesswork.

## Backend Pytest Smoke
- **Command**:
  ```bash
  cd backend
  pytest --maxfail=1 --disable-warnings | tee ../docs/tests/2025-11-19-backend-smoke.txt
  ```
- **Purpose**: Reconfirm the 1,432 green specs (55 skips) after marketing/manually QA updates touch shared services.
- **Evidence**: Attach `docs/tests/2025-11-19-backend-smoke.txt` to README/FINAL plan once the run is green.

## Frontend Vitest Rerun
- **Command**:
  ```bash
  cd frontend
  npm run test -- --run | tee ../docs/tests/2025-11-19-frontend-vitest-rerun.txt
  ```
- **Focus**: Ensure the RED suites called out in `docs/tests/2025-11-19-frontend-vitest.txt` are resolved; keep MSW fixtures updated so logs remain deterministic.
- **Evidence**: Store the rerun output under `docs/tests/2025-11-19-frontend-vitest-rerun.txt` and link it inside README + BMAD trackers after it passes.

## Master Admin API Smoke\n- **Command**:\n  `ash\n  python -m pytest backend/tests/test_master_admin_api.py | tee docs/tests/2025-11-19-backend-master-admin.txt\n  `\n- **Purpose**: Ensure the 14 primary Master Admin routes stay green after seeding or QA-driven data changes.\n- **Evidence**: Attach docs/tests/2025-11-19-backend-master-admin.txt (and future reruns) to README + FINAL plan whenever data or permissions change.\n\n## Playwright Smoke (Helper Script)
- **Command**:
  ```bash
  node scripts/run-marketing-playwright.mjs | tee docs/tests/2025-11-19-playwright-rerun.txt
  ```
- **CI**: `.github/workflows/marketing-ci.yml` now uses this helper and uploads `marketing-playwright.log` + `playwright-report/` per run. Keep local reruns in `docs/tests/` for manual verification.
- **BlogAdmin proof**: Enable the test harness (`PLAYWRIGHT_ENABLE_TEST_ROUTES=true VITE_ENABLE_TEST_ROUTES=true`) and pass `tests/blog-admin.spec.ts` so only the admin spec runs. Store the log under `docs/tests/<date>-playwright-blog-admin.txt` for BMAD Decide evidence.

## Render Redeploy Checklist
## Master Admin Demo Seeding
- **Command**:
  ```bash
  MASTER_ADMIN_USER_ID=<clerk-id> \
  MASTER_ADMIN_ORG_ID=<organization-id> \
  MASTER_ADMIN_SEED_OUTPUT=docs/testing/master-admin/2025-11-19/data/records.json \
  python scripts/seed_master_admin_demo.py
  ```
- **Purpose**: Populate the required prospects, deals, campaigns, content, leads, and collateral for manual QA. The script writes the created IDs to the specified JSON file so screenshots/logs can reference real records.
- **Evidence**: Commit the JSON summary (with non-sensitive IDs) under `docs/testing/master-admin/2025-11-19/data/records.json` and mention it in README once generated.

## Render Redeploy Checklist
1. **Export secrets** (never commit):
   ```bash
   export RENDER_API_KEY=<provided key>
   export RENDER_SERVICE_ID=srv-d3ii9qk9c44c73aqsli0   # backend by default
   ```
2. **Trigger backend deploy**:
   ```bash
   python trigger_render_deploy.py | tee docs/deployments/2025-11-19-backend-redeploy.txt
   ```
3. **Trigger frontend deploy**:
   ```bash
   RENDER_SERVICE_ID=srv-d3ihptbipnbc73e72ne0    python trigger_render_deploy.py | tee docs/deployments/2025-11-19-frontend-redeploy.txt
   ```
4. **Verify live services**:
   ```bash
   python scripts/verify_deployment.py production | tee docs/deployments/2025-11-19-verify-production.txt
   ```
5. **Update docs**: Reference the new deploy logs from README, FINAL-COMPLETION-PLAN, and BMAD trackers.

> Tip: Set `RENDER_DEPLOY_CACHE=clear_cache` if the deployment needs a clean build. Otherwise the helper defaults to `do_not_clear`.

## Evidence Locations
- `docs/testing/master-admin/2025-11-19/` — manual QA notes/screenshots/logs.
- `docs/testing/lighthouse/<date>/` — created automatically by `scripts/run-lighthouse-axe.mjs`.
- `docs/tests/` — backend/frontend/playwright rerun logs (see commands above).
- `docs/deployments/` — Render trigger + verify logs per redeploy.


