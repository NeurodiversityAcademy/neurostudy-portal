import {
  MoodleCourse,
  MoodleException,
  MoodleUser,
  MoodleUserBasic,
} from '@/app/interfaces/Moodle';
import { getSearchQuery, getUniqueID } from '../common';
import {
  MOODLE_API_URL,
  MOODLE_HOST_URL,
  MOODLE_SECRET,
  MOODLE_STUDENT_ROLE_ID,
} from './constants';
import isAuthenticated from '../auth/isAuthenticated';
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

export async function getMoodleUserByEmail(
  email: string
): Promise<MoodleUserBasic | null> {
  try {
    const url = `${MOODLE_API_URL}?
        ${getSearchQuery({
          wstoken: MOODLE_SECRET,
          wsfunction: 'core_user_get_users_by_field',
          field: 'email',
          'values[]': email,
          moodlewsrestformat: 'json',
        })}`;

    const res = await fetch(url);
    const json: MoodleUserBasic[] | MoodleException = await res.json();
    if ('exception' in json) {
      throw new Error(json.message);
    }

    const user: MoodleUserBasic = json[0];

    return user;
  } catch (_) {
    throw new Error('Failed to fetch the moodle user.');
  }
}

export async function createMoodleUser({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<MoodleUser> {
  try {
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

    const json: MoodleUser[] | MoodleException = await res.json();
    if ('exception' in json) {
      throw new Error(json.message);
    }

    const user: MoodleUser = json[0];

    return user;
  } catch (_) {
    throw new Error('Failed to create the moodle user.');
  }
}

export async function enrolMoodleUserInCourse({
  userid,
  courseid,
}: {
  userid: number;
  courseid: number;
}): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('wstoken', MOODLE_SECRET);
    formData.append('wsfunction', 'enrol_manual_enrol_users');
    formData.append('moodlewsrestformat', 'json');
    formData.append('enrolments[0][roleid]', MOODLE_STUDENT_ROLE_ID.toString());
    formData.append('enrolments[0][userid]', userid.toString());
    formData.append('enrolments[0][courseid]', courseid.toString());

    const res = await fetch(MOODLE_API_URL, {
      method: 'POST',
      body: formData,
    });
    const json: MoodleException | null = await res.json();

    if (json && 'exception' in json) {
      throw new Error(json.message);
    }
  } catch (_) {
    throw new Error('Failed to enrol the moodle user into the course.');
  }
}

export async function getMoodleCoursesByUser(
  userid: number
): Promise<MoodleCourse[]> {
  try {
    const formData = new FormData();
    formData.append('wstoken', MOODLE_SECRET);
    formData.append('wsfunction', 'core_enrol_get_users_courses');
    formData.append('moodlewsrestformat', 'json');
    formData.append('userid', userid.toString());

    const res = await fetch(MOODLE_API_URL, {
      method: 'POST',
      body: formData,
    });
    const json: MoodleCourse[] | MoodleException = await res.json();

    if ('exception' in json) {
      throw new Error(json.message);
    }

    return json;
  } catch (_) {
    throw new Error(`Failed to fetch the user's enrolled courses.`);
  }
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
