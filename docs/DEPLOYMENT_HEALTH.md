# Deployment Health Status

**Last Updated**: 2025-10-29 10:12 UTC
**Status**: Attention Required

The platform remains operational, but the latest full backend regression surfaced two failing tests in the podcast quota/thumbnail flows. Targeted document-room suites are all green, and frontend Vitest continues to pass. See "Outstanding Issues" below for remediation items before the next Render deploy.

---

## Test Matrix

### Backend
- Command: `../backend/venv/Scripts/python.exe -m pytest --maxfail=1 --disable-warnings`
- Result (2025-10-29 10:10 UTC): **FAILED** – `tests/test_quota_service.py::TestGetQuotaSummary::test_includes_period_bounds_for_monthly_reset` (missing `period_start` attribute) and `tests/test_podcast_api.py::TestThumbnailGeneration::test_generate_thumbnail_premium_success` (route missing `generate_thumbnail`).
- Targeted Suites:
  - `../backend/venv/Scripts/python.exe -m pytest tests/test_document_endpoints.py -k "permission or audit" --maxfail=1 --disable-warnings` → 10 passed / 0 failed.
  - `../backend/venv/Scripts/python.exe -m pytest tests/test_quota_service.py -k period --maxfail=1 --disable-warnings` → 1 passed / 0 failed.
- Skips: 38 integration tests requiring external OAuth credentials (NetSuite, QuickBooks, Sage, Xero).

### Frontend
- Command: `npm --prefix frontend run test -- --pool=forks --maxWorkers=1`
- Result (2025-10-29 08:45 UTC): **533 passed / 3 skipped** (skips = responsive snapshot placeholders).
- Build: `npm --prefix frontend run build` → succeeded with existing chunk warnings.

---

## Render Deployment Snapshot
- Backend Service: https://ma-saas-backend.onrender.com — `/health` 200 OK @ 2025-10-29 08:48 UTC.
- Frontend Service: https://apexdeliver.com — curl still returns Cloudflare 403; manual browser check required before release.
- Auto-deploy: Enabled on push to `main`.
- Last recorded deploy: 2025-10-29 10:15 UTC (commit `8338a8d`). No deploy triggered since the failing tests were identified.

---

## Outstanding Issues
1. Quota summary fields – ensure `PodcastQuotaSummary` exposes `period_start` / `period_end` in all code paths so `tests/test_quota_service.py::TestGetQuotaSummary::test_includes_period_bounds_for_monthly_reset` passes.
2. Thumbnail generation stub – `tests/test_podcast_api.py::TestThumbnailGeneration::test_generate_thumbnail_premium_success` expects `app.api.routes.podcasts.generate_thumbnail`; implement the helper or adjust tests to match the current architecture.
3. Render smoke evidence – after resolving the above failures, rerun `scripts/run_smoke_tests.sh production` and append the latest output here.

---

## Recent Successes
- Document & Data Room permission flows now enforce listing, bulk download, and revocation audits (DEV-008).
- Targeted backend suites covering document permissions, audit logs, and bulk operations are 100% green.

---

**Next Checkpoint**: Fix the outstanding backend failures, rerun full backend + frontend suites, refresh this document with the updated metrics, and execute the Render smoke script before promoting any release.
