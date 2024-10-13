'use client';

import { FormHTMLAttributes, useEffect } from 'react';
import styles from './coursePrimaryFilter.module.css';
import classNames from 'classnames';
import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import { CoursePrimaryFilterType } from '@/app/interfaces/Course';
import { COURSE_FIELD_OPTIONS } from '@/app/utilities/course/constants';
import ActionButton from '../../buttons/ActionButton';
import searchSrc from '@/app/images/Search.svg';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import { updateCourseDropdownFilter } from '@/app/utilities/course/helper';

interface PropType extends FormHTMLAttributes<HTMLFormElement> {}

const DROPDOWN_KEYS: (keyof CoursePrimaryFilterType)[] = [
  'Neurotypes',
  'InterestArea',
  'Location',
];

const CoursePrimaryFilter: React.FC<PropType> = ({ className, ...rest }) => {
  const { loadData, isLoading, filter, updateFilter } = useCourseContext();
  const methods: UseFormReturn<CoursePrimaryFilterType> =
    useForm<CoursePrimaryFilterType>({
      mode: 'onBlur',
      defaultValues: Object.fromEntries(
        DROPDOWN_KEYS.map((key) => [key, filter[key]])
      ),
    });

  useUpdatedValue(filter, () => {
    DROPDOWN_KEYS.forEach((name) => {
      updateCourseDropdownFilter(name, filter[name], methods);
    });
  });

  useEffect(() => {
    const listener = methods.watch(() => {
      updateFilter(methods.getValues());
    });

    return () => listener.unsubscribe();
  }, [methods, updateFilter]);

  return (
    <Form
      methods={methods}
      className={classNames(
        styles.container,
        className,
        isLoading && styles.disabled
      )}
      onSubmit={methods.handleSubmit(() => loadData())}
      aria-label='Primary search criteria'
      role='search'
      {...rest}
    >
      <div className={styles.content}>
        <Dropdown<CoursePrimaryFilterType>
          name='Neurotypes'
          label='What is your neurotype?'
          showLabel
          placeholder='Ex. ADHD'
          multiple
          options={COURSE_FIELD_OPTIONS.Neurotypes}
        />
        <Dropdown<CoursePrimaryFilterType>
          name='InterestArea'
          label='What do you want to study?'
          showLabel
          placeholder='Ex. Data Science'
          multiple
          options={COURSE_FIELD_OPTIONS.InterestArea}
        />
        <Dropdown<CoursePrimaryFilterType>
          name='Location'
          label='Where do you want to study?'
          showLabel
          placeholder='Ex. Sydney'
          creatable
          multiple
          options={COURSE_FIELD_OPTIONS.Location}
        />
        <ActionButton
          style={BUTTON_STYLE.Primary}
          label='Search'
          icon={searchSrc}
          disabled={isLoading}
        />
      </div>
    </Form>
  );
};

export default CoursePrimaryFilter;
