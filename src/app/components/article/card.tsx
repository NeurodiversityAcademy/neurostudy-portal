'use client';

import React, { Suspense } from 'react';
import Article from './Article';
import articleData from '../../articles/articleData.json';
import styles from './article.module.css';
import { ArticleInterface } from '@/app/interfaces/ArticleInterface';
import { useSearchParams } from 'next/navigation';
import { pickSeeded, slugify } from '@/app/utilities/common';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';

const CardListContent: React.FC = () => {
  const searchParams = useSearchParams();
  const titleSlug = searchParams.get('title');
  const visitedArticleIds = useVisitedItems('article', searchParams);

  const articles: ArticleInterface[] = articleData.articles
    .filter((article) => slugify(article.title) !== titleSlug)
    .filter((article) => !visitedArticleIds.includes(article.id))
    .reverse()
    .slice(0, 3);

  if (articles.length < 3) {
    const needed = 3 - articles.length;
    const articleIdsToShow = articles.map((article) => article.id);

    const fallbackArticles = pickSeeded(
      articleData.articles
        .filter((article) => slugify(article.title) !== titleSlug)
        .filter((article) => !articleIdsToShow.includes(article.id)),
      needed,
      `article-fallback:${titleSlug ?? 'home'}:${visitedArticleIds.join(',')}`,
    );

    articles.push(...fallbackArticles);
  }

  return (
    <div className={styles.cardList}>
      {articles.map((article: ArticleInterface) => (
        <Article key={article.id} {...article} />
      ))}
    </div>
  );
};

const CardList: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <CardListContent />
    </Suspense>
  );
};

export default CardList;
