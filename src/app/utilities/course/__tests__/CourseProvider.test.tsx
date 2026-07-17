import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CourseProps } from '@/app/interfaces/Course';
import { DEFAULT_COURSE } from '@/app/utilities/db/constants';

const mockPush = jest.fn();
const mockReplace = jest.fn();

let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock('@/app/utilities/common', () => ({
  ...jest.requireActual('@/app/utilities/common'),
  debounce: <T extends (...args: unknown[]) => void>(fn: T) => fn,
}));

import CourseProvider, { useCourseContext } from '../CourseProvider';

const makeCourse = (overrides: Partial<CourseProps> = {}): CourseProps => ({
  ...DEFAULT_COURSE,
  CourseId: `course-${Math.random()}`,
  ...overrides,
});

const sampleCourses: CourseProps[] = [
  makeCourse({ Title: 'Alpha Course', InstitutionName: 'Uni A', Rating: 4.5 }),
  makeCourse({ Title: 'Beta Course', InstitutionName: 'Uni B', Rating: 3.2 }),
];

const wrapper =
  (props: { data?: CourseProps[]; redirectToSearchPage?: boolean } = {}) =>
  ({ children }: { children: React.ReactNode }) =>
    (
      <CourseProvider data={props.data} redirectToSearchPage={props.redirectToSearchPage}>
        {children}
      </CourseProvider>
    );

const setWindowLocation = (pathname: string, search = '') => {
  window.history.pushState({}, '', `${pathname}${search}`);
};

describe('CourseProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    setWindowLocation('/', '');
  });

  it('throws when useCourseContext is used outside the provider', () => {
    expect(() => renderHook(() => useCourseContext())).toThrow(
      'deviseContext()[1](derivative of `useContext`) does not have proper context.'
    );
  });

  it('exposes sorted and filtered course data', () => {
    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses }),
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.sortBy).toBe('Title');
    expect(result.current.sortOrder).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns undefined data when no courses are provided', () => {
    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper(),
    });

    expect(result.current.data).toBeUndefined();
  });

  it('derives filter values from search params', () => {
    mockSearchParams = new URLSearchParams('Neurotypes=Autism&Neurotypes=ADHD');

    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses }),
    });

    expect(result.current.filter.Neurotypes).toEqual(['Autism', 'ADHD']);
  });

  it('loadData navigates when the URL does not match', async () => {
    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses, redirectToSearchPage: true }),
    });

    await act(async () => {
      await result.current.loadData({ Location: ['Sydney'] });
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/courses'),
      { scroll: false }
    );
    expect(result.current.isLoading).toBe(true);
  });

  it('loadData replaces the URL when filters are unchanged', async () => {
    setWindowLocation('/courses', '?');

    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses, redirectToSearchPage: true }),
    });

    await act(async () => {
      await result.current.loadData();
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('&_='),
      { scroll: false }
    );
  });

  it('loadData stops loading when URL already matches and filter is passed', async () => {
    setWindowLocation('/', '?');

    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses }),
    });

    await act(async () => {
      await result.current.loadData({ Location: ['Melbourne'] });
    });

    expect(mockPush).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(true);
  });

  it('loadData stops loading when the current URL already matches with a filter', async () => {
    mockSearchParams = new URLSearchParams('Location=Sydney');
    setWindowLocation('/courses', '?Location=Sydney');

    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses, redirectToSearchPage: true }),
    });

    await act(async () => {
      await result.current.loadData({ Location: ['Sydney'] });
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('updateFilter merges pending filters into subsequent loadData calls', async () => {
    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses }),
    });

    act(() => {
      result.current.updateFilter({ Level: ['MASTERS'] });
    });

    await act(async () => {
      await result.current.loadData({ Location: ['Sydney'] });
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('Location'),
      { scroll: false }
    );
  });

  it('clears loading when data prop changes', async () => {
    const StatefulWrapper = ({ children }: { children: React.ReactNode }) => {
      const [courses, setCourses] = React.useState(sampleCourses);

      React.useEffect(() => {
        setCourses([
          ...sampleCourses,
          makeCourse({ Title: 'Gamma Course' }),
        ]);
      }, []);

      return <CourseProvider data={courses}>{children}</CourseProvider>;
    };

    const { result } = renderHook(() => useCourseContext(), {
      wrapper: StatefulWrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(3);
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('sets loading on popstate events', () => {
    const { result } = renderHook(() => useCourseContext(), {
      wrapper: wrapper({ data: sampleCourses }),
    });

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.isLoading).toBe(true);
  });
});
