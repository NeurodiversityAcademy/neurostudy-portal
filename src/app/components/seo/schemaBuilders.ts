import { SITE_NAME } from '@/app/utilities/constants';
import type { EndorsedFaqSection } from '@/app/components/endorsedProviders/endorsedProviderPageData';

const SCHEMA_CONTEXT = 'https://schema.org';

export interface ArticleSchemaParams {
  headline: string;
  description: string;
  url: string;
  imageUrl?: string;
  authorName?: string;
}

export interface BlogPostingSchemaParams extends ArticleSchemaParams {}

export interface EducationalOrganizationSchemaParams {
  name: string;
  url: string;
}

export interface FaqPageSchemaParams {
  pageUrl: string;
  sections: EndorsedFaqSection[];
}

export function organizationIdForOrigin(origin: string): string {
  return `${origin}/#organization`;
}

export function websiteIdForOrigin(origin: string): string {
  return `${origin}/#website`;
}

export function buildSiteGraphSchema(origin: string): Record<string, unknown> {
  const organizationId = organizationIdForOrigin(origin);
  const websiteId = websiteIdForOrigin(origin);

  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: SITE_NAME,
        url: origin,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: origin,
        name: SITE_NAME,
        publisher: { '@id': organizationId },
      },
    ],
  };
}

function buildPublisher(origin: string): Record<string, unknown> {
  return { '@id': organizationIdForOrigin(origin) };
}

function buildArticleLikeSchema(
  type: 'Article' | 'BlogPosting',
  origin: string,
  params: ArticleSchemaParams,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': SCHEMA_CONTEXT,
    '@type': type,
    headline: params.headline,
    description: params.description,
    url: params.url,
    mainEntityOfPage: params.url,
    publisher: buildPublisher(origin),
  };

  if (params.imageUrl) {
    schema.image = params.imageUrl;
  }

  if (params.authorName) {
    schema.author = {
      '@type': 'Person',
      name: params.authorName,
    };
  }

  return schema;
}

export function buildArticleSchema(
  origin: string,
  params: ArticleSchemaParams,
): Record<string, unknown> {
  return buildArticleLikeSchema('Article', origin, params);
}

export function buildBlogPostingSchema(
  origin: string,
  params: BlogPostingSchemaParams,
): Record<string, unknown> {
  return buildArticleLikeSchema('BlogPosting', origin, params);
}

export function buildEducationalOrganizationSchema(
  params: EducationalOrganizationSchemaParams,
): Record<string, unknown> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'EducationalOrganization',
    name: params.name,
    url: params.url,
  };
}

export function buildFaqPageSchema(params: FaqPageSchemaParams): Record<string, unknown> {
  const mainEntity = params.sections.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  );

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntityOfPage: params.pageUrl,
    mainEntity,
  };
}
