import React from 'react';
import { render } from '@testing-library/react';
import JsonLd from '../JsonLd';

describe('JsonLd', () => {
  it('renders application/ld+json script with stringified data', () => {
    const { container } = render(
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Neurodiversity Academy',
        }}
      />,
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(script?.textContent).toContain('"@type":"Organization"');
    expect(script?.textContent).toContain('Neurodiversity Academy');
  });

  it('escapes less-than characters in JSON output', () => {
    const { container } = render(
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          description: 'Use <script> safely',
        }}
      />,
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.textContent).toContain('\\u003cscript');
    expect(script?.textContent).not.toContain('<script');
  });
});
