/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

jest.mock('@/app/utilities/auth/isAuthenticated', () => jest.fn());
jest.mock('@/app/utilities/db/course/describeCourseDetailsTable', () => jest.fn());
jest.mock('@/app/utilities/db/course/createCourseDetailsTable', () => jest.fn());
jest.mock('@/app/utilities/db/course/insertCourseDetails', () => jest.fn());
jest.mock('@/app/utilities/validation/assertCourseDetailsData', () => jest.fn());
jest.mock('@/app/utilities/db/processCourseAPIError', () =>
  jest.fn().mockImplementation((ex: unknown) => {
    const status = (ex as { status?: number })?.status || 500;
    return new Response(JSON.stringify({ message: (ex as Error)?.message || 'DB error' }), {
      status,
    });
  }),
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
import describeCourseDetailsTable from '@/app/utilities/db/course/describeCourseDetailsTable';
import createCourseDetailsTable from '@/app/utilities/db/course/createCourseDetailsTable';
import insertCourseDetails from '@/app/utilities/db/course/insertCourseDetails';
import GET from '@/app/api/db/course/details/GET';
import POST from '@/app/api/db/course/details/POST';
import PUT from '@/app/api/db/course/details/PUT';

const mockIsAuth = isAuthenticated as jest.Mock;
const mockDescribe = describeCourseDetailsTable as jest.Mock;
const mockCreate = createCourseDetailsTable as jest.Mock;
const mockInsert = insertCourseDetails as jest.Mock;

const adminToken = { email: 'admin@test.com' };
const nonAdminToken = { email: 'regular@test.com' };

const makeGetRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/db/course/details'), {
    method: 'GET',
  });

const makePostRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/db/course/details'), {
    method: 'POST',
  });

const makePutRequest = (body: unknown): NextRequest =>
  new NextRequest(new URL('http://localhost/api/db/course/details'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('GET /api/db/course/details (describeCourseDetailsTable)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns table description for admin', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockDescribe.mockResolvedValue({ Table: { TableName: 'NDACourseDetails' } });

    const res = await GET(makeGetRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.Table.TableName).toBe('NDACourseDetails');
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

  it('returns error when describeCourseDetailsTable throws', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockDescribe.mockRejectedValue(new Error('AWS error'));

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(500);
  });
});

describe('POST /api/db/course/details (createCourseDetailsTable)', () => {
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

describe('PUT /api/db/course/details (insertCourseDetails)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 for admin with valid course details', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockInsert.mockResolvedValue(undefined);

    const courseDetails = {
      CourseId: 'abc-123',
      Overview: 'Test overview',
      Structure: 'Test structure',
    };

    const res = await PUT(makePutRequest(courseDetails));

    expect(res.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(courseDetails);
  });

  it('returns 403 for non-admin', async () => {
    mockIsAuth.mockResolvedValue(nonAdminToken);

    const res = await PUT(makePutRequest({}));

    expect(res.status).toBe(403);
  });

  it('returns auth error when unauthenticated', async () => {
    const authError = new AuthErrorResponse(null, { status: 401 });
    mockIsAuth.mockResolvedValue(authError);

    const res = await PUT(makePutRequest({}));

    expect(res.status).toBe(401);
  });

  it('returns error when insertCourseDetails throws', async () => {
    mockIsAuth.mockResolvedValue(adminToken);
    mockInsert.mockRejectedValue(new Error('Insert failed'));

    const res = await PUT(makePutRequest({ CourseId: 'abc' }));

    expect(res.status).toBe(500);
  });
});
