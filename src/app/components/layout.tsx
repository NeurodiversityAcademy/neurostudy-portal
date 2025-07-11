import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neurodiversity Components',
  robots: {
    index: true,
    follow: true,
  },
};

export default function ComponentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
