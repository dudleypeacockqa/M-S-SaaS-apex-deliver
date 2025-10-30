# Marketing Site BMAD + TDD Execution Plan

**Prepared:** 30 October 2025  
**Scope:** https://100daysandbeyond.com marketing experience (ApexDeliver + CapLiquify)

---

## 1. Mission & Success Criteria

- **Business Goal:** Re-establish a production-ready marketing funnel with working blog, lead capture, and accurate SEO metadata.
- **Engineering Goal:** Deliver fixes through strict BMAD loops (Build → Measure → Analyze → Decide) with Test-Driven Development (RED → GREEN → REFACTOR) for every functional change.
- **Definition of Done:**
  - All critical regressions in docs/CRITICAL_BUGS_REPORT.md resolved with evidence.
  - Frontend Vitest coverage ≥ 85% on marketing bundle; backend pytest coverage ≥ 90% on marketing APIs.
  - Playwright smoke suite passes against staging + production.
  - Render health checks green for /api/blog, /api/marketing/contact, /api/marketing/subscribe.
  - Search Console & Lighthouse confirm canonical metadata (100daysandbeyond.com).

---

## 2. Workstreams & TDD Backlogs

| Workstream | Blocking Issue | TDD Assets (RED tests) | GREEN Deliverables | Measure & Analyze | Decide Gate |
|------------|----------------|------------------------|--------------------|-------------------|-------------|
| **WS-01 Blog API & Feed** | /blog empty, /api/blog/posts 500 | rontend/src/pages/marketing/__tests__/BlogListingPage.contract.test.tsx; ackend/tests/api/test_blog_api.py; Playwright 	ests/blog-smoke.spec.ts | FastAPI route returns seeded JSON; React fetch uses VITE_API_URL; fallback UI only when API 5xx | Render uptime monitor + Playwright nightly run | Promote when monitors 24h green & tests pass in CI |
| **WS-02 Contact Pipeline** | Contact form drops submissions | rontend/src/pages/marketing/__tests__/ContactPage.form.test.tsx; ackend/tests/api/test_marketing_contact.py; Playwright 	ests/contact-flow.spec.ts | /api/marketing/contact endpoint with email/CRM hook; UI surfaces success/error | Log pipeline + conversion dashboard | Move to Decide after analytics show submissions + zero 5xx for 24h |
| **WS-03 Newsletter Opt-In** | /api/marketing/subscribe missing, silent failure | rontend/src/components/marketing/__tests__/OptInPopup.test.tsx; ackend/tests/api/test_marketing_subscribe.py | Working subscription endpoint (ESP/webhook); UI error state vs success | Track opt-in conversions; Sentry alert on rejects | Decide when opt-in success ≥98% without silent errors |
| **WS-04 Canonical/OG Metadata** | Pages reference pexdeliver.com | Metadata snapshots for each marketing page (*.meta.test.tsx); Playwright seo-meta.spec.ts | Central domain constant; HTML shell updated; fallback checks | Screaming Frog / Lighthouse crawl + Search Console trend | Decide when crawl shows 0 duplicate canonical warnings |
| **WS-05 Media & Integrations** | Team portraits 404; /integrations 404 | Vitest TeamPage.imageFallback.test.tsx; Playwright integrations-link.spec.ts | CDN/local assets published; /integrations page or redirect shipped | Synthetic HEAD checks + monitoring for 7 days | Decide after zero 404s for 7 days |
| **WS-06 Type Safety & CI Gates** | 	sc --noEmit disabled; CI missing tests | 
pm run build:check executed in CI (RED until fixed) | Types cleaned; 	sc --noEmit re-enabled; CI runs Vitest, lint, pytest, Playwright | CI dashboard; coverage reports in PR | Decide when CI required checks all green for 3 consecutive runs |

---

## 3. BMAD Loop Templates

1. **Build** – Write failing tests (RED), implement minimal code (GREEN), refactor and document.
2. **Measure** – Run Vitest/pytest/Playwright locally and in CI; capture coverage + observability metrics.
3. **Analyze** – Review Render/Sentry/analytics dashboards; compare KPIs to acceptance thresholds; log findings.
4. **Decide** – If thresholds met, merge & deploy; otherwise create follow-up story and restart loop.

---

## 4. Test Catalog

### 4.1 Frontend (Vitest + React Testing Library)
- rontend/src/pages/marketing/__tests__/BlogListingPage.contract.test.tsx
- rontend/src/pages/marketing/__tests__/ContactPage.form.test.tsx
- rontend/src/components/marketing/__tests__/OptInPopup.test.tsx
- rontend/src/pages/marketing/__tests__/TeamPage.assets.test.tsx
- rontend/src/pages/marketing/*.meta.test.tsx

Command: cd frontend && npm run test -- --runInBand (RED before implementation).

### 4.2 Backend (pytest)
- ackend/tests/api/test_blog_api.py
- ackend/tests/api/test_marketing_contact.py
- ackend/tests/api/test_marketing_subscribe.py

Command: cd backend && pytest --maxfail=1 --disable-warnings.

### 4.3 Playwright (E2E)
- 	ests/blog-smoke.spec.ts
- 	ests/contact-flow.spec.ts
- 	ests/optin-popup.spec.ts
- 	ests/seo-meta.spec.ts
- 	ests/integrations-link.spec.ts

Command: 
px playwright test --config playwright.dev.config.ts (staging) and --config playwright.prod.config.ts (production smoke).

---

## 5. CI & Automation

- Add GitHub Action marketing-ci.yml running lint → unit tests → build check → pytest → Playwright.
- Enforce required checks on main and release branches.
- Configure Render health checks for /api/blog, /api/marketing/contact, /api/marketing/subscribe (backend) plus /blog, /contact, /integrations (frontend).
- Schedule nightly Playwright smoke via GitHub Actions cron; push artifacts for failures.

---

## 6. Execution Timeline

| Day | Deliverable |
|-----|-------------|
| D0 | RED tests for WS-01/02 committed; CI failing as expected |
| D1 | Blog API fix (GREEN) + Playwright blog smoke passing |
| D2 | Contact endpoint + UI (GREEN) with analytics logging |
| D3 | Newsletter endpoint + UI (GREEN); opt-in telemetry live |
| D4 | Canonical/OG refactor + metadata snapshots GREEN |
| D5 | Team assets + /integrations page, HEAD monitor seeded |
| D6 | Re-enable 	sc --noEmit; CI gating green |
| D7 | Decide review: rerun verification checklist, capture evidence, update trackers |

---

## 7. Documentation & Ownership

- Update docs/CRITICAL_BUGS_REPORT.md after each Decide checkpoint.
- Flip statuses in docs/WEBSITE_SPECIFICATION.md only with evidence (tests + monitors).
- Resume blog publishing (docs/BLOG_CONTENT_PLAN.md) post WS-01/02/03 Decide.
- Maintain BMAD tracker (docs/bmad/BMAD_PROGRESS_TRACKER.md).

**Owners:** Frontend @frontend-dev · Backend @backend-dev · QA @qa-lead · PM/PO @product-owner

**Last Reviewed:** 30 October 2025  
**Next Review:** After WS-04 Decide checkpoint
