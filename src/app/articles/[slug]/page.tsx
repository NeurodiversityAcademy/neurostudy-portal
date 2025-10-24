import type { Metadata } from 'next';
import React from 'react';
import TextHeavyArticle from '../../components/textHeavyArticle/TextHeavyArticle';
import styles from '../article.module.css';
import articleData from '../articleData.json';
import ArticleList from '@/app/components/articleList/articleList';
import Typography, {
  TypographyVariant,
} from '../../components/typography/Typography';
import Subscribe from '@/app/components/subscribe/subscribe';
import { HOST_URL, META_KEY } from '@/app/utilities/constants';
import { createMetadata, slugify } from '@/app/utilities/common';
import VisitTrackerWrapper from '@/app/components/wrapper/VisitTrackerWrapper';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
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

export default function OneArticle({ params }: Props) {
  const { slug } = params;
  const { articles } = articleData;
  const article = articles.find((article) => slugify(article.title) === slug);

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
