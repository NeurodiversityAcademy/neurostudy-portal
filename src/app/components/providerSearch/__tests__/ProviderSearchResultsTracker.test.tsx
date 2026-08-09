/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import ProviderSearchResultsTracker from '../ProviderSearchResultsTracker';

const trackMock = jest.fn();

jest.mock('@/app/utilities/providerSearch/providerSearchGa', () => ({
  trackProviderSearchResultsView: (...args: unknown[]) => trackMock(...args),
}));

describe('ProviderSearchResultsTracker', () => {
  beforeEach(() => {
    trackMock.mockClear();
  });

  it('fires results_view once per distinct query', () => {
    const { rerender } = render(
      <ProviderSearchResultsTracker
        interestAreas={['Music']}
        locations={['Sydney']}
        resultCountTotal={2}
        countCourseEndorsed={1}
        countStarredEndorsed={0}
        countEndorsed={1}
        countEmerging={0}
      />,
    );

    expect(trackMock).toHaveBeenCalledTimes(1);

    rerender(
      <ProviderSearchResultsTracker
        interestAreas={['Music']}
        locations={['Sydney']}
        resultCountTotal={2}
        countCourseEndorsed={1}
        countStarredEndorsed={0}
        countEndorsed={1}
        countEmerging={0}
      />,
    );
    expect(trackMock).toHaveBeenCalledTimes(1);

    rerender(
      <ProviderSearchResultsTracker
        interestAreas={['Nursing']}
        locations={[]}
        resultCountTotal={0}
        countCourseEndorsed={0}
        countStarredEndorsed={0}
        countEndorsed={0}
        countEmerging={0}
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

  it('does not fire when filters are empty', () => {
    render(
      <ProviderSearchResultsTracker
        interestAreas={[]}
        locations={[]}
        resultCountTotal={0}
        countCourseEndorsed={0}
        countStarredEndorsed={0}
        countEndorsed={0}
        countEmerging={0}
      />,
    );
    expect(trackMock).not.toHaveBeenCalled();
  });
});
