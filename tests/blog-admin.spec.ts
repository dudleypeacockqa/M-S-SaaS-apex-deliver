import { test, expect } from '@playwright/test';

const baseUrl = process.env.MARKETING_BASE_URL ?? 'http://127.0.0.1:4173';
const testRoutesEnabled = process.env.PLAYWRIGHT_ENABLE_TEST_ROUTES === 'true';

const describeFn = testRoutesEnabled ? test.describe : test.describe.skip;

describeFn('Blog Admin Editor (test harness)', () => {
  test('creates and publishes a post via the test route', async ({ page }) => {
    const createRequests: any[] = [];

    await page.route('**/api/blog', async (route) => {
      const method = route.request().method();

      if (method === 'POST') {
        const body = JSON.parse(route.request().postData() ?? '{}');
        createRequests.push(body);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            ...body,
            id: 101,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
        return;
      }

      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto(`${baseUrl}/__tests__/admin/blog/new`);

    await page.getByLabel('Title *').fill('Playwright Blog Proof');
    await page.getByLabel('Content *').fill('This is the Playwright end-to-end proof.');
    await page.getByLabel('Tags').fill('growth, operations');
    await page.getByLabel('Meta Description (SEO)').fill('Playwright blog proof meta');

    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect.poll(() => createRequests.length).toBe(1);

    expect(createRequests[0].title).toBe('Playwright Blog Proof');
    expect(createRequests[0].published).toBe(true);
    expect(createRequests[0].secondary_keywords).toEqual(['growth', 'operations']);
    expect(createRequests[0].meta_description).toBe('Playwright blog proof meta');
  });

  test('loads an existing post and saves a draft update', async ({ page }) => {
    const updateRequests: any[] = [];

    await page.route('**/api/blog/existing-playwright-post', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 42,
            title: 'Existing Playwright Post',
            slug: 'existing-playwright-post',
            excerpt: 'Existing excerpt',
            content: 'Existing content block',
            category: 'Insights',
            primary_keyword: 'Insights',
            secondary_keywords: ['insights'],
            meta_description: 'Existing meta',
            featured_image_url: null,
            author: 'QA Bot',
            read_time_minutes: 5,
            published: false,
            published_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
        return;
      }

      if (method === 'PUT') {
        const body = JSON.parse(route.request().postData() ?? '{}');
        updateRequests.push(body);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...body, id: 42 }),
        });
        return;
      }

      await route.fulfill({ status: 404, body: '{}' });
    });

    await page.goto(`${baseUrl}/__tests__/admin/blog/existing-playwright-post/edit`);

    await expect(page.getByLabel('Title *')).toHaveValue('Existing Playwright Post');

    await page.getByLabel('Tags').fill('insights, qa');
    await page.getByLabel('Excerpt').fill('Updated excerpt from Playwright');
    await page.getByRole('button', { name: 'Save Draft' }).click();

    await expect.poll(() => updateRequests.length).toBe(1);
    expect(updateRequests[0].secondary_keywords).toEqual(['insights', 'qa']);
    expect(updateRequests[0].published).toBe(false);
    expect(updateRequests[0].excerpt).toBe('Updated excerpt from Playwright');
  });
});
