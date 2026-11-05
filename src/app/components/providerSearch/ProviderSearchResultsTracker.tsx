'use client';

import { useEffect, useRef } from 'react';
import type { ProviderSearchFilters } from '@/app/utilities/providerSearch/constants';
import {
  trackProviderRecommendationView,
  trackProviderSearchResultsView,
} from '@/app/utilities/providerSearch/providerSearchGa';

type ProviderSearchResultsTrackerProps = {
  interestAreas: string[];
  locations: string[];
  resultCountTotal: number;
  countCourseEndorsed: number;
  countStarredEndorsed: number;
  countEndorsed: number;
  countEmerging: number;
  /** When true, also emits the evidence-layer view event. */
  recommendationsEnabled?: boolean;
  countWithEvidence?: number;
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
  recommendationsEnabled = false,
  countWithEvidence = 0,
}: ProviderSearchResultsTrackerProps) {
  const lastKeyRef = useRef<string>('');

  useEffect(() => {
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

    if (recommendationsEnabled) {
      trackProviderRecommendationView({
        countEndorsed: countEndorsed + countCourseEndorsed,
        countEmerging,
        countWithEvidence,
      });
    }
  }, [
    interestAreas,
    locations,
    resultCountTotal,
    countCourseEndorsed,
    countStarredEndorsed,
    countEndorsed,
    countEmerging,
    recommendationsEnabled,
    countWithEvidence,
  ]);

  return null;
}
