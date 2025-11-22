import { test, expect } from "@playwright/test";
import { buildMarketingUrl } from "./utils/marketingUrl";

const seoPages = [
  { path: '/', canonical: 'https://100daysandbeyond.com/' },
  { path: '/contact', canonical: 'https://100daysandbeyond.com/contact' },
  { path: '/team', canonical: 'https://100daysandbeyond.com/team' },
];

test.describe('SEO meta', () => {
  for (const pageConfig of seoPages) {
    test('sets canonical + og:url for ' + pageConfig.path, async ({ page }) => {
      const response = await page.goto(buildMarketingUrl(pageConfig.path), { waitUntil: 'networkidle' });
      expect(response, 'page should respond').toBeTruthy();
      expect(response?.ok()).toBeTruthy();

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', pageConfig.canonical);

      const ogUrl = page.locator('meta[property="og:url"]');
      await expect(ogUrl).toHaveAttribute('content', pageConfig.canonical);
    });
  }
});
