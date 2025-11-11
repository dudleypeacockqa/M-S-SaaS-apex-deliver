# M&A Intelligence Platform – 100% Completion Plan
_Last updated: 2025-11-11_

## 1. Source Inputs & Current State
- **Workflow status**: Enterprise brownfield track through Sprint Planning already logged (`docs/bmad/bmm-workflow-status.yaml`).
- **Sprint backlog**: Sprint 1 committed scope plus stretch items covering identity, pipelines, valuations, and deployment rehearsal (`docs/planning/sprint-planning-phase3.md`).
- **Completion tracker**: Open workstreams called out in the 100% plan (DEV-008, DEV-016, DEV-018, MARK-002, deployment, QA) with TDD expectations (`docs/100-PERCENT-COMPLETION-PLAN.md`).
- **Deploy health**: Backend/frontend redeploys live but smoke tests + evidence pending per deployment log (`docs/DEPLOYMENT_HEALTH.md`).

## 2. Definition of Done
1. All P0/P1 workstreams deliver features + evidence via RED→GREEN→REFACTOR loops (pytest, Vitest, lint, build).
2. Render backend/frontend redeployed from latest commit with fresh smoke + migration logs stored under `docs/`.
3. BMAD artefacts updated: workflow status, sprint notes, completion plan, release notes, ops checklists.
4. Conventional Commit + PR package prepared with coverage, deployment artifacts, and screenshots.
5. Ops handover confirms monitoring/secrets parity via existing runbooks.

## 3. Workstreams & Execution Plans

### 3.1 DEV-008 Secure Document & Data Room (P0)
- **Goal**: Ship full document workspace (FolderTree, permissions, uploads, bulk actions) aligning with backend endpoints already verified.
- **TDD Plan**:
  1. Author failing Vitest suites for FolderTree navigation, permission modal rules, upload progress, bulk actions (`frontend/src/components/documents/*.test.tsx`).
  2. Stub MSW handlers for `documents.ts` API to unblock deterministic tests.
  3. Implement components + shared `useDocumentRoom` hook until tests pass; refactor UI state once GREEN.
  4. Extend backend pytest coverage for any new entitlement checks if API updates needed.
- **Docs to touch**: story file in `docs/stories/` (create if missing), PRD addendum, UX spec updates, completion plan progress note.
- **Status 2025-11-11**: Upload panel enhanced tests running GREEN via `VITEST_POOL=forks`; new RED tests added for FolderTree persistence + permission entitlement errors (Vitest worker pool needs permanent fix before GREEN work begins).

### 3.2 DEV-016 Podcast Studio Subscription Add-On (P0)
- **Goal**: Deliver video upload, transcription, quota reset, YouTube metadata sync, live streaming.
- **TDD Plan**:
  1. Extend backend tests (`backend/tests/test_podcast_api.py`, `tests/test_subscription_error_paths.py`) to RED for video uploads + quotas.
  2. Add transcription/quota fixtures; only implement FastAPI routes/services when tests fail.
  3. Frontend: create RED tests for `VideoUploadModal`, transcription status UI, upgrade CTA telemetry.
  4. Integrate Whisper pipeline + monthly reset jobs; add Celery-style task tests if needed.
- **Docs**: Update PRD section, architecture notes on media pipeline, completion tracker progress.

### 3.3 DEV-018 Intelligent Deal Matching (P0)
- **Goal**: Criteria builder modal, analytics workspace, match action workflows.
- **TDD Plan**:
  1. Expand `frontend/src/pages/deals/MatchingWorkspace.test.tsx` to fail for modal behaviors, analytics widgets, and action flows.
  2. Implement React Query cache updates + UI components after RED.
  3. Add backend tests if new endpoints for match actions/analytics required.
- **Docs**: Update PRD + UX spec, add story progress, refresh completion plan note.

### 3.4 MARK-002 Enhanced Marketing Website (P1)
- **Goal**: Finish phases 3-10 (SEO, Lighthouse, assets).
- **TDD Plan**:
  1. For each phase, add RED Vitest/Lighthouse assertions (snapshots, SEO configs).
  2. Implement component/asset changes → GREEN, then record metrics & screenshots under `docs/marketing/`.
- **Docs**: Marketing plan, release notes, completion plan update.

### 3.5 Deployment & Ops Hardening
- **Goal**: Redeploy backend/frontend with verified smoke + migration logs.
- **Actions**:
  1. Run `scripts/verify_deployment.py` + `scripts/run_smoke_tests.sh production` from network-enabled host (expect RED first if secrets stale).
  2. Capture outputs to `docs/backend-health-<date>.json`, `docs/frontend-health-<date>.md`, screenshot bundle.
  3. Rotate DB creds after smoke (per env reference) and scrub temporary scripts.
- **Docs**: `docs/DEPLOYMENT_HEALTH.md`, `PRODUCTION-DEPLOYMENT-CHECKLIST.md`, `PRODUCTION-CONFIG-UPDATE.md`.

### 3.6 Final QA, Documentation, and Handover (P0)
- **Goal**: Full test suites, lint/builds, BMAD + release collateral, ops checklist.
- **TDD Steps**:
  1. Re-run full pytest + coverage, Vitest + coverage, `npm run lint`, `npm run build`, `uvicorn` + `npm run preview` smoke.
  2. Record outputs in `docs/TEST_BASELINE_*.md`, update completion tracker.
  3. Update workflow status, sprint report, release notes, PR template, ops checklist.

## 4. Execution Order & Dependencies
1. Workflow tooling stays active; continue from `sprint-planning` workflow (SM agent) to convert backlog into dev stories.
2. Deliver DEV-008 → DEV-016 → DEV-018 sequentially; each ends with doc + coverage updates.
3. Run MARK-002 tasks alongside when bandwidth allows (lower priority than P0 items).
4. Execute deployment hardening once P0 PRs merged and tests green.
5. Finish with QA/handover suite + BMAD documentation sweep.

## 5. Immediate Next Actions (Next 48h)
1. Launch `/bmad:bmm:workflows:sprint-planning` (SM agent) to finalize iteration breakdown + acceptance tests.
2. Start DEV-008 RED cycle: add failing Vitest specs + MSW mocks before UI implementation.
3. Stage deployment smoke host + secrets to capture evidence once features hit main.

Keep this file updated after every GREEN cycle; link new evidence (tests, deploy logs, docs) under the appropriate workstream.
