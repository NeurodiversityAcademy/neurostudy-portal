/**
 * @jest-environment node
 */
import { createMockNextRequest } from '@/testUtils/mockNextRequest';
import { HOST_URL } from '@/app/utilities/constants';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn(),
}));

jest.mock('@/app/utilities/moodle/createMoodleCourseUrl', () => ({
  createMoodleCourseUrl: jest.fn(),
}));

import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { createMoodleCourseUrl } from '@/app/utilities/moodle/createMoodleCourseUrl';
import { GET } from '../route';

const mockConsumeRate = consumeRateWithIp as jest.Mock;
const mockCreateMoodleCourseUrl = createMoodleCourseUrl as jest.Mock;

const makeParams = (courseid: string) => Promise.resolve({ courseid });

describe('GET /moodle/course/[courseid]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsumeRate.mockResolvedValue({ ip: '127.0.0.1', data: {} });
  });

  it('redirects to the moodle course URL on success', async () => {
    const moodleUrl = 'https://moodle.example.com/course/view.php?id=42';
    mockCreateMoodleCourseUrl.mockResolvedValue(moodleUrl);

    const req = createMockNextRequest({
      url: 'http://localhost:3000/moodle/course/42',
    });

    const res = await GET(req, { params: makeParams('42') });

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get('location')).toBe(moodleUrl);
    expect(mockCreateMoodleCourseUrl).toHaveBeenCalledWith(req, {
      courseid: 42,
    });
    expect(mockConsumeRate).toHaveBeenCalledWith(req);
  });

  it('redirects to home with failure status when course URL is invalid', async () => {
    mockCreateMoodleCourseUrl.mockResolvedValue(undefined);

    const req = createMockNextRequest({
      url: 'http://localhost:3000/moodle/course/99',
    });

    const res = await GET(req, { params: makeParams('99') });
    const location = res.headers.get('location') ?? '';

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(location).toContain(HOST_URL);
    expect(location).toContain('moodle_redirection_status=failure');
    expect(location).toContain(encodeURIComponent('Course and/or user is invalid.'));
  });

  it('redirects to home with failure status when rate limit is exceeded', async () => {
    mockConsumeRate.mockRejectedValue(new Error('Too Many Requests.'));

    const req = createMockNextRequest({
      url: 'http://localhost:3000/moodle/course/1',
    });

    const res = await GET(req, { params: makeParams('1') });
    const location = res.headers.get('location') ?? '';

    expect(location).toContain('moodle_redirection_status=failure');
    expect(location).toContain(encodeURIComponent('Too Many Requests.'));
    expect(mockCreateMoodleCourseUrl).not.toHaveBeenCalled();
  });

  it('redirects to home with failure status when createMoodleCourseUrl throws', async () => {
    mockCreateMoodleCourseUrl.mockRejectedValue(new Error('Moodle service unavailable'));

    const req = createMockNextRequest({
      url: 'http://localhost:3000/moodle/course/5',
    });

    const res = await GET(req, { params: makeParams('5') });
    const location = res.headers.get('location') ?? '';

    expect(location).toContain('moodle_redirection_status=failure');
    expect(location).toContain(encodeURIComponent('Moodle service unavailable'));
  });
});
