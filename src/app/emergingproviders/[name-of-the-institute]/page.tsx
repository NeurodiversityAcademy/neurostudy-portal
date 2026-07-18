import { notFound } from 'next/navigation';
import cardData from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import EmergingProviderHero from '@/app/components/emergingInstitutions/EmergingProviderHero';
import EmergingProviderStudentSuitability from '@/app/components/emergingInstitutions/EmergingProviderStudentSuitability';
import EmergingProviderStats from '@/app/components/emergingInstitutions/EmergingProviderStats';
import EmergingProvidersFAQs from '@/app/components/emergingInstitutions/EmergingProvidersFAQs';
import { slugify } from '@/app/utilities/common';
import {
  HERO_DETAILS_BY_SLUG,
  STATS_BY_SLUG,
} from '@/app/components/emergingInstitutions/emergingProviderPageData';
import pageStyles from './emergingProviderPage.module.css';
import JsonLd from '@/app/components/seo/JsonLd';
import { buildEducationalOrganizationSchema } from '@/app/components/seo/schemaBuilders';
import { getSiteOrigin } from '@/app/components/seo/siteOrigin';

type InstitutionCard = {
  name: string;
};

type RouteParams = {
  'name-of-the-institute': string;
};

export default async function EmergingProviderPage({ params }: { params: Promise<RouteParams> }) {
  const resolvedParams = await params;
  const institutions = cardData as InstitutionCard[];
  const institution = institutions.find(
    (item) => slugify(item.name) === resolvedParams['name-of-the-institute'],
  );

  if (!institution) {
    notFound();
  }

  const institutionSlug = resolvedParams['name-of-the-institute'];
  const heroInfoItems = HERO_DETAILS_BY_SLUG[institutionSlug];
  const providerStats = STATS_BY_SLUG[institutionSlug];

  if (!heroInfoItems || !providerStats) {
    notFound();
  }

  const siteOrigin = getSiteOrigin();
  const canonical = `${siteOrigin}/emergingproviders/${institutionSlug}`;

  return (
    <main className={pageStyles.pageMain}>
      <JsonLd
        data={buildEducationalOrganizationSchema({
          name: institution.name,
          url: canonical,
        })}
      />
      <EmergingProviderHero title={institution.name} heroInfoItems={heroInfoItems} />
      <EmergingProviderStudentSuitability instituteSlug={institutionSlug} />
      <EmergingProviderStats stats={providerStats} />
      <EmergingProvidersFAQs />
    </main>
  );
}
