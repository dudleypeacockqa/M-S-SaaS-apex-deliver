# Project Completion Roadmap (2025-11-10 Refresh)

**Owner:** Delivery (Codex)  
**Methodology:** BMAD v6-alpha + strict TDD  
**Scope:** Platform (backend + frontend), Marketing site, Deployments, Documentation  
**Status:** Implementation Phase, Render deploys failing (backend + frontend)  

---

## 1. Current State (Sources: `BMAD_PROGRESS_TRACKER`, `bmm-workflow-status`, deploy logs)

### 1.1 Git & Worktree
- `HEAD (local)`: `0bc72b4 chore(frontend): fix build dependencies and clean up UI component files` (adds dependency fixes + doc updates).
- `origin/main`: `ded9734 fix(migrations): restructure UUID to String migrations and eliminate circular dependencies`.
- Status: local `main` is **ahead by 1 commit**; `0bc72b4` has not been pushed or referenced by any PR yet (risk of drift if workstation lost).
- Local diffs: Alembic revisions in-flight (`0cbf1e0e3ab5`, `dc2c0f69c1b1`, new `3a15202c7dc2`), deletions of obsolete migrations, new React hook/service for pipeline templates, plus mass `.bmad` doc edits tracked but not yet reviewed.
- BMAD directive: Run `workflow-init` under v6 to realign backlog before next dev story (still pending after dependency cleanup commit).

### 1.2 Tests & Coverage
- Backend: 663 tests passing (82.9% coverage) — last recorded run prior to migration shuffle; no new pytest evidence since commit `0bc72b4`.
- Frontend (app): ~1,066 tests passing (≈99% success) – pipeline/podcast suites green but valuation UI + financial dashboards still RED/not implemented.
- Marketing frontend: Phase 1 suite at 90% pass rate (206 specs) with Phase 2 asset integration outstanding.
- Gap: Need fresh end-to-end verification after dependency fixes plus RED-first tests for valuations/task automation per DEV-011/012 stories.

### 1.3 Deployments
- Backend Render service `dep-d48vc7qdbo4c73fm1n5g` (commit `f9ee907`) = `update_failed` (multi-head Alembic chain).
- Backend follow-up `dep-d48vt3adbo4c73fm6svg` (commit `8707204`) = `update_failed`; latest `latest-deploy.json` entry (`dep-d491s6ffte5s73aai0ig`, commit `ded9734`) is stuck at `update_in_progress` with no success timestamp.
- Frontend Render service `dep-d48vc72dbo4c73fm1mv0` (commit `f9ee907`) still `build_in_progress` with no confirmation of a green deploy post-migration shuffle; production health unknown.
- Conclusion: Render environment is **not 100% healthy**; backend migrations have never completed on Render since UUID→String restructure, and frontend deploy status is stale.

### 1.4 Feature Completion Snapshot (PRD reference `CODEX-COMPLETE-PROJECT-GUIDE.md`)
- ✅ DEV-001 .. DEV-010 foundations running in production.
- ⚠️ DEV-011 Valuation Suite: backend models/services exist, UI + integration + export tests pending.
- ⚠️ DEV-012 Task Automation: Celery stubs, UI incomplete, tests RED.
- ⚠️ DEV-013/F-003 Document Room UI: backend ready, React screens + entitlement tuning pending.
- ⚠️ DEV-016 Podcast Studio Phases 3-6 (service layer, API enforcement, frontend gating, E2E) open.
- ⚠️ Marketing MARK-002: Phase 2 of 10 (assets + integration) incomplete; later phases untouched.

### 1.5 Blockers / Risks
1. **Alembic divergence**: Production DB still on UUID-based `users.id`. New migrations require careful sequencing + data verification before redeploy.
2. **Render drift**: Last confirmed healthy checks dated 2025-10-28; current deploy logs show repeated `update_failed` / stuck builds.
3. **Story tracking**: `bmm-workflow-status.md` still mid-story (`W1` migrations). Need BMAD `workflow-init` + tracker sync before writing new code.
4. **Coverage debt**: Backend coverage target 80%+ threatened by new migrations + upcoming services; frontend valuation UI lacks automated tests.
5. **Source control hygiene**: Local main ahead of origin with unpushed dependency-fix commit; losing context risks rework. Need push/PR discipline aligned with BMAD artifacts.

