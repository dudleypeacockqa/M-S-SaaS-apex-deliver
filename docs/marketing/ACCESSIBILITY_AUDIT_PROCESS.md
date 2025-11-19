# Accessibility Audit Process

## Overview

This document describes the automated and manual processes for running accessibility audits on the M&A Intelligence Platform using Lighthouse and axe-core.

**Last Updated**: 2025-11-13
**Owner**: Platform Team
**Automation**: GitHub Actions (`.github/workflows/accessibility-audit.yml`)

---

## Automated Audits (GitHub Actions)

### Trigger Events

The accessibility audit workflow runs automatically on:

1. **Push to `main` branch** - Full production audit after deployment
2. **Pull Requests** - Preview build audit to catch regressions before merge
3. **Weekly Schedule** - Every Monday at 9 AM UTC for continuous monitoring
4. **Manual Trigger** - On-demand via GitHub Actions UI

### What Gets Tested

#### Preview Build Tests
- Local build served on `http://localhost:4173`
- Pages tested:
  - `/` (homepage)
  - `/pricing`
  - `/features`
  - `/about`
  - `/contact`
  - `/blog`

#### Production Tests (main branch only)
- Live production URLs at `https://100daysandbeyond.com`
- Same page set as preview tests
- Includes both Lighthouse and axe-core analysis

### Accessing Results

1. Go to **Actions** tab in GitHub repository
2. Click on **Accessibility Audit** workflow
3. Select the run you want to review
4. Download artifacts:
   - `lighthouse-reports-preview-{run_number}` - Preview build results
   - `lighthouse-reports-production-{run_number}` - Production results

Each artifact contains:
- `SUMMARY.md` - Quick overview of all scores
- `lighthouse-{page}.html` - Interactive Lighthouse reports
- `lighthouse-{page}.json` - Raw data for programmatic analysis
- `axe-{page}.json` - axe-core accessibility violation details

---

## Manual Audits (Local Development)

### Prerequisites

```bash
# Install dependencies (already in package.json)
cd frontend
npm install
```

Dependencies installed:
- `lighthouse@11.7.0`
- `@axe-core/cli@4.11.0`

### Running Local Audits

#### Step 1: Build and Start Preview Server

```bash
# Terminal 1: Build and serve the app
cd frontend
npm run build
npm run preview:test
```

This starts the preview server on `http://localhost:4173`

#### Step 2: Run Audits

```bash
# Terminal 2: Run all audits
cd frontend

# Option A: Run both Lighthouse and axe
npm run audit:local

# Option B: Run individually
npm run lighthouse:local
npm run axe:local
```

#### Step 3: View Results

Reports are saved to:
- `frontend/docs/testing/lighthouse-report.html` - Interactive Lighthouse report
- `frontend/docs/testing/lighthouse-report.json` - JSON data
- `frontend/docs/testing/axe-report.json` - axe violations

Open the HTML report in your browser:
```bash
start frontend/docs/testing/lighthouse-report.html  # Windows
open frontend/docs/testing/lighthouse-report.html   # macOS
xdg-open frontend/docs/testing/lighthouse-report.html # Linux
```

### Evidence Capture Template (2025-11-19+)

To keep Decide artefacts synchronized with README/FINAL-COMPLETION-PLAN, run the helper script whenever you need to archive a manual audit:

```bash
# From repo root
node scripts/run-lighthouse-axe.mjs

# Optional: override defaults
LIGHTHOUSE_AUDIT_URL=https://100daysandbeyond.com/ \
LIGHTHOUSE_AUDIT_LABEL=prod \
AUDIT_OUTPUT_DIR=docs/testing/lighthouse/2025-11-19-prod \
node scripts/run-lighthouse-axe.mjs
```

- The script expects a running site at `LIGHTHOUSE_AUDIT_URL` (start `npm run preview:test` locally or tunnel to production).
- Outputs live under `docs/testing/lighthouse/<date>/` by default, alongside a `metadata.json` file that records the URL, label, and timestamp. Reference these files directly from README/BMAD once you finish the run.
- Because reports live in `docs/testing`, they version cleanly with the rest of the evidence—no more overwriting `frontend/docs/testing/lighthouse-report.html` each time.

> Heads up: the helper does not start a preview server for you. Pair it with a terminal running `npm run preview:test` (local) or set `LIGHTHOUSE_AUDIT_URL` to the deployed marketing host.

---

## Running Production Audits Manually

### Using the Bash Script (Linux/macOS/WSL)

```bash
# From project root
chmod +x scripts/run_lighthouse_audits.sh
bash scripts/run_lighthouse_audits.sh
```

This will:
1. Create report directory: `docs/marketing/lighthouse-reports-{date}/`
2. Run Lighthouse on all production pages
3. Generate JSON and HTML reports
4. Print summary of scores

### Using Docker (Cross-Platform Alternative)

If you encounter Windows sandbox issues, use Docker:

```dockerfile
# Create Dockerfile.lighthouse
FROM node:18-slim

RUN apt-get update && apt-get install -y \
    chromium \
    jq \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH=/usr/bin/chromium
ENV LIGHTHOUSE_CHROMIUM_PATH=/usr/bin/chromium

RUN npm install -g lighthouse @axe-core/cli

WORKDIR /reports

ENTRYPOINT ["lighthouse"]
```

```bash
# Build Docker image
docker build -f Dockerfile.lighthouse -t lighthouse-runner .

# Run audit
docker run --rm -v "$(pwd)/docs/marketing:/reports" lighthouse-runner \
  https://100daysandbeyond.com \
  --output=html \
  --output=json \
  --output-path=/reports/lighthouse-production \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"
```

---

## Interpreting Results

### Lighthouse Scores

