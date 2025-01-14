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
import CourseEnrolPrompt from './components/course/CourseEnrolPrompt';
import Handbook from './components/handbook';
import * as fbq from '../app/utilities/metapixel/fpixel';

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

const getMetaPixelScript = () => {
  return (
    <>
      <Script
        id='fb-pixel'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
        }}
      />
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
  // const router = useRouter();
  // useEffect(() => {
  //   // This pageview only triggers the first time (it's important for Pixel to have real information)
  //   fbq.pageview();

  //   const handleRouteChange = () => {
  //     fbq.pageview();
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);
  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router.events]);
  return (
    <>
      <main className={styles.main}>
        {process.env.NODE_ENV === 'production' && getGoogleAnalyticsScript()}
        {process.env.NODE_ENV === 'production' && getMetaPixelScript()}
        <CourseEnrolPrompt />
        <Handbook />
        <Teacher />
        <Partner />
        <Fact />
        <HowItWorks></HowItWorks>
        <DisplayPodcast
          scriptSrc='https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large'
          containerId='buzzsprout-large-player'
          singleBlog={false}
        />
        <ArticleList />
        <Subscribe />
      </main>
    </>
  );
}
