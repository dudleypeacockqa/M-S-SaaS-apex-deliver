# Performance Optimization Action Plan

**Date**: November 13, 2025
**Current Performance Score**: 74%
**Target Score**: 90%+
**Gap to Close**: +16 percentage points

---

## Executive Summary

Based on the Lighthouse audit results, the M&A Platform frontend has three critical performance bottlenecks that, when addressed, should improve the performance score from 74% to 90%+.

### Core Metrics (Current State)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| First Contentful Paint (FCP) | 2.4s | <1.8s | ⚠️ Slow |
| Largest Contentful Paint (LCP) | **5.3s** | <2.5s | 🔴 **Critical** |
| Total Blocking Time (TBT) | 190ms | <200ms | ⚠️ Near limit |
| Cumulative Layout Shift (CLS) | 0 | <0.1 | ✅ Excellent |
| Speed Index | 3.1s | <3.4s | ✅ Good |

**Primary Issue**: Largest Contentful Paint (LCP) at 5.3s is the biggest problem - it's 2.8 seconds over target!

---

## Top 3 Critical Issues (Lighthouse Audit)

### 🔴 Issue #1: Render-Blocking Resources
**Score**: 0% (Critical)
**Potential Savings**: 160ms
**Impact**: HIGH - Blocking first paint

**Problem**: CSS and JavaScript files are blocking the initial page render.

**Solution**:
```html
<!-- Current (blocking) -->
<link rel="stylesheet" href="/assets/index-B85zY7Sn.css">

<!-- Fixed (non-blocking) -->
<link rel="stylesheet" href="/assets/index-B85zY7Sn.css" media="print" onload="this.media='all'">
```

**Implementation Steps**:

1. **Inline Critical CSS** (vite.config.js)
   ```javascript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import { ViteCriticalCss } from 'vite-plugin-critical-css';

   export default defineConfig({
     plugins: [
       react(),
       ViteCriticalCss({
         criticalWidth: 1200,
         criticalHeight: 900,
       })
     ]
   });
   ```

2. **Defer Non-Critical JavaScript**
   - Move analytics scripts to `<script defer>`
   - Lazy load Clerk widget after first paint
   - Use dynamic imports for heavy features

3. **Optimize Font Loading**
   ```css
   /* Use font-display: swap */
   @font-face {
     font-family: 'CustomFont';
     font-display: swap; /* Show fallback font immediately */
     src: url('/fonts/custom.woff2') format('woff2');
   }
   ```

**Files to Modify**:
- `frontend/index.html` - Add preload/defer attributes
- `frontend/vite.config.js` - Add critical CSS plugin
- `frontend/src/main.tsx` - Defer non-critical initializations

**Estimated Impact**: +6-8 percentage points

---

### 🔴 Issue #2: Unused JavaScript
**Score**: 0% (Critical)
**Potential Savings**: 93 KiB (24% of total bundle)
**Impact**: HIGH - Wasting bandwidth and parse time

**Problem**: Shipping 93 KiB of JavaScript that users don't need on initial page load.

**Solution**: Implement aggressive code splitting and lazy loading.

**Implementation Steps**:

1. **Lazy Load Routes**
   ```typescript
   // Current (eager loading)
   import { ValuationSuite } from './pages/ValuationSuite';

   // Fixed (lazy loading)
   const ValuationSuite = lazy(() => import('./pages/ValuationSuite'));

   <Route path="/valuation" element={
     <Suspense fallback={<LoadingSpinner />}>
       <ValuationSuite />
     </Suspense>
   } />
   ```

2. **Split Large Dependencies**
   ```javascript
   // vite.config.js
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom', 'react-router-dom'],
             'clerk-vendor': ['@clerk/clerk-react'],
             'charts': ['recharts'], // Separate chart library
             'forms': ['react-hook-form', 'zod'], // Form libraries
             'valuation': ['./src/pages/ValuationSuite'], // Heavy feature
           }
         }
       }
     }
   });
   ```

3. **Dynamic Imports for Heavy Features**
   ```typescript
   // Lazy load markdown renderer (only needed for blog posts)
   const ReactMarkdown = lazy(() => import('react-markdown'));

   // Lazy load drag-and-drop (only needed in deal pipeline)
   const DragDropContext = lazy(() =>
     import('@hello-pangea/dnd').then(m => ({ default: m.DragDropContext }))
   );
   ```

4. **Remove Unused Imports**
   - Run: `npx depcheck` to find unused dependencies
   - Remove unused utility functions
   - Tree-shake lodash (use `lodash-es` or individual imports)

**Files to Analyze**:
- `frontend/src/pages/ValuationSuite.tsx` (375 KiB - biggest offender!)
- `frontend/src/services/api/client.ts` (imported everywhere)
- `frontend/src/App.tsx` (route definitions)

