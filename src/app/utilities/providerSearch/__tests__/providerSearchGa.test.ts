/**
 * @jest-environment jsdom
 */
import {
  queueProviderSearchGaEvent,
  resetProviderSearchGaQueueForTests,
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
});
