'use client';
import styles from './page.module.css';
import CardList from './components/article/card';
import DisplayPodcast from './components/podcast/DisplayPodcast';
import Script from 'next/script';
import Hero from './components/hero/Hero';

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

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      {getGoogleAnalyticsScript()}
      <div>
        <DisplayPodcast />
        <CardList />
      </div>
    </main>
  );
}
