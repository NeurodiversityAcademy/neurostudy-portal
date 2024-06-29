import './globals.css';
import './foundation.css';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import ConfigureAmplifyClientSide from './utilities/amplify/configureClientSide';
import UserSession from './utilities/amplify/session';
import { HOST_URL } from './utilities/constants';
import { Metadata } from 'next';
import ToasterWrapper from './components/toaster/ToasterWrapper';
import { poppins } from './components/typography/Typography';
import ReduxProvider from './redux/provider';
import { AuthUser } from 'aws-amplify/auth';
import { getCurrentUserServer } from './utilities/amplify/configureServerSide';

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
        <ReduxProvider>
          <UserSession user={user} />
          <ConfigureAmplifyClientSide />
          <Navbar />
          {children}
          <Footer />
          <SpeedInsights />
          <Analytics />
          <ToasterWrapper />
        </ReduxProvider>
      </body>
    </html>
  );
}
