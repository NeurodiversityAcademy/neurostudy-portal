/**
 * Public content stays open to search engines and AI assistants on purpose:
 * provider and course pages are how people (and the assistants they ask) find
 * the academy.
 *
 * Provider search is the exception. It is a per-visitor tool, not content, so
 * it is excluded here and challenged at the edge for automation. A crawler that
 * ignores robots.txt still gets stopped by the Vercel Firewall rule on /search.
 */
const ROBOTS_TXT = `# Content: open to search engines and AI assistants.
# Search: for people using the site only.
User-agent: *
Disallow: /search
Disallow: /api/
Disallow: /profile
Disallow: /login
Disallow: /signup

Sitemap: https://neurodiversityacademy.com/sitemap.xml
`;

export function GET() {
  return new Response(ROBOTS_TXT, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
