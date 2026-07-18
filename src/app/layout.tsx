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
import TabNavEmbed from './components/tabnav/TabNavEmbed';
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
    HOST_URL.includes('localhost')
      ? 'https://neurodiversityacademy.com'
      : HOST_URL
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={poppins.variable}>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, viewport-fit=cover'
        />
        <meta
          name='google-site-verification'
          content='djfPTzD9D2f3d1fmQBIqJqV_H7SQFbPHimsnYKBI66s'
        />
        <link rel='icon' href='/favicon.ico' sizes='any' />
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
        <TabNavEmbed />
      </body>
    </html>
  );
}
