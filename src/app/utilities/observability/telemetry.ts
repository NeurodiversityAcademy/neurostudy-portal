import 'server-only';
import { SpanStatusCode, trace, type Attributes, type Span } from '@opentelemetry/api';

const tracer = trace.getTracer('nda-provider-search');

export type SpanFieldValue = string | number | boolean | string[];

/**
 * Flattens nested trace fields into OpenTelemetry attributes.
 * Nested objects are intentionally not supported: attributes must be primitive.
 */
export function toSpanAttributes(fields: Record<string, unknown>): Attributes {
  const attributes: Attributes = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      attributes[key] = value;
      continue;
    }
    if (Array.isArray(value) && value.every((entry) => typeof entry === 'string')) {
      attributes[key] = value as string[];
    }
  }
  return attributes;
}

/** Starts a server span. Without an SDK registered this is a cheap no-op span. */
export function startSpan(name: string, fields: Record<string, unknown> = {}): Span {
  return tracer.startSpan(name, { attributes: toSpanAttributes(fields) });
}

export function endSpan(span: Span, fields: Record<string, unknown> = {}, error?: unknown): void {
  span.setAttributes(toSpanAttributes(fields));
  if (error) {
    span.recordException(error instanceof Error ? error : String(error));
    span.setStatus({ code: SpanStatusCode.ERROR });
  }
  span.end();
}
