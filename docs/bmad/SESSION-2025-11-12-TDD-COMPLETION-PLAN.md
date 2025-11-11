# Session 2025-11-12 — TDD Completion Plan (BMAD v6-alpha)

**Objective:** Drive the ApexDeliver / CapLiquify platform + marketing site to verifiable 100% completion by executing the remaining BMAD loops with strict RED → GREEN → REFACTOR cadence and refreshed deployment evidence.

## References Reviewed
- `docs/100-PERCENT-COMPLETION-PLAN.md` (2025-11-12 snapshot)
- `docs/bmad/PROJECT_COMPLETION_PLAN.md`
- `docs/bmad/bmm-workflow-status.md`
- `docs/bmad/BMAD_PROGRESS_TRACKER.md`
- `CODEX-COMPLETE-PROJECT-GUIDE.md`
- `STATUS.md`, `docs/DEPLOYMENT_HEALTH.md`, Render deploy JSON artefacts

## Completion Targets
1. Restore backend + frontend test harnesses, capture new coverage artefacts (backend ≥90%, platform frontend ≥85%, marketing ≥90%).
2. Close DEV-008, DEV-016, DEV-018 functional gaps plus any residual DEV-011 export/polling work with failing tests first.
3. Finish MARK-002 phases 3–10 with Lighthouse + Vitest/Playwright evidence.
4. Refresh Render deployments, smoke logs, and BMAD documentation the same day as code changes.
5. Package release artefacts (coverage reports, deployment logs, BMAD tracker updates, PR templates) with a clean git state.

## BMAD Execution Framing
- **Governance:** `npx bmad-method status` → `npx bmad-method run workflow-status` before/after each loop; log session details in `docs/bmad/SESSION-*.md` and tracker.
- **Story Loops:** For every story (DEV-008/016/018/MARK-002), run `npx bmad-method run dev-story` to enforce RED tests prior to implementation.
- **Measure:** Capture failing outputs (RED) before implementing fixes; attach logs/screenshots to story docs and `BMAD_PROGRESS_TRACKER.md`.
- **Deploy:** Once GREEN, re-run deploy scripts + smoke tests; update `docs/DEPLOYMENT_HEALTH.md`, Render JSON snapshots, and PR checklist.

## Workstreams & TDD Plan

### 1. Harness Recovery & Governance Sync (P0 immediate)
- **Backend pytest blocker:** Delete/ignore `backend/nul` (reserved filename) and add a regression test under `backend/tests/test_cli_guard.py` asserting repo hygiene. Run `cd backend && pytest --maxfail=1 --cov=backend/app --cov-report=term-missing` (RED → GREEN) and archive output.
- **Frontend npm script fix:** Update `frontend/package.json` to remove duplicate `--run` argument, re-run `npm run test -- --runInBand --coverage` to capture RED suites, then GREEN.
- **Vitest warnings:** Address `act(...)` violations in Document Room / Podcast components by expanding tests before editing code.
- **Documentation:** Update `docs/bmad/bmm-workflow-status.md` NEXT_ACTION once harness is GREEN; log coverage in `docs/bmad/BMAD_PROGRESS_TRACKER.md`.

### 2. DEV-008 Secure Document & Data Room (P0)
- **RED tests:** Extend `frontend/src/components/documents/FolderTree.test.tsx`, `PermissionModal.test.tsx`, `UploadPanel.test.tsx`, and `frontend/src/pages/documents/DocumentWorkspace.test.tsx` for breadcrumbs, permission auditing, bulk actions, upload progress, and analytics hooks.
- **GREEN implementation:** Finish FolderTree navigation, audit log trail, `useDocumentRoom` hook (search + filtering), optimistic uploads via `documents.ts` API, and BulkActionsToolbar semantics.
- **REFACTOR:** Extract shared MSW mocks + React Query helpers; consolidate Tailwind utility classes.
- **Backend touchpoints:** If new audit endpoints required, start with failing tests in `backend/tests/test_document_room_api.py` before updating services/routers.
- **Evidence:** Update `docs/bmad/stories/DEV-008-document-room.md`, attach Vitest + screenshot outputs, refresh coverage deltas in tracker.

### 3. DEV-016 Podcast Studio Subscription Add-On (P0)
- **RED:** Add backend tests covering video upload entitlements, transcription quota resets, YouTube metadata sync, and live streaming toggles in `backend/tests/test_podcast_api.py` + `test_transcription_service.py`. Expand frontend specs in `frontend/src/pages/podcast/PodcastStudio.test.tsx` and `frontend/src/components/podcast/VideoUploadModal.test.tsx` for upgrade CTA, quota HUD, and transcript language selection.
- **GREEN:** Implement video upload modal/state, Whisper transcription pipeline integration, monthly quota reset cron, telemetry events, and YouTube sync service updates (`backend/app/services/{transcription_service,quota_service,youtube_service}.py`). Wire UI gating by Clerk tier.
- **REFACTOR:** Consolidate entitlement utilities, share upgrade CTA components, and document telemetry payloads.
- **Docs/Ops:** Record backend cron + Render worker configuration updates; update story + deployment checklists once routes verified in staging.

### 4. DEV-018 Intelligent Deal Matching (P0)
- **RED:** Extend `frontend/src/pages/deals/MatchingWorkspace.test.tsx` for criteria builder modal flows, analytics widgets, and match action buttons (save/pass/request intro). Add backend service tests for similarity scoring without numpy dependency, plus API route tests for new endpoints.
- **GREEN:** Build CriteriaBuilder modal with validation, analytics dashboard widgets, React Query cache updates, and action handlers hitting `frontend/src/services/dealMatchingService.ts`. Update backend services/routers accordingly.
- **REFACTOR:** Replace numpy usage with deterministic pure-Python scoring or vendored lightweight math helper; centralize mock data factories.
- **Evidence:** Update DEV-018 story doc + tracker, capture coverage for new analytics components.

