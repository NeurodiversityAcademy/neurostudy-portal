export const MOODLE_STUDENT_ROLE_ID = 5;

const MOODLE_SECRET: string = process.env.MOODLE_SECRET ?? '';
const MOODLE_HOST_URL: string = process.env.MOODLE_HOST_URL ?? '';

if (
  process.env.NODE_ENV !== 'development' &&
  (!MOODLE_SECRET || !MOODLE_HOST_URL)
) {
  // throw new Error('Moodle variables have not been properly initialized.');
}

export { MOODLE_SECRET, MOODLE_HOST_URL };

export const MOODLE_API_PATH = '/webservice/rest/server.php';
