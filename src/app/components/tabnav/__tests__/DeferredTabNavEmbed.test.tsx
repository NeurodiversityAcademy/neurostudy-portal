import React from 'react';
import { act, render } from '@testing-library/react';

jest.mock('next/script', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { children, ...rest } = props;
    return <script {...rest}>{children as React.ReactNode}</script>;
  },
}));

import DeferredTabNavEmbed from '../DeferredTabNavEmbed';
import { TABNAV_WIDGET_SCRIPT_SRC } from '../tabNavConstants';

describe('DeferredTabNavEmbed', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not load TabNav on initial render', () => {
    const { container } = render(<DeferredTabNavEmbed />);
    expect(container.querySelector('script')).not.toBeInTheDocument();
  });

  it('loads TabNav after idle fallback timeout', () => {
    const { container } = render(<DeferredTabNavEmbed />);
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('src', TABNAV_WIDGET_SCRIPT_SRC);
  });
});
