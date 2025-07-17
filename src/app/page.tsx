import styles from './page.module.css';
import DisplayPodcast from './components/podcast/DisplayPodcast';
import Script from 'next/script';
import ArticleList from './components/articleList/articleList';
import Teacher from './components/teacherSection/Teacher';
import Fact from './components/fact/Fact';
import HowItWorks from './components/howItWorks/HowItWorks';
import Partner from './components/partnerSection/Partner';
import { Metadata } from 'next';
import { createMetadata } from './utilities/common';
import { META_KEY } from './utilities/constants';
import Subscribe from './components/subscribe/subscribe';
import Handbook from './components/handbook';
import HomeBanner from './components/banner/HomeBanner';
import { Suspense } from 'react';

const getGoogleAnalyticsScript = () => {
  return (
    <>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-5YMLVTTK45' />
      <Script id='google-analytics'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-5YMLVTTK45');
        `}
      </Script>
    </>
  );
};

export const metadata: Metadata = createMetadata(META_KEY.HOME, {
  images: [
    {
      url: 'https://neurostudyportal.s3.ap-southeast-2.amazonaws.com/images/cover.jpg',
      width: 1200,
      height: 630,
      alt: 'Neurodiversity Academy Homepage',
    },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  title: 'Neurodiversity Academy - Inclusive Education Platform',
  description:
    'Leading platform for neurodiversity education in veterinary studies. Access courses, resources, and support for neurodiverse students.',
  openGraph: {
    title: 'Neurodiversity Academy - Inclusive Education Platform',
    description:
      'Leading platform for neurodiversity education in veterinary studies.',
    type: 'website',
    url: 'https://neurodiversityacademy.com',
  },
});

export default async function Home() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <main className={styles.main}>
        {process.env.NODE_ENV === 'production' && getGoogleAnalyticsScript()}
        <HomeBanner displayBadges={true} showButton={true} />
        <Teacher />
        <Handbook />
        <Fact />
        <HowItWorks />
        <Partner />
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
