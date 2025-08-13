/* eslint-disable */
/* tslint:disable */
import { type NextRequest } from 'next/server';
import { slugify } from '@/app/utilities/common';
import blogData from '@/app/blogs/blogData.json';
import articleData from '@/app/articles/articleData.json';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://neurodiversityacademy.com';
  
  const staticPages = [
    '/',
    '/endorsements',
    '/contact',
    '/about',
    '/neurodivergentmates',
    '/login',
    '/signup',
    '/articles',
    '/blogs',
  ];

  const staticUrls = staticPages.map(page => `${baseUrl}${page}`);

  const articleUrls = articleData.articles.map(article => {
    return `${baseUrl}/articles/article?title=${slugify(article.title)}`;
  });

  const blogUrls = blogData.blogs.map(blog => {
    return `${baseUrl}/blogs/blog?title=${slugify(blog.title)}`;
  });

  const urls = [...staticUrls, ...articleUrls, ...blogUrls];

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
