import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockLoadData = jest.fn();

jest.mock('@/app/hooks/useUpdatedValue', () => ({
  __esModule: true,
  default: jest.fn((_dep: unknown, fn: () => unknown) => fn()),
}));

jest.mock('@/app/utilities/course/CourseProvider', () => ({
  useCourseContext: jest.fn(),
}));

jest.mock('../../../formElements/Dropdown/Dropdown', () => ({
  __esModule: true,
  default: ({ name, onChange }: { name: string; onChange?: (values: string[]) => void }) => (
    <select
      aria-label='Sort courses dropdown'
      data-testid={`dropdown-${name}`}
      onChange={(event) => onChange?.([event.target.value])}
    >
      <option value='Rating,-1'>Rating (Z-A)</option>
      <option value='Title,1'>Title (A-Z)</option>
    </select>
  ),
}));

import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import CourseSearchSort from '../CourseSearchSort';

beforeEach(() => {
  jest.clearAllMocks();
  (useCourseContext as jest.Mock).mockReturnValue({
    loadData: mockLoadData,
    sortBy: 'Rating',
    sortOrder: -1,
  });
});

describe('CourseSearchSort', () => {
  it('renders sort form with aria label', () => {
    render(<CourseSearchSort />);
    expect(screen.getByRole('search')).toHaveAttribute('aria-label', 'Sort courses');
  });

  it('calls loadData with sort config when selection changes', () => {
    render(<CourseSearchSort />);

    fireEvent.change(screen.getByTestId('dropdown-sort'), {
      target: { value: 'Title,1' },
    });

    expect(mockLoadData).toHaveBeenCalledWith(undefined, {
      sortBy: 'Title',
      sortOrder: 1,
    });
  });
});
