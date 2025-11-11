# Project Completion Roadmap (2025-11-11 Refresh)

**Owner:** Delivery (Codex)
**Methodology:** BMAD v6-alpha + strict TDD
**Scope:** Platform (backend + frontend), Marketing site, Deployments, Documentation
**Status:** Implementation Phase – P0 verification complete, P1 coverage/feature work in progress

---

## 1. Current State (Sources: `BMAD_PROGRESS_TRACKER`, `bmm-workflow-status`, deploy logs)

### 1.1 Git & Worktree
- `HEAD`: `6eb40f0 feat(doc-room): add filters and owner guard` (latest commit on `main`).
- `origin/main`: aligned – no divergence.
- Working tree: dirty with BMAD governance docs, DEV-008 Vitest scaffolding, and new backend path safety tests (`backend/tests/path_safety.py`, `backend/tests/test_path_safety.py`, `backend-test-baseline-2025-11-12.txt`).
- Risk: `fix_production_alembic.py` no longer embeds secrets, but the Render DSN remains in history; rotation remains deferred until final completion per stakeholder direction.

### 1.2 Tests & Coverage
- Backend: Full-suite baseline `pytest --maxfail=1 backend/tests --cov=backend/app --cov-report=term-missing` (706 passed / 77 skipped, 90% coverage). W0 harness run (`pytest backend/tests/test_path_safety.py backend/tests/api/test_blog.py --maxfail=1 -vv`) and W1 billing/subscription run (`pytest backend/tests/test_billing_endpoints.py backend/tests/test_subscription_error_paths.py --maxfail=1 --cov=backend/app -vv`) executed 2025-11-12 and are archived in `backend-test-baseline-2025-11-12.txt`; next objective is sustaining ≥90% once the harness is wired into CI.
- Frontend (app): Targeted DEV-008 suites green (`DocumentRoomPage.test.tsx` 8/8, `PermissionModal.test.tsx` 11/11). Full `npm run test -- --coverage` pending completion of DEV-008/016/018 loops. Marketing suites remain ~90% with Lighthouse audit outstanding.
- Continuous requirement: rerun full matrices after each story and capture artefacts in deployment checklist.

### 1.3 Deployments
- Backend Render service (`srv-d3ii9qk9c44c73aqsli0`) last redeploy: `dep-d49et83uibrs739agtfg` (commit `9b0577f3`, status `live`). `backend-deploy*.json` pending refresh with this artefact.
- Frontend service (`srv-d3ihptbipnbc73e72ne0`) last redeploy: `dep-d49etc8m2f8s73dkf0v0` (commit `9b0577f3`, status `live`). `frontend-deploy*.json` still references older builds; new evidence required.
- Latest scripted checks: `scripts/verify_deployment.py` still fails blog slug assertion; `scripts/run_smoke_tests.sh production` succeeds backend endpoints but Cloudflare 403 persists for automated frontend check. Render deploy health remains <100% until refreshed evidence (or documented manual verification) replaces failing artefacts.

### 1.4 Feature Completion Snapshot (PRD reference `CODEX-COMPLETE-PROJECT-GUIDE.md`)
- ✅ DEV-001..DEV-010 foundations stable.
- ⚠️ DEV-011 Valuation Suite: backend export/scenario hardening + frontend workspace still pending.
- ⚠️ DEV-012 Task Automation: Celery fixtures + UI incomplete; tests marked RED.
- ⚠️ DEV-013 Data Room UI / Entitlements: backend ready, React surfaces outstanding (currently executing DEV-008 front-end parity).
- ⚠️ DEV-016 Podcast Studio Add-ons: video gating + telemetry enhancements queued (audit complete).
- ⚠️ MARK-002 marketing site: Phase 2 asset integration + Phases 3-10 not delivered; audit identifies ~10h remaining.

### 1.5 Key Risks
1. **Deploy Evidence Gap** – `backend-deploy*.json` / `frontend-deploy*.json` not yet refreshed for deploys `dep-d49et83uibrs739agtfg` / `dep-d49etc8m2f8s73dkf0v0`; smoke script still fails blog slug.
2. **Secrets Exposure** – Render DSN remains active; rotation deferred until completion, enforce restricted handling meanwhile.
3. **Coverage Guardrails** – Backend currently 90% but requires confirmation post path-safety integration; frontend full-suite coverage pending.
4. **Story Drift** – DEV-011/012/016/018 plus MARK-002 require BMAD dev-story loops; DEV-008 remains primary active story.
5. **Content Drift** – Blog API slug used in smoke tests still 404; need new fixture or content import prior to final deploy sign-off.

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
- Keep progress tracker + workflow status updated after each session.
- Capture targeted pytest harness results (path safety + blog API) inside `backend-test-baseline-2025-11-12.txt` before promoting W1 deploy work.

### W1 – Platform & Deploy Stability
1. **Deployment Evidence Refresh**
   - Collect fresh `backend-deploy*.json`, `frontend-deploy*.json`, `latest-deploy*.json` entries for deploys `dep-d49et83uibrs739agtfg` and `dep-d49etc8m2f8s73dkf0v0`.
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

## 6. Immediate Next Steps (2025-11-12)
1. **W1.2 – Billing/Sub Coverage**: ✅ Completed – pytest suites recorded; move immediately into Alembic + deploy evidence.
2. **W1.3 – Deployment Evidence Refresh**: ✅ Completed – `python scripts/verify_deployment.py` (10/10 pass, 2025-11-12 run) logged to `docs/deployments/2025-11-12-verify-deployment.txt`; still need to refresh deploy snapshots + JSON artefacts before redeploying.
3. **W1.4 – Secret Hygiene + Smoke**: Remove plaintext helper credentials, rotate the Render Postgres password per `ApexDeliver Environment Variables - Master Reference.md`, then rerun `scripts/run_smoke_tests.sh production` with artefacts appended to `DEPLOYMENT_HEALTH.md` before resuming W2 backend coverage.

_On completion of these steps, continue executing W2/W3 stories under BMAD dev-story loops until 100% completion is achieved._



