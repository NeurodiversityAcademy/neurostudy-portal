import { getBuzzsproutEmbedAvailability } from '@/app/utilities/buzzsproutFeed';

describe('getBuzzsproutEmbedAvailability', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns false for show player when RSS has no episode items', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        '<rss><channel><title>Neurodivergent Mates</title></channel></rss>',
    });

    await expect(
      getBuzzsproutEmbedAvailability(
        'https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large',
        false
      )
    ).resolves.toBe(false);
  });

  it('returns true for show player when RSS includes episode items', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        '<rss><channel><item><title>Episode 1</title></item></channel></rss>',
    });

    await expect(
      getBuzzsproutEmbedAvailability(
        'https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large',
        false
      )
    ).resolves.toBe(true);
  });

  it('returns true for show player when RSS fetch fails open', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));

    await expect(
      getBuzzsproutEmbedAvailability(
        'https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large',
        false
      )
    ).resolves.toBe(true);
  });

  it('returns true for show player when RSS response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    await expect(
      getBuzzsproutEmbedAvailability(
        'https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large',
        false
      )
    ).resolves.toBe(true);
  });

  it('returns false for blog embed when episode script returns 404', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    await expect(
      getBuzzsproutEmbedAvailability(
        'https://www.buzzsprout.com/2132579/14760813-example.js',
        true
      )
    ).resolves.toBe(false);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.buzzsprout.com/2132579/14760813-example.js',
      expect.objectContaining({ method: 'HEAD' })
    );
  });

  it('returns true for blog embed when episode script is available', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    });

    await expect(
      getBuzzsproutEmbedAvailability(
        'https://www.buzzsprout.com/2132579/14760813-example.js',
        true
      )
    ).resolves.toBe(true);
  });
});
