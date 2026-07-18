import React from 'react';
import { render, screen } from '@testing-library/react';

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

import Footer from '../Footer';

describe('Footer', () => {
  it('renders the footer landmark', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Footer />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('renders the acknowledgement text', () => {
    render(<Footer />);
    expect(screen.getByText(/Traditional Owners/i)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    expect(screen.getByTitle('Visit our Facebook page')).toBeInTheDocument();
    expect(screen.getByTitle('Visit our Linkedin page')).toBeInTheDocument();
    expect(screen.getByTitle('Visit our Instagram page')).toBeInTheDocument();
    expect(screen.getByTitle('Visit our Twitter page')).toBeInTheDocument();
  });

  it('renders social links with correct hrefs', () => {
    render(<Footer />);
    expect(screen.getByTitle('Visit our Facebook page').closest('a')).toHaveAttribute(
      'href',
      'https://www.facebook.com/neurodiversityacademy',
    );
  });

  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Endorsements')).toBeInTheDocument();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Partner with Us')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Footer />);
    expect(screen.getByText('Articles').closest('a')).toHaveAttribute('href', '/articles');
    expect(screen.getByText('Endorsements').closest('a')).toHaveAttribute('href', '/endorsements');
  });

  it('renders contact email link', () => {
    render(<Footer />);
    const emailLinks = screen.getAllByText(/info@/);
    expect(emailLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders Navigate heading', () => {
    render(<Footer />);
    expect(screen.getByText('Navigate')).toBeInTheDocument();
  });

  it('renders Contact Us heading', () => {
    render(<Footer />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/All Rights Reserved/)).toBeInTheDocument();
  });

  it('renders Terms of Service text', () => {
    render(<Footer />);
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('renders Privacy Policy link', () => {
    render(<Footer />);
    const privacyLink = screen.getByText('Privacy Policy').closest('a');
    expect(privacyLink).toHaveAttribute('href', expect.stringContaining('Privacy+Policy'));
    expect(privacyLink).toHaveAttribute('target', '_blank');
  });

  it('sets rel=noopener noreferrer on social links', () => {
    render(<Footer />);
    const fbLink = screen.getByTitle('Visit our Facebook page').closest('a');
    expect(fbLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
