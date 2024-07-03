import React from 'react';
import Article from '../components/article/Article';
import articleData from './articleData.json';
import styles from './articles.module.css';
import { ArticleInterface } from '@/app/interfaces/ArticleInterface';
import Typography, {
  TypographyVariant,
} from '../components/typography/Typography';
import { Metadata } from 'next';
import { META_KEY } from '../utilities/constants';
import { createMetadata } from '../utilities/common';

export const metadata: Metadata = createMetadata(META_KEY.ARTICLES);

const CardList: React.FC = () => {
  const articles: ArticleInterface[] = articleData.articles;

  return (
    <div className={styles.container}>
      <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
        Explore Neurodiversity Academy
      </Typography>
      <div className={styles.cardList}>
        {articles.map((article: ArticleInterface) => (
          <Article key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
