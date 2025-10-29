# Load & Performance Testing Plan

_Last updated: 2025-10-28_

## Overview

Objective is to achieve ≥90 Lighthouse scores across Performance, Accessibility, Best Practices, and SEO once the marketing build compiles. Current blockers: `npm run build` fails due to legacy TypeScript errors in podcast/deal-matching modules.

## Tooling

- **Lighthouse** (CLI via `npx lighthouse`) for lab audits.
- **Chrome DevTools** network throttling (Slow 3G) for render path validation.
- **WebPageTest** (optional) for external confirmation.

## Execution Steps

1. Resolve the outstanding TypeScript errors so `npm run build` completes.
2. Run `npm run preview` and keep the server running on `http://localhost:4173`.
3. Desktop audit:
   ```bash
   npx lighthouse http://localhost:4173 --preset=desktop --output=json --output-path=docs/marketing/lighthouse-desktop.json
   ```
4. Mobile audit:
   ```bash
   npx lighthouse http://localhost:4173 --preset=mobile --output=json --output-path=docs/marketing/lighthouse-mobile.json
   ```
5. Open Chrome DevTools → Network → set to **Slow 3G** and reload `/` and `/pricing`; capture First Contentful Paint, Time to Interactive, and Largest Contentful Paint values.
6. Inspect the Coverage tab to evaluate unused CSS/JS and adjust critical rendering path if necessary (e.g., defer non-critical scripts, optimise hero imagery).

## Metrics to Capture

| Metric | Target | Status |
| --- | --- | --- |
| Lighthouse Performance | ≥90 | Blocked (build failing) |
| Lighthouse Accessibility | ≥90 | Blocked |
| Lighthouse Best Practices | ≥90 | Blocked |
| Lighthouse SEO | ≥90 | Blocked |
| First Contentful Paint | ≤2.0s on Slow 3G | Pending |
| Largest Contentful Paint | ≤2.5s on Slow 3G | Pending |

## Optimisation Checklist

- Ensure hero/background assets use WebP/SVG (completed).
- Confirm code splitting covers marketing routes (completed via `React.lazy`).
- Evaluate `preload` for critical fonts/assets once metrics collected.
- Consider inlining critical CSS if FCP/LCP exceed thresholds.

Document the captured metrics in this file after execution and update any follow-up actions.
