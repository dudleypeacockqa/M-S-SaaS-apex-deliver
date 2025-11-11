# 100% Project Completion Plan
**Project**: M&A Intelligence Platform (ApexDeliver)
**Last Updated**: 2025-11-12 00:10 UTC
**Methodology**: BMAD v6-alpha + TDD (RED -> GREEN -> REFACTOR)

---

## Current Delivery Snapshot (2025-11-12 00:10 UTC)
- **Backend tests**: ✅ `venv/Scripts/python.exe -m pytest tests/test_billing_endpoints.py tests/test_subscription_error_paths.py --cov …` against Render Postgres → 26 pass / 4 skip, routes 79% cov, service 59% cov. Full suite (681 pass / 74 skip) still last confirmed 2025-11-10; coverage uplift work not started.
- **Frontend tests**: 🔴 Only targeted suites (valuation 13/13, podcast 26/26) rerun; full `npm run test -- --runInBand --coverage` outstanding until DEV-008/016/018 implementations land.
- **Deployment**: 🟠 Backend service `srv-d3ii9qk9c44c73aqsli0` remains on deploy `dep-d492u7ag0ims73e3mkc0` (commit `64ad4fb5`). Frontend service `srv-d3ihptbipnbc73e72ne0` deploy `dep-d492tq2g0ims73e3miig` is stuck `build_in_progress`. Latest evidence captured in `docs/DEPLOYMENT_HEALTH.md`; redeploy + log capture still required.
- **Git state**: `HEAD` `a027963 docs(bmad): add Session 2025-11-11C - Phase 2 Complete Summary` matches `origin/main`, but >900 files remain dirty across `.bmad`, backend migrations/tests, frontend document/deal-matching UIs, and deployment docs.
- **Migrations**: ✅ `alembic upgrade head` executed 2025-11-10 21:45 UTC directly against Render Postgres → head `dc2c0f69c1b1`. Needs rerun after next deploy push.
- **BMAD artefacts**: Tracker updated through Session 2025-11-10K; workflow file still references phase-completion summary and does **not** reflect the current migration/deploy loop. `npx bmad-method workflow-init` remains unavailable in this shell.

### Dirty Tree Mapping (2025-11-12 00:00 UTC)
- `.bmad/**` manifests + docs - BMAD v6 install plus session logs still uncommitted upstream.
- `backend/app/api/routes/podcasts.py`, `backend/tests/test_podcast_api.py`, `backend/app/services/transcription_service.py` - DEV-016 video/transcription + quota reset WIP.
- `backend/alembic/versions/*.py` - uuid->string chain rewrite plus merge migrations awaiting Postgres verification.
- `frontend/src/components/documents/**`, `frontend/src/services/api/documents.ts` - DEV-008 document room UI + API binding stubs.
- `frontend/src/pages/deals/MatchingWorkspace.tsx`, `.test.tsx`, `frontend/src/services/dealMatchingService.ts` - DEV-018 criteria builder + analytics in progress, currently failing Vitest.
- Deployment artifacts (`scripts/verify_deployment*.py`, `docs/DEPLOYMENT_HEALTH.md`, `latest-deploy*.json`) - need refreshed evidence post redeploy.

---

## Critical Unfinished Workstreams (ordered)

### 1. DEV-008 Secure Document & Data Room (P0)
- **Status**: Backend endpoints verified; frontend document workspace still outstanding (no FolderTree/PermissionModal/Upload UI).
- **Actions**:
  - Draft RED Vitest specs for folder navigation, permission management, upload progress, and bulk actions.
  - Implement React components (FolderTree, DocumentList, PermissionModal, UploadPanel, BulkActionsToolbar) and integrate with `documents.ts` API.
  - Add regression coverage for search, previews, and audit log exports; update story + BMAD docs when green.
  - **TDD cadence**: Begin with failing specs in `frontend/src/components/documents/*.test.tsx`, drive UI through GREEN, then refactor shared hooks (`useDocumentRoom`) for reuse.

### 2. DEV-016 Podcast Studio Subscription Add-On (P0)
- **Status**: Audio upload + quota gating live; video upload, transcription, YouTube metadata sync, and live streaming still pending.
- **Actions**:
  - Implement video upload modal + backend endpoint with tier enforcement and tests.
  - Integrate Whisper transcription pipeline, monthly quota reset, and upgrade CTA telemetry.
  - Reach >=90% backend / >=85% frontend coverage; document artefacts and ops guides.
  - **TDD cadence**: Extend `backend/tests/test_podcast_api.py` and `frontend/src/components/podcast/VideoUploadModal.test.tsx` first (RED), then wire new services until suites pass.

