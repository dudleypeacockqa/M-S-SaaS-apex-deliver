# Marketing Site BMAD + TDD Execution Checklist

**Prepared:** 30 October 2025  
**Scope:** https://100daysandbeyond.com marketing experience (ApexDeliver + CapLiquify)

---

## 1. Mission & Success Criteria

- **Business Goal:** Re-establish a production-ready marketing funnel with working blog, lead capture, and accurate SEO metadata.
- **Engineering Goal:** Deliver fixes through strict BMAD loops (Build -> Measure -> Analyze -> Decide) with Test-Driven Development (RED -> GREEN -> REFACTOR) for every functional change.
- **Definition of Done:**
  - All critical regressions in docs/CRITICAL_BUGS_REPORT.md resolved with evidence.
  - Frontend Vitest coverage >= 85% on marketing bundle; backend pytest coverage >= 90% on marketing APIs.
  - Playwright smoke suite passes against staging and production.
  - Render health checks green for `/api/blog`, `/api/marketing/contact`, `/api/marketing/subscribe`.
  - Search Console & Lighthouse confirm canonical metadata (`100daysandbeyond.com`).

---

## 2. Workstreams & TDD Backlogs

| Workstream | Blocking Issue | RED Tests Required | GREEN Deliverables | Measure & Analyze | Decide Gate |
|------------|----------------|--------------------|--------------------|-------------------|-------------|
| WS-01 Blog API & Feed | `/blog` empty, `/api/blog/posts` 500 | `frontend/src/pages/marketing/__tests__/BlogListingPage.contract.test.tsx`; `backend/tests/api/test_blog_api.py`; Playwright `tests/blog-smoke.spec.ts` | FastAPI route returns seeded JSON; React fetch uses `VITE_API_URL`; friendly fallback on 5xx | Render uptime monitor + nightly Playwright | Promote when monitors stay green 24h and CI passes |
| WS-02 Contact Pipeline | Form drops submissions; schema still points to legacy domain | `frontend/src/pages/marketing/__tests__/ContactPage.form.test.tsx`; `backend/tests/api/test_marketing.py` (contact); Playwright `tests/contact-flow.spec.ts` | `/api/marketing/contact` stores + notifies; JSON-LD schema updated; UI surfaces success/error | Logging dashboard + analytics funnel | Decide after 24h of clean submissions and updated schema evidence |
| WS-03 Newsletter Opt-In | `/api/marketing/subscribe` missing / silent | `frontend/src/components/marketing/__tests__/OptInPopup.test.tsx`; `backend/tests/api/test_marketing.py` (subscribe); Playwright `tests/optin-popup.spec.ts` | ESP/webhook integration with explicit UI confirmation | Conversion telemetry + Sentry alerts | Decide when opt-in success >= 98% without silent failures |
| WS-04 Canonical/OG Metadata | Pages reference `apexdeliver.com` | `frontend/src/pages/marketing/*.meta.test.tsx`; Playwright `tests/seo-meta.spec.ts` | Central domain constant; HTML shell & SEO helpers updated | Screaming Frog / Lighthouse crawl + Search Console trend | Decide when crawls show 0 duplicate canonical warnings |
| WS-05 Media & Integrations | Team portraits 404; `/integrations` 404 | `frontend/src/pages/marketing/__tests__/TeamPage.assets.test.tsx`; Playwright `tests/integrations-link.spec.ts` | CDN/local assets published; `/integrations` page or redirect live | HEAD checks + 7 day log review | Decide after zero asset 404s for 7 consecutive days |
| WS-06 Type Safety & CI Gates | `tsc --noEmit` disabled; CI missing tests | CI job running `npm run test`, `npm run build:check`, `pytest`, Playwright | Types repaired; CI required checks enforced | GitHub Actions dashboard + coverage reports | Decide when three consecutive pipelines finish green |

---

## 3. BMAD Loop Checklist

1. **Build** – RED -> GREEN -> REFACTOR (code + docs updated together).
2. **Measure** – Run Vitest, pytest, Playwright locally and in CI; capture coverage, Render health checks, analytics.
3. **Analyze** – Review dashboards (Render, Sentry, Search Console, Lighthouse) and compare to thresholds.
4. **Decide** – Update documentation only after evidence is captured and archived.

Maintain a daily BMAD log (e.g., docs/bmad/DAILY_STATUS_NOTES.md) summarising Build/Measure/Analyze outcomes.

---

## 4. Required Test Suites (RED first)

### Frontend (Vitest + React Testing Library)
- `frontend/src/pages/marketing/__tests__/BlogListingPage.contract.test.tsx`
- `frontend/src/pages/marketing/__tests__/ContactPage.form.test.tsx`
- `frontend/src/components/marketing/__tests__/OptInPopup.test.tsx`
- `frontend/src/pages/marketing/__tests__/TeamPage.assets.test.tsx`
- `frontend/src/pages/marketing/*.meta.test.tsx`
Command: `cd frontend && npm run test -- --runInBand`

### Backend (pytest)
- `backend/tests/api/test_blog_api.py`
- `backend/tests/api/test_marketing.py`
Command: `cd backend && pytest --maxfail=1 --disable-warnings`

### Playwright (E2E)
- `tests/blog-smoke.spec.ts`
- `tests/contact-flow.spec.ts`
- `tests/optin-popup.spec.ts`
- `tests/seo-meta.spec.ts`
- `tests/integrations-link.spec.ts`
Command: `npx playwright test --config playwright.dev.config.ts`

---

## 5. CI & Automation Requirements

- GitHub Action `marketing-ci.yml` must run lint, unit tests, build check, pytest, Playwright, and publish coverage.
- Ensure Render health checks for marketing endpoints/pages are configured.
- Schedule nightly Playwright smoke via GitHub Actions cron and store artifacts on failure.

---

## 6. Weekly Execution Rhythm

| Day | Actions | Evidence |
|-----|---------|----------|
| D0 | Commit RED tests (WS-01, WS-02); CI fails by design | Failing Vitest/pytest outputs |
| D1 | Ship WS-01 fix, rerun suites, add monitors | Green test runs + Render log screenshot |
| D2 | Ship WS-02 fix, update schema, verify analytics | Green tests + schema diff |
| D3 | Implement WS-03 endpoint + UI, enable telemetry | Opt-in metrics + test results |
| D4 | Resolve WS-04 metadata, rerun snapshots, Lighthouse | Snapshot diffs + Lighthouse report |
| D5 | Publish assets + `/integrations`, seed HEAD monitor | Playwright pass + 404 log |
| D6 | Re-enable `tsc --noEmit`, enforce CI gates | GitHub Actions green pipeline |
| D7 | Decide review: rerun verification checklist, capture evidence, update docs | Completed checklist + sign-off |

---

## 7. Documentation & Ownership

- Update `docs/CRITICAL_BUGS_REPORT.md` after each Analyze/Decide stage with evidence links.
- Change statuses in `docs/WEBSITE_SPECIFICATION.md` only when Decide proof exists.
- Resume blog publishing per `docs/BLOG_CONTENT_PLAN.md` after WS-01/02/03 Decide.
- Track loop progress in `docs/bmad/BMAD_PROGRESS_TRACKER.md`.
- Owners: Frontend @frontend-dev, Backend @backend-dev, QA @qa-lead, PM/PO @product-owner.

---

**Next Review:** During the WS-04 Decide checkpoint or sooner if regressions appear.
