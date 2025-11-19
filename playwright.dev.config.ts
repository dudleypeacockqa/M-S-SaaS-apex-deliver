import { defineConfig, devices } from '@playwright/test';

process.env.PLAYWRIGHT_TSCONFIG = 'playwright.tsconfig.json';
const DEFAULT_BASE_URL = 'http://127.0.0.1:4173';
const baseURL = process.env.MARKETING_BASE_URL ?? DEFAULT_BASE_URL;
const shouldStartPreview = !process.env.MARKETING_BASE_URL || process.env.MARKETING_BASE_URL === DEFAULT_BASE_URL;
const previewCommand = 'npm run preview:test --prefix frontend';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
  ],
  ...(shouldStartPreview
    ? {
        webServer: {
          command: previewCommand,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }
    : {}),
});
