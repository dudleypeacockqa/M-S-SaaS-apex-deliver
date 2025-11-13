# Marketing Audit Evidence - 2025-11-13

**Date**: 2025-11-13  
**Task**: Phase 0 T3 - Lighthouse/Axe CI Evidence  
**Status**: 🚧 IN PROGRESS – Axe rerun completed 2025-11-13T11:30Z (0 violations); Lighthouse reruns still blocked (Windows EPERM + Linux Chromium ECONNREFUSED). Need CI/mac execution per plan.

## Evidence Summary

### Accessibility Audit ✅ (Refreshed 2025-11-13T11:30Z)
- **Tool**: Axe Core 4.11.0
- **Report**: `docs/marketing/2025-11-13-audits/axe-report.json`
- **CLI Log**: `docs/marketing/2025-11-13-audits/axe-run.log`
- **Result**: **0 violations found**
- **Compliance**: WCAG 2A/2AA compliant
- **Test URL**: http://localhost:4173/
- **Notes**: Run via Windows headless Chrome with `npx axe`; matches prior evidence in `docs/testing/axe-report.json`

- **CI Attempt (GitHub Actions Run #32, 2025-11-13T15:07Z)**
  - **Command**: `gh workflow run accessibility-audit.yml -r main`
  - **Production job**: ✅ `Lighthouse - Production URLs` succeeded. Reports + summary downloaded to `docs/marketing/lighthouse-reports-2025-11-13/` (see table below).
  - **Preview job**: ❌ `Lighthouse - Preview Build` failed during `npm run build` because the workflow still installs Node 18.20.8 while Vite 7.2.2 + plugin-react 5.1.1 require Node ≥20.19.0; build crashed with `crypto.hash is not a function`. Logs: `docs/marketing/2025-11-13-audits/lighthouse-preview-gh-run.log`.
- **Tools**: Lighthouse 12.8.2 CLI, Chromium (snap) on WSL + GitHub Actions Ubuntu runners
- **Attempt 1 (Windows)**: `npx lighthouse http://localhost:4173 --output html,json`
  - **Log**: `docs/marketing/2025-11-13-audits/lighthouse-run.log`
  - **Failure**: `EPERM, Permission denied` when Chrome launcher deletes `%TEMP%\lighthouse.*` (Windows sandbox limitation)
- **Attempt 2 (Linux / WSL CLI)**: `env PATH="/usr/bin:/usr/local/bin" lighthouse https://ma-saas-platform.onrender.com --chrome-path=/usr/bin/chromium-browser --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"`
  - **Log**: `docs/marketing/2025-11-13-audits/lighthouse-run-linux.log`
  - **Failure**: Chromium launches but DevTools socket immediately refuses connections (`connect ECONNREFUSED 127.0.0.1:<port>`). Likely due to snap sandbox + WSL networking; needs a native Linux/mac host or CI runner.
- **Attempt 3 (Linux / local audit script 2025-11-13T14:05Z)**: `PATH="/usr/bin:/usr/local/bin" ./scripts/run_local_audits.sh`
  - **Log**: `docs/marketing/2025-11-13-audits/run_local_audits-2025-11-13T1406Z.log`
  - **Failure**: Preview server started successfully on WSL, but Lighthouse still cannot connect to the headless Chromium instance started by the script (`Unable to connect to Chrome`).
- **Next Actions**:
  1. Update `.github/workflows/accessibility-audit.yml` to use Node 20 for the preview job so CI can build and run Lighthouse end-to-end.
  2. Keep using the GitHub Actions workflow for production metrics (already succeeding) and archive reports under `docs/marketing/lighthouse-reports-YYYY-MM-DD/`.

### Quality Thresholds
- **Performance**: ≥90% (target: ≥95%)
- **Accessibility**: ≥95% (target: 100%)
- **Best Practices**: ≥90% (target: ≥95%)
- **SEO**: ≥90% (target: ≥95%)

## Files

- `AUDIT-STATUS-2025-11-14.md` - Current audit status and infrastructure verification
- `docs/marketing/2025-11-13-audits/axe-report.json` - Latest Axe rerun evidence (0 violations)
- `docs/marketing/2025-11-13-audits/axe-run.log` - CLI log for Axe rerun
- `docs/marketing/2025-11-13-audits/lighthouse-run.log` - Windows EPERM failure log for Lighthouse rerun
- `docs/marketing/2025-11-13-audits/lighthouse-run-linux.log` - Linux Node 20 + Chromium ECONNREFUSED log
- `docs/testing/axe-report.json` - Prior Axe evidence (still valid)
- `docs/testing/TEST-RUN-SUMMARY-2025-11-13.md` - Complete test run summary
- `scripts/run_local_audits.sh` - Automated audit script (macOS/Linux)
- `.lighthouserc.js` - Lighthouse CI configuration

## Next Steps

1. ✅ Infrastructure verified and documented
2. ✅ Axe rerun completed with 0 violations (see `axe-report.json`)
3. 🚧 Linux Lighthouse attempt (Node 20 + Chromium) still failing (DevTools ECONNREFUSED). Need macOS/CI rerun or Linux VM outside WSL.
4. ⏳ Production audits will run automatically on next push to `main` via GitHub Actions
5. ⏳ Reports will be archived in `docs/marketing/lighthouse-reports-YYYY-MM-DD/`
6. ✅ MARK-002 story updated with evidence links

## Execution

To run audits locally (macOS/Linux):
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh
```

To trigger CI audit:
- Push to `main` branch (automatic)
- Create pull request (automatic)
- Manual trigger via GitHub Actions UI (workflow_dispatch)

---

**Generated**: 2025-11-14  
**Methodology**: BMAD v6-alpha + TDD
