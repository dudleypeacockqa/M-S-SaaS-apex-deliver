import { test, expect } from "@playwright/test";

const baseUrl = process.env.MARKETING_BASE_URL ?? "http://127.0.0.1:4173";

test.describe("Blog smoke", () => {
  test("renders marketing blog listing with hero content", async ({ page }) => {
    const response = await page.goto(baseUrl + '/blog', { waitUntil: "networkidle" });
    expect(response, "blog page should respond").toBeTruthy();
    expect(response?.ok()).toBeTruthy();

    await expect(page.getByRole("heading", { name: /M&A Success/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /search blog posts/i })).toBeVisible();
  });
});
