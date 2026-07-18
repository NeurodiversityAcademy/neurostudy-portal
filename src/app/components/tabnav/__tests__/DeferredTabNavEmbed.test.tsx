import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

jest.mock('next/script', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { children, ...rest } = props;
    return <script {...rest}>{children as React.ReactNode}</script>;
  },
}));

import DeferredTabNavEmbed from '../DeferredTabNavEmbed';
import { TABNAV_WIDGET_SCRIPT_SRC } from '../tabNavConstants';
import { DEFERRED_ACTIVATION_MS } from '../../../hooks/useDeferredActivation';

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

  it('loads TabNav after the first user interaction', () => {
    const { container } = render(<DeferredTabNavEmbed />);
    act(() => {
      fireEvent.pointerDown(window);
    });
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('src', TABNAV_WIDGET_SCRIPT_SRC);
  });

  it('loads TabNav after the hard timeout when there is no interaction', () => {
    const { container } = render(<DeferredTabNavEmbed />);
    act(() => {
      jest.advanceTimersByTime(DEFERRED_ACTIVATION_MS);
    });
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('src', TABNAV_WIDGET_SCRIPT_SRC);
  });
});