**Estimated Impact**: +5-7 percentage points

---

### 🟡 Issue #3: Legacy JavaScript
**Score**: 50% (Warning)
**Potential Savings**: Unknown (polyfills overhead)
**Impact**: MEDIUM - Serving unnecessary polyfills to modern browsers

**Problem**: Vite is including polyfills that aren't needed for 95%+ of users on modern browsers.

**Solution**: Target modern browsers only.

**Implementation Steps**:

1. **Update Browser Targets**
   ```javascript
   // vite.config.js
   export default defineConfig({
     build: {
       target: 'es2020', // Drop support for very old browsers
       // OR for maximum performance:
       target: ['chrome90', 'firefox88', 'safari14', 'edge90'],

       // Reduce polyfill size
       modulePreload: {
         polyfill: false // Users on modern browsers don't need this
       }
     }
   });
   ```

2. **Review Clerk/Stripe SDKs**
   - Check if they're bundling unnecessary polyfills
   - Consider loading them via CDN with `<script type="module">`

3. **Remove Babel Polyfills** (if any)
   ```json
   // .babelrc (if exists - delete this)
   {
     "presets": [
       ["@babel/preset-env", {
         "useBuiltIns": "usage" // This adds unnecessary polyfills
       }]
     ]
   }
   ```

**Estimated Impact**: +2-3 percentage points

---

## Secondary Optimizations (Quick Wins)

### 4. Fix Static Import/Dynamic Import Conflict
**Current Warning**:
```
client.ts is dynamically imported by events.ts
but also statically imported by multiple modules
```

**Solution**:
```typescript
// frontend/src/services/api/events.ts
// Change from:
const client = await import('./client');

// To:
import { apiClient } from './client'; // Always static
```

**Impact**: Improves code splitting effectiveness (+1-2 points)

---

### 5. Optimize Images
**Current**: Some images may not be using modern formats

**Steps**:
1. Ensure all images are WebP/AVIF format
2. Add lazy loading: `<img loading="lazy" />`
3. Add proper width/height to prevent CLS

**Impact**: +1-2 percentage points

---

### 6. Preload Critical Assets
**Add to index.html**:
```html
<head>
  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Preload critical CSS -->
  <link rel="preload" href="/assets/index.css" as="style">

  <!-- DNS prefetch for external services -->
  <link rel="dns-prefetch" href="https://clerk.com">
  <link rel="dns-prefetch" href="https://js.stripe.com">
</head>
```

**Impact**: +1-2 percentage points (reduces LCP)

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Target: 85% score)
**Time Estimate**: 4-6 hours
**Priority**: HIGH

