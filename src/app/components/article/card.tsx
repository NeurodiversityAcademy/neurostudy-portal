import React from 'react';
import Article from './Article';
import articleData from '../../articles/articleData.json';
import styles from './article.module.css';
import { ArticleInterface } from '@/app/interfaces/ArticleInterface';
import { useSearchParams } from 'next/navigation';
import { slugify } from '@/app/utilities/common';

const CardList: React.FC = () => {
  const searchParams = useSearchParams();
  const titleSlug = searchParams.get('title');

  const articles: ArticleInterface[] = articleData.articles
    .filter((article) => slugify(article.title) != titleSlug)
    .reverse()
    .slice(0, 3);

  return (
    <div className={styles.cardList}>
      {articles.map((article: ArticleInterface) => (
        <Article key={article.id} {...article} />
      ))}
    </div>
  );
};

export default CardList;
