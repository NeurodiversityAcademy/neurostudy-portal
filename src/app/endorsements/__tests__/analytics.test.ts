import {
  ENDORSED_PROVIDERS_GA_EVENTS,
  trackEndorsedProviderWebsiteClick,
  trackEndorsedProvidersCarouselCtaClick,
  trackEndorsedProvidersCarouselNavigationClick,
  trackEndorsedProvidersFaqToggle,
  trackEndorsedProvidersPageCtaClick,
} from '../analytics';

describe('endorsements analytics', () => {
  const gtag = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.gtag = gtag;
  });

  afterEach(() => {
    delete window.gtag;
  });

  it('tracks the contact CTA click', () => {
    trackEndorsedProvidersPageCtaClick();

    expect(gtag).toHaveBeenCalledWith(
      'event',
      ENDORSED_PROVIDERS_GA_EVENTS.pageCtaClick,
      {
        category: 'Endorsed Providers',
        page_path: '/endorsements',
        link_text: 'Contact us for endorsement',
        destination_path: '/contact',
      }
    );
  });

  it('tracks FAQ expansion and collapse', () => {
    trackEndorsedProvidersFaqToggle('Why is endorsement necessary?', true);
    trackEndorsedProvidersFaqToggle('Why is endorsement necessary?', false);

    expect(gtag).toHaveBeenNthCalledWith(
      1,
      'event',
      ENDORSED_PROVIDERS_GA_EVENTS.faqToggle,
      {
        category: 'Endorsed Providers',
        page_path: '/endorsements',
        question: 'Why is endorsement necessary?',
        state: 'expanded',
      }
    );
    expect(gtag).toHaveBeenNthCalledWith(
      2,
      'event',
      ENDORSED_PROVIDERS_GA_EVENTS.faqToggle,
      {
        category: 'Endorsed Providers',
        page_path: '/endorsements',
        question: 'Why is endorsement necessary?',
        state: 'collapsed',
      }
    );
  });

  it('tracks provider website clicks from the endorsed providers carousel', () => {
    trackEndorsedProviderWebsiteClick(
      'Blueprint Career Development',
      'https://www.blueprintcd.com.au/'
    );

    expect(gtag).toHaveBeenCalledWith(
      'event',
      ENDORSED_PROVIDERS_GA_EVENTS.providerWebsiteClick,
      {
        category: 'Endorsed Providers',
        page_path: '/endorsements',
        provider_name: 'Blueprint Career Development',
        destination_url: 'https://www.blueprintcd.com.au/',
        link_text: 'Blueprint Career Development',
      }
    );
  });

  it('tracks carousel arrow navigation', () => {
    trackEndorsedProvidersCarouselNavigationClick('next');

    expect(gtag).toHaveBeenCalledWith(
      'event',
      ENDORSED_PROVIDERS_GA_EVENTS.carouselNavigationClick,
      {
        category: 'Endorsed Providers',
        page_path: '/endorsements',
        direction: 'next',
      }
    );
  });

  it('tracks the carousel explore-more CTA', () => {
    trackEndorsedProvidersCarouselCtaClick();

    expect(gtag).toHaveBeenCalledWith(
      'event',
      ENDORSED_PROVIDERS_GA_EVENTS.carouselCtaClick,
      {
        category: 'Endorsed Providers',
        page_path: '/',
        link_text: 'Explore more',
        destination_path: '/endorsements',
      }
    );
  });
});
