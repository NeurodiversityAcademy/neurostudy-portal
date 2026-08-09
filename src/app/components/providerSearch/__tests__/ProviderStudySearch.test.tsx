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
  }: {
    name: 'InterestArea' | 'Location';
    label: string;
  }) {
    const { useFormContext } = require('react-hook-form');
    const { setValue, watch } = useFormContext();
    const value = watch(name) ?? [];
    return (
      <label>
        {label}
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
      </label>
    );
  },
}));

import { trackProviderSearchSubmit } from '@/app/utilities/providerSearch/providerSearchGa';

describe('ProviderStudySearch', () => {
  beforeEach(() => {
    pushMock.mockReset();
    (trackProviderSearchSubmit as jest.Mock).mockClear();
  });

  it('disables search until an area or location is selected', () => {
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

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
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
});
