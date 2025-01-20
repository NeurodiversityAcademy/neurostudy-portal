import './globals.css';
import './foundation.css';
import '@/app/styles/utilities.css';
import { Poppins } from 'next/font/google';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { HOST_URL } from './utilities/constants';
import { Metadata } from 'next';
import ToasterWrapper from './components/toaster/ToasterWrapper';
import NextAuthProvider from './utilities/auth/NextAuthProvider';
import MetaPixel from './components/article/MetaPixel';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['900', '800', '700', '600', '500', '400', '100'],
  style: ['normal'],
  variable: '--poppins-font',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    HOST_URL.includes('localhost')
      ? 'https://neurodiversityacademy.com'
      : HOST_URL
  ),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={poppins.variable}>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={poppins.className}>
        {process.env.NODE_ENV === 'production' && <MetaPixel />}
        <NextAuthProvider>
          <Navbar />
          {children}
          <Footer />
          <SpeedInsights />
          <Analytics />
          <ToasterWrapper />
        </NextAuthProvider>
      </body>
    </html>
  );
}
