import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, ...rest } = props;
    const imgSrc =
      typeof src === 'object' && src !== null
        ? (src as { src?: string }).src || ''
        : String(src || '');
    return <img {...rest} src={imgSrc} />;
  },
}));

jest.mock('@/app/hooks/useHideOverflowEffect', () => ({
  __esModule: true,
  default: () => () => () => {},
}));

jest.mock('@/app/utilities/register/registerSubscriptionData', () => ({
  registerSubscriptionData: jest.fn(),
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: jest.fn(),
}));

import { registerSubscriptionData } from '@/app/utilities/register/registerSubscriptionData';
import { notifyError } from '@/app/utilities/common';
import HandbookPopup from '../HandbookPopup';

const mockRegisterSubscriptionData = registerSubscriptionData as jest.Mock;
const mockNotifyError = notifyError as jest.Mock;

const fillHandbookForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Email address'), {
    target: { value: 'user@example.com' },
  });
  fireEvent.focus(screen.getByPlaceholderText('Select your role'));
  fireEvent.click(screen.getByText('Education Provider'));
};

describe('HandbookPopup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterSubscriptionData.mockResolvedValue({ id: 'sub-1' });
  });

  it('renders newsletter form when open', () => {
    render(<HandbookPopup open onClose={jest.fn()} />);
    expect(screen.getByText('Subscribe to our Newsletter!')).toBeInTheDocument();
    expect(screen.getByText(/Register your email address to get free access/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Free Download')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(<HandbookPopup open={false} onClose={jest.fn()} />);
    expect(screen.queryByText('Subscribe to our Newsletter!')).not.toBeInTheDocument();
  });

  it('submits form and shows download ready message', async () => {
    render(<HandbookPopup open onClose={jest.fn()} />);
    fillHandbookForm();

    await act(async () => {
      fireEvent.click(screen.getByText('Free Download'));
    });

    await waitFor(() => {
      expect(mockRegisterSubscriptionData).toHaveBeenCalledWith({
        hs_persona: 'persona_2',
        email: 'user@example.com',
        getHandbook: true,
      });
      expect(screen.getByText('Your file is ready to be downloaded...')).toBeInTheDocument();
    });
  });

  it('disables submit button after successful download', async () => {
    render(<HandbookPopup open onClose={jest.fn()} />);
    fillHandbookForm();

    await act(async () => {
      fireEvent.click(screen.getByText('Free Download'));
    });

    await waitFor(() => {
      expect(screen.getByText('Free Download').closest('button')).toBeDisabled();
    });
  });

  it('shows error notification when submission fails', async () => {
    const error = new Error('Subscription failed');
    mockRegisterSubscriptionData.mockRejectedValue(error);
    render(<HandbookPopup open onClose={jest.fn()} />);
    fillHandbookForm();

    await act(async () => {
      fireEvent.click(screen.getByText('Free Download'));
    });

    await waitFor(() => {
      expect(mockNotifyError).toHaveBeenCalledWith(error);
    });
  });
});
