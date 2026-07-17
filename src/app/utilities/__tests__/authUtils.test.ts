/**
 * @jest-environment node
 */
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

function createRequest(url = 'http://localhost/api/test'): NextRequest {
  return new NextRequest(new URL(url));
}

describe('isAuthenticated', () => {
  beforeEach(() => {
    mockedGetToken.mockReset();
  });

  it('returns user token when token has email', async () => {
    mockedGetToken.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      family_name: 'Doe',
      given_name: 'John',
    } as any);

    const result = await isAuthenticated({ req: createRequest() });

    expect(result).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      family_name: 'Doe',
      given_name: 'John',
    });
  });

  it('returns AuthErrorResponse when token is null', async () => {
    mockedGetToken.mockResolvedValue(null);

    const result = await isAuthenticated({ req: createRequest() });

    expect(result).toBeInstanceOf(AuthErrorResponse);
  });

  it('returns AuthErrorResponse when token has no email', async () => {
    mockedGetToken.mockResolvedValue({ id: 'user-1' } as any);

    const result = await isAuthenticated({ req: createRequest() });

    expect(result).toBeInstanceOf(AuthErrorResponse);
  });
});
