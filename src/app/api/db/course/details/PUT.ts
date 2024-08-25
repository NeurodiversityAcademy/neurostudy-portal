import APIError from '@/app/interfaces/APIError';
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
    const userResponse: UserToken | Response = await isAuthenticated({ req });

    if (userResponse instanceof Response) {
      return userResponse;
    }

    const user = userResponse as UserToken;
    const { email } = user;

    if (!ADMIN_EMAILS.includes(email)) {
      throw new APIError({ error: 'Forbidden Resource.', status: 403 });
    }

    const data: CourseDetailsProps = await req.json();
    assertCourseDetailsData(data);

    await insertCourseDetails(data);
    return NextResponse.json(null);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}