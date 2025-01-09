import { MoodleException } from '@/app/interfaces/Moodle';
import { MOODLE_STUDENT_ROLE_ID } from './constants';
import { getMoodleAPIInfo } from './helper';

export async function enrolMoodleUserInCourse({
  userid,
  courseid,
}: {
  userid: number;
  courseid: number;
}): Promise<void> {
  try {
    const { src, secret } = getMoodleAPIInfo();

    const formData = new FormData();
    formData.append('wstoken', secret);
    formData.append('wsfunction', 'enrol_manual_enrol_users');
    formData.append('moodlewsrestformat', 'json');
    formData.append('enrolments[0][roleid]', MOODLE_STUDENT_ROLE_ID.toString());
    formData.append('enrolments[0][userid]', userid.toString());
    formData.append('enrolments[0][courseid]', courseid.toString());

    const res = await fetch(src, {
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
