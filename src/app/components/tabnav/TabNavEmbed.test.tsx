import { act, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import Script from 'next/script';
import TabNavEmbed from './TabNavEmbed';
import {
  TABNAV_WIDGET_CONFIG_JSON,
  TABNAV_WIDGET_SCRIPT_SRC,
} from './tabNavConstants';
import { DEFERRED_THIRD_PARTY_FALLBACK_MS } from '@/app/hooks/useDeferredThirdPartyLoad';

jest.mock('next/script', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const mockedScript = Script as jest.MockedFunction<typeof Script>;

describe('TabNavEmbed (contract: stable embed strings)', () => {
  beforeEach(() => {
    mockedScript.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not load the widget script before deferred interaction/fallback', () => {
    render(<TabNavEmbed />);
    expect(mockedScript).not.toHaveBeenCalled();
  });

  it('passes locked script src, strategy, id, and tnv-data-config after deferral', () => {
    render(<TabNavEmbed />);

    act(() => {
      jest.advanceTimersByTime(DEFERRED_THIRD_PARTY_FALLBACK_MS);
    });

    expect(mockedScript).toHaveBeenCalledTimes(1);
    const props = mockedScript.mock.calls[0][0] as Record<string, unknown>;
    expect(props).toEqual(
      expect.objectContaining({
        id: 'tabnav-accessibility-widget',
        src: TABNAV_WIDGET_SCRIPT_SRC,
        strategy: 'lazyOnload',
        'tnv-data-config': TABNAV_WIDGET_CONFIG_JSON,
      })
    );
  });

  it('serializes noscript fallback markup with TabNav link (jsdom hides noscript children)', () => {
    const html = renderToStaticMarkup(<TabNavEmbed />);
    expect(html).toContain('https://tabnav.com/accessibility-widget');
    expect(html).toContain('JavaScript is required');
  });
});
