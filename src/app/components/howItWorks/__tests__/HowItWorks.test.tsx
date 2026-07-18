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

import HowItWorks from '../HowItWorks';

describe('HowItWorks', () => {
  it('renders the section title', () => {
    render(<HowItWorks />);
    expect(screen.getByText('How it works?')).toBeInTheDocument();
  });

  it('renders introductory description', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/challenges neurodivergent students face/)).toBeInTheDocument();
  });

  it('renders all five step titles', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Enquire')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Quality')).toBeInTheDocument();
    expect(screen.getByText('Guide')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<HowItWorks />);
    expect(screen.getByText('You search for learning organisations')).toBeInTheDocument();
    expect(screen.getByText('You send an inquiry, we promptly respond')).toBeInTheDocument();
    expect(
      screen.getByText('You fill out a profile for the learning provider'),
    ).toBeInTheDocument();
    expect(screen.getByText('We improve experience with great materials')).toBeInTheDocument();
    expect(screen.getByText('We regularly monitor & support learning')).toBeInTheDocument();
  });

  it('renders step icons', () => {
    render(<HowItWorks />);
    expect(screen.getByAltText('explore')).toBeInTheDocument();
    expect(screen.getByAltText('enquire')).toBeInTheDocument();
    expect(screen.getByAltText('profile')).toBeInTheDocument();
    expect(screen.getByAltText('quality')).toBeInTheDocument();
    expect(screen.getByAltText('guide')).toBeInTheDocument();
  });

  it('links to endorsements and courses', () => {
    render(<HowItWorks />);
    expect(screen.getByRole('link', { name: 'Browse endorsed providers' })).toHaveAttribute(
      'href',
      '/endorsements',
    );
    expect(screen.getByRole('link', { name: 'Find neuroinclusive courses' })).toHaveAttribute(
      'href',
      '/courses',
    );
  });
});
