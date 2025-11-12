# Session 2025-11-12Z-CODEX-PLAN – BMAD Governance + 100% Completion Roadmap

**Session Date:** 2025-11-12 17:20Z  
**Agent:** Codex CLI (GPT-5)  
**Methodology:** BMAD v6-alpha + TDD (strict RED → GREEN → REFACTOR)  
**Scope:** Establish verifiable baseline across git/tests/deployments and enumerate the next BMAD iterations required to drive Marketing + Master Admin work to 100% completion.

---

## 1. Current Baseline (Evidence Collected)

| Area | Status | Evidence |
| --- | --- | --- |
| Git divergence | `main` matches `origin/main`; working tree dirty with session artefacts and untracked folders (scripts, **2025-* dirs, test logs). | `git status -sb` @ 2025-11-12 17:02Z |
| Latest commit | `e4385fd docs(deploy): Session V deployment complete - 10/10 smoke tests passing` (same locally + remote). | `git log -1 --oneline` |
| Backend tests | `pytest` currently blocked during collection by phantom `backend/nul` path inside repo root (fails fast before tests run). | `backend-test-results-full.txt` |
| Frontend tests | Vitest run exits with GoalCard + ContactPage failures and coverage writer ENOENT. | `frontend-test-results.txt` |
| Backend deploy | Render `ma-saas-backend` live on `dep-d49k2bfdiees73ahiqn0` (commit `834fa20`). | `latest-deploy.json`, `docs/deployments/2025-11-13-final-verification.txt` |
| Frontend deploy | Render `ma-saas-frontend` live on `dep-d4a3q5n8qels73eqc250` (commit `e67d149`). | same as above |
| Health checks | CURL confirms `https://ma-saas-backend.onrender.com/health` and `https://100daysandbeyond.com` both return HTTP 200 as of 17:15Z. | terminal health probes |
| Outstanding stories | MARK-002/005 (homepage + SEO/case-study backlog), DEV-016 (podcast tier sync + coverage), Master Admin UI (Vitest failures + missing modules). | MARKETING_WEBSITE_STATUS.md, TODO.md, docs/bmad/stories/* |

**Conclusion:** Production is healthy, but local validation is red due to test harness issues and unresolved story acceptance items. We cannot progress without repairing the dev/test baseline and updating BMAD artefacts per session output.

---

## 2. Immediate BMAD/TDD Iterations (Next Actions)

1. **Governance Sync (P0)**
   - Capture this session in tracker + workflow files (append entry referencing this doc once work items kick off).
   - Normalize stray artefacts (identify why `backend/nul` exists; remove or add to gitignore without deleting user data).

2. **Testing Basement Repairs (P0)**
   - Backend: Investigate `backend/nul` reference (likely Windows-reserved file) so `pytest` can collect tests again; rerun `pytest --maxfail=1 --disable-warnings` to re-establish 677/678 baseline.
   - Frontend: Resolve GoalCard skeleton + ContactPage schema tests and the coverage `.tmp` path so Vitest coverage completes; document failures in `docs/tests/...` until green.

3. **Story Execution (P0/P1)**
   - **DEV-008** Secure Document Room: finish PermissionModal wiring + MSW-backed tests as outlined in `plan.md` (Iteration 1) before touching new marketing/UI scope.
   - **DEV-016** Podcast Studio: implement Clerk tier metadata sync, video playback, YouTube OAuth analytics, and monthly usage reset; add RED tests first in backend + frontend suites.
   - **MARK-002 / MARK-005**: Deliver homepage hero rebuild, structured data for pricing/features/FAQ/team, Lighthouse + axe evidence, 3 quantified case studies, mobile nav improvements, remaining 38 blog posts plan (batching allowed but need documented path to 50 posts).
   - **Master Admin UI**: Stabilize Vitest failures (GoalCard, Contact form) and continue building map modules per TODO.

4. **Deployment & Docs (P1)**
   - After each major story, rerun Render smoke tests via existing scripts (`docs/deployments/2025-11-13-*.txt` pattern) and update `latest-deploy.json` + BMAD trackers.
   - Keep MARKETING + DEPLOYMENT docs in sync (Lighthouse runs, accessibility, Render verification, etc.).

5. **Risk Tracking (P1)**
   - Document unresolved items (integration test skips, marketing content backlog, PodStudio OAuth) in `docs/bmad/BMAD_PROGRESS_TRACKER.md` once issues reproduced, so future agents inherit actionable context.

---

## 3. Deliverables for Next Work Session

- ✅ This session note (file) committed alongside any future code changes.
- 🔜 Update `docs/bmad/BMAD_PROGRESS_TRACKER.md` + `docs/bmad/bmm-workflow-status.md` after first GREEN cycle (post-test-basement fix) to keep BMAD records authoritative.
- 🔜 Attach new deployment/test outputs to `docs/deployments/` + `docs/tests/` as we re-run suites.

---

**Prepared By:** Codex CLI @ 2025-11-12 17:20Z

---

## Execution Updates (Rolling Log)

- **2025-11-12 18:15Z** – Completed MARK-002 Phase 5 action item by wiring JSON-LD structured data into Pricing, Features, and Team pages (ids `pricing-product-schema`, `features-software-schema`, `team-schema`). Updated Vitest suites (`PricingPage.test.tsx`, `FeaturesPage.test.tsx`, `TeamPage.test.tsx`) to assert the 100daysandbeyond.com domain is referenced in structured-data scripts. Targeted Vitest run: `npm run test -- src/pages/marketing/PricingPage.test.tsx src/pages/marketing/FeaturesPage.test.tsx src/pages/marketing/TeamPage.test.tsx` → 23/23 passing.
- **2025-11-12 18:35Z** – Shipped landing-page social proof section (450+/66%/500% stats, logos, testimonial) per MARK-002 homepage backlog. Updated `LandingPage.test.tsx` to cover the new copy. Attempted `node ./node_modules/vitest/vitest.mjs run --pool=threads src/pages/marketing/LandingPage.test.tsx`; run failed because the Vitest runner times out/misses Windows-specific deps (`tldts`).
- **2025-11-12 18:41Z** – Restored single-test reliability by running `npm run test -- --pool=threads --maxWorkers=1 …` (avoids worker startup flakiness) and extended `LandingPage.test.tsx` coverage for the new social-proof block. Also upgraded `MarketingNav.tsx` with keyboard-accessible dropdowns (aria-controls, arrow navigation, Escape support) plus Vitest coverage via `npm run test -- --pool=threads --maxWorkers=1 src/components/marketing/MarketingNav.test.tsx`.
