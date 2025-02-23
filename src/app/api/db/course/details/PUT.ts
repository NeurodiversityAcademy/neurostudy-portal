import APIError from '@/app/interfaces/APIError';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';
import { CourseDetailsProps } from '@/app/interfaces/Course';
import { UserToken } from '@/app/interfaces/User';
import { ADMIN_EMAILS } from '@/app/utilities/api/constants';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import insertCourseDetails from '@/app/utilities/db/course/insertCourseDetails';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import assertCourseDetailsData from '@/app/utilities/validation/assertCourseDetailsData';
import { NextRequest, NextResponse } from 'next/server';

export default async function PUT(req: NextRequest): Promise<Response> {
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

    const data: CourseDetailsProps = await req.json();
    assertCourseDetailsData(data);

    await insertCourseDetails(data);
    return NextResponse.json(null);
  } catch (ex) {
    // TODO: Remove it after debugging
    // TEMP
    console.log('ex', { ex });

    return processCourseAPIError(ex);
  }
}
