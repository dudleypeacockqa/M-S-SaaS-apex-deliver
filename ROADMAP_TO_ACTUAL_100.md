# Roadmap to Verified 100% Completion

## 1. Definition of "Done" for This Push
- **Code:** All FastAPI and React surfaces implemented for PRD scope (F-001 – F-013 plus Master Admin UI) with no TODO placeholders.
- **Tests:** Backend pytest and frontend Vitest suites pass locally (Windows) and in CI with coverage ≥80% / ≥85%. No skipped tests without documented credentials, and each external integration (Xero, QuickBooks, Sage, NetSuite, Stripe webhooks, S3) has at least one credential-backed run recorded.
- **Deployments:** Render backend/frontend on the latest commit with migrations applied, `/health` checks automated, smoke tests scripted, and GitHub Actions CI/CD (build + tests + smoke) required for merge.
- **Observability/Security:** Tenancy decision codified, backup/restore runbook executed, health checks + alerting scripted, demo datasets seeded for the CSV → lender-pack path.
- **Docs:** README, STATUS.md, PROJECT_STATUS_REPORT.md, BMAD trackers, and TODO reflect the same reality with evidence links.

## 2. Current Reality (2025-11-15)
1. **Frontend instability:** Vitest run fails (`frontend-test-final-2025-11-12.txt`) with missing `node:` polyfill, missing `date-fns`, and worker OOM. `frontend/FAILING_TESTS.md` lists StatCard/MatchCard/ContactPage/PodcastStudio issues. Master Admin UI workstreams not started (`TODO.md`).
2. **Backend integrations unverified:** Latest backend run shows 77 skips for Xero/QuickBooks/Sage/NetSuite/Stripe/S3 (`backend-test-final-2025-11-12.txt`). Deployment verification tasks unchecked (`PROJECT_STATUS_REPORT.md`, `TODO.md`).
3. **Deployment & observability gaps:** `STATUS.md` traffic lights amber for demo path, tenancy codification, observability, seed data, CI/CD, Render health. No GitHub Actions smoke pipeline, no automated Render checks.
4. **Documentation drift:** `README.md` and `FINAL-100PCT-VERIFICATION-2025-11-15.md` declare completion, but `PROJECT_STATUS_REPORT.md` and `TODO.md` list open blockers; BMAD workflow stops at sprint planning.

## 3. Workstreams & Tasks
### WS1 – Frontend Stabilization & Master Admin UI
1. Patch Vitest environment
   - add `node:` polyfills/import maps (`frontend/src/test/shims`)
   - ensure `date-fns` and other dependencies present or stubbed
   - re-run `domainConfig` + `DealCard` suites to confirm env health
2. Fix documented failing specs
   - StatCard negative trend + custom class tests
   - MatchCard loading state, ContactPage schema metadata, PodcastStudio transcript view
3. Implement Master Admin UI modules (Activity Tracker → Sales Collateral)
   - follow TODO sections; pair UI with API hooks & colocated tests (`*.test.tsx`)
4. Run full Vitest suite with `--pool=vmThreads`, collect coverage artifact, update `frontend-test-final-YYYY-MM-DD.txt`

### WS2 – Backend Integration Proof & Remaining Tests
1. Configure sandbox credentials (`env.READY_TO_USE`)
   - add secrets for Xero/QuickBooks/Sage/NetSuite/Stripe to `.env.local` or CI secrets
2. Enable boto3/storage tests by installing optional deps (document as extras in requirements)
3. Run focused pytest suites per integration, capture logs under `docs/tests/`
4. Address failures; ensure `test_scores_and_dashboard_stats` stays green
5. Update backend coverage report and summarize remaining skips with rationale only where impossible to test

### WS3 – Deployment, Observability, and Automation
1. **Render health automation:** extend `scripts/monitoring/collect_health_snapshot.py` to probe backend `/health` + frontend root, emit JSON, wire into GitHub Actions schedule.
2. **CI/CD workflow:** add GitHub Actions pipeline (lint → pytest → vitest → build → smoke) gating merges.
3. **Smoke + demo datasets:** finalize `scripts/dev-up.sh` + seeding for CSV → lender-pack; store curated data under `docs/demos/`.
4. **Tenancy + backup runbooks:** codify decision in `docs/tenancy/DECISION.md`, execute backup/restore dry run, capture evidence.
5. **Alerting:** configure PagerDuty/email notifications triggered by monitoring script failures.

### WS4 – Documentation & Alignment
1. Update README, STATUS.md, PROJECT_STATUS_REPORT.md, TODO.md with real progress + evidence links.
2. Extend BMAD workflow file to mark completed gates and log new work in BMAD trackers.
3. Produce consolidated completion proof (`FINAL-VERIFIED-REPORT.md`) once Milestones A–C complete.

## 4. Execution Order & Milestones
1. **Milestone A – Frontend Green** (WS1 tasks 1–4)
2. **Milestone B – Backend integrations verified** (WS2)
3. **Milestone C – Operations hardened** (WS3)
4. **Milestone D – Documentation synced + final proof** (WS4)

Target durations: A ≈ 2 days, B ≈ 2 days, C ≈ 3 days, D ≈ 1 day ⇒ ~8 working days to authentic 100% completion.

## 5. Immediate Starting Point
Begin with **WS1 Task 1** (Vitest environment fixes) because every downstream effort depends on a reliable frontend test harness.
