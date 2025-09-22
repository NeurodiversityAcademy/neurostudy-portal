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
import { createMetadata, slugify } from '@/app/utilities/common';
import VisitTrackerWrapper from '@/app/components/wrapper/VisitTrackerWrapper';

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const titleSlug = searchParams?.title;
  const { articles } = articleData;
  const article = articles.find(({ title }) => slugify(title) === titleSlug);

  if (!article) {
    return {};
  }

  const { title, keywords, imageUrl, description } = article;
  const canonical = `${HOST_URL}/articles/article?articleId=${titleSlug}`;
  const images = [{ url: imageUrl }];
  let metaData = createMetadata(META_KEY.ARTICLE, {
    title,
    keywords,
    description,
    canonical,
    images,
  });

  const linkedInMetadata = {
    ...metaData,
    other: {
      ...metaData,
      'image': imageUrl,
      'author': 'Pratik Bhumkar',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/png',
    }
  };

  return linkedInMetadata as any as Metadata; 
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
