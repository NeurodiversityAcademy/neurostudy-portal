import fs from 'node:fs';
import path from 'node:path';
import { loadProviderSearchContext, type ProviderSearchContext } from '../catalog';
import { buildProviderRankSignals } from '../providerRankingSignals';
import { countProviderSearchResults, searchProvidersByFilters } from '../searchProviders';
import { classifyOutOfScope, tryAreaOnlyHit, tryKeywordHit } from '../assist/parse';
import { callModelWithMeta, type AssistModelOutcome } from '../assist/llm';
import { buildAssistSystemPrompt, buildUserMessage } from '../assist/prompt';

export type EvalMode = 'offline' | 'live';
export type EvalCategory = 'keyword' | 'model' | 'location' | 'area' | 'offtopic';

export type GoldenExpectation = {
  outcome: 'keyword' | 'model' | 'location' | 'area' | 'refusal';
  area: string | null;
  /** Live-model extraction accepts any of these labels (catalog aliases). */
  acceptAreas?: string[];
  locations?: string[];
  /** Reviewed top-3 slugs; the first entry must appear in the live top-3. */
  top3?: string[];
  minResults?: number;
};

export type GoldenCase = {
  id: string;
  category: EvalCategory;
  query: string;
  expect: GoldenExpectation;
};

export type GoldenSet = {
  version: number;
  catalogSnapshot: string;
  counts: Record<EvalCategory, number>;
  cases: GoldenCase[];
};

export type CaseChecks = {
  keywordMatch?: boolean;
  reachesModel?: boolean;
  refused?: boolean;
  nonEmpty?: boolean;
  top3?: boolean;
  area?: boolean;
};

export type CaseOutcome = {
  id: string;
  category: EvalCategory;
  query: string;
  passed: boolean;
  checks: CaseChecks;
  resultCount?: number;
  detail?: string;
};

export type MetricResult = {
  label: string;
  passed: number;
  total: number;
  rate: number | null;
  threshold: number;
  ok: boolean;
};

export type EvalReport = {
  mode: EvalMode;
  startedAt: string;
  goldenPath: string;
  counts: Record<EvalCategory, number>;
  cases: CaseOutcome[];
  metrics: {
    extractionAccuracy: MetricResult;
    keywordHitRate: MetricResult;
    areaHitRate: MetricResult;
    refusalAccuracy: MetricResult;
    zeroResultRate: MetricResult;
    top3Rate: MetricResult;
  };
  breaches: string[];
  live?: {
    modelCalls: number;
    retries: number;
    promptTokens: number;
    completionTokens: number;
  };
};

export const THRESHOLDS = {
  extractionAccuracy: 0.95,
  top3Rate: 0.85,
  refusalAccuracy: 1,
  keywordHitRate: 1,
  /** Fraction of area-only queries that resolve an area and return providers. */
  areaHitRate: 1,
  /** Fraction of searchable cases that return no providers. */
  zeroResultRate: 0,
} as const;

const GOLDEN_PATH = 'src/app/utilities/providerSearch/evals/golden-search.json';
const LATEST_REPORT_PATH = 'docs/evals/latest.md';
const RETRYABLE = new Set<AssistModelOutcome>(['http_error', 'timeout', 'error']);
const MAX_ATTEMPTS = 3;

type SearchOutcome = { count: number; top3: string[] };
type Lookup = (area: string | null, locations: string[]) => SearchOutcome;

export function loadGoldenSet(filePath = path.join(process.cwd(), GOLDEN_PATH)): GoldenSet {
  const golden = JSON.parse(fs.readFileSync(filePath, 'utf8')) as GoldenSet;
  if (!Array.isArray(golden.cases) || golden.cases.length === 0) {
    throw new Error(`Golden set is empty: ${filePath}`);
  }
  return golden;
}

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

function containsAll(values: string[], expected: string[]): boolean {
  const present = new Set(values.map(normalise));
  return expected.every((value) => present.has(normalise(value)));
}

export function createLookup(context: ProviderSearchContext = loadProviderSearchContext()): Lookup {
  const signals = buildProviderRankSignals(context.providers);
  return (area, locations) => {
    const results = searchProvidersByFilters(
      context.providers,
      { interestAreas: area ? [area] : [], locations },
      signals,
    );
    return {
      count: countProviderSearchResults(results),
      top3: [...results.course_endorsed, ...results.endorsed, ...results.emerging]
        .slice(0, 3)
        .map((provider) => provider.slug),
    };
  };
}

function metric(
  label: string,
  values: boolean[],
  threshold: number,
  compare: (rate: number) => boolean,
): MetricResult {
  const passed = values.filter(Boolean).length;
  const total = values.length;
  const rate = total === 0 ? null : passed / total;
  return {
    label,
    passed,
    total,
    rate,
    threshold,
    ok: rate === null ? true : compare(rate),
  };
}

