'use client';

import { FormHTMLAttributes } from 'react';
import styles from './coursePrimaryFilter.module.css';
import classNames from 'classnames';
import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import { FilterCourseProps } from '@/app/interfaces/Course';
import { COURSE_FIELD_OPTIONS } from '@/app/utilities/course/constants';
import ActionButton from '../../buttons/ActionButton';
import searchSrc from '@/app/images/Search.svg';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { useCourseContext } from '@/app/utilities/course/CourseProvider';

interface PropType extends FormHTMLAttributes<HTMLFormElement> {}

const CoursePrimaryFilter: React.FC<PropType> = ({ className, ...rest }) => {
  const { loadData } = useCourseContext();
  const methods: UseFormReturn<FilterCourseProps> = useForm<FilterCourseProps>({
    mode: 'onBlur',
  });

  return (
    <Form
      methods={methods}
      className={classNames(styles.container, className)}
      onSubmit={methods.handleSubmit((data) => {
        loadData(data);
      })}
      aria-label='Primary search criteria'
      role='search'
      {...rest}
    >
      <div className={styles.content}>
        <Dropdown<FilterCourseProps>
          name='Neurotypes'
          label='What is your neurotype?'
          showLabel
          placeholder='ADHD'
          multiple
          options={[]}
        />
        <Dropdown<FilterCourseProps>
          name='InterestArea'
          label='What do you want to study?'
          showLabel
          placeholder='Anything'
          multiple
          options={COURSE_FIELD_OPTIONS.InterestArea}
        />
        <Dropdown<FilterCourseProps>
          name='Location'
          label='Where do you want to study?'
          showLabel
          placeholder='Anywhere'
          multiple
          options={[]}
        />
        <ActionButton
          style={BUTTON_STYLE.Primary}
          label='Search'
          icon={searchSrc}
        />
      </div>
    </Form>
  );
};

export default CoursePrimaryFilter;
