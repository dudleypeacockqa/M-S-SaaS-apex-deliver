# Lighthouse & Axe Audit Instructions - 2025-11-22

**Status**: Ready for Execution
**Prerequisites**: Production build and preview server

---

## Lighthouse Audit

### Option 1: Chrome DevTools (Recommended)

1. **Build production bundle**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start preview server**:
   ```bash
   npm run preview
   # Server runs on http://localhost:4173
   ```

3. **Run Lighthouse**:
   - Open Chrome DevTools (F12)
   - Navigate to "Lighthouse" tab
   - Select categories: Performance, Accessibility, Best Practices, SEO
   - Click "Analyze page load"
   - Export as HTML and JSON

4. **Archive reports**:
   - Save HTML: `docs/testing/lighthouse/2025-11-22/lighthouse-report.html`
   - Save JSON: `docs/testing/lighthouse/2025-11-22/lighthouse-report.json`

### Option 2: CLI (Alternative)

```bash
cd frontend
npm run build
npm run preview &
# Wait for server to start
npx lighthouse http://localhost:4173 --output html --output json --output-path docs/testing/lighthouse/2025-11-22/lighthouse-report
```

### Target Scores

- **Performance**: ≥90%
- **Accessibility**: ≥95%
- **Best Practices**: ≥90%
- **SEO**: ≥90%

---

## Axe Accessibility Audit

### Option 1: Axe DevTools Extension

1. Install Axe DevTools browser extension
2. Navigate to preview server: http://localhost:4173
3. Open Axe DevTools panel
4. Click "Scan" button
5. Export results as JSON

### Option 2: CLI

```bash
npx @axe-core/cli http://localhost:4173 --save docs/testing/axe/2025-11-22/axe-report.json
```

### Target

- **Critical violations**: 0
- **Moderate violations**: ≤5

---

## Production Audit (Alternative)

If preview server is not available, audit production directly:

```bash
npx lighthouse https://100daysandbeyond.com --output html --output json --output-path docs/testing/lighthouse/2025-11-22/lighthouse-report-production
```

---

## Summary Document

After running audits, create `docs/testing/lighthouse/2025-11-22/SUMMARY.md` with:

- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Axe violation count and types
- Remediation plan for any issues below targets
- Priority ranking of issues

---

**Note**: Audits require manual execution with browser tools. This document provides instructions for the QA team.