Scores are from 0-100. Our minimum acceptable thresholds:

| Category | Minimum | Target | Description |
|----------|---------|--------|-------------|
| **Accessibility** | 90 | 95+ | WCAG compliance, ARIA, contrast ratios |
| **Performance** | 80 | 90+ | Load time, FCP, LCP, CLS metrics |
| **Best Practices** | 85 | 95+ | HTTPS, console errors, deprecated APIs |
| **SEO** | 85 | 95+ | Meta tags, mobile-friendly, crawlability |

### Common Accessibility Issues

#### Critical (Must Fix Immediately)
- Missing alt text on images
- Insufficient color contrast (< 4.5:1 ratio)
- Missing form labels
- Missing ARIA landmarks (`<main>`, `<nav>`, `<header>`)
- Keyboard navigation broken

#### Important (Fix Within Sprint)
- Missing skip links
- Improper heading hierarchy
- Non-descriptive link text ("click here")
- Missing language attribute on `<html>`

#### Minor (Fix When Possible)
- Missing ARIA descriptions
- Non-optimal focus indicators
- Redundant ARIA attributes

### axe-core Violation Levels

- **Critical** - Major barriers for assistive technology users
- **Serious** - Significant issues affecting accessibility
- **Moderate** - Noticeable issues that should be addressed
- **Minor** - Small improvements to enhance accessibility

---

## Troubleshooting

### Issue: "NO_FCP" Error (No First Contentful Paint)

**Symptom**: Lighthouse fails with "NO_FCP" on Windows

**Cause**: Windows Defender or antivirus blocking Chrome sandbox

**Solution**:
1. Use GitHub Actions (runs on Linux) ✅ **RECOMMENDED**
2. Use WSL2 for local testing
3. Use Docker container (see above)
4. Temporarily disable antivirus (not recommended)

### Issue: "ERR_ADDRESS_INVALID"

**Symptom**: axe/Lighthouse can't connect to localhost

**Cause**: Server not running or port blocked

**Solution**:
1. Verify preview server is running: `curl http://localhost:4173`
2. Check firewall settings
3. Use `127.0.0.1` instead of `localhost`
4. Run with `--strictPort` flag: `npm run preview:test`

### Issue: Tests Pass Locally but Fail in CI

**Symptom**: Different results between local and GitHub Actions

**Cause**: Environment differences (timing, resources, network)

**Solution**:
1. Trust CI results as source of truth
2. Increase `--load-delay` in axe command
3. Add `--wait-for-metrics` in Lighthouse
4. Check for race conditions in React hydration

### Issue: Missing Environment Variables

**Symptom**: Build fails with "VITE_CLERK_PUBLISHABLE_KEY is not defined"

**Solution**:
Add secrets to GitHub repository:
1. Go to **Settings → Secrets and variables → Actions**
2. Add secrets:
   - `VITE_CLERK_PUBLISHABLE_KEY` (from .env)
   - `VITE_API_URL` (https://ma-saas-backend.onrender.com)

---

## Acceptance Criteria

### For Feature Completion

Before marking an accessibility story as **DONE**:

✅ All automated audit jobs pass in GitHub Actions
✅ Lighthouse Accessibility score ≥ 90 for all tested pages
✅ Zero critical or serious axe violations
✅ Manual keyboard navigation tested and documented
✅ Screen reader testing completed (NVDA/JAWS/VoiceOver)
✅ Color contrast verified with tools (https://webaim.org/resources/contrastchecker/)
✅ Responsive design tested on mobile devices
✅ Reports uploaded to `docs/marketing/lighthouse-reports-{date}/`

### For Production Deployment

✅ Latest main branch audit shows all scores above minimum thresholds
✅ No regressions compared to previous release
✅ All critical and serious violations fixed
✅ Documentation updated if new accessibility patterns introduced

---

## Manual Testing Checklist

In addition to automated audits, perform these manual tests:

### Keyboard Navigation
- [ ] Tab through all interactive elements in logical order
- [ ] Activate buttons/links with Enter/Space
- [ ] Escape closes modals/dropdowns
- [ ] Focus visible at all times
- [ ] No keyboard traps

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] All content announced correctly
- [ ] ARIA landmarks recognized
- [ ] Forms have proper labels

### Visual Testing
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] UI usable at 200% zoom
- [ ] Works in high contrast mode
- [ ] Focus indicators visible
- [ ] No color-only information

### Mobile Accessibility
- [ ] Touch targets ≥ 44x44px
- [ ] Text resizable without horizontal scroll
- [ ] Screen reader (TalkBack/VoiceOver) functional
- [ ] Orientation changes don't lose content

---

## Continuous Improvement

### Weekly Review Process

Every Monday (automated run):
1. Review Lighthouse scores trend
2. Check for new violations
3. Prioritize fixes in sprint planning
4. Update this document with new patterns

### Quarterly Audit

Every 3 months:
1. Full manual audit by accessibility expert
2. User testing with assistive technology users
3. Update acceptance criteria based on findings
4. Training for team on new WCAG guidelines

---

## Resources

### Tools
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

### Guidelines
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

### Testing
- **NVDA Screen Reader**: https://www.nvaccess.org/download/
- **Keyboard Navigation**: https://webaim.org/articles/keyboard/
- **Screen Reader Guide**: https://webaim.org/articles/screenreader_testing/

---

## Contact

For questions or issues with accessibility audits:
- **Platform Team**: #platform-engineering (Slack)
- **Accessibility Lead**: [To be assigned]
- **BMAD Workflow**: `/bmad:bmm:workflows:workflow-status` (check current sprint priorities)

---

**Document Version**: 1.0
**Last Audit**: 2025-11-13
**Next Review**: 2025-11-20
