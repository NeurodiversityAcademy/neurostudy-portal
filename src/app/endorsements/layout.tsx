import { Metadata } from 'next';
import { createMetadata } from '../utilities/common';
import { META_KEY } from '../utilities/constants';

export const metadata: Metadata = {
  ...createMetadata(META_KEY.ENDORSEMENTS),
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
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
