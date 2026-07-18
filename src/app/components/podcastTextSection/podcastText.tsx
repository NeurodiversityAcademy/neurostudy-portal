import React from 'react';
import styles from './podcastText.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

export default function PodcastText() {
  return (
    <div className={styles.teacherContainer}>
      <div>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          A LIVE podcast that speaks about topics related to neurodiversity and mental health
        </Typography>
      </div>
      <div className={styles.teacherBodyText}>
        <Typography variant={TypographyVariant.Body1} color='var(--BondBlack)'>
          Neurodivergent Mates is two neurodivergent mates from Australia who get together with
          different members of the community to talk and have in-depth conversations.
        </Typography>
      </div>
    </div>
  );
}
