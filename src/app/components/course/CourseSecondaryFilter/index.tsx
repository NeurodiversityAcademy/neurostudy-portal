'use client';

import { FormHTMLAttributes, useEffect, useId } from 'react';
import styles from './courseSecondaryFilter.module.css';
import classNames from 'classnames';
import Typography, { TypographyVariant } from '../../typography/Typography';
import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import { CourseSecondaryFilterType } from '@/app/interfaces/Course';
import { COURSE_FIELD_OPTIONS } from '@/app/utilities/course/constants';
import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import { updateCourseDropdownFilter } from '@/app/utilities/course/helper';

interface PropType extends FormHTMLAttributes<HTMLFormElement> {}

const DROPDOWN_KEYS: (keyof CourseSecondaryFilterType)[] = [
  'Level',
  'InstitutionName',
  'Mode',
];

const CourseSecondaryFilter: React.FC<PropType> = ({ className, ...rest }) => {
  const labelId = useId();
  const { loadData, filter } = useCourseContext();

  const methods: UseFormReturn<CourseSecondaryFilterType> =
    useForm<CourseSecondaryFilterType>({
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
      loadData(methods.getValues(), true);
    });

    return () => listener.unsubscribe();
  }, [methods, loadData]);

  return (
    <Form
      methods={methods}
      className={classNames(styles.container, className)}
      onSubmit={methods.handleSubmit((data) => {
        loadData(data);
      })}
      aria-labelledby={labelId}
      role='search'
      {...rest}
    >
      <Typography
        variant={TypographyVariant.Body1}
        id={labelId}
        color='var(--cherryPie)'
      >
        Filters
      </Typography>
      <Dropdown<CourseSecondaryFilterType>
        name='Level'
        label='Study Level'
        showLabel
        placeholder='Search Study Level'
        multiple
        options={COURSE_FIELD_OPTIONS.Level}
      />
      <Dropdown<CourseSecondaryFilterType>
        name='InstitutionName'
        label='University'
        showLabel
        placeholder='Search University'
        creatable
        multiple
        options={[]}
      />
      {/* TODO: `Qualification` - Dropdown from figma, need elaboration */}
      <Dropdown<CourseSecondaryFilterType>
        name='Mode'
        label='Study Method'
        showLabel
        placeholder='Search Study Method'
        multiple
        options={COURSE_FIELD_OPTIONS.Mode}
      />
      {/* TODO: `EntryOptions` - Dropdown from figma, need elaboration */}
      {/* TODO: `Other` - What else should be added? */}
    </Form>
  );
};

export default CourseSecondaryFilter;
