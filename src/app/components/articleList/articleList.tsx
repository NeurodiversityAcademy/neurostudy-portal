'use client';
import CardList from '../article/card';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './articleList.module.css';
import ExploreMore from '../exploreMore/ExploreMore';

export default function ArticleList() {
  return (
    <div className={styles.blogsContainer}>
      <div>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Explore Neurodiversity Academy
        </Typography>
      </div>
      <CardList />
      <ExploreMore dest={'/articles'} />
    </div>
  );
}
