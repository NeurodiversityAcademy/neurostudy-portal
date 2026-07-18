import {
  buildArticleSchema,
  buildBlogPostingSchema,
  buildEducationalOrganizationSchema,
  buildFaqPageSchema,
  buildSiteGraphSchema,
  organizationIdForOrigin,
  websiteIdForOrigin,
} from '../schemaBuilders';

const ORIGIN = 'https://neurodiversityacademy.com';

describe('buildSiteGraphSchema', () => {
  it('returns Organization and WebSite linked by @id', () => {
    const schema = buildSiteGraphSchema(ORIGIN);
    const graph = schema['@graph'] as Record<string, unknown>[];

    expect(schema['@context']).toBe('https://schema.org');
    expect(graph).toHaveLength(2);

    const organization = graph[0] as Record<string, unknown>;
    const website = graph[1] as Record<string, unknown>;

    expect(organization['@type']).toBe('Organization');
    expect(organization['@id']).toBe(organizationIdForOrigin(ORIGIN));
    expect(organization.name).toBe('Neurodiversity Academy');

    expect(website['@type']).toBe('WebSite');
    expect(website['@id']).toBe(websiteIdForOrigin(ORIGIN));
    expect(website.publisher).toEqual({ '@id': organizationIdForOrigin(ORIGIN) });
  });
});

describe('buildArticleSchema', () => {
  it('includes headline, publisher, and optional author and image', () => {
    const schema = buildArticleSchema(ORIGIN, {
      headline: 'Test headline',
      description: 'Test description',
      url: `${ORIGIN}/articles/test`,
      imageUrl: `${ORIGIN}/image.jpg`,
      authorName: 'Jane Doe',
    });

    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Test headline');
    expect(schema.image).toBe(`${ORIGIN}/image.jpg`);
    expect(schema.author).toEqual({ '@type': 'Person', name: 'Jane Doe' });
    expect(schema.publisher).toEqual({ '@id': organizationIdForOrigin(ORIGIN) });
  });
});

describe('buildBlogPostingSchema', () => {
  it('uses BlogPosting type', () => {
    const schema = buildBlogPostingSchema(ORIGIN, {
      headline: 'Blog headline',
      description: 'Blog description',
      url: `${ORIGIN}/blogs/test`,
    });

    expect(schema['@type']).toBe('BlogPosting');
  });
});

describe('buildEducationalOrganizationSchema', () => {
  it('returns thin EducationalOrganization payload', () => {
    const schema = buildEducationalOrganizationSchema({
      name: 'Health Science Hub',
      url: `${ORIGIN}/endorsedproviders/hsh`,
    });

    expect(schema['@type']).toBe('EducationalOrganization');
    expect(schema.name).toBe('Health Science Hub');
    expect(schema.url).toBe(`${ORIGIN}/endorsedproviders/hsh`);
  });
});

describe('buildFaqPageSchema', () => {
  it('flattens FAQ sections into Question entities', () => {
    const schema = buildFaqPageSchema({
      pageUrl: `${ORIGIN}/endorsedproviders/hsh`,
      sections: [
        {
          sectionTitle: 'About',
          items: [
            { question: 'Q1?', answer: 'A1.' },
            { question: 'Q2?', answer: 'A2.' },
          ],
        },
      ],
    });

    const mainEntity = schema.mainEntity as Record<string, unknown>[];
    expect(schema['@type']).toBe('FAQPage');
    expect(mainEntity).toHaveLength(2);
    expect(mainEntity[0]?.name).toBe('Q1?');
    expect(mainEntity[0]?.acceptedAnswer).toEqual({ '@type': 'Answer', text: 'A1.' });
  });
});
