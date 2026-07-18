import React from 'react';
import { render, screen } from '@testing-library/react';

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

jest.mock('@/app/components/emergingInstitutions/EmergingProviderHero', () => ({
  __esModule: true,
  default: () => <div>Hero</div>,
}));
jest.mock('@/app/components/emergingInstitutions/EmergingProviderStudentSuitability', () => ({
  __esModule: true,
  default: () => <div>Suitability</div>,
}));
jest.mock('@/app/components/emergingInstitutions/EmergingProviderStats', () => ({
  __esModule: true,
  default: () => <div>Stats</div>,
}));
jest.mock('@/app/components/emergingInstitutions/EmergingProvidersFAQs', () => ({
  __esModule: true,
  default: () => <div>FAQs</div>,
}));

import EmergingProviderPage from '../page';

describe('Emerging provider page', () => {
  it('links back to endorsements and home', async () => {
    const page = await EmergingProviderPage({
      params: Promise.resolve({ 'name-of-the-institute': 'bond-university' }),
    });

    render(page);

    expect(screen.getByRole('navigation', { name: 'Related pages' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NDA endorsements' })).toHaveAttribute(
      'href',
      '/endorsements',
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });
});
