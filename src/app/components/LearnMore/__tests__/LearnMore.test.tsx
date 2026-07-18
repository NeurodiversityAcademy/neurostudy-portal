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

import LearnMore from '../LearnMore';

describe('LearnMore', () => {
  it('renders a Learn more button', () => {
    render(<LearnMore dest='/test' />);
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  it('renders as a link to the provided destination', () => {
    render(<LearnMore dest='/endorsements' />);
    const link = screen.getByText('Learn more').closest('a');
    expect(link).toHaveAttribute('href', '/endorsements');
  });

  it('renders with different destinations', () => {
    render(<LearnMore dest='/about' />);
    const link = screen.getByText('Learn more').closest('a');
    expect(link).toHaveAttribute('href', '/about');
  });
});
