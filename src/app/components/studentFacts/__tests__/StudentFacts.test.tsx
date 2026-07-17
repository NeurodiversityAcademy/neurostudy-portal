import React from 'react';
import { render, screen } from '@testing-library/react';

import StudentFacts from '../StudentFacts';

describe('StudentFacts', () => {
  it('renders section title', () => {
    render(<StudentFacts />);
    expect(
      screen.getByText('Neurodiversity in Adult Education'),
    ).toBeInTheDocument();
  });

  it('renders statistic values', () => {
    render(<StudentFacts />);
    expect(screen.getByText('163%')).toBeInTheDocument();
    expect(screen.getByText('15–25%')).toBeInTheDocument();
    expect(screen.getByText('30–50%')).toBeInTheDocument();
  });

  it('renders statistic descriptions', () => {
    render(<StudentFacts />);
    expect(
      screen.getByText(/Increase in students starting university/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Improvement in retention is linked to access/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Neurodivergent students do not formally disclose/),
    ).toBeInTheDocument();
  });

  it('renders reference footnote', () => {
    render(<StudentFacts />);
    expect(
      screen.getByText('*People with Disability in Australia 2022'),
    ).toBeInTheDocument();
  });
});
