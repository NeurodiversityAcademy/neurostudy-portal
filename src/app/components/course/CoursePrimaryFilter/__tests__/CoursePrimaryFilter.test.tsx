import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockUpdateFilter = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('@/app/hooks/useUpdatedValue', () => ({
  __esModule: true,
  default: jest.fn((_dep: unknown, fn: () => unknown) => fn()),
}));

jest.mock('@/app/utilities/course/CourseProvider', () => ({
  useCourseContext: jest.fn(),
}));

jest.mock('../../../formElements/Dropdown/Dropdown', () => ({
  __esModule: true,
  default: ({
    name,
    label,
  }: {
    name: string;
    label: string;
  }) => (
    <div data-testid={`dropdown-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} aria-label={label} />
    </div>
  ),
}));

import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import CoursePrimaryFilter from '../index';

beforeEach(() => {
  jest.clearAllMocks();
  (useCourseContext as jest.Mock).mockReturnValue({
    isLoading: false,
    filter: {
      Neurotypes: [],
      InterestArea: [],
      Location: [],
    },
    updateFilter: mockUpdateFilter,
  });
});

describe('CoursePrimaryFilter', () => {
  it('renders primary filter dropdowns and search button', () => {
    render(<CoursePrimaryFilter />);

    expect(
      screen.getByLabelText('What is your neurotype?'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('What do you want to study?'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Where do you want to study?'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('has search role and aria label', () => {
    render(<CoursePrimaryFilter />);
    expect(screen.getByRole('search')).toHaveAttribute(
      'aria-label',
      'Primary search criteria',
    );
  });

  it('disables search button when loading', () => {
    (useCourseContext as jest.Mock).mockReturnValue({
      isLoading: true,
      filter: { Neurotypes: [], InterestArea: [], Location: [] },
      updateFilter: mockUpdateFilter,
    });

    render(<CoursePrimaryFilter />);
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
  });

  it('navigates to /courses when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<CoursePrimaryFilter />);
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockPush).toHaveBeenCalledWith('/courses');
  });
});
