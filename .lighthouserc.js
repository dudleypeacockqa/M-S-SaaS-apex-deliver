/**
 * Lighthouse CI Configuration
 *
 * This configuration file defines quality thresholds and budgets for
 * Lighthouse CI audits. It ensures the M&A Platform meets high standards
 * for performance, accessibility, best practices, and SEO.
 *
 * Usage:
 *   - Local testing: npm run lighthouse:local
 *   - CI/CD: lhci autorun
 *
 * Documentation: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

module.exports = {
  ci: {
    collect: {
      // URLs to test (can be overridden via CLI)
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/pricing',
        'http://localhost:4173/about',
        'http://localhost:4173/contact',
      ],

      // Number of times to run Lighthouse on each URL (median is used)
      numberOfRuns: 3,

      // Start a local server before testing (useful for CI)
      startServerCommand: 'npm run preview:test',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,

      // Chrome flags for headless testing
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // Skip certain audits that are not relevant for local testing
        skipAudits: [
          'uses-http2',
          'is-on-https',
        ],
      },
    },

    assert: {
      // Assertions for quality gates
      preset: 'lighthouse:recommended',

      assertions: {
        // Core Web Vitals and Performance
        'categories:performance': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // Accessibility (WCAG 2.1 AA compliance)
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
        'image-alt': 'error',
        'button-name': 'error',
        'link-name': 'error',
        'label': 'error',
        'valid-lang': 'error',
        'html-has-lang': 'error',
        'document-title': 'error',

        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'errors-in-console': 'warn',
        'no-vulnerable-libraries': 'error',
        'uses-https': 'off', // Not applicable for localhost
        'geolocation-on-start': 'error',
        'notification-on-start': 'error',

        // SEO
        'categories:seo': ['error', { minScore: 0.9 }],
        'meta-description': 'error',
        'viewport': 'error',
        'font-size': 'error',
        'tap-targets': 'warn',
        'crawlable-anchors': 'error',

        // PWA (optional - can be disabled if not building PWA)
        'categories:pwa': ['warn', { minScore: 0.5 }],
        'installable-manifest': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'off',

        // Resource Size Budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100KB
        'resource-summary:image:size': ['warn', { maxNumericValue: 1000000 }], // 1MB
        'resource-summary:font:size': ['warn', { maxNumericValue: 200000 }], // 200KB
        'resource-summary:total:size': ['error', { maxNumericValue: 3000000 }], // 3MB

        // Other Performance Metrics
        'modern-image-formats': 'warn',
        'unused-javascript': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'error',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        'offscreen-images': 'warn',
      },
    },

    upload: {
      // Upload results to Lighthouse CI server (optional)
      // Configure this section if you're running a LHCI server
      target: 'temporary-public-storage', // or 'lhci' for self-hosted server

      // For self-hosted LHCI server:
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN,
    },

    server: {
      // Configuration for running local LHCI server (optional)
      // port: 9001,
      // storage: {
      //   storageMethod: 'sql',
      //   sqlDialect: 'sqlite',
      //   sqlDatabasePath: './lhci.db',
      // },
    },
  },
};
