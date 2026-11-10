import 'server-only';
import { createHash } from 'node:crypto';

export type TtlCacheOptions = {
  maxEntries: number;
  ttlMs: number;
};

export type TtlCache<T> = {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  clear(): void;
  readonly size: number;
};

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

/**
 * Small in-memory LRU with per-entry expiry.
 *
 * Values are kept only in the current server instance. On Vercel that is still
 * useful: a warm instance serves most repeat searches. It is not a shared cache.
 */
export function createTtlCache<T>({ maxEntries, ttlMs }: TtlCacheOptions): TtlCache<T> {
  if (maxEntries < 1) {
    throw new Error('maxEntries must be at least 1');
  }
  if (ttlMs < 1) {
    throw new Error('ttlMs must be at least 1');
  }

  const entries = new Map<string, CacheEntry<T>>();

  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry) {
        return undefined;
      }
      if (entry.expiresAt <= Date.now()) {
        entries.delete(key);
        return undefined;
      }
      // Refresh insertion order so the least-recently-used key is evicted first.
      entries.delete(key);
      entries.set(key, entry);
      return entry.value;
    },

    set(key, value) {
      if (entries.has(key)) {
        entries.delete(key);
      }
      entries.set(key, { value, expiresAt: Date.now() + ttlMs });

      while (entries.size > maxEntries) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined) {
          break;
        }
        entries.delete(oldest);
      }
    },

    clear() {
      entries.clear();
    },

    get size() {
      return entries.size;
    },
  };
}

/** Stable, non-reversible key. The raw query never appears in the cache. */
export function buildAssistCacheKey(parts: readonly string[]): string {
  return createHash('sha256').update(parts.join('\u0000')).digest('base64url');
}

/** Case/whitespace-insensitive so "Nursing  in VIC" and "nursing in vic" share an entry. */
export function normalizeAssistCacheText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
