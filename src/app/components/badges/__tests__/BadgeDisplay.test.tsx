import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

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
