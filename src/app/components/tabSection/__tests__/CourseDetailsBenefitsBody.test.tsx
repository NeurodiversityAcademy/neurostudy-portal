import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/app/components/accordion/Accordian', () => require('@/testUtils/mockAccordion'));

jest.mock('@/app/utilities/course/CourseDetailsProvider', () => {
  const React = require('react');
  const ctx = React.createContext(undefined);
  return {
    __esModule: true,
    default: ({ children, data }: { children: React.ReactNode; data: unknown }) => (
      <ctx.Provider value={{ data, isLoading: false }}>{children}</ctx.Provider>
    ),
    useCourseDetailsContext: () => React.useContext(ctx),
  };
});

import CourseDetailsProvider from '@/app/utilities/course/CourseDetailsProvider';
import CourseDetailsBenefitsBody from '../CourseDetailsBenefitsBody';
import type { CourseDetailsProps } from '@/app/interfaces/Course';

const makeCourseData = (overrides: Partial<CourseDetailsProps> = {}): CourseDetailsProps =>
  ({
    SupportAvailable: ['PeerMentoring', 'CounsellingServices'],
    AdjustmentsAvailable: {
      AssessmentAdjustments: ['ExtendedTime'],
      LearningDeliveryAdjustments: ['RecordedLectures'],
    },
    PossibleJobRequirement: {
      SoftwareEngineer: {
        requirements: {
          technical: {
            Programming: 'Required',
          },
        },
      },
    },
    ...overrides,
  }) as CourseDetailsProps;

const renderWithData = (source: 'support' | 'adjustment' | 'jobs', data?: CourseDetailsProps) =>
  render(
    <CourseDetailsProvider data={data ?? makeCourseData()}>
      <CourseDetailsBenefitsBody source={source} />
    </CourseDetailsProvider>,
  );

describe('CourseDetailsBenefitsBody', () => {
  it('returns null when course data is missing', () => {
    const { container } = render(
      <CourseDetailsProvider data={undefined}>
        <CourseDetailsBenefitsBody source='support' />
      </CourseDetailsProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders support available items with prettified labels', () => {
    renderWithData('support');
    expect(screen.getByText('Peer Mentoring')).toBeInTheDocument();
    expect(screen.getByText('Counselling Services')).toBeInTheDocument();
  });

  it('renders adjustment accordion categories and items', () => {
    renderWithData('adjustment');
    expect(screen.getByText('Assessment Adjustments')).toBeInTheDocument();
    expect(screen.getByText('Learning Delivery Adjustments')).toBeInTheDocument();
    expect(screen.getByText('Extended Time')).toBeInTheDocument();
    expect(screen.getByText('Recorded Lectures')).toBeInTheDocument();
  });

  it('renders job requirements accordion with requirement levels', () => {
    renderWithData('jobs');
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText(/Programming/)).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
