import { test, expect } from "@playwright/test";
import { buildMarketingUrl } from "./utils/marketingUrl";

test.describe('Integrations visibility', () => {
  test('highlights iPaaS integrations on the pricing page', async ({ page }) => {
    const response = await page.goto(buildMarketingUrl('/pricing'), { waitUntil: 'networkidle' });
    expect(response, 'pricing page should respond').toBeTruthy();
    expect(response?.ok()).toBeTruthy();

    const integrationFeature = page.getByTestId('pricing-feature-api-access-row')
    await integrationFeature.scrollIntoViewIfNeeded();
    await expect(integrationFeature).toBeVisible();
    await expect(page.getByTestId('pricing-cta-enterprise')).toBeVisible();
    await expect(page.getByTestId('pricing-cta-community')).toBeVisible();
  });
});
