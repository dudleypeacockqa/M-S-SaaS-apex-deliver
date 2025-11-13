# 2025-11-14 Lighthouse/Axe Summary

## Context
- Preview served via `npx http-server dist -p 4173 -a 127.0.0.1` (Windows PowerShell) after `npm run build`.
- Lighthouse executed with Chrome headless flags. Run completed but reported `NO_FCP` (no first contentful paint) even though the page loaded; scores defaulted to 0. Issue stems from SPA requiring API data while preview serves static shell.
- Axe CLI executed successfully (0 violations).

## Results
- Lighthouse report: `docs/marketing/2025-11-14-audits/lighthouse-report.{html,json}` (NO_FCP warning, scores 0/0/0/0/0).
- Axe report: `docs/marketing/2025-11-14-audits/axe-report.json` (0 critical/serious/moderate/minor violations).
- CLI logs: `docs/marketing/2025-11-14-audits/axe-run.log`, `docs/marketing/2025-11-14-audits/run_local_audits.log`.

## Follow-ups
1. Re-run Lighthouse from a Linux/mac environment (or point preview to a prerendered marketing build) to avoid the NO_FCP condition.
2. Once a successful Lighthouse run is captured, update MARK-002 + CLAUDE audit tables with the new artefacts.
