# Performance & Accessibility Audit Summary - 2025-11-22

**Date**: 2025-11-22  
**Environment**: Preview server (http://127.0.0.1:4173)  
**Status**: Ready for execution

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

## Target Scores

| Category | Target | Previous (2025-11-13) |
|----------|--------|----------------------|
| Performance | ≥90% | TBD |
| Accessibility | ≥95% | TBD |
| Best Practices | ≥90% | TBD |
| SEO | ≥90% | TBD |

---

## Pages to Audit

- `/` (Homepage)
- `/pricing`
- `/blog`
- `/contact`
- `/features`

---

## Findings

(To be filled after audit execution)

---

## Remediation Tickets

(To be created if scores below targets)

---

**Note**: Audits require preview server to be running. Execute when ready.

