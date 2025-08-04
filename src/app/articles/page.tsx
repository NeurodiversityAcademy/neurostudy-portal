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

export const metadata: Metadata = {
  ...createMetadata(META_KEY.ARTICLES),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  title: 'Articles - Neurodiversity Academy',
  description: 'Explore articles on neurodiversity, education',
  keywords: [
    'Neurodiversity Academy',
    'Articles',
    'Neurodiversity',
    'Education',
    'Neurodiverse Individuals',
    'Neurodiversity in vocational education',
  ],
};

const CardList: React.FC = () => {
  const articles: ArticleInterface[] = articleData.articles.slice().reverse();

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
