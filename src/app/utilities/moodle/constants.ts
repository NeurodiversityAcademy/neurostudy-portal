export const MOODLE_STUDENT_ROLE_ID = 5;

const MOODLE_INTRO_COURSE_ID: number = +(
  process.env.MOODLE_INTRO_COURSE_ID ?? '0'
);
const MOODLE_SECRET: string = process.env.MOODLE_SECRET ?? '';
const MOODLE_HOST_URL: string = process.env.MOODLE_HOST_URL ?? '';
const DEV_MOODLE_INTRO_COURSE_ID: number = +(
  process.env.DEV_MOODLE_INTRO_COURSE_ID ?? '0'
);
const DEV_MOODLE_SECRET: string = process.env.DEV_MOODLE_SECRET ?? '';
const DEV_MOODLE_HOST_URL: string = process.env.DEV_MOODLE_HOST_URL ?? '';

if (
  process.env.NODE_ENV !== 'development' &&
  (!MOODLE_INTRO_COURSE_ID ||
    !MOODLE_SECRET ||
    !MOODLE_HOST_URL ||
    !DEV_MOODLE_INTRO_COURSE_ID ||
    !DEV_MOODLE_SECRET ||
    !DEV_MOODLE_HOST_URL)
) {
  throw new Error('Moodle variables have not been properly initialized.');
}

export {
  MOODLE_INTRO_COURSE_ID,
  MOODLE_SECRET,
  MOODLE_HOST_URL,
  DEV_MOODLE_INTRO_COURSE_ID,
  DEV_MOODLE_SECRET,
  DEV_MOODLE_HOST_URL,
};

export const MOODLE_API_PATH = '/webservice/rest/server.php';
