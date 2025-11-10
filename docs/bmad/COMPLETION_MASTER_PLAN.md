# Completion Master Plan (BMAD v6)

**Date**: 2025-10-31 14:30 UTC  
**Author**: Codex (Autonomous BMAD agent)  
**Context**: Sprint 6 - True 100% Completion (Baseline Recovery + Finish)

---

## 1. Current State Summary

- **Git**: main @ db6e0f fix(tests): resolve Auth, TeamPage, and AboutPage test failures (12 tests fixed) with dirty files in BMAD trackers and podcast/marketing specs (git status --short). No pending commits since origin/main.
- **Backend Tests**: ackend/venv/Scripts/python.exe -m pytest --maxfail=1 --disable-warnings currently **RED**. Runner aborts before collecting tests because 
umpy fails to import inside pp/services/deal_matching_service.py (compiled wheels missing; ImportError raised during ackend/tests/conftest.py import).
- **Frontend Tests**: 
pm --prefix frontend run test -- --pool=forks --maxWorkers=1 stalls after ~9 minutes with **multiple RED suites**. Observed failures: LiveStreamManager (ReferenceError: pollTimeoutRef undefined + missing ct() wrapping), PodcastStudio.featureGates (live streaming upgrade CTA assertion), BlogListingPage.contract (outage fallback expectation), FAQPage ("About Us" category missing). Suite did not complete due to unresolved errors/timeouts.
- **Deployment Evidence**: Last recorded smoke in docs/DEPLOYMENT_HEALTH.md dated 2025-10-29 18:45 UTC. No fresh Render health or smoke outputs captured today; redeploy state unverified.
- **Documentation**: Multiple BMAD artefacts drifted (e.g., BMAD_PROGRESS_TRACKER.md, mm-workflow-status.md) claiming 100% test pass despite current RED baseline. Completion plan, tracker, and workflow need realignment with actual status.

---

## 2. Gap Inventory (Blocks to 100%)

1. **Backend Dependency Failure**: Numpy import error prevents any pytest execution; blocks validation of valuation/deal matching code paths.
2. **Frontend Regression Debt**: Podcast live stream manager, marketing FAQ/blog suites, and gating specs failing; likely linked to unmerged refactors in dirty worktree.
3. **Marketing Coverage Shortfall**: Contract tests + FAQ suite failing; historic MARK-004 backlog (146 missing tests) still open.
4. **Documentation Drift**: BMAD trackers + workflow status inaccurate; success metrics overstated.
5. **Deployment Currency**: Render deployment status older than 48h; no smoke or health check evidence for current code.
6. **Remaining Feature Story Closure**: DEV-008 document room polish, DEV-011 valuation hardening, DEV-016 podcast UX, DEV-018 deal matching, plus MARK-004 coverage not fully validated.
7. **Quality Gates**: Coverage targets (backend �90%, marketing frontend �90%, platform frontend �85%) need fresh measurement once suites are green.

---

## 3. Roadmap to TRUE 100% Completion (BMAD v6 + TDD)

### Phase 0 – Baseline Hardening (In Progress)
1. Repair numpy installation inside ackend/venv (reinstall wheel or vendor stub without compiled deps). Re-run pytest to confirm suite collection and capture failure snapshot.
2. Rerun Vitest with forked runner; capture complete failure matrix and timings to quantify regression scope.
3. Update BMAD artefacts (BMAD_PROGRESS_TRACKER.md, mm-workflow-status.md, WORKTREE_DIRTY_CATALOG.md) with true RED baseline and assign owners.

### Phase 1 – Regression Recovery (Backend + Platform Frontend)
1. Restore pytest GREEN: fix numpy dependency, address any subsequent failing modules (deal matching, valuation). Refactor to avoid heavyweight numpy if feasible.
2. Stabilize Podcast Studio + LiveStream Manager hooks (fix pollTimeoutRef, ensure cleanup + ct usage). Re-run PodcastStudio.featureGates.test.tsx + LiveStreamManager.test.tsx under TDD (RED -> GREEN -> REFACTOR).
3. Audit other platform frontend failures (Routing, FeatureGate, etc.) and close them out sequentially. Maintain TDD per suite.

