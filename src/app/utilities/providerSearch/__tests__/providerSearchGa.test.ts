/**
 * @jest-environment jsdom
 */
import {
  queueProviderSearchGaEvent,
  resetProviderSearchGaQueueForTests,
  trackProviderCoursesPlaceholderView,
  trackProviderSearchResultClick,
  trackProviderSearchResultsView,
  trackProviderSearchSubmit,
} from '../providerSearchGa';
import { PROVIDER_SEARCH_GA } from '../constants';
import { installGtagMock, type GtagTestWindow } from '@/app/utilities/__tests__/gaTestHelpers';

describe('providerSearchGa queue', () => {
  beforeEach(() => {
    resetProviderSearchGaQueueForTests();
    (window as unknown as GtagTestWindow).gtag = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetProviderSearchGaQueueForTests();
    jest.useRealTimers();
  });

  it('queues events until gtag is available then flushes', () => {
    trackProviderSearchSubmit({
      surface: 'homepage',
      interestAreas: ['Music'],
      locations: ['Sydney'],
    });

    expect((window as unknown as GtagTestWindow).gtag).toBeNull();

    const mockGtag = installGtagMock();
    jest.advanceTimersByTime(300);

    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      PROVIDER_SEARCH_GA.submit.eventName,
      expect.objectContaining({
        category: PROVIDER_SEARCH_GA.submit.category,
        surface: 'homepage',
        interest_areas: 'Music',
        locations: 'Sydney',
      }),
    );
  });

  it('sends immediately when gtag already exists', () => {
    const mockGtag = installGtagMock();
    queueProviderSearchGaEvent('custom_event', { category: 'ProviderSearch', foo: 'bar' });
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      'custom_event',
      expect.objectContaining({ foo: 'bar' }),
    );
  });

  it('tracks results view, result click, and placeholder view', () => {
    const mockGtag = installGtagMock();

    trackProviderSearchResultsView({
      interestAreas: ['Music'],
      locations: ['Sydney'],
      resultCountTotal: 3,
      countCourseEndorsed: 1,
      countStarredEndorsed: 1,
      countEndorsed: 1,
      countEmerging: 0,
      hasResults: true,
    });
    trackProviderSearchResultClick({
      providerSlug: 'collarts',
      providerTier: 'course_endorsed',
      resultPosition: 1,
      interestAreas: ['Music'],
      locations: ['Sydney'],
      destinationUrl: '/endorsedproviders/collarts/courses',
    });
    trackProviderCoursesPlaceholderView('collarts');

    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      PROVIDER_SEARCH_GA.resultsView.eventName,
      expect.objectContaining({ result_count_total: 3, has_results: true }),
    );
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      PROVIDER_SEARCH_GA.resultClick.eventName,
      expect.objectContaining({
        provider_slug: 'collarts',
        provider_tier: 'course_endorsed',
        result_position: 1,
      }),
    );
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      PROVIDER_SEARCH_GA.coursesPlaceholderView.eventName,
      expect.objectContaining({ provider_slug: 'collarts' }),
    );
  });

  it('stops flush loop after max attempts when gtag never appears', () => {
    trackProviderSearchSubmit({
      surface: 'search_page',
      interestAreas: ['Nursing'],
      locations: [],
    });
    jest.advanceTimersByTime(250 * 45);
    expect((window as unknown as GtagTestWindow).gtag).toBeNull();
  });
});
