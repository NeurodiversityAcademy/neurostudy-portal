import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './blogList.module.css';
import ExploreMore from '../exploreMore/ExploreMore';
import BlogCardListWrapper from '../wrapper/BlogCardListWrapper';

export default function BlogList() {
  return (
    <div className={styles.blogsContainer}>
      <div>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Explore Neurodivergent Mates
        </Typography>
      </div>
      <BlogCardListWrapper />
      <ExploreMore dest={'/blogs'} />
    </div>
  );
}
