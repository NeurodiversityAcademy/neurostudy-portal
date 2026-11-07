const TRACE_KEY = 'nda:search:traceId';

/**
 * Feedback usually follows the search within the same visit. An id older than
 * this belongs to a different search, so joining it would misattribute results.
 */
export const TRACE_TTL_MS = 30 * 60 * 1000;

type StoredTrace = {
  traceId: string;
  savedAt: number;
};

function sessionStore(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function rememberSearchTraceId(traceId: string | undefined): void {
  const store = sessionStore();
  if (!store) {
    return;
  }

  try {
    if (!traceId) {
      store.removeItem(TRACE_KEY);
      return;
    }

    const entry: StoredTrace = { traceId, savedAt: Date.now() };
    store.setItem(TRACE_KEY, JSON.stringify(entry));
  } catch {
    // Storage can be unavailable in private mode; tracing is best-effort.
  }
}

export function readSearchTraceId(now: number = Date.now()): string | undefined {
  const store = sessionStore();
  if (!store) {
    return undefined;
  }

  try {
    const raw = store.getItem(TRACE_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as Partial<StoredTrace>;
    const valid =
      typeof parsed.traceId === 'string' &&
      parsed.traceId.length > 0 &&
      typeof parsed.savedAt === 'number' &&
      now - parsed.savedAt <= TRACE_TTL_MS;

    if (!valid) {
      store.removeItem(TRACE_KEY);
      return undefined;
    }

    return parsed.traceId;
  } catch {
    try {
      store.removeItem(TRACE_KEY);
    } catch {
      // Ignore: the entry is unreadable either way.
    }
    return undefined;
  }
}

export function clearSearchTraceId(): void {
  const store = sessionStore();
  if (!store) {
    return;
  }

  try {
    store.removeItem(TRACE_KEY);
  } catch {
    // Ignore.
  }
}
