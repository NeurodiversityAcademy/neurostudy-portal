import React from 'react';
import Article from './Article';
import articleData from '../../articles/articleData.json';
import styles from './article.module.css';
import { ArticleInterface } from '@/app/interfaces/ArticleInterface';
import { useSearchParams } from 'next/navigation';
import { slugify } from '@/app/utilities/common';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';

const CardList: React.FC = () => {
  const searchParams = useSearchParams();
  const titleSlug = searchParams.get('title');
  const visitedArticleIds = useVisitedItems('article', searchParams);

  const articles: ArticleInterface[] = articleData.articles
    .filter((article) => slugify(article.title) !== titleSlug) // Filter out current article
    .filter((article) => !visitedArticleIds.includes(article.id)) // Filter out visited articles
    .reverse()
    .slice(0, 3);

  if (articles.length < 3) {
    const needed = 3 - articles.length;
    const articleIdsToShow = articles.map((article) => article.id);

    const fallbackArticles = shuffleArray(
      articleData.articles
        .filter((article) => slugify(article.title) !== titleSlug) // Exclude current
        .filter((article) => !articleIdsToShow.includes(article.id)) // Exclude already selected
    ).slice(0, needed);
      .slice(0, needed);

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

export default CardList;
