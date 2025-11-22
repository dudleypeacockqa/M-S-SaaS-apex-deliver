# Lighthouse + Axe Audit Execution Guide - 2025-11-22

**Date**: 2025-11-22  
**Script**: `scripts/run-lighthouse-axe.mjs`  
**Status**: Ready for execution

---

## Prerequisites

1. **Preview Server Running** (for local audits):
   ```bash
   cd frontend
   npm run preview:test
   # Server should be running on http://127.0.0.1:4173
   ```

2. **Production URL** (if Cloudflare allows):
   - `https://financeflo.ai` (primary)
   - `https://www.financeflo.ai` (redirect)

---

## Execution Steps

### Option 1: Local Preview Audit

```bash
AUDIT_OUTPUT_DIR="docs/testing/lighthouse/2025-11-22" \
LIGHTHOUSE_AUDIT_URL="http://127.0.0.1:4173/" \
LIGHTHOUSE_AUDIT_LABEL="local-preview-2025-11-22" \
node scripts/run-lighthouse-axe.mjs
```

### Option 2: Production Audit (if accessible)

```bash
AUDIT_OUTPUT_DIR="docs/testing/lighthouse/2025-11-22" \
LIGHTHOUSE_AUDIT_URL="https://financeflo.ai" \
LIGHTHOUSE_AUDIT_LABEL="production-2025-11-22" \
node scripts/run-lighthouse-axe.mjs
```

---

## Expected Outputs

After execution, the following files should be created:

```
docs/testing/lighthouse/2025-11-22/
├── lighthouse-<label>.html          # HTML report (human-readable)
├── lighthouse-<label>.json          # JSON report (machine-readable)
├── axe-<label>.json                  # Axe accessibility violations
└── metadata.json                     # Execution metadata (URL, timestamp, label)
```

---

## Target Scores

| Category | Minimum Score | Target Score |
|----------|--------------|--------------|
| Performance | 90% | 95%+ |
| Accessibility | 95% | 100% |
| Best Practices | 90% | 95%+ |
| SEO | 90% | 95%+ |

---

## Axe Violations

- **Target**: 0 critical violations
- **Acceptable**: ≤5 moderate violations
- **Action Required**: File remediation tickets for any violations

---

## Troubleshooting

**Issue**: Cloudflare blocks production URL
- **Solution**: Use local preview server or allowlist IP in Cloudflare

**Issue**: Script times out
- **Solution**: Increase timeout in script or check network connectivity

**Issue**: Axe violations not detected
- **Solution**: Verify page is fully loaded before audit runs

---

## Next Steps After Execution

1. Review HTML reports for performance bottlenecks
2. Check Axe JSON for accessibility violations
3. File remediation tickets for any issues found
4. Archive reports in `docs/testing/lighthouse/2025-11-22/`
5. Update README/TODO/BMAD with audit results

---

**Generated**: 2025-11-22  
**Status**: Ready for execution

