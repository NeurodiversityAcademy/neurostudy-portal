import {
  MoodleCourse,
  MoodleUser,
  MoodleUserBasic,
} from '@/app/interfaces/Moodle';
import { getSearchQuery, getUniqueID } from '../common';
import { MOODLE_STUDENT_ROLE_ID } from './constants';
import isAuthenticated from '../auth/isAuthenticated';
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

const MOODLE_HOST_URL = process.env.MOODLE_HOST_URL || '';
const MOODLE_API_URL = MOODLE_HOST_URL + '/webservice/rest/server.php';
const MOODLE_SECRET = process.env.MOODLE_SECRET || '';

export async function getMoodleUserByEmail(
  email: string
): Promise<MoodleUserBasic | null> {
  const url = `${MOODLE_API_URL}?
      ${getSearchQuery({
        wstoken: MOODLE_SECRET,
        wsfunction: 'core_user_get_users_by_field',
        field: 'email',
        'values[]': email,
        moodlewsrestformat: 'json',
      })}`;

  const res = await fetch(url);
  const user: MoodleUserBasic = (await res.json())[0] || null;

  // TODO: Handle exception that comes without triggering an error
  // Sample exception value -
  //  {
  //     "exception": "invalid_parameter_exception",
  //     "errorcode": "invalidparameter",
  //     "message": "Invalid parameter value detected"
  //  }
  return user;
}

export async function createMoodleUser({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<MoodleUser> {
  const splitName = name.split(/\s+/);
  const firstname = splitName.slice(0, -1).join(' ');
  const lastname = splitName.slice(-1).join('');
  const username = (
    splitName.join('') +
    '_' +
    getUniqueID().slice(4, 9)
  ).toLowerCase();

  const password = 'TestPass123!' + getUniqueID();

  const formData = new FormData();
  formData.append('wstoken', MOODLE_SECRET);
  formData.append('wsfunction', 'core_user_create_users');
  formData.append('moodlewsrestformat', 'json');
  formData.append('users[0][email]', email);
  formData.append('users[0][firstname]', firstname);
  formData.append('users[0][lastname]', lastname);
  formData.append('users[0][password]', password);
  formData.append('users[0][username]', username);

  const res = await fetch(MOODLE_API_URL, {
    method: 'POST',
    body: formData,
  });

  const json = await res.json();

  return json[0];
}

export async function enrolMoodleUserInCourse({
  userid,
  courseid,
}: {
  userid: number;
  courseid: number;
}) {
  const formData = new FormData();
  formData.append('wstoken', MOODLE_SECRET);
  formData.append('wsfunction', 'enrol_manual_enrol_users');
  formData.append('moodlewsrestformat', 'json');
  formData.append('enrolments[0][roleid]', MOODLE_STUDENT_ROLE_ID.toString());
  formData.append('enrolments[0][userid]', userid.toString());
  formData.append('enrolments[0][courseid]', courseid.toString());

  return await fetch(MOODLE_API_URL, {
    method: 'POST',
    body: formData,
  });
}

export async function getMoodleCoursesByUser(
  userid: number
): Promise<MoodleCourse[]> {
  const formData = new FormData();
  formData.append('wstoken', MOODLE_SECRET);
  formData.append('wsfunction', 'core_enrol_get_users_courses');
  formData.append('moodlewsrestformat', 'json');
  formData.append('userid', userid.toString());

  const res = await fetch(MOODLE_API_URL, {
    method: 'POST',
    body: formData,
  });

  return await res.json();
}

export function getMoodleCourseUrl(courseid: number) {
  return `${MOODLE_HOST_URL}/course/view.php?id=${courseid}`;
}

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

  return (
    courses.find(({ id }) => id === courseid) && getMoodleCourseUrl(courseid)
  );
}
