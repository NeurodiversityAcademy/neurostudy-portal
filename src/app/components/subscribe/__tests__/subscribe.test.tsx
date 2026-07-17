import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, fill: _fill, ...rest } = props;
    const imgSrc =
      typeof src === 'object' && src !== null
        ? (src as { src?: string }).src || ''
        : String(src || '');
    return <img {...rest} src={imgSrc} />;
  },
}));

jest.mock('@/app/utilities/register/registerSubscriptionData', () => ({
  registerSubscriptionData: jest.fn(),
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: jest.fn(),
}));

import { registerSubscriptionData } from '@/app/utilities/register/registerSubscriptionData';
import { notifyError } from '@/app/utilities/common';
import Subscribe from '../subscribe';

const mockRegisterSubscriptionData = registerSubscriptionData as jest.Mock;
const mockNotifyError = notifyError as jest.Mock;

const fillSubscribeForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Email address'), {
    target: { value: 'user@example.com' },
  });
  fireEvent.focus(screen.getByPlaceholderText('Select your role'));
  fireEvent.click(screen.getByText('Education Professional'));
};

describe('Subscribe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterSubscriptionData.mockResolvedValue({ id: 'sub-1' });
  });

  it('renders subscription form', () => {
    render(<Subscribe />);
    expect(screen.getByText('Subscribe to our Newsletter!')).toBeInTheDocument();
    expect(
      screen.getByText('Be the first to get exclusive offers and latest news'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  });

  it('allows typing email address', () => {
    render(<Subscribe />);
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'user@example.com' },
    });
    expect(screen.getByPlaceholderText('Email address')).toHaveValue(
      'user@example.com',
    );
  });

  it('shows success message after successful submission', async () => {
    render(<Subscribe />);
    fillSubscribeForm();

    await act(async () => {
      fireEvent.click(screen.getByText('Subscribe Now'));
    });

    await waitFor(() => {
      expect(mockRegisterSubscriptionData).toHaveBeenCalledWith({
        email: 'user@example.com',
        hs_persona: 'persona_3',
      });
      expect(
        screen.getByText('Thank you for subscribing to'),
      ).toBeInTheDocument();
      expect(screen.getByText('Neurodiversity Academy!')).toBeInTheDocument();
    });
  });

  it('shows error notification when submission fails', async () => {
    const error = new Error('Subscription failed');
    mockRegisterSubscriptionData.mockRejectedValue(error);
    render(<Subscribe />);
    fillSubscribeForm();

    await act(async () => {
      fireEvent.click(screen.getByText('Subscribe Now'));
    });

    await waitFor(() => {
      expect(mockNotifyError).toHaveBeenCalledWith(error);
    });
  });
});
