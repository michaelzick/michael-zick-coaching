import { expect, test } from '@playwright/test';
import { getBlogPosts } from '../../lib/blog';

// Blog posts are prerendered; unknown slugs must 404 without an on-demand
// render, which would try to write to the read-only Cloudflare asset cache.
test.describe('blog post routes', () => {
  test('serves a prerendered post', async ({ request }) => {
    const [post] = getBlogPosts();
    const response = await request.get(`/blog/${post.slug}`);
    expect(response.status()).toBe(200);
  });

  for (const path of ['/blog/[slug]', '/blog/not-a-real-post']) {
    test(`returns 404 for ${path}`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(404);
    });
  }
});
