export function GET() {
  const disallowedPaths = [
    '/api/',
    '/hooks/',
    '/utilities/',
    '/components/',
    '/profile/',
    '/styles/',
    '/moodle/',
    '/interfaces/',
  ];

  const disallowRules = disallowedPaths
    .map((path) => `Disallow: ${path}`)
    .join('\n');
  const content = `
User-agent: *
Allow: /
${disallowRules}


Sitemap: https://neurodiversityacademy.com/sitemap.xml
`.trim();

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
