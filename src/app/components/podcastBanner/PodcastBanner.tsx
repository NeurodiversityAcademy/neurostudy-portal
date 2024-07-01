import React from 'react';
import styles from './PodcastBanner.module.css';
import Banner from '../../images/podcast-banner.jpg';
import Image from 'next/image';

export default function PodcastBanner() {
  return (
    <>
      {/* <div className={styles.bannerContainer}></div> */}
      <div className={styles.imageWrapper}>
        <Image
          src={Banner}
          alt='Neurodiversity and Mental Health Podcast'
          title='Neurodiversity and Mental Health Podcast'
          fill={true}
        />
      </div>
    </>
  );
}
