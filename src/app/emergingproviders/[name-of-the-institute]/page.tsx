import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import EmergingProviderHero from '@/app/components/emergingInstitutions/EmergingProviderHero';
import EmergingProviderStudentSuitability from '@/app/components/emergingInstitutions/EmergingProviderStudentSuitability';
import EmergingProviderStats from '@/app/components/emergingInstitutions/EmergingProviderStats';
import EmergingProvidersFAQs from '@/app/components/emergingInstitutions/EmergingProvidersFAQs';
import {
  buildEmergingProviderMetadata,
  resolveEmergingProviderForSlug,
} from '@/app/emergingproviders/emergingProviderMetadata';
import pageStyles from './emergingProviderPage.module.css';

type RouteParams = {
  'name-of-the-institute': string;
};

interface PageProps {
  params: Promise<RouteParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return buildEmergingProviderMetadata(resolvedParams['name-of-the-institute']);
}

export default async function EmergingProviderPage({ params }: PageProps) {
  const resolvedParams = await params;
  const provider = resolveEmergingProviderForSlug(resolvedParams['name-of-the-institute']);

  if (!provider) {
    notFound();
  }

  return (
    <main className={pageStyles.pageMain}>
      <EmergingProviderHero title={provider.name} heroInfoItems={provider.heroInfoItems} />
      <EmergingProviderStudentSuitability instituteSlug={provider.slug} />
      <EmergingProviderStats stats={provider.providerStats} />
      <EmergingProvidersFAQs />
    </main>
  );
}