- [ ] Fix render-blocking resources (Issue #1)
- [ ] Implement lazy loading for ValuationSuite (Issue #2)
- [ ] Fix client.ts import conflict (Issue #4)
- [ ] Run audit to verify improvement

**Expected Score After Phase 1**: ~82-85%

---

### Phase 2: Bundle Optimization (Target: 90% score)
**Time Estimate**: 3-4 hours
**Priority**: MEDIUM

- [ ] Split large vendor bundles (Issue #2)
- [ ] Remove unused JavaScript (depcheck)
- [ ] Update browser targets (Issue #3)
- [ ] Add resource hints (Issue #6)
- [ ] Run audit to verify improvement

**Expected Score After Phase 2**: ~88-90%

---

### Phase 3: Fine-Tuning (Target: 95% score)
**Time Estimate**: 2-3 hours
**Priority**: LOW

- [ ] Optimize all images to WebP/AVIF
- [ ] Implement service worker for caching
- [ ] Add HTTP/2 push for critical resources
- [ ] Fine-tune critical CSS extraction
- [ ] Run final audit

**Expected Score After Phase 3**: ~93-95%

---

## Measurement & Validation

### Before Starting
```bash
# Record baseline
.\scripts\run_audits.ps1
# Save report as baseline-2025-11-13.html
```

### After Each Phase
```bash
# Run audit
.\scripts\run_audits.ps1

# Compare scores
# Performance: 74% → 85% → 90% → 95%
```

### Success Criteria
- ✅ Performance score ≥ 90%
- ✅ LCP < 2.5s (currently 5.3s)
- ✅ FCP < 1.8s (currently 2.4s)
- ✅ TBT < 200ms (currently 190ms - almost there!)

---

## Code Examples: Quick Implementation

### Example 1: Lazy Load ValuationSuite

**File**: `frontend/src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';

// Change this:
import { ValuationSuite } from './pages/ValuationSuite';

// To this:
const ValuationSuite = lazy(() => import('./pages/ValuationSuite'));
const DocumentEditor = lazy(() => import('./pages/documents/DocumentEditor'));
const ContentStudio = lazy(() => import('./pages/content/ContentStudio'));

// Wrap routes:
<Route path="/valuation" element={
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
  }>
    <ValuationSuite />
  </Suspense>
} />
```

**Savings**: ~375 KiB not loaded on initial page load!

---

### Example 2: Critical CSS Plugin

**File**: `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@clerk')) {
              return 'clerk-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts-vendor';
            }
          }

          // Feature chunks
          if (id.includes('src/pages/ValuationSuite')) {
            return 'valuation-feature';
          }
          if (id.includes('src/pages/documents/DocumentEditor')) {
            return 'document-editor-feature';
          }
        }
      }
    }
  }
});
```

---

### Example 3: Preload Critical Resources

**File**: `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ApexDeliver - M&A Intelligence Platform</title>

    <!-- Critical Resource Hints -->
    <link rel="preconnect" href="https://clerk.com" crossorigin>
    <link rel="preconnect" href="https://js.stripe.com" crossorigin>
    <link rel="dns-prefetch" href="https://ma-saas-backend.onrender.com">

    <!-- Preload critical CSS (Vite will inject this) -->
    <!-- Preload critical fonts (if any custom fonts) -->
    <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Testing Strategy

### Local Testing
```bash
# 1. Make changes
# 2. Build production bundle
cd frontend
npm run build

# 3. Run audit
cd ..
.\scripts\run_audits.ps1

# 4. Review lighthouse-report.html
start docs/testing/lighthouse-report.report.html
```

### Automated Testing (CI/CD)
```yaml
# .github/workflows/performance-audit.yml
name: Performance Audit

on:
  pull_request:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: cd frontend && npm install --include=dev

      - name: Build
        run: cd frontend && npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'

      - name: Assert Scores
        run: |
          # Fail if performance < 90%
          if [ $PERFORMANCE_SCORE -lt 90 ]; then
            echo "Performance score too low: $PERFORMANCE_SCORE"
            exit 1
          fi
```

---

## Monitoring & Regression Prevention

### 1. Set Up Performance Budget

**Create**: `frontend/lighthouserc.json`

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],

        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "total-blocking-time": ["error", {"maxNumericValue": 200}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}
```

### 2. Bundle Size Monitoring

**Add to**: `frontend/package.json`

```json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build --mode production && vite-bundle-visualizer",
    "audit:size": "bundlesize"
  },
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "250 kB",
      "compression": "gzip"
    }
  ]
}
```

---

## Expected Results

### Before Optimization
| Metric | Value |
|--------|-------|
| Performance | 74% |
| LCP | 5.3s |
| FCP | 2.4s |
| TBT | 190ms |
| Total JS | ~1.4 MB |

### After Phase 1 (Critical Fixes)
| Metric | Expected Value | Improvement |
|--------|---------------|-------------|
| Performance | ~85% | +11 points |
| LCP | ~3.5s | -1.8s |
| FCP | ~1.5s | -0.9s |
| TBT | ~150ms | -40ms |
| Total JS | ~1.2 MB | -200 KB |

### After Phase 2 (Bundle Optimization)
| Metric | Expected Value | Improvement |
|--------|---------------|-------------|
| Performance | ~90% | +16 points |
| LCP | ~2.3s | -3.0s |
| FCP | ~1.2s | -1.2s |
| TBT | ~120ms | -70ms |
| Total JS | ~900 KB | -500 KB |

### After Phase 3 (Fine-Tuning)
| Metric | Expected Value | Improvement |
|--------|---------------|-------------|
| Performance | ~95% | +21 points |
| LCP | ~1.8s | -3.5s |
| FCP | ~0.9s | -1.5s |
| TBT | ~80ms | -110ms |
| Total JS | ~750 KB | -650 KB |

---

## Resources & References

### Tools
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Vite Bundle Visualizer](https://github.com/btd/rollup-plugin-visualizer)
- [depcheck](https://github.com/depcheck/depcheck) - Find unused dependencies
- [bundle-size](https://github.com/siddharthkp/bundlesize) - Keep bundle size in check

### Documentation
- [Vite Performance Best Practices](https://vitejs.dev/guide/performance.html)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Web Vitals](https://web.dev/vitals/)
- [Critical CSS Guide](https://web.dev/extract-critical-css/)

### Further Reading
- [The Cost of JavaScript in 2023](https://v8.dev/blog/cost-of-javascript-2019)
- [Lazy Loading Best Practices](https://web.dev/lazy-loading/)
- [Code Splitting Strategies](https://web.dev/code-splitting-with-dynamic-imports/)

---

**Action Plan Created**: November 13, 2025
**Next Review**: After Phase 1 completion
**Target Completion**: Within 2 sprint cycles
**Owner**: Development Team + Claude Code
