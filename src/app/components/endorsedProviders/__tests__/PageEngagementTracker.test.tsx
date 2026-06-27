import { render } from '@testing-library/react';
import PageEngagementTracker from '../PageEngagementTracker';
import { ENDORSED_PAGE_SECTION } from '@/app/utilities/endorsedPageSections';
import { DATA_SECTION_ATTRIBUTE } from '@/app/utilities/gaTracking';
import {
  GA_EVENT_COMMAND,
  installGtagMock,
  installTestPagePath,
} from '@/app/utilities/__tests__/gaTestHelpers';

let intersectionCallback: IntersectionObserverCallback | null = null;

beforeEach(() => {
  intersectionCallback = null;
  installGtagMock();
  installTestPagePath('/endorsedproviders/collarts');

  global.IntersectionObserver = class MockIntersectionObserver
    implements IntersectionObserver
  {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(cb: IntersectionObserverCallback) {
      intersectionCallback = cb;
    }

    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
    takeRecords = jest.fn(() => []);
  };
});

function fireIntersection(target: HTMLElement): void {
  if (intersectionCallback === null) {
    throw new Error('IntersectionObserver callback was not registered');
  }
  intersectionCallback(
    [
      {
        isIntersecting: true,
        target,
      } as unknown as IntersectionObserverEntry,
    ],
    {} as IntersectionObserver
  );
}

describe('PageEngagementTracker', () => {
  it('renders children', () => {
    const { getByText } = render(
      <PageEngagementTracker providerSlug='collarts'>
        <div>hello</div>
      </PageEngagementTracker>
    );
    expect(getByText('hello')).toBeInTheDocument();
  });

  it('fires scroll_depth when scroll threshold is reached', () => {
    const mockGtag = installGtagMock();
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
      configurable: true,
    });

    render(
      <PageEngagementTracker providerSlug='collarts'>
        <div>content</div>
      </PageEngagementTracker>
    );

    window.scrollY = 1000;
    window.dispatchEvent(new Event('scroll'));

    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      'scroll_depth',
      expect.objectContaining({
        percent: 50,
        provider_slug: 'collarts',
        page_path: '/endorsedproviders/collarts',
        category: 'Engagement',
      })
    );
  });

  it('fires section_visible when a data-section element is observed', () => {
    const mockGtag = installGtagMock();
    render(
      <PageEngagementTracker providerSlug='collarts'>
        <div {...{ [DATA_SECTION_ATTRIBUTE]: ENDORSED_PAGE_SECTION.FAQS }}>
          FAQs
        </div>
      </PageEngagementTracker>
    );

    const target = document.querySelector(
      `[${DATA_SECTION_ATTRIBUTE}="${ENDORSED_PAGE_SECTION.FAQS}"]`
    ) as HTMLElement;
    fireIntersection(target);

    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      'section_visible',
      expect.objectContaining({
        section: ENDORSED_PAGE_SECTION.FAQS,
        provider_slug: 'collarts',
        page_path: '/endorsedproviders/collarts',
        category: 'Engagement',
      })
    );
  });
});

describe('PageEngagementTracker time_on_page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fires time_on_page on beforeunload', () => {
    const mockGtag = installGtagMock();
    render(
      <PageEngagementTracker providerSlug='collarts'>
        <div>content</div>
      </PageEngagementTracker>
    );

    jest.advanceTimersByTime(45_000);
    window.dispatchEvent(new Event('beforeunload'));

    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      'time_on_page',
      expect.objectContaining({
        seconds: 45,
        provider_slug: 'collarts',
        category: 'Engagement',
      })
    );
  });

  it('fires time_on_page on visibilitychange to hidden', () => {
    const mockGtag = installGtagMock();
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });

    render(
      <PageEngagementTracker providerSlug='collarts'>
        <div>content</div>
      </PageEngagementTracker>
    );

    jest.advanceTimersByTime(30_000);
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      'time_on_page',
      expect.objectContaining({
        seconds: 30,
        provider_slug: 'collarts',
      })
    );
  });

  it('fires time_on_page on unmount', () => {
    const mockGtag = installGtagMock();
    const { unmount } = render(
      <PageEngagementTracker providerSlug='collarts'>
        <div>content</div>
      </PageEngagementTracker>
    );

    jest.advanceTimersByTime(10_000);
    unmount();

    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      'time_on_page',
      expect.objectContaining({
        seconds: 10,
        provider_slug: 'collarts',
      })
    );
  });

  it('does not fire time_on_page twice', () => {
    const mockGtag = installGtagMock();
    render(
      <PageEngagementTracker providerSlug='collarts'>
        <div>content</div>
      </PageEngagementTracker>
    );

    jest.advanceTimersByTime(20_000);
    window.dispatchEvent(new Event('beforeunload'));
    document.dispatchEvent(new Event('visibilitychange'));

    const timeOnPageCalls = mockGtag.mock.calls.filter(
      (call) => call[1] === 'time_on_page'
    );
    expect(timeOnPageCalls).toHaveLength(1);
  });
});
