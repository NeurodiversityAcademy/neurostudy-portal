import './globals.css';
import './foundation.css';
import { Poppins } from 'next/font/google';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import ConfigureAmplifyClientSide from './utilities/amplify/configureClientSide';
import { getCurrentUserServer } from './utilities/amplify/configureServerSide';
import RootProvider from './root-provider';
import { AuthUser } from 'aws-amplify/auth';
import { HOST_URL } from './utilities/constants';
import { Metadata } from 'next';
import ToasterWrapper from './components/toaster/ToasterWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['900', '800', '700', '600', '500', '400', '100'],
  style: ['normal'],
});

export const metadata: Metadata = {
  metadataBase: new URL(HOST_URL),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: AuthUser | undefined = await getCurrentUserServer();

  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={poppins.className}>
        <ConfigureAmplifyClientSide />
        <RootProvider user={user}>
          <Navbar />
          {children}
          <Footer />
          <SpeedInsights />
          <Analytics />
          <ToasterWrapper />
        </RootProvider>
      </body>
    </html>
  );
}
