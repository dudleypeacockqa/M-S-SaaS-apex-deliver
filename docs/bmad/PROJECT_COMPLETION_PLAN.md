# Project Completion Roadmap (2025-10-30)

## Objective
Deliver a 100% production-ready M&A Intelligence Platform using BMAD + TDD, with all DEV stories complete, all tests GREEN, documentation current, and Render deployment verified as healthy.

## Current Validation Snapshot
- **Backend**: `backend/venv/Scripts/python.exe -m pytest --maxfail=1 --disable-warnings` → **605 passed / 0 failed / 38 skipped** (external integrations intentionally skipped).
- **Frontend**: `npm --prefix frontend run test -- --pool=forks --maxWorkers=1` → **748 passed / 0 failed**.
- **Documentation**: BMAD tracker + workflow status refreshed (Sprint 4 – Production Hardening & Release Prep). Story docs pending update with latest DEV-016 backend work.
- **Deployment**: Last Render smoke recorded 2025-10-28; rerun backend `/health` + frontend preview and log evidence before further releases.

## Completion Strategy (BMAD Cycles)
Each workstream follows iterative BMAD loops (Build → Measure → Analyze → Decide) with RED → GREEN → REFACTOR discipline.

### Workstream A – Regression Recovery (Complete)
- MatchingWorkspace, BulkActions, AnalyticsProvider, DataRoom suites restored to GREEN with deterministic mocks.
- Action: keep regression watch scripts handy; no further work unless new REDs appear.

### Workstream B – DEV-016 Podcast Studio Completion
1. **Backend follow-through**
   - Monitor `reset_monthly_usage` usage and add scheduler story if needed (cron or Celery beat entry).
   - Extend transcription service coverage for AI-enhanced + multi-language tiers (AsyncMock fixtures ready).
2. **Frontend UX**
   - Surface transcript language + word count in Podcast Studio UI; gate non-English requests with upgrade CTA.
   - Add Vitest coverage in `PodcastStudio.test.tsx`, `AudioUploadModal.test.tsx`, screenshot artefacts for docs.
3. **Docs & Ops**
   - Update `docs/bmad/stories/DEV-016-podcast-studio-subscription.md` with backend completion evidence (quota reset, multi-language gating).
   - Note new API fields (`transcript_language`, `word_count`) in API reference.

### Workstream C – DEV-011 Valuation Suite Hardening
1. Re-run comparables/precedents analytics tests, add export audit logging coverage.
2. Polish frontend analytics (scenario editing modal, charts) and ensure Growth-tier gating messaging consistent with entitlement helpers.
3. Sync story artefact + release notes once hardening complete.

### Workstream D – Remaining Core Stories & Quality Gates
1. **DEV-012 / DEV-018**: Map dirty worktree files to respective stories; schedule RED cycles for task automation & deal matching UI polish.
2. **Quality / Security**: Axe/Lighthouse sweeps, API perf benchmarks, ensure log redaction + rate limiting documented.
3. **DevOps**: Align Render env vars, integrate smoke script into CI, ensure monitoring (Sentry/New Relic) configured per docs.

### Workstream E – Final Verification & Release
1. **Test & Build Matrix**: pytest + coverage; `npm run lint`, `npm run build`, generate coverage artefacts.
2. **Render Deployment**: Run smoke tests, resolve apex DNS issue, capture screenshots/logs in deployment checklist.
3. **Release Packaging**: Conventional commits, PR description, release notes, BMAD retrospective, completion metrics.

## Dependencies & Sequencing
1. Execute Render smoke checks and update deployment artefacts.
2. Finish DEV-016 frontend transcription/quota UX.
3. Harden DEV-011 valuation exports/analytics.
4. Drive remaining story backlog (DEV-012/DEV-018) under Workstream D.
5. Conclude with Workstream E verification and packaging.

## Risks & Mitigations
- **Deployment Drift**: Treat smoke checks as blocking; record evidence after each major change.
- **Coverage Regression**: Maintain RED → GREEN discipline; persist targeted suites in scripts.
- **Entitlement Complexity**: Use shared helpers (`get_feature_upgrade_message`, `reset_monthly_usage`) to avoid duplicated logic.
- **Timeline Creep**: Keep tracker/workflow status current; escalate blockers early.

## Immediate Next Actions (2025-10-30 12:30 UTC)
1. Run `./scripts/run_smoke_tests.sh` and document results in deployment artefacts.
2. Update DEV-016 story + release docs with quota reset & transcription changes.
3. Extend Podcast Studio UI/tests to surface new transcript metadata and multi-language gating copy.
4. Capture BMAD tracker entry + workflow status with smoke outcome.
5. Reassess remaining DEV-016 frontend tasks and plan next RED cycle.
