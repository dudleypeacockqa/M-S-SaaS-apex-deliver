# Master Admin QA Preparation Checklist (2025-11-19)

The 7-surface Master Admin manual test run still lacks evidence. This prep note captures the access, data, and logging prerequisites so the checklist in `docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md` can be executed without scrambling for credentials or seed data.

## 1. Credentials & Environment Variables
| Item | Location / Value | Notes |
| --- | --- | --- |
| Clerk publishable + secret keys | `ApexDeliver Environment Variables - Master Reference.md` (`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) | Confirm both are present in `.env` for frontend and backend. Tests expect `VITE_CLERK_PUBLISHABLE_KEY` to match the backend JWT verifier. |
| Master admin emails | `backend/scripts/setup_master_admin.py` | Script promotes `dudley@qamarketing.com` to `master_admin` and `dudley.peacock@icloud.com` to tenant admin. Update the script if QA will use different test users. |
| Feature flag toggles | `render.yaml` + `.env` (`VITE_ENABLE_MASTER_ADMIN=true`, `CLERK_SIGN_IN_URL`, `CLERK_SIGN_UP_URL`) | Verify the flag is still enabled in production and in any preview builds used for QA. |
| Storage + AI API keys | `.env` (`OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `SUPABASE_*`) | Manual QA touches campaigns/content studio flows that call AI helpers and Supabase storage. Leave the keys populated even if traffic stays in sandbox mode. |

## 2. Data & Seed Preparation
1. **Promote the baseline users**
   ```bash
   python backend/scripts/setup_master_admin.py
   ```
   - Ensures at least one platform-wide `master_admin` and one tenant-scoped admin exist.
   - Check the script output for `Updated <email> to master_admin role` and `Created test organization` messages.
2. **Verify tenant records**
   - Hit `GET /api/master-admin/prospects` with the master admin token to confirm a tenant is selected via the `X-Master-Tenant-Id` header.
   - Use `backend/tests/conftest.py::master_admin_headers` as the contract for required headers (Auth + tenant scope).
3. **Seed demo records for each surface** (Prospects, Pipeline, Campaigns, Content, Lead Capture, Collateral).
   - Use the existing fixtures from `backend/tests/test_master_admin_api.py`, `backend/tests/test_campaign_service.py`, and `backend/tests/test_seed_service.py` as templates.
   - When running locally, drop into an interactive shell and call service helpers:
     ```python
     from app.db.session import SessionLocal
     from app.services.seed_service import TenantSeedConfig, ensure_tenant_admin
     db = SessionLocal()
     ensure_tenant_admin(db, TenantSeedConfig(...))
     ```
   - Populate at least:
     - 3 prospects spread across deal stages.
     - 2 campaigns with scheduled + completed states so campaign analytics render.
     - A few content pieces (video, blog, script) to exercise Content Studio filters.
     - Lead capture submissions so charts and GoHighLevel sync indicators populate.
     - 1-2 files in Sales Collateral to validate upload/download flows.
4. **Background tasks**
   - Optional but recommended: start Celery workers so campaign + email tasks can transition in real time.
     ```bash
     cd backend
     celery -A app.worker.celery_app worker --loglevel=info
     ```
   - For scheduled jobs (`process_scheduled_campaigns_task`, `process_email_queue_task`), manual QA can trigger the FastAPI endpoints directly instead of waiting on Celery beat.

## 3. Frontend / Backend Pre-flight
- **Backend**: `cd backend && uvicorn app.main:app --reload` (or confirm Render production is healthy via `docs/deployments/2025-11-17-backend-verify.txt`).
- **Frontend**: `cd frontend && npm run preview:test` to ensure Vite serves `/master-admin/*` without CORS or asset issues.
- **Feature toggles**: visit `/api/master-admin/dashboard` locally to verify 200 OK before handing the environment to QA.
- **Clerk**: log into `https://accounts.clerk.dev` with the QA workspace and confirm the test accounts carry the correct `public_metadata.role` and organization assignments.

## 4. Evidence Capture Plan
Create a dated folder so screenshots, HAR files, and notes are collocated:
```
docs/testing/master-admin/2025-11-19/
├── notes.md (per-surface steps + observations)
├── screenshots/
│   ├── 01-dashboard.png
│   └── 02-activity.png
├── console/
│   ├── backend.log
│   └── frontend.log
└── data/
    └── exported-json/ (optional API responses)
```
- Use the existing checklist file for step-by-step validation and reference this prep doc at the top of that file.
- Capture Clerk session IDs or masked HAR exports when auth issues occur to speed up debugging.

## 5. Next Steps Before Executing QA
1. [ ] Populate this folder with the seeded tenant/org IDs and Clerk user IDs that will be used during testing.
2. [ ] Document how to switch tenants via `X-Master-Tenant-Id` (include sample header values).
3. [ ] Attach links to the marketing Playwright log (`docs/tests/2025-11-19-playwright.txt`) so reviewers know automation was green before QA started.
4. [ ] Once the above are in place, begin executing `docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md` and capture evidence under `docs/testing/master-admin/2025-11-19/`.
