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
  Object.defineProperty(window, 'location', {
    value: { pathname },
    writable: true,
    configurable: true,
  });
}

export { GA_EVENT_COMMAND };
