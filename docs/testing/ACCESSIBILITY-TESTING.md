# Accessibility & Performance Testing Guide

**Last Updated**: November 13, 2025
**Platform**: M&A Intelligence Platform
**Testing Tools**: Lighthouse 11.7, Axe Core 4.11

---

## Overview

This guide covers how to run accessibility and performance audits for the M&A Platform using industry-standard tools: **Google Lighthouse** and **Axe accessibility scanner**.

### Why We Test

- **Accessibility**: Ensure WCAG 2.1 AA compliance for all users
- **Performance**: Meet Core Web Vitals standards for excellent UX
- **SEO**: Optimize for search engine visibility
- **Best Practices**: Follow modern web development standards

### Quality Gates

Our platform maintains these minimum scores:

| Category | Minimum Score | Target Score |
|----------|--------------|--------------|
| Performance | 90% | 95%+ |
| Accessibility | 95% | 100% |
| Best Practices | 90% | 95%+ |
| SEO | 90% | 95%+ |

---

## Quick Start

### Method 1: Automated Script (Recommended)

The easiest way to run all audits:

```bash
# From project root
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh
```

This script will:
1. Build the frontend
2. Start preview server
3. Run Lighthouse audit
4. Run Axe accessibility scan
5. Generate summary reports
6. Clean up automatically

**Reports will be saved to**: `docs/testing/`

### Method 2: Manual Steps

If you prefer manual control:

#### Terminal 1: Start Preview Server
```bash
cd frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx npm run preview:test
```

#### Terminal 2: Run Audits
```bash
cd frontend

# Run Lighthouse
npm run lighthouse:local

# Run Axe
npm run axe:local

# Or run both
npm run audit:local
```

---

## Understanding Lighthouse Reports

### Opening the Report

```bash
# Open in default browser (Windows)
start docs/testing/lighthouse-report.html

# macOS
open docs/testing/lighthouse-report.html

# Linux
xdg-open docs/testing/lighthouse-report.html
```

### Key Metrics Explained

#### 1. Performance Metrics

**First Contentful Paint (FCP)**
- **Target**: < 1.8s
- **Description**: Time until first text/image appears
- **Impact**: User perception of loading speed

**Largest Contentful Paint (LCP)**
- **Target**: < 2.5s
- **Description**: Time until largest content element renders
- **Impact**: Core Web Vital - affects SEO ranking

**Total Blocking Time (TBT)**
- **Target**: < 200ms
- **Description**: Time main thread is blocked from responding
- **Impact**: Interactivity and responsiveness

**Cumulative Layout Shift (CLS)**
- **Target**: < 0.1
- **Description**: Visual stability - how much layout shifts
- **Impact**: Core Web Vital - user frustration metric

**Speed Index**
- **Target**: < 3.4s
- **Description**: How quickly content is visually displayed
- **Impact**: Perceived loading performance

#### 2. Accessibility Audits

Lighthouse checks for:
- **Color Contrast**: Text readable against backgrounds (4.5:1 ratio minimum)
- **Alt Text**: All images have descriptive alt attributes
- **Form Labels**: All inputs properly labeled
- **ARIA Attributes**: Proper use of ARIA for screen readers
- **Keyboard Navigation**: All interactive elements keyboard-accessible
- **Focus Indicators**: Visible focus states for keyboard users
- **Semantic HTML**: Proper heading hierarchy and landmarks

#### 3. Best Practices

- No browser errors in console
- No vulnerable JavaScript libraries
- HTTPS usage (disabled for local testing)
- Proper image aspect ratios
- No geolocation/notification prompts on load

#### 4. SEO Audits

- Document has meta description
- Page has valid `<title>`
- Viewport meta tag present
- Font sizes are legible
- Tap targets are appropriately sized
- Links are crawlable

---

## Understanding Axe Reports

### Report Format

Axe generates JSON reports with detailed violation information:

```json
{
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "description": "Ensures the contrast between foreground and background colors meets WCAG requirements",
      "nodes": [
        {
          "html": "<button class=\"btn-primary\">Submit</button>",
          "target": ["button.btn-primary"],
          "failureSummary": "Element has insufficient color contrast of 3.2:1 (foreground color: #777, background color: #fff). Expected contrast ratio of 4.5:1"
        }
      ]
    }
  ]
}
```

### Impact Levels

| Impact | Severity | Action Required |
|--------|----------|-----------------|
| **Critical** | BLOCKER | Must fix before deployment |
| **Serious** | HIGH | Fix in current sprint |
| **Moderate** | MEDIUM | Fix within 2 sprints |
| **Minor** | LOW | Fix when convenient |

### Common Violations & Fixes

#### 1. Color Contrast
**Issue**: Text color too similar to background
**Fix**: Use higher contrast colors (use WebAIM Contrast Checker)

```css
/* Before (3.2:1 - FAIL) */
.button {
  color: #777;
  background: #fff;
}

/* After (7.1:1 - PASS) */
.button {
  color: #333;
  background: #fff;
}
```

