import styles from './page.module.css';
import DisplayPodcast from './components/podcast/DisplayPodcast';
import { Metadata } from 'next';
import { createMetadata } from './utilities/common';
import { META_KEY } from './utilities/constants';
import Subscribe from './components/subscribe/subscribe';
import HomeBanner from './components/banner/HomeBanner';
import { Suspense } from 'react';
import HowItWorks from './components/howItWorks/HowItWorks';
import StudentFacts from './components/studentFacts/StudentFacts';
import isFeatureEnabled from './utilities/featureToggle';
import ArticleList from './components/articleList/articleList';
import EmergingInstitutions from './components/emergingInstitutions/EmergingInstitutions';

export const metadata: Metadata = createMetadata(META_KEY.HOME, {
  images: [
    {
      url: 'https://neurostudyportal.s3.ap-southeast-2.amazonaws.com/images/cover.jpg',
      width: 1200,
      height: 630,
      alt: 'Neurodiversity Academy - Neurodiversity in Vocational Education',
    },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  title: 'Homepage',
  description:
    'Leading platform for neurodiversity in vocational education. Learn what neurodivergent means, access endorsements, and connect with neurodivergent mates.',
  openGraph: {
    title: 'Neurodiversity Academy - Neurodiversity in Vocational Education',
    description:
      'Explore neurodiversity meaning, access endorsements, articles.',
    type: 'website',
    url: 'https://neurodiversityacademy.com',
    siteName: 'Neurodiversity Academy',
    images: [
      {
        url: 'https://neurostudyportal.s3.ap-southeast-2.amazonaws.com/images/cover.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
});
export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const showSearchBar = isFeatureEnabled(searchParams, 'searchBar');
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <main className={styles.main}>
        <HomeBanner
          title='A Home for Neurodivergent Learners'
          subtitle='Find neuroinclusive courses, supportive institutions, and tools to thrive in academic life'
          displayBadges={true}
          showButton={false}
          displayFilter={true}
          showSearchBar={showSearchBar}
        />
        <EmergingInstitutions />
        <StudentFacts />
        <HowItWorks />
        <DisplayPodcast
          scriptSrc='https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large'
          containerId='buzzsprout-large-player'
          singleBlog={false}
        />
        <ArticleList />
        <Subscribe />
      </main>
    </Suspense>
  );
}
