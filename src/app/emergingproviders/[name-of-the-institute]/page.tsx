import { notFound } from 'next/navigation';
import cardData from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import EmergingProviderHero from '@/app/components/emergingInstitutions/EmergingProviderHero';
import EmergingProviderStudentSuitability from '@/app/components/emergingInstitutions/EmergingProviderStudentSuitability';
import EmergingProviderStats from '@/app/components/emergingInstitutions/EmergingProviderStats';
import EmergingProviderWhoAreThey from '@/app/components/emergingInstitutions/EmergingProviderWhoAreThey';
import { slugify } from '@/app/utilities/common';
import {
  HERO_DETAILS_BY_SLUG,
  STATS_BY_SLUG,
} from '@/app/components/emergingInstitutions/emergingProviderPageData';

type InstitutionCard = {
  name: string;
};

type RouteParams = {
  'name-of-the-institute': string;
};

export default function EmergingProviderPage({
  params,
}: {
  params: RouteParams;
}) {
  const institutions = cardData as InstitutionCard[];
  const institution = institutions.find(
    (item) => slugify(item.name) === params['name-of-the-institute']
  );

  if (!institution) {
    notFound();
  }

  const institutionSlug = params['name-of-the-institute'];
  const heroInfoItems = HERO_DETAILS_BY_SLUG[institutionSlug];
  const providerStats = STATS_BY_SLUG[institutionSlug];

  if (!heroInfoItems || !providerStats) {
    notFound();
  }

  return (
    <main>
      <EmergingProviderHero
        title={institution.name}
        heroInfoItems={heroInfoItems}
      />
      <EmergingProviderStudentSuitability instituteSlug={institutionSlug} />
      <EmergingProviderStats stats={providerStats} />
      <EmergingProviderWhoAreThey />
    </main>
  );
}
