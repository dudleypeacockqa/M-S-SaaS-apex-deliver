# Audit Status Update - 2025-11-14

**Date**: 2025-11-14  
**Task**: Phase 0 T3 - Lighthouse/Axe CI Evidence  
**Status**: 🚧 IN PROGRESS – Axe rerun complete (0 violations); Lighthouse reruns blocked on Windows EPERM and Linux Chromium ECONNREFUSED despite Node 20 install. Needs CI/mac execution for Phase 0 T3 sign-off.

## Current Status

- **GitHub Actions Workflow**: `.github/workflows/accessibility-audit.yml` - Configured and ready
- **Local Audit Script**: `scripts/run_local_audits.sh` - Available for macOS/Linux
- **Lighthouse Config**: `.lighthouserc.js` - Configured with quality thresholds
- **Audit Directory**: `docs/marketing/2025-11-13-audits/` - Ready for evidence

### Evidence / Attempts
- **Axe Report (refreshed)**: `docs/marketing/2025-11-13-audits/axe-report.json` + `axe-run.log` – 0 violations @ 2025-11-13T11:30Z
- **GitHub Actions Run #32 (2025-11-13T15:07Z)**:
  - **Production job** (`Lighthouse - Production URLs`) ✅ – reports + summary downloaded to `docs/marketing/lighthouse-reports-2025-11-13/`; see `SUMMARY.md` for Lighthouse scores (Home 43/95/75/100, Pricing 67/98/75/100, etc.) and `lighthouse-production-gh-run.log` for full output.
  - **Preview job** (`Lighthouse - Preview Build`) ❌ – failed during `npm run build` because workflow still installs Node 18.20.8; Vite 7.2.2 requires Node ≥20.19, and build crashed with `crypto.hash is not a function` (log: `docs/marketing/2025-11-13-audits/lighthouse-preview-gh-run.log`).
- **Local CLI Attempts** (Windows + Linux) remain blocked (logs: `lighthouse-run.log`, `lighthouse-run-linux.log`, `run_local_audits-2025-11-13T1406Z.log`).
- **Documentation**: `docs/marketing/2025-11-13-audits/README.md` – updated with blockers + next actions

### GitHub Actions Workflow
The workflow is configured to:
- Run automatically on push to `main` branch
- Run on pull requests
- Run weekly (Mondays 9 AM UTC)
- Can be triggered manually via `workflow_dispatch`
- Executes on Ubuntu Linux (avoids Windows Chrome sandbox issues)

### Quality Thresholds
- **Performance**: ≥90%
- **Accessibility**: ≥95% (WCAG 2A/2AA compliant)
- **Best Practices**: ≥90%
- **SEO**: ≥90%

## Next Steps

1. ✅ Infrastructure verified and documented
2. 🚧 Update GitHub Actions preview job to use Node 20+ (matches Vite requirement) so Lighthouse can run end-to-end. Until then, use macOS/Linux hardware or CI overrides to capture preview evidence.
3. ✅ Production audits now captured via GH Actions run #32 (`docs/marketing/lighthouse-reports-2025-11-13/`).
4. ⏳ Reports will be archived in `docs/marketing/lighthouse-reports-YYYY-MM-DD/`
5. ✅ MARK-002 story updated with evidence links

## Evidence Links

- **Workflow**: `.github/workflows/accessibility-audit.yml`
- **Local Script**: `scripts/run_local_audits.sh`
- **Lighthouse Config**: `.lighthouserc.js`
- **Audit Directory**: `docs/marketing/2025-11-13-audits/`
- **Story**: `docs/bmad/stories/MARK-002-enhanced-website-completion.md`

---
Generated: 2025-11-14
Methodology: TDD - RED (verified infrastructure) → GREEN (documented status) → REFACTOR (updated story)

