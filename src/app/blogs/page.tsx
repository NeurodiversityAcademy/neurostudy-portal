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

export const metadata: Metadata = createMetadata(META_KEY.BLOGS);

const CardList: React.FC = () => {
  const blogs: BlogInterface[] = blogData.blogs;

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