---

## 2. Guiding Principles
- Follow BMAD loop per story: `workflow-status → workflow-init → create-story → dev-story → review-story → retrospective`.
- Enforce TDD: RED (tests first) → GREEN (minimal implementation) → REFACTOR (while suites stay green). Every bullet below lists required tests.
- Keep artefacts synchronized: update `BMAD_PROGRESS_TRACKER`, `bmm-workflow-status`, relevant story docs, deployment checklists after each sprint.
- Maintain coverage guardrails: backend ≥80%, platform frontend ≥85%, marketing ≥90% before final release.

---

## 3. Workstreams to Reach 100%

### W0 – BMAD & Governance (Analyst)
- Run/record `workflow-init` to confirm enterprise greenfield track under v6.
- Reconcile story inventory (`docs/bmad/stories/*.md`) with open DEV tickets (011-018, MARK-002+).
- Output: Updated `bmm-workflow-status.md` (phase, current workflow, next action), tracker entry, refreshed backlog ordering.

### W1 – Platform Stability & Deploy Recovery (DevOps + Backend)
1. **Alembic chain repair**
   - Tests: `pytest backend/tests/test_migrations -k users_id && alembic heads` (RED before fixes).
   - Actions: finalize `3a15202c7dc2`, adjust `0cbf1e0e3ab5` + `dc2c0f69c1b1` sequencing, retire superseded revisions (`e19f4551fcb0`, `f5b6c2c9d4f2`).
   - Verification: `alembic upgrade head` on clean DB, capture plan in `docs/migrations/`.
2. **Render smoke automation**
   - Scripts: `scripts/run_smoke_tests.sh`, `scripts/verify_migrations.sh` (RED if missing or outdated).
   - Deploy: Trigger backend + frontend redeploys, record results in `backend-deploy*.json`, `frontend-deploy*.json`, `DEPLOYMENT-...md`.
   - Health evidence: `curl https://ma-saas-backend.onrender.com/health`, frontend preview screenshots.

_Done when:_ Single Alembic head, Render deploy status = `live`, smoke logs updated, docs cite new timestamps.

### W2 – Backend Feature Completion (DEV-011/012/016/018)
1. **Valuation Suite (DEV-011)**
   - Tests to author first: `tests/test_valuation_api.py`, `tests/services/test_valuation_calculator.py`, covering CRUD, scenario exports, entitlement gating.
   - Implement missing services/controllers, ensure IA alignment with `docs/bmad/stories/DEV-011-*.md`.
2. **Task Automation & Matching (DEV-012/013)**
   - Extend Celery mocks + fixtures in `backend/tests/conftest.py` so automation flows run deterministically.
   - Add service tests for rule execution + doc generation triggers.
3. **Podcast Studio Phases 3-6 (DEV-016)**
   - Service/API gating tests in `tests/api/test_podcast_routes.py` (RED) before applying `require_feature`.
   - Add multi-language + quota path coverage per `docs/bmad/stories/DEV-016-podcast-studio-subscription.md`.
4. **Entitlement/Analytics Hardening (DEV-018)**
   - Expand comparables/export audit logging tests; reference `financial_engine_service` spec.

_Done when:_ All DEV-011..018 stories marked ✅ with passing suites, coverage checked in `coverage.json`, story docs updated.

### W3 – Frontend Application Experience
1. **Pipeline Templates UI + hooks**
   - Finish API wiring for `frontend/src/hooks/pipelineTemplates.ts` + `services/api/pipelineTemplates.ts` (tests in `frontend/src/hooks/__tests__/pipelineTemplates.test.ts`).
   - Integrate into `DealKanbanBoard` and `CreateDealModal` (Vitest + RTL).
2. **Valuation Workspace UI**
   - Build `ValuationSuite` components per PRD, co-located tests (`ValuationSuite.test.tsx`).
3. **Document Room & Deal Detail pages**
   - Use BMAD story docs to drive TDD for each page (component + integration tests, Cypress/Playwright smoke optional if available).
