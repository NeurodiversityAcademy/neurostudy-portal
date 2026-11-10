import type { ProviderSearchRecord, ProviderSearchTier } from './constants';

/** Minimal shape of one QILT SES row, as stored in `emergingProviderDocProfiles.json`. */
export type QiltStat = {
  value: string;
  nationalAverage: string;
  responses?: string;
};

export type QiltIndex = {
  /** Mean of (value − national average) across usable dimensions, in percentage points. */
  points: number;
  /** How many of the six SES dimensions could be parsed (QILT suppresses small samples as "L/N"). */
  dims: number;
  /** Largest reported response count among usable dimensions. Shown in the UI as `n`. */
  responses: number;
};

export type SupportCounts = {
  inPlace: number;
  inWorks: number;
};

export type ProviderRankSignals = {
  qilt: QiltIndex | null;
  support: SupportCounts | null;
};

export type ProviderRankSignalMap = ReadonlyMap<string, ProviderRankSignals>;

/** A ranking view of a provider. Kept separate so the comparator stays pure and testable. */
export type RankedProvider = {
  tier: ProviderSearchTier;
  certified: boolean;
  name: string;
  qilt: number | null;
  supportInPlace: number | null;
};

export const TIER_RANK: Record<ProviderSearchTier, number> = {
  course_endorsed: 0,
  endorsed: 1,
  emerging: 2,
};

/** Minimum usable SES dimensions before an index is published. */
export const MIN_QILT_DIMENSIONS = 4;

const PERCENT_PATTERN = /^\s*(-?\d+(?:\.\d+)?)\s*%\s*$/;
const COUNT_PATTERN = /^\s*(\d[\d,]*)\s*$/;

/** `"84.6%"` → `84.6`; `"L/N"` → `null`. */
export function parsePercent(value: string | null | undefined): number | null {
  if (typeof value !== 'string') {
    return null;
  }
  const match = value.match(PERCENT_PATTERN);
  if (!match) {
    return null;
  }
  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

/** `"1,278"` → `1278`; anything else → `null`. */
export function parseCount(value: string | null | undefined): number | null {
  if (typeof value !== 'string') {
    return null;
  }
  const match = value.match(COUNT_PATTERN);
  if (!match) {
    return null;
  }
  const parsed = Number.parseInt(match[1].replace(/,/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function mean(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

/**
 * Mean of (value − national average) across usable SES dimensions.
 * Returns `null` when fewer than four dimensions parse — the sample is too thin
 * to publish, and a half-index would quietly mislead.
 */
export function computeQiltIndex(stats: readonly QiltStat[]): QiltIndex | null {
  const usable = stats
    .map((stat) => ({
      value: parsePercent(stat.value),
      average: parsePercent(stat.nationalAverage),
      responses: parseCount(stat.responses),
    }))
    .filter(
      (row): row is { value: number; average: number; responses: number | null } =>
        row.value !== null && row.average !== null,
    );

  if (usable.length < MIN_QILT_DIMENSIONS) {
    return null;
  }

  return {
    points: mean(usable.map((row) => row.value - row.average)),
    dims: usable.length,
    responses: usable.reduce((max, row) => Math.max(max, row.responses ?? 0), 0),
  };
}

/** Counts support-framework items by status. Returns `null` when a provider has no framework. */
export function computeSupportCounts(
  items: readonly { status: string }[] | null | undefined,
): SupportCounts | null {
  if (!items || items.length === 0) {
    return null;
  }
  const inPlace = items.filter((item) => item.status === 'Supports in place').length;
  return { inPlace, inWorks: items.length - inPlace };
}

/**
 * Lexicographic comparator: tier, then the evidence that exists for that tier.
 *
 * - Endorsed: certified first, then supports in place (absolute, never a percentage —
 *   a ratio rewards providers that disclose fewer commitments).
 * - Emerging: QILT index descending; providers with data rank above providers without.
 *
 * Always falls through to `name`, so equal scores never leave order dependent on
 * the input sequence.
 */
export function compareRanked(a: RankedProvider, b: RankedProvider): number {
  if (a.tier !== b.tier) {
    return TIER_RANK[a.tier] - TIER_RANK[b.tier];
  }

  if (a.certified !== b.certified) {
    return a.certified ? -1 : 1;
  }

  if (a.tier === 'emerging') {
    if (a.qilt !== null && b.qilt !== null) {
      const diff = b.qilt - a.qilt;
      if (diff !== 0) {
        return diff;
      }
    } else if (a.qilt !== b.qilt) {
      return a.qilt === null ? 1 : -1;
    }
    return a.name.localeCompare(b.name);
  }

  if (a.supportInPlace !== null && b.supportInPlace !== null) {
    const diff = b.supportInPlace - a.supportInPlace;
    if (diff !== 0) {
      return diff;
    }
  } else if (a.supportInPlace !== b.supportInPlace) {
    return a.supportInPlace === null ? 1 : -1;
  }

  return a.name.localeCompare(b.name);
}

export function toRankedProvider(
  provider: ProviderSearchRecord,
  tier: ProviderSearchTier,
  signals: ProviderRankSignalMap,
): RankedProvider {
  const signal = signals.get(provider.slug);
  return {
    tier,
    certified: provider.ndaCertified,
    name: provider.name,
    qilt: signal?.qilt?.points ?? null,
    supportInPlace: signal?.support?.inPlace ?? null,
  };
}

/** Sorts one tier. Pure: the input array is not mutated. */
export function sortProvidersForTier(
  providers: readonly ProviderSearchRecord[],
  tier: ProviderSearchTier,
  signals: ProviderRankSignalMap,
): ProviderSearchRecord[] {
  return [...providers].sort((a, b) =>
    compareRanked(toRankedProvider(a, tier, signals), toRankedProvider(b, tier, signals)),
  );
}

/** `18.18` → `"+18.2"`; `-3.18` → `"-3.2"`. */
export function formatSignedPoints(points: number): string {
  const rounded = Math.round(points * 10) / 10;
  const sign = rounded >= 0 ? '+' : '';
  return `${sign}${rounded.toFixed(1)}`;
}

export type RankReasonParams = {
  tier: ProviderSearchTier;
  signals: ProviderRankSignals | undefined;
  /** Endorsed VET providers have no QILT data by design. */
  isVet: boolean;
};

/**
 * The one line of evidence shown on a card. Contains counts and a source, never a verdict.
 * Returns an empty string when there is nothing honest to say.
 */
export function buildRankReason({ tier, signals, isVet }: RankReasonParams): string {
  if (tier === 'emerging') {
    const qilt = signals?.qilt;
    if (!qilt) {
      return '';
    }
    const sample = qilt.responses > 0 ? ` (n=${qilt.responses})` : '';
    return `Student experience ${formatSignedPoints(qilt.points)} pts vs national avg${sample}`;
  }

  const support = signals?.support;
  if (support) {
    return `${support.inPlace} supports in place · ${support.inWorks} in the works`;
  }

  return isVet ? 'QILT does not survey VET providers' : '';
}
