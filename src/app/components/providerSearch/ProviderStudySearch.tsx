'use client';

import { HTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ActionButton from '@/app/components/buttons/ActionButton';
import Pill from '@/app/components/formElements/Pill/Pill';
import aiSparkleSrc from '@/app/images/aiSparkle.svg';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import {
  type ProviderSearchSurface,
  type ProviderStudySearchFormValues,
} from '@/app/utilities/providerSearch/constants';
import { buildProviderSearchHref } from '@/app/utilities/providerSearch/buildSearchHref';
import { requestAssistSearch } from '@/app/utilities/providerSearch/assist/client';
import { trackProviderSearchSubmit } from '@/app/utilities/providerSearch/providerSearchGa';
import { rememberSearchTraceId } from '@/app/utilities/providerSearch/searchTrace';
import styles from './providerStudySearch.module.css';

export type ProviderStudySearchProps = HTMLAttributes<HTMLDivElement> & {
  interestAreaOptions: { label: string; value: string }[];
  locationOptions: { label: string; value: string }[];
  defaultInterestAreas?: string[];
  defaultLocations?: string[];
  surface: ProviderSearchSurface;
  /** Shown under the filter pills, e.g. when a query was only partly understood. */
  initialMessage?: string;
  searchDemo?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
};

function buildSelectedFilters(interestAreas: string[], locations: string[]) {
  return [
    ...interestAreas.map((value) => ({
      key: `interest-${value}`,
      value,
      label: value,
      field: 'InterestArea' as const,
    })),
    ...locations.map((value) => ({
      key: `location-${value}`,
      value,
      label: value,
      field: 'Location' as const,
    })),
  ];
}

const OFF_TOPIC_MESSAGE =
  "That doesn't look like a study area or location. Try something like 'Nursing in Melbourne'.";

type SelectedFilterPillsProps = {
  filters: ReturnType<typeof buildSelectedFilters>;
  onRemove: (field: 'InterestArea' | 'Location', value: string) => void;
};

function SelectedFilterPills({ filters, onRemove }: SelectedFilterPillsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={styles.selectedFiltersRow} aria-live='polite'>
      {filters.map((filter) => (
        <Pill
          key={filter.key}
          label={filter.label}
          value={filter.value}
          selected
          onClose={() => onRemove(filter.field, filter.value)}
          button-aria-label={`Remove ${filter.label}`}
        />
      ))}
    </div>
  );
}

function NoMatchMessage({ message }: { message: string }) {
  return (
    <div className={styles.noMatchMessage} role='status' aria-live='polite'>
      {message}
    </div>
  );
}

const ProviderStudySearch: React.FC<ProviderStudySearchProps> = ({
  className,
  defaultInterestAreas = [],
  defaultLocations = [],
  // Kept for call-site compatibility; the current UI reads the form state instead.
  interestAreaOptions: _interestAreaOptions,
  locationOptions: _locationOptions,
  surface,
  initialMessage,
  searchDemo = false,
  compact = false,
  autoFocus = false,
  ...rest
}) => {
  const router = useRouter();
  const [askQuery, setAskQuery] = useState('');
  const [noMatchMessage, setNoMatchMessage] = useState<string | null>(initialMessage ?? null);
  const methods: UseFormReturn<ProviderStudySearchFormValues> =
    useForm<ProviderStudySearchFormValues>({
      mode: 'onChange',
      defaultValues: {
        InterestArea: defaultInterestAreas,
        Location: defaultLocations,
      },
    });

  const selectedInterestAreas =
    useWatch({
      control: methods.control,
      name: 'InterestArea',
      defaultValue: defaultInterestAreas,
    }) ?? defaultInterestAreas;
  const selectedLocations =
    useWatch({
      control: methods.control,
      name: 'Location',
      defaultValue: defaultLocations,
    }) ?? defaultLocations;
  const selectedFilters = buildSelectedFilters(selectedInterestAreas, selectedLocations);

  function removeFilter(field: 'InterestArea' | 'Location', filterValue: string) {
    const currentValues = methods.getValues(field) ?? [];
    const nextValues = currentValues.filter((value) => value !== filterValue);
    methods.setValue(field, nextValues, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function navigateToResults(
    interestAreas: string[],
    locations: string[],
    unmatched: string[] = [],
  ): void {
    router.push(buildProviderSearchHref({ interestAreas, locations }, { searchDemo, unmatched }));
  }

  function submitActiveFilters(): void {
    const hasFilters = selectedInterestAreas.length > 0 || selectedLocations.length > 0;

    if (hasFilters) {
      trackProviderSearchSubmit({
        surface,
        interestAreas: selectedInterestAreas,
        locations: selectedLocations,
        mode: 'quick',
      });
    }

    // Every submit ends on the results page with nothing selected = full list.
    navigateToResults(selectedInterestAreas, selectedLocations);
  }

  async function handleAssistSearch(): Promise<void> {
    const trimmed = askQuery.trim();

    if (!trimmed) {
      // Enter with no question still re-runs the active filters, as the old
      // area/location form did before the Ask bar replaced it.
      submitActiveFilters();
      return;
    }

    const data = await requestAssistSearch(trimmed);

    if (!data) {
      // The assistant is an enhancement, not a gate: a refused or failed
      // request still lands on the full provider list instead of nothing.
      navigateToResults([], []);
      return;
    }

    if (data.offTopic) {
      setNoMatchMessage(OFF_TOPIC_MESSAGE);
      return;
    }

    const interestAreas = data.area ? [data.area] : [];
    const locations = data.locations ?? [];

    if (!interestAreas.length && !locations.length) {
      navigateToResults([], [], data.unmatched ?? []);
      return;
    }

    setNoMatchMessage(null);
    trackProviderSearchSubmit({
      surface,
      interestAreas,
      locations,
      mode: 'ask',
      ...(data.traceId ? { traceId: data.traceId } : {}),
    });
    rememberSearchTraceId(data.traceId);
    // Carry dropped words so the results page can explain the widened list.
    navigateToResults(interestAreas, locations, data.unmatched ?? []);
  }

  return (
    <div
      className={classNames(styles.container, compact ? styles.compact : undefined, className)}
      aria-label='Search providers by area of study and location'
      role='search'
      {...rest}
    >
      <form
        className={styles.searchBarShell}
        onSubmit={(event) => {
          event.preventDefault();
          void handleAssistSearch();
        }}
      >
        <label className={styles.askLabel} htmlFor='provider-search-ask'>
          What would you like to study?
        </label>
        <div className={styles.assistRow}>
          <div className={styles.assistControls}>
            <input
              id='provider-search-ask'
              className={styles.askInput}
              autoFocus={autoFocus}
              value={askQuery}
              onChange={(event) => setAskQuery(event.target.value)}
              placeholder='E.g. Nursing in melbourne'
            />
            <ActionButton
              type='submit'
              style={BUTTON_STYLE.Primary}
              label='Ask'
              icon={aiSparkleSrc}
              className={styles.askButton}
            />
          </div>
        </div>

        <SelectedFilterPills filters={selectedFilters} onRemove={removeFilter} />

        {noMatchMessage ? <NoMatchMessage message={noMatchMessage} /> : null}
      </form>
    </div>
  );
};

export default ProviderStudySearch;
