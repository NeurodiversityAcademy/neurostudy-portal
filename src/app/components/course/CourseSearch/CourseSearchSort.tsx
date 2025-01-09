'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import extractCourseSortConfig from '@/app/utilities/course/extractSortConfig';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import styles from './courseSearchSort.module.css';
import { COURSE_SORT_OPTIONS } from '@/app/utilities/course/constants';

interface SortFieldValues {
  sort: string[];
}

const OPTIONS = COURSE_SORT_OPTIONS.map(({ label, value }) => [
  {
    label: label + ' (A-Z)',
    value: value + ',1',
  },
  {
    label: label + ' (Z-A)',
    value: value + ',-1',
  },
]).flat();

const CourseSearchSort: React.FC = () => {
  const { loadData, sortBy, sortOrder } = useCourseContext();

  const methods: UseFormReturn<SortFieldValues> = useForm<SortFieldValues>({
    mode: 'onBlur',
    defaultValues: {
      sort: [sortBy + ',' + sortOrder],
    },
  });

  useUpdatedValue([sortBy, sortOrder], () => {
    setTimeout(() => {
      methods.setValue('sort', [sortBy + ',' + sortOrder]);
    });
  });

  return (
    <Form
      methods={methods}
      className={styles.sortForm}
      aria-label='Sort courses'
      role='search'
    >
      <Dropdown<SortFieldValues>
        name='sort'
        className={styles.sortByDropdown}
        onChange={(values) => {
          const [sortBy, sortOrder] = values[0].toString().split(',');
          loadData(undefined, extractCourseSortConfig({ sortBy, sortOrder }));
        }}
        searchable={false}
        clearable={false}
        radioMode
        closeOnSelect
        showInputAsText
        options={OPTIONS}
      />
    </Form>
  );
};

export default CourseSearchSort;
