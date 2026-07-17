import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { onClick, ...rest } = props;
    return <img {...rest} onClick={onClick as React.MouseEventHandler<HTMLImageElement>} />;
  },
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
    const endorsementLinks = screen.getAllByText('Endorsements');
    expect(endorsementLinks.length).toBeGreaterThanOrEqual(1);

    const profileLinks = screen.getAllByText('Profile');
    expect(profileLinks.length).toBeGreaterThanOrEqual(1);

    const matesLinks = screen.getAllByText('Neurodivergent Mates');
    expect(matesLinks.length).toBeGreaterThanOrEqual(1);

    const aboutLinks = screen.getAllByText('About Us');
    expect(aboutLinks.length).toBeGreaterThanOrEqual(1);

    const contactLinks = screen.getAllByText('Contact');
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders correct link hrefs for main nav', () => {
    render(<Navbar />);
    const endorseLink = screen.getAllByText('Endorsements')[0].closest('a');
    expect(endorseLink).toHaveAttribute('href', '/endorsements');
  });

  it('renders hamburger menu image', () => {
    render(<Navbar />);
    expect(screen.getByAltText('hamburger menu')).toBeInTheDocument();
  });

  it('shows dropdown menu when hamburger is clicked', () => {
    render(<Navbar />);
    const hamburger = screen.getByAltText('hamburger menu');
    fireEvent.click(hamburger);

    const dropdownProfileLinks = screen.getAllByText('Profile');
    expect(dropdownProfileLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('hides dropdown when a link is clicked', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByAltText('hamburger menu'));
    expect(screen.getAllByText('Profile').length).toBeGreaterThanOrEqual(2);

    const profileLinks = screen.getAllByText('Profile');
    const dropdownLink = profileLinks[profileLinks.length - 1].closest('a');
    expect(dropdownLink).not.toBeNull();
    fireEvent.click(dropdownLink!);

    expect(screen.getAllByText('Profile')).toHaveLength(1);
  });

  it('closes dropdown on outside click', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByAltText('hamburger menu'));
    expect(screen.getAllByText('Profile').length).toBeGreaterThanOrEqual(2);

    fireEvent.click(document.body);

    expect(screen.getAllByText('Profile')).toHaveLength(1);
  });

  it('renders Login button when not authenticated', () => {
    render(<Navbar />);
    const loginButtons = screen.getAllByText('Login');
    expect(loginButtons.length).toBeGreaterThanOrEqual(1);
  });
});
