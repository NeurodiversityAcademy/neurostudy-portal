import { renderHook } from '@testing-library/react';
import { useGaEventReporter } from '@/app/hooks/useGaEventReporter';
import * as gaTracking from '@/app/utilities/gaTracking';

jest.mock('@/app/utilities/gaTracking', () => ({
  sendScrollDepthEvent: jest.fn(),
  sendSectionVisibleEvent: jest.fn(),
  sendTimeOnPageEvent: jest.fn(),
}));

describe('useGaEventReporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns three reporter functions', () => {
    const { result } = renderHook(() =>
      useGaEventReporter('test-provider')
    );

    expect(typeof result.current.reportScrollDepth).toBe('function');
    expect(typeof result.current.reportSectionVisible).toBe('function');
    expect(typeof result.current.reportTimeOnPage).toBe('function');
  });

  it('reportScrollDepth delegates to sendScrollDepthEvent', () => {
    const { result } = renderHook(() =>
      useGaEventReporter('my-slug')
    );

    result.current.reportScrollDepth(50);

    expect(gaTracking.sendScrollDepthEvent).toHaveBeenCalledWith(
      'my-slug',
      50
    );
  });

  it('reportSectionVisible delegates to sendSectionVisibleEvent', () => {
    const { result } = renderHook(() =>
      useGaEventReporter('my-slug')
    );

    result.current.reportSectionVisible('hero');

    expect(gaTracking.sendSectionVisibleEvent).toHaveBeenCalledWith(
      'my-slug',
      'hero'
    );
  });

  it('reportTimeOnPage delegates to sendTimeOnPageEvent', () => {
    const { result } = renderHook(() =>
      useGaEventReporter('my-slug')
    );

    result.current.reportTimeOnPage(30);

    expect(gaTracking.sendTimeOnPageEvent).toHaveBeenCalledWith(
      'my-slug',
      30
    );
  });

  it('returns stable callbacks when slug is unchanged', () => {
    const { result, rerender } = renderHook(() =>
      useGaEventReporter('stable-slug')
    );

    const first = result.current;
    rerender();
    const second = result.current;

    expect(first.reportScrollDepth).toBe(second.reportScrollDepth);
    expect(first.reportSectionVisible).toBe(second.reportSectionVisible);
    expect(first.reportTimeOnPage).toBe(second.reportTimeOnPage);
  });
});
