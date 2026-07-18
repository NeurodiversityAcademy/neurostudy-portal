import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

const mockLoadData = jest.fn();

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
  default: ({ name, label }: { name: string; label: string }) => (
    <div data-testid={`dropdown-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} aria-label={label} />
    </div>
  ),
}));

import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import CourseSecondaryFilter from '../index';

beforeEach(() => {
  jest.clearAllMocks();
  (useCourseContext as jest.Mock).mockReturnValue({
    filter: {
      Level: [],
      InstitutionName: [],
      Mode: [],
    },
    loadData: mockLoadData,
  });
});

describe('CourseSecondaryFilter', () => {
  it('renders Filters heading and secondary dropdowns', () => {
    render(<CourseSecondaryFilter />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Study Level')).toBeInTheDocument();
    expect(screen.getByLabelText('Institution')).toBeInTheDocument();
    expect(screen.getByLabelText('Study Method')).toBeInTheDocument();
  });

  it('has search role', () => {
    render(<CourseSecondaryFilter />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('calls loadData with current filter values on submit', async () => {
    render(<CourseSecondaryFilter />);

    await act(async () => {
      fireEvent.submit(screen.getByRole('search'));
    });

    expect(mockLoadData).toHaveBeenCalledWith(
      expect.objectContaining({
        Level: [],
        InstitutionName: [],
        Mode: [],
      }),
    );
  });
});
