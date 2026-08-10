'use client';

import { FormHTMLAttributes, useState } from 'react';
import classNames from 'classnames';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Form from '@/app/components/formElements/Form';
import Dropdown from '@/app/components/formElements/Dropdown/Dropdown';
import ActionButton from '@/app/components/buttons/ActionButton';
import searchSrc from '@/app/images/Search.svg';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import {
  type ProviderSearchSurface,
  type ProviderStudySearchFormValues,
} from '@/app/utilities/providerSearch/constants';
import { buildProviderSearchHref } from '@/app/utilities/providerSearch/buildSearchHref';
import { trackProviderSearchSubmit } from '@/app/utilities/providerSearch/providerSearchGa';
import { mergeSearchTokens, uniqueSortedStrings } from '@/app/utilities/providerSearch/normalize';
import styles from './providerStudySearch.module.css';

export type ProviderStudySearchProps = FormHTMLAttributes<HTMLFormElement> & {
  interestAreaOptions: { label: string; value: string }[];
  locationOptions: { label: string; value: string }[];
  defaultInterestAreas?: string[];
  defaultLocations?: string[];
  surface: ProviderSearchSurface;
  searchDemo?: boolean;
  compact?: boolean;
};

function asSelectedList(value: unknown): string[] {
  return Array.isArray(value) ? uniqueSortedStrings(value) : [];
}

function normalizeFormValues(values: Partial<ProviderStudySearchFormValues>) {
  return {
    interestAreas: asSelectedList(values.InterestArea),
    locations: asSelectedList(values.Location),
  };
}

const ProviderStudySearch: React.FC<ProviderStudySearchProps> = ({
  className,
  interestAreaOptions,
  locationOptions,
  defaultInterestAreas = [],
  defaultLocations = [],
  surface,
  searchDemo = false,
  compact = false,
  ...rest
}) => {
  const router = useRouter();
  const [areaDraft, setAreaDraft] = useState('');
  const [locationDraft, setLocationDraft] = useState('');
  const methods: UseFormReturn<ProviderStudySearchFormValues> =
    useForm<ProviderStudySearchFormValues>({
      mode: 'onChange',
      defaultValues: {
        InterestArea: defaultInterestAreas,
        Location: defaultLocations,
      },
    });

  return (
    <Form
      methods={methods}
      className={classNames(styles.container, compact && styles.compact, className)}
      onSubmit={methods.handleSubmit((values) => {
        const selected = normalizeFormValues(values);
        const interestAreas = mergeSearchTokens(selected.interestAreas, areaDraft);
        const locations = mergeSearchTokens(selected.locations, locationDraft);
        trackProviderSearchSubmit({ surface, interestAreas, locations });
        router.push(buildProviderSearchHref({ interestAreas, locations }, { searchDemo }));
      })}
      aria-label='Search providers by area of study and location'
      role='search'
      {...rest}
    >
      <div className={styles.content}>
        <Dropdown<ProviderStudySearchFormValues>
          name='InterestArea'
          label='What do you want to study?'
          showLabel={!compact}
          placeholder={compact ? 'What do you want to study?' : 'Ex. Nursing or digital'}
          multiple
          creatable
          pillsBelow
          options={interestAreaOptions}
          onDraftChange={setAreaDraft}
        />
        <Dropdown<ProviderStudySearchFormValues>
          name='Location'
          label='Where do you want to study?'
          showLabel={!compact}
          placeholder={compact ? 'Where do you want to study?' : 'Ex. Sydney'}
          multiple
          creatable
          pillsBelow
          options={locationOptions}
          onDraftChange={setLocationDraft}
        />
        <div className={styles.buttonContainer}>
          <ActionButton
            type='submit'
            style={BUTTON_STYLE.Primary}
            label='Search'
            icon={searchSrc}
            className={compact ? styles.compactSearchButton : undefined}
          />
        </div>
      </div>
    </Form>
  );
};

export default ProviderStudySearch;
