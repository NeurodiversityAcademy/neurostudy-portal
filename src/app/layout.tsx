import './globals.css';
import './foundation.css';
import { Poppins } from 'next/font/google';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['900', '800', '700', '600', '500', '400', '100'],
  style: ['normal'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={poppins.className}>
        <Navbar />
        {children}
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
