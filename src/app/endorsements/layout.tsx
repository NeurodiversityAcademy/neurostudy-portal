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
  title: 'Endorsements - Neurodiversity Academy',
  description:
    'Endorsement ensures that learning organisations meet the\
              Neurodiversity Academy/’s (NDA) neuro-inclusion standards. Only\
              endorsed providers are eligible to appear on our platform, giving\
              students confidence that these organisations are prepared to\
              support neurodivergent learners effectively.',
  keywords: [
    'neurodiverse',
    'neurodiverse meaning',
    'Neurodiversity Academy',
    // ...rest of your keywords...
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
