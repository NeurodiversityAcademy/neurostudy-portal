'use client';
import BlogCardList from '../blog/BlogCardList';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './blogList.module.css';
import ExploreMore from '../exploreMore/ExploreMore';

export default function BlogList() {
  return (
    <div className={styles.blogsContainer}>
      <div>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Explore Neurodivergent Mates
        </Typography>
      </div>
      <BlogCardList />
      <ExploreMore dest={'/blogs'} />
    </div>
  );
}
