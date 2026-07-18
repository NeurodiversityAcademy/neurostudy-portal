import React from 'react';
import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('next/script', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { children, ...rest } = props;
    return <script {...rest}>{children as React.ReactNode}</script>;
  },
}));

import TabNavEmbed from '../TabNavEmbed';
import { TABNAV_WIDGET_SCRIPT_SRC, TABNAV_WIDGET_CONFIG_JSON } from '../tabNavConstants';

describe('TabNavEmbed', () => {
  it('renders a script element with correct src', () => {
    const { container } = render(<TabNavEmbed />);
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('src', TABNAV_WIDGET_SCRIPT_SRC);
  });

  it('passes the config JSON as tnv-data-config', () => {
    const { container } = render(<TabNavEmbed />);
    const script = container.querySelector('script');
    expect(script).toHaveAttribute('tnv-data-config', TABNAV_WIDGET_CONFIG_JSON);
  });

  it('renders a noscript fallback element', () => {
    const { container } = render(<TabNavEmbed />);
    const noscript = container.querySelector('noscript');
    expect(noscript).toBeInTheDocument();
  });

  it('includes accessibility widget link in noscript via SSR', () => {
    const html = renderToStaticMarkup(<TabNavEmbed />);
    expect(html).toContain('https://tabnav.com/accessibility-widget');
    expect(html).toContain('JavaScript is required');
  });
});
