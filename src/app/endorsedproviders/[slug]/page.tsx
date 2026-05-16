import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import EndorsedInstitutionCoverHero from '@/app/components/endorsedProviders/EndorsedInstitutionCoverHero';
import InstitutionStats from '@/app/components/emergingInstitutions/InstitutionStats';
import EndorsedVetKeyDataPoints from '@/app/components/endorsedProviders/EndorsedVetKeyDataPoints';
import EndorsedProviderIntroSection from '@/app/components/endorsedProviders/EndorsedProviderIntroSection';
import EndorsedStudyAreas from '@/app/components/endorsedProviders/EndorsedStudyAreas';
import EndorsedNdExperienceStrengths from '@/app/components/endorsedProviders/EndorsedNdExperienceStrengths';
import EndorsedProviderEnhancements from '@/app/components/endorsedProviders/EndorsedProviderEnhancements';
import EndorsedProvidersFAQs from '@/app/components/endorsedProviders/EndorsedProvidersFAQs';
import {
  HERO_DETAILS_BY_SLUG,
  STATS_BY_SLUG,
  INTRO_SECTION_BY_SLUG,
  getEndorsedFaqSectionsForSlug,
  getEndorsedDisplayNameForSlug,
  getStudyAreasForSlug,
  getSupportFrameworkForSlug,
  getEndorsedNdExperienceForSlug,
  getTopStrengthAreasForSlug,
  getEndorsedCoverBackgroundSrc,
  getEndorsedMetaStripInstitutionIconSrc,
  getEndorsedInstitutionCoursesUrl,
  getInstitutionTypeForSlug,
  getVetKeyDataPointsForSlug,
  hasEndorsedDeliverySignals,
  isKnownEndorsedSlug,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import { HOST_URL } from '@/app/utilities/constants';
import pageStyles from './endorsedProviderPage.module.css';

type RouteParams = {
  slug: string;
};

interface PageProps {
  params: RouteParams;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const displayName = getEndorsedDisplayNameForSlug(slug);
  const hero = HERO_DETAILS_BY_SLUG[slug];

  if (
    !isKnownEndorsedSlug(slug) ||
    !displayName ||
    !hero ||
    !hasEndorsedDeliverySignals(slug)
  ) {
    return { title: 'Not found' };
  }

  const title = `${displayName} | NDA Endorsed Provider`;
  const description = `Explore neuro-inclusive profile and delivery signals for ${displayName}.`;
  const canonical = `${HOST_URL}/endorsedproviders/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default function EndorsedProviderDetailPage({ params }: PageProps) {
  const { slug } = params;

  if (!isKnownEndorsedSlug(slug)) {
    notFound();
  }

  const displayName = getEndorsedDisplayNameForSlug(slug);
  const heroInfoItems = HERO_DETAILS_BY_SLUG[slug];

  const institutionType = getInstitutionTypeForSlug(slug);
  const providerStats = STATS_BY_SLUG[slug];
  const vetKeyDataPoints = getVetKeyDataPointsForSlug(slug);
  const intro = INTRO_SECTION_BY_SLUG[slug];
  const faqSections = getEndorsedFaqSectionsForSlug(slug);
  const studyAreas = getStudyAreasForSlug(slug);
  const ndExperience = getEndorsedNdExperienceForSlug(slug);
  const topStrengthAreas = getTopStrengthAreasForSlug(slug);
  const supportFramework = getSupportFrameworkForSlug(slug);
  const coverBackgroundSrc = getEndorsedCoverBackgroundSrc(slug);
  const institutionIconSrc = getEndorsedMetaStripInstitutionIconSrc(slug);
  const coursesUrl = getEndorsedInstitutionCoursesUrl(slug);

  const locationValue = heroInfoItems.find(
    (i) => i.label === 'Location'
  )?.value;
  const typeValue = heroInfoItems.find((i) => i.label === 'Type')?.value;

  if (!displayName || !heroInfoItems || !hasEndorsedDeliverySignals(slug)) {
    notFound();
  }

  return (
    <main className={pageStyles.pageMain}>
      <EndorsedInstitutionCoverHero
        backgroundSrc={coverBackgroundSrc}
        locationValue={locationValue}
        typeValue={typeValue}
        institutionIconSrc={institutionIconSrc}
        coursesUrl={coursesUrl}
      />
      <div className={pageStyles.endorsedPageColumn}>
        <div className={pageStyles.endorsedPageColumnInner}>
          {intro ? (
            <EndorsedProviderIntroSection
              heading={intro.heading}
              body={intro.body}
            />
          ) : null}
          <EndorsedStudyAreas studyAreas={studyAreas} />
          {institutionType === 'VET' ? (
            <EndorsedVetKeyDataPoints dataPoints={vetKeyDataPoints} />
          ) : (
            <InstitutionStats stats={providerStats} isAlignedWithPageColumn />
          )}
          {ndExperience ? (
            <EndorsedNdExperienceStrengths
              experience={ndExperience}
              topStrengths={topStrengthAreas}
              followsVetKeyDataPoints={institutionType === 'VET'}
            />
          ) : null}
          <EndorsedProviderEnhancements supportFramework={supportFramework} />
          <EndorsedProvidersFAQs sections={faqSections} />
        </div>
      </div>
    </main>
  );
}
