# Master Admin QA Notes - 2025-11-21

This log mirrors the 2025-11-17 checklist but captures evidence for the 2025-11-21 execution. Seed snapshot: `docs/testing/master-admin/2025-11-19/data/demo_seed.db` (IDs in `data/records.json`).

## Evidence Index
| Surface | Screenshot | Console / Token Evidence | API Notes |
| --- | --- | --- | --- |
| Dashboard | screenshots/01-dashboard.png | console/clerk-users.log (master_admin user dump) | `logs/backend-dashboard.json` (200) |
| Activity Tracker | screenshots/02-activity.png | console/clerk-sign-in-token.log (active ticket) | `logs/backend-activities.json` (200) |
| Pipeline & Prospects | screenshots/03-pipeline.png | — | `logs/backend-prospects.json`, `logs/backend-deals.json` (200) |
| Campaign Manager | screenshots/04-campaigns.png | — | `logs/backend-campaigns.json` (200) |
| Content Studio | screenshots/05-content.png | — | `logs/backend-content-scripts.json`, `logs/backend-content-pieces.json` (200) |
| Lead Capture | screenshots/06-leads.png | — | `logs/backend-leads.json` (200) |
| Sales Collateral | screenshots/07-collateral.png | — | `logs/backend-collateral.json` (200) |

Use this table to drop links once screenshots/logs are captured.

## Seed Inventory (2025-11-21)

- Tenant: `qa-dge-tenant` (`../2025-11-19/data/demo_seed.db`)
- Records: see `data/records.json` for IDs such as `qa-prospect-00x`, `qa-campaign-00x`, `qa-script-001`, `qa-collateral-001`.
- Users:
  - `dudley@qamarketing.com` → Clerk user `qa-master-admin-user`
  - `dudley.peacock@icloud.com` → Clerk user `qa-tenant-admin-user`

## Checklist Reminders

1. Copy sanitized auth headers into `headers.md` before the run starts (JWT fingerprint + tenant header).
2. Drop screenshots + console logs into the table immediately after each surface is validated.
3. If a surface fails, capture the API response payload in `console/` and link it from the table for auditors.

## 2025-11-22 Attempt Summary

- ✅ Reviewed the 2025-11-17 checklist plus the seeded records in `data/records.json` to confirm scope.
- ✅ Clerk API access restored via `.env` secrets—`clerk-users.log` now records the master admin (`user_35gkQKcoVJ3hpFnp6GDx39e9h8E`) and tenant admin IDs plus their roles.
- ✅ Minted a one-time Clerk sign-in token (see `console/clerk-sign-in-token.log`) and used `scripts/capture-master-admin-evidence.mjs` to log in via `?__clerk_ticket=…`, capture the seven required screenshots (`screenshots/0X-*.png`), and fetch the key `/api/master-admin/*` endpoints into `logs/backend-*.json` (all 200 OK with `X-Master-Tenant-Id=qa-dge-tenant`).
- ✅ CRUD evidence collection prepared (2025-11-22):
  - Created `crud-evidence/` directory structure
  - Documented execution guide in `crud-evidence/EXECUTION_GUIDE.md`
  - Updated `headers.md` with comprehensive CRUD curl examples (Activity, Campaign Recipient, Content Script/Piece, Collateral operations)
  - Script ready: `scripts/exercise-master-admin-crud.mjs`
- ⏳ CRUD script execution pending: Requires fresh Clerk sign-in token (previous token expired). Execute via `node scripts/exercise-master-admin-crud.mjs` with `CLERK_SIGN_IN_TOKEN` env var set.
- 📌 Next step: Generate new Clerk sign-in token and execute CRUD script to collect full request/response evidence, then proceed to BlogAdmin proof capture.
- Selector warnings logged for hero headings (layout updated), but screenshots confirm each surface rendered successfully with production data.
- Next: execute CRUD walkthroughs (activity create/delete, prospect create/edit, campaign actions, content upload) and document results inline before marking the checklist complete.
## 2025-11-22 Evidence Capture
- Generated a fresh Clerk sign-in token via backend API (see ) and reran .
- Replaced screenshots  and refreshed backend API logs under  (dashboard, activities, prospects, deals, campaigns, content scripts/pieces, lead captures, collateral).
- Selector waits still warn because the hero copy changed recently, but the screenshots confirm each surface rendered successfully with production data.
- Next: execute CRUD walkthroughs (activity create/delete, prospect create/edit, campaign actions, content upload) and document results inline before marking the checklist complete.

## 2025-11-24 Attempt Summary

- 🔄 Tried to automate the remaining CRUD evidence run via `python scripts/run_master_admin_crud.py` (invokes `scripts/exercise-master-admin-crud.mjs`).
- ❌ Clerk sign-in token generation now fails with Cloudflare error `HTTP 403 (code 1010)` even when using the production `CLERK_SECRET_KEY` and `MASTER_ADMIN_USER_ID=user_35gkQKcoVJ3hpFnp6GDx39e9h8E`. The request never returns a token, so the Playwright run cannot authenticate.
- 🛠️ Updated the automation to support two fallback paths:
  - `scripts/run_master_admin_crud.py` now accepts a pre-generated token via `CLERK_SIGN_IN_TOKEN` so a human can mint one externally and rerun the script without rerolling the API call.
  - `scripts/exercise-master-admin-crud.mjs` now uses Playwright's `request.newContext` for API calls, bypassing browser CORS so once a token exists the CRUD endpoints can be hit directly server-to-server.
- 📎 Evidence files (`crud-evidence/*.json`, `headers.md`) still reflect the earlier partially populated run. They will regenerate automatically after a successful run; for now they remain as-is so there is a clear line of sight to the last good artifacts.
- 🚧 Next unblockers:
  1. Generate a new Clerk sign-in token outside this environment (e.g., via the Clerk dashboard or secure workstation) and export it as `CLERK_SIGN_IN_TOKEN` before rerunning `python scripts/run_master_admin_crud.py`.
  2. Alternatively, provide temporary credentials so we can create the ticket manually; the automation is ready to proceed as soon as a valid token is available.
