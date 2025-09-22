import React from 'react';
import TextHeavyArticle from '../../components/textHeavyArticle/TextHeavyArticle';
import styles from './article.module.css'; // Adjust path as needed
import ArticleList from '@/app/components/articleList/articleList';
// import Typography, { TypographyVariant } from '../../components/typography/Typography';
import Subscribe from '@/app/components/subscribe/subscribe';
import VisitTrackerWrapper from '@/app/components/wrapper/VisitTrackerWrapper';

interface Article {
  id: string;
  header: string;
  imageUrl: string;
  bodyText: string;
  authorName: string;
  authorImageUrl?: string;
  title: string;
  description: string;
}

interface ArticleClientComponentProps {
  article: Article;
}

export default function ArticleClientComponent({
  article,
}: ArticleClientComponentProps) {
  const {
    id,
    header,
    imageUrl,
    bodyText,
    authorName,
    authorImageUrl,
    title,
    description,
  } = article;
  return (
    <>
      <head>
        <meta name='image' property='og:image' content={imageUrl}></meta>
        <meta name='title' property='og:title' content={title}></meta>
        <meta
          name='description'
          property='og:description'
          content={description}
        ></meta>
        <meta name='author' content={authorName}></meta>
      </head>
      <div className={styles.container}>
        <VisitTrackerWrapper id={id} type='article' />
        <TextHeavyArticle
          id={id}
          header={header}
          imageUrl={imageUrl}
          bodyText={bodyText}
          authorName={authorName}
          authorImageUrl={authorImageUrl}
        />
        <ArticleList />
        <Subscribe />
      </div>
    </>
  );
}
