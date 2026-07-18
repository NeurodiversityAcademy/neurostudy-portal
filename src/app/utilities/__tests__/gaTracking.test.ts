import {
  GA_EVENT_COMMAND,
  GA_PARAM,
  ENDORSED_EXPLORE_LINK_TEXT,
  sendAccordionToggleEvent,
  sendContactSubmitEvent,
  sendEndorsedExploreClickEvent,
  sendGaEvent,
  sendHandbookDownloadEvent,
  sendNewsletterSubscribeEvent,
  sendScrollDepthEvent,
  sendSectionVisibleEvent,
  sendTimeOnPageEvent,
  buildProviderScopedParams,
  buildConversionScopedParams,
} from '@/app/utilities/gaTracking';
import { CONVERSION_FORM_NAMES, GA_EVENTS } from '@/app/utilities/constants';
import { installGtagMock, installTestPagePath } from '@/app/utilities/__tests__/gaTestHelpers';

describe('gaTracking', () => {
  beforeEach(() => {
    installTestPagePath('/endorsedproviders/collarts');
  });

  it('sendGaEvent is a no-op when gtag is missing', () => {
    (window as unknown as { gtag: null }).gtag = null;
    expect(() => sendGaEvent('test_event', { [GA_PARAM.CATEGORY]: 'Test' })).not.toThrow();
  });

  it('buildProviderScopedParams includes slug and page path', () => {
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

  it('buildConversionScopedParams includes page path only', () => {
    installTestPagePath('/contact');
    const params = buildConversionScopedParams({
      [GA_PARAM.CATEGORY]: 'Conversion',
    });
    expect(params).toEqual({
      category: 'Conversion',
      page_path: '/contact',
    });
  });

  it('sendContactSubmitEvent dispatches contact_submit without PII', () => {
    installTestPagePath('/contact');
    const mockGtag = installGtagMock();
    sendContactSubmitEvent('persona_1');
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.CONTACT_SUBMIT.eventName,
      {
        category: GA_EVENTS.CONTACT_SUBMIT.category,
        form_name: CONVERSION_FORM_NAMES.CONTACT_US,
        persona: 'persona_1',
        page_path: '/contact',
      },
    );
  });

  it('sendNewsletterSubscribeEvent dispatches newsletter_subscribe', () => {
    installTestPagePath('/');
    const mockGtag = installGtagMock();
    sendNewsletterSubscribeEvent('persona_3');
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.NEWSLETTER_SUBSCRIBE.eventName,
      {
        category: GA_EVENTS.NEWSLETTER_SUBSCRIBE.category,
        form_name: CONVERSION_FORM_NAMES.NEWSLETTER,
        persona: 'persona_3',
        page_path: '/',
      },
    );
  });

  it('sendHandbookDownloadEvent dispatches handbook_download', () => {
    installTestPagePath('/handbook');
    const mockGtag = installGtagMock();
    sendHandbookDownloadEvent('persona_2');
    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      GA_EVENTS.HANDBOOK_DOWNLOAD.eventName,
      {
        category: GA_EVENTS.HANDBOOK_DOWNLOAD.category,
        form_name: CONVERSION_FORM_NAMES.HANDBOOK,
        content_name: CONVERSION_FORM_NAMES.HANDBOOK,
        persona: 'persona_2',
        page_path: '/handbook',
      },
    );
  });
});
