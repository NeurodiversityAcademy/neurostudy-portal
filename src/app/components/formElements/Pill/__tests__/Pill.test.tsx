import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pill from '../Pill';
import { PillRef } from '@/app/interfaces/Pill';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

describe('Pill', () => {
  it('renders label text', () => {
    render(<Pill label='Apple' />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('does not render close button when not selected', () => {
    render(<Pill label='Apple' selected={false} />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('does not render close button when canClose is false', () => {
    render(<Pill label='Apple' selected canClose={false} />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('calls onClose with value when close button is clicked', () => {
    const handleClose = jest.fn();

    render(
      <Pill
        label='Banana'
        value='banana'
        selected
        onClose={handleClose}
        button-aria-label='Remove'
      />,
    );

    fireEvent.click(screen.getByLabelText('Remove'));
    expect(handleClose).toHaveBeenCalledWith('banana', expect.objectContaining({ type: 'click' }));
  });

  it('calls onFocus with parent container when close button is focused', () => {
    const handleFocus = jest.fn();

    render(
      <Pill
        label='Cherry'
        value='cherry'
        selected
        onFocus={handleFocus}
        button-aria-label='Remove'
      />,
    );

    fireEvent.focus(screen.getByLabelText('Remove'));

    expect(handleFocus).toHaveBeenCalledWith(
      expect.objectContaining({ parent: expect.any(HTMLDivElement) }),
      expect.objectContaining({ type: 'focus' }),
    );
  });

  it('exposes focus via ref imperative handle', () => {
    const ref = createRef<PillRef>();

    render(<Pill ref={ref} label='Apple' value='apple' selected button-aria-label='Remove' />);

    ref.current?.focus();
    expect(screen.getByLabelText('Remove')).toHaveFocus();
  });

  it('disables close button when disabled', () => {
    render(<Pill label='Apple' selected disabled button-aria-label='Remove' />);

    expect(screen.getByLabelText('Remove')).toBeDisabled();
  });
});
