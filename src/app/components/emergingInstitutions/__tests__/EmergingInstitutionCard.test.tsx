import React from 'react';
import { render, screen } from '@testing-library/react';

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

import EmergingInstitutionCard from '../EmergingInstitutionCard';

describe('EmergingInstitutionCard', () => {
  it('renders institution name with link', () => {
    render(<EmergingInstitutionCard name='Example College' href='/institutions/example-college' />);

    expect(screen.getByText('Example College')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/institutions/example-college');
  });
});
