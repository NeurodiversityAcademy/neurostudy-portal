import { isProductionAnalyticsEnabled } from '@/app/utilities/analyticsEnv';
import { sendGaEvent, type GaEventParams } from '@/app/utilities/gaTracking';
import type { InstitutionCtaAnalytics } from '@/app/components/emergingInstitutions/EmergingInstitutionCtaButton';
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

function stopFlushLoop(): void {
  if (flushTimerId === null) {
    return;
  }
  clearInterval(flushTimerId);
  flushTimerId = null;
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
  if (pendingEvents.length === 0) {
    stopFlushLoop();
  }
}

function ensureFlushLoop(): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (flushTimerId !== null) {
    return;
  }
  let attempts = 0;
  flushTimerId = setInterval(() => {
    attempts += 1;
    flushPendingGaEvents();
    if (attempts < FLUSH_MAX_ATTEMPTS) {
      return;
    }
    stopFlushLoop();
  }, FLUSH_INTERVAL_MS);
}

export function queueProviderSearchGaEvent(eventName: string, params: GaEventParams): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (!isProductionAnalyticsEnabled()) {
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
  stopFlushLoop();
}

/** Test helper — whether the retry flush interval is still scheduled. */
export function isProviderSearchGaFlushLoopActiveForTests(): boolean {
  return flushTimerId !== null;
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
  mode?: 'quick' | 'ask';
  traceId?: string;
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.submit.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.submit.category,
      surface: params.surface,
      mode: params.mode ?? 'quick',
      interest_areas: joinGaMultiValue(params.interestAreas),
      locations: joinGaMultiValue(params.locations),
      ...(params.traceId ? { trace_id: params.traceId } : {}),
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

export function trackProviderSearchFeedback(params: {
  match: 'yes' | 'no';
  surface: ProviderSearchSurface;
  interestAreas: readonly string[];
  locations: readonly string[];
  resultCount: number;
  traceId?: string;
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.feedback.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.feedback.category,
      match: params.match,
      surface: params.surface,
      interest_areas: joinGaMultiValue(params.interestAreas),
      locations: joinGaMultiValue(params.locations),
      result_count: params.resultCount,
      ...(params.traceId ? { trace_id: params.traceId } : {}),
    }),
  );
}

/**
 * Fired once per result view when the evidence layer is enabled.
 * Clicks are already covered by `provider_search_result_click`, which carries
 * `provider_tier` and `result_position`, so no second click event is emitted.
 */
export function trackProviderRecommendationView(params: {
  countEndorsed: number;
  countEmerging: number;
  countWithEvidence: number;
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.recommendationView.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.recommendationView.category,
      count_endorsed: params.countEndorsed,
      count_emerging: params.countEmerging,
      count_with_evidence: params.countWithEvidence,
    }),
  );
}

type ResultClickParams = {
  providerSlug: string;
  providerTier: ProviderSearchTier;
  resultPosition: number;
  interestAreas: readonly string[];
  locations: readonly string[];
  destinationUrl: string;
};

function buildResultClickParams(params: ResultClickParams): GaEventParams {
  return {
    category: PROVIDER_SEARCH_GA.resultClick.category,
    provider_slug: params.providerSlug,
    provider_tier: params.providerTier,
    result_position: params.resultPosition,
    interest_areas: joinGaMultiValue(params.interestAreas),
    locations: joinGaMultiValue(params.locations),
    destination_url: params.destinationUrl,
  };
}

export function trackProviderSearchResultClick(params: ResultClickParams): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.resultClick.eventName,
    withPagePath(buildResultClickParams(params)),
  );
}

/** Card CTA analytics — same schema as trackProviderSearchResultClick. */
export function buildProviderSearchResultClickAnalytics(
  params: ResultClickParams,
): InstitutionCtaAnalytics {
  return {
    eventName: PROVIDER_SEARCH_GA.resultClick.eventName,
    category: PROVIDER_SEARCH_GA.resultClick.category,
    params: buildResultClickParams(params),
  };
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

export function trackShortlistView(params: { locked: boolean }): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.shortlistView.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.shortlistView.category,
      locked: params.locked,
    }),
  );
}

export function trackShortlistCompare(params: { providerCount: number }): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.shortlistCompare.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.shortlistCompare.category,
      provider_count: params.providerCount,
    }),
  );
}

export function trackLeadCapture(params: {
  placement: string;
  action: 'impression' | 'open' | 'submit' | 'success' | 'invalid';
  providerCount?: number;
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.leadCapture.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.leadCapture.category,
      placement: params.placement,
      action: params.action,
      provider_count: params.providerCount ?? 0,
    }),
  );
}

export function trackLeadVerify(params: { result: 'confirmed' | 'expired' }): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.leadVerify.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.leadVerify.category,
      result: params.result,
    }),
  );
}