### 5. DEV-011 Valuation Hardening (P1 still open)
- **RED:** Add tests for export status/history endpoints, polling UI, and audit logging in `backend/tests/test_valuation_export.py` + `frontend/src/pages/deals/valuation/ValuationSuite.test.tsx`.
- **GREEN:** Implement export status endpoints, SSE/polling helpers, and UI indicators; ensure Monte Carlo + scenario analytics remain deterministic with seeded RNG.
- **REFACTOR:** Share export utilities across PDF/XLS generation; ensure Decimal usage across services.

### 6. MARK-002 Enhanced Marketing Website (P1)
- **RED:** Re-enable Vitest suites for SEO, Lighthouse snapshots, CTA blocks, Navigation/FAQ coverage, plus Playwright smoke for Home → Pricing → Blog flows.
- **GREEN:** Execute roadmap phases 3–10 (performance budget, SEO metadata, asset pipeline, analytics wiring, accessibility fixes, deployment automation). Capture Lighthouse scores ≥95 and axe violation list = 0.
- **REFACTOR:** Centralize marketing layout tokens, remove duplicated Tailwind classes, and ensure CMS data mocks live under `frontend/src/mocks/marketing/`.
- **Evidence:** Archive Lighthouse/Playwright outputs under `docs/marketing/phase-XX/` per phase; update marketing plan + release notes.

### 7. Operations & Deployment Hardening (P0/P1)
- **Secrets & Env:** Cross-check `.env.READY_TO_USE` vs `ApexDeliver Environment Variables - Master Reference.md`; rotate credentials referenced by helper scripts (`fix_production_alembic.py`, etc.).
- **Deploy cadence:** For every sprint, redeploy backend & frontend via Render API (`scripts/trigger_render_deploy.py`), rerun `scripts/run_smoke_tests.sh production`, `scripts/verify_deployment.py`, and archive outputs (JSON + txt) with timestamps.
- **Migrations:** Re-run `alembic upgrade head` post-deploy, capture CLI transcript, and log migration IDs inside `docs/DEPLOYMENT_HEALTH.md`.
- **Evidence:** Update `latest-deploy*.json`, `deployment-health-*.json`, `docs/PRODUCTION-DEPLOYMENT-CHECKLIST.md`, `PRODUCTION-CONFIG-UPDATE.md`.

### 8. Final QA, Documentation, and Release Packaging (P0)
- **Test matrix:** Run full backend pytest, `npm run test -- --runInBand --coverage`, `npm run lint`, `npm run build`, `npm run preview`, marketing Vitest + Playwright, and smoke tests. Capture outputs in `/docs/bmad/quality_logs/` and coverage artifacts under `/tmp/coverage/` or committed reports as required.
- **Documentation:** Update BMAD tracker, workflow status, story docs, release notes (`RELEASE_NOTES_v1.0.md`), PR template (`PR_DESCRIPTION.md`), and ops checklists.
- **Handover package:** Include Render health evidence, Lighthouse screenshots, coverage summaries, Conventional Commit log, and deployment decisions (DECISION-REQUIRED.md) updates.

## Verification Checklist (Run after each major loop)
- `cd backend && pytest --maxfail=1 --cov=backend/app --cov-report=term-missing`
- `cd frontend && npm run test -- --runInBand --coverage`
- `cd frontend && npm run lint`
- `cd frontend && npm run build && npm run preview -- --host`
- `bash scripts/run_smoke_tests.sh production`
- `python scripts/verify_deployment.py --env production`
- `npx bmad-method status && npx bmad-method run workflow-status`
- Lighthouse (`npm run lighthouse:ci` if script exists) + Playwright marketing smoke

## Next 48-Hour Actions
1. **W1.1 Harness fix:** Remove `backend/nul`, add guard test, rerun backend pytest with coverage and log outputs.
2. **W1.2 Frontend CLI cleanup:** Patch `npm run test` script, capture RED coverage run, triage failing docs/podcast suites, then GREEN.
3. **Sprint 1B admin prune:** Delete `backend/app/api/routes/admin/*` + related tests as planned, rerun pytest, update coverage + BMAD tracker.
4. **DEV-008 RED cycle:** Write failing Vitest specs (FolderTree, PermissionModal, UploadPanel), stage MSW mocks, and log RED evidence.
5. **Deployment evidence refresh:** Trigger backend/frontend redeploys, rerun smoke tests, and update `docs/DEPLOYMENT_HEALTH.md` + deploy JSON snapshots the same day.

## Documentation & Evidence Updates
- Append this plan reference to `docs/bmad/BMAD_PROGRESS_TRACKER.md` under Session 2025-11-12.
- Update `docs/bmad/bmm-workflow-status.md` after completing the harness recovery loop.
- For each story loop, capture RED + GREEN screenshots/logs and link them from the corresponding `docs/bmad/stories/DEV-xxx-*.md` file.
- Keep `docs/DEPLOYMENT_HEALTH.md`, `docs/PRODUCTION-DEPLOYMENT-CHECKLIST.md`, and `PR_DESCRIPTION.md` aligned with latest deploy/test outputs.

> **Definition of Done:** All suites green with coverage targets met, Render services live on latest commit with documented smoke evidence, BMAD artefacts updated, and release documentation complete with no dirty worktree items.