### Phase 2 – Marketing Excellence (MARK-004 & Related)
1. Resolve existing marketing REDs (FAQ, Security, Blog contract). Ensure copy/fixtures align with latest branding (100daysandbeyond.com).
2. Implement remaining MARK-004 coverage backlog (~146 tests) focusing on Footer, CTASection, MarketingLayout, SEO metadata.
3. Establish Playwright smoke suite for marketing flows; integrate into BMAD Measure stage.

### Phase 3 – Feature Completion & Hardening
1. **DEV-008 Secure Document Room**: Finalize permissions, audit logging, upload progress UI, version history tests. Align with Pydantic/SQLAlchemy schema updates.
2. **DEV-011 Valuation Suite**: Confirm backend + frontend analytics, exports, scenario editing, gating. Add RED tests for export audit logging + deterministic Monte Carlo coverage before implementation.
3. **DEV-016 Podcast Studio**: Complete live streaming entitlement UX, transcript language gating, quota HUD polish. Ensure backend cron/reset tasks documented and tested.
4. **DEV-018 Intelligent Deal Matching**: Finish numpy-light similarity engine (or alt deterministic approach), ensure tests do not rely on compiled deps, integrate with UI workspace.

### Phase 4 – Quality Gates & Documentation
1. Achieve coverage thresholds (backend �90%, platform frontend �85%, marketing �90%). Update coverage badges/metrics in docs.
2. Refresh BMAD stories, completion summaries, PRD checkpoints; maintain single source of truth.
3. Run performance + accessibility audits (Lighthouse, axe). Capture metrics and remediation plan.

### Phase 5 – Deployment & Release
1. Execute full automated test matrix (pytest, Vitest, Playwright, linters). Archive outputs in docs/DEPLOYMENT_HEALTH.md and story files.
2. Redeploy to Render (backend + frontend), record health endpoints, logs, and manual QA evidence within 24h of handoff.
3. Prepare release package: Conventional Commit summary, BMAD retrospective, risk register closure, operations handoff.

---

## 4. Cross-Cutting Workstreams

- **Tooling/Environment**: Containerize or script dependency reinstalls (numpy, scipy) to avoid platform-specific wheel failures. Consider replacing numpy dependency in deal matching with pure Python alt to simplify.
- **Test Infrastructure**: Stabilize Vitest fork runner (investigate timeouts, ensure itest.config.ts uses deterministic pool). Add watch scripts for quicker RED cycles.
- **Documentation**: Enforce real-time updates to BMAD tracker and workflow status after each BMAD loop. Remove legacy claims of 100% completion until evidence captured.
- **Governance**: Map dirty files to active stories; clean temporary artefacts once documented.

---

## 5. Immediate Next Actions

1. Reinstall or patch numpy inside ackend/venv; rerun pytest to confirm suite collection.
2. Isolate LiveStreamManager regression under TDD: add failing unit test capturing missing pollTimeoutRef cleanup, implement fix, rerun affected suite.
3. Update BMAD trackers (BMAD_PROGRESS_TRACKER.md, mm-workflow-status.md) with Phase 0 RED status, including new immediate action list and timestamp.
4. Capture full Vitest failure report (consider running targeted specs to avoid timeout) and log counts in BMAD tracker for transparency.

---

## 6. Success Metrics

- **Tests**: Backend pytest + platform frontend Vitest + marketing Vitest + Playwright smoke all GREEN (0 skipped unless external integration). No test runner timeouts.
- **Coverage**: Backend �90% (valuation, deal matching, podcast services highlighted), Platform frontend �85%, Marketing frontend �90%.
- **Deployment**: Render backend/frontend redeployed with health checks + smoke evidence dated within 24h of handoff. Documented in docs/DEPLOYMENT_HEALTH.md with curl outputs and test logs.
- **Documentation**: BMAD tracker, workflow status, and story files reflect true state with timestamped entries; completion report assembled.

> This plan supersedes prior entries (2025-10-28) and remains authoritative once corresponding BMAD artefacts are updated after each BMAD/TDD loop.