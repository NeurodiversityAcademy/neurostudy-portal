/**
 * @jest-environment node
 */
jest.mock('@/app/utilities/moodle/constants', () => ({
  MOODLE_STUDENT_ROLE_ID: 5,
}));

import { installFetchMock, mockJsonResponse, restoreFetch } from '@/testUtils/mockFetch';

jest.mock('../helper', () => ({
  getMoodleAPIInfo: () => ({
    src: 'https://moodle.example.com/webservice/rest/server.php',
    secret: 'test-secret',
  }),
}));

import { MOODLE_STUDENT_ROLE_ID } from '../constants';
import { enrolMoodleUserInCourse } from '../enrolMoodleUserInCourse';

describe('enrolMoodleUserInCourse', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = installFetchMock();
  });

  afterEach(() => {
    restoreFetch();
  });

  it('enrols a user in a course with the student role', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse(null));

    await enrolMoodleUserInCourse({ userid: 10, courseid: 55 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://moodle.example.com/webservice/rest/server.php',
      expect.objectContaining({ method: 'POST' }),
    );

    const formData = fetchMock.mock.calls[0][1].body as FormData;
    expect(formData.get('wstoken')).toBe('test-secret');
    expect(formData.get('wsfunction')).toBe('enrol_manual_enrol_users');
    expect(formData.get('enrolments[0][roleid]')).toBe(MOODLE_STUDENT_ROLE_ID.toString());
    expect(formData.get('enrolments[0][userid]')).toBe('10');
    expect(formData.get('enrolments[0][courseid]')).toBe('55');
  });

  it('succeeds when moodle returns a null response body', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse(null));

    await expect(enrolMoodleUserInCourse({ userid: 1, courseid: 2 })).resolves.toBeUndefined();
  });

  it('throws when moodle returns an exception payload', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse({
        exception: 'enrolment_exception',
        errorcode: 'cannotenrol',
        message: 'Cannot enrol user',
      }),
    );

    await expect(enrolMoodleUserInCourse({ userid: 1, courseid: 2 })).rejects.toThrow(
      'Failed to enrol the moodle user into the course.',
    );
  });

  it('throws when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    await expect(enrolMoodleUserInCourse({ userid: 1, courseid: 2 })).rejects.toThrow(
      'Failed to enrol the moodle user into the course.',
    );
  });
});
