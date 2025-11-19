# Master Admin Manual QA Notes (2025-11-19)

Use this log while executing `docs/testing/2025-11-17-MASTER-ADMIN-VALIDATION-CHECKLIST.md`. Seed data snapshot: `docs/testing/master-admin/2025-11-19/data/records.json` (generated via `python scripts/seed_master_admin_demo.py`).

## Summary
| Surface | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Dashboard & Scores | Seeded data ready | screenshots/01-dashboard.png |  |
| Activity Tracker | Seeded discovery entry | screenshots/02-activity.png |  |
| Pipeline & Prospects | Atlas / Beacon seeded | screenshots/03-pipeline.png |  |
| Campaign Manager | QA Warm Outreach seeded | screenshots/04-campaigns.png |  |
| Content Studio | Script + piece seeded | screenshots/05-content.png |  |
| Lead Capture | QA Expo lead seeded | screenshots/06-lead-capture.png |  |
| Sales Collateral | One-pager seeded | screenshots/07-collateral.png |  |

## 1. Dashboard & Scores
- Open `/master-admin/dashboard` with the seeded master admin account.
- Confirm weekly goal metrics match the seeded goal (target_discoveries=5, etc.).
- Capture `screenshots/01-dashboard.png` and note any discrepancies below.
- Notes:

## 2. Activity Tracker
- Navigate to Activity Tracker; ensure the seeded discovery activity is listed.
- Create + edit an activity via UI to validate CRUD plus streak updates.
- Capture `screenshots/02-activity.png`; store API console output in `logs/backend.log`.
- Notes:

## 3. Pipeline & Prospects
- Confirm Atlas Industrial QA and Beacon Analytics QA appear in the pipeline board.
- Drag cards between stages and edit prospect details; verify API success.
- Capture `screenshots/03-pipeline.png`; record prospect IDs from `data/records.json` here.
- Notes:

## 4. Campaign Manager
- Open QA Warm Outreach and confirm recipient stats (total, sent, opened, clicked) reflect seed data.
- Add a temporary recipient and trigger a resend if possible; verify stats update.
- Capture `screenshots/04-campaigns.png`; log API responses in `logs/backend.log`.
- Notes:

## 5. Content Studio
- Locate Integration Readiness Script + associated video piece.
- Update content metadata and simulate publish to confirm workflow.
- Capture `screenshots/05-content.png`; document any upload/render issues.
- Notes:

## 6. Lead Capture
- Submit a new lead via the UI (use `marketing.qa+lead2@example.com`).
- Confirm it appears beside the seeded QA Expo lead.
- Capture `screenshots/06-lead-capture.png`; sync response details go into `logs/frontend.log`.
- Notes:

## 7. Sales Collateral
- Download the QA Sales One-Pager to verify access controls.
- Upload a new artifact (PDF) to test upload + entitlement flows.
- Capture `screenshots/07-collateral.png`; store upload console output in `logs/frontend.log`.
- Notes:

## Artifact Locations
- Screenshots: `docs/testing/master-admin/2025-11-19/screenshots/`
- Logs: `docs/testing/master-admin/2025-11-19/logs/`
- Seed summaries: `docs/testing/master-admin/2025-11-19/data/records.json`
