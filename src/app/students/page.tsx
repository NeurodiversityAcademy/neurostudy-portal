import styles from './page.module.css';
import DisplayPodcast from '../components/podcast/DisplayPodcast';
import { Metadata } from 'next';
import { META_KEY } from '../utilities/constants';
import { createMetadata } from '../utilities/common';
import Subscribe from '../components/subscribe/subscribe';
import ArticleList from '../components/articleList/articleList';
import HomeBanner from '../components/bannerStudents/HomeBanner';
import Fact from '../components/fact/Fact';
import HowItWorks from '../components/howItWorks/HowItWorks';
import isFeatureEnabled from '../utilities/featureToggle';

export const metadata: Metadata = createMetadata(
  META_KEY.NEURODIVERGENT_MATES,
  {
    images: [
      {
        url: 'https://neurostudyportal.s3.ap-southeast-2.amazonaws.com/images/cover.jpg',
      },
    ],
    robots: {
      index: true,
      follow: true,
    },
    title: 'Student Homepage',
    description:
      'Find neuroinclusive courses, supportive institutions, and tools to thrive in academic life',
    keywords: [
      'Neurodiversity Academy',
      'Neurodivergent Mates',
      'Podcast',
      'Neurodiversity',
      'Education',
      'Neurodiverse Individuals',
      'Neurodiversity in vocational education',
      'Student support'
    ],
  }
);

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const showSearchBar = isFeatureEnabled(searchParams, 'searchBar');

  return (
    <main className={styles.main}>
      <HomeBanner
        title='A Home for Neurodivergent Learners'
        subtitle='Find neuroinclusive courses, supportive institutions, and tools to thrive in academic life'
        displayBadges={true}
        showButton={false}
        displayFilter={true}
        showSearchBar={showSearchBar}
      />
      <Fact />
      <HowItWorks />
      <DisplayPodcast
        scriptSrc='https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large'
        containerId='buzzsprout-large-player'
        singleBlog={false}
      />
      <ArticleList />
      <Subscribe />
    </main>
  );
}
