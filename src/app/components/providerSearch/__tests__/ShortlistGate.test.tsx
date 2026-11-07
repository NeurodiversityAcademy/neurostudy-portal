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

  const mixedProviders = [
    { slug: 'endorsed-one', name: 'Endorsed One', kind: 'endorsed' as const, ndaCertified: true },
    { slug: 'endorsed-two', name: 'Endorsed Two', kind: 'endorsed' as const },
    { slug: 'emerging-vic', name: 'Emerging VIC', kind: 'emerging' as const, emergingState: 'VIC' },
    {
      slug: 'emerging-qld',
      name: 'Emerging QLD',
      kind: 'emerging' as const,
      emergingState: 'QLD',
      ndaCertified: true,
    },
    { slug: 'emerging-default', name: 'Emerging Default', kind: 'emerging' as const },
    {
      slug: 'emerging-custom',
      name: 'Emerging Custom',
      kind: 'emerging' as const,
      emergingState: 'XX',
    },
  ];

  it('groups providers by tier and state, including certified stars and state tints', () => {
    render(<ShortlistGate enabled providers={mixedProviders} filters={filters} />);

    expect(screen.getByText('Verified & Endorsed')).toBeInTheDocument();
    expect(screen.getByText('VIC')).toBeInTheDocument();
    expect(screen.getByText('QLD')).toBeInTheDocument();
    expect(screen.getByText('NSW')).toBeInTheDocument();
    expect(screen.getByText('XX')).toBeInTheDocument();
    expect(screen.getByText('Endorsed One')).toBeInTheDocument();
    expect(screen.getByText('Emerging VIC')).toBeInTheDocument();
    expect(screen.getAllByText('★')).toHaveLength(2);
  });

  it('shows the server error reason when the comparison request is rejected', async () => {
    const user = userEvent.setup();
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        jsonResponse({ ok: false, reason: 'invalid_request' }, 400),
      ) as unknown as typeof fetch;

    render(<ShortlistGate enabled providers={providers} filters={filters} />);
    await user.click(screen.getByRole('link', { name: 'Nepean Community College' }));
    await user.click(screen.getByRole('link', { name: 'Campion College Australia' }));

    await waitFor(() => {
      expect(
        screen.getByText('Choose between two and three providers, then try again.'),
      ).toBeInTheDocument();
    });
  });

  it('falls back to a locked message when an error response has no body', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => {
        throw new Error('no body');
      },
    }) as unknown as typeof fetch;

    render(<ShortlistGate enabled providers={providers} filters={filters} />);
    await user.click(screen.getByRole('link', { name: 'Nepean Community College' }));
    await user.click(screen.getByRole('link', { name: 'Campion College Australia' }));

    await waitFor(() => {
      expect(
        screen.getByText('The comparison could not be loaded. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('shows an "ok: false" response reason without displaying a table', async () => {
    const user = userEvent.setup();
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        jsonResponse({ ok: false, reason: 'not_available' }),
      ) as unknown as typeof fetch;

    render(<ShortlistGate enabled providers={providers} filters={filters} />);
    await user.click(screen.getByRole('link', { name: 'Nepean Community College' }));
    await user.click(screen.getByRole('link', { name: 'Campion College Australia' }));

    await waitFor(() => {
      expect(screen.getByText('Comparison is not available right now.')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
  });

  it('shows a network message when the fetch itself throws', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    render(<ShortlistGate enabled providers={providers} filters={filters} />);
    await user.click(screen.getByRole('link', { name: 'Nepean Community College' }));
    await user.click(screen.getByRole('link', { name: 'Campion College Australia' }));

    await waitFor(() => {
      expect(
        screen.getByText('Network problem. Please check your connection and retry.'),
      ).toBeInTheDocument();
    });
  });

  it('clears the selection and comparison when Clear selection is clicked', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue(
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
            supportInPlace: 1,
            supportInWorks: 0,
            supportSections: [],
            qilt: null,
            detailHref: '',
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
    ) as unknown as typeof fetch;

    render(<ShortlistGate enabled providers={providers} filters={filters} />);
    await user.click(screen.getByRole('link', { name: 'Nepean Community College' }));
    await user.click(screen.getByRole('link', { name: 'Campion College Australia' }));

    await waitFor(() => {
      expect(screen.getByText('Comparison ready.')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(screen.getByText('Select at least two providers')).toBeInTheDocument();
    expect(screen.queryByText('Comparison ready.')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument();
  });
});
