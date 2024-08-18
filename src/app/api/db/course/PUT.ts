import APIError from '@/app/interfaces/APIError';
import { CourseProps, CourseWithoutIdProps } from '@/app/interfaces/Course';
import { UserToken } from '@/app/interfaces/User';
import { ADMIN_EMAILS } from '@/app/utilities/api/constants';
import throwAssertionError from '@/app/utilities/api/throwAssertionError';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import { COURSE_TABLE_PARTITION_KEY } from '@/app/utilities/db/constants';
import insertCourseRows from '@/app/utilities/db/course/insertCourseRows';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import assertCourseWithoutIdData from '@/app/utilities/validation/assertCourseWithoutIdData';
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';

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

    const reqData: CourseWithoutIdProps[] = await req.json();
    assertCourseWithoutIdData(reqData);

    const data: CourseProps[] = reqData.map((item) => ({
      [COURSE_TABLE_PARTITION_KEY]: v4(),
      ...item,
    }));

    const { length } = data;
    if (length < 1 || length > 25) {
      throwAssertionError(
        `Length of the data should be between 1 & 25, inclusive.`
      );
    }

    const res = await insertCourseRows(data);
    return NextResponse.json(res);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
