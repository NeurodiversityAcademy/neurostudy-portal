import type { ReactElement, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/app/utilities/botid/verificationCookie', () => ({
  hasVerificationCookie: jest.fn(),
  isBotIdGateEnabled: jest.fn(),
}));

import {
  hasVerificationCookie,
  isBotIdGateEnabled,
} from '@/app/utilities/botid/verificationCookie';
import ProviderStudySearch from '@/app/components/providerSearch/ProviderStudySearch';
import SearchVerification from '@/app/components/providerSearch/SearchVerification';
import ShortlistGate from '@/app/components/providerSearch/ShortlistGate';
import Page from '../page';

type WalkableElement = ReactElement<{ children?: ReactNode } & Record<string, unknown>>;

const gateEnabled = isBotIdGateEnabled as jest.Mock;
const verificationCookieValid = hasVerificationCookie as jest.Mock;

function findElement(
  node: ReactNode,
  predicate: (element: WalkableElement) => boolean,
): WalkableElement | null {
  if (node === null || node === undefined || typeof node !== 'object') {
    return null;
  }
  if (Array.isArray(node)) {
    for (const child of node as ReactNode[]) {
      const found = findElement(child, predicate);
      if (found) {
        return found;
      }
    }
    return null;
  }
  const element = node as WalkableElement;
  if (predicate(element)) {
    return element;
  }
  return findElement(element.props?.children, predicate);
}

type ListedProvider = { name: string };

const MATCHING_QUERY = { InterestArea: 'IT', Location: 'Sydney' };

/**
 * The page is an async server component, so it is invoked directly and the
 * comparison section is rendered from the returned tree. That section is the
 * only place providers are listed, so it is what the results are asserted on.
 */
async function renderPageResults(searchParams: Record<string, string>): Promise<WalkableElement> {
  const page = await Page({ searchParams: Promise.resolve(searchParams) });
  const section = findElement(page, (element) => element.type === ShortlistGate);

  expect(section).not.toBeNull();
  render(section as WalkableElement);

  return section as WalkableElement;
}

function listedProviderNames(section: WalkableElement): string[] {
  return (section.props.providers as ListedProvider[]).map((provider) => provider.name);
}

describe('Provider search page', () => {
  beforeEach(() => {
    gateEnabled.mockReturnValue(false);
    verificationCookieValid.mockResolvedValue(true);
  });

  it('lists the provider matching an area and location query', async () => {
    const section = await renderPageResults(MATCHING_QUERY);

    expect(listedProviderNames(section)).toContain('Nepean Community College');
    expect(screen.getByRole('link', { name: 'Nepean Community College' })).toBeInTheDocument();
    expect(screen.queryByText(/No providers matched your search/)).not.toBeInTheDocument();
  });

  it('surfaces state-tagged providers for a city search, like the assist bar does', async () => {
    const section = await renderPageResults({ Location: 'Melbourne' });

    // A city-only filter used to match only providers tagged with that city,
    // hiding every VIC emerging provider.
    expect(listedProviderNames(section).length).toBeGreaterThan(1);
    expect(screen.getByRole('link', { name: 'Collarts' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Deakin University' })).toBeInTheDocument();
  });

  it('lists Collarts for a creative industries search in Melbourne', async () => {
    // "creative studies in melbourne" resolves to Creative Industries, which
    // Collarts must carry to be listed at all.
    const section = await renderPageResults({
      InterestArea: 'Creative Industries',
      Location: 'Melbourne',
    });

    expect(listedProviderNames(section)).toContain('Collarts');
    expect(screen.getByRole('link', { name: 'Collarts' })).toBeInTheDocument();
  });

  it('links each listed provider to its page', async () => {
    await renderPageResults({ Location: 'Melbourne' });

    expect(screen.getByRole('link', { name: 'Collarts' })).toHaveAttribute(
      'href',
      '/endorsedproviders/collarts',
    );
    expect(screen.getByRole('link', { name: 'Deakin University' })).toHaveAttribute(
      'href',
      '/emergingproviders/deakin-university',
    );
  });

  it('shows the unmatched-query message under the search filters', async () => {
    // "asdfgh in nsw" resolves the location only; without this the page looks
    // like a clean result for the whole query.
    const page = await Page({
      searchParams: Promise.resolve({ Location: 'NSW', Unmatched: 'asdfgh' }),
    });
    const form = findElement(page, (element) => element.type === ProviderStudySearch);

    expect(form?.props.initialMessage).toContain("couldn't match “asdfgh”");
    expect(form?.props.initialMessage).toContain('showing all results in NSW');
  });

  it('renders the empty state, not a blank page, when nothing matches', async () => {
    const section = await renderPageResults({ Location: 'Hobart' });

    expect(listedProviderNames(section)).toEqual([]);
    expect(screen.getByText(/No providers matched your search/)).toBeInTheDocument();
  });

  it('remounts the search form for a new query so its filters match the URL', async () => {
    const formFor = async (searchParams: Record<string, string>) => {
      const page = await Page({ searchParams: Promise.resolve(searchParams) });
      const form = findElement(page, (element) => element.type === ProviderStudySearch);
      expect(form).not.toBeNull();
      return form as WalkableElement;
    };

    const melbourne = await formFor({ Location: 'Melbourne' });
    const perth = await formFor({ Location: 'Perth' });

    // A stale mount keeps the old pills and would resubmit the old search.
    expect(melbourne.props.defaultLocations).toEqual(expect.arrayContaining(['Melbourne', 'VIC']));
    expect(perth.props.defaultLocations).toEqual(expect.arrayContaining(['Perth', 'WA']));
    expect(melbourne.key).not.toBe(perth.key);
  });

  it('withholds the results section until the bot gate verifies the browser', async () => {
    gateEnabled.mockReturnValue(true);
    verificationCookieValid.mockResolvedValue(false);

    const page = await Page({ searchParams: Promise.resolve(MATCHING_QUERY) });

    expect(findElement(page, (element) => element.type === ShortlistGate)).toBeNull();
    expect(findElement(page, (element) => element.type === SearchVerification)).not.toBeNull();
  });
});
