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
  STATS_BY_SLUG,
  INTRO_SECTION_BY_SLUG,
  getEndorsedFaqSectionsForSlug,
  getEndorsedDisplayNameForSlug,
  getStudyAreasForSlug,
  getSupportFrameworkForSlug,
  getEndorsedCoverBackgroundSrc,
  getEndorsedMetaStripInstitutionIconSrc,
  getEndorsedInstitutionCoursesUrl,
  getInstitutionTypeForSlug,
  getVetKeyDataPointsForSlug,
  hasEndorsedDeliverySignals,
  isKnownEndorsedSlug,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import { HOST_URL } from '@/app/utilities/constants';
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
    <PageEngagementTracker providerSlug={slug}>
      <main className={pageStyles.pageMain}>
        <EndorsedInstitutionCoverHero
          backgroundSrc={coverBackgroundSrc}
          locationValue={locationValue}
          typeValue={typeValue}
          institutionIconSrc={institutionIconSrc}
          coursesUrl={coursesUrl}
          providerSlug={slug}
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
