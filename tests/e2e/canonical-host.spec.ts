import { test, expect } from '@playwright/test';

test('every host serves pages with noindex and no host redirect', async ({ request }) => {
  for (const host of ['michael-zick-coaching.zickonezero.workers.dev', 'michaelzick.com', 'www.michaelzick.com']) {
    const response = await request.get('/about', { headers: { host }, maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()['x-robots-tag']).toBe('noindex');
  }
});

test('canonical URLs point at the workers.dev host', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://michael-zick-coaching.zickonezero.workers.dev/about',
  );
});
