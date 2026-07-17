/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

jest.mock('@/app/utilities/auth/isAuthenticated', () => jest.fn());
jest.mock('@/app/utilities/auth/getUser', () => jest.fn());
jest.mock('@/app/utilities/auth/createUser', () => jest.fn());
jest.mock('@/app/utilities/auth/updateUser', () => jest.fn());
jest.mock('@/app/utilities/validation/assertUserData', () => jest.fn());
jest.mock('@/app/utilities/auth/responses', () => ({
  returnAuthError: jest.fn().mockImplementation((ex: unknown) => {
    const status = (ex as { status?: number })?.status || 500;
    return new Response(
      JSON.stringify({ message: (ex as Error)?.message || 'Auth error' }),
      { status }
    );
  }),
}));

import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import getUser from '@/app/utilities/auth/getUser';
import createUser from '@/app/utilities/auth/createUser';
import updateUser from '@/app/utilities/auth/updateUser';
import { GET, PUT } from '@/app/api/user/route';

const mockIsAuth = isAuthenticated as jest.Mock;
const mockGetUser = getUser as jest.Mock;
const mockCreateUser = createUser as jest.Mock;
const mockUpdateUser = updateUser as jest.Mock;

const mockUserToken = {
  email: 'user@test.com',
  family_name: 'Doe',
  given_name: 'John',
};

const makeGetRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/user'), { method: 'GET' });

const makePutRequest = (body: unknown): NextRequest =>
  new NextRequest(new URL('http://localhost/api/user'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('GET /api/user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with user data when authenticated and user exists', async () => {
    mockIsAuth.mockResolvedValue(mockUserToken);
    mockGetUser.mockResolvedValue({ email: 'user@test.com', name: 'John' });

    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ email: 'user@test.com', name: 'John' });
  });

  it('creates user when authenticated but user not found in DB', async () => {
    mockIsAuth.mockResolvedValue(mockUserToken);
    mockGetUser.mockResolvedValue(null);
    mockCreateUser.mockResolvedValue({
      email: 'user@test.com',
      name: 'John Doe',
    });

    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'user@test.com',
      family_name: 'Doe',
      given_name: 'John',
    });
    expect(body).toEqual({ email: 'user@test.com', name: 'John Doe' });
  });

  it('returns auth error when not authenticated', async () => {
    const authError = new AuthErrorResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
    mockIsAuth.mockResolvedValue(authError);

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(401);
  });

  it('returns error response when isAuthenticated throws', async () => {
    mockIsAuth.mockRejectedValue(new Error('Token expired'));

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(500);
  });
});

describe('PUT /api/user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 on successful update', async () => {
    mockIsAuth.mockResolvedValue(mockUserToken);
    mockUpdateUser.mockResolvedValue({});

    const res = await PUT(makePutRequest({ displayName: 'JD' }));

    expect(res.status).toBe(200);
  });

  it('returns auth error when not authenticated', async () => {
    const authError = new AuthErrorResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
    mockIsAuth.mockResolvedValue(authError);

    const res = await PUT(makePutRequest({ displayName: 'JD' }));

    expect(res.status).toBe(401);
  });

  it('returns error response when updateUser throws', async () => {
    mockIsAuth.mockResolvedValue(mockUserToken);
    mockUpdateUser.mockRejectedValue(new Error('DB write failed'));

    const res = await PUT(makePutRequest({ displayName: 'JD' }));

    expect(res.status).toBe(500);
  });

  it('returns the response if updateUser returns a Response', async () => {
    mockIsAuth.mockResolvedValue(mockUserToken);
    const errorResponse = new Response('Conflict', { status: 409 });
    mockUpdateUser.mockResolvedValue(errorResponse);

    const res = await PUT(makePutRequest({ displayName: 'JD' }));

    expect(res.status).toBe(409);
  });
});
