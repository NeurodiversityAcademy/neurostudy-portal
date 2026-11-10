/**
 * @jest-environment node
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { outcomeRequiresReason, type OutcomeCode } from '../events';

const OBSERVED_ROUTES = [
  'src/app/api/search/assist/route.ts',
  'src/app/api/search/health/route.ts',
  'src/app/api/shortlist/route.ts',
  'src/app/api/shortlist/confirm/route.ts',
  'src/app/api/providerCompare/route.ts',
  'src/app/api/verify/route.ts',
];

type Call = { outcome: string; hasReason: boolean };

/** Extracts `setOutcome(...)` calls while respecting nested parentheses and strings. */
function extractSetOutcomeCalls(source: string): Call[] {
  const calls: Call[] = [];
  const marker = 'setOutcome(';
  let index = source.indexOf(marker);

  while (index !== -1) {
    let depth = 1;
    let cursor = index + marker.length;
    let quote: string | null = null;
    let commaAtTopLevel = false;
    const start = cursor;

    while (cursor < source.length && depth > 0) {
      const char = source[cursor];
      if (quote) {
        if (char === '\\') {
          cursor += 2;
          continue;
        }
        if (char === quote) {
          quote = null;
        }
      } else if (char === "'" || char === '"' || char === '`') {
        quote = char;
      } else if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth -= 1;
        if (depth === 0) {
          break;
        }
      } else if (char === ',' && depth === 1) {
        commaAtTopLevel = true;
      }
      cursor += 1;
    }

    const args = source.slice(start, cursor);
    const firstArg = args.match(/^\s*'([^']+)'/)?.[1] ?? '';
    calls.push({ outcome: firstArg, hasReason: commaAtTopLevel && args.trim().length > 0 });
    index = source.indexOf(marker, cursor);
  }

  return calls;
}

describe('reasoning coverage gate', () => {
  it.each(OBSERVED_ROUTES)('%s traces every request and reasons every refusal', (file) => {
    const source = readFileSync(path.join(process.cwd(), file), 'utf8');

    expect(source).toContain('observeApi(');
    const calls = extractSetOutcomeCalls(source);
    expect(calls.length).toBeGreaterThan(0);

    for (const call of calls) {
      expect(call.outcome).not.toBe('');
      if (outcomeRequiresReason(call.outcome as OutcomeCode)) {
        expect(call.hasReason).toBe(true);
      }
    }
  });
});
