import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/courses',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { _priority, _fill, _quality, ...rest } = props;
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

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: jest.fn(),
  notifyAxiosError: jest.fn(),
  notifyInProgress: jest.fn(),
  notifySuccess: jest.fn(),
  formatDate: jest.fn(),
  debounce: jest.fn((fn: (...args: unknown[]) => void) => fn),
}));

jest.mock('@/app/utilities/queryString', () => ({
  __esModule: true,
  default: { parse: jest.fn(() => ({})), stringify: jest.fn(() => '?') },
}));

jest.mock('@/app/utilities/course/createCheckoutUrl', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/hooks/useUpdatedValue', () => ({
  __esModule: true,
  default: jest.fn((_dep: unknown, fn: () => unknown) => fn()),
}));

jest.mock('@/app/hooks/useHideOverflowEffect', () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock('@/app/utilities/sanitizeHtml', () => ({
  __esModule: true,
  sanitizeHtml: (html: string) => html ?? '',
}));

jest.mock('@/app/utilities/course/CourseDetailsProvider', () => {
  const React = require('react');
  const ctx = React.createContext(undefined);
  return {
    __esModule: true,
    default: ({ children, data }: { children: React.ReactNode; data: unknown }) => (
      <ctx.Provider value={{ data, isLoading: false }}>{children}</ctx.Provider>
    ),
    CourseDetailsContext: ctx,
    useCourseDetailsContext: () => React.useContext(ctx),
  };
});

import CourseCard from '../CourseCard';
import CourseRating from '../CourseCard/CourseRating';
import CourseCriterion from '../CourseCard/CourseCriterion';
import MoodleCourseCard from '../CourseCard/MoodleCourseCard';
import CourseSearchError from '../CourseSearch/CourseSearchError';
import CourseSearchEmpty from '../CourseSearch/CourseSearchEmpty';
import CourseEnrolPopup from '../CourseEnrolPrompt/CourseEnrolPopup';
import CourseBanner from '../CourseEnrolPrompt/CourseBanner';
import CourseDetails from '../CourseDetails';
import { CourseProps } from '@/app/interfaces/Course';
import { MoodleCourse } from '@/app/interfaces/Moodle';

beforeEach(() => {
  jest.clearAllMocks();
});

const makeCourse = (overrides: Partial<CourseProps> = {}): CourseProps => ({
  CourseId: 'course-1',
  InstitutionName: 'Test University',
  Title: 'Bachelor of Science',
  Location: 'Sydney, Australia',
  Duration: 36,
  Rating: 4.2,
  Tier: 'GOLD',
  InstitutionLogoUrl: 'https://example.com/logo.png',
  Criteria: { Faculty: 4 },
  Level: 'BACHELORS',
  InterestArea: 'Computer Science',
  Mode: 'Online',
  Neurotypes: ['ADHD'],
  institutionLogoUrl: 'https://example.com/logo.png',
  Overview: '',
  Structure: '',
  EntryRequirements: '',
  TuitionsAndFees: '',
  CareerOpportunities: '',
  PreviousCredits: '',
  KeyCodes: '',
  AboutUniversity: '',
  FAQS: '',
  Subtitle: '',
  Description: '',
  ApplicationEnd: '',
  Subjects: '',
  Fees: '',
  SupportAvailable: [''],
  AdjustmentsAvailable: {
    AssessmentAdjustments: [''],
    LearningDeliveryAdjustments: [''],
    EnvironmentalAdjustments: [''],
  },
  PossibleJobRequirement: {},
  ...overrides,
});

const makeMoodleCourse = (overrides: Partial<MoodleCourse> = {}): MoodleCourse => ({
  id: 1,
  href: 'https://moodle.example.com/course/1',
  shortname: 'ND101',
  fullname: 'Intro to Neurodiversity',
  idnumber: 'ND-101',
  visible: 1,
  startdate: 1700000000,
  enddate: 1710000000,
  ...overrides,
});

// ---------------------------------------------------------------------------
// CourseCard
// ---------------------------------------------------------------------------
describe('CourseCard', () => {
  it('renders course title', () => {
    render(<CourseCard course={makeCourse()} />);
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
  });

  it('renders institution name', () => {
    render(<CourseCard course={makeCourse()} />);
    expect(screen.getByText('Test University')).toBeInTheDocument();
  });

  it('renders location (first token from split)', () => {
    render(<CourseCard course={makeCourse()} />);
    expect(screen.getByText('Sydney')).toBeInTheDocument();
  });

  it('renders duration in years', () => {
    render(<CourseCard course={makeCourse({ Duration: 36 })} />);
    expect(screen.getByText('3 Years')).toBeInTheDocument();
  });

  it('renders singular year for 12 months', () => {
    render(<CourseCard course={makeCourse({ Duration: 12 })} />);
    expect(screen.getByText('1 Year')).toBeInTheDocument();
  });

  it('links to the correct course detail page', () => {
    render(<CourseCard course={makeCourse({ CourseId: 'abc' })} />);
    const link = screen.getByRole('listitem');
    expect(link).toHaveAttribute('href', '/courses/abc');
  });

  it('renders favourite button', () => {
    render(<CourseCard course={makeCourse()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('does not render duration when Duration is undefined', () => {
    render(<CourseCard course={makeCourse({ Duration: undefined as unknown as number })} />);
    expect(screen.queryByText(/Year/)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CourseRating
// ---------------------------------------------------------------------------
describe('CourseRating', () => {
  it('returns null when Rating is undefined', () => {
    const { container } = render(<CourseRating Rating={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the rating value', () => {
    render(<CourseRating Rating={4.2} />);
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('caps rating at MAX_COURSE_RATING (5)', () => {
    render(<CourseRating Rating={7} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('renders correct aria label for rating', () => {
    render(<CourseRating Rating={3.5} />);
    const imgEl = screen.getByLabelText(/3\.5/);
    expect(imgEl).toHaveAttribute('aria-label', 'Rating: 3.5 out of 5');
  });

  it('renders tier badge when valid tier is provided', () => {
    render(<CourseRating Rating={4} Tier='GOLD' />);
    expect(screen.getByText('GOLD')).toBeInTheDocument();
  });

  it('does not render tier badge when tier is invalid', () => {
    render(<CourseRating Rating={4} Tier='INVALID' />);
    expect(screen.queryByText('INVALID')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CourseCriterion
// ---------------------------------------------------------------------------
describe('CourseCriterion', () => {
  it('returns null when criterion is undefined', () => {
    const { container } = render(<CourseCriterion criterion={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders label text', () => {
    render(<CourseCriterion criterion={3} label='Faculty' />);
    expect(screen.getByText('Faculty')).toBeInTheDocument();
  });

  it('renders correct aria label', () => {
    render(<CourseCriterion criterion={4} label='Faculty' />);
    const imgEl = screen.getByRole('img');
    expect(imgEl).toHaveAttribute('aria-label', 'Rating: 4 out of 5');
  });

  it('caps criterion at MAX_CRITERION_RATING (5)', () => {
    render(<CourseCriterion criterion={8} label='Faculty' />);
    const imgEl = screen.getByRole('img');
    expect(imgEl).toHaveAttribute('aria-label', 'Rating: 5 out of 5');
  });
});

// ---------------------------------------------------------------------------
// MoodleCourseCard
// ---------------------------------------------------------------------------
describe('MoodleCourseCard', () => {
  it('renders course full name', () => {
    render(<MoodleCourseCard course={makeMoodleCourse()} />);
    expect(screen.getByText('Intro to Neurodiversity')).toBeInTheDocument();
  });

  it('renders institution as Neurodiversity Academy', () => {
    render(<MoodleCourseCard course={makeMoodleCourse()} />);
    expect(screen.getByText('Neurodiversity Academy')).toBeInTheDocument();
  });

  it('links to the moodle course href', () => {
    render(<MoodleCourseCard course={makeMoodleCourse()} />);
    const link = screen.getByRole('listitem');
    expect(link).toHaveAttribute('href', 'https://moodle.example.com/course/1');
  });

  it('renders favourite button', () => {
    render(<MoodleCourseCard course={makeMoodleCourse()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// CourseSearchError
// ---------------------------------------------------------------------------
describe('CourseSearchError', () => {
  it('renders error message', () => {
    render(<CourseSearchError reset={jest.fn()} />);
    expect(screen.getByText('Failed to fetch the list of courses.')).toBeInTheDocument();
  });

  it('renders try again button', () => {
    render(<CourseSearchError reset={jest.fn()} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls reset when try again is clicked', async () => {
    const reset = jest.fn();
    const user = userEvent.setup();
    render(<CourseSearchError reset={reset} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('has alert role for accessibility', () => {
    render(<CourseSearchError reset={jest.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CourseSearchEmpty
// ---------------------------------------------------------------------------
describe('CourseSearchEmpty', () => {
  it('renders the no-results message', () => {
    render(<CourseSearchEmpty />);
    expect(
      screen.getByText('Sorry, there are no results for the applied filter(s).'),
    ).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    render(<CourseSearchEmpty />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the no-courses image', () => {
    render(<CourseSearchEmpty />);
    expect(screen.getByAltText('No courses found.')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CourseEnrolPopup
// ---------------------------------------------------------------------------
describe('CourseEnrolPopup', () => {
  const defaultProps = {
    open: true,
    isLoading: false,
    onClose: jest.fn(),
    onRequestCheckout: jest.fn(),
  };

  it('renders Enrol Now button when open', () => {
    render(<CourseEnrolPopup {...defaultProps} />);
    expect(screen.getByRole('button', { name: /enrol now/i })).toBeInTheDocument();
  });

  it('disables button when isLoading is true', () => {
    render(<CourseEnrolPopup {...defaultProps} isLoading />);
    expect(screen.getByRole('button', { name: /enrol now/i })).toBeDisabled();
  });

  it('calls onRequestCheckout when Enrol Now is clicked', async () => {
    const onRequestCheckout = jest.fn();
    const user = userEvent.setup();
    render(<CourseEnrolPopup {...defaultProps} onRequestCheckout={onRequestCheckout} />);

    await user.click(screen.getByRole('button', { name: /enrol now/i }));
    expect(onRequestCheckout).toHaveBeenCalledTimes(1);
  });

  it('renders popup image', () => {
    render(<CourseEnrolPopup {...defaultProps} />);
    expect(
      screen.getByAltText('Introduction to Neurodiversity - Course Enrolment Popup'),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CourseBanner
// ---------------------------------------------------------------------------
describe('CourseBanner', () => {
  const defaultProps = {
    open: true,
    isLoading: false,
    onRequestCheckout: jest.fn(),
  };

  it('renders Enrol button', () => {
    render(<CourseBanner {...defaultProps} />);
    expect(screen.getByRole('button', { name: /enrol/i })).toBeInTheDocument();
  });

  it('disables button when isLoading', () => {
    render(<CourseBanner {...defaultProps} isLoading />);
    expect(screen.getByRole('button', { name: /enrol/i })).toBeDisabled();
  });

  it('calls onRequestCheckout on click', async () => {
    const onRequestCheckout = jest.fn();
    const user = userEvent.setup();
    render(<CourseBanner {...defaultProps} onRequestCheckout={onRequestCheckout} />);

    await user.click(screen.getByRole('button', { name: /enrol/i }));
    expect(onRequestCheckout).toHaveBeenCalledTimes(1);
  });

  it('renders course banner image', () => {
    render(<CourseBanner {...defaultProps} />);
    expect(screen.getByAltText('Neurodiversity Academy Course')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CourseDetails
// ---------------------------------------------------------------------------
describe('CourseDetails', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders loading state initially', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
    render(<CourseDetails id='test-id' />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders "Course not found" when API returns non-ok', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    }) as jest.Mock;

    render(<CourseDetails id='test-id' />);

    await waitFor(() => {
      expect(screen.getByText('Course not found')).toBeInTheDocument();
    });
  });

  it('renders "Course not found" when fetch throws', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error')) as jest.Mock;

    render(<CourseDetails id='test-id' />);

    await waitFor(() => {
      expect(screen.getByText('Course not found')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch course details:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});
