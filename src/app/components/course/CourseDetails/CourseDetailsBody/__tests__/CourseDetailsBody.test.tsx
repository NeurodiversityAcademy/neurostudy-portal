import React from 'react';
import { render, screen } from '@testing-library/react';
import { CourseDetailsProps } from '@/app/interfaces/Course';

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
}));

const mockCourseData: CourseDetailsProps = {
  CourseId: 'course-1',
  InstitutionName: 'Test University',
  Title: 'Master of Data Science',
  Subtitle: 'Advanced analytics',
  Description: 'Course description',
  InstitutionLogoUrl: 'https://example.com/logo.png',
  Overview: 'Overview paragraph',
  Structure: 'Structure paragraph',
  EntryRequirements: 'Entry requirements text',
  TuitionsAndFees: 'Tuition info',
  CareerOpportunities: 'Career info',
  PreviousCredits: 'Credits info',
  KeyCodes: 'CRICOS123',
  AboutUniversity: 'University info',
  FAQS: 'FAQ info',
  Location: 'Sydney',
  Duration: 24,
  Rating: 4.5,
  Tier: 'GOLD',
  institutionLogoUrl: 'https://example.com/logo.png',
  Criteria: { Faculty: 4 },
  Level: 'MASTERS',
  InterestArea: 'Data Science',
  Mode: 'Online',
  Neurotypes: ['ADHD'],
  ApplicationEnd: 'Dec 2026',
  Subjects: '12',
  Fees: '$30,000',
  SupportAvailable: ['Tutoring'],
  AdjustmentsAvailable: {
    AssessmentAdjustments: ['Extra time'],
    LearningDeliveryAdjustments: ['Recorded lectures'],
    EnvironmentalAdjustments: ['Quiet rooms'],
  },
  PossibleJobRequirement: {},
};

jest.mock('@/app/utilities/course/CourseDetailsProvider', () => {
  const React = require('react');
  const ctx = React.createContext<{ data?: CourseDetailsProps } | undefined>(undefined);
  return {
    useCourseDetailsContext: () => React.useContext(ctx),
    __mockContext: ctx,
  };
});

jest.mock('../../../ApplyNowPopup/ApplyNowPopup', () => ({
  __esModule: true,
  default: () => null,
}));

import CourseDetailsBody from '../CourseDetailsBody';
import { __mockContext as MockContext } from '@/app/utilities/course/CourseDetailsProvider';

const renderWithContext = (data: CourseDetailsProps | undefined = mockCourseData) =>
  render(
    <MockContext.Provider value={{ data }}>
      <CourseDetailsBody />
    </MockContext.Provider>,
  );

describe('CourseDetailsBody', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders side navigation links for all course sections', () => {
    renderWithContext();

    expect(screen.getByRole('link', { name: 'Course Overview' })).toHaveAttribute(
      'href',
      '#courseOverview',
    );
    expect(screen.getByRole('link', { name: 'Course Structure' })).toHaveAttribute(
      'href',
      '#courseStructure',
    );
    expect(screen.getByRole('link', { name: 'Entry Requirements' })).toHaveAttribute(
      'href',
      '#entryRequirements',
    );
    expect(screen.getByRole('link', { name: 'Tuition & Fees' })).toHaveAttribute(
      'href',
      '#tuitionFees',
    );
    expect(screen.getByRole('link', { name: 'Career Opportunities' })).toHaveAttribute(
      'href',
      '#careerOpportunities',
    );
    expect(screen.getByRole('link', { name: 'Credits For Previous Study' })).toHaveAttribute(
      'href',
      '#creditForPreviousStudy',
    );
    expect(screen.getByRole('link', { name: 'Key Codes (Cricos)' })).toHaveAttribute(
      'href',
      '#keyCodes',
    );
    expect(screen.getByRole('link', { name: 'About the University' })).toHaveAttribute(
      'href',
      '#aboutUniversity',
    );
    expect(screen.getByRole('link', { name: 'FAQs' })).toHaveAttribute('href', '#faq');
  });

  it('renders section content from course data', () => {
    renderWithContext();

    expect(screen.getByText('Overview paragraph')).toBeInTheDocument();
    expect(screen.getByText('Structure paragraph')).toBeInTheDocument();
    expect(screen.getByText('Entry requirements text')).toBeInTheDocument();
    expect(screen.getByText('Tuition info')).toBeInTheDocument();
  });

  it('renders View Tuition Fees button in tuition section', () => {
    renderWithContext();

    expect(screen.getByRole('button', { name: /view tuition fees/i })).toBeInTheDocument();
  });

  it('renders navigation with apply now action', () => {
    renderWithContext();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument();
  });
});