4. **Podcast Studio gating**
   - Mirror backend entitlement copy; update `PodcastStudio.test.tsx`, `FeatureGate.test.tsx`.

_Done when:_ Critical journeys (Deal → Detail → Docs → Valuation → Podcast) have UI, tests, and Storybook/visual artefacts recorded.

### W4 – Marketing Website (MARK-002+)
- Phase 2 asset integration: drop generated hero/feature assets into components, update tests & snapshots.
- Phases 3-6: Additional sections (Pricing, Case studies, Resources, Conversion CTAs) with TDD (component + page tests + Lighthouse runs recorded in `docs/marketing/*`).
- Analytics & SEO (Phase 7-8): GA4 tags, structured data, sitemap updates per `docs/marketing/analytics-implementation.md`.
- Final QA (Phase 9-10): Cross-browser, accessibility, Render preview.

_Done when:_ Roadmap doc shows 10/10 phases complete, marketing tests ≥90% pass, deployment evidence captured.

### W5 – Quality Gates, Release & Handoff
- Re-run full backend `pytest --cov=backend/app --maxfail=1` and frontend `npm run test -- --coverage` + `npm run lint` + `npm run build`.
- Update `docs/PRODUCTION-DEPLOYMENT-GUIDE.md`, `PRODUCTION-DEPLOYMENT-CHECKLIST.md`, `RELEASE_NOTES_v1.0.md` (or new release doc) with latest metrics.
- Prepare PR (Conventional Commit), attach BMAD session summaries, include Render verification logs/screenshots, respond to question "deploy health 100%" with evidence.

---

## 4. Sequencing & Dependencies
1. **W0 → W1**: Cannot code new stories until workflow rebaseline + migrations resolved.
2. **W1 → W2/W3**: Backend/Frontend stories depend on stable schema + healthy deploy platform.
3. **W2 ↔ W3**: Execute feature pairs (backend first, frontend second) using alternating TDD cycles to keep APIs + UI aligned.
4. **W4** can progress in parallel once deployments stable, but final launch blocked on W5 verification.
5. **W5** gates final delivery; all earlier workstreams must supply artefacts/tests for release package.

---

## 5. Tracking & Reporting Expectations
- After each story: update corresponding `docs/bmad/stories/DEV-xxx*.md`, `BMAD_PROGRESS_TRACKER.md`, commit with Conventional Commit + BMAD reference.
- Maintain deployment evidence (`backend-deploy*.json`, `frontend-deploy*.json`, `DEPLOYMENT-SESSION-SUMMARY.md`).
- Coverage metrics: attach `backend/coverage.json`, `frontend/coverage/coverage-final.json`, note % in tracker.
- Marketing phases: log outcomes under `docs/marketing/*.md` with screenshots or asset references.

---

## 6. Immediate Next Steps (2025-11-10)
1. **Analyst (W0)**: Run/record `workflow-init` + backlog reconciliation so BMAD records move from tooling upgrade → actionable migration story. Capture outcome in `bmm-workflow-status.md` and tracker.
2. **DevOps (W1)**: Finish Alembic verification story by writing RED pytest cases for billing/subscription smoke paths, re-running `pytest tests/test_billing_endpoints.py tests/test_subscription_error_paths.py --cov ...` + `alembic upgrade head` on a clean DB, then packaging logs for deployment.
3. **Release (W1)**: Push commit `0bc72b4` (or integrate into new Conventional Commit) and open/refresh PR per `PR_DESCRIPTION.md` so Render/autodeploy can consume the fixes once verified.
4. **QA/DevOps (W1)**: Trigger backend + frontend Render redeploys only after smoke suite passes; capture new `backend-deploy*.json`, `frontend-deploy*.json`, and health-check screenshots proving 100% deploy health.
5. **Documentation (W1/W2)**: Update `DEPLOYMENT-SESSION-SUMMARY.md`, `STATUS.md`, and marketing/feature story docs with new coverage metrics + Render evidence; these artefacts answer stakeholder question re: deploy health.

_After W1 closes green, resume DEV-011 valuation suite via BMAD `dev-story` cycle with strict RED → GREEN → REFACTOR._
