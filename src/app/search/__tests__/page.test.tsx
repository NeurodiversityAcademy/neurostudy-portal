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
import ProviderSearchResults from '@/app/components/providerSearch/ProviderSearchResults';
import SearchVerification from '@/app/components/providerSearch/SearchVerification';
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

const MATCHING_QUERY = { InterestArea: 'IT', Location: 'Sydney' };

/**
 * The page is an async server component, so it is invoked directly and the
 * results element is rendered from the returned tree. This is what guards the
 * regression where the page computed results but mounted no results list.
 */
async function renderPageResults(searchParams: Record<string, string>): Promise<WalkableElement> {
  const page = await Page({ searchParams: Promise.resolve(searchParams) });
  const results = findElement(page, (element) => element.type === ProviderSearchResults);

  expect(results).not.toBeNull();
  render(results as WalkableElement);

  return results as WalkableElement;
}

describe('Provider search page', () => {
  beforeEach(() => {
    gateEnabled.mockReturnValue(false);
    verificationCookieValid.mockResolvedValue(true);
  });

  it('renders the provider matching an area and location query', async () => {
    const results = await renderPageResults(MATCHING_QUERY);

    expect(results.props.totalCount).toBe(1);
    expect(screen.getByText('Nepean Community College')).toBeInTheDocument();
    expect(screen.queryByText('No providers matched your search')).not.toBeInTheDocument();
  });

  it('renders the empty state, not a blank page, when nothing matches', async () => {
    await renderPageResults({ Location: 'Hobart' });

    expect(screen.getByText('No providers matched your search')).toBeInTheDocument();
  });

  it('withholds the results list until the bot gate verifies the browser', async () => {
    gateEnabled.mockReturnValue(true);
    verificationCookieValid.mockResolvedValue(false);

    const page = await Page({ searchParams: Promise.resolve(MATCHING_QUERY) });

    expect(findElement(page, (element) => element.type === ProviderSearchResults)).toBeNull();
    expect(findElement(page, (element) => element.type === SearchVerification)).not.toBeNull();
  });
});
