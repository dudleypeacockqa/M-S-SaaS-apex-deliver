import { test, expect } from "@playwright/test";

const baseUrl = process.env.MARKETING_BASE_URL ?? "http://127.0.0.1:4173";

test.describe('Integrations visibility', () => {
  test('highlights iPaaS integrations on the pricing page', async ({ page }) => {
    const response = await page.goto(baseUrl + '/pricing', { waitUntil: 'networkidle' });
    expect(response, 'pricing page should respond').toBeTruthy();
    expect(response?.ok()).toBeTruthy();

    const integrationBenefit = page.getByText('API Access & iPaaS Integrations');
    await integrationBenefit.scrollIntoViewIfNeeded();
    await expect(integrationBenefit).toBeVisible();
    await expect(page.getByTestId('pricing-cta-enterprise')).toBeVisible();
    await expect(page.getByTestId('pricing-cta-community')).toBeVisible();
  });
});
