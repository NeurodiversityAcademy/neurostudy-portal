import { MOODLE_API_PATH, MOODLE_HOST_URL, MOODLE_SECRET } from './constants';

export function getMoodleHostUrl(): string {
  return MOODLE_HOST_URL;
}

export function getMoodleSecret(): string {
  return MOODLE_SECRET;
}

export function getMoodleAPIUrl(): string {
  return getMoodleHostUrl() + MOODLE_API_PATH;
}

export function getMoodleAPIInfo(): {
  src: string;
  secret: string;
} {
  return {
    src: getMoodleAPIUrl(),
    secret: getMoodleSecret(),
  };
}

export function getMoodleCourseUrl(courseid: number) {
  const moodleHostUrl = getMoodleHostUrl();
  return `${moodleHostUrl}/course/view.php?id=${courseid}`;
}
