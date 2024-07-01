import styles from './page.module.css';
import DisplayPodcast from './components/podcast/DisplayPodcast';
import Banner from './components/banner/Banner';
import ArticleList from './components/articleList/articleList';
import Teacher from './components/teacherSection/Teacher';
import Fact from './components/fact/Fact';
import HowItWorks from './components/howItWorks/HowItWorks';
import Partner from './components/partnerSection/Partner';
import { Metadata } from 'next';
import { createMetadata } from './utilities/common';
import { META_KEY } from './utilities/constants';
import Subscribe from './components/subscribe/subscribe';
import GoogleAnalytics from './components/googleAnalytics/GoogleAnalytics';

export const metadata: Metadata = createMetadata(META_KEY.HOME);

export default function Home() {
  return (
    <main className={styles.main}>
      <Banner />
      <GoogleAnalytics />
      <Teacher />
      <Partner />
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
