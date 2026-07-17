import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('@/app/utilities/register/registerContactData', () => ({
  registerContactData: jest.fn(),
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

import { registerContactData } from '@/app/utilities/register/registerContactData';
import { notifyError, notifySuccess } from '@/app/utilities/common';
import ContactUsForm from '../ContactUsForm';

const mockRegisterContactData = registerContactData as jest.Mock;
const mockNotifySuccess = notifySuccess as jest.Mock;
const mockNotifyError = notifyError as jest.Mock;

const selectPersona = (label: string) => {
  fireEvent.focus(screen.getByPlaceholderText('Select your role'));
  fireEvent.click(screen.getByText(label));
};

const fillRequiredContactFields = () => {
  fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
    target: { value: 'Jane' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
    target: { value: 'Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
    target: { value: 'jane@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter your message'), {
    target: { value: 'Hello there' },
  });
  selectPersona('Student');
};

describe('ContactUsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterContactData.mockResolvedValue({ id: 'contact-1' });
  });

  it('renders form fields and submit button', () => {
    render(<ContactUsForm />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('allows typing into form fields', () => {
    render(<ContactUsForm />);
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'jane@example.com' },
    });
    expect(screen.getByPlaceholderText('Enter your first name')).toHaveValue('Jane');
    expect(screen.getByPlaceholderText('Enter your last name')).toHaveValue('Doe');
    expect(screen.getByPlaceholderText('Enter your email address')).toHaveValue(
      'jane@example.com',
    );
  });

  it('submits valid form data successfully', async () => {
    render(<ContactUsForm />);
    fillRequiredContactFields();

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(mockRegisterContactData).toHaveBeenCalledWith({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        phone: undefined,
        message: 'Hello there',
        hs_persona: 'persona_1',
      });
      expect(mockNotifySuccess).toHaveBeenCalledWith('Successfully sent');
    });
  });

  it('shows error notification when submission fails', async () => {
    const error = new Error('Submission failed');
    mockRegisterContactData.mockRejectedValue(error);
    render(<ContactUsForm />);
    fillRequiredContactFields();

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(mockNotifyError).toHaveBeenCalledWith(error);
    });
  });
});
