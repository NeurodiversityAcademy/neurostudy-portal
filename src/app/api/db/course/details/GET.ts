import APIError from '@/app/interfaces/APIError';
import { UserToken } from '@/app/interfaces/User';
import { ADMIN_EMAILS } from '@/app/utilities/api/constants';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import describeCourseDetailsTable from '@/app/utilities/db/course/describeCourseDetailsTable';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import { NextRequest, NextResponse } from 'next/server';

export default async function GET(req: NextRequest): Promise<Response> {
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

    const data = await describeCourseDetailsTable();
    return NextResponse.json(data);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
