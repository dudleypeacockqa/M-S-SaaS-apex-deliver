# Testing Documentation

This directory contains testing reports and documentation for the M&A Intelligence Platform.

## Quick Links

- **[Accessibility Testing Guide](ACCESSIBILITY-TESTING.md)** - Complete guide to running Lighthouse and Axe audits
- **Lighthouse Reports** - `lighthouse-report.html` (generated after running audits)
- **Axe Reports** - `axe-report.json` (generated after running audits)

## Quick Start

### Run All Audits (Automated)

```bash
# From project root
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ./scripts/run_local_audits.sh
```

### Run Individual Tests

```bash
# Terminal 1: Start server
cd frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx npm run preview:test

# Terminal 2: Run tests
cd frontend
npm run lighthouse:local  # Performance audit
npm run axe:local        # Accessibility audit
npm run audit:local      # Both
```

## What Gets Tested

### Lighthouse Audits
- ⚡ **Performance** - Core Web Vitals (LCP, FCP, CLS, TBT)
- ♿ **Accessibility** - WCAG 2.1 AA compliance
- ✅ **Best Practices** - Modern web standards
- 🔍 **SEO** - Search engine optimization

### Axe Accessibility Audits
- Color contrast
- Alt text on images
- Form labels
- ARIA attributes
- Keyboard navigation
- Semantic HTML

## Quality Gates

| Category | Minimum | Target |
|----------|---------|--------|
| Performance | 90% | 95%+ |
| Accessibility | 95% | 100% |
| Best Practices | 90% | 95%+ |
| SEO | 90% | 95%+ |

## Reports

After running audits, view results:

```bash
# Windows
start docs/testing/lighthouse-report.html

# macOS
open docs/testing/lighthouse-report.html

# Linux
xdg-open docs/testing/lighthouse-report.html
```

## CI/CD Integration

See [ACCESSIBILITY-TESTING.md](ACCESSIBILITY-TESTING.md#cicd-integration) for GitHub Actions workflow examples.

## Documentation Structure

```
docs/testing/
├── README.md                     # This file
├── ACCESSIBILITY-TESTING.md      # Complete testing guide
├── lighthouse-report.html        # Latest Lighthouse audit (HTML)
├── lighthouse-report.json        # Latest Lighthouse audit (JSON)
└── axe-report.json              # Latest Axe accessibility audit
```

## Need Help?

1. Read the [full testing guide](ACCESSIBILITY-TESTING.md)
2. Check the [troubleshooting section](ACCESSIBILITY-TESTING.md#troubleshooting)
3. Contact the development team

---

**Last Updated**: November 13, 2025
