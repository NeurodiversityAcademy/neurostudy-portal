/**
 * @jest-environment node
 */
import { callModel } from '../llm';

const ENV_KEYS = [
  'ASSIST_API_URL',
  'ASSIST_API_KEY',
  'ASSIST_MODEL',
  'ASSIST_AUTH_HEADER',
  'ASSIST_JSON_MODE',
  'ASSIST_TEMPERATURE',
  'ASSIST_MAX_TOKENS_PARAM',
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
});
