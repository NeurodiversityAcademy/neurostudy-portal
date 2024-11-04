import { NextRequest, NextResponse } from 'next/server';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import { MoodleCourse, MoodleUserBasic } from '@/app/interfaces/Moodle';
import { COURSE_TEST_ENROL_KEY } from '@/app/utilities/course/constants';
import { INTERNAL_MODE } from '@/app/utilities/constants';
import { getMoodleUserByEmail } from '@/app/utilities/moodle/getMoodleUserByEmail';
import { getMoodleCoursesByUser } from '@/app/utilities/moodle/getMoodleCoursesByUser';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.has(COURSE_TEST_ENROL_KEY)
    ? INTERNAL_MODE.DEV
    : INTERNAL_MODE.PROD;

  try {
    const authResponse = await isAuthenticated({ req });

    if (authResponse instanceof Response) {
      return authResponse;
    }

    const user: MoodleUserBasic | null = await getMoodleUserByEmail(
      authResponse.email,
      mode
    );
    let courses: MoodleCourse[] = [];

    if (user) {
      courses = await getMoodleCoursesByUser(user.id, mode);
    }

    return NextResponse.json(courses);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
