/**
 * @jest-environment node
 */
import {
  installFetchMock,
  mockJsonResponse,
  restoreFetch,
} from '@/testUtils/mockFetch';

jest.mock('../helper', () => ({
  getMoodleAPIInfo: () => ({
    src: 'https://moodle.example.com/webservice/rest/server.php',
    secret: 'test-secret',
  }),
}));

import { getMoodleCoursesByUser } from '../getMoodleCoursesByUser';

describe('getMoodleCoursesByUser', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = installFetchMock();
  });

  afterEach(() => {
    restoreFetch();
  });

  it('returns courses with href mapped for each course id', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse([
        {
          id: 101,
          shortname: 'ND101',
          fullname: 'Course One',
          displayname: 'Course One',
          summary: '',
          summaryformat: 1,
          startdate: 0,
          enddate: 0,
          visible: true,
        },
        {
          id: 202,
          shortname: 'ND202',
          fullname: 'Course Two',
          displayname: 'Course Two',
          summary: '',
          summaryformat: 1,
          startdate: 0,
          enddate: 0,
          visible: true,
        },
      ])
    );

    const courses = await getMoodleCoursesByUser(99);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://moodle.example.com/webservice/rest/server.php',
      expect.objectContaining({ method: 'POST' })
    );

    const formData = fetchMock.mock.calls[0][1].body as FormData;
    expect(formData.get('wsfunction')).toBe('core_enrol_get_users_courses');
    expect(formData.get('userid')).toBe('99');

    expect(courses).toEqual([
      expect.objectContaining({ id: 101, href: '/moodle/course/101' }),
      expect.objectContaining({ id: 202, href: '/moodle/course/202' }),
    ]);
  });

  it('returns an empty array when the user has no courses', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse([]));

    const courses = await getMoodleCoursesByUser(5);

    expect(courses).toEqual([]);
  });

  it('throws when moodle returns an exception payload', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse({
        exception: 'invalid_parameter_exception',
        errorcode: 'invaliduserid',
        message: 'Invalid user id',
      })
    );

    await expect(getMoodleCoursesByUser(0)).rejects.toThrow(
      "Failed to fetch the user's enrolled courses."
    );
  });

  it('throws when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    await expect(getMoodleCoursesByUser(1)).rejects.toThrow(
      "Failed to fetch the user's enrolled courses."
    );
  });
});
