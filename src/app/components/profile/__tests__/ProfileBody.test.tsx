import React, { forwardRef, useImperativeHandle } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

jest.mock('@/app/hooks/useHideOverflowEffect', () => ({
  __esModule: true,
  default: () => () => () => {},
}));

const mockSaveData = jest.fn();
const mockTrigger = jest.fn();
const mockGetValues = jest.fn();

const mockProfileContext = {
  data: {
    FirstName: 'John',
    LastName: 'Doe',
    Email: 'john@example.com',
    Age: 25,
  },
  isLoading: false,
  isEditing: false,
  saveData: mockSaveData,
  courses: [],
};

jest.mock('@/app/utilities/profile/ProfileProvider', () => ({
  useProfileContext: () => mockProfileContext,
}));

type SectionMockProps = {
  onSectionEdit?: React.MouseEventHandler<HTMLButtonElement>;
  popup?: boolean;
  onSubmit?: (data: unknown) => void;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
};

const createSectionMock = (testId: string) =>
  forwardRef<unknown, SectionMockProps>(({ onSectionEdit, popup, onSubmit, onCancel }, ref) => {
    useImperativeHandle(ref, () => ({
      methods: {
        trigger: mockTrigger,
        getValues: mockGetValues,
      },
    }));

    if (popup) {
      return (
        <div data-testid={`${testId}-popup`}>
          <button type='button' onClick={() => onSubmit?.({ saved: testId })}>
            Submit {testId}
          </button>
          <button type='button' onClick={onCancel}>
            Cancel {testId}
          </button>
        </div>
      );
    }

    return (
      <div data-testid={testId}>
        {onSectionEdit && (
          <button type='button' onClick={onSectionEdit}>
            Edit {testId}
          </button>
        )}
      </div>
    );
  });

jest.mock('../ProfileBodyHeader', () => ({
  __esModule: true,
  default: () => <div data-testid='profile-body-header'>Header</div>,
}));

jest.mock('../ProfileCourses', () => ({
  __esModule: true,
  default: () => <div data-testid='profile-courses'>Courses</div>,
}));

jest.mock('../ProfileInfoSection', () => ({
  __esModule: true,
  default: createSectionMock('info-section'),
}));

jest.mock('../ProfilePreferenceSection', () => ({
  __esModule: true,
  default: createSectionMock('preference-section'),
}));

jest.mock('../ProfileChallengeSection', () => ({
  __esModule: true,
  default: createSectionMock('challenge-section'),
}));

jest.mock('../ProfileGoalSection', () => ({
  __esModule: true,
  default: createSectionMock('goal-section'),
}));

jest.mock('../ProfileStrategySection', () => ({
  __esModule: true,
  default: createSectionMock('strategy-section'),
}));

import ProfileBody from '../ProfileBody';

describe('ProfileBody', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    mockProfileContext.isEditing = false;
    mockTrigger.mockResolvedValue(true);
    mockGetValues.mockReturnValue({ field: 'value' });
    mockSaveData.mockImplementation((_data, callback) => callback?.());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders header, courses, and all profile sections', () => {
    render(<ProfileBody />);
    expect(screen.getByTestId('profile-body-header')).toBeInTheDocument();
    expect(screen.getByTestId('profile-courses')).toBeInTheDocument();
    expect(screen.getByTestId('preference-section')).toBeInTheDocument();
    expect(screen.getByTestId('challenge-section')).toBeInTheDocument();
    expect(screen.getByTestId('goal-section')).toBeInTheDocument();
    expect(screen.getByTestId('strategy-section')).toBeInTheDocument();
  });

  it('hides info section and footer when not editing', () => {
    render(<ProfileBody />);
    expect(screen.queryByTestId('info-section')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('shows info section and footer when editing', () => {
    mockProfileContext.isEditing = true;
    render(<ProfileBody />);
    expect(screen.getByTestId('info-section')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('navigates to /profile when Cancel is clicked while editing', () => {
    mockProfileContext.isEditing = true;
    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });

  it('opens preference popup when preference section edit is clicked', () => {
    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Edit preference-section'));
    expect(screen.getByTestId('preference-section-popup')).toBeInTheDocument();
  });

  it('opens goal popup when goal section edit is clicked', () => {
    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Edit goal-section'));
    expect(screen.getByTestId('goal-section-popup')).toBeInTheDocument();
  });

  it('opens challenge popup when challenge section edit is clicked', () => {
    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Edit challenge-section'));
    expect(screen.getByTestId('challenge-section-popup')).toBeInTheDocument();
  });

  it('opens strategy popup when strategy section edit is clicked', () => {
    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Edit strategy-section'));
    expect(screen.getByTestId('strategy-section-popup')).toBeInTheDocument();
  });

  it('closes popup when cancel is clicked inside popup', () => {
    jest.useFakeTimers();
    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Edit goal-section'));
    expect(screen.getByTestId('goal-section-popup')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel goal-section'));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.queryByTestId('goal-section-popup')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('saves section data and closes popup on section submit', () => {
    jest.useFakeTimers();
    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Edit preference-section'));
    fireEvent.click(screen.getByText('Submit preference-section'));
    expect(mockSaveData).toHaveBeenCalledWith(
      { saved: 'preference-section' },
      expect.any(Function),
    );
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.queryByTestId('preference-section-popup')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('saves aggregated form data when Save is clicked while editing', async () => {
    mockProfileContext.isEditing = true;
    mockGetValues
      .mockReturnValueOnce({ FirstName: 'John' })
      .mockReturnValueOnce({ Goals: ['Get a Job'] })
      .mockReturnValueOnce({ Comforts: ['Reading'] })
      .mockReturnValueOnce({ Goals: ['Get a Job'] })
      .mockReturnValueOnce({ Strategies: ['Focus'] });

    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockTrigger).toHaveBeenCalled();
    });
    expect(mockSaveData).toHaveBeenCalledWith(
      expect.objectContaining({
        FirstName: 'John',
        Goals: ['Get a Job'],
        Comforts: ['Reading'],
        Strategies: ['Focus'],
      }),
    );
  });

  it('does not save when form validation fails', async () => {
    mockProfileContext.isEditing = true;
    mockTrigger.mockResolvedValueOnce(false);

    render(<ProfileBody />);
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockTrigger).toHaveBeenCalled();
    });
    expect(mockSaveData).not.toHaveBeenCalled();
  });
});
