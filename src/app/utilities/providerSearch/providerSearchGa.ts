import { sendGaEvent, type GaEventParams } from '@/app/utilities/gaTracking';
import {
  PROVIDER_SEARCH_GA,
  type ProviderSearchSurface,
  type ProviderSearchTier,
} from './constants';
import { joinGaMultiValue } from './normalize';

type PendingGaEvent = {
  eventName: string;
  params: GaEventParams;
};

const pendingEvents: PendingGaEvent[] = [];
let flushTimerId: ReturnType<typeof setInterval> | null = null;
const FLUSH_INTERVAL_MS = 250;
const FLUSH_MAX_ATTEMPTS = 40;

function hasGtag(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return typeof (window as unknown as { gtag?: unknown }).gtag === 'function';
}

function flushPendingGaEvents(): void {
  if (!hasGtag()) {
    return;
  }
  while (pendingEvents.length > 0) {
    const next = pendingEvents.shift();
    if (!next) {
      break;
    }
    sendGaEvent(next.eventName, next.params);
  }
  if (flushTimerId !== null && pendingEvents.length === 0) {
    clearInterval(flushTimerId);
    flushTimerId = null;
  }
}

function ensureFlushLoop(): void {
  if (typeof window === 'undefined' || flushTimerId !== null) {
    return;
  }
  let attempts = 0;
  flushTimerId = setInterval(() => {
    attempts += 1;
    flushPendingGaEvents();
    if (attempts >= FLUSH_MAX_ATTEMPTS && flushTimerId !== null) {
      clearInterval(flushTimerId);
      flushTimerId = null;
    }
  }, FLUSH_INTERVAL_MS);
}

export function queueProviderSearchGaEvent(eventName: string, params: GaEventParams): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (hasGtag()) {
    sendGaEvent(eventName, params);
    return;
  }
  pendingEvents.push({ eventName, params });
  ensureFlushLoop();
}

/** Test helper — clears queued events and flush timer. */
export function resetProviderSearchGaQueueForTests(): void {
  pendingEvents.length = 0;
  if (flushTimerId !== null) {
    clearInterval(flushTimerId);
    flushTimerId = null;
  }
}

function withPagePath(params: GaEventParams): GaEventParams {
  return {
    ...params,
    page_path: window.location.pathname,
  };
}

export function trackProviderSearchSubmit(params: {
  surface: ProviderSearchSurface;
  interestAreas: readonly string[];
  locations: readonly string[];
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.submit.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.submit.category,
      surface: params.surface,
      interest_areas: joinGaMultiValue(params.interestAreas),
      locations: joinGaMultiValue(params.locations),
    }),
  );
}

export function trackProviderSearchResultsView(params: {
  interestAreas: readonly string[];
  locations: readonly string[];
  resultCountTotal: number;
  countCourseEndorsed: number;
  countStarredEndorsed: number;
  countEndorsed: number;
  countEmerging: number;
  hasResults: boolean;
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.resultsView.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.resultsView.category,
      interest_areas: joinGaMultiValue(params.interestAreas),
      locations: joinGaMultiValue(params.locations),
      result_count_total: params.resultCountTotal,
      count_course_endorsed: params.countCourseEndorsed,
      count_starred_endorsed: params.countStarredEndorsed,
      count_endorsed: params.countEndorsed,
      count_emerging: params.countEmerging,
      has_results: params.hasResults,
    }),
  );
}

export function trackProviderSearchResultClick(params: {
  providerSlug: string;
  providerTier: ProviderSearchTier;
  resultPosition: number;
  interestAreas: readonly string[];
  locations: readonly string[];
  destinationUrl: string;
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.resultClick.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.resultClick.category,
      provider_slug: params.providerSlug,
      provider_tier: params.providerTier,
      result_position: params.resultPosition,
      interest_areas: joinGaMultiValue(params.interestAreas),
      locations: joinGaMultiValue(params.locations),
      destination_url: params.destinationUrl,
    }),
  );
}

export function trackProviderCoursesPlaceholderView(providerSlug: string): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.coursesPlaceholderView.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.coursesPlaceholderView.category,
      provider_slug: providerSlug,
    }),
  );
}