### 3. DEV-018 Intelligent Deal Matching (P0)
- **Status**: Backend + current frontend suites green; criteria builder modal, analytics workspace, and match actions still pending.
- **Actions**:
  - Build criteria builder modal (form + validation) and integrate with React Query caches.
  - Implement match action workflows (save/pass/request intro) with backend wiring and Vitest coverage.
  - Add analytics dashboard widgets and update story/PRD artefacts upon completion.
  - **TDD cadence**: Add failing specs in `frontend/src/pages/deals/MatchingWorkspace.test.tsx` for pending behaviors before touching implementation; keep React Query mocks centralised.

### 4. MARK-002 Enhanced Marketing Website (P1)
- **Status**: Phase 2/10 complete; remaining SEO, Lighthouse, asset pipeline outstanding.
- **Actions**:
  - Finish phases 3-10 with Vitest + Lighthouse evidence; update marketing docs/asset inventory.
  - Align Render preview assets and capture screenshots for release notes.
  - **TDD cadence**: Continue component-by-component RED->GREEN loops; archive Lighthouse + Vitest outputs per phase under `docs/marketing/`.

- **Status**: Backend stuck on commit `64ad4fb5`, frontend deploy pending; smoke artefacts updated with latest Postgres verification but redeploy evidence missing.
- **Actions**:
  - Refresh `.env` secrets, rerun `scripts/run_smoke_tests.sh production`, and capture outputs in `DEPLOYMENT_HEALTH.md` + `PRODUCTION_DEPLOYMENT_CHECKLIST.md`.
  - Apply outstanding migrations in staging, confirm worker configs, update monitoring alerts.
  - Prepare release notes/PR summary once functional work converges.
  - **TDD cadence**: Treat smoke + migration verification scripts as test harnesses-run them RED first (expected failures) before attempting redeploy.

### 6. Final QA, Documentation, and Handover (P0)
- **Status**: Blocked by DEV-008/DEV-016/DEV-018 completion.
- **Actions**:
  - Run full backend pytest, full Vitest with coverage, `npm run lint`, `npm run build`, `uvicorn` + `npm run preview` smoke.
  - Update BMAD tracker, workflow status, story artefacts, release notes, ops checklists.
  - Confirm Render deployment health 100% (evidence: smoke logs, coverage reports, screenshots).
  - **TDD cadence**: Capture baseline RED by re-running whole-suite commands now (expect failures) to document delta before the final GREEN run.

---

## BMAD Execution Roadmap
1. **Governance Sync**: Continue reconciling documentation (progress tracker, story files, deployment health) with verified test outcomes.
2. **BMM Phase 4 - Implementation Loops**: For each workstream above, execute `npx bmad-method run dev-story` to enforce RED -> GREEN -> REFACTOR, logging outputs in story docs.
3. **BMM Phase 5 - Verification**: After each story reaches GREEN, rerun targeted suites and capture metrics/coverage deltas in `BMAD_PROGRESS_TRACKER.md`.
4. **BMM Phase 6 - Release & Operations**: Execute Render deployment checklist, document smoke tests, and prepare Conventional Commit + PR package including BMAD shard/ticket references.

---

## Immediate Next Actions (Next 48 Hours)
1. **Restore workflow tooling (W0)**: Reinstall/repair BMAD CLI so `npx bmad-method workflow-init` runs; capture output under Analyst agent and sync `docs/bmad/bmm-workflow-status.md` + tracker.
2. **Redeploy with evidence (W1)**: Trigger backend/frontend Render deploys for commit `a027963` (or newer), download updated `backend-deploy*.json` / `frontend-deploy*.json`, and rerun smoke tests + health checks documented in `DEPLOYMENT_HEALTH.md`.
3. **DEV-008 RED cycle (W2)**: Author failing Vitest specs for FolderTree/PermissionModal/upload flows, scaffold MSW mocks, then implement UI once RED achieved.
4. **DEV-016/018 sequencing (W3/W4)**: Extend backend/frontend tests (podcast video, deal-matching criteria) before implementation; maintain coverage targets (backend ≥90%, frontend ≥85%).
5. **PR + documentation hygiene**: Update `PR_DESCRIPTION.md`, release notes, and ops checklists to reflect the active stories; ensure secret rotation + DSN updates are tracked before declaring ops complete.

---

Strict adherence to BMAD + TDD remains mandatory: every functional change starts with a failing test, all documentation updates follow immediately after GREEN cycles, and deployment artefacts must be refreshed before claiming completion.
