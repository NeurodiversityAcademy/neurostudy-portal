import { type NextRequest } from 'next/server';
import { buildSitemapUrls, buildSitemapXml } from './buildSitemapUrls';

export async function GET(_request: NextRequest) {
  const baseUrl = 'https://neurodiversityacademy.com';
  const urls = buildSitemapUrls({ baseUrl });
  const lastmod = new Date().toISOString();
  const sitemap = buildSitemapXml(urls, lastmod);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
