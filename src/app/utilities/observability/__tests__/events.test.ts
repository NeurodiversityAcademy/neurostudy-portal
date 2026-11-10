/**
 * @jest-environment node
 */
import {
  formatTraceEvent,
  hashQuery,
  outcomeRequiresReason,
  recordApiEvent,
  sanitiseTraceFields,
  type ApiTraceEvent,
} from '../events';

describe('telemetry events', () => {
  it('hashes a query without storing the raw text', () => {
    const hash = hashQuery('Nursing in Melbourne');

    expect(hash).toHaveLength(32);
    expect(hash).toMatch(/^[a-f0-9]+$/);
    expect(hash).not.toContain('nursing');
  });

  it('normalises case and surrounding whitespace in the hash', () => {
    expect(hashQuery('  Nursing in Melbourne ')).toBe(hashQuery('nursing in melbourne'));
  });

  it('requires a reason for every refusal or failure outcome', () => {
    expect(outcomeRequiresReason('off_topic')).toBe(true);
    expect(outcomeRequiresReason('forbidden')).toBe(true);
    expect(outcomeRequiresReason('rate_limited')).toBe(true);
    expect(outcomeRequiresReason('invalid_request')).toBe(true);
    expect(outcomeRequiresReason('consent_required')).toBe(true);
    expect(outcomeRequiresReason('not_available')).toBe(true);
    expect(outcomeRequiresReason('storage_failed')).toBe(true);
    expect(outcomeRequiresReason('expired')).toBe(true);
    expect(outcomeRequiresReason('error')).toBe(true);

    expect(outcomeRequiresReason('ok')).toBe(false);
    expect(outcomeRequiresReason('keyword_hit')).toBe(false);
    expect(outcomeRequiresReason('model_hit')).toBe(false);
    expect(outcomeRequiresReason('suggestion')).toBe(false);
    expect(outcomeRequiresReason('confirmed')).toBe(false);
  });

  it('drops obvious PII keys from trace fields', () => {
    expect(
      sanitiseTraceFields({
        area: 'Nursing',
        email: 'person@example.com',
        query: 'nursing in melbourne',
        prompt: 'secret',
        latencyMs: 12,
      }),
    ).toEqual({ area: 'Nursing', latencyMs: 12 });
  });

  it('writes one JSON line per event', () => {
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    const event: ApiTraceEvent = {
      event: 'api_request',
      traceId: 'abc',
      timestamp: '2026-01-01T00:00:00.000Z',
      route: 'search/assist',
      method: 'POST',
      status: 200,
      outcome: 'keyword_hit',
      reason: 'keyword_match',
      latencyMs: 4,
    };

    recordApiEvent(event);

    expect(info).toHaveBeenCalledTimes(1);
    const line = info.mock.calls[0][0] as string;
    expect(JSON.parse(line)).toEqual(event);
    expect(formatTraceEvent(event)).toBe(line);
    info.mockRestore();
  });
});
