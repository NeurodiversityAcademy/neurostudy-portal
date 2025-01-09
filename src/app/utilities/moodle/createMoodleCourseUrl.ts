import { NextRequest } from 'next/server';
import isAuthenticated from '../auth/isAuthenticated';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';
import { getMoodleUserByEmail } from './getMoodleUserByEmail';
import { getMoodleCoursesByUser } from './getMoodleCoursesByUser';
import { getMoodleCourseUrl } from './helper';

type GetMoodleCourseUrl = {
  courseid: number;
  userid?: number;
};

export async function createMoodleCourseUrl(
  req: NextRequest,
  { courseid, userid }: GetMoodleCourseUrl
): Promise<string | undefined> {
  const authResponse = await isAuthenticated({ req });

  if (authResponse instanceof AuthErrorResponse) {
    return;
  }

  userid = userid || (await getMoodleUserByEmail(authResponse.email))?.id;

  if (!userid) {
    return;
  }

  const courses = await getMoodleCoursesByUser(userid);
  const courseIdExists = courses.find(({ id }) => id === courseid);

  return courseIdExists ? getMoodleCourseUrl(courseid) : undefined;
}
