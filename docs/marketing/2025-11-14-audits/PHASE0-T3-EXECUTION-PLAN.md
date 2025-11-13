# Phase 0 Task T3 - Lighthouse/Axe Execution Plan (2025-11-14)

**Owner**: Codex (autonomous)  
**Objective**: Capture reproducible Lighthouse + Axe evidence for Phase 0 Task T3 so accessibility/performance artefacts are ready for MARK-002 and CLAUDE.md.

## Environment Prep
- Run on Linux or macOS shell (Windows sandbox repeatedly hits Chromium `NO_FCP` + tee issues).
- Required env vars: `VITE_CLERK_PUBLISHABLE_KEY` (use staging key from `.env`), `REACT_APP_API_BASE_URL` defaults fine.
- Ensure `frontend/node_modules` installed (`npm install`) and `lighthouse`, `@axe-core/cli` available (devDependencies already pinned).

## Command Sequence
1. `cd C:/Projects/ma-saas-platform/M-S-SaaS-apex-deliver`
2. `VITE_CLERK_PUBLISHABLE_KEY=$PK ./scripts/run_local_audits.sh`
   - Script handles build + `npm run preview:test` startup, waits for port 4173.
   - Generates reports under `docs/testing/` by default.
3. Copy artefacts into this folder:
   - `cp docs/testing/lighthouse-report.html docs/marketing/2025-11-14-audits/lighthouse-report.html`
   - `cp docs/testing/lighthouse-report.json docs/marketing/2025-11-14-audits/lighthouse-report.json`
   - `cp docs/testing/axe-report.json docs/marketing/2025-11-14-audits/axe-report.json`
4. Summarize key scores + violation counts in `docs/marketing/2025-11-14-audits/SUMMARY.md` (template below).

## Output Template (`SUMMARY.md`)
```
# 2025-11-14 Lighthouse/Axe Summary
- Performance: xx%
- Accessibility: xx%
- Best Practices: xx%
- SEO: xx%
- Axe Critical/Serious/Moderate/Minor: 0/0/0/0
- Notes: e.g., MSW warning noise only
- Linked issues: MARK-002, CLAUDE.md audit table
```

## Follow-ups
- Update `docs/bmad/BMAD_PROGRESS_TRACKER.md` + `docs/bmad/bmm-workflow-status.md` referencing the artefacts.
- Drop screenshots or CLI snippets into MARK-002 + CLAUDE.md per governance.
- If Lighthouse throws `NO_FCP`, rerun via GitHub Codespaces or WSL2 Ubuntu image where headless Chrome is more stable.

_Logged 2025-11-14T12:27Z_
