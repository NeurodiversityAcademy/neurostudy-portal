/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import ProviderCoursesPlaceholder from '../ProviderCoursesPlaceholder';

jest.mock('@/app/utilities/providerSearch/providerSearchGa', () => ({
  trackProviderCoursesPlaceholderView: jest.fn(),
}));

jest.mock('../../buttons/ActionButton', () => ({
  __esModule: true,
  default: ({ label, to }: { label: string; to?: string }) => <a href={to}>{label}</a>,
}));

import { trackProviderCoursesPlaceholderView } from '@/app/utilities/providerSearch/providerSearchGa';

describe('ProviderCoursesPlaceholder', () => {
  it('renders coming-soon copy, profile CTA, and tracks view', () => {
    render(<ProviderCoursesPlaceholder providerSlug='collarts' providerName='Collarts' />);

    expect(screen.getByText('Courses from Collarts')).toBeInTheDocument();
    expect(screen.getByText(/Courses are coming soon/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View provider profile' })).toHaveAttribute(
      'href',
      '/endorsedproviders/collarts',
    );
    expect(trackProviderCoursesPlaceholderView).toHaveBeenCalledWith('collarts');
  });
});
