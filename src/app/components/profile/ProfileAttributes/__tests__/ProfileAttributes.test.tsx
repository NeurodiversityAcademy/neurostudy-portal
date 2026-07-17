import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CHALLENGE_FIELDS,
  GOAL_FIELDS,
  PREFERENCE_FIELDS,
  STRATEGY_FIELDS,
} from '@/app/utilities/profile/constants';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockProfileContext = {
  data: undefined as Record<string, unknown> | undefined,
  isLoading: false,
  isEditing: false,
  saveData: jest.fn(),
  courses: [],
};

jest.mock('@/app/utilities/profile/ProfileProvider', () => ({
  useProfileContext: () => mockProfileContext,
}));

import ProfileAttributes from '../index';

describe('ProfileAttributes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileContext.data = undefined;
  });

  it('returns null when profile data becomes undefined', () => {
    mockProfileContext.data = {
      Goals: ['Get a Job'],
      Interests: [],
      Contents: [],
    };
    const { container, rerender } = render(
      <ProfileAttributes fields={GOAL_FIELDS} />,
    );
    expect(screen.getByText('Get a Job')).toBeInTheDocument();

    mockProfileContext.data = undefined;
    rerender(<ProfileAttributes fields={GOAL_FIELDS} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders populated goal attributes with labels', () => {
    mockProfileContext.data = {
      Goals: ['Get a Job'],
      Interests: ['Carpentry'],
      Contents: ['Video'],
    };
    render(<ProfileAttributes fields={GOAL_FIELDS} />);
    expect(screen.getByText('Learning Goals')).toBeInTheDocument();
    expect(screen.getByText('Get a Job')).toBeInTheDocument();
    expect(screen.getByText('Topics of Interest')).toBeInTheDocument();
    expect(screen.getByText('Carpentry')).toBeInTheDocument();
    expect(screen.getByText('Most Engaging Content')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();
  });

  it('renders empty goal section with add button', () => {
    mockProfileContext.data = {
      Goals: [],
      Interests: [],
      Contents: [],
    };
    render(
      <ProfileAttributes
        fields={GOAL_FIELDS}
        onSectionEdit={jest.fn()}
      />,
    );
    expect(screen.getByText('Answer few questions')).toBeInTheDocument();
    expect(
      screen.getByText('Tell us about your Goals & Interests'),
    ).toBeInTheDocument();
    expect(screen.getByText('Goals & Interests')).toBeInTheDocument();
  });

  it('calls onSectionEdit when empty-state add button is clicked', () => {
    const onSectionEdit = jest.fn();
    mockProfileContext.data = {
      Goals: [],
      Interests: [],
      Contents: [],
    };
    render(
      <ProfileAttributes fields={GOAL_FIELDS} onSectionEdit={onSectionEdit} />,
    );
    fireEvent.click(screen.getByText('Goals & Interests'));
    expect(onSectionEdit).toHaveBeenCalledTimes(1);
  });

  it('renders empty preference section copy', () => {
    mockProfileContext.data = {
      Conditions: [],
      Institutions: [],
      LearningStyle: [],
      Adjustments: [],
      UsedTools: [],
      EnvDescription: '',
    };
    render(<ProfileAttributes fields={PREFERENCE_FIELDS} />);
    expect(
      screen.getByText('Tell us about your Neuro Condition & Learning Preferences'),
    ).toBeInTheDocument();
    expect(screen.getByText('Learning Preferences')).toBeInTheDocument();
  });

  it('renders empty challenge section copy', () => {
    mockProfileContext.data = {
      Comforts: [],
      Struggles: [],
      Challenges: [],
    };
    render(<ProfileAttributes fields={CHALLENGE_FIELDS} />);
    expect(
      screen.getByText('Tell us about your Comfort & Challenges'),
    ).toBeInTheDocument();
    expect(screen.getByText('Comfort & Challenges')).toBeInTheDocument();
  });

  it('renders empty strategy section copy', () => {
    mockProfileContext.data = {
      Strategies: [],
      ManagingWays: [],
      FocusAids: undefined,
      MeetNDLearners: undefined,
      EffectiveStrategy: '',
    };
    render(<ProfileAttributes fields={STRATEGY_FIELDS} />);
    expect(screen.getByText('Tell us about your Strategies')).toBeInTheDocument();
    expect(screen.getByText('Strategies')).toBeInTheDocument();
  });

  it('renders boolean strategy fields as Yes/No', () => {
    mockProfileContext.data = {
      Strategies: ['Focused Learning'],
      ManagingWays: ['Breaks'],
      FocusAids: true,
      MeetNDLearners: false,
      EffectiveStrategy: 'Morning study',
    };
    render(<ProfileAttributes fields={STRATEGY_FIELDS} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Morning study')).toBeInTheDocument();
  });

  it('uses empty string label for unmapped field keys', () => {
    mockProfileContext.data = {
      Goals: ['Get a Job'],
      Interests: [],
      Contents: [],
      UnknownField: 'value',
    };
    render(<ProfileAttributes fields={GOAL_FIELDS} />);
    expect(screen.getByText('Get a Job')).toBeInTheDocument();
  });
});
