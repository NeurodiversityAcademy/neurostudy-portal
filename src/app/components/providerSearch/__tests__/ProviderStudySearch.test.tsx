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
  default: ({ label, disabled, type }: { label: string; disabled?: boolean; type?: string }) => (
    <button type={type === 'submit' ? 'submit' : 'button'} disabled={disabled}>
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
  });

  it('allows searching with no selections to browse all providers', async () => {
    const user = userEvent.setup();
    render(
      <ProviderStudySearch
        surface='homepage'
        interestAreaOptions={[
          { label: 'Music', value: 'Music' },
          { label: 'Nursing', value: 'Nursing' },
        ]}
        locationOptions={[
          { label: 'Sydney', value: 'Sydney' },
          { label: 'Melbourne', value: 'Melbourne' },
        ]}
      />,
    );

    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeEnabled();
    await user.click(searchButton);

    await waitFor(() => {
      expect(trackProviderSearchSubmit).toHaveBeenCalledWith({
        surface: 'homepage',
        interestAreas: [],
        locations: [],
      });
      expect(pushMock).toHaveBeenCalledWith('/search');
    });
  });

  it('submits selected filters to /search and tracks GA', async () => {
    const user = userEvent.setup();
    render(
      <ProviderStudySearch
        surface='homepage'
        interestAreaOptions={[
          { label: 'Music', value: 'Music' },
          { label: 'Nursing', value: 'Nursing' },
        ]}
        locationOptions={[
          { label: 'Sydney', value: 'Sydney' },
          { label: 'Melbourne', value: 'Melbourne' },
        ]}
      />,
    );

    await user.selectOptions(screen.getByLabelText('What do you want to study?'), ['Music']);
    await user.selectOptions(screen.getByLabelText('Where do you want to study?'), ['Sydney']);

    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(trackProviderSearchSubmit).toHaveBeenCalledWith({
        surface: 'homepage',
        interestAreas: ['Music'],
        locations: ['Sydney'],
      });
      expect(pushMock).toHaveBeenCalledWith('/search?InterestArea=Music&Location=Sydney');
    });
  });

  it('includes typed draft text like business without requiring a pill', async () => {
    const user = userEvent.setup();
    render(
      <ProviderStudySearch
        surface='homepage'
        interestAreaOptions={[{ label: 'Music', value: 'Music' }]}
        locationOptions={[{ label: 'Sydney', value: 'Sydney' }]}
      />,
    );

    await user.type(screen.getByLabelText('InterestArea-draft'), 'business');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(trackProviderSearchSubmit).toHaveBeenCalledWith({
        surface: 'homepage',
        interestAreas: ['business'],
        locations: [],
      });
      expect(pushMock).toHaveBeenCalledWith('/search?InterestArea=business');
    });
  });
});
