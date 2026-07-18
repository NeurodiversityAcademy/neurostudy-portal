import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useForm, FormProvider, FieldValues } from 'react-hook-form';
import Dropdown from '../Dropdown';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

interface WrapperProps {
  children: React.ReactNode;
  defaultValues?: FieldValues;
}

function TestWrapper({ children, defaultValues = {} }: WrapperProps) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('DropdownInput advanced behaviour', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('closes dropdown and refocuses input on Escape', () => {
    render(
      <TestWrapper>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
      </TestWrapper>,
    );

    const combobox = screen.getByRole('combobox');
    const input = screen.getByPlaceholderText('Select');

    fireEvent.focus(input);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(combobox, { key: 'Escape' });
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('creates a new option when creatable and Enter is pressed', () => {
    const handleChange = jest.fn();

    render(
      <TestWrapper>
        <Dropdown
          name='fruit'
          label='Fruit'
          options={options}
          placeholder='Search'
          creatable
          onChange={handleChange}
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Dragonfruit' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(document.querySelector('input[type="hidden"][name="fruit"]')).toHaveValue('Dragonfruit');
    expect(handleChange).toHaveBeenCalledWith(['Dragonfruit']);
  });

  it('creates a new option via the Add item button', () => {
    render(
      <TestWrapper>
        <Dropdown
          name='fruit'
          label='Fruit'
          options={options}
          placeholder='Search'
          creatable
          closeOnSelect
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Mango' } });

    fireEvent.click(screen.getByText('Add "Mango"'));

    expect(document.querySelector('input[type="hidden"][name="fruit"]')).toHaveValue('Mango');
  });

  it('does not create duplicate creatable options', () => {
    render(
      <TestWrapper defaultValues={{ fruit: 'apple' }}>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Search' creatable />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'apple' } });

    expect(screen.queryByText('Add "apple"')).not.toBeInTheDocument();
  });

  it('does not create items when creatable is false', () => {
    const handleChange = jest.fn();

    render(
      <TestWrapper>
        <Dropdown
          name='fruit'
          label='Fruit'
          options={options}
          placeholder='Search'
          creatable={false}
          onChange={handleChange}
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Dragonfruit' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).not.toHaveBeenCalled();
    expect(document.querySelector('input[type="hidden"][name="fruit"]')).not.toBeInTheDocument();
  });

  it('skips adding creatable value that is already selected', () => {
    const handleChange = jest.fn();

    render(
      <TestWrapper defaultValues={{ fruit: 'custom' }}>
        <Dropdown
          name='fruit'
          label='Fruit'
          options={options}
          placeholder='Search'
          creatable
          onChange={handleChange}
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'custom' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not update input when searchable is false', () => {
    render(
      <TestWrapper>
        <Dropdown
          name='fruit'
          label='Fruit'
          options={options}
          placeholder='Select'
          searchable={false}
        />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Select');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'ban' } });

    expect(input).toHaveValue('');
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('clears single selection when typing in searchable mode', () => {
    render(
      <TestWrapper defaultValues={{ fruit: 'apple' }}>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Search' searchable />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    expect(input).toHaveValue('Apple');

    fireEvent.change(input, { target: { value: 'b' } });
    expect(screen.queryByDisplayValue('apple')).not.toBeInTheDocument();
  });

  it('removes a pill in multiple selection mode', () => {
    render(
      <TestWrapper defaultValues={{ fruits: ['apple', 'banana'] }}>
        <Dropdown name='fruits' label='Fruits' options={options} multiple placeholder='Select' />
      </TestWrapper>,
    );

    const clearButtons = screen.getAllByLabelText('Clear');
    fireEvent.click(clearButtons[0]);

    expect(screen.getByDisplayValue('banana')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('apple')).not.toBeInTheDocument();
  });

  it('deselects an option in multiple selection mode', () => {
    render(
      <TestWrapper defaultValues={{ fruits: ['apple', 'banana'] }}>
        <Dropdown name='fruits' label='Fruits' options={options} multiple placeholder='Select' />
      </TestWrapper>,
    );

    fireEvent.focus(screen.getByPlaceholderText('Select'));
    const appleOption = screen
      .getAllByRole('option')
      .find((option) => option.textContent?.includes('Apple'))!;
    fireEvent.click(appleOption);

    expect(screen.queryByDisplayValue('apple')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('banana')).toBeInTheDocument();
  });

  it('shows label fallback for values not in options', () => {
    render(
      <TestWrapper defaultValues={{ fruit: 'unknown-value' }}>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
      </TestWrapper>,
    );

    expect(screen.getByPlaceholderText('Select')).toHaveValue('unknown-value');
  });

  it('calls onBlur and closes when focus leaves the combobox', () => {
    render(
      <TestWrapper>
        <div>
          <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
          <button type='button'>Outside</button>
        </div>
      </TestWrapper>,
    );

    const combobox = screen.getByRole('combobox');
    const input = screen.getByPlaceholderText('Select');

    fireEvent.focus(input);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    fireEvent.blur(combobox, { relatedTarget: screen.getByText('Outside') });
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('focuses input on wrapper mousedown', () => {
    render(
      <TestWrapper>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Select');
    const wrapper = input.closest('.dropdown-input-wrapper')!;

    fireEvent.mouseDown(wrapper);
    act(() => {
      jest.runAllTimers();
    });

    expect(input).toHaveFocus();
  });

  it('prevents default when wrapper mousedown targets already focused input', () => {
    render(
      <TestWrapper>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Select');
    const wrapper = input.closest('.dropdown-input-wrapper')!;

    input.focus();
    fireEvent.mouseDown(wrapper);

    expect(input).toHaveFocus();
  });

  it('clears input value via clear button in single-select mode', () => {
    render(
      <TestWrapper defaultValues={{ fruit: 'apple' }}>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Clear')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Clear'));
    expect(screen.queryByDisplayValue('apple')).not.toBeInTheDocument();
  });

  it('toggles input focus via expand icon mousedown', () => {
    render(
      <TestWrapper>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Select');
    const expandIcon = input.closest('.dropdown-input-wrapper')!.querySelector('svg')!;

    fireEvent.mouseDown(expandIcon);
    expect(input).toHaveFocus();

    fireEvent.focus(input);
    fireEvent.mouseDown(expandIcon);
    expect(input).not.toHaveFocus();
  });

  it('clears search input on transition end when collapsed', () => {
    render(
      <TestWrapper>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Search' searchable />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'ban' } });

    const listbox = screen.getByRole('listbox');
    fireEvent.blur(screen.getByRole('combobox'), {
      relatedTarget: document.body,
    });
    fireEvent.transitionEnd(listbox, { propertyName: 'opacity' });

    fireEvent.focus(input);
    expect(input).toHaveValue('');
  });

  it('shows No options when filter matches nothing', () => {
    render(
      <TestWrapper>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Search' searchable />
      </TestWrapper>,
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'xyz' } });

    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  it('closes dropdown when disabled', async () => {
    function DisabledDropdown() {
      const methods = useForm({ defaultValues: { fruit: '' } });
      React.useEffect(() => {
        methods.setValue('fruit', 'apple');
      }, [methods]);

      return (
        <FormProvider {...methods}>
          <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' disabled />
        </FormProvider>
      );
    }

    render(<DisabledDropdown />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('calls external onChange when selection changes', () => {
    const handleChange = jest.fn();

    render(
      <TestWrapper>
        <Dropdown
          name='fruit'
          label='Fruit'
          options={options}
          placeholder='Select'
          onChange={handleChange}
        />
      </TestWrapper>,
    );

    fireEvent.focus(screen.getByPlaceholderText('Select'));
    fireEvent.click(screen.getByText('Banana'));

    expect(handleChange).toHaveBeenCalledWith(['banana']);
  });

  it('deselects in single-select mode when option is toggled off', () => {
    render(
      <TestWrapper defaultValues={{ fruit: 'apple' }}>
        <Dropdown name='fruit' label='Fruit' options={options} placeholder='Select' />
      </TestWrapper>,
    );

    fireEvent.focus(screen.getByPlaceholderText('Select'));
    const appleOption = screen
      .getAllByRole('option')
      .find((option) => option.textContent?.includes('Apple'))!;
    fireEvent.click(appleOption);

    expect(screen.queryByDisplayValue('apple')).not.toBeInTheDocument();
  });

  it('renders showInputAsText mode', () => {
    render(
      <TestWrapper>
        <Dropdown name='fruit' label='Fruit' options={options} showInputAsText />
      </TestWrapper>,
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('stores next pill sibling when pill close button receives focus', () => {
    render(
      <TestWrapper defaultValues={{ fruits: ['apple', 'banana'] }}>
        <Dropdown name='fruits' label='Fruits' options={options} multiple placeholder='Select' />
      </TestWrapper>,
    );

    const pillClearButtons = screen
      .getAllByLabelText('Clear')
      .filter((button) => button.closest('[aria-pressed="true"]'));

    fireEvent.focus(pillClearButtons[0]);
    fireEvent.click(pillClearButtons[0]);

    expect(screen.queryByDisplayValue('apple')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('banana')).toBeInTheDocument();
  });
});
