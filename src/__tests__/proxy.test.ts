/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

jest.mock('@/app/utilities/auth/isAuthenticated', () => jest.fn());

import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import { proxy, config } from '@/proxy';

const mockIsAuthenticated = isAuthenticated as jest.Mock;

const makeRequest = (path = '/profile', search = ''): NextRequest =>
  new NextRequest(
    new URL(`http://localhost:3000${path}${search}`),
    { method: 'GET' }
  );

describe('proxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows authenticated requests through', async () => {
    mockIsAuthenticated.mockResolvedValue({
      id: 'user-1',
      email: 'user@test.com',
      given_name: 'Test',
      family_name: 'User',
    });

    const req = makeRequest('/profile');
    const res = await proxy(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
    expect(mockIsAuthenticated).toHaveBeenCalledWith({ req });
  });

  it('redirects unauthenticated users to login with callback URL', async () => {
    mockIsAuthenticated.mockResolvedValue(
      new AuthErrorResponse('User is not authorized.', { status: 401 })
    );

    const req = makeRequest('/profile', '?tab=courses');
    const res = await proxy(req);
    const location = res.headers.get('location') ?? '';

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(location).toContain('/login');
    expect(location).toContain('error=AuthRequired');
    expect(location).toContain(
      encodeURIComponent('/profile?tab=courses')
    );
  });

  it('preserves pathname-only callback when there is no search string', async () => {
    mockIsAuthenticated.mockResolvedValue(
      new AuthErrorResponse(null, { status: 401 })
    );

    const req = makeRequest('/profile');
    const res = await proxy(req);
    const location = res.headers.get('location') ?? '';

    expect(location).toContain(
      encodeURIComponent('/profile')
    );
  });

  it('exports matcher config for profile route', () => {
    expect(config.matcher).toEqual(['/profile']);
  });
});
