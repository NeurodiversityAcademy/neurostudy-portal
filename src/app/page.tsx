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
import {
  BUZZSPROUT_CONTAINER_ID,
  META_KEY,
  PODCAST_LINK,
} from './utilities/constants';
import Subscribe from './components/subscribe/subscribe';
import CourseEnrolPrompt from './components/course/CourseEnrolPrompt';
import Handbook from './components/handbook';

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
    },
  ],
});

export default async function Home() {
  return (
    <>
      <main className={styles.main}>
        {process.env.NODE_ENV === 'production' && getGoogleAnalyticsScript()}
        <CourseEnrolPrompt />
        <Handbook />
        <Teacher />
        <Partner />
        <Fact />
        <HowItWorks />
        <DisplayPodcast
          scriptSrc={PODCAST_LINK}
          containerId={BUZZSPROUT_CONTAINER_ID}
          singleBlog={false}
        />
        <ArticleList />
        <Subscribe />
      </main>
    </>
  );
}
