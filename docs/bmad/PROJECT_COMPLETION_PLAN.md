# Project Completion Roadmap (2025-11-12 Refresh)

**Owner:** Delivery (Codex)
**Methodology:** BMAD v6-alpha + strict TDD
**Scope:** Platform (backend + frontend), Marketing site, Deployments, Documentation
**Status:** Phase 6 – Documentation, deployment evidence, and release packaging pending

---

## 1. Current State (Sources: `BMAD_PROGRESS_TRACKER`, `bmm-workflow-status`, deploy logs)

### 1.1 Git & Worktree
- `HEAD`: `39859e0 feat: M&A Platform v1.0.0-RC1 - 100% COMPLETE & Production Launch Approved 🚀`.
- `origin/main`: aligned – no divergence.
- Working tree: documentation updates (BMAD trackers, 100% plan), MSW harness files (`frontend/src/tests/msw/**`), marketing audit artefacts. No outstanding feature branches.
- Risk: Render DSN rotation still pending final release; handle credentials carefully until completion.

### 1.2 Tests & Coverage
- Backend: Last targeted run (`pytest backend/tests/test_document_endpoints.py -k folders --maxfail=1 -vv`) GREEN after folder tree API updates; previous full run (750 passed / 54 skipped, 84% coverage) remains baseline. Full-suite rerun planned during final QA.
- Frontend: Document Room suites GREEN with MSW (`FolderTree.test.tsx` 13/13, `DocumentWorkspace.test.tsx` 25/25, `PermissionModal.test.tsx` 13/13, `UploadPanel.enhanced.test.tsx` 33/33). Global coverage run pending final QA. Marketing audits (Lighthouse/axe) scheduled.
- Continuous requirement: capture coverage + artefacts during final QA window.

### 1.3 Deployments
- Backend Render service (`srv-d3ii9qk9c44c73aqsli0`) live on `dep-d49et83uibrs739agtfg` (commit `9b0577f3`).
- Frontend service (`srv-d3ihptbipnbc73e72ne0`) live on `dep-d49etc8m2f8s73dkf0v0`.
- Smoke artefacts (`docs/DEPLOYMENT_HEALTH.md`, `latest-deploy*.json`) need refresh post-MSWharness milestone. Blog slug check still flagged; document manual verification or adjust smoke script before sign-off.

### 1.4 Feature Completion Snapshot
- ✅ DEV-001 – DEV-010 delivered and verified.
- ✅ DEV-011 – DEV-018 delivered; DEV-016/018 audited and deemed production-ready.
- ✅ DEV-008 Document Room: UI + API complete, documentation sync pending (current focus).
- ✅ Podcast Studio + Deal Matching audits complete; no coding tasks remain.
- ⚠️ MARK-002 marketing site: 95-98% complete; documentation/Lighthouse evidence outstanding.

### 1.5 Key Risks
1. **Deployment Evidence Gap** – Smoke logs + deploy JSON snapshots stale; blog slug check failing.
2. **Coverage Confirmation** – Need final full-suite pytest + vitest coverage before release.
3. **Documentation Drift** – DEV-008 story/PRD/UX docs need MSW + accessibility updates; marketing audit artefacts pending.
4. **Secrets Handling** – Render DSN rotation deferred; ensure secure handling until final seal.

---

## 2. Guiding Principles
- Follow BMAD workflow loop per story (`workflow-status → workflow-init → create-story → dev-story → review-story → retrospective`).
- Enforce TDD discipline (RED → GREEN → REFACTOR) for every backend/ frontend/marketing change.
- Keep artefacts synchronized: `BMAD_PROGRESS_TRACKER`, `bmm-workflow-status`, story docs (`docs/bmad/stories/DEV-xxx*.md`), and deployment logs updated after each sprint.
- Maintain coverage guardrails (backend ≥85%, platform frontend ≥85%, marketing ≥90%) before final release.

---

## 3. Workstreams to Reach 100%

### Stream A – Documentation & Evidence Sync (Current Loop)
- Update DEV-008 story, PRD, UX, and release notes with MSW/lazy-load acceptance evidence.
- Refresh `docs/100-PERCENT-COMPLETION-PLAN.md`, `PROJECT_COMPLETION_PLAN.md`, `BMAD_PROGRESS_TRACKER.md`, `bmm-workflow-status.md` after each verification step.
- Capture regression artefacts (targeted Vitest, backend folder tests) and attach to story docs.

### Stream B – Deployment Evidence Refresh
1. Trigger Render redeploys (backend + frontend) using provided API key.
2. Run `scripts/run_smoke_tests.sh production` and `python scripts/verify_deployment.py production`; archive outputs and update `docs/DEPLOYMENT_HEALTH.md`, `latest-deploy*.json`, `deployment-health-*.json`.
3. Document any manual verification steps (e.g., blog slug) to close outstanding smoke warnings.

### Stream C – Marketing Audit Wrap-up
- Execute Lighthouse + axe audits; store outputs under `docs/marketing/` and update MARK-002 completion doc.
- Ensure marketing analytics configuration and case studies reflected in release materials.

### Stream D – Final QA & Release Packaging
- Run full backend pytest with coverage, full Vitest with coverage, `npm run lint`, `npm run build`, `npm run preview`.
- Collect coverage reports, logs, and screenshots; bundle into final release folder (`docs/release/v1.0.0-RC1/`).
- Prepare final release notes, completion checklist, and PR summary referencing BMAD shards.

---

## 4. Dependencies & Sequencing
1. Complete Stream A (documentation sync) before running deployment refresh to ensure artefacts reference latest behaviour.
2. Deployment evidence (Stream B) must be refreshed before final QA (Stream D) to avoid stale logs.
3. Marketing audit (Stream C) can run in parallel but must finish prior to release packaging.

---

## 5. Tracking Expectations
- Update `docs/bmad/stories/DEV-008-secure-document-data-room.md`, `BMAD_PROGRESS_TRACKER.md`, `bmm-workflow-status.md` after each documentation or verification step.
- Refresh deployment evidence (`backend-deploy*.json`, `frontend-deploy*.json`, `DEPLOYMENT-SESSION-SUMMARY.md`) immediately after smoke tests.
- Store coverage artefacts (`backend/coverage.json`, `frontend/coverage/coverage-final.json`) from final QA runs.

---

## 6. Immediate Next Steps (2025-11-12)
1. **Documentation Sync (DEV-008)** – Update story/PRD/UX docs with MSW + accessibility evidence; log results in BMAD tracker and workflow status.
2. **Deployment Evidence Refresh** – Trigger Render redeploys, rerun smoke scripts, update `docs/DEPLOYMENT_HEALTH.md` and deploy JSON artefacts.
3. **Marketing Audit** – Execute Lighthouse + accessibility checks; archive outputs and update MARK-002 documentation.
4. **Final QA Prep** – Schedule full-suite pytest + vitest runs and ensure scripts/commands ready for execution once evidence refreshed.

_Completion of these steps positions the project for final QA and release packaging under BMAD Phase 6._



