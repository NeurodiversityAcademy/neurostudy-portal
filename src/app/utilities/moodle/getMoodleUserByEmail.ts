import { MoodleException, MoodleUserBasic } from '@/app/interfaces/Moodle';
import { getMoodleAPIInfo } from './helper';
import { getSearchQuery } from '../common';

export async function getMoodleUserByEmail(
  email: string
): Promise<MoodleUserBasic | null> {
  try {
    const { src, secret } = getMoodleAPIInfo();

    const url = `${src}?
        ${getSearchQuery({
          wstoken: secret,
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

    const user: MoodleUserBasic | null = json[0] || null;

    return user;
  } catch (_) {
    throw new Error('Failed to fetch the moodle user.');
  }
}
