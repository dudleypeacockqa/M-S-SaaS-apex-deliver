# Master Admin Validation Checklist - Session 2025-11-21

Based on `docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md`. Use this copy to track the 2025-11-21 evidence.

## Pre-flight
- [x] Confirm `.env`/Render secrets match QA workspace (see `.env-backend.md`, `env.READY_TO_USE`)
- [x] Sign into Clerk as `dudley@qamarketing.com` (2025-11-22 sign-in token logged in `console/clerk-sign-in-token.log`)
- [ ] Record JWT + `X-Master-Tenant-Id` header in headers.md (API samples still pending)

## Surfaces
1. **Dashboard (`/master-admin`)**
   - [x] Auth required redirect works (auto-login via `__clerk_ticket`)
   - [x] Score + streak cards visible (see `screenshots/01-dashboard.png`)
   - [x] Stat cards load with data
   - [x] API `/api/master-admin/dashboard` = 200 (`logs/backend-dashboard.json`)
   - Notes: Screenshot + JSON captured via `scripts/capture-master-admin-evidence.mjs`
2. **Activity Tracker**
   - [x] List renders seeded activity (`screenshots/02-activity.png`)
   - [ ] Create/edit/delete validated
   - [x] API `/api/master-admin/activities` success (`logs/backend-activities.json`)
   - Notes: Needs CRUD actions logged separately
3. **Prospect Pipeline**
   - [x] Board shows seeded prospects (`screenshots/03-pipeline.png`)
   - [ ] Drag/drop updates stages
   - [x] `/api/master-admin/prospects` calls succeed (`logs/backend-prospects.json`, `backend-deals.json`)
   - Notes: Drag/drop validation pending
4. **Campaign Manager**
   - [x] QA Warm Outreach campaign loads stats (`screenshots/04-campaigns.png`)
   - [ ] Recipient interaction recorded
   - [x] `/api/master-admin/campaigns` success (`logs/backend-campaigns.json`)
   - Notes:
5. **Content Studio**
   - [x] Script + piece show filters (`screenshots/05-content.png`)
   - [ ] CRUD smoke succeeds
   - [x] `/api/master-admin/content*` success (`logs/backend-content-scripts.json`, `backend-content-pieces.json`)
   - Notes: Need to record new script/piece creation
6. **Lead Capture**
   - [x] Charts reflect seeded submissions (`screenshots/06-leads.png`)
   - [ ] Manual submission works
   - [x] `/api/master-admin/lead-captures` success (`logs/backend-leads.json`)
   - Notes:
7. **Sales Collateral**
   - [x] Files listing renders (`screenshots/07-collateral.png`)
   - [ ] Upload/download verified
   - [x] `/api/master-admin/collateral` success (`logs/backend-collateral.json`)
   - Notes:

## Post-run
- [ ] Upload screenshots to `screenshots/`
- [ ] Store HAR/backend logs under `logs/`
- [ ] Update docs/bmad/DAILY_STATUS_NOTES.md with findings
