/**
 * @jest-environment node
 */
import { installFetchMock, mockJsonResponse, restoreFetch } from '@/testUtils/mockFetch';

jest.mock('../helper', () => ({
  getMoodleAPIInfo: () => ({
    src: 'https://moodle.example.com/webservice/rest/server.php',
    secret: 'test-secret',
  }),
}));

import { getMoodleUserByEmail } from '../getMoodleUserByEmail';

describe('getMoodleUserByEmail', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = installFetchMock();
  });

  afterEach(() => {
    restoreFetch();
  });

  it('returns the first matching moodle user', async () => {
    const moodleUser = {
      id: 42,
      username: 'user@test.com',
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'user@test.com',
    };

    fetchMock.mockResolvedValue(mockJsonResponse([moodleUser]));

    const result = await getMoodleUserByEmail('user@test.com');

    expect(result).toEqual(moodleUser);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('wsfunction=core_user_get_users_by_field'),
    );
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('values[]=user%40test.com'));
  });

  it('returns null when no users match', async () => {
    fetchMock.mockResolvedValue(mockJsonResponse([]));

    await expect(getMoodleUserByEmail('missing@test.com')).resolves.toBeNull();
  });

  it('throws when moodle returns an exception payload', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse({
        exception: 'invalid_parameter_exception',
        errorcode: 'invalidparameter',
        message: 'Invalid parameter',
      }),
    );

    await expect(getMoodleUserByEmail('bad@test.com')).rejects.toThrow(
      'Failed to fetch the moodle user.',
    );
  });

  it('throws when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    await expect(getMoodleUserByEmail('user@test.com')).rejects.toThrow(
      'Failed to fetch the moodle user.',
    );
  });
});
