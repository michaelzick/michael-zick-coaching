import { test, expect } from '@playwright/test';

test('only the exact apex hostname redirects to www', async ({ request }) => {
  for (const host of ['michaelzick.com', 'www.michaelzick.com', 'michaelzick-com.zickonezero.workers.dev']) {
    const response = await request.get('/about', { headers: { host }, maxRedirects: 0 });
    expect(response.status()).toBe(host === 'michaelzick.com' ? 308 : 200);
    if (host === 'michaelzick.com') {
      expect(response.headers().location).toBe('https://www.michaelzick.com/about');
    }
  }
});