function fail(
  c: GoldenCase,
  checks: CaseChecks,
  detail: string,
  resultCount?: number,
): CaseOutcome {
  return {
    id: c.id,
    category: c.category,
    query: c.query,
    passed: false,
    checks,
    detail,
    resultCount,
  };
}

function pass(c: GoldenCase, checks: CaseChecks, resultCount?: number): CaseOutcome {
  return { id: c.id, category: c.category, query: c.query, passed: true, checks, resultCount };
}

function evaluateKeyword(c: GoldenCase, hit: ReturnType<typeof tryKeywordHit>, lookup: Lookup) {
  const area = c.expect.area ?? '';
  const locations = c.expect.locations ?? [];
  const keywordMatch = hit !== null && hit.area === area && containsAll(hit.locations, locations);
  if (!keywordMatch) {
    return fail(c, { keywordMatch }, `expected keyword ${area} / ${locations.join(', ')}`);
  }

  const result = lookup(area, locations);
  const nonEmpty = result.count >= (c.expect.minResults ?? 1);
  const top3 = c.expect.top3 ? result.top3.includes(c.expect.top3[0]) : undefined;
  const checks = { keywordMatch, nonEmpty, ...(top3 === undefined ? {} : { top3 }) };
  const passed = nonEmpty && top3 !== false;
  return passed
    ? pass(c, checks, result.count)
    : fail(
        c,
        checks,
        `results ${result.count}, top3 ${result.top3.join(', ') || '(none)'}`,
        result.count,
      );
}

function evaluateLocation(c: GoldenCase, hit: ReturnType<typeof tryKeywordHit>, lookup: Lookup) {
  const locations = c.expect.locations ?? [];
  const reachesModel = hit === null;
  const result = lookup(null, locations);
  const nonEmpty = result.count >= (c.expect.minResults ?? 1);
  const checks = { reachesModel, nonEmpty };
  return nonEmpty && reachesModel
    ? pass(c, checks, result.count)
    : fail(c, checks, `results ${result.count} for ${locations.join(', ')}`, result.count);
}

function evaluateArea(
  c: GoldenCase,
  hit: ReturnType<typeof tryKeywordHit>,
  lookup: Lookup,
  context: ProviderSearchContext,
) {
  const expected = c.expect.area ?? '';
  const detected = tryAreaOnlyHit(c.query, context);
  const areaOk = detected !== null && normalise(detected) === normalise(expected);
  const result = lookup(detected ?? expected, []);
  const nonEmpty = result.count >= (c.expect.minResults ?? 1);
  const checks: CaseChecks = { reachesModel: hit === null, area: areaOk, nonEmpty };
  const passed = hit === null && areaOk && nonEmpty;
  return passed
    ? pass(c, checks, result.count)
    : fail(
        c,
        checks,
        `detected=${detected ?? 'null'}, keyword=${String(hit !== null)}, results ${result.count}`,
        result.count,
      );
}

function evaluateRefusal(
  c: GoldenCase,
  hit: ReturnType<typeof tryKeywordHit>,
  context: ProviderSearchContext,
) {
  const reason = classifyOutOfScope(c.query, context);
  const refused = reason !== null && hit === null;
  return refused
    ? pass(c, { refused })
    : fail(c, { refused }, `expected a refusal, got ${reason ?? 'none'}`);
}

async function callWithRetries(
  query: string,
  context: ProviderSearchContext,
  live: NonNullable<EvalReport['live']>,
): Promise<{ area: string | null; outcome: AssistModelOutcome }> {
  let call = await callModelWithMeta(buildUserMessage(query), buildAssistSystemPrompt(context));
  live.modelCalls += 1;
  live.promptTokens += call.meta.usage.prompt ?? 0;
  live.completionTokens += call.meta.usage.completion ?? 0;

  let attempt = 1;
  while (RETRYABLE.has(call.meta.outcome) && attempt < MAX_ATTEMPTS) {
    call = await callModelWithMeta(buildUserMessage(query), buildAssistSystemPrompt(context));
    attempt += 1;
    live.retries += 1;
    live.modelCalls += 1;
    live.promptTokens += call.meta.usage.prompt ?? 0;
    live.completionTokens += call.meta.usage.completion ?? 0;
  }

  return { area: call.value?.area?.trim() ?? null, outcome: call.meta.outcome };
}

