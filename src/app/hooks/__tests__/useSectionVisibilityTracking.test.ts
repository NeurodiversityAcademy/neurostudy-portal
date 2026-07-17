import { renderHook } from '@testing-library/react';
import { useSectionVisibilityTracking } from '@/app/hooks/useSectionVisibilityTracking';

type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let observerCallback: IntersectionCallback;
let observedElements: Element[];
let disconnectSpy: jest.Mock;

const MockIntersectionObserver = jest.fn((callback: IntersectionCallback) => {
  observerCallback = callback;
  observedElements = [];
  disconnectSpy = jest.fn();

  return {
    observe: jest.fn((el: Element) => observedElements.push(el)),
    unobserve: jest.fn(),
    disconnect: disconnectSpy,
  };
});

describe('useSectionVisibilityTracking', () => {
  const mockReporter = jest.fn();

  beforeEach(() => {
    mockReporter.mockClear();
    document.body.innerHTML = '';

    Object.defineProperty(window, 'IntersectionObserver', {
      value: MockIntersectionObserver,
      writable: true,
      configurable: true,
    });
    MockIntersectionObserver.mockClear();
  });

  it('observes elements with [data-section] attribute', () => {
    const sec1 = document.createElement('div');
    sec1.setAttribute('data-section', 'hero');
    const sec2 = document.createElement('div');
    sec2.setAttribute('data-section', 'features');
    document.body.appendChild(sec1);
    document.body.appendChild(sec2);

    renderHook(() => useSectionVisibilityTracking(mockReporter));

    expect(observedElements).toContain(sec1);
    expect(observedElements).toContain(sec2);
  });

  it('reports when a section becomes visible', () => {
    const sec = document.createElement('div');
    sec.setAttribute('data-section', 'pricing');
    document.body.appendChild(sec);

    renderHook(() => useSectionVisibilityTracking(mockReporter));

    observerCallback([{ isIntersecting: true, target: sec }]);

    expect(mockReporter).toHaveBeenCalledWith('pricing');
  });

  it('does not report non-intersecting entries', () => {
    const sec = document.createElement('div');
    sec.setAttribute('data-section', 'footer');
    document.body.appendChild(sec);

    renderHook(() => useSectionVisibilityTracking(mockReporter));

    observerCallback([{ isIntersecting: false, target: sec }]);

    expect(mockReporter).not.toHaveBeenCalled();
  });

  it('reports each section only once', () => {
    const sec = document.createElement('div');
    sec.setAttribute('data-section', 'about');
    document.body.appendChild(sec);

    renderHook(() => useSectionVisibilityTracking(mockReporter));

    observerCallback([{ isIntersecting: true, target: sec }]);
    observerCallback([{ isIntersecting: true, target: sec }]);

    expect(mockReporter).toHaveBeenCalledTimes(1);
  });

  it('skips elements without a data-section value', () => {
    const sec = document.createElement('div');
    sec.setAttribute('data-section', '');
    document.body.appendChild(sec);

    renderHook(() => useSectionVisibilityTracking(mockReporter));

    observerCallback([{ isIntersecting: true, target: sec }]);

    expect(mockReporter).not.toHaveBeenCalled();
  });

  it('disconnects the observer on unmount', () => {
    renderHook(() => useSectionVisibilityTracking(mockReporter));

    const { unmount } = renderHook(() => useSectionVisibilityTracking(mockReporter));

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('creates the observer with the correct threshold', () => {
    renderHook(() => useSectionVisibilityTracking(mockReporter));

    expect(MockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0.3 });
  });
});
