import { notFound } from 'next/navigation';
import cardData from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import EmergingProviderHero from '@/app/components/emergingInstitutions/EmergingProviderHero';
import EmergingProviderStudentSuitability from '@/app/components/emergingInstitutions/EmergingProviderStudentSuitability';
import EmergingProviderStats from '@/app/components/emergingInstitutions/EmergingProviderStats';
import EmergingProvidersFAQs from '@/app/components/emergingInstitutions/EmergingProvidersFAQs';
import PageEngagementTracker from '@/app/components/endorsedProviders/PageEngagementTracker';
import { slugify } from '@/app/utilities/common';
import {
  HERO_DETAILS_BY_SLUG,
  STATS_BY_SLUG,
} from '@/app/components/emergingInstitutions/emergingProviderPageData';
import { EMERGING_PAGE_SECTION } from '@/app/utilities/emergingPageSections';
import { DATA_SECTION_ATTRIBUTE } from '@/app/utilities/gaTracking';
import pageStyles from './emergingProviderPage.module.css';

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

  return (
    <PageEngagementTracker providerSlug={institutionSlug}>
      <main className={pageStyles.pageMain}>
        <div {...{ [DATA_SECTION_ATTRIBUTE]: EMERGING_PAGE_SECTION.HERO }}>
          <EmergingProviderHero title={institution.name} heroInfoItems={heroInfoItems} />
        </div>
        <div {...{ [DATA_SECTION_ATTRIBUTE]: EMERGING_PAGE_SECTION.SUITABILITY }}>
          <EmergingProviderStudentSuitability instituteSlug={institutionSlug} />
        </div>
        <div {...{ [DATA_SECTION_ATTRIBUTE]: EMERGING_PAGE_SECTION.STATS }}>
          <EmergingProviderStats stats={providerStats} />
        </div>
        <div {...{ [DATA_SECTION_ATTRIBUTE]: EMERGING_PAGE_SECTION.FAQS }}>
          <EmergingProvidersFAQs />
        </div>
      </main>
    </PageEngagementTracker>
  );
}