async function evaluateModelCase(
  c: GoldenCase,
  hit: ReturnType<typeof tryKeywordHit>,
  lookup: Lookup,
  context: ProviderSearchContext,
  mode: EvalMode,
  live: NonNullable<EvalReport['live']>,
): Promise<CaseOutcome> {
  const reachesModel = hit === null && classifyOutOfScope(c.query, context) === null;
  const locations = c.expect.locations ?? [];
  const result = lookup(c.expect.area, locations);
  const nonEmpty = result.count >= (c.expect.minResults ?? 1);
  const top3 = c.expect.top3 ? result.top3.includes(c.expect.top3[0]) : undefined;
  const baseChecks: CaseChecks = {
    reachesModel,
    nonEmpty,
    ...(top3 === undefined ? {} : { top3 }),
  };
  const baseOk = reachesModel && nonEmpty && top3 !== false;

  if (mode === 'offline') {
    return baseOk
      ? pass(c, baseChecks, result.count)
      : fail(
          c,
          baseChecks,
          `offline routing mismatch (keyword=${String(hit !== null)})`,
          result.count,
        );
  }

  const accepted = c.expect.acceptAreas ?? (c.expect.area ? [c.expect.area] : []);
  const model = await callWithRetries(c.query, context, live);
  const areaOk =
    model.area !== null &&
    accepted.some((value) => normalise(value) === normalise(model.area ?? ''));

  const checks = { ...baseChecks, area: areaOk };
  if (baseOk && areaOk) {
    return pass(c, checks, result.count);
  }
  return fail(
    c,
    checks,
    `model=${model.area ?? 'null'} (${model.outcome}); accepted=${accepted.join('|')}`,
    result.count,
  );
}

async function evaluateCase(
  c: GoldenCase,
  mode: EvalMode,
  lookup: Lookup,
  context: ProviderSearchContext,
  live: NonNullable<EvalReport['live']>,
): Promise<CaseOutcome> {
  const hit = tryKeywordHit(c.query, context);

  if (c.category === 'offtopic') {
    return evaluateRefusal(c, hit, context);
  }
  if (c.category === 'keyword') {
    return evaluateKeyword(c, hit, lookup);
  }
  if (c.category === 'location') {
    return evaluateLocation(c, hit, lookup);
  }
  if (c.category === 'area') {
    return evaluateArea(c, hit, lookup, context);
  }
  return evaluateModelCase(c, hit, lookup, context, mode, live);
}

export async function runEvals(options: {
  mode: EvalMode;
  goldenPath?: string;
  now?: () => Date;
}): Promise<EvalReport> {
  const golden = loadGoldenSet(options.goldenPath);
  const context = loadProviderSearchContext();
  const lookup = createLookup(context);
  const startedAt = (options.now?.() ?? new Date()).toISOString();
  const live: NonNullable<EvalReport['live']> = {
    modelCalls: 0,
    retries: 0,
    promptTokens: 0,
    completionTokens: 0,
  };

  const cases: CaseOutcome[] = [];
  for (const goldenCase of golden.cases) {
    cases.push(await evaluateCase(goldenCase, options.mode, lookup, context, live));
  }

  const keywordCases = cases.filter((c) => c.category === 'keyword');
  const areaCases = cases.filter((c) => c.category === 'area');
  const modelCases = cases.filter((c) => c.category === 'model');
  const searchable = cases.filter((c) => c.resultCount !== undefined);
  const labelled = cases.filter((c) => c.checks.top3 !== undefined);

  const metrics = {
    extractionAccuracy: metric(
      'extraction accuracy',
      modelCases.filter((c) => c.checks.area !== undefined).map((c) => c.checks.area === true),
      THRESHOLDS.extractionAccuracy,
      (rate) => rate >= THRESHOLDS.extractionAccuracy,
    ),
    keywordHitRate: metric(
      'keyword-hit rate',
      keywordCases.map((c) => c.checks.keywordMatch === true),
      THRESHOLDS.keywordHitRate,
      (rate) => rate >= THRESHOLDS.keywordHitRate,
    ),
    areaHitRate: metric(
      'area-only routing',
      areaCases.map((c) => c.checks.area === true && c.checks.nonEmpty === true),
      THRESHOLDS.areaHitRate,
      (rate) => rate >= THRESHOLDS.areaHitRate,
    ),
    refusalAccuracy: metric(
      'scope/refusal accuracy',
      cases.filter((c) => c.category === 'offtopic').map((c) => c.checks.refused === true),
      THRESHOLDS.refusalAccuracy,
      (rate) => rate >= THRESHOLDS.refusalAccuracy,
    ),
    zeroResultRate: metric(
      'zero-result rate',
      searchable.map((c) => c.checks.nonEmpty === false),
      THRESHOLDS.zeroResultRate,
      (rate) => rate <= THRESHOLDS.zeroResultRate,
    ),
    top3Rate: metric(
      'top-3 relevance',
      labelled.map((c) => c.checks.top3 === true),
      THRESHOLDS.top3Rate,
      (rate) => rate >= THRESHOLDS.top3Rate,
    ),
  };

  const breaches = Object.values(metrics)
    .filter((result) => !result.ok)
    .map((result) => {
      const actual = result.rate === null ? 'n/a' : `${(result.rate * 100).toFixed(1)}%`;
      const threshold =
        result.label === 'zero-result rate'
          ? `max ${(result.threshold * 100).toFixed(0)}%`
          : `min ${(result.threshold * 100).toFixed(0)}%`;
      return `${result.label} ${actual} (${result.passed}/${result.total}) breaches ${threshold}`;
    });

  return {
    mode: options.mode,
    startedAt,
    goldenPath: path.relative(
      process.cwd(),
      options.goldenPath ?? path.join(process.cwd(), GOLDEN_PATH),
    ),
    counts: golden.counts,
    cases,
    metrics,
    breaches,
    ...(options.mode === 'live' ? { live } : {}),
  };
}

