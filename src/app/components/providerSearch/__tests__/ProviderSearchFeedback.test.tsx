/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProviderSearchFeedback from '../ProviderSearchFeedback';

jest.mock('@/app/utilities/providerSearch/providerSearchGa', () => ({
  trackProviderSearchFeedback: jest.fn(),
}));

jest.mock('@/app/utilities/providerSearch/searchTrace', () => ({
  readSearchTraceId: jest.fn(),
  clearSearchTraceId: jest.fn(),
}));

import { trackProviderSearchFeedback } from '@/app/utilities/providerSearch/providerSearchGa';
import { clearSearchTraceId, readSearchTraceId } from '@/app/utilities/providerSearch/searchTrace';

const filters = { interestAreas: ['Nursing'], locations: ['Melbourne', 'VIC'] };

describe('ProviderSearchFeedback', () => {
  beforeEach(() => {
    (trackProviderSearchFeedback as jest.Mock).mockClear();
    (clearSearchTraceId as jest.Mock).mockClear();
    (readSearchTraceId as jest.Mock).mockReset().mockReturnValue(undefined);
  });

  it('asks for feedback when there are results', () => {
    render(<ProviderSearchFeedback filters={filters} resultCount={2} />);

    expect(screen.getByText('Did these results match what you expected?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('renders nothing when there are no results', () => {
    const { container } = render(<ProviderSearchFeedback filters={filters} resultCount={0} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('tracks one yes and replaces the buttons with a thank-you', async () => {
    const user = userEvent.setup();
    render(<ProviderSearchFeedback filters={filters} resultCount={2} />);

    await user.click(screen.getByRole('button', { name: 'Yes' }));

    expect(trackProviderSearchFeedback).toHaveBeenCalledTimes(1);
    expect(trackProviderSearchFeedback).toHaveBeenCalledWith({
      match: 'yes',
      surface: 'search_page',
      interestAreas: ['Nursing'],
      locations: ['Melbourne', 'VIC'],
      resultCount: 2,
    });
    expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'No' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Thanks for the feedback.');
    expect(screen.getByRole('status')).toHaveFocus();
  });

  it('tracks no', async () => {
    const user = userEvent.setup();
    render(<ProviderSearchFeedback filters={filters} resultCount={5} surface='homepage' />);

    await user.click(screen.getByRole('button', { name: 'No' }));

    expect(trackProviderSearchFeedback).toHaveBeenCalledWith({
      match: 'no',
      surface: 'homepage',
      interestAreas: ['Nursing'],
      locations: ['Melbourne', 'VIC'],
      resultCount: 5,
    });
  });

  it('has no free-text field', () => {
    render(<ProviderSearchFeedback filters={filters} resultCount={1} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('includes a stored trace id and clears it after the answer', async () => {
    const user = userEvent.setup();
    (readSearchTraceId as jest.Mock).mockReturnValue('trace-123');
    render(<ProviderSearchFeedback filters={filters} resultCount={1} />);

    await user.click(screen.getByRole('button', { name: 'No' }));

    expect(trackProviderSearchFeedback).toHaveBeenCalledWith(
      expect.objectContaining({ traceId: 'trace-123' }),
    );
    expect(clearSearchTraceId).toHaveBeenCalledTimes(1);
  });
});
