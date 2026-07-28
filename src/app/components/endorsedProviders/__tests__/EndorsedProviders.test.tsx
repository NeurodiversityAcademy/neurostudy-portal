import { render } from '@testing-library/react';
import EndorsedProviders from '../EndorsedProviders';
import {
  buildEndorsedDemoDetailHref,
  buildEndorsedLiveDetailHref,
} from '@/app/utilities/demoAccess';
import { NDA_CERTIFIED_LEGEND } from '@/app/utilities/endorsedProvidersDemo';
import endorsedData from '../endorsedProviders.json';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

const LIVE_COVER_SRCS = (endorsedData as Array<{ live?: boolean; topBackgroundImage?: string }>)
  .filter((row) => row.live === true && row.topBackgroundImage)
  .map((row) => row.topBackgroundImage as string);

describe('EndorsedProviders demo access', () => {
  it('renders cover images for every live endorsed provider', () => {
    const { container } = render(<EndorsedProviders />);
    const imageSrcs = Array.from(container.querySelectorAll('img')).map((img) =>
      img.getAttribute('src'),
    );

    expect(LIVE_COVER_SRCS.length).toBeGreaterThan(0);
    for (const coverSrc of LIVE_COVER_SRCS) {
      expect(imageSrcs).toContain(coverSrc);
    }
  });

  it('renders live provider cards without React list key warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<EndorsedProviders />);

    const keyWarnings = consoleError.mock.calls.filter((args) =>
      args.some((arg) => typeof arg === 'string' && arg.includes('unique "key" prop')),
    );
    expect(keyWarnings).toHaveLength(0);
    consoleError.mockRestore();
  });

  it('renders live provider cards without demo props', () => {
    const { getAllByRole, getByText } = render(<EndorsedProviders />);

    expect(getByText('NDA Endorsed Providers')).toBeInTheDocument();
    expect(getAllByRole('link')).toHaveLength(4);
  });

  it('renders live cards plus one demo card for valid non-live demo slug', () => {
    const { getAllByRole, getByText } = render(
      <EndorsedProviders demoGuid='test-guid' demoSlug='academia' />,
    );

    expect(getByText('NDA Endorsed Providers')).toBeInTheDocument();
    expect(getAllByRole('link')).toHaveLength(5);
  });

  it('uses slug-based detail href for live provider cards', () => {
    const { getAllByRole } = render(<EndorsedProviders />);

    const ctaLinks = getAllByRole('link', { name: 'Explore More' });
    const hrefs = ctaLinks.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain(buildEndorsedLiveDetailHref('nepean-community-college'));
    expect(hrefs).toContain(buildEndorsedLiveDetailHref('hsh'));
    expect(hrefs).toContain(buildEndorsedLiveDetailHref('blueprint-career-development'));
    expect(hrefs).toContain(buildEndorsedLiveDetailHref('collarts'));
  });

  it('uses guid-based detail href with demo query param on demo card CTA', () => {
    const expectedHref = buildEndorsedDemoDetailHref('test-guid');
    const { getAllByRole } = render(<EndorsedProviders demoGuid='test-guid' demoSlug='academia' />);

    const ctaLinks = getAllByRole('link', { name: 'Explore More' });
    const hrefs = ctaLinks.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain(expectedHref);
  });

  it('ignores demo slug when it matches no provider row', () => {
    const { getAllByRole } = render(
      <EndorsedProviders demoGuid='test-guid' demoSlug='nonexistent-slug' />,
    );

    expect(getAllByRole('link')).toHaveLength(4);
  });

  it('shows NDA certified legend when a live provider is certified', () => {
    const { getByText } = render(<EndorsedProviders />);

    expect(getByText(new RegExp(NDA_CERTIFIED_LEGEND))).toBeInTheDocument();
  });
});
