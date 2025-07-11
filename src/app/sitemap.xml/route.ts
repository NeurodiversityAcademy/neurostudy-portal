import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const urls = [
    'https://neurodiversityacademy.com/',
    'https://neurodiversityacademy.com/endorsements',
    'https://neurodiversityacademy.com/contact',
    'https://neurodiversityacademy.com/about',
    'https://neurodiversityacademy.com/neurodivergentmates',
    'https://neurodiversityacademy.com/login',
    'https://neurodiversityacademy.com/signup',
    // Add more URLs as needed
  ];

  const lastmod = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url}</loc>
  <lastmod>${lastmod}</lastmod>
</url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}