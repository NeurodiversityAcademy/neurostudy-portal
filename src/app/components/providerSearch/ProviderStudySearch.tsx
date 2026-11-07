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
  searchDemo?: boolean;
  compact?: boolean;
};

const ProviderStudySearch: React.FC<ProviderStudySearchProps> = ({
  className,
  defaultInterestAreas = [],
  defaultLocations = [],
  // Kept for call-site compatibility; the current UI reads the form state instead.
  interestAreaOptions: _interestAreaOptions,
  locationOptions: _locationOptions,
  surface,
  searchDemo = false,
  compact = false,
  ...rest
}) => {
  const router = useRouter();
  const [askQuery, setAskQuery] = useState('');
  const [noMatchMessage, setNoMatchMessage] = useState<string | null>(null);
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
  const selectedFilters = [
    ...selectedInterestAreas.map((value) => ({
      key: `interest-${value}`,
      value,
      label: value,
      field: 'InterestArea' as const,
    })),
    ...selectedLocations.map((value) => ({
      key: `location-${value}`,
      value,
      label: value,
      field: 'Location' as const,
    })),
  ];

  function removeFilter(field: 'InterestArea' | 'Location', filterValue: string) {
    const currentValues = methods.getValues(field) ?? [];
    const nextValues = currentValues.filter((value) => value !== filterValue);
    methods.setValue(field, nextValues, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleAssistSearch(): Promise<void> {
    const trimmed = askQuery.trim();
    if (!trimmed) {
      return;
    }

    const data = await requestAssistSearch(trimmed);

    if (!data || data.offTopic) {
      return;
    }

    const interestAreas = data.area ? [data.area] : [];
    const locations = data.locations ?? [];

    if (!interestAreas.length && !locations.length) {
      setNoMatchMessage(
        "We couldn't match that search, so we're showing all results. Try a supported study area or location.",
      );
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
    router.push(buildProviderSearchHref({ interestAreas, locations }, { searchDemo }));
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

        {selectedFilters.length > 0 ? (
          <div className={styles.selectedFiltersRow} aria-live='polite'>
            {selectedFilters.map((filter) => (
              <Pill
                key={filter.key}
                label={filter.label}
                value={filter.value}
                selected
                onClose={() => removeFilter(filter.field, filter.value as string)}
                button-aria-label={`Remove ${filter.label}`}
              />
            ))}
          </div>
        ) : null}

        {noMatchMessage ? (
          <div className={styles.noMatchMessage} role='status' aria-live='polite'>
            {noMatchMessage}
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default ProviderStudySearch;
