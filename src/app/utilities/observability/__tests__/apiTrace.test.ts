/**
 * @jest-environment node
 */
import { observeApi, startApiTrace } from '../apiTrace';

const REQUEST = new Request('http://localhost:3000/api/search/assist', { method: 'POST' });

describe('startApiTrace', () => {
  let info: jest.SpyInstance;

  beforeEach(() => {
    info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    info.mockRestore();
  });

  it('records the decision, gate, usage, and latency without raw text', () => {
    const trace = startApiTrace('search/assist', REQUEST);
    trace.setQuery('nursing in melbourne');
    trace.setGate({ automation: 'pass', botId: 'pass', rateLimit: 'pass' });
    trace.setDecision({
      path: 'keyword',
      area: 'Nursing',
      locations: ['Melbourne', 'VIC'],
      resultCount: 3,
      tierCounts: { courseEndorsed: 0, endorsed: 1, emerging: 2 },
    });
    trace.setUsage({ surface: 'search', mode: 'quick', usedModel: false });
    trace.setOutcome('keyword_hit', 'keyword_match');

    const event = trace.finish(200);

    expect(event).toMatchObject({
      event: 'api_request',
      route: 'search/assist',
      method: 'POST',
      status: 200,
      outcome: 'keyword_hit',
      reason: 'keyword_match',
      gate: { automation: 'pass', botId: 'pass', rateLimit: 'pass' },
      decision: {
        path: 'keyword',
        area: 'Nursing',
        locations: ['Melbourne', 'VIC'],
        resultCount: 3,
      },
      usage: { surface: 'search', mode: 'quick', usedModel: false },
    });
    expect(event.queryHash).toHaveLength(32);
    expect(JSON.stringify(event)).not.toContain('nursing in melbourne');
    expect(event.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('refuses to finish the same trace twice', () => {
    const trace = startApiTrace('verify', REQUEST);
    trace.setOutcome('ok', 'verified');
    trace.finish(204);

    expect(() => trace.finish(204)).toThrow('already finished');
  });

  it('requires a reason for a refusal in tests', () => {
    const trace = startApiTrace('search/assist', REQUEST);

    expect(() => trace.setOutcome('off_topic')).toThrow('requires a reason');
  });
});

describe('observeApi', () => {
  let info: jest.SpyInstance;

  beforeEach(() => {
    info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    info.mockRestore();
  });

  it('returns the handler response and records its status', async () => {
    const response = await observeApi('providerCompare', REQUEST, async (trace) => {
      trace.setOutcome('ok', 'compare_served');
      return Response.json({ ok: true });
    });

    expect(response.status).toBe(200);
    const event = JSON.parse(info.mock.calls[0][0] as string);
    expect(event.status).toBe(200);
    expect(event.outcome).toBe('ok');
  });

  it('records an unhandled exception and rethrows it', async () => {
    await expect(
      observeApi('search/assist', REQUEST, async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    const event = JSON.parse(info.mock.calls[0][0] as string);
    expect(event.status).toBe(500);
    expect(event.outcome).toBe('error');
    expect(event.reason).toBe('unhandled_exception');
  });
});
