import { MoodleException, MoodleUser } from '@/app/interfaces/Moodle';
import { getUniqueID } from '../common';
import { INTERNAL_MODE } from '../constants';
import { getMoodleAPIInfo } from './helper';

export async function createMoodleUser(
  {
    email,
    name,
  }: {
    email: string;
    name: string;
  },
  mode: INTERNAL_MODE
): Promise<MoodleUser> {
  try {
    const { src, secret } = getMoodleAPIInfo(mode);

    const splitName = name.split(/\s+/);
    const firstname =
      splitName.length > 1 ? splitName.slice(0, -1).join(' ') : name;
    const lastname = splitName.slice(-1).join('') || firstname;
    const username = email;

    const password = '!' + getUniqueID();

    const formData = new FormData();
    formData.append('wstoken', secret);
    formData.append('wsfunction', 'core_user_create_users');
    formData.append('moodlewsrestformat', 'json');
    formData.append('users[0][email]', email);
    formData.append('users[0][firstname]', firstname);
    formData.append('users[0][lastname]', lastname);
    formData.append('users[0][password]', password);
    formData.append('users[0][username]', username);
    formData.append('users[0][auth]', 'oidc');

    const res = await fetch(src, {
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