/** Pads cells the way Prettier formats markdown tables, so the generated report stays format-clean. */
function renderTable(headers: string[], rows: string[][]): string[] {
  const widths = headers.map((header, column) =>
    Math.max(header.length, ...rows.map((row) => (row[column] ?? '').length)),
  );
  const formatRow = (cells: string[]) =>
    `| ${cells.map((cell, column) => cell.padEnd(widths[column])).join(' | ')} |`;

  return [
    formatRow(headers),
    `| ${widths.map((width) => '-'.repeat(width)).join(' | ')} |`,
    ...rows.map(formatRow),
  ];
}

function formatMetric(result: MetricResult): string[] {
  const rate = result.rate === null ? 'n/a' : `${(result.rate * 100).toFixed(1)}%`;
  const threshold =
    result.label === 'zero-result rate'
      ? `≤ ${(result.threshold * 100).toFixed(0)}%`
      : `≥ ${(result.threshold * 100).toFixed(0)}%`;
  const status = result.total === 0 ? 'not run' : result.ok ? 'pass' : 'FAIL';
  return [result.label, `${result.passed}/${result.total} (${rate})`, threshold, status];
}

export function formatReport(report: EvalReport): string {
  const failures = report.cases.filter((c) => !c.passed);
  const metricRows = [
    report.metrics.extractionAccuracy,
    report.metrics.keywordHitRate,
    report.metrics.areaHitRate,
    report.metrics.refusalAccuracy,
    report.metrics.zeroResultRate,
    report.metrics.top3Rate,
  ].map(formatMetric);
  const lines = [
    '# Search intent eval — latest',
    '',
    `- Mode: **${report.mode}**`,
    `- Run: ${report.startedAt}`,
    `- Golden set: \`${report.goldenPath}\` (${report.cases.length} cases: ${report.counts.keyword} keyword, ${report.counts.model} model/synonym, ${report.counts.location} location-only, ${report.counts.area} area-only, ${report.counts.offtopic} off-topic/injection)`,
    '',
    ...renderTable(['Metric', 'Result', 'Threshold', 'Status'], metricRows),
    '',
  ];

  if (report.metrics.extractionAccuracy.total === 0) {
    lines.push(
      'Extraction accuracy is not measured offline; the nightly live job enforces the ≥95% gate.',
      '',
    );
  }

  if (report.live) {
    lines.push(
      `Live model: ${report.live.modelCalls} calls (${report.live.retries} retries), ${report.live.promptTokens} prompt + ${report.live.completionTokens} completion tokens.`,
      '',
    );
  }

  const unmeasured = Object.values(report.metrics).some((result) => result.total === 0);
  const resultLine =
    report.breaches.length > 0
      ? '**Result: threshold breach.**'
      : unmeasured
        ? '**Result: all measured thresholds met; one or more metrics did not run.**'
        : '**Result: all thresholds met.**';
  lines.push(resultLine);
  if (report.breaches.length > 0) {
    lines.push('', 'Breaches:', ...report.breaches.map((breach) => `- ${breach}`));
  }

  lines.push('', `Failures: ${failures.length}`);
  if (failures.length > 0) {
    lines.push(
      '',
      ...renderTable(
        ['Case', 'Query', 'Detail'],
        failures.map((failure) => [failure.id, failure.query, failure.detail ?? 'failed']),
      ),
    );
  }

  return `${lines.join('\n')}\n`;
}

export function writeLatestReport(
  markdown: string,
  filePath = path.join(process.cwd(), LATEST_REPORT_PATH),
): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, markdown);
}
