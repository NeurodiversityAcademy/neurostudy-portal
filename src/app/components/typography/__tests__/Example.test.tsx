import React from 'react';
import { render, screen } from '@testing-library/react';
import ExampleComponent from '../Example';

describe('ExampleComponent', () => {
  it('renders all typography variants', () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Heading 1 Text')).toBeInTheDocument();
    expect(screen.getByText('Subheading Text')).toBeInTheDocument();
    expect(screen.getByText('Body 1 Text')).toBeInTheDocument();
    expect(screen.getByText('Body 2 Strong Text')).toBeInTheDocument();
    expect(screen.getByText('Body 2 Text')).toBeInTheDocument();
  });

  it('renders h1 for Heading 1', () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Heading 1 Text').tagName).toBe('H1');
  });

  it('renders h2 for Subheading', () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Subheading Text').tagName).toBe('H2');
  });
});
