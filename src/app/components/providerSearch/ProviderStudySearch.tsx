'use client';

import { FormHTMLAttributes } from 'react';
import classNames from 'classnames';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';
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
import { uniqueSortedStrings } from '@/app/utilities/providerSearch/normalize';
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

function normalizeFormValues(values: ProviderStudySearchFormValues) {
  return {
    interestAreas: uniqueSortedStrings(values.InterestArea ?? []),
    locations: uniqueSortedStrings(values.Location ?? []),
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
  const methods: UseFormReturn<ProviderStudySearchFormValues> =
    useForm<ProviderStudySearchFormValues>({
      mode: 'onChange',
      defaultValues: {
        InterestArea: defaultInterestAreas,
        Location: defaultLocations,
      },
    });

  const watchedValues = useWatch({ control: methods.control });
  const { interestAreas: selectedAreas, locations: selectedLocations } =
    normalizeFormValues(watchedValues);
  const canSearch = selectedAreas.length > 0 || selectedLocations.length > 0;

  return (
    <Form
      methods={methods}
      className={classNames(styles.container, compact && styles.compact, className)}
      onSubmit={methods.handleSubmit((values) => {
        const { interestAreas, locations } = normalizeFormValues(values);
        if (interestAreas.length === 0 && locations.length === 0) {
          return;
        }
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
          options={interestAreaOptions}
        />
        <Dropdown<ProviderStudySearchFormValues>
          name='Location'
          label='Where do you want to study?'
          showLabel={!compact}
          placeholder={compact ? 'Where do you want to study?' : 'Ex. Sydney'}
          multiple
          creatable
          options={locationOptions}
        />
        <div className={styles.buttonContainer}>
          <ActionButton
            type='submit'
            style={BUTTON_STYLE.Primary}
            label='Search'
            icon={searchSrc}
            disabled={!canSearch}
            className={compact ? styles.compactSearchButton : undefined}
          />
        </div>
      </div>
    </Form>
  );
};

export default ProviderStudySearch;
