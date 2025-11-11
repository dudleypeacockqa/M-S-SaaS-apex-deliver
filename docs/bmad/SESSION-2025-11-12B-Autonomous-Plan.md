# Session 2025-11-12B – Autonomous Completion Plan
**Date**: 2025-11-12
**Owner**: Codex (GPT-5)
**Mode**: BMAD v6 + strict TDD (RED → GREEN → REFACTOR)
**Goal**: Translate repo-wide doc review into an actionable sequence that drives ApexDeliver to verifiable 100% completion with refreshed deploy evidence.

---

## Inputs Reviewed
- `docs/100-PERCENT-COMPLETION-PLAN.md` (snapshot 2025-11-12 09:55 UTC)
- `docs/bmad/BMAD_METHOD_PLAN.md`
- `docs/bmad/SESSION-2025-11-12A-Baseline-Establishment.md`
- `docs/bmad/BMAD_PROGRESS_TRACKER.md` (sessions 2025-11-12K + 2025-11-12A)
- Deployment artefacts: `docs/DEPLOYMENT_HEALTH.md`, `latest-deploy.json`, `latest-deploy-check.json`
- Repo status via `git status -sb`, backend + frontend baseline logs

---

## Verified Baseline
- **Git**: `HEAD` = `6eb40f0 feat(doc-room): add filters and owner guard` (origin/main up to date). Working tree dirty with BMAD docs and new test harness scaffolding.
- **Backend tests**: `python -m pytest --maxfail=1 --cov=app --cov-report=term-missing` → `724 passed / 77 skipped / 360 warnings / 83% coverage` (log: `backend-test-baseline-2025-11-12.txt`). Harness healthy.
- **Frontend tests**: Targeted DocumentWorkspace + DocumentRoomPage suites pass (24/24). Full `npm run test -- --runInBand --coverage` still pending because of known QueryClient cache leakage; next loop must capture RED evidence.
- **Deployments**: Render backend `dep-d49et83uibrs739agtfg` + frontend `dep-d49etc8m2f8s73dkf0v0` both **live** on commit `9b0577f3` with smoke script pass per `latest-deploy-check.json` (backend `/health` 200, frontend 200, smoke pytest 2/2). Health currently 100%.
- **Operations**: Alembic head `dc2c0f69c1b1` verified 2025-11-10; secrets + Render worker configs queued for revalidation during Ops workstream.

---

## Completion Workstreams & Required Actions
1. **W1 – Harness Recovery & Governance (P0)**
   - Remove stray `backend/nul` artefact, keep new path safety tests, rerun backend pytest to reconfirm coverage and archive logs.
   - Patch `frontend/package.json` `test` script (duplicate `--run`) and run full Vitest coverage to intentionally capture RED DocumentWorkspace/Podcast suites.
   - Execute `npx bmad-method status` and update `docs/bmad/bmm-workflow-status.md` + tracker before/after governance loops.

2. **W2 – DEV-008 Secure Document & Data Room (P0)**
   - RED: Extend Vitest specs for PermissionModal quota states, UploadPanel retries, BulkActions modals, FolderTree analytics logging using MSW mocks.
   - GREEN: Implement modal UX, audit log export, optimistic uploads, and backend audit endpoint if needed; resolve React Query isolation issues.
   - REFACTOR: Centralize document hooks/utilities, align Tailwind tokens, update DEV-008 story doc with screenshots + coverage.

3. **W3 – DEV-016 Podcast Studio Video Upload (P0)**
   - RED: Add backend tests for video upload entitlements + transcription quotas, and frontend tests for VideoUploadModal/PodcastStudio gating.
   - GREEN: Implement FastAPI services (`quota_service`, `transcription_service`, `youtube_service`) and React flows with telemetry + upgrade CTAs.
   - REFACTOR: Consolidate entitlement helpers and document cron/Render worker changes.

4. **W4 – DEV-018 Intelligent Deal Matching (P0)**
   - RED: Expand `MatchingWorkspace.test.tsx` plus backend similarity scoring tests (pure Python).
   - GREEN: Build CriteriaBuilder modal, analytics widgets, and action handlers hitting updated `dealMatchingService.ts` + FastAPI endpoints.
   - REFACTOR: Share mock data factories and remove numpy dependency.

5. **W5 – MARK-002 Website Phases 3–10 (P1)**
   - RED: Re-run marketing Vitest + Lighthouse to measure structured data/perf gaps.
   - GREEN: Complete WebP inventory, structured data for FAQ/Features, accessibility + CTA instrumentation, capture Lighthouse ≥95.
   - Evidence: Archive outputs in `docs/marketing/phase-XX/` per phase.

6. **W6 – Ops & Deployment Hardening (P0/P1)**
   - After each major loop, rerun `scripts/run_smoke_tests.sh production`, `python scripts/verify_deployment.py --env production`, and redeploy via Render API.
   - Update `docs/DEPLOYMENT_HEALTH.md`, `latest-*-deploy*.json`, `docs/PRODUCTION-DEPLOYMENT-CHECKLIST.md`, and record Alembic transcripts + env rotations.

7. **W7 – Final QA & Release Packaging (P0)**
   - Commands: backend pytest, frontend Vitest coverage, `npm run lint`, `npm run build`, `npm run preview`, Lighthouse, Playwright, smoke scripts.
   - Documentation: Refresh BMAD tracker, workflow status, story docs, release notes, PR description. Ensure clean git state + coverage artefacts committed.

---

## Next 24-Hour Cadence
1. **W1.1** – Confirm backend harness state (remove `backend/nul` if present, rerun pytest, log coverage delta).
2. **W1.2** – Fix frontend `test` script, run full Vitest coverage in RED state, and catalog failing specs (DocumentWorkspace/Podcast).
3. **W2.RED** – Author failing Vitest specs for PermissionModal quota overflow + UploadPanel retries, commit logs before implementation.
4. **Governance Sync** – Run `npx bmad-method status`, update `docs/bmad/bmm-workflow-status.md`, and log this session in tracker referencing this plan.
5. **Deploy Evidence Prep** – Schedule `scripts/run_smoke_tests.sh production` + `python scripts/verify_deployment.py --env production` immediately after the first GREEN loop to keep Render artefacts aligned with code.

---

## Evidence Expectations
- Every loop: RED log, GREEN log, story doc update, tracker entry, deployment/coverage artefacts (if applicable).
- Baseline outputs stored in `backend-test-baseline-2025-11-12.txt` and `frontend-test-baseline-2025-11-12.txt`; future runs should append date-stamped logs.
- Render deploy health evidence must be refreshed the same day features land on main.
- Definition of done for this planning session: plan documented (this file), tracker updated, and W1 loops ready to execute under TDD discipline.
