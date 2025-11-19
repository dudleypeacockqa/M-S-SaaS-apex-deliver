# Marketing Gap Analysis — 2025-11-19

## Source Inputs
- `docs/FINAL-COMPLETION-PLAN.md:33-140` documents the wave-based plan and explicitly calls for a marketing gap analysis plus SEO/integration deliverables.
- `MARKETING_WEBSITE_STATUS.md:5-110` captures the prior Nov 12 snapshot (90% complete, mobile nav polish + 38-post backlog still open).
- `COMPLETION-PLAN-2025-11-17.md:100-193` enumerates the integrations (chatbot, newsletter, lead capture, YouTube) and SEO artefacts (sitemap, robots, OG/Twitter, structured data) that must be implemented.
- `docs/CRITICAL_BUGS_REPORT.md:17-24` highlights unresolved contact/newsletter notification gaps and schema mismatches.
- Fresh automation proof for Playwright lives in `docs/tests/2025-11-19-playwright.txt:1-90` with the summary in `docs/deployments/2025-11-19-marketing-playwright.txt:1-15`; the broader Vitest log (with RED cases) is `docs/tests/2025-11-19-frontend-vitest.txt:1-200`.

## Parity Snapshot

| Surface / Capability | Implementation Evidence | Remaining Gap |
| --- | --- | --- |
| Global layout, structured data, nav | `frontend/src/components/marketing/MarketingLayout.tsx:10-48` wraps every marketing page with skip links, org schema, `MarketingNav`, `Footer`, and the opt-in popup. | Mobile nav focus/animation polish plus final QA for dropdown accessibility remain open per `MARKETING_WEBSITE_STATUS.md:84-90`.
| Core marketing pages | Landing, pricing, solutions, and trust pages are live: `frontend/src/pages/marketing/EnhancedLandingPage.tsx:1-400`, `PricingPage.tsx:1-250`, `CapLiquifyFPAPage.tsx:1-220`, `SalesPromotionPricingPage.tsx:1-330`, `FourStageCyclePage.tsx:1-260`, `FeaturesPage.tsx:1-280`, `SecurityPage.tsx:1-260`, `FAQPage.tsx:1-210`, `AboutPage.tsx:1-200`, `TeamPage.tsx:1-260`, `CaseStudiesPage.tsx:1-140`, `PodcastPage.tsx:1-220`, and `ContactPage.tsx:1-280`. Each route includes matching Vitest coverage under `frontend/src/pages/marketing/*.test.tsx`. | Need updated screenshots, SEO artefacts (sitemap/robots), and parity verification against the apexdeliver-marketing reference before claiming 100%. Several Vitest specs (BlogListingPage, BookTrial, PodcastStudioRouting) are still red in `docs/tests/2025-11-19-frontend-vitest.txt:20-160`.
| Interactive proof components | Financial storytelling widgets ship in `frontend/src/components/marketing/CashFlowCalculator.tsx:4-170`, `DynamicPricingSimulator.tsx:4-200`, and `InteractiveTimeline.tsx:1-150` with focused tests (`*.test.tsx`). Case studies are typed + rendered via `frontend/src/data/caseStudies.ts:1-120` and `CaseStudy.tsx:9-96`. | The calculators currently render randomised data and lack analytics capture. Case study data covers five accounts; parity requires 38+ blog posts and fresh imagery (`MARKETING_WEBSITE_STATUS.md:91-110`).
| Blog + CMS backing | Frontend listing/search/filter implemented in `frontend/src/pages/marketing/BlogListingPage.tsx:1-220`; backend API provides CRUD + slug safeguards within `backend/app/api/routes/blog.py:1-410` and tests in `backend/tests/api/test_blog_api.py:1-210`. Playwright `tests/blog-smoke.spec.ts:1-16` keeps the route alive. | Only 12/50 posts exist, imagery is missing, and the Vitest suite for BlogListingPage currently hits a real API (500) per `docs/tests/2025-11-19-frontend-vitest.txt:40-80`. Need MSW fixtures + content backlog execution.
| Lead capture + newsletter | Contact form posts to `/api/marketing/contact` through `frontend/src/services/contactService.ts:1-18`, newsletter opt-in posts to `/api/marketing/subscribe` via `frontend/src/services/newsletterService.ts:1-20`, and both endpoints are covered by `backend/tests/api/test_marketing.py:1-90` plus Playwright specs `tests/contact-flow.spec.ts:1-26` and `tests/optin-popup.spec.ts:1-38`. | Notifications/ESP hand-offs remain stubs (`docs/CRITICAL_BUGS_REPORT.md:17-24`). We still need GoHighLevel/chatbot integrations and analytics hooks per `COMPLETION-PLAN-2025-11-17.md:100-110`.
| Automation + smoke evidence | `scripts/run-marketing-playwright.mjs:1-55` builds the frontend then executes `playwright.dev.config.ts:1-45`, producing trace/screenshot artefacts logged in `docs/tests/2025-11-19-playwright.txt:1-70`. | Command is manual; CI wiring, screenshot archival, and Lighthouse/Axe refreshes (older than Nov-13) are still pending (`docs/FINAL-COMPLETION-PLAN.md:60-110`).

