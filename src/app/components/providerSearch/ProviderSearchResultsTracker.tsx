'use client';

import { useEffect, useRef } from 'react';
import type {
  ProviderSearchFilters,
  ProviderSearchTierResults,
} from '@/app/utilities/providerSearch/constants';
import { trackProviderSearchResultsView } from '@/app/utilities/providerSearch/providerSearchGa';
import {
  countProviderSearchResults,
  countStarredEndorsedResults,
} from '@/app/utilities/providerSearch/searchProviders';
import { joinGaMultiValue } from '@/app/utilities/providerSearch/normalize';

type ProviderSearchResultsTrackerProps = {
  filters: ProviderSearchFilters;
  results: ProviderSearchTierResults;
};

function queryKey(filters: ProviderSearchFilters): string {
  return `${joinGaMultiValue(filters.interestAreas)}::${joinGaMultiValue(filters.locations)}`;
}

export default function ProviderSearchResultsTracker({
  filters,
  results,
}: ProviderSearchResultsTrackerProps) {
  const lastKeyRef = useRef<string>('');

  useEffect(() => {
    const key = queryKey(filters);
    if (lastKeyRef.current === key) {
      return;
    }
    lastKeyRef.current = key;
    const resultCountTotal = countProviderSearchResults(results);
    trackProviderSearchResultsView({
      interestAreas: filters.interestAreas,
      locations: filters.locations,
      resultCountTotal,
      countCourseEndorsed: results.course_endorsed.length,
      countStarredEndorsed: countStarredEndorsedResults(results),
      countEndorsed: results.endorsed.length,
      countEmerging: results.emerging.length,
      hasResults: resultCountTotal > 0,
    });
  }, [filters, results]);

  return null;
}
