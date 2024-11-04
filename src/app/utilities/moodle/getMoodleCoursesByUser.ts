import { MoodleCourse, MoodleException } from '@/app/interfaces/Moodle';
import { INTERNAL_MODE } from '../constants';
import { getMoodleAPIInfo } from './helper';
import { COURSE_TEST_ENROL_KEY } from '../course/constants';

export async function getMoodleCoursesByUser(
  userid: number,
  mode: INTERNAL_MODE
): Promise<MoodleCourse[]> {
  try {
    const { src, secret } = getMoodleAPIInfo(mode);

    const formData = new FormData();
    formData.append('wstoken', secret);
    formData.append('wsfunction', 'core_enrol_get_users_courses');
    formData.append('moodlewsrestformat', 'json');
    formData.append('userid', userid.toString());

    const res = await fetch(src, {
      method: 'POST',
      body: formData,
    });
    const json: Omit<MoodleCourse, 'href'>[] | MoodleException =
      await res.json();

    if ('exception' in json) {
      throw new Error(json.message);
    }

    const data: MoodleCourse[] = json.map((course) => {
      return {
        ...course,
        href: `/moodle/course/${course.id}${
          mode === INTERNAL_MODE.DEV ? `?${COURSE_TEST_ENROL_KEY}` : ''
        }`,
      };
    });

    return data;
  } catch (_) {
    throw new Error(`Failed to fetch the user's enrolled courses.`);
  }
}
