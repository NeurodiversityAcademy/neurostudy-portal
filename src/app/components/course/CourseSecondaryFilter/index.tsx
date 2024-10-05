'use client';

import { FormHTMLAttributes, useId } from 'react';
import styles from './courseSecondaryFilter.module.css';
import classNames from 'classnames';
import Typography, { TypographyVariant } from '../../typography/Typography';
import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import { FilterCourseProps } from '@/app/interfaces/Course';
import { COURSE_FIELD_OPTIONS } from '@/app/utilities/course/constants';

interface PropType extends FormHTMLAttributes<HTMLFormElement> {}

const CourseSecondaryFilter: React.FC<PropType> = ({ className, ...rest }) => {
  const labelId = useId();

  const methods: UseFormReturn<FilterCourseProps> = useForm<FilterCourseProps>({
    mode: 'onBlur',
  });

  return (
    <Form
      methods={methods}
      className={classNames(styles.container, className)}
      onSubmit={methods.handleSubmit((data) => {
        // TODO: Handle submission
        console.log('filter data', data);
      })}
      aria-labelledby={labelId}
      role='search'
      {...rest}
    >
      <Typography variant={TypographyVariant.Body1} id={labelId}>
        Filters
      </Typography>
      <Dropdown<FilterCourseProps>
        name='Level'
        label='Study Level'
        showLabel
        placeholder='Search Study Level'
        multiple
        options={COURSE_FIELD_OPTIONS.Level}
      />
      <Dropdown<FilterCourseProps>
        name='InterestArea'
        label='Interest Area'
        showLabel
        placeholder='Search Interest Area'
        multiple
        options={COURSE_FIELD_OPTIONS.InterestArea}
      />
      <Dropdown<FilterCourseProps>
        name='InstitutionName'
        label='University'
        showLabel
        placeholder='Search University'
        creatable
        multiple
        options={[]}
      />
      {/* TODO: `Qualification` - Dropdown from figma, need elaboration */}
      <Dropdown<FilterCourseProps>
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
