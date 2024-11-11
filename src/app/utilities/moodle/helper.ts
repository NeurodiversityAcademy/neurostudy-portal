import { INTERNAL_MODE } from '../constants';
import {
  DEV_MOODLE_HOST_URL,
  DEV_MOODLE_SECRET,
  MOODLE_API_PATH,
  MOODLE_HOST_URL,
  MOODLE_SECRET,
} from './constants';

export function getMoodleHostUrl(mode: INTERNAL_MODE): string {
  if (mode === INTERNAL_MODE.DEV) {
    return DEV_MOODLE_HOST_URL;
  }

  return MOODLE_HOST_URL;
}

export function getMoodleSecret(mode: INTERNAL_MODE): string {
  if (mode === INTERNAL_MODE.DEV) {
    return DEV_MOODLE_SECRET;
  }

  return MOODLE_SECRET;
}

export function getMoodleAPIUrl(mode: INTERNAL_MODE): string {
  return getMoodleHostUrl(mode) + MOODLE_API_PATH;
}

export function getMoodleAPIInfo(mode: INTERNAL_MODE): {
  src: string;
  secret: string;
} {
  return {
    src: getMoodleAPIUrl(mode),
    secret: getMoodleSecret(mode),
  };
}

export function getMoodleCourseUrl(courseid: number, mode: INTERNAL_MODE) {
  const moodleHostUrl = getMoodleHostUrl(mode);
  return `${moodleHostUrl}/course/view.php?id=${courseid}`;
}
