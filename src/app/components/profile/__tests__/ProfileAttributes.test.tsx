import React from 'react';
import { render, screen } from '@testing-library/react';

import ProfileEmptyDescription from '../ProfileAttributes/ProfileEmptyDescription';

describe('ProfileEmptyDescription', () => {
  it('renders N/A text', () => {
    render(<ProfileEmptyDescription />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    const { container } = render(<ProfileEmptyDescription />);
    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
