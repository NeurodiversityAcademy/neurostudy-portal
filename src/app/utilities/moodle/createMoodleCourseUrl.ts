import { NextRequest } from 'next/server';
import isAuthenticated from '../auth/isAuthenticated';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';
import { getMoodleUserByEmail } from './getMoodleUserByEmail';
import { getMoodleCoursesByUser } from './getMoodleCoursesByUser';
import { getMoodleCourseUrl } from './helper';
import { INTERNAL_MODE } from '../constants';

type GetMoodleCourseUrl = {
  courseid: number;
  userid?: number;
};

export async function createMoodleCourseUrl(
  req: NextRequest,
  { courseid, userid }: GetMoodleCourseUrl,
  mode: INTERNAL_MODE
): Promise<string | undefined> {
  const authResponse = await isAuthenticated({ req });

  if (authResponse instanceof AuthErrorResponse) {
    return;
  }

  userid = userid || (await getMoodleUserByEmail(authResponse.email, mode))?.id;

  if (!userid) {
    return;
  }

  const courses = await getMoodleCoursesByUser(userid, mode);
  const courseIdExists = courses.find(({ id }) => id === courseid);

  return courseIdExists ? getMoodleCourseUrl(courseid, mode) : undefined;
}
