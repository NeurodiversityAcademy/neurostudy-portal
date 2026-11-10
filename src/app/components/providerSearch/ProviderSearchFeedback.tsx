'use client';

import { useId, useRef, useState } from 'react';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import type {
  ProviderSearchFilters,
  ProviderSearchSurface,
} from '@/app/utilities/providerSearch/constants';
import { trackProviderSearchFeedback } from '@/app/utilities/providerSearch/providerSearchGa';
import { clearSearchTraceId, readSearchTraceId } from '@/app/utilities/providerSearch/searchTrace';
import styles from './providerSearchFeedback.module.css';

type ProviderSearchFeedbackProps = {
  filters: ProviderSearchFilters;
  resultCount: number;
  surface?: ProviderSearchSurface;
};

export default function ProviderSearchFeedback({
  filters,
  resultCount,
  surface = 'search_page',
}: ProviderSearchFeedbackProps) {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const headingId = useId();
  const statusRef = useRef<HTMLSpanElement>(null);

  if (resultCount === 0) {
    return null;
  }

  function handleAnswer(match: 'yes' | 'no') {
    if (answer !== null) {
      return;
    }

    setAnswer(match);

    const traceId = readSearchTraceId();
    trackProviderSearchFeedback({
      match,
      surface,
      interestAreas: filters.interestAreas,
      locations: filters.locations,
      resultCount,
      ...(traceId ? { traceId } : {}),
    });
    clearSearchTraceId();

    // The buttons unmount, so move focus to the announcement instead of <body>.
    statusRef.current?.focus();
  }

  return (
    <div className={styles.root} role='group' aria-labelledby={headingId}>
      <Typography
        id={headingId}
        variant={TypographyVariant.Body2}
        color={TypographyColorToken.BondBlack}
      >
        Did these results match what you expected?
      </Typography>
      {answer === null ? (
        <div className={styles.actions}>
          <button type='button' className={styles.button} onClick={() => handleAnswer('yes')}>
            Yes
          </button>
          <button type='button' className={styles.button} onClick={() => handleAnswer('no')}>
            No
          </button>
        </div>
      ) : null}
      <span
        ref={statusRef}
        role='status'
        aria-live='polite'
        tabIndex={-1}
        className={styles.thanks}
      >
        {answer === null ? '' : 'Thanks for the feedback.'}
      </span>
    </div>
  );
}
