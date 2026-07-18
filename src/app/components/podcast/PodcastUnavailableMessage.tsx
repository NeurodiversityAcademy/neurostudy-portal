import React from 'react';
import Link from 'next/link';
import Typography, { TypographyVariant } from '../typography/Typography';
import { BUZZSPROUT_SHOW_URL, NEURODIVERGENT_MATES_PATH } from '@/app/utilities/buzzsproutFeed';
import styles from './podcast.module.css';

interface PodcastUnavailableMessageProps {
  singleBlog: boolean;
}

const PodcastUnavailableMessage: React.FC<PodcastUnavailableMessageProps> = ({ singleBlog }) => {
  const message = singleBlog
    ? 'This episode is temporarily unavailable. Visit our podcast page for the latest episodes.'
    : 'Our podcast episodes are temporarily unavailable. New episodes will appear here once they are published.';

  return (
    <div className={styles.podcastContainer}>
      <div className={styles.podcastHeader}>
        <Typography variant={TypographyVariant.H2}>
          {singleBlog ? 'Listen to our Podcast' : 'Explore more of our Podcast'}
        </Typography>
      </div>
      <div className={styles.fallbackContent} role='status'>
        <Typography variant={TypographyVariant.Body1}>{message}</Typography>
        <div className={styles.fallbackLinks}>
          <Link href={NEURODIVERGENT_MATES_PATH} className={styles.fallbackLink}>
            Neurodivergent Mates page
          </Link>
          <a
            href={BUZZSPROUT_SHOW_URL}
            className={styles.fallbackLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            View on Buzzsprout
          </a>
        </div>
      </div>
    </div>
  );
};

export default PodcastUnavailableMessage;
