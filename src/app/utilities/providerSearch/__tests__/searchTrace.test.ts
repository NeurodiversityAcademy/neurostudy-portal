/**
 * @jest-environment jsdom
 */
import {
  clearSearchTraceId,
  readSearchTraceId,
  rememberSearchTraceId,
  TRACE_TTL_MS,
} from '../searchTrace';

const TRACE_KEY = 'nda:search:traceId';

describe('searchTrace', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('remembers and reads back a trace id', () => {
    rememberSearchTraceId('trace-1');

    expect(readSearchTraceId()).toBe('trace-1');
  });

  it('clears the trace id', () => {
    rememberSearchTraceId('trace-1');

    clearSearchTraceId();

    expect(readSearchTraceId()).toBeUndefined();
    expect(window.sessionStorage.getItem(TRACE_KEY)).toBeNull();
  });

  it('drops an older id when a later search has none', () => {
    rememberSearchTraceId('trace-1');

    rememberSearchTraceId(undefined);

    expect(readSearchTraceId()).toBeUndefined();
  });

  it('expires stale ids so unrelated feedback is not joined', () => {
    rememberSearchTraceId('trace-1');

    expect(readSearchTraceId(Date.now() + TRACE_TTL_MS + 1_000)).toBeUndefined();
    expect(window.sessionStorage.getItem(TRACE_KEY)).toBeNull();
  });

  it('keeps an id inside the ttl window', () => {
    rememberSearchTraceId('trace-1');

    expect(readSearchTraceId(Date.now() + TRACE_TTL_MS - 1_000)).toBe('trace-1');
  });

  it('discards malformed stored values', () => {
    window.sessionStorage.setItem(TRACE_KEY, 'not json');

    expect(readSearchTraceId()).toBeUndefined();
    expect(window.sessionStorage.getItem(TRACE_KEY)).toBeNull();
  });

  it('discards entries missing a trace id or timestamp', () => {
    window.sessionStorage.setItem(TRACE_KEY, JSON.stringify({ traceId: '', savedAt: Date.now() }));

    expect(readSearchTraceId()).toBeUndefined();
  });

  it('swallows storage errors', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const removeItem = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    try {
      expect(() => rememberSearchTraceId('trace-1')).not.toThrow();
      expect(readSearchTraceId()).toBeUndefined();
      expect(() => clearSearchTraceId()).not.toThrow();
    } finally {
      setItem.mockRestore();
      getItem.mockRestore();
      removeItem.mockRestore();
    }
  });
});
