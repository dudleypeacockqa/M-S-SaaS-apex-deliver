# Session 2025-11-13: Codex Plan Refresh Toward 100% Completion

**Status**: 🚧 IN PROGRESS — Plan aligned with BMAD v6 + TDD guardrails
**Owner**: Codex (autonomous)
**Mission**: Reaffirm remaining scope, sequence the execution roadmap, and log artefacts/tests required en route to 100% delivery.

---

## Context Sweep

| Dimension | Reality Check | Evidence |
|-----------|---------------|----------|
| Completion | ~76% of roadmap (Phase 3 net-new features untouched; Document Generation partially wired) | docs/bmad/100-PERCENT-COMPLETION-STATUS.md
| Frontend Quality | 9 files / 14 tests failing (routing, Auth, PodcastStudio, valuation export mocks) | docs/tests/2025-11-13-frontend-final-verification.txt
| Backend Quality | 814/814 tests passing, 84% cov; deploy stuck on commit 5b85557 | docs/tests/2025-11-13-backend-full-suite-final.txt; docs/deployments/2025-11-13-backend-deploy-status.json
| Documentation | Only ~12/42 stories expose STATUS markers; workflow doc stuck at Phase 6 COMPLETE | docs/bmad/BMAD_PROGRESS_TRACKER.md; docs/bmad/bmm-workflow-status.md
| Accessibility | Axe clean locally; Lighthouse artefacts missing due to Windows headless limits | docs/testing/axe-report.json

---

## Phased Execution Plan (BMAD + TDD)

### Phase 0 – Stabilize Quality & Governance (Target: 2-3 working days)
- **P0.1 Focused Vitest Recovery**: Run npm run test -- --run --pool=threads src/tests/routing.test.tsx src/features/auth/Auth.test.tsx src/App.test.tsx src/pages/podcast/PodcastStudioRouting.test.tsx src/pages/marketing/__tests__/BlogListingPage.contract.test.tsx. Capture RED output (docs/tests/2025-11-13-frontend-focused-run.txt), patch Clerk mocks/MSW handlers/getExportStatus stubs, rerun until GREEN. Finish with npm run test -- --run --coverage --pool=threads; archive to docs/tests/2025-11-13-frontend-full-suite.txt plus coverage artefact.
- **P0.2 Story + Workflow Hygiene**: Sweep DEV-002→DEV-007, MARK-001/005-008, OPS-004/005 for STATUS markers with evidence; update docs/bmad/BMAD_PROGRESS_TRACKER.md and docs/bmad/bmm-workflow-status.md (Phase 4/5 IN PROGRESS, include NEXT_ACTION = Vitest + Deploy + Audits).
- **P0.3 Accessibility & Lighthouse Evidence**: Run scripts/run_local_audits.sh via Linux container (avoid Windows NO_FCP), stash outputs under docs/marketing/2025-11-13-audits/, link from MARK-002 plus CLAUDE.md.
- **P0.4 Backend Redeploy Fix**: Inspect Render logs (dep-d4ad8lffte5s739g5gug), ensure Alembic head matches, trigger deploy via python trigger_render_deploy.py --service srv-d3ii9qk9c44c73aqsli0. Log status in docs/deployments/YYYY-MM-DD-backend-redeploy.txt and refresh latest-deploy.json plus smoke report.

**Exit Criteria**: Focused + full Vitest runs green with coverage report; targeted BMAD stories updated; Lighthouse evidence captured; backend redeployed from HEAD with smoke tests logged.

### Phase 1 – Complete In-Flight Features (Target: 1-2 weeks)
1. **Document Generation Integration (DEV-014 / F-009)**
   - RED: add Vitest integration spec (frontend/src/features/documents/__tests__/DocumentEditor.integration.test.tsx) failing against new /api/document-generation routes.
   - Implement frontend service + React Query hooks hitting new backend endpoints; handle async export jobs, status polling, download links.
   - Extend backend tests for template CRUD + render toggles; ensure file streaming/resume cases covered.
   - Update DEV-014 story with STATUS ✅ when UI ↔ API flows verifiably green; attach recordings.

2. **Valuation Suite UI Polish (DEV-011)**
   - RED: extend ValuationSuite.test.tsx for export template picker + comparison charts.
   - Implement UI (Recharts + Tailwind), ensure subscription tier gating consistent.
   - Update docs/screenshots + story evidence.

3. **Podcast Studio Subscription Gating (DEV-016)**
   - Add tests for tier gating, transcript availability, and error handling.
   - Normalize MSW fixtures + quotas API; confirm PodcastStudioRouting.test.tsx stays green under --pool=threads.

**Exit Criteria**: All DEV-011/014/016 stories show STATUS ✅ with evidence; Document Generation + Valuation exports and Podcast gating fully integrated.

### Phase 2 – New Roadmap Features (Target: 6-8 weeks)
- **F-012 Event Management Hub**: Design SQLAlchemy models (Event, Session, TicketType, Registration), Alembic migration, FastAPI router/services, pytest coverage. Build React feature folder (frontend/src/features/events/) with dashboards, creation wizard, attendee roster, ticket analytics. Vitest suites for each surface + MSW fixtures.
- **F-013 Community Platform**: Models (Post, Comment, Reaction, Follow, ModerationLog), feed APIs, WebSocket/long polling for live updates, moderation admin tools. React feature folder (frontend/src/features/community/) with feed, post composer, profile view, notifications. TDD loops for backend + frontend; align entitlement checks in services.

**Exit Criteria**: Event Hub + Community Platform deliver CRUD, analytics, and governance flows end-to-end with tests, docs, and story evidence.

### Phase 3 – Release & Handoff (Target: 2-3 days)
- Run full backend + frontend suites (pytest with coverage, npm run test -- --coverage --pool=threads, npm run lint, npm run typecheck).
- Execute accessibility/perf audits (Axe, Lighthouse CI) and archive results.
- Update BMAD tracker, 100-PERCENT-COMPLETION-STATUS.md, release notes, deployment evidence. Tag v1.0.0 and finish ops checklist.

---

## Immediate Action Stack (Next 24h)
1. Execute focused Vitest run ↔ fix mocks (Clerk SignIn export, MSW bypass strategy) via RED→GREEN loops.
2. Update DEV-014 header + body to reflect backend readiness + pending UI wiring.
3. Append “Session 2025-11-13 Codex Plan Refresh” entry in docs/bmad/BMAD_PROGRESS_TRACKER.md referencing this doc + evidence.
4. Kick off backend redeploy investigation (logs + Alembic head) in parallel with Vitest fixes if time permits.

All steps must log artefacts (test outputs, doc diffs, deploy logs). Maintain strict BMAD cadence: RED → GREEN → REFACTOR → DOCUMENT per task, with STATUS markers updated before story closure.
