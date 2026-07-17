/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-1234'),
}));

jest.mock('@/app/utilities/auth/isAuthenticated', () => jest.fn());
jest.mock('@/app/utilities/db/course/describeCourseTable', () => jest.fn());
jest.mock('@/app/utilities/db/course/createCourseTable', () => jest.fn());
jest.mock('@/app/utilities/db/course/insertCourseRows', () => jest.fn());
jest.mock('@/app/utilities/validation/assertCourseWithoutIdData', () =>
  jest.fn()
);
jest.mock('@/app/utilities/api/throwAssertionError', () =>
  jest.fn().mockImplementation((msg: string) => {
    const APIError =
      jest.requireActual<typeof import('@/app/interfaces/APIError')>(
        '@/app/interfaces/APIError'
      ).default;
    throw new APIError({ error: msg, status: 400 });
  })
);
jest.mock('@/app/utilities/db/processCourseAPIError', () =>
  jest.fn().mockImplementation((ex: unknown) => {
    const status = (ex as { status?: number })?.status || 500;
    return new Response(
      JSON.stringify({ message: (ex as Error)?.message || 'DB error' }),
      { status }
    );
  })
);
jest.mock('@/app/utilities/api/constants', () => ({
  ADMIN_EMAILS: ['admin@test.com'],
  RETURN_DEFAULT_ERROR_MESSAGE: false,
  DEFAULT_ASSERTION_ERROR_MESSAGE: "Provided data doesn't satisfy type-check.",
  DEFAULT_SERVER_ERROR_MESSAGE: 'Server failed to handle the response.',
  DEFAULT_SERVER_ERROR_NAME: 'Request Failure',
  DEFAULT_SERVER_ERROR_RES: {
    name: 'Request Failure',
    message: 'Server failed to handle the response.',
  },
}));

import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import describeCourseTable from '@/app/utilities/db/course/describeCourseTable';
import createCourseTable from '@/app/utilities/db/course/createCourseTable';
import insertCourseRows from '@/app/utilities/db/course/insertCourseRows';
import GET from '@/app/api/db/course/GET';
import POST from '@/app/api/db/course/POST';
import PUT from '@/app/api/db/course/PUT';

const mockIsAuth = isAuthenticated as jest.Mock;
const mockDescribe = describeCourseTable as jest.Mock;
const mockCreate = createCourseTable as jest.Mock;
const mockInsert = insertCourseRows as jest.Mock;

const adminToken = { email: 'admin@test.com' };
const nonAdminToken = { email: 'regular@test.com' };

const makeGetRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/db/course'), {
    method: 'GET',
  });

const makePostRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/db/course'), {
    method: 'POST',
  });

const makePutRequest = (body: unknown): NextRequest =>
  new NextRequest(new URL('http://localhost/api/db/course'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('GET /api/db/course (describeCourseTable)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns table description for admin', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockDescribe.mockResolvedValue({ Table: { TableName: 'NDACourses' } });

    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.Table.TableName).toBe('NDACourses');
  });

  it('returns 403 for non-admin', async () => {
    mockIsAuth.mockResolvedValue(nonAdminToken);

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(403);
  });

  it('returns auth error when unauthenticated', async () => {
    const authError = new AuthErrorResponse(null, { status: 401 });
    mockIsAuth.mockResolvedValue(authError);

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(401);
  });

  it('returns error when describeCourseTable throws', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockDescribe.mockRejectedValue(new Error('AWS error'));

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(500);
  });
});

describe('POST /api/db/course (createCourseTable)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 for admin on successful table creation', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockCreate.mockResolvedValue({ TableDescription: {} });

    const res = await POST(makePostRequest());

    expect(res.status).toBe(200);
  });

  it('returns 403 for non-admin', async () => {
    mockIsAuth.mockResolvedValue(nonAdminToken);

    const res = await POST(makePostRequest());

    expect(res.status).toBe(403);
  });

  it('returns auth error when unauthenticated', async () => {
    const authError = new AuthErrorResponse(null, { status: 401 });
    mockIsAuth.mockResolvedValue(authError);

    const res = await POST(makePostRequest());

    expect(res.status).toBe(401);
  });
});

describe('PUT /api/db/course (insertCourseRows)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 for admin with valid course data', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockInsert.mockResolvedValue({ UnprocessedItems: {} });

    const courses = [
      {
        InstitutionName: 'Test Uni',
        Title: 'Bachelor of Testing',
        Location: 'Sydney',
        Duration: 24,
        Rating: 4.0,
        Tier: 'GOLD',
        Level: 'BACHELORS',
        InterestArea: 'IT',
        Mode: 'Online',
        Neurotypes: ['Autism'],
      },
    ];

    const res = await PUT(makePutRequest(courses));

    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          CourseId: expect.any(String),
          InstitutionName: 'Test Uni',
        }),
      ])
    );
  });

  it('returns 403 for non-admin', async () => {
    mockIsAuth.mockResolvedValue(nonAdminToken);

    const res = await PUT(makePutRequest([{}]));

    expect(res.status).toBe(403);
  });

  it('returns auth error when unauthenticated', async () => {
    const authError = new AuthErrorResponse(null, { status: 401 });
    mockIsAuth.mockResolvedValue(authError);

    const res = await PUT(makePutRequest([{}]));

    expect(res.status).toBe(401);
  });

  it('returns 400 when data length exceeds 25', async () => {
    mockIsAuth.mockResolvedValue(adminToken);

    const tooManyItems = Array.from({ length: 26 }, (_, i) => ({
      Title: `Course ${i}`,
    }));

    const res = await PUT(makePutRequest(tooManyItems));

    expect(res.status).toBe(400);
  });

  it('returns 400 when data is empty array', async () => {
    mockIsAuth.mockResolvedValue(adminToken);

    const res = await PUT(makePutRequest([]));

    expect(res.status).toBe(400);
  });
});
