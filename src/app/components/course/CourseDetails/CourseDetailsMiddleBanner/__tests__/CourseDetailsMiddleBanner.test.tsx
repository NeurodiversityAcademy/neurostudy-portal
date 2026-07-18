import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

import CourseDetailsMiddleBanner from '../CourseDetailsMiddleBanner';
import CourseDetailsProvider from '@/app/utilities/course/CourseDetailsProvider';
import { DEFAULT_COURSE_DETAILS } from '@/app/utilities/db/constants';

const courseData = {
  ...DEFAULT_COURSE_DETAILS,
  Mode: 'Online',
  Duration: 24,
  ApplicationEnd: 'Dec 2026',
  Subjects: '12',
  Fees: '$5,000',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CourseDetailsProvider data={courseData}>{children}</CourseDetailsProvider>
);

describe('CourseDetailsMiddleBanner', () => {
  it('renders course detail icons with data from context', () => {
    render(<CourseDetailsMiddleBanner />, { wrapper });

    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('2 Years')).toBeInTheDocument();
    expect(screen.getByText('Dec 2026')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Application End')).toBeInTheDocument();
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Fees')).toBeInTheDocument();
  });
});
