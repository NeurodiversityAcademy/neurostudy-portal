/**
 * Installs a mocked global.fetch and returns the mock for assertions.
 * Call in beforeEach; restored automatically in afterEach.
 */
let originalFetch: typeof globalThis.fetch;

export function installFetchMock(): jest.Mock {
  originalFetch = globalThis.fetch;
  const mock = jest.fn();
  globalThis.fetch = mock;
  return mock;
}

export function restoreFetch(): void {
  globalThis.fetch = originalFetch;
}

export function mockJsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
