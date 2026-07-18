import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseDetailsProps } from '@/app/interfaces/Course';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('../../CourseDetailsMiddleBanner/CourseDetailsMiddleBanner', () => ({
  __esModule: true,
  default: () => <div data-testid='middle-banner'>Middle Banner</div>,
}));

jest.mock('../../../ApplyNowPopup/ApplyNowPopup', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div data-testid='apply-now-popup'>
        <button type='button' onClick={onClose}>
          Close Apply Now
        </button>
      </div>
    ) : null,
}));

const mockCourseData: CourseDetailsProps = {
  CourseId: 'course-1',
  InstitutionName: 'Test University',
  Title: 'Master of Data Science',
  Subtitle: 'Advanced analytics program',
  Description: 'Learn data science fundamentals.',
  InstitutionLogoUrl: 'https://example.com/logo.png',
  Overview: 'Overview content',
  Structure: 'Structure content',
  EntryRequirements: 'Entry requirements',
  TuitionsAndFees: 'Fee details',
  CareerOpportunities: 'Career paths',
  PreviousCredits: 'Credit info',
  KeyCodes: 'CRICOS123',
  AboutUniversity: 'About the uni',
  FAQS: 'FAQ content',
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

import CourseDetailsTopBanner from '../CourseDetailsTopBanner';
import { __mockContext as MockContext } from '@/app/utilities/course/CourseDetailsProvider';

const renderWithContext = (data: CourseDetailsProps | undefined = mockCourseData) =>
  render(
    <MockContext.Provider value={{ data }}>
      <CourseDetailsTopBanner />
    </MockContext.Provider>,
  );

describe('CourseDetailsTopBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders institution name, title, subtitle, and description', () => {
    renderWithContext();

    expect(screen.getByText('Test University')).toBeInTheDocument();
    expect(screen.getByText('Master of Data Science')).toBeInTheDocument();
    expect(screen.getByText('Advanced analytics program')).toBeInTheDocument();
    expect(screen.getByText('Learn data science fundamentals.')).toBeInTheDocument();
  });

  it('renders institution logo when InstitutionLogoUrl is provided', () => {
    renderWithContext();

    const logo = screen.getByAltText('logo');
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
    expect(logo).toHaveAttribute('width', '80');
    expect(logo).toHaveAttribute('height', '80');
  });

  it('renders fallback navbar logo when InstitutionLogoUrl is missing', () => {
    renderWithContext({
      ...mockCourseData,
      InstitutionLogoUrl: undefined as unknown as string,
    });

    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('renders admissions copy and Apply Now button', () => {
    renderWithContext();

    expect(screen.getByText('2026 Admissions are open now')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument();
  });

  it('opens Apply Now popup when Apply Now is clicked', async () => {
    const user = userEvent.setup();
    renderWithContext();

    expect(screen.queryByTestId('apply-now-popup')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /apply now/i }));

    expect(screen.getByTestId('apply-now-popup')).toBeInTheDocument();
  });

  it('renders the middle banner section', () => {
    renderWithContext();

    expect(screen.getByTestId('middle-banner')).toBeInTheDocument();
  });
});
