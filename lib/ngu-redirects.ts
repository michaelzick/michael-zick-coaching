// michaelzick.com now lives on Nice Guy University as Michael's coach profile.
// Every public page permanently redirects to its counterpart there, so links
// and search rankings carry over. Next checks redirects in order, first match
// wins; the catch-all must stay last. Query strings pass through unchanged.

export const NGU_ORIGIN = 'https://www.niceguyuniversity.com';
export const NGU_COACH_PROFILE_URL = `${NGU_ORIGIN}/coaches/michael-zick`;

export type NguRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

function coachTab(segment: string) {
  return `${NGU_COACH_PROFILE_URL}/${segment}`;
}

export const NGU_REDIRECTS: NguRedirect[] = [
  { source: '/', destination: NGU_COACH_PROFILE_URL, permanent: true },
  { source: '/about', destination: coachTab('about'), permanent: true },
  { source: '/testimonials', destination: coachTab('testimonials'), permanent: true },
  { source: '/blog', destination: coachTab('articles'), permanent: true },
  // NGU kept michaelzick.com's blog slugs, so each post maps one to one.
  { source: '/blog/:slug', destination: `${coachTab('articles')}/:slug`, permanent: true },
  { source: '/questionnaire', destination: coachTab('questionnaire'), permanent: true },
  { source: '/contact', destination: coachTab('contact'), permanent: true },
  { source: '/nice-guy-university', destination: `${NGU_ORIGIN}/`, permanent: true },
  { source: '/privacy-policy', destination: `${NGU_ORIGIN}/privacy`, permanent: true },
  { source: '/terms-of-service', destination: `${NGU_ORIGIN}/terms`, permanent: true },
  { source: '/sitemap.xml', destination: `${NGU_ORIGIN}/sitemap.xml`, permanent: true },
  { source: '/robots.txt', destination: `${NGU_ORIGIN}/robots.txt`, permanent: true },
  // Everything else, API routes included, lands on the coach profile. Static
  // images keep serving because other sites and old emails may embed them.
  { source: '/:path((?!img/).*)', destination: NGU_COACH_PROFILE_URL, permanent: true },
];
