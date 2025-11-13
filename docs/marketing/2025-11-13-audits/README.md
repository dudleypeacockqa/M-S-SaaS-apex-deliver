# Marketing Audit Evidence - 2025-11-13

**Date**: 2025-11-13  
**Task**: Phase 0 T3 - Lighthouse/Axe CI Evidence  
**Status**: 🚧 IN PROGRESS – Axe rerun completed 2025-11-13T11:30Z (0 violations); Lighthouse rerun blocked on Windows (Chrome temp EPERM). Pending Linux/macOS rerun per completion plan.

## Evidence Summary

### Accessibility Audit ✅ (Refreshed 2025-11-13T11:30Z)
- **Tool**: Axe Core 4.11.0
- **Report**: `docs/marketing/2025-11-13-audits/axe-report.json`
- **CLI Log**: `docs/marketing/2025-11-13-audits/axe-run.log`
- **Result**: **0 violations found**
- **Compliance**: WCAG 2A/2AA compliant
- **Test URL**: http://localhost:4173/
- **Notes**: Run via Windows headless Chrome with `npx axe`; matches prior evidence in `docs/testing/axe-report.json`

### Performance Audit ⚠️ BLOCKED (Windows EPERM)
- **Tool**: Lighthouse 11.7.0
- **Attempt**: `npx lighthouse http://localhost:4173 --output html,json`
- **Log**: `docs/marketing/2025-11-13-audits/lighthouse-run.log`
- **Failure**: `EPERM, Permission denied` when Chrome launcher cleans Windows temp profile (`tmp/lighthouse.*`). Known Windows limitation previously documented.
- **Next Action**: Re-run on Linux/macOS runner (CI workflow `.github/workflows/accessibility-audit.yml`) or adjust script to run entirely inside WSL with Chromium so `curl`/Chrome share the same network namespace.

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
- `docs/testing/axe-report.json` - Prior Axe evidence (still valid)
- `docs/testing/TEST-RUN-SUMMARY-2025-11-13.md` - Complete test run summary
- `scripts/run_local_audits.sh` - Automated audit script (macOS/Linux)
- `.lighthouserc.js` - Lighthouse CI configuration

## Next Steps

1. ✅ Infrastructure verified and documented
2. ✅ Axe rerun completed with 0 violations (see `axe-report.json`)
3. ⏳ Execute Lighthouse rerun on Linux/macOS (blocked on Windows) and archive output under `docs/marketing/2025-11-13-audits/`
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
