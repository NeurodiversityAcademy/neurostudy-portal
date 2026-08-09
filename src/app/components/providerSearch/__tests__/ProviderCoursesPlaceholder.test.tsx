/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import ProviderCoursesPlaceholder from '../ProviderCoursesPlaceholder';

jest.mock('@/app/utilities/providerSearch/providerSearchGa', () => ({
  trackProviderCoursesPlaceholderView: jest.fn(),
}));

import { trackProviderCoursesPlaceholderView } from '@/app/utilities/providerSearch/providerSearchGa';

describe('ProviderCoursesPlaceholder', () => {
  it('renders an empty courses list without a profile CTA', () => {
    render(<ProviderCoursesPlaceholder providerSlug='collarts' providerName='Collarts' />);

    expect(screen.getByText('Courses from Collarts')).toBeInTheDocument();
    expect(screen.getByText('No courses listed yet')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View provider profile' })).not.toBeInTheDocument();
    expect(trackProviderCoursesPlaceholderView).toHaveBeenCalledWith('collarts');
  });
});
