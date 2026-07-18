import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/app/utilities/buzzsproutFeed', () => ({
  getBuzzsproutEmbedAvailability: jest.fn(),
}));

jest.mock('../Buzzsprout', () => ({
  __esModule: true,
  default: ({ embedAvailable, singleBlog }: { embedAvailable?: boolean; singleBlog: boolean }) => (
    <div data-testid='buzzsprout-embed'>
      {singleBlog ? 'single' : 'multi'}-{String(embedAvailable)}
    </div>
  ),
}));

import DisplayPodcast from '../DisplayPodcast';
import { getBuzzsproutEmbedAvailability } from '@/app/utilities/buzzsproutFeed';

const mockGetAvailability = getBuzzsproutEmbedAvailability as jest.Mock;

describe('DisplayPodcast', () => {
  beforeEach(() => {
    mockGetAvailability.mockReset();
  });

  it('passes embed availability to BuzzsproutEmbed', async () => {
    mockGetAvailability.mockResolvedValue(true);

    const element = await DisplayPodcast({
      scriptSrc: 'https://buzzsprout.com/test.js',
      containerId: 'podcast-container',
      singleBlog: false,
    });

    render(element);

    expect(mockGetAvailability).toHaveBeenCalledWith('https://buzzsprout.com/test.js', false);
    expect(screen.getByTestId('buzzsprout-embed')).toHaveTextContent('multi-true');
  });

  it('handles unavailable embed', async () => {
    mockGetAvailability.mockResolvedValue(false);

    const element = await DisplayPodcast({
      scriptSrc: 'https://buzzsprout.com/unavailable.js',
      containerId: 'podcast-single',
      singleBlog: true,
    });

    render(element);

    expect(screen.getByTestId('buzzsprout-embed')).toHaveTextContent('single-false');
  });
});
