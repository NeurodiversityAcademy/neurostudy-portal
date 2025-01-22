import styles from './page.module.css';
import DisplayPodcast from '../components/podcast/DisplayPodcast';
import PodcastBanner from '../components/podcastBanner/PodcastBanner';

import PodcastText from '../components/podcastTextSection/podcastText';
import BlogList from '../components/blogList/blogList';
import { Metadata } from 'next';
import {
  BUZZSPROUT_CONTAINER_ID,
  META_KEY,
  PODCAST_LINK,
} from '../utilities/constants';
import { createMetadata } from '../utilities/common';
import Subscribe from '../components/subscribe/subscribe';

export const metadata: Metadata = createMetadata(
  META_KEY.NEURODIVERGENT_MATES,
  {
    images: [
      {
        url: 'https://neurostudyportal.s3.ap-southeast-2.amazonaws.com/images/podcast-banner.jpg',
      },
    ],
  }
);

export default function Home() {
  return (
    <main className={styles.main}>
      <PodcastBanner />
      <PodcastText />
      <DisplayPodcast
        scriptSrc={PODCAST_LINK}
        containerId={BUZZSPROUT_CONTAINER_ID}
        singleBlog={false}
      />
      <BlogList />
      <Subscribe />
    </main>
  );
}
