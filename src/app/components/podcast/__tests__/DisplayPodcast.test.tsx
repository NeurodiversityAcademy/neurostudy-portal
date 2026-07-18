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

  it('skips feed checks for multi-episode embeds and assumes available', async () => {
    const element = await DisplayPodcast({
      scriptSrc: 'https://buzzsprout.com/test.js',
      containerId: 'podcast-container',
      singleBlog: false,
    });

    render(element);

    expect(mockGetAvailability).not.toHaveBeenCalled();
    expect(screen.getByTestId('buzzsprout-embed')).toHaveTextContent('multi-true');
  });

  it('checks script availability for single-blog embeds', async () => {
    mockGetAvailability.mockResolvedValue(false);

    const element = await DisplayPodcast({
      scriptSrc: 'https://buzzsprout.com/unavailable.js',
      containerId: 'podcast-single',
      singleBlog: true,
    });

    render(element);

    expect(mockGetAvailability).toHaveBeenCalledWith('https://buzzsprout.com/unavailable.js', true);
    expect(screen.getByTestId('buzzsprout-embed')).toHaveTextContent('single-false');
  });
});
