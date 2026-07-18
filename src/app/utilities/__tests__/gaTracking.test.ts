import {
  GA_EVENT_COMMAND,
  GA_PARAM,
  ENDORSED_EXPLORE_LINK_TEXT,
  sendAccordionToggleEvent,
  sendContactCtaClickEvent,
  sendEndorsedExploreClickEvent,
  sendGaEvent,
  sendHandbookCtaClickEvent,
  sendScrollDepthEvent,
  sendSectionVisibleEvent,
  sendTimeOnPageEvent,
  buildProviderScopedParams,
  buildPageScopedParams,
} from '@/app/utilities/gaTracking';
import { ENDORSEMENTS_CTA_LABELS, GA_EVENTS } from '@/app/utilities/constants';
import { installGtagMock, installTestPagePath } from '@/app/utilities/__tests__/gaTestHelpers';

describe('gaTracking', () => {
  beforeEach(() => {
    installTestPagePath('/endorsements');
  });

  it('sendGaEvent is a no-op when gtag is missing', () => {
    (window as unknown as { gtag: null }).gtag = null;
    expect(() => sendGaEvent('test_event', { [GA_PARAM.CATEGORY]: 'Test' })).not.toThrow();
  });

  it('buildProviderScopedParams includes slug and page path', () => {
    installTestPagePath('/endorsedproviders/collarts');
    const params = buildProviderScopedParams('collarts', {
      [GA_PARAM.CATEGORY]: 'Engagement',
    });
    expect(params).toEqual({
      category: 'Engagement',
      page_path: '/endorsedproviders/collarts',
      provider_slug: 'collarts',
    });
  });

  it('sendScrollDepthEvent dispatches scroll_depth', () => {
    installTestPagePath('/endorsedproviders/collarts');
    const mockGtag = installGtagMock();
    sendScrollDepthEvent('collarts', 50);
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.SCROLL_DEPTH.eventName,
      expect.objectContaining({
        percent: 50,
        provider_slug: 'collarts',
        page_path: '/endorsedproviders/collarts',
        category: GA_EVENTS.SCROLL_DEPTH.category,
      }),
    );
  });

  it('sendSectionVisibleEvent dispatches section_visible', () => {
    installTestPagePath('/endorsedproviders/collarts');
    const mockGtag = installGtagMock();
    sendSectionVisibleEvent('collarts', 'faqs');
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.SECTION_VISIBLE.eventName,
      expect.objectContaining({
        section: 'faqs',
        provider_slug: 'collarts',
        category: GA_EVENTS.SECTION_VISIBLE.category,
      }),
    );
  });

  it('sendTimeOnPageEvent dispatches time_on_page', () => {
    installTestPagePath('/endorsedproviders/collarts');
    const mockGtag = installGtagMock();
    sendTimeOnPageEvent('collarts', 42);
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.TIME_ON_PAGE.eventName,
      expect.objectContaining({
        seconds: 42,
        provider_slug: 'collarts',
        category: GA_EVENTS.TIME_ON_PAGE.category,
      }),
    );
  });

  it('sendAccordionToggleEvent dispatches accordion_toggle params', () => {
    installTestPagePath('/endorsedproviders/collarts');
    const mockGtag = installGtagMock();
    sendAccordionToggleEvent(
      GA_EVENTS.ACCORDION_TOGGLE.eventName,
      GA_EVENTS.ACCORDION_TOGGLE.category,
      'Question?',
    );
    expect(mockGtag).toHaveBeenCalledWith(GA_EVENT_COMMAND, GA_EVENTS.ACCORDION_TOGGLE.eventName, {
      accordion_title: 'Question?',
      category: GA_EVENTS.ACCORDION_TOGGLE.category,
      page_path: '/endorsedproviders/collarts',
    });
  });

  it('sendEndorsedExploreClickEvent dispatches endorsed_explore_click', () => {
    installTestPagePath('/endorsedproviders/collarts');
    const mockGtag = installGtagMock();
    const destinationUrl = 'https://example.com/courses';
    sendEndorsedExploreClickEvent('collarts', destinationUrl);
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.ENDORSED_EXPLORE_CLICK.eventName,
      {
        destination_url: destinationUrl,
        page_path: '/endorsedproviders/collarts',
        provider_slug: 'collarts',
        link_text: ENDORSED_EXPLORE_LINK_TEXT,
        category: GA_EVENTS.ENDORSED_EXPLORE_CLICK.category,
      },
    );
  });

  it('buildPageScopedParams includes page path', () => {
    const params = buildPageScopedParams({ [GA_PARAM.CATEGORY]: 'Conversion' });
    expect(params).toEqual({
      category: 'Conversion',
      page_path: '/endorsements',
    });
  });

  it('sendHandbookCtaClickEvent dispatches handbook_cta_click', () => {
    const mockGtag = installGtagMock();
    sendHandbookCtaClickEvent('handbook');
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.HANDBOOK_CTA_CLICK.eventName,
      {
        category: GA_EVENTS.HANDBOOK_CTA_CLICK.category,
        link_text: ENDORSEMENTS_CTA_LABELS.HANDBOOK,
        page_path: '/endorsements',
        section: 'handbook',
      },
    );
  });

  it('sendContactCtaClickEvent dispatches contact_cta_click', () => {
    const mockGtag = installGtagMock();
    sendContactCtaClickEvent('/contact', 'endorsements_faq');
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.CONTACT_CTA_CLICK.eventName,
      {
        category: GA_EVENTS.CONTACT_CTA_CLICK.category,
        link_text: ENDORSEMENTS_CTA_LABELS.CONTACT,
        destination_url: '/contact',
        page_path: '/endorsements',
        section: 'endorsements_faq',
      },
    );
  });
});
