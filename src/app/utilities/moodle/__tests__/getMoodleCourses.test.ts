import axios from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

import getMoodleCourses from '../getMoodleCourses';

describe('getMoodleCourses', () => {
  it('returns moodle courses from API', async () => {
    const mockData = [{ id: 1, fullname: 'Course 1' }];
    mockAxios.request.mockResolvedValue({ data: mockData });

    const result = await getMoodleCourses();

    expect(result).toEqual(mockData);
    expect(mockAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/course/moodle'),
        method: 'GET',
      }),
    );
  });

  it('propagates errors from axios', async () => {
    mockAxios.request.mockRejectedValue(new Error('Timeout'));

    await expect(getMoodleCourses()).rejects.toThrow('Timeout');
  });
});
