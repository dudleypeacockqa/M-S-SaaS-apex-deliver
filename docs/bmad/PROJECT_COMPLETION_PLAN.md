# Project Completion Roadmap (2025-11-11 Refresh)

**Owner:** Delivery (Codex)
**Methodology:** BMAD v6-alpha + strict TDD
**Scope:** Platform (backend + frontend), Marketing site, Deployments, Documentation
**Status:** Implementation Phase – P0 verification complete, P1 coverage/feature work in progress

---

## 1. Current State (Sources: `BMAD_PROGRESS_TRACKER`, `bmm-workflow-status`, deploy logs)

### 1.1 Git & Worktree
- `HEAD`: `6da3b0e docs(bmad): add Session 2025-11-11 - Phase 1 Housekeeping complete` (latest commit on `main`).
- `origin/main`: same SHA – branch is even with remote.
- Working tree: dirty (deployment summary, BMAD tracker/status, marketing + test files). No new commits staged yet.
- Risk: `fix_production_alembic.py` no longer embeds secrets, but the Render DSN is still referenced in history; rotation deferred until project completion per stakeholder.

### 1.2 Tests & Coverage
- Backend: 681 passing / 74 skipped, 83% coverage (P0 verification baseline). Next target is 85%+ via P1-1.
- Frontend (app): 1,200+ specs green, estimated coverage 87% (CreateDealModal/NudgePanel/GoalCard/ActivityList suites fixed individually). Marketing-specific suites remain at ~90% with Phase 2 work still pending.
- Continuous requirement: rerun full matrices after each feature story and log results in deployment checklist.

### 1.3 Deployments
- Backend Render service (`srv-d3ii9qk9c44c73aqsli0`) last recorded deploy: `dep-d49430euk2gs73es0cpg` (commit `79a07c5`, `status=live` per dashboard). `backend-deploy*.json` still shows earlier failed runs, so evidence is outdated.
- Frontend service (`srv-d3ihptbipnbc73e72ne0`) redeployed as `dep-d4944ochg0os738k2sc0`, but `frontend-deploy*.json` remains stuck on `dep-d48vc72dbo4c73fm1mv0`. No fresh logs or screenshots = health unverified.
- Latest scripted checks: `scripts/verify_deployment.py` failed 1/10 tests (blog slug 404) and `scripts/run_smoke_tests.sh production` hit Cloudflare 403 for frontend manual check. Therefore **Render deploy health is NOT 100%** until slug/content issue is resolved and evidence captured.

### 1.4 Feature Completion Snapshot (PRD reference `CODEX-COMPLETE-PROJECT-GUIDE.md`)
- ✅ DEV-001..DEV-010 foundations stable.
- ⚠️ DEV-011 Valuation Suite: backend export/scenario hardening + frontend workspace still pending.
- ⚠️ DEV-012 Task Automation: Celery fixtures + UI incomplete; tests marked RED.
- ⚠️ DEV-013 Data Room UI / Entitlements: backend ready, React surfaces outstanding.
- ⚠️ DEV-016 Podcast Studio Phases 3-6: service gating + UI/E2E not finished.
- ⚠️ MARK-002 marketing site: Phase 2 asset integration + Phases 3-10 not delivered.

### 1.5 Key Risks
1. **Deploy Evidence Gap** – No updated `backend-deploy*.json` / `frontend-deploy*.json`; blog slug test failing, frontend Cloudflare check pending.
2. **Secrets Exposure** – Render DSN still active; rotation postponed until 100% completion, so tight handling required.
3. **Coverage Debt** – Backend stuck at 83% (goal ≥85%); marketing suites below 90% until Phases 3–10 deliver.
4. **Story Drift** – DEV-011/012/013/016/018 + MARK-002 not executed yet; need BMAD dev-story loops with RED tests.
5. **Content Drift** – Blog API slug used in smoke tests missing (404). Need to re-seed content or adjust tests to existing data before next deploy sign-off.

---

## 2. Guiding Principles
- Follow BMAD workflow loop per story (`workflow-status → workflow-init → create-story → dev-story → review-story → retrospective`).
- Enforce TDD discipline (RED → GREEN → REFACTOR) for every backend/ frontend/marketing change.
- Keep artefacts synchronized: `BMAD_PROGRESS_TRACKER`, `bmm-workflow-status`, story docs (`docs/bmad/stories/DEV-xxx*.md`), and deployment logs updated after each sprint.
- Maintain coverage guardrails (backend ≥85%, platform frontend ≥85%, marketing ≥90%) before final release.

