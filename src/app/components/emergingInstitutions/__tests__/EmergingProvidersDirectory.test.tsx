import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmergingProvidersDirectory from '../EmergingProvidersDirectory';
import { trackEmergingStateJump } from '../emergingProvidersGa';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('../emergingProvidersGa', () => ({
  trackEmergingStateJump: jest.fn(),
  buildEmergingExploreMoreAnalytics: ({
    providerName,
    providerSlug,
    state,
    destinationPath,
  }: {
    providerName: string;
    providerSlug: string;
    state: string;
    destinationPath: string;
  }) => ({
    eventName: 'emerging_cta_click',
    category: 'Emerging',
    fileName: providerSlug,
    params: {
      surface: 'emerging_directory',
      provider_name: providerName,
      provider_slug: providerSlug,
      state,
      destination_path: destinationPath,
      link_text: 'Explore More',
    },
  }),
}));

jest.mock('../EmergingInstitutionCard', () => {
  const { hasEmergingProviderProfile } = require('../emergingProviderProfileSlugs');
  const { slugify } = require('@/app/utilities/common');

  return {
    __esModule: true,
    default: ({ name, state, demo }: { name: string; state: string; demo?: boolean }) => {
      const isComingSoon = demo || !hasEmergingProviderProfile(slugify(name));
      return isComingSoon ? (
        <div data-testid='institution-card'>
          {name} · {state} · Coming soon
        </div>
      ) : (
        <a href={`/emergingproviders/${slugify(name)}`} data-testid='institution-card'>
          {name} · {state} · Explore More
        </a>
      );
    },
  };
});

const trackJumpMock = trackEmergingStateJump as jest.MockedFunction<typeof trackEmergingStateJump>;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;

  readonly rootMargin = '';

  readonly thresholds: readonly number[] = [];

  disconnect = jest.fn();

  observe = jest.fn();

  takeRecords = jest.fn(() => []);

  unobserve = jest.fn();

  constructor(_callback: IntersectionObserverCallback) {}
}

describe('EmergingProvidersDirectory', () => {
  beforeEach(() => {
    trackJumpMock.mockClear();
    window.history.replaceState({}, '', '/emergingproviders');
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });
  });

  it('renders institution cards', async () => {
    render(<EmergingProvidersDirectory />);
    await waitFor(() => {
      expect(screen.getAllByTestId('institution-card').length).toBeGreaterThan(0);
    });
  });

  it('renders state sections and a side jump nav with counts', async () => {
    render(<EmergingProvidersDirectory />);
    const jumpNav = screen.getByRole('navigation', { name: 'Jump to state' });
    expect(jumpNav).toBeInTheDocument();
    const nswJump = jumpNav.querySelector('a[href="#emerging-state-NSW"]');
    expect(nswJump).toBeTruthy();
    expect(nswJump?.textContent).toMatch(/NSW\s*\d+/);
    expect(document.getElementById('emerging-state-NSW')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Bond University/)).toBeInTheDocument();
    });
    expect(screen.getByRole('heading', { name: 'New South Wales' })).toBeInTheDocument();
  });

  it('tracks state jump clicks and marks the pill active', () => {
    render(<EmergingProvidersDirectory />);
    const jumpNav = screen.getByRole('navigation', { name: 'Jump to state' });
    const saJump = jumpNav.querySelector('a[href="#emerging-state-SA"]');
    expect(saJump).toBeTruthy();
    fireEvent.click(saJump as HTMLAnchorElement);
    expect(trackJumpMock).toHaveBeenCalledWith({ state: 'SA', source: 'click' });
    expect(saJump).toHaveAttribute('aria-current', 'true');
    expect(saJump?.className).toMatch(/directoryJumpPillSelected/);
  });

  it('scrolls to a deep-linked state and tracks once', () => {
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    window.history.replaceState({}, '', '/emergingproviders?state=VIC');

    render(<EmergingProvidersDirectory />);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(trackJumpMock).toHaveBeenCalledTimes(1);
    expect(trackJumpMock).toHaveBeenCalledWith({ state: 'VIC', source: 'deep_link' });
  });

  it('renders live cards with same-tab explore links', async () => {
    render(<EmergingProvidersDirectory />);
    await waitFor(() => {
      expect(screen.getByText(/Bond University/)).toBeInTheDocument();
    });
    const liveCard = screen.getByText(/Bond University/);
    expect(liveCard.closest('a')).not.toHaveAttribute('target', '_blank');
  });

  it('renders explore links for doc profile institutions', async () => {
    render(<EmergingProvidersDirectory />);
    await waitFor(() => {
      expect(screen.getByText(/Deakin University/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Deakin University · VIC · Explore More/)).toBeInTheDocument();
  });
});
