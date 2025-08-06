import styles from './page.module.css';
import DisplayPodcast from '../components/podcast/DisplayPodcast';
import PodcastBanner from '../components/podcastBanner/PodcastBanner';

import PodcastText from '../components/podcastTextSection/podcastText';
import BlogList from '../components/blogList/blogList';
import { Metadata } from 'next';
import { META_KEY } from '../utilities/constants';
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
    robots: {
      index: true,
      follow: true,
    },
    title: 'Neurodivergent Mates Podcast - Neurodiversity Academy',
    description:
      'Explore the Neurodivergent Mates podcast, where we discuss neurodiversity, education, and the experiences of neurodiverse individuals. Join us for insightful conversations and stories.',
    keywords: [
      'Neurodiversity Academy',
      'Neurodivergent Mates',
      'Podcast',
      'Neurodiversity',
      'Education',
      'Neurodiverse Individuals',
      'Neurodiversity in vocational education',
    ],
  }
);

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className={styles.main}>
      <PodcastBanner />
      <PodcastText />
      <DisplayPodcast
        scriptSrc='https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large'
        containerId='buzzsprout-large-player'
        singleBlog={false}
      />
      <BlogList searchParams={searchParams} />
      <Subscribe />
    </main>
  );
}
