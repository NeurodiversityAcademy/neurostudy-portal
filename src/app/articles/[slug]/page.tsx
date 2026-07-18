import type { Metadata } from 'next';
import React from 'react';
import TextHeavyArticle from '../../components/textHeavyArticle/TextHeavyArticle';
import styles from '../article.module.css';
import articleData from '../articleData.json';
import ArticleList from '@/app/components/articleList/articleList';
import Typography, { TypographyVariant } from '../../components/typography/Typography';
import Subscribe from '@/app/components/subscribe/subscribe';
import { HOST_URL, META_KEY } from '@/app/utilities/constants';
import { createMetadata, slugify } from '@/app/utilities/common';
import VisitTrackerWrapper from '@/app/components/wrapper/VisitTrackerWrapper';
import JsonLd from '@/app/components/seo/JsonLd';
import { buildArticleSchema } from '@/app/components/seo/schemaBuilders';
import { getSiteOrigin } from '@/app/components/seo/siteOrigin';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = articleData;
  const article = articles.find(({ title }) => slugify(title) === slug);

  if (!article) {
    return {};
  }

  const { title, keywords, imageUrl, description, authorName } = article;
  const canonical = `${HOST_URL}/articles/${slug}`;
  const images = [{ url: imageUrl }];

  return createMetadata(META_KEY.ARTICLE, {
    title,
    keywords,
    description,
    canonical,
    images,
    authors: [{ name: authorName }],
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      authors: [authorName!],
    },
  });
}

export default async function OneArticle({ params }: Props) {
  const { slug } = await params;
  const { articles } = articleData;
  const article = articles.find((article) => slugify(article.title) === slug);

  if (!article) {
    return <Typography variant={TypographyVariant.H1}>Article not found</Typography>;
  }

  const { id, header, title, description, imageUrl, bodyText, authorName, authorImageUrl } =
    article;
  const siteOrigin = getSiteOrigin();
  const canonical = `${siteOrigin}/articles/${slug}`;

  return (
    <div className={styles.container}>
      <JsonLd
        data={buildArticleSchema(siteOrigin, {
          headline: header ?? title,
          description,
          url: canonical,
          imageUrl,
          authorName,
        })}
      />
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
