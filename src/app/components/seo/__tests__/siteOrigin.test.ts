describe('getSiteOrigin', () => {
  const originalHostUrl = process.env.NEXT_PUBLIC_HOST_URL;

  afterEach(() => {
    if (originalHostUrl === undefined) {
      delete process.env.NEXT_PUBLIC_HOST_URL;
    } else {
      process.env.NEXT_PUBLIC_HOST_URL = originalHostUrl;
    }
    jest.resetModules();
  });

  it('returns production origin when HOST_URL is localhost', async () => {
    process.env.NEXT_PUBLIC_HOST_URL = 'http://localhost:3000';
    jest.resetModules();
    const { getSiteOrigin: getOrigin } = await import('../siteOrigin');
    expect(getOrigin()).toBe('https://neurodiversityacademy.com');
  });

  it('returns HOST_URL when not localhost', async () => {
    process.env.NEXT_PUBLIC_HOST_URL = 'https://neurodiversityacademy.com';
    jest.resetModules();
    const { getSiteOrigin: getOrigin } = await import('../siteOrigin');
    expect(getOrigin()).toBe('https://neurodiversityacademy.com');
  });
});
