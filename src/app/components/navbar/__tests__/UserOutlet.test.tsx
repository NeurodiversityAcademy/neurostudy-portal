import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mockSignOut = jest.fn().mockResolvedValue(undefined);

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

import { useSession } from 'next-auth/react';
import UserOutlet from '../UserOutlet';

const mockedUseSession = useSession as jest.Mock;

describe('UserOutlet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Login button when not authenticated', () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    render(<UserOutlet />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders Login as a link to /login', () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    render(<UserOutlet />);
    const link = screen.getByText('Login').closest('a');
    expect(link).toHaveAttribute('href', '/login');
  });

  it('shows Sign Out button when authenticated', () => {
    mockedUseSession.mockReturnValue({
      data: { user: { email: 'test@test.com' } },
      status: 'authenticated',
    });
    render(<UserOutlet />);
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('calls signOut when Sign Out is clicked', async () => {
    mockedUseSession.mockReturnValue({
      data: { user: { email: 'test@test.com' } },
      status: 'authenticated',
    });
    render(<UserOutlet />);
    fireEvent.click(screen.getByText('Sign Out'));
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
  });

  it('shows loader state while session is loading', () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    });
    const { container } = render(<UserOutlet />);
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument();
  });

  it('handles signOut error gracefully', async () => {
    mockedUseSession.mockReturnValue({
      data: { user: { email: 'test@test.com' } },
      status: 'authenticated',
    });
    mockSignOut.mockRejectedValueOnce(new Error('Sign out failed'));

    render(<UserOutlet />);
    fireEvent.click(screen.getByText('Sign Out'));
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
