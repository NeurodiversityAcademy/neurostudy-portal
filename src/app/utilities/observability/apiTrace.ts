import 'server-only';
import {
  createTraceId,
  hashQuery,
  outcomeRequiresReason,
  recordApiEvent,
  type ApiTraceEvent,
  type DecisionTrace,
  type GateTrace,
  type OutcomeCode,
  type UsageTrace,
} from './events';
import { endSpan, startSpan, toSpanAttributes } from './telemetry';

export type ApiTrace = {
  readonly id: string;
  setQuery(text: string): void;
  setOutcome(outcome: OutcomeCode, reason?: string): void;
  setGate(gate: Partial<GateTrace>): void;
  setDecision(decision: Partial<DecisionTrace>): void;
  setUsage(usage: Partial<UsageTrace>): void;
  finish(status: number): ApiTraceEvent;
};

const DEFAULT_USAGE: UsageTrace = {
  surface: 'api',
  mode: 'n/a',
  usedModel: false,
};

export function startApiTrace(route: string, request: Request): ApiTrace {
  const id = createTraceId();
  const startedAt = Date.now();
  const method = request.method || 'GET';
  const span = startSpan(`api.${route}`, {
    'api.route': route,
    'api.method': method,
    'trace.id': id,
  });

  let outcome: OutcomeCode = 'ok';
  let reason: string | undefined;
  let queryHash: string | undefined;
  let gate: GateTrace | undefined;
  let decision: DecisionTrace | undefined;
  let usage: UsageTrace = { ...DEFAULT_USAGE };
  let finished = false;

  return {
    id,

    setQuery(text) {
      queryHash = hashQuery(text);
    },

    setOutcome(nextOutcome, nextReason) {
      outcome = nextOutcome;
      reason = nextReason;
      if (process.env.NODE_ENV === 'test' && outcomeRequiresReason(nextOutcome) && !nextReason) {
        throw new Error(`Trace outcome "${nextOutcome}" requires a reason`);
      }
    },

    setGate(nextGate) {
      gate = {
        ...(gate ?? { automation: 'pass', botId: 'unavailable', rateLimit: 'pass' }),
        ...nextGate,
      };
    },

    setDecision(nextDecision) {
      decision = { ...(decision ?? { path: 'n/a' }), ...nextDecision };
    },

    setUsage(nextUsage) {
      usage = { ...usage, ...nextUsage };
    },

    finish(status) {
      if (finished) {
        throw new Error(`Trace ${id} already finished`);
      }
      finished = true;

      const latencyMs = Date.now() - startedAt;
      const event: ApiTraceEvent = {
        event: 'api_request',
        traceId: id,
        timestamp: new Date().toISOString(),
        route,
        method,
        status,
        outcome,
        reason: reason ?? (outcomeRequiresReason(outcome) ? 'unspecified' : undefined),
        latencyMs,
        queryHash,
        gate,
        decision,
        usage,
      };

      recordApiEvent(event);

      const tokens = usage.tokens;
      endSpan(
        span,
        toSpanAttributes({
          'api.route': route,
          'api.method': method,
          'api.status': status,
          'api.outcome': outcome,
          'api.reason': reason,
          'api.latency_ms': latencyMs,
          'search.query_hash': queryHash,
          'search.path': decision?.path,
          'search.area': decision?.area,
          'search.locations': decision?.locations,
          'search.result_count': decision?.resultCount,
          'search.tier_course_endorsed': decision?.tierCounts?.courseEndorsed,
          'search.tier_endorsed': decision?.tierCounts?.endorsed,
          'search.tier_emerging': decision?.tierCounts?.emerging,
          'gate.automation': gate?.automation,
          'gate.botid': gate?.botId,
          'gate.rate_limit': gate?.rateLimit,
          'usage.surface': usage.surface,
          'usage.mode': usage.mode,
          'usage.used_model': usage.usedModel,
          'usage.cache_hit': usage.cacheHit,
          'usage.email_sent': usage.emailSent,
          'usage.slug_count': usage.slugCount,
          'model.name': usage.model,
          'tokens.prompt': tokens?.prompt,
          'tokens.completion': tokens?.completion,
          'tokens.total': tokens?.total,
          'tokens.saved_prompt': usage.tokensSaved?.prompt,
          'tokens.saved_completion': usage.tokensSaved?.completion,
          'tokens.saved_total': usage.tokensSaved?.total,
        }),
      );

      return event;
    },
  };
}

export async function observeApi(
  route: string,
  request: Request,
  handler: (trace: ApiTrace) => Promise<Response>,
): Promise<Response> {
  const trace = startApiTrace(route, request);
  try {
    const response = await handler(trace);
    try {
      // Correlates the browser's GA event with the server trace without PII.
      response.headers.set('x-nda-trace-id', trace.id);
    } catch {
      // Some response bodies come from immutable headers; tracing still works.
    }
    trace.finish(response.status);
    return response;
  } catch (error) {
    trace.setOutcome('error', 'unhandled_exception');
    trace.finish(500);
    throw error;
  }
}
