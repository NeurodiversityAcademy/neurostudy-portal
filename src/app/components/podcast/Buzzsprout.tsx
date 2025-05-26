'use client';
import React, { useEffect } from 'react';
import styles from './podcast.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

export interface BuzzsproutEmbedProps {
  scriptSrc: string;
  containerId: string;
  singleBlog: boolean;
}

const BuzzsproutEmbed: React.FC<BuzzsproutEmbedProps> = ({
  scriptSrc,
  containerId,
  singleBlog,
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.type = 'text/javascript';

    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(script);
    }
  }, [scriptSrc, containerId]);

  return (
    <div className={styles.podcastContainer}>
      <div className={styles.podcastHeader}>
        {!singleBlog ? (
          <Typography variant={TypographyVariant.H2}>
            Explore more of our Podcast
          </Typography>
        ) : (
          <Typography variant={TypographyVariant.H2}>
            Listen to Our Podcast
          </Typography>
        )}
      </div>
      <div id={containerId}></div>
    </div>
  );
};

export default BuzzsproutEmbed;
