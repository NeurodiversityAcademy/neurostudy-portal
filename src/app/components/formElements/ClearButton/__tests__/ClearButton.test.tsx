import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import ClearButton from '../ClearButton';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

interface FormValues {
  name: string;
}

function ClearButtonHarness({
  defaultValue = 'Hello',
  disabled,
}: {
  defaultValue?: string;
  disabled?: boolean;
}) {
  const methods = useForm<FormValues>({
    defaultValues: { name: defaultValue },
  });
  const value = useWatch({ control: methods.control, name: 'name' });

  return (
    <FormProvider {...methods}>
      <ClearButton
        name='name'
        value={value}
        methods={methods}
        disabled={disabled}
        onClick={jest.fn()}
      />
    </FormProvider>
  );
}

describe('ClearButton', () => {
  it('renders when value is present and not disabled', () => {
    render(<ClearButtonHarness />);
    expect(screen.getByLabelText('Clear')).toBeInTheDocument();
  });

  it('does not render when value is empty', () => {
    render(<ClearButtonHarness defaultValue='' />);
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
  });

  it('does not render when disabled', () => {
    render(<ClearButtonHarness disabled />);
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument();
  });

  it('clears value on click', () => {
    function Harness() {
      const methods = useForm<FormValues>({
        defaultValues: { name: 'Hello' },
      });
      const value = useWatch({ control: methods.control, name: 'name' });
      const onClick = jest.fn();

      return (
        <FormProvider {...methods}>
          <input {...methods.register('name')} aria-label='name-input' />
          <ClearButton name='name' value={value} methods={methods} onClick={onClick} />
        </FormProvider>
      );
    }

    render(<Harness />);

    fireEvent.click(screen.getByLabelText('Clear'));

    expect(screen.getByLabelText('name-input')).toHaveValue('');
  });

  it('invokes optional onClick callback', () => {
    const onClick = jest.fn();

    function Harness() {
      const methods = useForm<FormValues>({
        defaultValues: { name: 'Hello' },
      });
      const value = useWatch({ control: methods.control, name: 'name' });

      return (
        <FormProvider {...methods}>
          <ClearButton name='name' value={value} methods={methods} onClick={onClick} />
        </FormProvider>
      );
    }

    render(<Harness />);
    fireEvent.click(screen.getByLabelText('Clear'));
    expect(onClick).toHaveBeenCalled();
  });
});
