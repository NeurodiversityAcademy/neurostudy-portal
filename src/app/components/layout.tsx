import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neurodiversity Components',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComponentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
