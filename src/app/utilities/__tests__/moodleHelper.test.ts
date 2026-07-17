/**
 * @jest-environment node
 */
jest.mock('@/app/utilities/moodle/constants', () => ({
  MOODLE_HOST_URL: 'https://moodle.example.com',
  MOODLE_SECRET: 'test-secret-123',
  MOODLE_API_PATH: '/webservice/rest/server.php',
}));

import {
  getMoodleHostUrl,
  getMoodleSecret,
  getMoodleAPIUrl,
  getMoodleAPIInfo,
  getMoodleCourseUrl,
} from '@/app/utilities/moodle/helper';

describe('moodle/helper', () => {
  it('getMoodleHostUrl returns configured host', () => {
    expect(getMoodleHostUrl()).toBe('https://moodle.example.com');
  });

  it('getMoodleSecret returns configured secret', () => {
    expect(getMoodleSecret()).toBe('test-secret-123');
  });

  it('getMoodleAPIUrl appends API path to host', () => {
    expect(getMoodleAPIUrl()).toBe(
      'https://moodle.example.com/webservice/rest/server.php'
    );
  });

  it('getMoodleAPIInfo returns src + secret object', () => {
    const info = getMoodleAPIInfo();
    expect(info).toEqual({
      src: 'https://moodle.example.com/webservice/rest/server.php',
      secret: 'test-secret-123',
    });
  });

  it('getMoodleCourseUrl builds correct course view URL', () => {
    expect(getMoodleCourseUrl(42)).toBe(
      'https://moodle.example.com/course/view.php?id=42'
    );
  });

  it('getMoodleCourseUrl handles course ID 0', () => {
    expect(getMoodleCourseUrl(0)).toBe(
      'https://moodle.example.com/course/view.php?id=0'
    );
  });
});
