import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('@/app/hooks/useHideOverflowEffect', () => ({
  __esModule: true,
  default: () => () => () => {},
}));

import ApplyNowPopup from '../ApplyNowPopup';

describe('ApplyNowPopup', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders form fields when open', () => {
    render(<ApplyNowPopup {...defaultProps} />);

    expect(screen.getByText('Apply for this course')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ApplyNowPopup open={false} onClose={jest.fn()} />);
    expect(screen.queryByText('Apply for this course')).not.toBeInTheDocument();
  });

  it('submits form and shows success message', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ApplyNowPopup {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Your full name'), 'Jane Doe');
    await user.type(screen.getByPlaceholderText('Phone number'), '0400000000');
    await user.type(screen.getByPlaceholderText('Email address'), 'jane@example.com');

    await user.click(screen.getByRole('button', { name: /submit application/i }));

    await act(async () => {
      jest.advanceTimersByTime(700);
    });

    await waitFor(() => {
      expect(screen.getByText(/your application has been received/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /submitted/i })).toBeDisabled();
  });

  it('renders course interested illustration', () => {
    render(<ApplyNowPopup {...defaultProps} />);
    expect(screen.getByAltText('Interested in this course')).toBeInTheDocument();
  });
});
