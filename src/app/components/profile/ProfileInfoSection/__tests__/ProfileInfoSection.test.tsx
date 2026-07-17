import React, { createRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

jest.mock('@/app/utilities/common', () => ({
  notifyInProgress: jest.fn(),
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

const mockProfileContext = {
  data: {
    FirstName: 'John',
    LastName: 'Doe',
    Email: 'john@example.com',
    Age: 25,
  },
  isLoading: false,
  isEditing: true,
  saveData: jest.fn(),
  courses: [],
};

jest.mock('@/app/utilities/profile/ProfileProvider', () => ({
  useProfileContext: () => mockProfileContext,
}));

import ProfileInfoSection from '../index';
import { notifyInProgress } from '@/app/utilities/common';

describe('ProfileInfoSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileContext.isLoading = false;
    mockProfileContext.data = {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      Age: 25,
    };
  });

  it('renders personal information card title', () => {
    render(<ProfileInfoSection />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('renders form fields with default values from profile context', () => {
    render(<ProfileInfoSection />);
    expect(screen.getByPlaceholderText('First Name')).toHaveValue('John');
    expect(screen.getByPlaceholderText('Last Name')).toHaveValue('Doe');
    expect(screen.getByPlaceholderText('Age')).toHaveValue(25);
    expect(screen.getByPlaceholderText('Email Address')).toHaveValue(
      'john@example.com',
    );
  });

  it('disables email field', () => {
    render(<ProfileInfoSection />);
    expect(screen.getByPlaceholderText('Email Address')).toBeDisabled();
  });

  it('shows loader when profile data is loading', () => {
    mockProfileContext.isLoading = true;
    const { container } = render(<ProfileInfoSection />);
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument();
  });

  it('exposes react-hook-form methods via ref', () => {
    const ref = createRef<ProfileSectionRef>();
    render(<ProfileInfoSection ref={ref} />);
    expect(ref.current?.methods).toBeDefined();
    expect(ref.current?.methods.getValues).toBeDefined();
    expect(ref.current?.methods.trigger).toBeDefined();
  });

  it('handles missing profile data gracefully', () => {
    mockProfileContext.data = undefined;
    render(<ProfileInfoSection />);
    expect(screen.getByPlaceholderText('First Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Last Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Email Address')).toHaveValue('');
  });

  it('registers form submit handler on the form element', () => {
    render(<ProfileInfoSection />);
    const form = screen.getByPlaceholderText('First Name').closest('form');
    expect(form).toBeInTheDocument();
  });

  it('calls notifyInProgress on form submit', async () => {
    render(<ProfileInfoSection />);
    const form = screen.getByPlaceholderText('First Name').closest('form')!;

    fireEvent.submit(form);

    await waitFor(() => {
      expect(notifyInProgress).toHaveBeenCalled();
    });
  });

  it('shows age validation error for non-numeric input', async () => {
    const ref = createRef<ProfileSectionRef>();
    render(<ProfileInfoSection ref={ref} />);

    ref.current?.methods.setValue('Age', 'not-a-number' as never);
    await ref.current?.methods.trigger('Age');

    await waitFor(() => {
      expect(screen.getByText('"Number" type expected.')).toBeInTheDocument();
    });
  });

  it('shows age validation error for zero or negative values', async () => {
    const ref = createRef<ProfileSectionRef>();
    render(<ProfileInfoSection ref={ref} />);

    ref.current?.methods.setValue('Age', 0);
    await ref.current?.methods.trigger('Age');

    await waitFor(() => {
      expect(
        screen.getByText('Value should be greater than 0.')
      ).toBeInTheDocument();
    });
  });
});
