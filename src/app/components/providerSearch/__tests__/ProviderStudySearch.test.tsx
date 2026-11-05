/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProviderStudySearch from '../ProviderStudySearch';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('@/app/utilities/providerSearch/providerSearchGa', () => ({
  trackProviderSearchSubmit: jest.fn(),
}));

jest.mock('../../buttons/ActionButton', () => ({
  __esModule: true,
  default: ({
    label,
    disabled,
    type,
    onClick,
  }: {
    label: string;
    disabled?: boolean;
    type?: string;
    onClick?: () => void;
  }) => (
    <button type={type === 'submit' ? 'submit' : 'button'} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
}));

jest.mock('../../formElements/Pill/Pill', () => ({
  __esModule: true,
  default: ({ label, onClose }: { label: string; onClose?: () => void }) => (
    <button type='button' onClick={onClose}>
      {label}
    </button>
  ),
}));

jest.mock('../../formElements/Dropdown/Dropdown', () => ({
  __esModule: true,
  default: function MockSearchDropdown({
    name,
    label,
    onDraftChange,
  }: {
    name: 'InterestArea' | 'Location';
    label: string;
    onDraftChange?: (draft: string) => void;
  }) {
    const { useFormContext } = require('react-hook-form');
    const { setValue, watch } = useFormContext();
    const value = watch(name) ?? [];
    return (
      <div>
        <span>{label}</span>
        <input
          aria-label={`${name}-draft`}
          onChange={(event) => onDraftChange?.(event.target.value)}
        />
        <select
          aria-label={label}
          multiple
          value={value}
          onChange={(event) => {
            const selected = Array.from(event.target.selectedOptions).map(
              (option: HTMLOptionElement) => option.value,
            );
            setValue(name, selected, { shouldDirty: true, shouldValidate: true });
          }}
        >
          <option value='Music'>Music</option>
          <option value='Nursing'>Nursing</option>
          <option value='Sydney'>Sydney</option>
          <option value='Melbourne'>Melbourne</option>
        </select>
      </div>
    );
  },
}));

import { trackProviderSearchSubmit } from '@/app/utilities/providerSearch/providerSearchGa';

describe('ProviderStudySearch', () => {
  beforeEach(() => {
    pushMock.mockReset();
    (trackProviderSearchSubmit as jest.Mock).mockClear();
    (global as typeof globalThis & { fetch?: jest.Mock }).fetch = jest.fn();
  });

  it('renders the Ask bar as the main search control', () => {
    render(
      <ProviderStudySearch
        surface='homepage'
        interestAreaOptions={[{ label: 'Nursing', value: 'Nursing' }]}
        locationOptions={[{ label: 'Melbourne', value: 'Melbourne' }]}
      />,
    );

    expect(screen.getByPlaceholderText('E.g. Nursing in melbourne')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ask' })).toBeEnabled();
  });

  it('submits natural-language queries and tracks GA', async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ area: 'Nursing', locations: ['Melbourne', 'VIC'] }),
    });
    (global as typeof globalThis & { fetch: jest.Mock }).fetch = fetchMock;

    render(
      <ProviderStudySearch
        surface='homepage'
        interestAreaOptions={[{ label: 'Nursing', value: 'Nursing' }]}
        locationOptions={[
          { label: 'Melbourne', value: 'Melbourne' },
          { label: 'VIC', value: 'VIC' },
        ]}
      />,
    );

    const askInput = screen.getByPlaceholderText('E.g. Nursing in melbourne');
    await user.type(askInput, 'nursing in melbourne');
    await user.click(screen.getByRole('button', { name: 'Ask' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/search/assist',
        expect.objectContaining({ method: 'POST' }),
      );
      expect(trackProviderSearchSubmit).toHaveBeenCalledWith({
        surface: 'homepage',
        interestAreas: ['Nursing'],
        locations: ['Melbourne', 'VIC'],
        mode: 'ask',
      });
      expect(pushMock).toHaveBeenCalledWith(
        '/search?InterestArea=Nursing&Location=Melbourne&Location=VIC',
      );
    });
  });

  it('explains that results remain unchanged when the Ask query cannot be matched', async () => {
    const user = userEvent.setup();
    (global as typeof globalThis & { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ area: null, locations: [] }),
    });

    render(
      <ProviderStudySearch surface='homepage' interestAreaOptions={[]} locationOptions={[]} />,
    );

    await user.type(
      screen.getByPlaceholderText('E.g. Nursing in melbourne'),
      'Business analyst in Cairns',
    );
    await user.click(screen.getByRole('button', { name: 'Ask' }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      "We couldn't match that search, so we're showing all results. Try a supported study area or location.",
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('shows active filter chips under the Ask bar when defaults are supplied', () => {
    render(
      <ProviderStudySearch
        surface='homepage'
        interestAreaOptions={[{ label: 'Nursing', value: 'Nursing' }]}
        locationOptions={[{ label: 'Melbourne', value: 'Melbourne' }]}
        defaultInterestAreas={['Nursing']}
        defaultLocations={['Melbourne']}
      />,
    );

    expect(screen.getByText('Nursing')).toBeInTheDocument();
    expect(screen.getByText('Melbourne')).toBeInTheDocument();
  });
});
