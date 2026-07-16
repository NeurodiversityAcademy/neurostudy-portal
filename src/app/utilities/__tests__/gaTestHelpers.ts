import { GA_EVENT_COMMAND } from '@/app/utilities/gaTracking';

export interface GtagTestWindow extends Window {
  gtag: jest.Mock;
}

export function installGtagMock(): jest.Mock {
  const mockGtag = jest.fn();
  (window as unknown as GtagTestWindow).gtag = mockGtag;
  return mockGtag;
}

export function installTestPagePath(pathname: string): void {
  // Jest 30 / jsdom: window.location is non-configurable; use History API instead.
  window.history.pushState({}, '', pathname);
}

export { GA_EVENT_COMMAND };
