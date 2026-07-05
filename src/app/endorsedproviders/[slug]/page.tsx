import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import EndorsedInstitutionCoverHero from '@/app/components/endorsedProviders/EndorsedInstitutionCoverHero';
import InstitutionStats from '@/app/components/emergingInstitutions/InstitutionStats';
import EndorsedVetKeyDataPoints from '@/app/components/endorsedProviders/EndorsedVetKeyDataPoints';
import EndorsedProviderIntroSection from '@/app/components/endorsedProviders/EndorsedProviderIntroSection';
import EndorsedStudyAreas from '@/app/components/endorsedProviders/EndorsedStudyAreas';
import EndorsedProviderEnhancements from '@/app/components/endorsedProviders/EndorsedProviderEnhancements';
import EndorsedProvidersFAQs from '@/app/components/endorsedProviders/EndorsedProvidersFAQs';
import PageEngagementTracker from '@/app/components/endorsedProviders/PageEngagementTracker';
import {
  HERO_DETAILS_BY_SLUG,
  HERO_INFO_LABEL_LOCATION,
  HERO_INFO_LABEL_STUDY_MODE,
  HERO_INFO_LABEL_TYPE,
  STATS_BY_SLUG,
  INTRO_SECTION_BY_SLUG,
  findHeroInfoValueByLabel,
  getEndorsedFaqSectionsForSlug,
  getEndorsedDisplayNameForSlug,
  getStudyAreasForSlug,
  getSupportFrameworkForSlug,
  getEndorsedInstitutionCoursesUrl,
  getEndorsedMetaStripInstitutionIconSrc,
  getInstitutionTypeForSlug,
  getVetKeyDataPointsForSlug,
  hasEndorsedDeliverySignals,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import { HOST_URL } from '@/app/utilities/constants';
import {
  buildEndorsedDemoDetailHref,
  resolveDetailDemoAccess,
} from '@/app/utilities/demoAccess';
import type { SearchParams } from '@/app/utilities/featureToggle';
import { EMPTY_SEARCH_PARAMS } from '@/app/utilities/searchParamsReader';
import {
  ENDORSED_INSTITUTION_TYPE,
  ENDORSED_PAGE_SECTION,
  resolveStatsSectionId,
} from '@/app/utilities/endorsedPageSections';
import { DATA_SECTION_ATTRIBUTE } from '@/app/utilities/gaTracking';
import pageStyles from './endorsedProviderPage.module.css';

type RouteParams = {
  slug: string;
};

interface PageProps {
  params: RouteParams;
  searchParams: SearchParams;
}

export async function generateMetadata({
  params,
  searchParams = EMPTY_SEARCH_PARAMS,
}: PageProps): Promise<Metadata> {
  const demoAccess = resolveDetailDemoAccess(params.slug, searchParams);
  if (demoAccess === null) {
    return { title: 'Not found' };
  }

  const internalSlug = demoAccess.internalSlug;
  const displayName = getEndorsedDisplayNameForSlug(internalSlug);
  const hero = HERO_DETAILS_BY_SLUG[internalSlug];

  if (!displayName || !hero || !hasEndorsedDeliverySignals(internalSlug)) {
    return { title: 'Not found' };
  }

  const title = `${displayName} | NDA Endorsed Provider`;
  const description = `Explore neuro-inclusive profile and delivery signals for ${displayName}.`;
  const canonical = `${HOST_URL}${buildEndorsedDemoDetailHref(params.slug)}`;

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

export default function EndorsedProviderDetailPage({
  params,
  searchParams = EMPTY_SEARCH_PARAMS,
}: PageProps) {
  const demoAccess = resolveDetailDemoAccess(params.slug, searchParams);
  if (demoAccess === null) {
    notFound();
  }

  const internalSlug = demoAccess.internalSlug;
  const displayName = getEndorsedDisplayNameForSlug(internalSlug);
  const heroInfoItems = HERO_DETAILS_BY_SLUG[internalSlug];

  if (
    !displayName ||
    !heroInfoItems ||
    !hasEndorsedDeliverySignals(internalSlug)
  ) {
    notFound();
  }

  const institutionType = getInstitutionTypeForSlug(internalSlug);
  const providerStats = STATS_BY_SLUG[internalSlug];
  const vetKeyDataPoints = getVetKeyDataPointsForSlug(internalSlug);
  const intro = INTRO_SECTION_BY_SLUG[internalSlug];
  const faqSections = getEndorsedFaqSectionsForSlug(internalSlug);
  const studyAreas = getStudyAreasForSlug(internalSlug);
  const supportFramework = getSupportFrameworkForSlug(internalSlug);
  const institutionIconSrc =
    getEndorsedMetaStripInstitutionIconSrc(internalSlug);
  const coursesUrl = getEndorsedInstitutionCoursesUrl(internalSlug);

  const locationValue = findHeroInfoValueByLabel(
    heroInfoItems,
    HERO_INFO_LABEL_LOCATION
  );
  const studyModeValue = findHeroInfoValueByLabel(
    heroInfoItems,
    HERO_INFO_LABEL_STUDY_MODE
  );
  const typeValue = findHeroInfoValueByLabel(
    heroInfoItems,
    HERO_INFO_LABEL_TYPE
  );

  return (
    <PageEngagementTracker providerSlug={internalSlug}>
      <main className={pageStyles.pageMain}>
        <EndorsedInstitutionCoverHero
          locationValue={locationValue}
          studyModeValue={studyModeValue}
          typeValue={typeValue}
          institutionIconSrc={institutionIconSrc}
          coursesUrl={coursesUrl}
          providerSlug={internalSlug}
        />
        <div className={pageStyles.endorsedPageColumn}>
          <div className={pageStyles.endorsedPageColumnInner}>
            <section
              {...{ [DATA_SECTION_ATTRIBUTE]: ENDORSED_PAGE_SECTION.INTRO }}
            >
              {intro ? (
                <EndorsedProviderIntroSection
                  heading={intro.heading}
                  body={intro.body}
                />
              ) : null}
            </section>
            <section
              {...{
                [DATA_SECTION_ATTRIBUTE]: ENDORSED_PAGE_SECTION.STUDY_AREAS,
              }}
            >
              <EndorsedStudyAreas studyAreas={studyAreas} />
            </section>
            <section
              {...{
                [DATA_SECTION_ATTRIBUTE]:
                  resolveStatsSectionId(institutionType),
              }}
            >
              {institutionType === ENDORSED_INSTITUTION_TYPE.VET ? (
                <EndorsedVetKeyDataPoints dataPoints={vetKeyDataPoints} />
              ) : (
                <InstitutionStats
                  stats={providerStats}
                  isAlignedWithPageColumn
                />
              )}
            </section>
            <section
              {...{
                [DATA_SECTION_ATTRIBUTE]: ENDORSED_PAGE_SECTION.ENHANCEMENTS,
              }}
            >
              <EndorsedProviderEnhancements
                supportFramework={supportFramework}
              />
            </section>
            <section
              {...{ [DATA_SECTION_ATTRIBUTE]: ENDORSED_PAGE_SECTION.FAQS }}
            >
              <EndorsedProvidersFAQs sections={faqSections} />
            </section>
          </div>
        </div>
      </main>
    </PageEngagementTracker>
  );
}
