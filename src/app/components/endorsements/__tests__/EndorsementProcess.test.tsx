import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

import EndorsementProcess from '../EndorsementProcess';

describe('EndorsementProcess', () => {
  it('renders section heading', () => {
    render(<EndorsementProcess />);
    expect(
      screen.getByRole('heading', { name: 'How does the endorsement work?' }),
    ).toBeInTheDocument();
  });

  it('renders all endorsement steps', () => {
    render(<EndorsementProcess />);
    expect(screen.getByText('Assessed')).toBeInTheDocument();
    expect(screen.getByText('Identified')).toBeInTheDocument();
    expect(screen.getByText('Endorsed')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<EndorsementProcess />);
    expect(screen.getByText(/Organisation completes/)).toBeInTheDocument();
    expect(screen.getByText(/Neuroinclusion supports identified/)).toBeInTheDocument();
    expect(screen.getByText(/Endorsement agreed/)).toBeInTheDocument();
    expect(screen.getByText(/Student feedback assessed/)).toBeInTheDocument();
    expect(screen.getByText(/Browse organisations/)).toBeInTheDocument();
  });

  it('renders as an ordered list with five steps', () => {
    render(<EndorsementProcess />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list.querySelectorAll('li')).toHaveLength(5);
  });
});
