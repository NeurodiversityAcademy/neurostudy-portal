/**
 * @jest-environment node
 */
import { createMockNextRequest } from '@/testUtils/mockNextRequest';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

jest.mock('@/app/utilities/auth/isAuthenticated', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../getMoodleUserByEmail', () => ({
  getMoodleUserByEmail: jest.fn(),
}));

jest.mock('../getMoodleCoursesByUser', () => ({
  getMoodleCoursesByUser: jest.fn(),
}));

jest.mock('../helper', () => ({
  getMoodleCourseUrl: jest.fn(
    (courseid: number) => `https://moodle.example.com/course/view.php?id=${courseid}`,
  ),
}));

import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import { getMoodleUserByEmail } from '../getMoodleUserByEmail';
import { getMoodleCoursesByUser } from '../getMoodleCoursesByUser';
import { getMoodleCourseUrl } from '../helper';
import { createMoodleCourseUrl } from '../createMoodleCourseUrl';

const mockIsAuthenticated = isAuthenticated as jest.Mock;
const mockGetMoodleUserByEmail = getMoodleUserByEmail as jest.Mock;
const mockGetMoodleCoursesByUser = getMoodleCoursesByUser as jest.Mock;

describe('createMoodleCourseUrl', () => {
  const req = createMockNextRequest();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined when user is not authenticated', async () => {
    mockIsAuthenticated.mockResolvedValue(new AuthErrorResponse(null, { status: 401 }));

    const result = await createMoodleCourseUrl(req, { courseid: 5 });

    expect(result).toBeUndefined();
    expect(mockGetMoodleUserByEmail).not.toHaveBeenCalled();
  });

  it('returns undefined when moodle user id cannot be resolved', async () => {
    mockIsAuthenticated.mockResolvedValue({ email: 'user@test.com' });
    mockGetMoodleUserByEmail.mockResolvedValue(undefined);

    const result = await createMoodleCourseUrl(req, { courseid: 5 });

    expect(result).toBeUndefined();
    expect(mockGetMoodleCoursesByUser).not.toHaveBeenCalled();
  });

  it('returns undefined when course is not enrolled for user', async () => {
    mockIsAuthenticated.mockResolvedValue({ email: 'user@test.com' });
    mockGetMoodleUserByEmail.mockResolvedValue({ id: 42 });
    mockGetMoodleCoursesByUser.mockResolvedValue([{ id: 99 }]);

    const result = await createMoodleCourseUrl(req, { courseid: 5 });

    expect(result).toBeUndefined();
    expect(getMoodleCourseUrl).not.toHaveBeenCalled();
  });

  it('returns course url when user is enrolled', async () => {
    mockIsAuthenticated.mockResolvedValue({ email: 'user@test.com' });
    mockGetMoodleUserByEmail.mockResolvedValue({ id: 42 });
    mockGetMoodleCoursesByUser.mockResolvedValue([{ id: 5 }, { id: 10 }]);

    const result = await createMoodleCourseUrl(req, { courseid: 5 });

    expect(result).toBe('https://moodle.example.com/course/view.php?id=5');
    expect(getMoodleCourseUrl).toHaveBeenCalledWith(5);
  });

  it('uses provided userid without fetching by email', async () => {
    mockIsAuthenticated.mockResolvedValue({ email: 'user@test.com' });
    mockGetMoodleCoursesByUser.mockResolvedValue([{ id: 7 }]);

    const result = await createMoodleCourseUrl(req, {
      courseid: 7,
      userid: 99,
    });

    expect(result).toBe('https://moodle.example.com/course/view.php?id=7');
    expect(mockGetMoodleUserByEmail).not.toHaveBeenCalled();
    expect(mockGetMoodleCoursesByUser).toHaveBeenCalledWith(99);
  });
});
