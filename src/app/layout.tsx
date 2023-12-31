import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['900', '800', '700', '600', '500', '100'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Neurodiversity Academy',
  description: 'Neurostudy Neurodiversity Academy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
