# 2025-11-14 Lighthouse/Axe Summary

## Context
- Preview served via PowerShell npx serve dist --listen 127.0.0.1:4173 --single immediately after npm run build.
- Audits executed with the Windows automation script (scripts/run_local_audits.ps1) using headless Chrome flags.
- VITE_CLERK_PUBLISHABLE_KEY was loaded from .env before the run.

## Results (2025-11-14T13:40Z)
- **Lighthouse** (docs/marketing/2025-11-14-audits/lighthouse-report-2025-11-14T1340Z.{html,json})
  - Performance: **63%**
  - Accessibility: **94%**
  - Best Practices: **74%**
  - SEO: **97%**
- **Axe** (docs/marketing/2025-11-14-audits/axe-report-2025-11-14T1340Z.json)
  - Critical: 0
  - Serious: 1 (color contrast)
  - Moderate: 3 (heading order + landmark issues)
  - Minor: 0
- Raw console log: docs/marketing/2025-11-14-audits/audit-run.log

## Follow-ups
1. Improve Lighthouse performance/best-practices scores (≥90%) by addressing the flagged bundle size + best-practice warnings.
2. Fix the Axe violations (color contrast + heading/landmark order) and re-run the audits to confirm clean results.
3. Update MARK-002 and CLAUDE once the follow-up run is captured.
