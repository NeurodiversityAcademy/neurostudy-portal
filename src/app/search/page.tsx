import type { Metadata } from 'next';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import ProviderStudySearch from '@/app/components/providerSearch/ProviderStudySearch';
import ProviderSearchResults from '@/app/components/providerSearch/ProviderSearchResults';
import ProviderSearchResultsTracker from '@/app/components/providerSearch/ProviderSearchResultsTracker';
import { toDropdownOptions } from '@/app/utilities/providerSearch/catalog';
import { resolveProviderSearchFilters } from '@/app/utilities/providerSearch/resolveFilters';
import {
  countProviderSearchResults,
  countStarredEndorsedResults,
  searchProvidersByFilters,
} from '@/app/utilities/providerSearch/searchProviders';
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

  const results = searchProvidersByFilters(context.providers, filters);
  const totalCount = countProviderSearchResults(results);
  const interestAreaOptions = toDropdownOptions(context.interestAreaCatalog);
  const locationOptions = toDropdownOptions(context.locationCatalog);

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

      <div className={styles.results}>
        <ProviderSearchResultsTracker
          interestAreas={filters.interestAreas}
          locations={filters.locations}
          resultCountTotal={totalCount}
          countCourseEndorsed={results.course_endorsed.length}
          countStarredEndorsed={countStarredEndorsedResults(results)}
          countEndorsed={results.endorsed.length}
          countEmerging={results.emerging.length}
        />
        <div className={styles.resultsSummary}>
          <Typography
            variant={TypographyVariant.Body2}
            color={TypographyColorToken.BondBlack}
            className={styles.summary}
          >
            {totalCount === 1 ? '1 provider found' : `${totalCount} providers found`}
          </Typography>
        </div>
        <ProviderSearchResults
          results={results}
          filters={filters}
          searchDemo={searchDemo}
          totalCount={totalCount}
        />
      </div>
    </main>
  );
}
