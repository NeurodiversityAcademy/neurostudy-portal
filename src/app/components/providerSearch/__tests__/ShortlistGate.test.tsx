/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShortlistGate from '../ShortlistGate';

const providers = [
  { slug: 'nepean-community-college', name: 'Nepean Community College' },
  { slug: 'campion-college-australia', name: 'Campion College Australia' },
  { slug: 'asa-institute-of-higher-education', name: 'ASA Institute of Higher Education' },
  { slug: 'holmes-institute', name: 'Holmes Institute' },
];

const filters = { interestAreas: ['IT'], locations: ['NSW'] };

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe('ShortlistGate', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('renders nothing when disabled or when there is nothing to compare', () => {
    const { rerender } = render(
      <ShortlistGate enabled={false} providers={providers} filters={filters} />,
    );
    expect(screen.queryByText('Compare providers side by side')).not.toBeInTheDocument();

    rerender(<ShortlistGate enabled providers={providers.slice(0, 1)} filters={filters} />);
    expect(screen.queryByText('Compare providers side by side')).not.toBeInTheDocument();
  });

  it('counts and enforces the three-provider limit as pill selections', async () => {
    const user = userEvent.setup();
    render(<ShortlistGate enabled providers={providers} filters={filters} />);

    await user.click(screen.getByRole('link', { name: 'Nepean Community College' }));
    await user.click(screen.getByRole('link', { name: 'Campion College Australia' }));
    await user.click(screen.getByRole('link', { name: 'ASA Institute of Higher Education' }));
    await user.click(screen.getByRole('link', { name: 'Holmes Institute' }));

    expect(screen.getByText('You can compare up to three providers.')).toBeInTheDocument();
    expect(screen.getByText('3/3 selected')).toBeInTheDocument();
  });

  it('loads the comparison as soon as two provider pills are selected', async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn().mockResolvedValue(
      jsonResponse({
        ok: true,
        providers: [
          {
            slug: 'nepean-community-college',
            name: 'Nepean Community College',
            tier: 'endorsed',
            type: 'VET',
            locations: ['Sydney'],
            ndaCertified: true,
            supportInPlace: 43,
            supportInWorks: 8,
            supportSections: [
              {
                title: 'Learning support',
                items: [{ label: 'Peer mentoring', status: 'Supports in place' }],
              },
            ],
            qilt: null,
            detailHref: '/endorsedproviders/nepean-community-college',
          },
          {
            slug: 'campion-college-australia',
            name: 'Campion College Australia',
            tier: 'emerging',
            type: 'Emerging provider',
            locations: ['Sydney'],
            ndaCertified: false,
            supportInPlace: null,
            supportInWorks: null,
            supportSections: [],
            qilt: null,
            detailHref: '',
          },
        ],
      }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<ShortlistGate enabled providers={providers} filters={filters} />);

    await user.click(screen.getByRole('link', { name: 'Nepean Community College' }));
    await user.click(screen.getByRole('link', { name: 'Campion College Australia' }));

    await waitFor(() => {
      expect(screen.getByText(/No provider is marked best/)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/providerCompare?slugs=nepean-community-college%2Ccampion-college-australia',
    );
  });
});
