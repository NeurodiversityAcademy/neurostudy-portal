import 'server-only';
import { createHash, randomBytes } from 'node:crypto';

/**
 * Every user-facing outcome has a machine-readable code.
 *
 * A refusal, empty state, or gate rejection must never be logged without a
 * reason: support needs to reproduce the decision from the trace alone.
 */
export type OutcomeCode =
  | 'ok'
  | 'keyword_hit'
  | 'model_hit'
  | 'suggestion'
  | 'off_topic'
  | 'forbidden'
  | 'rate_limited'
  | 'invalid_request'
  | 'consent_required'
  | 'not_available'
  | 'storage_failed'
  | 'confirmed'
  | 'expired'
  | 'error';

const REASON_REQUIRED: ReadonlySet<OutcomeCode> = new Set([
  'off_topic',
  'forbidden',
  'rate_limited',
  'invalid_request',
  'consent_required',
  'not_available',
  'storage_failed',
  'expired',
  'error',
]);

export function outcomeRequiresReason(outcome: OutcomeCode): boolean {
  return REASON_REQUIRED.has(outcome);
}

export type TracePath = 'keyword' | 'model' | 'off_topic' | 'suggestion' | 'gate' | 'n/a';

export type TierCounts = {
  courseEndorsed: number;
  endorsed: number;
  emerging: number;
};

export type TokenUsage = {
  prompt: number | null;
  completion: number | null;
  total: number | null;
};

export type GateTrace = {
  automation: 'pass' | 'blocked';
  botId: 'pass' | 'unavailable' | 'blocked';
  rateLimit: 'pass' | 'blocked';
};

export type UsageTrace = {
  surface: 'homepage' | 'search' | 'api';
  mode: 'quick' | 'ask' | 'n/a';
  usedModel: boolean;
  model?: string;
  cacheHit?: boolean;
  tokens?: TokenUsage;
  /** Tokens a cache hit avoided spending. Actual `tokens` stay zero. */
  tokensSaved?: TokenUsage;
  emailSent?: boolean;
  slugCount?: number;
};

export type DecisionTrace = {
  path: TracePath;
  reason?: string;
  area?: string | null;
  locations?: string[];
  resultCount?: number;
  tierCounts?: TierCounts;
};

export type ApiTraceEvent = {
  event: 'api_request';
  traceId: string;
  timestamp: string;
  route: string;
  method: string;
  status: number;
  outcome: OutcomeCode;
  reason?: string;
  latencyMs: number;
  queryHash?: string;
  gate?: GateTrace;
  decision?: DecisionTrace;
  usage?: UsageTrace;
};

/** Stable, non-reversible query identifier. Raw text never enters telemetry. */
export function hashQuery(text: string): string {
  return createHash('sha256').update(text.trim().toLowerCase()).digest('hex').slice(0, 32);
}

export function createTraceId(): string {
  return randomBytes(16).toString('hex');
}

const PII_KEY_PATTERN = /email|phone|name|address|query|text|message|prompt|completion/i;

/**
 * Shallow sanitiser for telemetry attributes. It drops obvious PII keys rather
 * than trying to scrub arbitrary strings; callers must not send raw queries.
 */
export function sanitiseTraceFields(fields: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (PII_KEY_PATTERN.test(key)) {
      continue;
    }
    if (value === undefined) {
      continue;
    }
    clean[key] = value;
  }
  return clean;
}

export function formatTraceEvent(event: ApiTraceEvent): string {
  return JSON.stringify(event);
}

/**
 * One JSON line per API request.
 *
 * Vercel ships stdout to Azure Monitor; the same fields are attached to the
 * OpenTelemetry span so App Insights can join logs, traces, and GA outcomes.
 *
 * Never pass raw query text or email addresses into this function.
 */
export function recordApiEvent(event: ApiTraceEvent): void {
  console.info(formatTraceEvent(event));
}
