import './globals.css';
import './foundation.css';
import '@/app/styles/utilities.css';
import { Poppins } from 'next/font/google';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { HOST_URL } from './utilities/constants';
import { Metadata } from 'next';
import ToasterWrapper from './components/toaster/ToasterWrapper';
import NextAuthProvider from './utilities/auth/NextAuthProvider';
import MetaPixel from './components/article/MetaPixel';
import DeferredTabNavEmbed from './components/tabnav/DeferredTabNavEmbed';
import DeferredGoogleAnalytics from './components/analytics/DeferredGoogleAnalytics';
import DeferredVercelInsights from './components/analytics/DeferredVercelInsights';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--poppins-font',
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    HOST_URL.includes('localhost') ? 'https://neurodiversityacademy.com' : HOST_URL,
  ),
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
  title: 'Neurodiversity Academy',
  description: 'Neurodiversity in vet',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={poppins.variable}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, viewport-fit=cover' />
        <meta
          name='google-site-verification'
          content='djfPTzD9D2f3d1fmQBIqJqV_H7SQFbPHimsnYKBI66s'
        />
        <link rel='icon' href='/favicon.ico' sizes='any' />
        {/* Hero preloads in document head so LCP paint is not delayed by body parsing. */}
        <link
          rel='preload'
          as='image'
          href='/images/hero-mobile.webp'
          type='image/webp'
          media='(max-width: 768px)'
          // @ts-expect-error fetchPriority is valid on link but missing from React types
          fetchPriority='high'
        />
        <link
          rel='preload'
          as='image'
          href='/images/hero-desktop.webp'
          type='image/webp'
          media='(min-width: 769px)'
          // @ts-expect-error fetchPriority is valid on link but missing from React types
          fetchPriority='high'
        />
        {/* Stable class paints hero immediately before CSS modules hydrate. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
.home-hero-banner{
  background-color:#4a2a8a;
  background-image:url('/images/hero-mobile.webp');
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
  min-height:70vh;
}
@media (min-width:769px){
  .home-hero-banner{background-image:url('/images/hero-desktop.webp')}
}`,
          }}
        />
      </head>
      <body className={poppins.className}>
        <NextAuthProvider>
          <Navbar />
          {children}
        </NextAuthProvider>
        <Footer />
        <ToasterWrapper />
        {process.env.NODE_ENV === 'production' && <MetaPixel />}
        <DeferredGoogleAnalytics
          gaId='G-5YMLVTTK45'
          debugMode={process.env.NODE_ENV !== 'production'}
        />
        <DeferredVercelInsights />
        <DeferredTabNavEmbed />
      </body>
    </html>
  );
}
