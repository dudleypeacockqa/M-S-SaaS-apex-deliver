import { test, expect } from "@playwright/test";

const baseUrl = process.env.MARKETING_BASE_URL ?? "http://127.0.0.1:4173";

test.describe("Contact flow", () => {
  test("submits the marketing contact form", async ({ page }) => {
    await page.route('**/marketing/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ok' }),
      })
    })

    const response = await page.goto(baseUrl + '/contact', { waitUntil: 'networkidle' })
    expect(response, 'contact page should respond').toBeTruthy()
    expect(response?.ok()).toBeTruthy()

    await page.fill('#name', 'BMAD QA')
    await page.fill('#email', 'qa@example.com')
    await page.selectOption('#subject', 'demo')
    await page.fill('#message', 'Verifying BMAD contact flow via Playwright smoke test.')
    await page.getByRole('button', { name: /send message/i }).click()

    await expect(page.getByText('Message Sent!')).toBeVisible()
  })
})
