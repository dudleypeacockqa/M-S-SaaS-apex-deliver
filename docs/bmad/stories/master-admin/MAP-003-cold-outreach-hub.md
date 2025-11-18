# MAP-003 - Cold Outreach Hub Enablement

**STATUS**: ✅ COMPLETE  
**Evidence**: `test-results/master-admin-outreach-2025-11-18.txt`  
**Last Updated**: 2025-11-18  
**Completion**: 100% – Campaign, Template, and Voice experiences wired end to end with tests

**Story ID**: MAP-003  
**Epic**: Master Admin Portal  
**Methodology**: BMAD v6-alpha · strict TDD

---

## Story

**As a** master admin running multiple sales motions,  
**I want** a unified outreach hub (campaigns, templates, voice calls) gated to my role,  
**so that** I can launch compliant multi-channel playbooks without leaving the portal.

---

## Acceptance Criteria

1. ✅ `/api/master-admin/campaigns/*`, `/templates/*`, and `/voice/*` only resolve for `master_admin` role.
2. ✅ Master Admin UI surfaces Campaign Manager, Template Manager, and Voice Campaign pages behind a feature flag + role gate.
3. ✅ Campaign Manager supports list, create/edit modal, analytics panel, and integrates with new React Query hooks.
4. ✅ Template Manager supports filtering, preview, CRUD, and exposes usable tests instead of placeholders.
5. ✅ Voice Campaign page covers Synthflow agent creation + call initiation + call status polling.
6. ✅ Voice webhook endpoint is mounted under `/api/webhooks/voice/incoming` and persists call lifecycle events.
7. ✅ Scheduling API rejects past timestamps and stores future times consistently (UTC).
8. ✅ Frontend Vitest suites and backend pytest suites cover the new functionality with real assertions.

---

## Tasks / Subtasks

- [x] **Role Enforcement & Routing** (AC 1, 2)
  - [x] Add `master_admin` role to `frontend/src/services/api.ts` helpers.
  - [x] Gate master-admin routes in `App.tsx` with `useCurrentUser` + feature flag.
  - [x] Update FastAPI routers (`campaigns.py`, `templates.py`, `voice.py`) to depend on `get_current_master_admin_user`.
  - [x] Add pytest fixtures for `master_admin_user` and `auth_headers_master_admin`.

- [x] **Campaign Manager UX** (AC 2, 3)
  - [x] Rebuild `CampaignManager.tsx` with filters, analytics cards, and modal form.
  - [x] Connect to new `useCampaigns` React Query hooks that call `/api/master-admin/campaigns`.
  - [x] Replace placeholder Vitest specs with real fetch/create/analytics tests.
  - [x] Fix backend scheduling timezone handling + delete assertions.

- [x] **Template Manager UX** (AC 2, 4)
  - [x] Wire `TemplateManager.tsx` to `/api/master-admin/templates` hooks.
  - [x] Add accessible labels + preview alert text to unblock testing-library queries.
  - [x] Expand Vitest coverage for listing, create modal, preview mutation.
  - [x] Seed backend pytest data so template endpoints return real rows.

- [x] **Voice Campaign Delivery** (AC 2, 5, 6)
  - [x] Wire `VoiceCampaign.tsx` modals with accessible labels and React Query hooks.
  - [x] Swap placeholder Vitest cases for agent creation, call initiation, and status display flows.
  - [x] Add `_MockResponse` helpers + fixtures so voice pytest suite exercises API routes without external calls.
  - [x] Promote webhook handler (`app/api/webhooks/voice.py`) and register it with the main API router.

- [x] **Testing & Evidence** (AC 7, 8)
  - [x] Frontend: `npm run test -- --run src/pages/master-admin/__tests__/CampaignManager.test.tsx src/pages/master-admin/__tests__/TemplateManager.test.tsx src/pages/master-admin/__tests__/VoiceCampaign.test.tsx` (PASS).
  - [x] Backend: `backend/venv/Scripts/python -m pytest backend/tests/api/test_campaigns.py backend/tests/api/test_templates.py backend/tests/api/test_voice.py` (PASS).
  - [x] Logged both commands + statuses in `test-results/master-admin-outreach-2025-11-18.txt`.

---

## Dev Notes

- **Frontend**
  - Files touched: `frontend/src/pages/master-admin/{CampaignManager,TemplateManager,VoiceCampaign}.tsx`, React Query hooks, API clients.
  - Added accessible `label`/`htmlFor` wiring so Testing Library can locate inputs.
  - Hooks now hit `/api/master-admin/*` paths and return typed payloads from `apiClient` (no `.data` misuse).
  - Vitest suites mock API modules and assert actual behavior (fetch, mutate, analytics draw).

- **Backend**
  - `campaign_service.schedule_campaign` now normalizes to UTC and rejects past timestamps reliably.
  - Added `voice_service` metadata fixes and `voice_webhook` router so `/api/webhooks/voice/incoming` is reachable.
  - API pytest suites seed data via helper factories; delete tests expunge objects before verifying `Session.get` result.
  - Voice tests rely on `_MockResponse` to avoid real Synthflow calls yet assert payload content.

---

## QA / Testing Evidence

See `test-results/master-admin-outreach-2025-11-18.txt` for command output.

| Suite | Command | Result |
|-------|---------|--------|
| Frontend Vitest | `npm run test -- --run src/pages/master-admin/__tests__/CampaignManager.test.tsx src/pages/master-admin/__tests__/TemplateManager.test.tsx src/pages/master-admin/__tests__/VoiceCampaign.test.tsx` | ✅ All 9 specs pass |
| Backend Pytest | `backend/venv/Scripts/python -m pytest backend/tests/api/test_campaigns.py backend/tests/api/test_templates.py backend/tests/api/test_voice.py` | ✅ 19 tests pass |

---

## Next Steps

1. Extend Voice Campaigns with Synthflow call transcript streaming + UI playback.
2. Add master-admin level analytics (cross-campaign funnels) in MAP-004.
3. Wire SendGrid/Twilio integration stubs to replace TODOs in `campaign_service`.

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-18 | 1.0 | Initial story documenting Cold Outreach Hub delivery | Codex Agent |

