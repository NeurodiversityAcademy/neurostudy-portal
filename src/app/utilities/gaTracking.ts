import { GA_EVENTS } from '@/app/utilities/constants';

export const GA_EVENT_COMMAND = 'event' as const;

export const GA_PARAM = {
  PAGE_PATH: 'page_path',
  PROVIDER_SLUG: 'provider_slug',
  CATEGORY: 'category',
  PERCENT: 'percent',
  SECTION: 'section',
  SECONDS: 'seconds',
  ACCORDION_TITLE: 'accordion_title',
  DESTINATION_URL: 'destination_url',
  LINK_TEXT: 'link_text',
} as const;

export const ENDORSED_EXPLORE_LINK_TEXT = 'Explore' as const;

export const DATA_SECTION_ATTRIBUTE = 'data-section' as const;

export const DOCUMENT_VISIBILITY_HIDDEN = 'hidden' as const;

export const SECTION_INTERSECTION_THRESHOLD = 0.3 as const;

export const MILLISECONDS_PER_SECOND = 1000 as const;

export type GaParamValue = string | number | boolean;

export type GaEventParams = Record<string, GaParamValue>;

type GtagFn = (...args: Array<string | GaEventParams>) => void;

interface GtagWindow extends Window {
  gtag: GtagFn | null;
}

function asGtagWindow(): GtagWindow {
  return window as unknown as GtagWindow;
}

function resolveGtag(): GtagFn | null {
  const candidate = asGtagWindow().gtag;
  if (typeof candidate === 'function') {
    return candidate;
  }
  return null;
}

export function buildProviderScopedParams(
  providerSlug: string,
  extra: GaEventParams,
): GaEventParams {
  return {
    ...extra,
    [GA_PARAM.PAGE_PATH]: window.location.pathname,
    [GA_PARAM.PROVIDER_SLUG]: providerSlug,
  };
}

export function sendGaEvent(eventName: string, params: GaEventParams): void {
  const gtag = resolveGtag();
  if (gtag === null) {
    return;
  }
  gtag(GA_EVENT_COMMAND, eventName, params);
}

export function sendScrollDepthEvent(providerSlug: string, percent: number): void {
  sendGaEvent(
    GA_EVENTS.SCROLL_DEPTH.eventName,
    buildProviderScopedParams(providerSlug, {
      [GA_PARAM.PERCENT]: percent,
      [GA_PARAM.CATEGORY]: GA_EVENTS.SCROLL_DEPTH.category,
    }),
  );
}

export function sendSectionVisibleEvent(providerSlug: string, section: string): void {
  sendGaEvent(
    GA_EVENTS.SECTION_VISIBLE.eventName,
    buildProviderScopedParams(providerSlug, {
      [GA_PARAM.SECTION]: section,
      [GA_PARAM.CATEGORY]: GA_EVENTS.SECTION_VISIBLE.category,
    }),
  );
}

export function sendTimeOnPageEvent(providerSlug: string, seconds: number): void {
  sendGaEvent(
    GA_EVENTS.TIME_ON_PAGE.eventName,
    buildProviderScopedParams(providerSlug, {
      [GA_PARAM.SECONDS]: seconds,
      [GA_PARAM.CATEGORY]: GA_EVENTS.TIME_ON_PAGE.category,
    }),
  );
}

export function sendAccordionToggleEvent(eventName: string, category: string, label: string): void {
  sendGaEvent(eventName, {
    [GA_PARAM.ACCORDION_TITLE]: label,
    [GA_PARAM.CATEGORY]: category,
    [GA_PARAM.PAGE_PATH]: window.location.pathname,
  });
}

export function sendEndorsedExploreClickEvent(providerSlug: string, destinationUrl: string): void {
  sendGaEvent(
    GA_EVENTS.ENDORSED_EXPLORE_CLICK.eventName,
    buildProviderScopedParams(providerSlug, {
      [GA_PARAM.DESTINATION_URL]: destinationUrl,
      [GA_PARAM.LINK_TEXT]: ENDORSED_EXPLORE_LINK_TEXT,
      [GA_PARAM.CATEGORY]: GA_EVENTS.ENDORSED_EXPLORE_CLICK.category,
    }),
  );
}