#### 2. Missing Alt Text
**Issue**: Images without descriptive alt attributes
**Fix**: Add meaningful alt text

```tsx
{/* Before - FAIL */}
<img src="/logo.png" />

{/* After - PASS */}
<img src="/logo.png" alt="M&A Intelligence Platform Logo" />
```

#### 3. Form Labels
**Issue**: Input fields without associated labels
**Fix**: Use proper label elements

```tsx
{/* Before - FAIL */}
<input type="text" placeholder="Enter name" />

{/* After - PASS */}
<label htmlFor="name">Name</label>
<input id="name" type="text" placeholder="Enter name" />
```

#### 4. Button Names
**Issue**: Buttons without accessible names
**Fix**: Add text content or aria-label

```tsx
{/* Before - FAIL */}
<button><X /></button>

{/* After - PASS */}
<button aria-label="Close dialog"><X /></button>
```

#### 5. Keyboard Navigation
**Issue**: Interactive elements not keyboard accessible
**Fix**: Ensure proper tab order and focus management

```tsx
{/* Before - FAIL */}
<div onClick={handleClick}>Click me</div>

{/* After - PASS */}
<button onClick={handleClick}>Click me</button>
```

---

## Troubleshooting

### Issue: "Server failed to start"

**Solution**:
1. Ensure port 4173 is not already in use
2. Kill any existing Vite processes: `pkill -f vite`
3. Check `VITE_CLERK_PUBLISHABLE_KEY` is set correctly

### Issue: "Lighthouse failed to run"

**Solution**:
1. Ensure Chrome/Chromium is installed
2. On Windows, disable antivirus temporarily if blocking Chrome
3. Add `--no-sandbox` flag if running in container

### Issue: "Axe timeout"

**Solution**:
1. Increase timeout: `--timeout 120000`
2. Ensure page loads completely before scan
3. Check for JavaScript errors preventing page load

### Issue: "Permission denied" on script

**Solution**:
```bash
chmod +x scripts/run_local_audits.sh
```

### Issue: Reports not generated

**Solution**:
1. Check `docs/testing/` directory exists
2. Verify write permissions
3. Check disk space availability

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/accessibility-tests.yml`:

```yaml
name: Accessibility & Performance Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}

      - name: Upload Lighthouse Reports
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-reports
          path: .lighthouseci/

  axe:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Build and test
        run: |
          cd frontend
          npm run build
          VITE_CLERK_PUBLISHABLE_KEY=${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }} npm run preview:test &
          sleep 10
          npm run axe:local

      - name: Upload Axe Reports
        uses: actions/upload-artifact@v3
        with:
          name: axe-reports
          path: docs/testing/axe-report.json
```

### Setting Up Secrets

In GitHub repository settings, add:
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

---

## Best Practices

### 1. Test Early and Often

- Run audits before every PR
- Include accessibility in Definition of Done
- Test on real devices, not just emulators

### 2. Prioritize Fixes

1. **Critical/Serious accessibility issues** - Block deployment
2. **Performance Core Web Vitals** - High priority
3. **Moderate accessibility issues** - Medium priority
4. **SEO optimizations** - Medium priority
5. **Minor issues** - Low priority

### 3. Automate Where Possible

- Add Lighthouse/Axe to CI/CD pipeline
- Set up automated reporting
- Use pre-commit hooks for quick checks

### 4. Manual Testing

Automated tools catch ~60% of accessibility issues. Also test:
- **Screen readers** (NVDA, JAWS, VoiceOver)
- **Keyboard-only navigation**
- **Browser zoom** (up to 200%)
- **Color blindness simulators**

### 5. Document Exceptions

If you must accept a violation, document why:

```tsx
{/*
  Axe Exception: color-contrast on .badge-warning
  Reason: Branding requirement from client
  Mitigation: Added bold font weight to improve readability
  Approved by: [Name], [Date]
*/}
<span className="badge-warning">Warning</span>
```

---

## Resources

### Tools
- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/overview/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Learning
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [Web.dev Learn Accessibility](https://web.dev/learn/accessibility/)

---

## Appendix: NPM Scripts Reference

```json
{
  "preview:test": "vite preview --host 0.0.0.0 --port 4173 --strictPort",
  "lighthouse:local": "lighthouse http://127.0.0.1:4173/ --output html --output json --output-path=./docs/testing/lighthouse-report.html",
  "axe:local": "axe http://127.0.0.1:4173/ --load-delay 5000 --timeout 60000 --save docs/testing/axe-report.json",
  "audit:local": "npm run lighthouse:local && npm run axe:local",
  "audit:help": "echo 'Usage: VITE_CLERK_PUBLISHABLE_KEY=<key> npm run preview:test (in one terminal), then npm run audit:local (in another)'"
}
```

---

**Questions or Issues?**

Contact the development team or file an issue in the project repository.

**Happy Testing! ♿🚀**
