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