## Gap Buckets

### 1. Navigation & Accessibility
- Mobile dropdown focus, animation timing, and touch targets remain unfinished (`MARKETING_WEBSITE_STATUS.md:86-88`). MarketingNav currently handles desktop hover/focus but lacks explicit ARIA state management for the mobile sheet.
- Need to rerun manual keyboard/VO testing once the nav polish ships, then capture evidence under `docs/testing/` per the final plan (`docs/FINAL-COMPLETION-PLAN.md:70-95`).

### 2. Content Throughput & Blog Backlog
- `frontend/src/data/caseStudies.ts:22-110` only lists five customers; MARK-002 requires 38 additional blog posts plus imagery per `MARKETING_WEBSITE_STATUS.md:91-105`.
- BlogListingPage Vitest expectations currently fail because MSW does not stub the `/api/blog` request, leading to 500s (`docs/tests/2025-11-19-frontend-vitest.txt:40-80`). Need local fixtures plus broader marketing content seeding so Playwright/Vitest can assert deterministic cards.

### 3. Forms, Chatbot, and ESP Integrations
- Contact + subscribe endpoints persist payloads but ops still lacks notifications or CRM sync (`docs/CRITICAL_BUGS_REPORT.md:17-24`). The backlog also calls for GoHighLevel chatbot, YouTube embeds, and lead capture wiring (`COMPLETION-PLAN-2025-11-17.md:100-107`).
- Need background tasks + environment docs that describe where submissions go, plus Playwright coverage that hits the real API (with MSW fallbacks) instead of mocked routes.

### 4. SEO, Performance, and Evidence Currency
- Sitemap, robots, OG/Twitter parity, and structured data roll-ups called out in `COMPLETION-PLAN-2025-11-17.md:109-120` do not yet exist in the repo. Canonicals are hard-coded per page, but we have no generated `public/sitemap.xml` nor `public/robots.txt`.
- Lighthouse/Axe artefacts under `docs/marketing/lighthouse-report.html` date back to 2025-11-12; Cloudflare-exempt manual reruns plus remediation tickets are required before final handoff (`docs/FINAL-COMPLETION-PLAN.md:70-110`).

### 5. QA & Automation
- Playwright smoke now runs via `scripts/run-marketing-playwright.mjs`, but there is no CI job uploading traces/screenshots or enforcing MARKETING_BASE_URL per commit (`docs/deployments/2025-11-19-marketing-playwright.txt:1-10`).
- Vitest log shows four RED suites (ProtectedRoute, BlogListingPage, BookTrial contact CTA, PodcastStudioRouting) that must be fixed before claiming 100% (`docs/tests/2025-11-19-frontend-vitest.txt:10-120`). Backend pytest evidence is older than Nov-17; reruns plus log archival are required once marketing work lands.

## Next Steps (Wave 2 Priorities)
1. **Document parity backlog** — Keep this analysis in lockstep with README/FINAL plan by linking it in those artefacts and updating after each marketing change (`docs/FINAL-COMPLETION-PLAN.md:60-90`).
2. **Ship nav + accessibility polish** — Implement mobile dropdown focus + animation states, rerun manual QA, and archive the evidence referenced by `MARKETING_WEBSITE_STATUS.md:84-90`.
3. **Execute content backlog** — Generate the remaining 38 blog posts + imagery, seed them via the Blog API (`backend/app/api/routes/blog.py:250-380`), and refresh BlogListingPage Vitest/MSW fixtures.
4. **Complete integrations** — Wire contact/newsletter submissions to the real ESP/CRM, add GoHighLevel chatbot + newsletter embeds, and document the flows per `COMPLETION-PLAN-2025-11-17.md:100-110`.
5. **SEO + performance** — Add sitemap/robots/OG/Twitter automation, rerun Lighthouse + Axe, and store the Nov-19+ reports under `docs/marketing/`.
6. **Automation hardening** — Move `scripts/run-marketing-playwright.mjs` into CI, publish artifacts, and rerun backend/frontend suites so `docs/tests/` only contains green evidence.
