'use client';

import { useEffect, useRef } from 'react';
import type { ProviderSearchFilters } from '@/app/utilities/providerSearch/constants';
import { trackProviderSearchResultsView } from '@/app/utilities/providerSearch/providerSearchGa';

type ProviderSearchResultsTrackerProps = {
  interestAreas: string[];
  locations: string[];
  resultCountTotal: number;
  countCourseEndorsed: number;
  countStarredEndorsed: number;
  countEndorsed: number;
  countEmerging: number;
};

function queryKey(filters: ProviderSearchFilters): string {
  return `${filters.interestAreas.join('|')}::${filters.locations.join('|')}`;
}

export default function ProviderSearchResultsTracker({
  interestAreas,
  locations,
  resultCountTotal,
  countCourseEndorsed,
  countStarredEndorsed,
  countEndorsed,
  countEmerging,
}: ProviderSearchResultsTrackerProps) {
  const lastKeyRef = useRef<string>('');

  useEffect(() => {
    if (interestAreas.length === 0 && locations.length === 0) {
      return;
    }
    const key = queryKey({ interestAreas, locations });
    if (lastKeyRef.current === key) {
      return;
    }
    lastKeyRef.current = key;
    trackProviderSearchResultsView({
      interestAreas,
      locations,
      resultCountTotal,
      countCourseEndorsed,
      countStarredEndorsed,
      countEndorsed,
      countEmerging,
      hasResults: resultCountTotal > 0,
    });
  }, [
    interestAreas,
    locations,
    resultCountTotal,
    countCourseEndorsed,
    countStarredEndorsed,
    countEndorsed,
    countEmerging,
  ]);

  return null;
}
