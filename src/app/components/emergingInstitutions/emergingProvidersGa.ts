import { analyticsFileNameFromUrl } from '@/app/utilities/analyticsFileName';
import { sendGaEvent, type GaEventParams } from '@/app/utilities/gaTracking';
import type { AustralianState } from './emergingInstitutionTypes';
import { EMERGING_PROVIDERS_DIRECTORY_PATH } from './emergingProvidersPaths';

export const EMERGING_GA_CATEGORY = 'Emerging' as const;

export const EMERGING_GA_SURFACE = {
  homepageTeaser: 'homepage_teaser',
  emergingDirectory: 'emerging_directory',
} as const;

export type EmergingGaSurface =
  (typeof EMERGING_GA_SURFACE)[keyof typeof EMERGING_GA_SURFACE];

export const EMERGING_PROVIDERS_GA = {
  stateAutoSelect: {
    eventName: 'emerging_state_auto_select',
    category: EMERGING_GA_CATEGORY,
  },
  stateSelect: {
    eventName: 'emerging_state_select',
    category: EMERGING_GA_CATEGORY,
  },
  institutePillClick: {
    eventName: 'emerging_institute_pill_click',
    category: EMERGING_GA_CATEGORY,
  },
  directoryCtaClick: {
    eventName: 'emerging_directory_cta_click',
    category: EMERGING_GA_CATEGORY,
  },
  stateJump: {
    eventName: 'emerging_state_jump',
    category: EMERGING_GA_CATEGORY,
  },
  ctaClick: {
    eventName: 'emerging_cta_click',
    category: EMERGING_GA_CATEGORY,
  },
} as const;

const VIEW_ALL_LINK_TEXT = 'View all emerging providers';
const EXPLORE_MORE_LINK_TEXT = 'Explore More';

function withPagePath(params: GaEventParams): GaEventParams {
  return {
    ...params,
    page_path: window.location.pathname,
  };
}

export function trackEmergingStateAutoSelect(state: AustralianState): void {
  sendGaEvent(
    EMERGING_PROVIDERS_GA.stateAutoSelect.eventName,
    withPagePath({
      category: EMERGING_PROVIDERS_GA.stateAutoSelect.category,
      surface: EMERGING_GA_SURFACE.homepageTeaser,
      state,
    }),
  );
}

export function trackEmergingStateSelect(params: {
  state: AustralianState;
  wasAlreadySelected: boolean;
}): void {
  sendGaEvent(
    EMERGING_PROVIDERS_GA.stateSelect.eventName,
    withPagePath({
      category: EMERGING_PROVIDERS_GA.stateSelect.category,
      surface: EMERGING_GA_SURFACE.homepageTeaser,
      state: params.state,
      was_already_selected: params.wasAlreadySelected,
    }),
  );
}

export function trackEmergingInstitutePillClick(params: {
  providerName: string;
  providerSlug: string;
  state: AustralianState;
  destinationPath: string;
  linkText: string;
}): void {
  sendGaEvent(
    EMERGING_PROVIDERS_GA.institutePillClick.eventName,
    withPagePath({
      category: EMERGING_PROVIDERS_GA.institutePillClick.category,
      surface: EMERGING_GA_SURFACE.homepageTeaser,
      provider_name: params.providerName,
      provider_slug: params.providerSlug,
      state: params.state,
      destination_path: params.destinationPath,
      link_text: params.linkText,
    }),
  );
}

export function trackEmergingDirectoryCtaClick(linkText: string = VIEW_ALL_LINK_TEXT): void {
  sendGaEvent(
    EMERGING_PROVIDERS_GA.directoryCtaClick.eventName,
    withPagePath({
      category: EMERGING_PROVIDERS_GA.directoryCtaClick.category,
      surface: EMERGING_GA_SURFACE.homepageTeaser,
      destination_path: EMERGING_PROVIDERS_DIRECTORY_PATH,
      link_text: linkText,
      file_name: analyticsFileNameFromUrl(EMERGING_PROVIDERS_DIRECTORY_PATH),
    }),
  );
}

export function trackEmergingStateJump(params: {
  state: AustralianState;
  source?: 'click' | 'deep_link';
}): void {
  sendGaEvent(
    EMERGING_PROVIDERS_GA.stateJump.eventName,
    withPagePath({
      category: EMERGING_PROVIDERS_GA.stateJump.category,
      surface: EMERGING_GA_SURFACE.emergingDirectory,
      state: params.state,
      ...(params.source ? { source: params.source } : {}),
    }),
  );
}

export function buildEmergingExploreMoreAnalytics(params: {
  providerName: string;
  providerSlug: string;
  state: AustralianState;
  destinationPath: string;
}): {
  eventName: string;
  category: string;
  fileName: string;
  params: GaEventParams;
} {
  return {
    eventName: EMERGING_PROVIDERS_GA.ctaClick.eventName,
    category: EMERGING_PROVIDERS_GA.ctaClick.category,
    fileName: analyticsFileNameFromUrl(params.destinationPath),
    params: {
      surface: EMERGING_GA_SURFACE.emergingDirectory,
      provider_name: params.providerName,
      provider_slug: params.providerSlug,
      state: params.state,
      destination_path: params.destinationPath,
      link_text: EXPLORE_MORE_LINK_TEXT,
    },
  };
}

export function buildEmergingDirectoryViewAllAnalytics(linkText: string = VIEW_ALL_LINK_TEXT): {
  eventName: string;
  category: string;
  fileName: string;
  params: GaEventParams;
} {
  return {
    eventName: EMERGING_PROVIDERS_GA.directoryCtaClick.eventName,
    category: EMERGING_PROVIDERS_GA.directoryCtaClick.category,
    fileName: analyticsFileNameFromUrl(EMERGING_PROVIDERS_DIRECTORY_PATH),
    params: {
      surface: EMERGING_GA_SURFACE.homepageTeaser,
      destination_path: EMERGING_PROVIDERS_DIRECTORY_PATH,
      link_text: linkText,
    },
  };
}

export { VIEW_ALL_LINK_TEXT, EXPLORE_MORE_LINK_TEXT };
