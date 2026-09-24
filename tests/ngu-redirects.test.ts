import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { getBlogPosts } from '../lib/blog';
import { NGU_COACH_PROFILE_URL, NGU_ORIGIN, NGU_REDIRECTS } from '../lib/ngu-redirects';

function listPageRoutes(dir = 'app'): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return listPageRoutes(path);
    if (entry !== 'page.tsx') return [];
    const route = relative('app', dir).split(sep).join('/');
    return [route ? `/${route}` : '/'];
  });
}

function destinationFor(source: string) {
  return NGU_REDIRECTS.find((redirect) => redirect.source === source)?.destination;
}

test('every static page has an explicit redirect to Nice Guy University', () => {
  const staticRoutes = listPageRoutes().filter((route) => !route.includes('['));
  assert.ok(staticRoutes.length >= 9, 'found the app routes');
  for (const route of staticRoutes) {
    assert.ok(destinationFor(route), `missing redirect for ${route}`);
  }
});

test('pages land on the matching coach profile tab', () => {
  assert.equal(destinationFor('/'), NGU_COACH_PROFILE_URL);
  assert.equal(destinationFor('/about'), `${NGU_COACH_PROFILE_URL}/about`);
  assert.equal(destinationFor('/testimonials'), `${NGU_COACH_PROFILE_URL}/testimonials`);
  assert.equal(destinationFor('/blog'), `${NGU_COACH_PROFILE_URL}/articles`);
  assert.equal(destinationFor('/questionnaire'), `${NGU_COACH_PROFILE_URL}/questionnaire`);
  assert.equal(destinationFor('/contact'), `${NGU_COACH_PROFILE_URL}/contact`);
  assert.equal(destinationFor('/nice-guy-university'), `${NGU_ORIGIN}/`);
  assert.equal(destinationFor('/privacy-policy'), `${NGU_ORIGIN}/privacy`);
  assert.equal(destinationFor('/terms-of-service'), `${NGU_ORIGIN}/terms`);
});

test('blog posts keep their slugs on NGU', () => {
  assert.equal(destinationFor('/blog/:slug'), `${NGU_COACH_PROFILE_URL}/articles/:slug`);
  // The slugs NGU ships in src/data/coaches/michael-zick/articles.ts. A post
  // added here without being ported would redirect to a missing article.
  assert.deepEqual(
    getBlogPosts().map((post) => post.slug).sort(),
    [
      'if-its-not-a-hell-yes-is-it-a-no',
      'the-music-of-enmeshment',
      'the-nice-guy-trap-isnt-being-nice-its-these-4-patterns',
      'the-survival-instincts-making-you-miserable-in-modern-relationships',
      'why-your-emotions-control-what-you-see-and-how-to-change-your-reality',
    ],
  );
});

test('every redirect is permanent and points at Nice Guy University', () => {
  for (const redirect of NGU_REDIRECTS) {
    assert.equal(redirect.permanent, true, redirect.source);
    assert.ok(redirect.destination.startsWith(`${NGU_ORIGIN}/`), redirect.destination);
  }
});

test('the catch-all comes last and leaves static images alone', () => {
  const last = NGU_REDIRECTS[NGU_REDIRECTS.length - 1];
  assert.equal(last.source, '/:path((?!img/).*)');
  assert.equal(last.destination, NGU_COACH_PROFILE_URL);

  const catchAll = new RegExp(`^/${'(?!img/).*'}$`);
  assert.ok(catchAll.test('/api/contact'));
  assert.ok(catchAll.test('/some/old/page'));
  assert.ok(!catchAll.test('/img/ryan.webp'));
});
