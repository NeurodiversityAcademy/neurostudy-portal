import type { Metadata } from 'next';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import ProviderStudySearch from '@/app/components/providerSearch/ProviderStudySearch';
import SearchVerification from '@/app/components/providerSearch/SearchVerification';
import ProviderSearchResultsTracker from '@/app/components/providerSearch/ProviderSearchResultsTracker';
import ProviderSearchFeedback from '@/app/components/providerSearch/ProviderSearchFeedback';
import ShortlistGate from '@/app/components/providerSearch/ShortlistGate';
import {
  hasVerificationCookie,
  isBotIdGateEnabled,
} from '@/app/utilities/botid/verificationCookie';
import { isLeadCaptureEnabled } from '@/app/utilities/leads/leadFlags';
import { toDropdownOptions } from '@/app/utilities/providerSearch/catalog';
import { resolveProviderSearchFilters } from '@/app/utilities/providerSearch/resolveFilters';
import {
  countProviderSearchResults,
  countStarredEndorsedResults,
  searchProvidersByFilters,
} from '@/app/utilities/providerSearch/searchProviders';
import {
  buildProviderRankReasons,
  buildProviderRankSignals,
} from '@/app/utilities/providerSearch/providerRankingSignals';
import { isRecommendationsEnabled } from '@/app/utilities/providerSearch/providerSearchFlags';
import { PROVIDER_SEARCH_QUERY } from '@/app/utilities/providerSearch/constants';
import type { SearchParams } from '@/app/utilities/featureToggle';
import styles from './search.module.css';

export const metadata: Metadata = {
  title: 'Provider search | Neurodiversity Academy',
  description: 'Find endorsed and emerging education providers by area of study and location.',
  robots: {
    index: false,
    follow: false,
  },
};

type SearchPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ProviderSearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const { filters, searchDemo, context } = resolveProviderSearchFilters({
    [PROVIDER_SEARCH_QUERY.INTEREST_AREA]: resolved[PROVIDER_SEARCH_QUERY.INTEREST_AREA],
    [PROVIDER_SEARCH_QUERY.LOCATION]: resolved[PROVIDER_SEARCH_QUERY.LOCATION],
    [PROVIDER_SEARCH_QUERY.SEARCH_DEMO]: resolved[PROVIDER_SEARCH_QUERY.SEARCH_DEMO],
  });

  const recommendationsEnabled = isRecommendationsEnabled();
  const signals = recommendationsEnabled ? buildProviderRankSignals(context.providers) : undefined;
  const results = searchProvidersByFilters(context.providers, filters, signals);
  const rankReasons =
    recommendationsEnabled && signals
      ? buildProviderRankReasons(
          [...results.course_endorsed, ...results.endorsed, ...results.emerging],
          signals,
        )
      : {};
  const countWithEvidence = Object.values(rankReasons).filter(Boolean).length;
  const totalCount = countProviderSearchResults(results);
  const shortlistProviders = [
    ...results.course_endorsed,
    ...results.endorsed,
    ...results.emerging,
  ].map((provider) => ({
    slug: provider.slug,
    name: provider.name,
    kind: provider.kind,
    emergingState: provider.emergingState,
    ndaCertified: provider.ndaCertified,
  }));
  const interestAreaOptions = toDropdownOptions(context.interestAreaCatalog);
  const locationOptions = toDropdownOptions(context.locationCatalog);
  const verificationRequired = isBotIdGateEnabled() && !(await hasVerificationCookie());

  return (
    <main className={styles.page}>
      <section className={styles.searchBanner} aria-label='Provider search'>
        <div className={styles.searchBannerOverlay} aria-hidden='true' />
        <div className={styles.searchBannerInner}>
          <header className={styles.header}>
            <Typography variant={TypographyVariant.H1} color={TypographyColorToken.GhostWhite}>
              Find providers
            </Typography>
            <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.GhostWhite}>
              Search by area of study and location to explore neuro-inclusive education providers.
            </Typography>
          </header>
          <ProviderStudySearch
            className={styles.searchBannerForm}
            compact
            surface='search_page'
            interestAreaOptions={interestAreaOptions}
            locationOptions={locationOptions}
            defaultInterestAreas={filters.interestAreas}
            defaultLocations={filters.locations}
            searchDemo={searchDemo}
          />
        </div>
      </section>

      {verificationRequired ? (
        <div className={styles.results}>
          <SearchVerification />
        </div>
      ) : (
        <div className={styles.results}>
          <ProviderSearchResultsTracker
            interestAreas={filters.interestAreas}
            locations={filters.locations}
            resultCountTotal={totalCount}
            countCourseEndorsed={results.course_endorsed.length}
            countStarredEndorsed={countStarredEndorsedResults(results)}
            countEndorsed={results.endorsed.length}
            countEmerging={results.emerging.length}
            recommendationsEnabled={recommendationsEnabled}
            countWithEvidence={countWithEvidence}
          />
          <ShortlistGate
            key={JSON.stringify([filters.interestAreas, filters.locations, searchDemo])}
            enabled={isLeadCaptureEnabled()}
            providers={shortlistProviders}
            filters={filters}
            rankingHref={recommendationsEnabled ? '/how-we-rank' : undefined}
          />
          <ProviderSearchFeedback
            filters={filters}
            resultCount={totalCount}
            surface='search_page'
          />
        </div>
      )}
    </main>
  );
}
