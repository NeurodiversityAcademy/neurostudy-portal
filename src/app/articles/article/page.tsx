import type { Metadata } from 'next';
import React from 'react';
import TextHeavyArticle from '../../components/textHeavyArticle/TextHeavyArticle';
import styles from './article.module.css';
import articleData from '../articleData.json';
import ArticleList from '@/app/components/articleList/articleList';
import Typography, {
  TypographyVariant,
} from '../../components/typography/Typography';
import Subscribe from '@/app/components/subscribe/subscribe';
import { MetadataProps } from '@/app/interfaces/MetadataProps';
import { HOST_URL, META_KEY } from '@/app/utilities/constants';
import { slugify } from '@/app/utilities/common';
import VisitTrackerWrapper from '@/app/components/wrapper/VisitTrackerWrapper';

interface CreateMetadataOptions {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  images: { url: string }[];
}

function createLinkedInCompatibleMetadata(
  metaKey: string,
  options: CreateMetadataOptions
): Metadata {
  const { title, description, keywords, canonical, images } = options;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      images,
      type: 'article',
      siteName: 'Neurodiversity Academy',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
    alternates: {
      canonical,
    },
    // Custom head injection for LinkedIn
    other: {
      // Custom script to inject LinkedIn-compatible meta tags
      'linkedin-meta-injection': `
        <script>
          (function() {
            if (typeof document !== 'undefined') {
              const metaTags = [
                { name: 'image', property: 'og:image', content: '${images[0]?.url}' },
                { name: 'title', property: 'og:title', content: '${title.replace(/'/g, "\\'")}' },
                { name: 'description', property: 'og:description', content: '${description.replace(/'/g, "\\'")}' },
                { name: 'url', property: 'og:url', content: '${canonical}' }
              ];
              
              metaTags.forEach(({name, property, content}) => {
                const existing = document.querySelector(\`meta[name="\${name}"][property="\${property}"]\`);
                if (!existing && content) {
                  const meta = document.createElement('meta');
                  meta.setAttribute('name', name);
                  meta.setAttribute('property', property);
                  meta.setAttribute('content', content);
                  document.head.appendChild(meta);
                }
              });
            }
          })();
        </script>
      `,
    },
  };
}

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const titleSlug = searchParams?.title;
  const { articles } = articleData;
  const article = articles.find(({ title }) => slugify(title) === titleSlug);

  if (!article) {
    return {};
  }

  const { title, keywords, description, imageUrl } = article;
  const canonical = `${HOST_URL}/articles/article?articleId=${titleSlug}`;
  const images = [{ url: imageUrl }];

  return createLinkedInCompatibleMetadata(META_KEY.ARTICLE, {
    title,
    keywords,
    description,
    canonical,
    images,
  });
}

export default function OneArticle({ searchParams }: MetadataProps) {
  const titleSlug = searchParams?.title;
  const { articles } = articleData;
  const article = articles.find(
    (article) => slugify(article.title) === titleSlug
  );

  if (!article) {
    return (
      <Typography variant={TypographyVariant.H1}>Article not found</Typography>
    );
  }

  const { id, header, imageUrl, bodyText, authorName, authorImageUrl } =
    article;

  return (
    <div className={styles.container}>
      <VisitTrackerWrapper id={id} type='article' />
      <TextHeavyArticle
        id={id}
        header={header}
        imageUrl={imageUrl}
        bodyText={bodyText}
        authorName={authorName}
        authorImageUrl={authorImageUrl}
      />{' '}
      <ArticleList />
      <Subscribe />
    </div>
  );
}
