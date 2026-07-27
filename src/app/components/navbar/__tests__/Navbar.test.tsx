import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

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

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signOut: jest.fn(),
}));

import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the nav element', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders the logo link to home', () => {
    render(<Navbar />);
    const logoLink = screen.getByAltText('logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders main navigation links', () => {
    render(<Navbar />);
    expect(screen.getAllByText('Endorsements').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Emerging Providers').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Neurodivergent Mates').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('About Us').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contact').length).toBeGreaterThanOrEqual(1);
  });

  it('does not render Profile link', () => {
    render(<Navbar />);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('renders correct link hrefs for main nav', () => {
    render(<Navbar />);
    const endorseLink = screen.getAllByText('Endorsements')[0].closest('a');
    expect(endorseLink).toHaveAttribute('href', '/endorsements');

    const emergingLink = screen.getAllByText('Emerging Providers')[0].closest('a');
    expect(emergingLink).toHaveAttribute('href', '/emergingproviders');
  });

  it('renders hamburger menu image', () => {
    render(<Navbar />);
    expect(screen.getByAltText('hamburger menu')).toBeInTheDocument();
  });

  it('shows dropdown menu when hamburger is clicked', () => {
    render(<Navbar />);
    const hamburger = screen.getByAltText('hamburger menu');
    fireEvent.click(hamburger);

    expect(screen.getAllByText('Emerging Providers').length).toBeGreaterThanOrEqual(2);
  });

  it('hides dropdown when a link is clicked', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByAltText('hamburger menu'));
    expect(screen.getAllByText('Emerging Providers').length).toBeGreaterThanOrEqual(2);

    const emergingLinks = screen.getAllByText('Emerging Providers');
    const dropdownLink = emergingLinks[emergingLinks.length - 1].closest('a');
    expect(dropdownLink).not.toBeNull();
    fireEvent.click(dropdownLink!);

    expect(screen.getAllByText('Emerging Providers')).toHaveLength(1);
  });

  it('closes dropdown on outside click', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByAltText('hamburger menu'));
    expect(screen.getAllByText('Emerging Providers').length).toBeGreaterThanOrEqual(2);

    fireEvent.click(document.body);

    expect(screen.getAllByText('Emerging Providers')).toHaveLength(1);
  });

  it('does not render Login button when not authenticated', () => {
    render(<Navbar />);
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
});
