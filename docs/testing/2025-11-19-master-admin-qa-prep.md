# Master Admin QA Preparation Checklist (2025-11-19)

The 7-surface Master Admin manual test run still lacks evidence. This prep note captures the access, data, and logging prerequisites so the checklist in `docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md` can be executed without scrambling for credentials or seed data.

## 1. Credentials & Environment Variables
| Item | Location / Value | Notes |
| --- | --- | --- |
| Clerk publishable + secret keys | `FinanceFlo Environment Variables - Master Reference.md` (`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) | Confirm both are present in `.env` for frontend and backend. Tests expect `VITE_CLERK_PUBLISHABLE_KEY` to match the backend JWT verifier. |
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
   - Preferred: run `python scripts/seed_master_admin_demo.py` after exporting `MASTER_ADMIN_USER_ID`, `MASTER_ADMIN_ORG_ID`, and optional `MASTER_ADMIN_SEED_OUTPUT=docs/testing/master-admin/2025-11-19/data/records.json`. The script uses the new `app.services.master_admin_seed_service` helpers to populate the minimum data set and emits the created IDs as JSON.
   - Manual fallback: use the existing fixtures from `backend/tests/test_master_admin_api.py`, `backend/tests/test_campaign_service.py`, and `backend/tests/test_seed_service.py` as templates. Drop into an interactive shell and call `ensure_tenant_admin` (see snippet below) before posting to the `/api/master-admin/*` endpoints.
     ```python
     from app.db.session import SessionLocal
     from app.services.seed_service import TenantSeedConfig, ensure_tenant_admin
     db = SessionLocal()
     ensure_tenant_admin(db, TenantSeedConfig(...))
     ```
   - Populate at least:
     - 3 prospects spread across deal stages.
     - 2 campaigns with scheduled + sent states so campaign analytics render.
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
## 6. Test Account Registry
| Role | Email | Organization ID | Notes |
| --- | --- | --- | --- |
| master_admin | dudley@qamarketing.com | `qa-dge-master` | Created by `backend/scripts/setup_master_admin.py`; has platform scope (no org required) |
| tenant_admin | dudley.peacock@icloud.com | `qa-dge-tenant` | Used for comparison when validating that admins cannot access master-admin routes |
| growth_user | growth.qa@financeflo.ai | `qa-dge-tenant` | Useful for validating scoped views while impersonation header is present |

Store the canonical list (with Clerk user IDs) in 1Password or the secure secret manager referenced in `FinanceFlo Environment Variables - Master Reference.md`, and paste masked IDs into `docs/testing/master-admin/2025-11-19/notes.md` when the run begins.

## 7. Tenant Scope & Header Template
All master-admin API calls must include both the Clerk auth header and the impersonation header. Reference snippet:

```http
GET /api/master-admin/prospects HTTP/1.1
Host: localhost:8000
Authorization: Bearer <CLERK_JWT>
X-Master-Tenant-Id: qa-dge-tenant
```

When testing via the UI, open DevTools → Network and confirm the header is present before logging results. If a different tenant is needed, request the ID via `/api/master-admin/tenants` or query the `organizations` table in Postgres.

## 8. Seed Data Expectations
Populate the following minimum records before test execution and list their identifiers in `docs/testing/master-admin/2025-11-19/notes.md`:

| Surface | Minimum Records | Source |
| --- | --- | --- |
| Prospects & Pipeline | 3 prospects across `qualified`, `negotiation`, `won`; at least 1 deal per stage | `seed_service.ensure_tenant_admin`, `test_master_admin_api` payloads |
| Campaigns | 2 campaigns (one scheduled, one completed) + ≥3 recipients | `seed_service.seed_campaigns` or manual POSTs |
| Content Studio | 1 script + 2 content pieces (video + blog) | Use `/api/master-admin/content-scripts` & `/content-pieces` endpoints |
| Lead Capture | 2 submissions with unique emails | POST `/api/master-admin/lead-captures` |
| Sales Collateral | 1 uploaded asset | POST to `/api/master-admin/collateral` (S3 mock acceptable locally) |

Document record IDs + titles so QA can reference them without re-querying the database.

## 9. Evidence Folder Checklist
Add the following placeholders before testing starts:
- `docs/testing/master-admin/2025-11-19/headers.md` – paste sanitized curl commands or HTTPie snippets showing the required headers.
- `docs/testing/master-admin/2025-11-19/data/records.json` – dump of seeded IDs (prospects, campaigns, scripts, collateral).
- `docs/testing/master-admin/2025-11-19/logs/` – copy of backend + frontend console output captured during the run.

Updating these ahead of time keeps the QA session focused on validation rather than scrambling for artefacts.
## 10. Evidence Folder Inventory
Created `docs/testing/master-admin/2025-11-19/` with ready-made placeholders:
- `notes.md` – per-surface execution log template
- `headers.md` – auth + tenant header cheat sheet
- `data/records.json` – fill with seeded record IDs before running scenarios
- `screenshots/` – drop numbered PNGs referenced in README/TODO
- `logs/.gitkeep` – place backend/frontend console captures here

Update README/TODO once screenshots + logs exist so Wave 2 evidence links straight into this folder.


## 11. API Call Recipes
Use the following `curl`/HTTPie commands (replace tokens/IDs) to seed each surface before executing the checklist. Record the returned IDs inside `docs/testing/master-admin/2025-11-19/data/records.json` and reference them in `notes.md`.

### Prospects & Deals
```bash
# Create prospect
curl -X POST "$BACKEND_URL/api/master-admin/prospects"   -H "Authorization: Bearer $MASTER_ADMIN_TOKEN"   -H "X-Master-Tenant-Id: qa-dge-tenant"   -H "Content-Type: application/json"   -d '{
        "name": "Atlas Industrial QA",
        "stage": "qualified",
        "deal_value": 12000000,
        "probability": 0.35
      }'

# Create pipeline entry for the prospect
curl -X POST "$BACKEND_URL/api/master-admin/deals"   -H "Authorization: Bearer $MASTER_ADMIN_TOKEN"   -H "X-Master-Tenant-Id: qa-dge-tenant"   -H "Content-Type: application/json"   -d '{
        "prospect_id": "<prospect-id>",
        "stage": "negotiation",
        "close_date": "2025-12-15"
      }'
```

### Campaign Manager
```bash
curl -X POST "$BACKEND_URL/api/master-admin/campaigns"   -H "Authorization: Bearer $MASTER_ADMIN_TOKEN"   -H "X-Master-Tenant-Id: qa-dge-tenant"   -H "Content-Type: application/json"   -d '{
        "name": "QA Warm Outreach",
        "channel": "email",
        "schedule_at": "2025-11-20T14:00:00Z",
        "recipients": ["jamie@example.com"]
      }'
```

### Content Studio
```bash
curl -X POST "$BACKEND_URL/api/master-admin/content-scripts"   -H "Authorization: Bearer $MASTER_ADMIN_TOKEN"   -H "X-Master-Tenant-Id: qa-dge-tenant"   -H "Content-Type: application/json"   -d '{
        "title": "Integration Readiness Script",
        "channel": "video",
        "body": "Intro + CTA for portfolio CEOs",
        "status": "draft"
      }'
```

### Lead Capture & Collateral
```bash
# Lead capture submission
curl -X POST "$BACKEND_URL/api/master-admin/lead-captures"   -H "Authorization: Bearer $MASTER_ADMIN_TOKEN"   -H "X-Master-Tenant-Id: qa-dge-tenant"   -H "Content-Type: application/json"   -d '{
        "email": "marketing.qa+lead@example.com",
        "source": "pricing-cta"
      }'

# Collateral upload (HTTPie example for multipart)
http --form POST "$BACKEND_URL/api/master-admin/collateral"   Authorization:"Bearer $MASTER_ADMIN_TOKEN"   X-Master-Tenant-Id:qa-dge-tenant   file@docs/testing/master-admin/2025-11-19/data/sample.pdf
```

Document every created ID inside `data/records.json` so screenshots and notes can reference real records during the QA run. Pair the entries with screenshots/log snippets when executing the checklist.


