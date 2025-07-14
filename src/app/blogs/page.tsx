import React from 'react';
import blogData from './blogData.json';
import styles from './blogs.module.css';
import Typography, {
  TypographyVariant,
} from '../components/typography/Typography';
import { BlogInterface } from '../interfaces/BlogInterface';
import Blog from '../components/blog/Blog';
import { Metadata } from 'next';
import { META_KEY } from '../utilities/constants';
import { createMetadata } from '../utilities/common';

export const metadata: Metadata = {
  ...createMetadata(META_KEY.BLOGS),
  robots: {
    index: true,
    follow: true,
  },
  title: 'Articles - Neurodiversity Academy',
  description: 'Explore articles on neurodiversity, education',
  keywords: [
    'Neurodiversity Academy',
    'Blogs',
    'Neurodiversity',
    'Education',
    'Neurodiverse Individuals',
    'Neurodivergent Mates',
    'Neurodiversity in vocational education',
  ],
};

const CardList: React.FC = () => {
  const blogs: BlogInterface[] = blogData.blogs.slice().reverse();

  return (
    <div className={styles.container}>
      <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
        Explore Neurodivergent Mates
      </Typography>
      <div className={styles.cardList}>
        {blogs.map((blog: BlogInterface) => (
          <Blog key={blog.id} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
