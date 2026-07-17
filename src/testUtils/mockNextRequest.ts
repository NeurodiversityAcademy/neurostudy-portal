import { NextRequest } from 'next/server';

interface MockRequestOptions {
  method?: string;
  url?: string;
  body?: unknown;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
}

export function createMockNextRequest({
  method = 'GET',
  url = 'http://localhost:3000/api/test',
  body,
  headers = {},
  searchParams = {},
}: MockRequestOptions = {}): NextRequest {
  const urlObj = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  const init: RequestInit = {
    method,
    headers: { 'content-type': 'application/json', ...headers },
  };

  if (body && method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new NextRequest(urlObj, init as any);
}
