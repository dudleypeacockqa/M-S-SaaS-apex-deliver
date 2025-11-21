import { test, expect } from "@playwright/test";

const baseUrl = process.env.MARKETING_BASE_URL ?? "http://127.0.0.1:4173";

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

    const response = await page.goto(baseUrl + '/', { waitUntil: 'networkidle' })
    expect(response, 'landing page should respond').toBeTruthy()
    expect(response?.ok()).toBeTruthy()

    await expect(page.getByRole('heading', { name: /Get Expert M&A Insights/i })).toBeVisible()
    const emailField = page.locator('form input[type="email"]')
    await emailField.fill('marketing-qa@example.com')
    await page.getByRole('button', { name: /Get Free Insights/i }).click()
    await expect(page.getByText("You're All Set!"))
      .toBeVisible()
  })
})
