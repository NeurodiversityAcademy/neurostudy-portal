/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

jest.mock('@/app/utilities/auth/isAuthenticated', () => jest.fn());
jest.mock('@/app/utilities/moodle/getMoodleUserByEmail', () => ({
  getMoodleUserByEmail: jest.fn(),
}));
jest.mock('@/app/utilities/moodle/getMoodleCoursesByUser', () => ({
  getMoodleCoursesByUser: jest.fn(),
}));
jest.mock('@/app/utilities/db/processCourseAPIError', () =>
  jest.fn().mockImplementation((ex: unknown) => {
    const status = (ex as { status?: number })?.status || 500;
    return new Response(JSON.stringify({ message: (ex as Error)?.message || 'Error' }), { status });
  }),
);

import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import { getMoodleUserByEmail } from '@/app/utilities/moodle/getMoodleUserByEmail';
import { getMoodleCoursesByUser } from '@/app/utilities/moodle/getMoodleCoursesByUser';
import { GET } from '@/app/api/course/moodle/route';

const mockIsAuth = isAuthenticated as jest.Mock;
const mockGetMoodleUser = getMoodleUserByEmail as jest.Mock;
const mockGetMoodleCourses = getMoodleCoursesByUser as jest.Mock;

const makeRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/course/moodle'), {
    method: 'GET',
  });

describe('GET /api/course/moodle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns courses when user is authenticated and has moodle account', async () => {
    mockIsAuth.mockResolvedValue({ email: 'user@test.com' });
    mockGetMoodleUser.mockResolvedValue({ id: 42, username: 'user' });
    mockGetMoodleCourses.mockResolvedValue([{ id: 1, fullname: 'Course A' }]);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([{ id: 1, fullname: 'Course A' }]);
    expect(mockGetMoodleCourses).toHaveBeenCalledWith(42);
  });

  it('returns empty array when user has no moodle account', async () => {
    mockIsAuth.mockResolvedValue({ email: 'user@test.com' });
    mockGetMoodleUser.mockResolvedValue(null);

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
    expect(mockGetMoodleCourses).not.toHaveBeenCalled();
  });

  it('returns auth error when not authenticated', async () => {
    const authError = new AuthErrorResponse(null, { status: 401 });
    mockIsAuth.mockResolvedValue(authError);

    const res = await GET(makeRequest());

    expect(res.status).toBe(401);
  });

  it('returns error when getMoodleUserByEmail throws', async () => {
    mockIsAuth.mockResolvedValue({ email: 'user@test.com' });
    mockGetMoodleUser.mockRejectedValue(new Error('Moodle API down'));

    const res = await GET(makeRequest());

    expect(res.status).toBe(500);
  });
});
