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

jest.mock('@/app/utilities/common', () => ({
  getUniqueID: () => 'unique-id-123',
}));

import { createMoodleUser } from '../createMoodleUser';

describe('createMoodleUser', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = installFetchMock();
  });

  afterEach(() => {
    restoreFetch();
  });

  it('creates a moodle user with split first and last names', async () => {
    const moodleUser = {
      id: 42,
      username: 'user@test.com',
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'user@test.com',
    };

    fetchMock.mockResolvedValue(mockJsonResponse([moodleUser]));

    const result = await createMoodleUser({
      email: 'user@test.com',
      name: 'Jane Doe',
    });

    expect(result).toEqual(moodleUser);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://moodle.example.com/webservice/rest/server.php',
      expect.objectContaining({ method: 'POST' }),
    );

    const formData = fetchMock.mock.calls[0][1].body as FormData;
    expect(formData.get('wstoken')).toBe('test-secret');
    expect(formData.get('wsfunction')).toBe('core_user_create_users');
    expect(formData.get('users[0][email]')).toBe('user@test.com');
    expect(formData.get('users[0][firstname]')).toBe('Jane');
    expect(formData.get('users[0][lastname]')).toBe('Doe');
    expect(formData.get('users[0][username]')).toBe('user@test.com');
    expect(formData.get('users[0][auth]')).toBe('oidc');
    expect(formData.get('users[0][password]')).toBe('!unique-id-123');
  });

  it('uses the full name as firstname when only one word is provided', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse([
        {
          id: 7,
          username: 'solo@test.com',
          firstname: 'Madonna',
          lastname: 'Madonna',
          email: 'solo@test.com',
        },
      ]),
    );

    await createMoodleUser({ email: 'solo@test.com', name: 'Madonna' });

    const formData = fetchMock.mock.calls[0][1].body as FormData;
    expect(formData.get('users[0][firstname]')).toBe('Madonna');
    expect(formData.get('users[0][lastname]')).toBe('Madonna');
  });

  it('throws when moodle returns an exception payload', async () => {
    fetchMock.mockResolvedValue(
      mockJsonResponse({
        exception: 'dml_exception',
        errorcode: 'invaliduser',
        message: 'Invalid user data',
      }),
    );

    await expect(createMoodleUser({ email: 'bad@test.com', name: 'Bad User' })).rejects.toThrow(
      'Failed to create the moodle user.',
    );
  });

  it('throws when fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    await expect(createMoodleUser({ email: 'fail@test.com', name: 'Fail User' })).rejects.toThrow(
      'Failed to create the moodle user.',
    );
  });
});
