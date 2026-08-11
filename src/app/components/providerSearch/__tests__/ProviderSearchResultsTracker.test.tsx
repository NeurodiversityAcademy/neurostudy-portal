/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import ProviderSearchResultsTracker from '../ProviderSearchResultsTracker';
import type { ProviderSearchTierResults } from '@/app/utilities/providerSearch/constants';

const trackMock = jest.fn();

jest.mock('@/app/utilities/providerSearch/providerSearchGa', () => ({
  trackProviderSearchResultsView: (...args: unknown[]) => trackMock(...args),
}));

function makeResults(
  overrides: Partial<ProviderSearchTierResults> = {},
): ProviderSearchTierResults {
  return {
    course_endorsed: [],
    endorsed: [],
    emerging: [],
    ...overrides,
  };
}

describe('ProviderSearchResultsTracker', () => {
  beforeEach(() => {
    trackMock.mockClear();
  });

  it('fires results_view once per distinct query', () => {
    const musicResults = makeResults({
      course_endorsed: [{ slug: 'a' } as never],
      endorsed: [{ slug: 'b' } as never],
    });
    const { rerender } = render(
      <ProviderSearchResultsTracker
        filters={{ interestAreas: ['Music'], locations: ['Sydney'] }}
        results={musicResults}
      />,
    );

    expect(trackMock).toHaveBeenCalledTimes(1);

    rerender(
      <ProviderSearchResultsTracker
        filters={{ interestAreas: ['Music'], locations: ['Sydney'] }}
        results={musicResults}
      />,
    );
    expect(trackMock).toHaveBeenCalledTimes(1);

    rerender(
      <ProviderSearchResultsTracker
        filters={{ interestAreas: ['Nursing'], locations: [] }}
        results={makeResults()}
      />,
    );
    expect(trackMock).toHaveBeenCalledTimes(2);
    expect(trackMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        interestAreas: ['Nursing'],
        hasResults: false,
      }),
    );
  });

  it('fires browse-all results_view when filters are empty', () => {
    render(
      <ProviderSearchResultsTracker
        filters={{ interestAreas: [], locations: [] }}
        results={makeResults({
          course_endorsed: [{ slug: 'a' } as never],
          endorsed: [
            { slug: 'b', ndaCertified: true } as never,
            { slug: 'c', ndaCertified: true } as never,
            { slug: 'd' } as never,
            { slug: 'e' } as never,
          ],
          emerging: Array.from({ length: 5 }, (_, i) => ({ slug: `e${i}` }) as never),
        })}
      />,
    );
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        interestAreas: [],
        locations: [],
        resultCountTotal: 10,
        countStarredEndorsed: 2,
        hasResults: true,
      }),
    );
  });
});
