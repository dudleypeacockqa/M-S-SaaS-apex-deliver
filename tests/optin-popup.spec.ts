import { test, expect } from "@playwright/test";
import { buildMarketingUrl } from "./utils/marketingUrl";

test.describe("Opt-in popup", () => {
  test("allows visitors to subscribe to the newsletter", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('100days_optin_seen')
      const originalSetTimeout = window.setTimeout
      window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
        if (timeout === 90000) {
          return originalSetTimeout(handler, 0, ...args)
        }
        return originalSetTimeout(handler, timeout, ...args)
      }) as typeof window.setTimeout
    })

    await page.route('**/marketing/subscribe', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    const instantOptInUrl = new URL(buildMarketingUrl('/'))
    instantOptInUrl.searchParams.set('optin', 'instant')

    const response = await page.goto(instantOptInUrl.toString(), { waitUntil: 'networkidle' })
    expect(response, 'landing page should respond').toBeTruthy()
    expect(response?.ok()).toBeTruthy()

    const popup = page.getByTestId('optin-popup')
    await expect(popup).toBeVisible()
    await expect(popup.getByRole('heading', { name: /Get Expert M&A Insights/i })).toBeVisible()

    await popup.getByPlaceholder(/enter your email/i).fill('marketing-qa@example.com')
    await popup.getByRole('button', { name: /Get Free Insights/i }).click()
    await expect(popup.getByText("You're All Set!")).toBeVisible()
  })
})
