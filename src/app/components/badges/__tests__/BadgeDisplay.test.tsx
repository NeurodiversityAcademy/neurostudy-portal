import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

import BadgeDisplay from '../BadgeDisplay';

describe('BadgeDisplay', () => {
  it('renders badge image', () => {
    render(<BadgeDisplay />);
    expect(screen.getByAltText('Common Badge')).toBeInTheDocument();
  });

  it('renders a wrapper div', () => {
    const { container } = render(<BadgeDisplay />);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });
});
