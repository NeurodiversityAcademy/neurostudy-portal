/**
 * @jest-environment node
 */
import { callModel, resetAssistModelCacheForTests } from '../llm';

const ENV_KEYS = [
  'ASSIST_API_URL',
  'ASSIST_API_KEY',
  'ASSIST_MODEL',
  'ASSIST_AUTH_HEADER',
  'ASSIST_JSON_MODE',
  'ASSIST_TEMPERATURE',
  'ASSIST_MAX_TOKENS_PARAM',
  'ASSIST_CACHE',
];

function modelResponse(content: string | null) {
  return {
    ok: true,
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}

describe('callModel', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetAssistModelCacheForTests();
    process.env = {
      ...originalEnv,
      ASSIST_API_URL: 'https://example.test/chat',
      ASSIST_API_KEY: 'test-key',
      ASSIST_MODEL: 'test-model',
    };
    for (const key of ENV_KEYS) {
      if (process.env[key] === undefined) {
        delete process.env[key];
      }
    }
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  function setFetch(mock: jest.Mock): void {
    global.fetch = mock as unknown as typeof fetch;
  }

  it('returns null when configuration is incomplete', async () => {
    for (const key of ['ASSIST_API_URL', 'ASSIST_API_KEY', 'ASSIST_MODEL']) {
      const saved = process.env[key];
      delete process.env[key];
      await expect(callModel('nursing', 'system')).resolves.toBeNull();
      process.env[key] = saved;
    }
  });

  it('returns null when the provider responds with an error', async () => {
    setFetch(jest.fn().mockResolvedValue({ ok: false }));

    await expect(callModel('nursing', 'system')).resolves.toBeNull();
  });

  it('returns null when the request throws', async () => {
    setFetch(jest.fn().mockRejectedValue(new Error('network')));

    await expect(callModel('nursing', 'system')).resolves.toBeNull();
  });

  it('returns null when the response has no choices', async () => {
    setFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

    await expect(callModel('nursing', 'system')).resolves.toBeNull();
  });

  it('parses JSON embedded in surrounding prose', async () => {
    setFetch(
      jest.fn().mockResolvedValue(modelResponse('Sure: {"area":"Nursing","location":"VIC"} done')),
    );

    await expect(callModel('nursing in vic', 'system')).resolves.toEqual({
      area: 'Nursing',
      location: 'VIC',
    });
  });

  it('accepts explicit nulls for area and location', async () => {
    setFetch(jest.fn().mockResolvedValue(modelResponse('{"area":null,"location":null}')));

    await expect(callModel('hello', 'system')).resolves.toEqual({ area: null, location: null });
  });

  it.each([
    ['no JSON at all', 'I cannot help with that'],
    ['unbalanced braces', 'prefix { "area": "Nursing"'],
    ['malformed JSON', '{ "area": }'],
    ['missing area', '{"location":"VIC"}'],
    ['missing location', '{"area":"Nursing"}'],
    ['wrong area type', '{"area":7,"location":"VIC"}'],
    ['wrong location type', '{"area":"Nursing","location":["VIC"]}'],
  ])('returns null for %s', async (_label, content) => {
    setFetch(jest.fn().mockResolvedValue(modelResponse(content)));

    await expect(callModel('nursing', 'system')).resolves.toBeNull();
  });

  it('returns null when content is empty', async () => {
    setFetch(jest.fn().mockResolvedValue(modelResponse(null)));

    await expect(callModel('nursing', 'system')).resolves.toBeNull();
  });

  it('uses a bearer token by default', async () => {
    const fetchMock = jest.fn().mockResolvedValue(modelResponse('{"area":null,"location":null}'));
    setFetch(fetchMock);

    await callModel('nursing', 'system');

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
    expect((init.headers as Record<string, string>)['api-key']).toBeUndefined();
  });

  it('uses an api-key header when configured', async () => {
    process.env.ASSIST_AUTH_HEADER = 'api-key';
    const fetchMock = jest.fn().mockResolvedValue(modelResponse('{"area":null,"location":null}'));
    setFetch(fetchMock);

    await callModel('nursing', 'system');

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>)['api-key']).toBe('test-key');
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('sends JSON mode and temperature by default', async () => {
    process.env.ASSIST_TEMPERATURE = '0.2';
    const fetchMock = jest.fn().mockResolvedValue(modelResponse('{"area":null,"location":null}'));
    setFetch(fetchMock);

    await callModel('nursing', 'system');

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.response_format).toEqual({ type: 'json_object' });
    expect(body.temperature).toBe(0.2);
    expect(body.max_completion_tokens).toBe(80);
    expect(body.messages).toEqual([
      { role: 'system', content: 'system' },
      { role: 'user', content: 'nursing' },
    ]);
  });

  it('omits JSON mode and supports a custom token parameter', async () => {
    process.env.ASSIST_JSON_MODE = 'off';
    process.env.ASSIST_MAX_TOKENS_PARAM = 'max_tokens';
    const fetchMock = jest.fn().mockResolvedValue(modelResponse('{"area":null,"location":null}'));
    setFetch(fetchMock);

    await callModel('nursing', 'system');

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.response_format).toBeUndefined();
    expect(body.max_tokens).toBe(80);
    expect(body.max_completion_tokens).toBeUndefined();
    expect(body.temperature).toBeUndefined();
  });

  describe('response caching', () => {
    it('serves a repeated prompt from cache without another model call', async () => {
      const fetchMock = jest
        .fn()
        .mockResolvedValue(modelResponse('{"area":"Nursing","location":"VIC"}'));
      setFetch(fetchMock);

      const first = await callModel('nursing in vic', 'system');
      const second = await callModel('nursing in vic', 'system');

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(second).toBe(first);
    });

    it('matches the same intent across case and whitespace differences', async () => {
      const fetchMock = jest
        .fn()
        .mockResolvedValue(modelResponse('{"area":"Nursing","location":"VIC"}'));
      setFetch(fetchMock);

      await callModel('Nursing in VIC', 'system');
      await callModel('  nursing   in   vic  ', 'system');

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('caches an explicit "no match" answer', async () => {
      const fetchMock = jest.fn().mockResolvedValue(modelResponse('{"area":null,"location":null}'));
      setFetch(fetchMock);

      await callModel('something health related', 'system');
      await callModel('something health related', 'system');

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('does not cache malformed model output', async () => {
      const fetchMock = jest.fn().mockResolvedValue(modelResponse('I cannot help with that'));
      setFetch(fetchMock);

      await callModel('nursing', 'system');
      await callModel('nursing', 'system');

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('does not cache an HTTP failure', async () => {
      const fetchMock = jest.fn().mockResolvedValue({ ok: false });
      setFetch(fetchMock);

      await callModel('nursing', 'system');
      await callModel('nursing', 'system');

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('coalesces concurrent identical requests into one call', async () => {
      let resolveFetch!: (value: unknown) => void;
      const pending = new Promise((resolve) => {
        resolveFetch = resolve;
      });
      const fetchMock = jest.fn().mockReturnValue(pending);
      setFetch(fetchMock);

      const first = callModel('nursing in vic', 'system');
      const second = callModel('NURSING IN VIC', 'system');

      expect(fetchMock).toHaveBeenCalledTimes(1);

      resolveFetch(modelResponse('{"area":"Nursing","location":"VIC"}'));

      await expect(Promise.all([first, second])).resolves.toEqual([
        { area: 'Nursing', location: 'VIC' },
        { area: 'Nursing', location: 'VIC' },
      ]);
    });

    it('can be disabled with ASSIST_CACHE=off', async () => {
      process.env.ASSIST_CACHE = 'off';
      const fetchMock = jest
        .fn()
        .mockResolvedValue(modelResponse('{"area":"Nursing","location":"VIC"}'));
      setFetch(fetchMock);

      await callModel('nursing in vic', 'system');
      await callModel('nursing in vic', 'system');

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
