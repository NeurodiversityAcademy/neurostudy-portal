import React from 'react';
import { render, screen } from '@testing-library/react';

import EndorsedProviderIntroSection from '../EndorsedProviderIntroSection';

describe('EndorsedProviderIntroSection', () => {
  it('renders heading and body text', () => {
    render(
      <EndorsedProviderIntroSection
        heading='Welcome to our program'
        body='This provider offers neuro-inclusive learning.'
      />,
    );

    expect(screen.getByRole('heading', { name: 'Welcome to our program' })).toBeInTheDocument();
    expect(screen.getByText('This provider offers neuro-inclusive learning.')).toBeInTheDocument();
  });
});
