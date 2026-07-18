import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/app/components/tabSection/CourseDetailsBenefitsBody', () => ({
  __esModule: true,
  default: ({ source }: { source: string }) => (
    <div data-testid='benefits-body'>Source: {source}</div>
  ),
}));

import CourseDetailsBenefitTab from '../CourseDetailsBenefitTab';

describe('CourseDetailsBenefitTab', () => {
  it('renders benefits tab section title', () => {
    render(<CourseDetailsBenefitTab />);
    expect(screen.getByText('Benefits of this course')).toBeInTheDocument();
  });

  it('renders all benefit tabs', () => {
    render(<CourseDetailsBenefitTab />);

    expect(screen.getByText('Support Available')).toBeInTheDocument();
    expect(screen.getByText('Possible Adjustments*')).toBeInTheDocument();
    expect(screen.getByText('Possible Job Requirements')).toBeInTheDocument();
  });

  it('shows support content by default', () => {
    render(<CourseDetailsBenefitTab />);
    expect(screen.getByTestId('benefits-body')).toHaveTextContent('Source: support');
  });

  it('switches to adjustment content when tab is clicked', () => {
    render(<CourseDetailsBenefitTab />);

    fireEvent.click(screen.getByText('Possible Adjustments*'));

    expect(screen.getByTestId('benefits-body')).toHaveTextContent('Source: adjustment');
  });

  it('switches to jobs content when tab is clicked', () => {
    render(<CourseDetailsBenefitTab />);

    fireEvent.click(screen.getByText('Possible Job Requirements'));

    expect(screen.getByTestId('benefits-body')).toHaveTextContent('Source: jobs');
  });

  it('renders disclaimer text', () => {
    render(<CourseDetailsBenefitTab />);
    expect(screen.getByText(/These are possible reasonable adjustments/)).toBeInTheDocument();
  });
});
