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

import ContactUsLeftBanner from '../ContactUsLeftBanner';

describe('ContactUsLeftBanner', () => {
  it('renders Contact Us heading', () => {
    render(<ContactUsLeftBanner />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ContactUsLeftBanner />);
    expect(screen.getByText(/We will try our best to get back to you/)).toBeInTheDocument();
  });

  it('renders as a div', () => {
    const { container } = render(<ContactUsLeftBanner />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });
});
