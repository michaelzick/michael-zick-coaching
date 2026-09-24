import { expect, test } from '@playwright/test';
import { NGU_COACH_PROFILE_URL, NGU_ORIGIN } from '../../lib/ngu-redirects';

// michaelzick.com's pages moved to Michael's Nice Guy University coach
// profile. These hit the real Next server without following redirects, so
// they check what Next actually sends rather than the table alone.
const cases: Array<[path: string, location: string]> = [
  ['/', NGU_COACH_PROFILE_URL],
  ['/about', `${NGU_COACH_PROFILE_URL}/about`],
  ['/testimonials', `${NGU_COACH_PROFILE_URL}/testimonials`],
  ['/blog', `${NGU_COACH_PROFILE_URL}/articles`],
  ['/blog/the-music-of-enmeshment', `${NGU_COACH_PROFILE_URL}/articles/the-music-of-enmeshment`],
  ['/questionnaire', `${NGU_COACH_PROFILE_URL}/questionnaire`],
  ['/contact', `${NGU_COACH_PROFILE_URL}/contact`],
  ['/nice-guy-university', `${NGU_ORIGIN}/`],
  ['/privacy-policy', `${NGU_ORIGIN}/privacy`],
  ['/terms-of-service', `${NGU_ORIGIN}/terms`],
  ['/sitemap.xml', `${NGU_ORIGIN}/sitemap.xml`],
  ['/robots.txt', `${NGU_ORIGIN}/robots.txt`],
  ['/api/contact', NGU_COACH_PROFILE_URL],
  ['/an/old/link', NGU_COACH_PROFILE_URL],
  ['/about?utm_source=newsletter', `${NGU_COACH_PROFILE_URL}/about?utm_source=newsletter`],
];

for (const [path, location] of cases) {
  test(`${path} permanently redirects to ${location}`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers()['location']).toBe(location);
  });
}

test('static images keep serving for pages that embed them', async ({ request }) => {
  const response = await request.get('/img/ryan.webp', { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/');
});
