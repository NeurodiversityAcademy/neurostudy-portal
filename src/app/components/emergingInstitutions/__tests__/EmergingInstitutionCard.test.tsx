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

jest.mock('../emergingProvidersGa', () => ({
  buildEmergingExploreMoreAnalytics: ({
    providerSlug,
    destinationPath,
  }: {
    providerSlug: string;
    destinationPath: string;
  }) => ({
    eventName: 'emerging_cta_click',
    category: 'Emerging',
    fileName: providerSlug,
    params: { destination_path: destinationPath },
  }),
}));

import EmergingInstitutionCard from '../EmergingInstitutionCard';

describe('EmergingInstitutionCard', () => {
  it('renders live institution with same-tab detail link', () => {
    render(<EmergingInstitutionCard name='Bond University' state='QLD' />);

    expect(screen.getByText('Bond University')).toBeInTheDocument();
    expect(screen.getByText('QLD')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Explore More' });
    expect(link).toHaveAttribute('href', '/emergingproviders/bond-university');
    expect(link).not.toHaveAttribute('target', '_blank');
  });

  it('renders coming soon for demo institutions', () => {
    render(<EmergingInstitutionCard name='Demo College' state='VIC' demo />);
    expect(screen.getByText('Demo College')).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Explore More' })).not.toBeInTheDocument();
  });

  it('applies a state tint on the card header', () => {
    const { container } = render(<EmergingInstitutionCard name='Bond University' state='QLD' />);
    expect(container.querySelector('[data-state-tint="QLD"]')).toBeInTheDocument();
  });
});
