# Performance & Accessibility Audit Summary - 2025-11-22

**Date**: 2025-11-22 (executed 2025-11-24 local preview)  
**Environment**: Preview server (http://127.0.0.1:4173)  
**Status**: ✅ Completed – reports archived under `docs/testing/lighthouse/2025-11-24/`

---

## Prerequisites

1. **Start Preview Server**:
   ```bash
   cd frontend
   VITE_CLERK_PUBLISHABLE_KEY=<key> npm run preview:test
   ```

2. **Run Lighthouse Desktop**:
   ```bash
   npx lighthouse http://127.0.0.1:4173/ --preset=desktop --output=html --output=json --output-path=docs/testing/lighthouse/2025-11-22/lighthouse-desktop.html
   ```

3. **Run Lighthouse Mobile**:
   ```bash
   npx lighthouse http://127.0.0.1:4173/ --preset=mobile --output=html --output=json --output-path=docs/testing/lighthouse/2025-11-22/lighthouse-mobile.html
   ```

4. **Run Axe Audit**:
   ```bash
   cd frontend
   npm run axe:local
   # Or manually: axe http://127.0.0.1:4173/ --load-delay 5000 --timeout 60000 --save docs/testing/lighthouse/2025-11-22/axe-report.json
   ```

---

## Target Scores vs Results

| Surface | Category | Target | Score | Status |
|---------|----------|--------|-------|--------|
| **Desktop** | Performance | ≥90% | **99%** | ✅ |
| | Accessibility | ≥95% | **97%** | ✅ |
| | Best Practices | ≥90% | **100%** | ✅ |
| | SEO | ≥90% | **100%** | ✅ |
| **Mobile** | Performance | ≥90% | **86%** | ⚠️ Needs tuning |
| | Accessibility | ≥95% | **96%** | ✅ |
| | Best Practices | ≥90% | **100%** | ✅ |
| | SEO | ≥90% | **100%** | ✅ |

**Previous baseline (2025-11-13)**: Desktop 92/96/100/100, Mobile 78/94/100/100.

---

## Pages to Audit

- `/` (Homepage)
- `/pricing`
- `/blog`
- `/contact`
- `/features`

---

## Findings

1. **Desktop Lighthouse** – All four categories exceeded targets. Artifacts:
   - `docs/testing/lighthouse/2025-11-24/lighthouse-desktop.report.html`
   - `docs/testing/lighthouse/2025-11-24/lighthouse-desktop.report.json`
2. **Mobile Lighthouse** – Accessibility, Best Practices, SEO met targets, but Performance scored 86% because of large hero media and animation cost on slower devices. Artifacts:
   - `docs/testing/lighthouse/2025-11-24/lighthouse-mobile.report.html`
   - `docs/testing/lighthouse/2025-11-24/lighthouse-mobile.report.json`
3. **Axe Accessibility Sweep** – `docs/testing/lighthouse/2025-11-24/axe-local-preview.json` reported **0 violations** across the audited surfaces.

---

## Remediation Tickets

- **Wave 4 – Mobile Performance Hardening** *(open)*  
  - Scope: defer non-critical hero animations, lazy-load testimonial carousel, and preconnect to `cdn.clerk.com` before hydration.  
  - Owner: Marketing FE team.  
  - Exit criteria: Lighthouse Mobile Performance ≥ 90 with same preview server.

---

**Next Actions**:
1. Implement mobile performance trims outlined above (target Wave 3.1 follow-up).
2. Re-run Lighthouse Mobile after trims and attach refreshed reports.
3. Keep `audit-summary.md` in sync when new runs occur.

