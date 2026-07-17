import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

import EmergingProviderStudentSuitability from '../EmergingProviderStudentSuitability';

describe('EmergingProviderStudentSuitability', () => {
  it('renders default student suitability section title', () => {
    render(<EmergingProviderStudentSuitability instituteSlug='unknown-slug' />);
    expect(screen.getByText('Student Suitability')).toBeInTheDocument();
  });

  it('renders suitability tab labels', () => {
    render(<EmergingProviderStudentSuitability instituteSlug='unknown-slug' />);
    expect(screen.getByText('May Suit Students Who')).toBeInTheDocument();
    expect(screen.getByText('May Be Challenging For Students Who')).toBeInTheDocument();
  });

  it('shows default positive suitability items on first tab', () => {
    render(<EmergingProviderStudentSuitability instituteSlug='unknown-slug' />);
    expect(screen.getByText('Prefer structured academic programs')).toBeInTheDocument();
  });

  it('switches to challenging items when second tab is clicked', () => {
    render(<EmergingProviderStudentSuitability instituteSlug='unknown-slug' />);

    fireEvent.click(screen.getByText('May Be Challenging For Students Who'));

    expect(screen.getByText('Prefer fully online learning')).toBeInTheDocument();
    expect(screen.queryByText('Prefer structured academic programs')).not.toBeInTheDocument();
  });
});
