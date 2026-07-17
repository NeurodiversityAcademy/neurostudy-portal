import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';

import CourseDetailsProvider, {
  useCourseDetailsContext,
} from '../CourseDetailsProvider';
import { DEFAULT_COURSE_DETAILS } from '@/app/utilities/db/constants';

const courseData = {
  ...DEFAULT_COURSE_DETAILS,
  Title: 'Test Course',
};

const wrapper =
  (data: typeof courseData | undefined = courseData) =>
  ({ children }: { children: React.ReactNode }) =>
    (
      <CourseDetailsProvider data={data}>{children}</CourseDetailsProvider>
    );

describe('CourseDetailsProvider', () => {
  it('throws when useCourseDetailsContext is used outside the provider', () => {
    expect(() => renderHook(() => useCourseDetailsContext())).toThrow(
      'deviseContext()[1](derivative of `useContext`) does not have proper context.',
    );
  });

  it('exposes course details data and loading state', () => {
    const { result } = renderHook(() => useCourseDetailsContext(), {
      wrapper: wrapper(),
    });

    expect(result.current.data?.Title).toBe('Test Course');
    expect(result.current.isLoading).toBe(false);
  });

  it('sets loading on popstate events', () => {
    const { result } = renderHook(() => useCourseDetailsContext(), {
      wrapper: wrapper(),
    });

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('clears loading when data prop changes', async () => {
    const StatefulWrapper = ({ children }: { children: React.ReactNode }) => {
      const [data, setData] = React.useState(courseData);

      React.useEffect(() => {
        setData({ ...courseData, Title: 'Updated Course' });
      }, []);

      return (
        <CourseDetailsProvider data={data}>{children}</CourseDetailsProvider>
      );
    };

    const { result } = renderHook(() => useCourseDetailsContext(), {
      wrapper: StatefulWrapper,
    });

    await waitFor(() => {
      expect(result.current.data?.Title).toBe('Updated Course');
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('handles undefined course data', () => {
    const undefinedWrapper = ({ children }: { children: React.ReactNode }) => (
      <CourseDetailsProvider data={undefined}>{children}</CourseDetailsProvider>
    );

    const { result } = renderHook(() => useCourseDetailsContext(), {
      wrapper: undefinedWrapper,
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
