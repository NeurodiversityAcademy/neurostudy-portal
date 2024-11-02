import { NextRequest, NextResponse } from 'next/server';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import {
  getMoodleCoursesByUser,
  getMoodleUserByEmail,
} from '@/app/utilities/moodle/helper';
import { MoodleCourse, MoodleUserBasic } from '@/app/interfaces/Moodle';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const authResponse = await isAuthenticated({ req });

    if (authResponse instanceof Response) {
      return authResponse;
    }

    const user: MoodleUserBasic | null = await getMoodleUserByEmail(
      authResponse.email
    );
    let courses: MoodleCourse[] = [];

    if (user) {
      courses = await getMoodleCoursesByUser(user.id);
    }

    return NextResponse.json(courses);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
