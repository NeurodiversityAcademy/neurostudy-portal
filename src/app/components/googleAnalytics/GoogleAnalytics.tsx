import React from 'react';
import Script from 'next/script';

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

const GoogleAnalytics = () => {
  return (
    <>{process.env.NODE_ENV === 'production' && getGoogleAnalyticsScript()}</>
  );
};

export default GoogleAnalytics;
