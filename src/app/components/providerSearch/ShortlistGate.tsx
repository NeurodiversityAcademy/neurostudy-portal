'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import type { ProviderSearchFilters } from '@/app/utilities/providerSearch/constants';
import type { CompareProviderPayload, CompareSuccess } from '@/app/utilities/leads/shortlistTypes';
import ProviderCompareTable from './ProviderCompareTable';
import { trackShortlistCompare } from '@/app/utilities/providerSearch/providerSearchGa';
import { buildEndorsedProviderDetailHref } from '@/app/utilities/endorsedProvidersDemo';
import { buildEmergingProviderDetailHref } from '@/app/emergingproviders/emergingProviderMetadata';
import styles from './shortlistGate.module.css';

const MAX_SELECTED = 3;

const ERROR_MESSAGES: Record<string, string> = {
  invalid_request: 'Choose between two and three providers, then try again.',
  locked: 'The comparison could not be loaded. Please try again.',
  not_available: 'Comparison is not available right now.',
};

function errorMessage(reason: string): string {
  return ERROR_MESSAGES[reason] ?? 'Something went wrong. Please try again.';
}

type ShortlistGateProps = {
  enabled: boolean;
  providers: Array<{
    slug: string;
    name: string;
    kind?: 'endorsed' | 'emerging';
    emergingState?: string;
    ndaCertified?: boolean;
  }>;
  filters: ProviderSearchFilters;
  rankingHref?: string;
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

function resolveProviderChipClassName(
  provider: ShortlistGateProps['providers'][number],
  isSelected: boolean,
): string {
  const base = isSelected ? styles.providerChipSelected : styles.providerChip;
  const certified = provider.ndaCertified ? ` ${styles.certifiedChip}` : '';
  if (provider.kind === 'emerging') {
    const state = provider.emergingState ?? 'NSW';
    return `${base} ${EMERGING_STATE_TINT_CLASS[state] ?? styles.stateNSW}${certified}`;
  }
  return `${base} ${styles.endorsedChip}${certified}`;
}

type ShortlistMessage = { kind: 'error' | 'info' | 'success'; text: string };

type ProviderSelectionListProps = {
  providers: ShortlistGateProps['providers'];
  selected: string[];
  onToggle: (slug: string) => void;
};

function ProviderSelectionList({ providers, selected, onToggle }: ProviderSelectionListProps) {
  const endorsed = providers.filter((provider) => provider.kind !== 'emerging');
  const emerging = providers.filter((provider) => provider.kind === 'emerging');
  const emergingByState = new Map<string, typeof emerging>();

  for (const item of emerging) {
    const state = item.emergingState ?? 'NSW';
    const group = emergingByState.get(state) ?? [];
    group.push(item);
    emergingByState.set(state, group);
  }

  const renderChip = (provider: ShortlistGateProps['providers'][number]) => {
    const isSelected = selected.includes(provider.slug);
    const detailHref =
      provider.kind === 'endorsed'
        ? buildEndorsedProviderDetailHref(provider.slug, '')
        : buildEmergingProviderDetailHref(provider.slug);

    return (
      <Link
        key={provider.slug}
        href={detailHref}
        target='_blank'
        rel='noopener noreferrer'
        className={styles.providerLink}
        onClick={(event) => {
          if (!isSelected && detailHref) {
            event.preventDefault();
            onToggle(provider.slug);
          }
        }}
      >
        <span
          className={resolveProviderChipClassName(provider, isSelected)}
          aria-pressed={isSelected}
        >
          {isSelected ? (
            <span className={styles.tick} aria-hidden='true'>
              ✓
            </span>
          ) : null}
          {provider.ndaCertified ? (
            <span className={styles.star} aria-hidden='true'>
              ★
            </span>
          ) : null}
          {provider.name}
        </span>
      </Link>
    );
  };

  return (
    <>
      {endorsed.length > 0 ? (
        <div className={styles.stateRow}>
          <span className={styles.stateTitle}>Verified & Endorsed</span>
          <div className={styles.pillRow}>{endorsed.map(renderChip)}</div>
        </div>
      ) : null}
      {[...emergingByState.entries()].map(([state, items]) => (
        <div className={styles.stateRow} key={state}>
          <span className={styles.stateTitle}>{state}</span>
          <div className={styles.pillRow}>{items.map(renderChip)}</div>
        </div>
      ))}
    </>
  );
}

type PanelFooterProps = {
  showClear: boolean;
  onClear: () => void;
  rankingHref?: string;
};

function PanelFooter({ showClear, onClear, rankingHref }: PanelFooterProps) {
  if (!showClear && !rankingHref) {
    return null;
  }

  return (
    <div className={styles.panelFooter}>
      {showClear ? (
        <button type='button' className={styles.secondaryButton} onClick={onClear}>
          Clear selection
        </button>
      ) : null}
      {rankingHref ? (
        <Link className={styles.rankingLink} href={rankingHref}>
          How we rank providers
        </Link>
      ) : null}
    </div>
  );
}

export default function ShortlistGate({ enabled, providers, rankingHref }: ShortlistGateProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<ShortlistMessage | null>(null);
  const [compare, setCompare] = useState<CompareProviderPayload[] | null>(null);

  const panelId = useId();
  const statusId = useId();

  if (!enabled || providers.length < 2) {
    return null;
  }

  const loadCompare = async (slugs: string[]) => {
    if (slugs.length < 2) {
      setCompare(null);
      setMessage(null);
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const compareResponse = await fetch(
        `/api/providerCompare?slugs=${encodeURIComponent(slugs.join(','))}`,
      );

      if (!compareResponse.ok) {
        const body = (await compareResponse
          .json()
          .catch(() => ({ ok: false, reason: 'locked' }))) as {
          ok?: boolean;
          reason?: string;
        };
        setCompare(null);
        setMessage({ kind: 'error', text: errorMessage(body.reason ?? 'locked') });
        return;
      }

      const compareBody = (await compareResponse.json()) as
        CompareSuccess | { ok: false; reason: string };
      if (!compareBody.ok) {
        setCompare(null);
        setMessage({ kind: 'error', text: errorMessage(compareBody.reason) });
        return;
      }

      setCompare(compareBody.providers);
      trackShortlistCompare({ providerCount: slugs.length });
      setMessage({ kind: 'success', text: 'Comparison ready.' });
    } catch {
      setCompare(null);
      setMessage({
        kind: 'error',
        text: 'Network problem. Please check your connection and retry.',
      });
    } finally {
      setBusy(false);
    }
  };

  const toggleProvider = (slug: string) => {
    const nextSelected = selected.includes(slug)
      ? selected.filter((entry) => entry !== slug)
      : [...selected, slug];

    if (nextSelected.length > MAX_SELECTED) {
      setMessage({ kind: 'info', text: 'You can compare up to three providers.' });
      return;
    }

    setSelected(nextSelected);
    setMessage(null);

    if (nextSelected.length >= 2) {
      void loadCompare(nextSelected);
      return;
    }

    setCompare(null);
  };

  return (
    <section className={styles.root} aria-labelledby={`${panelId}-heading`}>
      <div className={styles.intro}>
        <div>
          <h2 id={`${panelId}-heading`} className={styles.heading}>
            Compare providers side by side
          </h2>
          <p className={styles.subheading}>
            Select two or three providers to compare them side by side below.
          </p>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.providerList} aria-label='Select providers to compare'>
          <ProviderSelectionList
            providers={providers}
            selected={selected}
            onToggle={toggleProvider}
          />
        </div>

        <div
          className={styles.selectionRow}
          id={statusId}
          role='status'
          aria-live='polite'
          aria-busy={busy}
        >
          {busy ? (
            <span className={styles.selectionSummary}>Loading comparison…</span>
          ) : selected.length > 0 ? (
            <span className={styles.selectionSummary}>
              {`${selected.length} of ${providers.length} providers selected (max ${Math.min(
                MAX_SELECTED,
                providers.length,
              )})`}
            </span>
          ) : (
            <span className={styles.selectionSummary}>Select at least two providers</span>
          )}
          {message ? (
            <span
              className={
                message.kind === 'error'
                  ? styles.error
                  : message.kind === 'success'
                    ? styles.success
                    : styles.info
              }
            >
              {message.text}
            </span>
          ) : null}
        </div>

        {compare ? (
          <div className={styles.compareWrap}>
            <ProviderCompareTable providers={compare} />
          </div>
        ) : null}

        <PanelFooter
          showClear={compare !== null}
          onClear={() => {
            setSelected([]);
            setCompare(null);
            setMessage(null);
          }}
          rankingHref={rankingHref}
        />
      </div>
    </section>
  );
}
