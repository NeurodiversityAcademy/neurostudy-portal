import { ENDORSED_LIVE_SLUGS } from '@/app/components/endorsedProviders/endorsedProviderPageData';
import emergingInstitutions from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import { hasEmergingProviderProfile } from '@/app/components/emergingInstitutions/emergingProviderPageData';
import { EMERGING_PROVIDERS_DIRECTORY_PATH } from '@/app/components/emergingInstitutions/emergingProvidersPaths';
import blogData from '@/app/blogs/blogData.json';
import articleData from '@/app/articles/articleData.json';
import courseData from '@/app/courses/courseData.json';
import { slugify } from '@/app/utilities/common';

export const SITEMAP_STATIC_PAGES = [
  '/',
  '/endorsements',
  EMERGING_PROVIDERS_DIRECTORY_PATH,
  '/contact',
  '/about',
  '/neurodivergentmates',
  '/articles',
  '/blogs',
  '/courses',
] as const;

interface BuildSitemapUrlsParams {
  baseUrl: string;
}

export const buildSitemapUrls = ({ baseUrl }: BuildSitemapUrlsParams): string[] => {
  const staticUrls = SITEMAP_STATIC_PAGES.map((page) => `${baseUrl}${page}`);

  const endorsedProviderUrls = ENDORSED_LIVE_SLUGS.map(
    (slug) => `${baseUrl}/endorsedproviders/${slug}`,
  );

  const emergingProviderUrls = emergingInstitutions
    .filter((institution) => {
      if ('demo' in institution && institution.demo === true) {
        return false;
      }
      return hasEmergingProviderProfile(slugify(institution.name));
    })
    .map(
      (institution) =>
        `${baseUrl}${EMERGING_PROVIDERS_DIRECTORY_PATH}/${slugify(institution.name)}`,
    );

  const courseUrls = courseData.courses
    .filter((course) => course.CourseId)
    .map((course) => `${baseUrl}/courses/${course.CourseId}`);

  const articleUrls = articleData.articles.map(
    (article) => `${baseUrl}/articles/${slugify(article.title)}`,
  );

  const blogUrls = blogData.blogs.map((blog) => `${baseUrl}/blogs/${slugify(blog.title)}`);

  return [
    ...staticUrls,
    ...endorsedProviderUrls,
    ...emergingProviderUrls,
    ...courseUrls,
    ...articleUrls,
    ...blogUrls,
  ];
};

export const buildSitemapXml = (urls: string[], lastmod: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url}</loc>
  <lastmod>${lastmod}</lastmod>
</url>`,
  )
  .join('\n')}
</urlset>`;
};
