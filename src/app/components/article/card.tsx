import React from 'react';
import Article from './Article';
import articleData from '../../articles/articleData.json';
import styles from './article.module.css';
import { ArticleInterface } from '@/app/interfaces/ArticleInterface';
import { useSearchParams } from 'next/navigation';

const CardList: React.FC = () => {
  const searchParams = useSearchParams();
  const blogId = searchParams.get('articleId');

  const articles: ArticleInterface[] = articleData.articles
    .filter((article) => article.id != blogId)
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
