import APIError from '@/app/interfaces/APIError';
import { CourseProps } from '@/app/interfaces/Course';
import { UserToken } from '@/app/interfaces/User';
import { ADMIN_EMAILS } from '@/app/utilities/api/constants';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import insertCourseRows from '@/app/utilities/db/insertCourseRows';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import assertCourseData from '@/app/utilities/validation/assertCourseData';
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

    const data: CourseProps[] = await req.json();
    assertCourseData(data);

    const res = await insertCourseRows(data);
    return NextResponse.json(res);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