---

## 3. Workstreams to Reach 100%

### W0 – Governance & BMAD Hygiene
- Run `workflow-init` (manual update if CLI lacks command) when context changes.
- Map dirty files to active stories (DEV-011, DEV-012, MARK-002) and record in `docs/bmad/stories/`.
- Ensure progress tracker + workflow status are updated after each session.

### W1 – Platform & Deploy Stability
1. **Deployment Evidence Refresh**
   - Collect fresh `backend-deploy*.json`, `frontend-deploy*.json`, `latest-deploy*.json` entries for deploys `dep-d49430euk2gs73es0cpg` and `dep-d4944ochg0os738k2sc0`.
   - Run smoke tests (`scripts/run_smoke_tests.sh`) and record outputs in `DEPLOYMENT_HEALTH.md`, `DEPLOYMENT-SESSION-SUMMARY.md`.
2. **Secret Remediation**
   - Remove plaintext Postgres creds from `fix_production_alembic.py`, rotate DB password per `ApexDeliver Environment Variables - Master Reference.md`, document rotation.
3. **Alembic Validation**
   - Keep `pytest tests/test_migrations -k users_id` + `alembic current` logs archived for audit.

### W2 – Backend Feature Completion (DEV-011/012/016/018)
- **DEV-011**: Finish valuation exports + scenario management tests, ensure audit logging + entitlement checks; extend coverage for service layer.
- **DEV-012**: Implement automation queue fixtures + service methods with deterministic tests.
- **DEV-016**: Enforce feature gating in podcasts API/services and add multi-language/quota coverage.
- **DEV-018**: Harden comparables/precedents analytics + export logging.

### W3 – Frontend Experience
- Integrate pipeline templates hook/service into `DealKanbanBoard`/`CreateDealModal` with Vitest coverage.
- Build Valuation Suite UI, Document Room surfaces, Podcast gating, ensuring co-located tests + Storybook/visual artefacts.

### W4 – Marketing Site (MARK-002)
- Complete Phase 2 asset integration, then execute Phases 3-10 (pricing, case studies, analytics, SEO, QA). Track progress in marketing docs and BMAD tracker.

### W5 – Quality Gates & Release
- Re-run full backend/ frontend/ marketing test matrices with coverage, `npm run lint`, `npm run build`.
- Update deployment guides, release notes, and capture evidence (screenshots/logs) for final sign-off.
- Prepare release commit/PR + tag once all artefacts are in place.

---

## 4. Dependencies & Sequencing
1. **W1** must finish before adding new feature code (deploy health, secrets, documentation).
2. Backend stories (W2) unblock their frontend counterparts (W3) – execute in pairs via BMAD dev-story cycles.
3. Marketing work (W4) can run in parallel once deployments are healthy but final release waits on W5.

---

## 5. Tracking Expectations
- Update `docs/bmad/stories/DEV-xxx*.md`, `BMAD_PROGRESS_TRACKER.md`, `bmm-workflow-status.md` after each dev-story.
- Keep deployment evidence (`backend-deploy*.json`, `frontend-deploy*.json`, `DEPLOYMENT-SESSION-SUMMARY.md`) current whenever Render runs.
- Maintain coverage artefacts (`backend/coverage.json`, `frontend/coverage/coverage-final.json`).

---

## 6. Immediate Next Steps (2025-11-11)
1. **W1.1 – Deployment Evidence**: Retrieve Render deploy logs for `dep-d49430euk2gs73es0cpg` and `dep-d4944ochg0os738k2sc0`, update deployment docs, confirm health endpoints, and fix failing blog slug in `scripts/verify_deployment.py` (reimport content or change test fixture).
2. **W1.2 – Secret Hygiene**: Remove plaintext credentials from helper scripts, rotate DB password, and document in environment reference + deployment summary.
3. **W2.1 – Backend Coverage Sprint (DEV-011)**: Start the next BMAD dev-story with RED tests for valuation export/scenario behaviour once W1 artefacts are complete.

_On completion of these steps, continue executing W2/W3 stories under BMAD dev-story loops until 100% completion is achieved._
