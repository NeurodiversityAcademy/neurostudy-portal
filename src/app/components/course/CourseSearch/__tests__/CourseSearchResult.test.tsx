import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockLoadData = jest.fn();

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { priority, fill, quality, ...rest } = props;
    return <img {...rest} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('@/app/utilities/course/CourseProvider', () => ({
  useCourseContext: jest.fn(),
}));

jest.mock('../CourseSearchSort', () => ({
  __esModule: true,
  default: () => <div data-testid='course-search-sort'>Sort</div>,
}));

jest.mock('../../CourseCard', () => ({
  __esModule: true,
  default: ({ course }: { course: { Title: string; CourseId: string } }) => (
    <li data-testid='course-card'>{course.Title}</li>
  ),
}));

import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import CourseSearchResult from '../CourseSearchResult';
import { CourseProps } from '@/app/interfaces/Course';

const makeCourse = (overrides: Partial<CourseProps> = {}): CourseProps =>
  ({
    CourseId: 'course-1',
    Title: 'Bachelor of Science',
    InstitutionName: 'Test University',
    ...overrides,
  }) as CourseProps;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CourseSearchResult', () => {
  it('renders course count header and sort when data is present', () => {
    (useCourseContext as jest.Mock).mockReturnValue({
      data: [makeCourse(), makeCourse({ CourseId: 'course-2', Title: 'Arts' })],
      isLoading: false,
      loadData: mockLoadData,
    });

    render(<CourseSearchResult />);

    expect(screen.getByText('2 Courses Found')).toBeInTheDocument();
    expect(screen.getByTestId('course-search-sort')).toBeInTheDocument();
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
    expect(screen.getByText('Arts')).toBeInTheDocument();
  });

  it('uses singular Course when one result', () => {
    (useCourseContext as jest.Mock).mockReturnValue({
      data: [makeCourse()],
      isLoading: false,
      loadData: mockLoadData,
    });

    render(<CourseSearchResult />);
    expect(screen.getByText('1 Course Found')).toBeInTheDocument();
  });

  it('renders empty state when data is an empty array', () => {
    (useCourseContext as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      loadData: mockLoadData,
    });

    render(<CourseSearchResult />);
    expect(
      screen.getByText('Sorry, there are no results for the applied filter(s).'),
    ).toBeInTheDocument();
  });

  it('renders error state when data is undefined', () => {
    (useCourseContext as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      loadData: mockLoadData,
    });

    render(<CourseSearchResult />);
    expect(screen.getByText('Failed to fetch the list of courses.')).toBeInTheDocument();
  });

  it('calls loadData when try again is clicked in error state', () => {
    (useCourseContext as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      loadData: mockLoadData,
    });

    render(<CourseSearchResult />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockLoadData).toHaveBeenCalled();
  });

  it('does not render header when data is undefined', () => {
    (useCourseContext as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      loadData: mockLoadData,
    });

    render(<CourseSearchResult />);
    expect(screen.queryByText(/Course Found/)).not.toBeInTheDocument();
  });
});
