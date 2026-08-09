'use client';

import { FormHTMLAttributes, useMemo } from 'react';
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
  const selectedAreas = useMemo(
    () => uniqueSortedStrings(watchedValues.InterestArea ?? []),
    [watchedValues.InterestArea],
  );
  const selectedLocations = useMemo(
    () => uniqueSortedStrings(watchedValues.Location ?? []),
    [watchedValues.Location],
  );
  const canSearch = selectedAreas.length > 0 || selectedLocations.length > 0;

  return (
    <Form
      methods={methods}
      className={classNames(styles.container, compact && styles.compact, className)}
      onSubmit={methods.handleSubmit((values) => {
        const interestAreas = uniqueSortedStrings(values.InterestArea ?? []);
        const locations = uniqueSortedStrings(values.Location ?? []);
        if (interestAreas.length === 0 && locations.length === 0) {
          return;
        }
        trackProviderSearchSubmit({
          surface,
          interestAreas,
          locations,
        });
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
          showLabel
          placeholder='Ex. Nursing or digital'
          multiple
          creatable
          options={interestAreaOptions}
        />
        <Dropdown<ProviderStudySearchFormValues>
          name='Location'
          label='Where do you want to study?'
          showLabel
          placeholder='Ex. Sydney'
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
          />
        </div>
      </div>
    </Form>
  );
};

export default ProviderStudySearch;
