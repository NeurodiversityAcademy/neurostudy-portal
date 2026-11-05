'use client';

import classNames from 'classnames';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import {
  type ProviderSearchFilters,
  type ProviderSearchTierResults,
} from '@/app/utilities/providerSearch/constants';
import {
  listPositionedProviderSearchResults,
  type PositionedProviderSearchResult,
} from '@/app/utilities/providerSearch/searchProviders';
import styles from './providerSearchResults.module.css';

type ProviderSearchResultsProps = {
  results: ProviderSearchTierResults;
  filters: ProviderSearchFilters;
  searchDemo: boolean;
  totalCount: number;
  rankReasons?: Readonly<Record<string, string>>;
  detailsUnlocked?: boolean;
};

const EMERGING_STATE_TINT_CLASS: Record<string, string> = {
  NSW: styles.stateNSW,
  VIC: styles.stateVIC,
  QLD: styles.stateQLD,
  SA: styles.stateSA,
  WA: styles.stateWA,
  TAS: styles.stateTAS,
  NT: styles.stateNT,
  ACT: styles.stateACT,
};

function resolveStudentExperienceTone(note: string | undefined): {
  toneClassName?: string;
  label: string;
  value: string;
} | null {
  if (!note) {
    return null;
  }

  const match = note.match(/^Student experience ([+-]?\d+(?:\.\d+)?) pts vs national avg(?: \(n=\d+\))?$/);
  if (!match) {
    return null;
  }

  const points = Number.parseFloat(match[1]);
  return {
    toneClassName: points >= 0 ? styles.studentExperiencePositive : styles.studentExperienceNegative,
    label: 'Student experience',
    value: `${points >= 0 ? '+' : ''}${points.toFixed(1)} pts`,
  };
}

function resolveProviderPillClassName(item: PositionedProviderSearchResult): string {
  if (item.provider.kind === 'emerging') {
    const state = item.provider.emergingState ?? 'NSW';
    return classNames(
      styles.providerPill,
      styles.providerPillEmerging,
      EMERGING_STATE_TINT_CLASS[state] ?? styles.stateNSW,
    );
  }

  return classNames(styles.providerPill, styles.providerPillVerified);
}

function renderProviderPill(
  item: PositionedProviderSearchResult,
  rankReasons: Readonly<Record<string, string>>,
  detailsUnlocked: boolean,
) {
  const note = detailsUnlocked ? rankReasons[item.provider.slug] || undefined : undefined;
  const badge = resolveStudentExperienceTone(note);

  return (
    <div className={resolveProviderPillClassName(item)} key={`${item.tier}-${item.provider.slug}`}>
      <div className={styles.providerPillBody}>
        <span className={styles.providerName}>{item.provider.name}</span>
        {badge ? (
          <span className={classNames(styles.studentExperiencePill, badge.toneClassName)}>
            <span>{badge.label}</span>
            <strong>{badge.value}</strong>
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function ProviderSearchResults({
  results,
  totalCount,
  rankReasons = {},
  detailsUnlocked = false,
}: ProviderSearchResultsProps) {
  const positioned = listPositionedProviderSearchResults(results);
  const verifiedProviders = positioned.filter((item) => item.provider.kind !== 'emerging');
  const emergingProviders = positioned.filter((item) => item.provider.kind === 'emerging');
  const emergingByState = new Map<string, PositionedProviderSearchResult[]>();

  for (const item of emergingProviders) {
    const state = item.provider.emergingState ?? 'NSW';
    const group = emergingByState.get(state) ?? [];
    group.push(item);
    emergingByState.set(state, group);
  }

  return (
    <div className={styles.root}>
      {totalCount === 0 ? (
        <div className={styles.emptyState} role='status'>
          <Typography variant={TypographyVariant.H2} color={TypographyColorToken.BondBlack}>
            No providers matched your search
          </Typography>
          <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
            Try a different area of study or location.
          </Typography>
        </div>
      ) : (
        <>
          <div className={styles.legendRow} aria-label='Provider color legend'>
            <span className={styles.legendLabel}>Legend</span>
            <span className={styles.legendItem}>
              <span className={classNames(styles.legendSwatch, styles.legendVerified)} aria-hidden='true' />
              Verified
            </span>
            <span className={styles.legendItem}>
              <span className={classNames(styles.legendSwatch, styles.legendEmerging)} aria-hidden='true' />
              Emerging
            </span>
          </div>
          <div className={styles.resultsStack}>
            {verifiedProviders.length > 0 ? (
              <div className={styles.stateRow}>
                <span className={styles.stateTitle}>Verified</span>
                <div className={styles.pillRow}>
                  {verifiedProviders.map((item) =>
                    renderProviderPill(item, rankReasons, detailsUnlocked),
                  )}
                </div>
              </div>
            ) : null}
            {[...emergingByState.entries()].map(([state, items]) => (
              <div className={styles.stateRow} key={state}>
                <span className={styles.stateTitle}>{state}</span>
                <div className={styles.pillRow}>
                  {items.map((item) => renderProviderPill(item, rankReasons, detailsUnlocked))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
