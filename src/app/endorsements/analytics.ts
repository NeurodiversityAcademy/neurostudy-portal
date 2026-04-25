import { trackGoogleAnalyticsEvent } from '../utilities/googleAnalytics';

const ENDORSED_PROVIDERS_CATEGORY = 'Endorsed Providers';
const ENDORSED_PROVIDERS_PAGE_PATH = '/endorsements';

export const ENDORSED_PROVIDERS_GA_EVENTS = {
  pageCtaClick: 'endorsed_providers_page_cta_click',
  faqToggle: 'endorsed_providers_faq_toggle',
  providerWebsiteClick: 'endorsed_providers_provider_website_click',
  carouselNavigationClick: 'endorsed_providers_carousel_navigation_click',
  carouselCtaClick: 'endorsed_providers_carousel_cta_click',
} as const;

export function trackEndorsedProvidersPageCtaClick() {
  trackGoogleAnalyticsEvent(ENDORSED_PROVIDERS_GA_EVENTS.pageCtaClick, {
    category: ENDORSED_PROVIDERS_CATEGORY,
    page_path: ENDORSED_PROVIDERS_PAGE_PATH,
    link_text: 'Contact us for endorsement',
    destination_path: '/contact',
  });
}

export function trackEndorsedProvidersFaqToggle(
  question: string,
  expanded: boolean
) {
  trackGoogleAnalyticsEvent(ENDORSED_PROVIDERS_GA_EVENTS.faqToggle, {
    category: ENDORSED_PROVIDERS_CATEGORY,
    page_path: ENDORSED_PROVIDERS_PAGE_PATH,
    question,
    state: expanded ? 'expanded' : 'collapsed',
  });
}

export function trackEndorsedProviderWebsiteClick(
  providerName: string,
  destinationUrl: string
) {
  trackGoogleAnalyticsEvent(ENDORSED_PROVIDERS_GA_EVENTS.providerWebsiteClick, {
    category: ENDORSED_PROVIDERS_CATEGORY,
    page_path: ENDORSED_PROVIDERS_PAGE_PATH,
    provider_name: providerName,
    destination_url: destinationUrl,
    link_text: providerName,
  });
}

export function trackEndorsedProvidersCarouselNavigationClick(
  direction: 'previous' | 'next'
) {
  trackGoogleAnalyticsEvent(
    ENDORSED_PROVIDERS_GA_EVENTS.carouselNavigationClick,
    {
      category: ENDORSED_PROVIDERS_CATEGORY,
      page_path: ENDORSED_PROVIDERS_PAGE_PATH,
      direction,
    }
  );
}

export function trackEndorsedProvidersCarouselCtaClick() {
  trackGoogleAnalyticsEvent(ENDORSED_PROVIDERS_GA_EVENTS.carouselCtaClick, {
    category: ENDORSED_PROVIDERS_CATEGORY,
    page_path: '/',
    link_text: 'Explore more',
    destination_path: ENDORSED_PROVIDERS_PAGE_PATH,
  });
}
