# Master Admin Validation Checklist - Session 2025-11-22

Based on `docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md`. Use this copy to track the 2025-11-22 evidence.

## Pre-flight
- [ ] Confirm `.env`/Render secrets match QA workspace (see `.env-backend.md`, `env.READY_TO_USE`)
- [ ] Sign into Clerk as `dudley@qamarketing.com` (obtain sign-in token)
- [ ] Record JWT + `X-Master-Tenant-Id` header in headers.md (API samples)
- [ ] Seed test data using `scripts/seed_master_admin_demo.py` with `MASTER_ADMIN_USER_ID`

## Surfaces
1. **Dashboard (`/master-admin`)**
   - [ ] Auth required redirect works (auto-login via `__clerk_ticket`)
   - [ ] Score + streak cards visible (screenshot: `screenshots/01-dashboard.png`)
   - [ ] Stat cards load with data
   - [ ] API `/api/master-admin/dashboard` = 200 (log: `logs/backend-dashboard.json`)
   - Notes: 

2. **Activity Tracker**
   - [ ] List renders seeded activity (screenshot: `screenshots/02-activity.png`)
   - [ ] Create/edit/delete validated
   - [ ] API `/api/master-admin/activities` success (log: `logs/backend-activities.json`)
   - Notes: 

3. **Prospect Pipeline**
   - [ ] Board shows seeded prospects (screenshot: `screenshots/03-pipeline.png`)
   - [ ] Drag/drop updates stages
   - [ ] `/api/master-admin/prospects` calls succeed (log: `logs/backend-prospects.json`)
   - Notes: 

4. **Campaign Manager**
   - [ ] QA Warm Outreach campaign loads stats (screenshot: `screenshots/04-campaigns.png`)
   - [ ] Recipient interaction recorded
   - [ ] `/api/master-admin/campaigns` success (log: `logs/backend-campaigns.json`)
   - Notes: 

5. **Content Studio**
   - [ ] Script + piece show filters (screenshot: `screenshots/05-content.png`)
   - [ ] CRUD smoke succeeds
   - [ ] `/api/master-admin/content*` success (log: `logs/backend-content-scripts.json`, `backend-content-pieces.json`)
   - Notes: 

6. **Lead Capture**
   - [ ] Charts reflect seeded submissions (screenshot: `screenshots/06-leads.png`)
   - [ ] Manual submission works
   - [ ] `/api/master-admin/lead-captures` success (log: `logs/backend-leads.json`)
   - Notes: 

7. **Sales Collateral**
   - [ ] Files listing renders (screenshot: `screenshots/07-collateral.png`)
   - [ ] Upload/download verified
   - [ ] `/api/master-admin/collateral` success (log: `logs/backend-collateral.json`)
   - Notes: 

## Post-run
- [ ] Upload screenshots to `screenshots/`
- [ ] Store HAR/backend logs under `logs/`
- [ ] Update docs/bmad/DAILY_STATUS_NOTES.md with findings
- [ ] Run automated script: `CLERK_SIGN_IN_TOKEN=<token> node scripts/exercise-master-admin-crud.mjs`
- [ ] Archive CRUD evidence to `crud-evidence/`

## Status
**Current**: Setup complete, awaiting Clerk token for execution  
**Next**: Execute checklist once Clerk token obtained

