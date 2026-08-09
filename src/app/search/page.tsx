import type { Metadata } from 'next';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import ProviderStudySearch from '@/app/components/providerSearch/ProviderStudySearch';
import ProviderSearchResults from '@/app/components/providerSearch/ProviderSearchResults';
import ProviderSearchResultsTracker from '@/app/components/providerSearch/ProviderSearchResultsTracker';
import {
  getProviderSearchInterestAreaCatalog,
  getProviderSearchLocationCatalog,
  listSearchableProviders,
  toDropdownOptions,
} from '@/app/utilities/providerSearch/catalog';
import { resolveProviderSearchFilters } from '@/app/utilities/providerSearch/resolveFilters';
import {
  countProviderSearchResults,
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
  const { filters, searchDemo } = resolveProviderSearchFilters({
    [PROVIDER_SEARCH_QUERY.INTEREST_AREA]: resolved[PROVIDER_SEARCH_QUERY.INTEREST_AREA],
    [PROVIDER_SEARCH_QUERY.LOCATION]: resolved[PROVIDER_SEARCH_QUERY.LOCATION],
    [PROVIDER_SEARCH_QUERY.SEARCH_DEMO]: resolved[PROVIDER_SEARCH_QUERY.SEARCH_DEMO],
  });

  const providers = listSearchableProviders({ searchDemo });
  const results = searchProvidersByFilters(providers, filters);
  const totalCount = countProviderSearchResults(results);
  const interestAreaOptions = toDropdownOptions(
    getProviderSearchInterestAreaCatalog({ searchDemo }),
  );
  const locationOptions = toDropdownOptions(getProviderSearchLocationCatalog({ searchDemo }));
  const hasQuery = filters.interestAreas.length > 0 || filters.locations.length > 0;

  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <header className={styles.header}>
          <Typography variant={TypographyVariant.H1} color={TypographyColorToken.BondBlack}>
            Find providers
          </Typography>
          <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
            Search by area of study and location to explore neuro-inclusive education providers.
          </Typography>
        </header>
      </div>

      <section className={styles.searchBanner} aria-label='Provider search'>
        <div className={styles.searchBannerOverlay} aria-hidden='true' />
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
      </section>

      <div className={styles.results}>
        {hasQuery ? (
          <>
            <ProviderSearchResultsTracker
              interestAreas={filters.interestAreas}
              locations={filters.locations}
              resultCountTotal={totalCount}
              countCourseEndorsed={results.course_endorsed.length}
              countStarredEndorsed={results.starred_endorsed.length}
              countEndorsed={results.endorsed.length}
              countEmerging={results.emerging.length}
            />
            <Typography
              variant={TypographyVariant.Body2}
              color={TypographyColorToken.BondBlack}
              className={styles.summary}
            >
              {totalCount === 1 ? '1 provider found' : `${totalCount} providers found`}
            </Typography>
            <ProviderSearchResults
              results={results}
              filters={filters}
              searchDemo={searchDemo}
              totalCount={totalCount}
            />
          </>
        ) : (
          <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
            Choose an area of study and/or location to see matching providers.
          </Typography>
        )}
      </div>
    </main>
  );
}
