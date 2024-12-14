import APIError from '@/app/interfaces/APIError';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';
import { UserToken } from '@/app/interfaces/User';
import { ADMIN_EMAILS } from '@/app/utilities/api/constants';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import createCourseTable from '@/app/utilities/db/course/createCourseTable';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import { NextRequest, NextResponse } from 'next/server';

export default async function POST(req: NextRequest): Promise<Response> {
  try {
    const userResponse: UserToken | AuthErrorResponse = await isAuthenticated({
      req,
    });

    if (userResponse instanceof AuthErrorResponse) {
      return userResponse;
    }

    const user: UserToken = userResponse;
    const { email } = user;

    if (!ADMIN_EMAILS.includes(email)) {
      throw new APIError({ error: 'Forbidden Resource.', status: 403 });
    }

    const data = await createCourseTable();
    return NextResponse.json(data);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
