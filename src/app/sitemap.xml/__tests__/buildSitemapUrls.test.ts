import { ENDORSED_LIVE_SLUGS } from '@/app/components/endorsedProviders/endorsedProviderPageData';
import emergingInstitutions from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import blogData from '@/app/blogs/blogData.json';
import articleData from '@/app/articles/articleData.json';
import courseData from '@/app/courses/courseData.json';
import { slugify } from '@/app/utilities/common';
import {
  buildSitemapUrls,
  buildSitemapXml,
  SITEMAP_STATIC_PAGES,
} from '../buildSitemapUrls';

const BASE_URL = 'https://neurodiversityacademy.com';

describe('buildSitemapUrls', () => {
  it('includes marketing static pages and excludes auth routes', () => {
    const urls = buildSitemapUrls({ baseUrl: BASE_URL });

    SITEMAP_STATIC_PAGES.forEach((page) => {
      expect(urls).toContain(`${BASE_URL}${page}`);
    });

    expect(urls).not.toContain(`${BASE_URL}/login`);
    expect(urls).not.toContain(`${BASE_URL}/signup`);
  });

  it('includes live endorsed provider detail pages', () => {
    const urls = buildSitemapUrls({ baseUrl: BASE_URL });

    ENDORSED_LIVE_SLUGS.forEach((slug) => {
      expect(urls).toContain(`${BASE_URL}/endorsedproviders/${slug}`);
    });
  });

  it('includes emerging provider detail pages', () => {
    const urls = buildSitemapUrls({ baseUrl: BASE_URL });

    emergingInstitutions.forEach((institution) => {
      expect(urls).toContain(`${BASE_URL}/emergingproviders/${slugify(institution.name)}`);
    });
  });

  it('includes course listing and course detail pages from local data', () => {
    const urls = buildSitemapUrls({ baseUrl: BASE_URL });

    expect(urls).toContain(`${BASE_URL}/courses`);

    courseData.courses
      .filter((course) => course.CourseId)
      .forEach((course) => {
        expect(urls).toContain(`${BASE_URL}/courses/${course.CourseId}`);
      });
  });

  it('includes article and blog detail pages', () => {
    const urls = buildSitemapUrls({ baseUrl: BASE_URL });

    articleData.articles.forEach((article) => {
      expect(urls).toContain(`${BASE_URL}/articles/${slugify(article.title)}`);
    });

    blogData.blogs.forEach((blog) => {
      expect(urls).toContain(`${BASE_URL}/blogs/${slugify(blog.title)}`);
    });
  });
});

describe('buildSitemapXml', () => {
  it('returns valid sitemap XML with lastmod entries', () => {
    const lastmod = '2026-07-19T00:00:00.000Z';
    const xml = buildSitemapXml([`${BASE_URL}/courses`], lastmod);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain(`<loc>${BASE_URL}/courses</loc>`);
    expect(xml).toContain(`<lastmod>${lastmod}</lastmod>`);
  });
});
